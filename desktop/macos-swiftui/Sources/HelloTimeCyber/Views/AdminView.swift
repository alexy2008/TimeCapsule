import SwiftUI

// MARK: - Admin View
// Mirrors AdminView.tsx: login form → capsule table with pagination + delete confirm.

struct AdminView: View {
    @Binding var nav: NavDestination
    var appState: AppState

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    @State private var password = ""
    @State private var loginError: String? = nil
    @State private var deleteTarget: String? = nil
    @State private var showDeleteConfirm = false
    @State private var appeared = false

    var body: some View {
        let palette = theme.palette(for: scheme)

        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header
                HStack(spacing: 16) {
                    BackButton { nav = .home }
                    Text("系统管理")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundStyle(palette.textPrimary)
                }

                if appState.isAdminLoggedIn {
                    dashboardPanel(palette: palette)
                } else {
                    loginPanel(palette: palette)
                }
            }
            .padding(.horizontal, 40)
            .padding(.bottom, 40)
            .padding(.top, 8)
        }
        .opacity(appeared ? 1 : 0)
        .offset(y: appeared ? 0 : 12)
        .onAppear {
            withAnimation(.easeOut(duration: 0.35)) { appeared = true }
            if appState.isAdminLoggedIn {
                Task { try? await appState.fetchAdminCapsules() }
            }
        }
        .sheet(isPresented: $showDeleteConfirm) {
            ConfirmDialogSheet(
                title: "确认删除",
                message: "确定要删除胶囊 \(deleteTarget ?? "") 吗？此操作不可恢复。"
            ) {
                showDeleteConfirm = false
                if let code = deleteTarget {
                    Task { try? await appState.deleteAdminCapsule(code: code) }
                }
            } onCancel: {
                showDeleteConfirm = false
            }
        }
    }

    // MARK: Login panel

    @ViewBuilder
    private func loginPanel(palette: CyberPalette) -> some View {
        GlassPanel(padding: 40, cornerRadius: 16) {
            VStack(spacing: 24) {
                Text("管理员登录")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundStyle(palette.textPrimary)

                VStack(alignment: .leading, spacing: 8) {
                    Text("管理员密码")
                        .font(CyberFont.formLabel)
                        .foregroundStyle(palette.textSecondary)

                    SecureField("", text: $password)
                        .textFieldStyle(.plain)
                        .font(CyberFont.mono(size: 18))
                        .multilineTextAlignment(.center)
                        .foregroundStyle(palette.textPrimary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(
                            RoundedRectangle(cornerRadius: 4)
                                .fill(palette.isDark ? Color(hex: 0x0A0F19).opacity(0.5) : Color.white.opacity(0.8))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 4)
                                        .stroke(palette.glassBorder, lineWidth: 1)
                                )
                        )
                        .onSubmit { Task { await doLogin() } }
                }

                if let err = loginError {
                    Text(err)
                        .font(CyberFont.sans(size: 13))
                        .foregroundStyle(palette.magenta)
                }

                GlowButton(
                    label: appState.isLoading ? "登录中..." : "登录",
                    variant: .primary,
                    isLoading: appState.isLoading
                ) {
                    Task { await doLogin() }
                }
                .frame(maxWidth: .infinity)
                .disabled(appState.isLoading || password.isEmpty)
            }
        }
        .frame(maxWidth: 460)
        .frame(maxWidth: .infinity)
    }

    // MARK: Dashboard panel

    @ViewBuilder
    private func dashboardPanel(palette: CyberPalette) -> some View {
        GlassPanel(padding: 24, cornerRadius: 16) {
            VStack(spacing: 0) {
                // Dashboard header
                HStack {
                    Text("胶囊列表")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(palette.textPrimary)

                    Spacer()

                    if appState.isLoading {
                        ProgressView().scaleEffect(0.7)
                    }

                    GlowButton(label: "退出登录", variant: .outline, isSmall: true) {
                        appState.adminLogout()
                    }
                }
                .padding(.bottom, 16)
                .overlay(
                    Rectangle().fill(palette.glassBorder).frame(height: 1),
                    alignment: .bottom
                )

                // Error
                if let err = appState.errorMessage {
                    Text(err)
                        .font(CyberFont.sans(size: 13))
                        .foregroundStyle(palette.magenta)
                        .padding(.vertical, 8)
                }

                // Table header
                AdminTableHeader(palette: palette)

                // Table rows
                if appState.adminCapsules.isEmpty && !appState.isLoading {
                    Text("暂无胶囊数据")
                        .font(CyberFont.cardBody)
                        .foregroundStyle(palette.textMuted)
                        .padding(.vertical, 40)
                        .frame(maxWidth: .infinity)
                } else {
                    ForEach(appState.adminCapsules) { capsule in
                        AdminTableRow(capsule: capsule, palette: palette) {
                            deleteTarget = capsule.code
                            showDeleteConfirm = true
                        }
                    }
                }

                // Pagination
                if let page = appState.adminPageInfo, page.totalPages > 1 {
                    HStack(spacing: 12) {
                        Spacer()
                        GlowButton(label: "上一页", variant: .outline, isSmall: true) {
                            Task { try? await appState.fetchAdminCapsules(page: max(0, page.number - 1)) }
                        }
                        .disabled(page.number == 0)

                        Text("\(page.number + 1) / \(page.totalPages)")
                            .font(CyberFont.mono(size: 12))
                            .foregroundStyle(palette.textSecondary)

                        GlowButton(label: "下一页", variant: .outline, isSmall: true) {
                            Task { try? await appState.fetchAdminCapsules(page: page.number + 1) }
                        }
                        .disabled(page.number >= page.totalPages - 1)
                    }
                    .padding(.top, 16)
                }
            }
        }
    }

    @MainActor
    private func doLogin() async {
        loginError = nil
        do {
            try await appState.adminLogin(password: password)
            password = ""
            try await appState.fetchAdminCapsules()
        } catch {
            loginError = error.localizedDescription
        }
    }
}

// MARK: - Table header

private struct AdminTableHeader: View {
    var palette: CyberPalette

    var body: some View {
        HStack(spacing: 0) {
            Text("标识码")   .adminHeader().frame(width: 100, alignment: .leading)
            Text("标题")    .adminHeader().frame(maxWidth: .infinity, alignment: .leading)
            Text("创建者")  .adminHeader().frame(width: 90, alignment: .leading)
            Text("解锁时间").adminHeader().frame(width: 140, alignment: .leading)
            Text("状态")   .adminHeader().frame(width: 80, alignment: .center)
            Text("操作")   .adminHeader().frame(width: 60, alignment: .center)
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 4)
        .overlay(
            Rectangle().fill(palette.glassBorder).frame(height: 1),
            alignment: .bottom
        )
    }
}

private extension Text {
    func adminHeader() -> some View {
        self.font(CyberFont.tableHeader)
            .foregroundStyle(Color.textMuted)
            .textCase(.uppercase)
    }
}

// MARK: - Table row

private struct AdminTableRow: View {
    var capsule: Capsule
    var palette: CyberPalette
    var onDelete: () -> Void

    @State private var hovered = false
    @State private var expanded = false

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
            Text(capsule.code)
                .font(CyberFont.mono(size: 13))
                .foregroundStyle(palette.accent)
                .frame(width: 100, alignment: .leading)

            Text(capsule.title)
                .font(CyberFont.tableBody)
                .foregroundStyle(palette.textPrimary)
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)

            Text(capsule.creator)
                .font(CyberFont.mono(size: 12))
                .foregroundStyle(palette.textSecondary)
                .lineLimit(1)
                .frame(width: 90, alignment: .leading)

            Text(formatDate(capsule.openAt))
                .font(CyberFont.mono(size: 12))
                .foregroundStyle(palette.textSecondary)
                .frame(width: 140, alignment: .leading)

            CyberBadge(
                text: capsule.isUnlocked ? "已解锁" : "锁定",
                variant: capsule.isUnlocked ? .unlocked : .locked
            )
            .frame(width: 80, alignment: .center)

            Button {
                onDelete()
            } label: {
                Image(systemName: "trash")
                    .font(.system(size: 13))
                    .foregroundStyle(Color.redAlert)
                    .padding(6)
                    .background(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(Color.redAlert.opacity(0.4), lineWidth: 1)
                    )
            }
            .buttonStyle(.plain)
            .pointerCursor()
            .frame(width: 60, alignment: .center)
            }
            .padding(.vertical, 12)
            .padding(.horizontal, 4)
            .background(hovered ? (palette.isDark ? Color.white.opacity(0.02) : Color.black.opacity(0.02)) : .clear)
            .onHover { hovered = $0 }
            .pointerCursor()
            .contentShape(Rectangle())
            .onTapGesture {
                withAnimation(.easeOut(duration: 0.2)) {
                    expanded.toggle()
                }
            }
            
            if expanded, let content = capsule.content, !content.isEmpty {
                HStack {
                    Text(content)
                        .font(CyberFont.sans(size: 14))
                        .foregroundStyle(palette.textPrimary)
                        .multilineTextAlignment(.leading)
                    Spacer()
                }
                .padding(.vertical, 16)
                .padding(.horizontal, 24)
                .background(palette.accent.opacity(0.05))
            }
        }
        .textSelection(.enabled)
        .overlay(
            Rectangle().fill(palette.glassBorder).frame(height: 1),
            alignment: .bottom
        )
    }

    private func formatDate(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.locale = Locale(identifier: "zh_CN")
        fmt.dateFormat = "yyyy-MM-dd HH:mm"
        return fmt.string(from: date)
    }
}

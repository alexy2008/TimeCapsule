import SwiftUI

// MARK: - Create Capsule View
// Mirrors CreateView.tsx: form → confirm dialog → success panel with code display & copy.

struct CreateView: View {
    @Binding var nav: NavDestination
    var appState: AppState

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    @State private var title = ""
    @State private var content = ""
    @State private var creator = ""
    @State private var openAt = Date().addingTimeInterval(86400 * 30) // 30 days from now

    @State private var showConfirm = false
    @State private var createdCapsule: Capsule? = nil
    @State private var errorMsg: String? = nil
    @State private var loading = false
    @State private var copied = false
    @State private var appeared = false

    var body: some View {
        let palette = theme.palette(for: scheme)

        ScrollView {
            VStack(spacing: 0) {

                if let capsule = createdCapsule {
                    // MARK: - Success Panel
                    SuccessPanel(capsule: capsule, palette: palette, copied: $copied) {
                        nav = .home
                    } onCopy: {
                        NSPasteboard.general.clearContents()
                        NSPasteboard.general.setString(capsule.code, forType: .string)
                        copied = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { copied = false }
                    }
                    .padding(.horizontal, 40)
                    .frame(maxWidth: 580)
                    .frame(maxWidth: .infinity)

                } else {
                    // MARK: - Form
                    VStack(alignment: .leading, spacing: 24) {
                        // Page header
                        HStack(spacing: 16) {
                            BackButton { nav = .home }
                            Text("创建时间胶囊")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundStyle(palette.textPrimary)
                        }

                        if let err = errorMsg {
                            Text(err)
                                .font(CyberFont.sans(size: 13))
                                .foregroundStyle(palette.magenta)
                                .padding(.vertical, 4)
                        }

                        GlassPanel(padding: 28, cornerRadius: 16) {
                            VStack(spacing: 20) {
                                CyberInputField(label: "标题", placeholder: "输入胶囊标题...", text: $title)



                                CyberTextEditor(
                                    label: "内容",
                                    placeholder: "输入你想寄送到未来的内容...",
                                    minHeight: 140,
                                    text: $content
                                )

                                HStack(alignment: .top, spacing: 20) {
                                    CyberInputField(label: "创建者", placeholder: "匿名访客", text: $creator)
                                    
                                    CyberDatePicker(
                                        label: "解锁时间",
                                        helpText: "在这之前任何人无法查看",
                                        date: $openAt
                                    )
                                }

                                HStack {
                                    Spacer()
                                    GlowButton(
                                        label: loading ? "封存中..." : "封存胶囊",
                                        variant: .primary,
                                        isLoading: loading
                                    ) {
                                        showConfirm = true
                                    }
                                    .disabled(loading || title.isEmpty || content.isEmpty || creator.isEmpty)
                                }
                                .padding(.top, 12)
                            }
                        }
                    }
                    .padding(.horizontal, 40)
                    .padding(.top, 8)
                    .frame(maxWidth: 760)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.bottom, 40)
        }
        .opacity(appeared ? 1 : 0)
        .offset(y: appeared ? 0 : 12)
        .onAppear { withAnimation(.easeOut(duration: 0.35)) { appeared = true } }
        .sheet(isPresented: $showConfirm) {
            ConfirmDialogSheet(
                title: "确认创建",
                message: "确定要创建标题为「\(title)」的时间胶囊吗？\n\n胶囊一经创建，内容和开启时间将无法修改。"
            ) {
                showConfirm = false
                Task { await doCreate() }
            } onCancel: {
                showConfirm = false
            }
        }
    }

    @MainActor
    private func doCreate() async {
        loading = true
        errorMsg = nil
        do {
            let capsule = try await appState.createCapsule(
                title: title,
                content: content,
                creator: creator.isEmpty ? "匿名访客" : creator,
                openAt: openAt
            )
            createdCapsule = capsule
        } catch {
            errorMsg = error.localizedDescription
        }
        loading = false
    }
}

// MARK: - Success panel (mirrors .success-container)

private struct SuccessPanel: View {
    var capsule: Capsule
    var palette: CyberPalette
    @Binding var copied: Bool
    var onHome: () -> Void
    var onCopy: () -> Void

    var body: some View {
        GlassPanel(padding: 36, cornerRadius: 16) {
            VStack(spacing: 24) {
                // Big check icon
                ZStack {
                    RoundedRectangle(cornerRadius: 50)
                        .fill(palette.green.opacity(0.1))
                        .shadow(color: palette.green.opacity(0.2), radius: 16)
                    Image(systemName: "checkmark")
                        .font(.system(size: 40, weight: .semibold))
                        .foregroundStyle(palette.green)
                }
                .frame(width: 80, height: 80)

                Text("胶囊创建成功")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundStyle(palette.textPrimary)

                Text("您的时间胶囊已成功封存。")
                    .font(CyberFont.cardBody)
                    .foregroundStyle(palette.textSecondary)

                // Capsule code box (mirrors .capsule-key-box)
                ZStack(alignment: .topLeading) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.black.opacity(0.4))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(palette.accentDim, style: StrokeStyle(lineWidth: 1, dash: [6]))
                        )

                    VStack(alignment: .leading, spacing: 10) {
                        Text("提取码")
                            .font(CyberFont.label)
                            .foregroundStyle(palette.accent)

                        HStack {
                            Text(capsule.code)
                                .font(CyberFont.codeDisplay)
                                .foregroundStyle(palette.textPrimary)
                                .tracking(8)
                                .shadow(color: palette.accentGlow, radius: 6)

                            Spacer()

                            Button {
                                onCopy()
                            } label: {
                                Image(systemName: copied ? "checkmark" : "doc.on.doc")
                                    .font(.system(size: 16))
                                    .foregroundStyle(copied ? palette.green : palette.textSecondary)
                                    .padding(8)
                                    .background(
                                        RoundedRectangle(cornerRadius: 4)
                                            .stroke(palette.glassBorder, lineWidth: 1)
                                    )
                            }
                            .buttonStyle(.plain)
                            .pointerCursor()
                        }
                    }
                    .padding(20)
                }

                // Warning note
                HStack(alignment: .top, spacing: 10) {
                    Image(systemName: "info.circle")
                        .foregroundStyle(palette.accent)
                    Text("请务必妥善保存胶囊码。它是开启此胶囊的唯一凭证，丢失后将无法找回或补发。")
                        .font(CyberFont.sans(size: 13))
                        .foregroundStyle(palette.textPrimary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(14)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(palette.accentDim)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(palette.accentDim, lineWidth: 1)
                        )
                )

                GlowButton(label: "返回首页", variant: .outline) {
                    onHome()
                }
                .padding(.top, 8)
            }
        }
        .padding(.top, 40)
    }
}

// MARK: - Confirm dialog sheet

struct ConfirmDialogSheet: View {
    var title: String
    var message: String
    var onConfirm: () -> Void
    var onCancel: () -> Void

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var body: some View {
        let palette = theme.palette(for: scheme)

        ZStack {
            palette.bgBase.ignoresSafeArea()

            VStack(spacing: 24) {
                Text(title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(palette.textPrimary)

                Text(message)
                    .font(CyberFont.cardBody)
                    .foregroundStyle(palette.textSecondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)

                HStack(spacing: 16) {
                    GlowButton(label: "取消", variant: .outline) { onCancel() }
                    GlowButton(label: "确认", variant: .primary) { onConfirm() }
                }
            }
            .padding(32)
            .glassPanel(cornerRadius: 16)
            .padding(24)
        }
        .frame(width: 420, height: 260)
    }
}

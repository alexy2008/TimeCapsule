import SwiftUI

// MARK: - Open Capsule View
// Mirrors OpenView.tsx + CapsuleCard.tsx: code search → locked card (countdown) or unlocked card (decrypt anim).

struct OpenView: View {
    @Binding var nav: NavDestination
    var appState: AppState

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    @State private var code = ""
    @State private var loading = false
    @State private var errorMsg: String? = nil
    @State private var appeared = false

    var body: some View {
        let palette = theme.palette(for: scheme)

        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header
                HStack(spacing: 16) {
                    BackButton {
                        if appState.fetchedCapsule != nil {
                            appState.clearFetchedCapsule()
                        } else {
                            nav = .home
                        }
                    }
                    Text(headerTitle)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundStyle(palette.textPrimary)
                }

                if let capsule = appState.fetchedCapsule {
                    CapsuleCardView(capsule: capsule, palette: palette) {
                        // On expired: refresh
                        Task { try? await appState.fetchCapsule(code: capsule.code) }
                    }
                } else {
                    // Search input panel
                    GlassPanel(padding: 40, cornerRadius: 16) {
                        VStack(spacing: 28) {
                            Text("输入8位提取码开启您的时间胶囊。")
                                .font(CyberFont.cardBody)
                                .foregroundStyle(palette.textSecondary)
                                .multilineTextAlignment(.center)

                            CapsuleCodeSearchInput(code: $code) { c in
                                Task { await doSearch(code: c) }
                            }
                            .frame(maxWidth: 320)

                            if let err = errorMsg {
                                Text(err)
                                    .font(CyberFont.sans(size: 13))
                                    .foregroundStyle(palette.magenta)
                            }

                            GlowButton(
                                label: loading ? "查询中..." : "开启胶囊",
                                variant: .primary,
                                isLoading: loading
                            ) {
                                Task { await doSearch(code: code) }
                            }
                            .disabled(code.count != 8 || loading)
                        }
                    }
                    .frame(maxWidth: 560)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 40)
            .padding(.bottom, 40)
            .padding(.top, 8)
        }
        .opacity(appeared ? 1 : 0)
        .offset(y: appeared ? 0 : 12)
        .onAppear { withAnimation(.easeOut(duration: 0.35)) { appeared = true } }
    }

    private var headerTitle: String {
        guard let c = appState.fetchedCapsule else { return "打开时间胶囊" }
        return c.isUnlocked ? "状态: 已解锁" : "状态: 锁定中"
    }

    @MainActor
    private func doSearch(code: String) async {
        guard code.count == 8 else { return }
        loading = true
        errorMsg = nil
        do {
            try await appState.fetchCapsule(code: code)
        } catch {
            errorMsg = error.localizedDescription
        }
        loading = false
    }
}

// MARK: - Capsule Card (locked / unlocked rendering)

private struct CapsuleCardView: View {
    var capsule: Capsule
    var palette: CyberPalette
    var onExpired: () -> Void

    @State private var animating = false

    var body: some View {
        if capsule.isUnlocked, let content = capsule.content {
            unlockedCard(content: content)
        } else {
            lockedCard
        }
    }

    // MARK: Locked card
    private var lockedCard: some View {
        VStack(spacing: 0) {
            // Header bar
            HStack {
                Text("胶囊码: \(capsule.code)")
                    .font(CyberFont.mono(size: 13))
                    .foregroundStyle(palette.textSecondary)
                Spacer()
                CyberBadge(text: "未到时间", variant: .locked)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 14)
            .background(Color.black.opacity(0.5))
            .overlay(
                Rectangle().fill(palette.glassBorder).frame(height: 1),
                alignment: .bottom
            )

            // Title & meta
            VStack(alignment: .leading, spacing: 8) {
                Text(capsule.title)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundStyle(palette.textPrimary)
                    .padding(.top, 20)

                HStack(spacing: 24) {
                    Text("发布者: \(capsule.creator)")
                        .font(CyberFont.sans(size: 13))
                        .foregroundStyle(palette.textSecondary)
                    Text("创建时间: \(formatDate(capsule.createdAt))")
                        .font(CyberFont.sans(size: 13))
                        .foregroundStyle(palette.textSecondary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 24)

            // Countdown
            CountdownClock(targetDate: capsule.openAt, onExpired: onExpired)
                .frame(maxWidth: .infinity)

            // Encryption visual
            VStack(alignment: .leading, spacing: 10) {
                Text("0x8F9A... 内容已被锁定 ...3B2C1")
                    .font(CyberFont.mono(size: 12))
                    .foregroundStyle(palette.textSecondary)
                    .opacity(0.7)

                // Progress bar
                let progress = lockProgress
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color.white.opacity(0.1))
                        RoundedRectangle(cornerRadius: 2)
                            .fill(palette.accent)
                            .shadow(color: palette.accent, radius: 4)
                            .frame(width: geo.size.width * progress)
                    }
                }
                .frame(height: 4)

                Text("解锁时间: \(formatDate(capsule.openAt))")
                    .font(CyberFont.mono(size: 12))
                    .foregroundStyle(palette.textSecondary)
            }
            .padding(24)
            .background(Color.black.opacity(0.6))
        }
        .glassPanel(cornerRadius: 16)
    }

    // MARK: Unlocked card
    private func unlockedCard(content: String) -> some View {
        VStack(spacing: 0) {
            // Header bar
            HStack {
                Text("胶囊码: \(capsule.code)")
                    .font(CyberFont.mono(size: 13))
                    .foregroundStyle(palette.textSecondary)
                Spacer()
                CyberBadge(text: "已解锁", variant: .unlocked)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 14)
            .background(Color.black.opacity(0.5))
            .overlay(
                Rectangle().fill(palette.glassBorder).frame(height: 1),
                alignment: .bottom
            )

            // Title
            Text(capsule.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundStyle(palette.accent)
                .shadow(color: palette.accentGlow, radius: 8)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 24)
                .padding(.top, 20)

            // Meta infos
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 24) {
                    Text("发布者: \(capsule.creator)")
                        .font(CyberFont.sans(size: 13))
                        .foregroundStyle(palette.textSecondary)
                    Text("创建时间: \(formatDate(capsule.createdAt))")
                        .font(CyberFont.sans(size: 13))
                        .foregroundStyle(palette.textSecondary)
                }
                Text("开启时间: \(formatDate(capsule.openAt))")
                    .font(CyberFont.sans(size: 13))
                    .foregroundStyle(palette.accent)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 24)
            .padding(.bottom, 16)
            .overlay(
                Rectangle().fill(palette.glassBorder).frame(height: 1),
                alignment: .bottom
            )

            // Content area with decrypt animation on first appear
            ZStack {
                ScrollView {
                    Text(content)
                        .font(CyberFont.sans(size: 15))
                        .foregroundStyle(palette.textPrimary)
                        .lineSpacing(6)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(24)
                        .opacity(animating ? 0 : 1)
                }
                .frame(minHeight: 200)

                if animating {
                    DecryptOverlay()
                        .cornerRadius(0)
                }
            }
        }
        .glassPanel(cornerRadius: 16)
        .onAppear {
            animating = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.8) {
                animating = false
            }
        }
    }

    private var lockProgress: CGFloat {
        let created = capsule.createdAt.timeIntervalSince1970
        let open = capsule.openAt.timeIntervalSince1970
        let now = Date().timeIntervalSince1970
        guard open > created else { return 1 }
        return CGFloat(max(0, min(1, (now - created) / (open - created))))
    }

    private func formatDate(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.locale = Locale(identifier: "zh_CN")
        fmt.dateFormat = "yyyy-MM-dd HH:mm"
        return fmt.string(from: date)
    }
}

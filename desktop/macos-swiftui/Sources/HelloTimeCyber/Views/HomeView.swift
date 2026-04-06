import SwiftUI

// MARK: - Home View
// SwiftUI 渲染的原生首页。由于 SwiftUI 无法直接复用前端 Web 版本的 DOM/CSS 结构，
// 这里体现了它必须使用原生修饰器结合 HStack/VStack 重新构建「Cyber-Glass」风格视图，
// 作为跨端桌面应用与 Web 端在原生 UI 层面的设计对照。

struct HomeView: View {
    @Binding var nav: NavDestination
    var appState: AppState

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    @State private var appeared = false

    var body: some View {
        let palette = theme.palette(for: scheme)

        ScrollView {
            VStack(spacing: 40) {

                // MARK: Hero Section
                VStack(spacing: 20) {
                    CyberBadge(text: "TIMECAPSULE SYSTEM", variant: .hero)
                        .padding(.top, 20)

                    // Hero title
                    HStack(spacing: 12) {
                        Text("封存此刻")
                            .font(.system(size: 44, weight: .bold))
                            .foregroundStyle(palette.textPrimary)

                        Text("开启未来")
                            .font(.system(size: 44, weight: .bold))
                            .foregroundStyle(palette.accent)
                            .shadow(color: palette.accentGlow, radius: 12)
                    }

                    Text("将您的寄语、秘密或愿景封装于时间胶囊中，直到指定的未来时刻才能被访问。")
                        .font(CyberFont.heroSubtitle)
                        .foregroundStyle(palette.textSecondary)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: 560)
                }
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 12)

                // MARK: Action Cards
                HStack(spacing: 24) {
                    ActionCard(
                        icon: "plus",
                        iconColorAccent: true,
                        title: "创建胶囊",
                        subtitle: "封存此刻寄语，投递给未来的自己",
                        accentColor: palette.accent,
                        accentDim: palette.accentDim
                    ) {
                        nav = .create
                    }

                    ActionCard(
                        icon: "magnifyingglass",
                        iconColorAccent: false,
                        title: "开启胶囊",
                        subtitle: "输入提取凭据，唤醒沉睡的时间印记",
                        accentColor: palette.magenta,
                        accentDim: palette.magentaDim
                    ) {
                        nav = .open
                    }
                }
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 12)


            }
            .padding(.horizontal, 40)
            .padding(.bottom, 40)
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.4)) { appeared = true }
        }
    }
}

// MARK: - Action Card (mirrors .action-card.cyber-glass)

private struct ActionCard: View {
    var icon: String
    var iconColorAccent: Bool
    var title: String
    var subtitle: String
    var accentColor: Color
    var accentDim: Color
    var action: () -> Void

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @State private var hovered = false

    var body: some View {
        let palette = theme.palette(for: scheme)

        Button(action: action) {
            VStack(alignment: .leading, spacing: 20) {
                // Icon circle
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(accentColor.opacity(0.1))
                        .shadow(color: accentDim, radius: 10)
                    Image(systemName: icon)
                        .font(.system(size: 28, weight: .medium))
                        .foregroundStyle(accentColor)
                }
                .frame(width: 60, height: 60)

                VStack(alignment: .leading, spacing: 8) {
                    Text(title)
                        .font(CyberFont.cardTitle)
                        .foregroundStyle(palette.textPrimary)

                    Text(subtitle)
                        .font(CyberFont.cardBody)
                        .foregroundStyle(palette.textSecondary)
                }

                Spacer()
            }
            .padding(28)
            .frame(maxWidth: .infinity, minHeight: 180, alignment: .topLeading)
            .glassPanel(cornerRadius: 16)
            .overlay(
                // Top accent line on hover (matches .action-card:hover border-top)
                VStack {
                    Rectangle()
                        .fill(accentColor)
                        .frame(height: 2)
                        .shadow(color: accentColor.opacity(0.6), radius: 6)
                        .opacity(hovered ? 1 : 0)
                    Spacer()
                }
            )
            .shadow(color: hovered ? accentColor.opacity(0.1) : .clear, radius: 20)
            .scaleEffect(hovered ? 1.02 : 1.0)
        }
        .buttonStyle(.plain)
        .pointerCursor()
        .onHover { hovered = $0 }
        .animation(.easeOut(duration: 0.2), value: hovered)
    }
}

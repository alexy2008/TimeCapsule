import SwiftUI

// MARK: - About View
// Mirrors AboutView.tsx: hero section + 3-col features grid + tech deep dive + secret admin trigger (5 clicks on orb).

struct AboutView: View {
    @Binding var nav: NavDestination
    var appState: AppState

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    @State private var orbClickCount = 0
    @State private var appeared = false

    var body: some View {
        let palette = theme.palette(for: scheme)

        ScrollView {
            VStack(spacing: 32) {

                // MARK: - Hero Section
                GlassPanel(padding: 32, cornerRadius: 16) {
                    HStack(spacing: 32) {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("跨越时空的技术演示")
                                .font(.system(size: 26, weight: .bold))
                                .foregroundStyle(palette.accent)
                                .shadow(color: palette.accentGlow, radius: 8)

                            Group {
                                Text("HelloTime 不仅仅是一个简单的时间胶囊应用，它是一个遵循 ")
                                    .font(CyberFont.cardBody)
                                + Text("RealWorld")
                                    .font(CyberFont.sans(size: 14, weight: .bold))
                                    .foregroundColor(palette.accent)
                                + Text(" 规范的实验性全栈项目。\n\n这是 HelloTime 的 macOS 系统原生桌面端实现。本项目展示了如何使用 Swift 6 与 SwiftUI 构建高性能的桌面客户端，同时完全使用系统原生系统 API（如 Canvas, Metal 特性等），将原本基于 Web CSS 的 Cyber-Glass 玻璃拟态设计、发光和动画效果完美重构复用。")
                                    .font(CyberFont.cardBody)
                            }
                            .foregroundStyle(palette.textSecondary)

                            Text("每一行代码都经过精心设计，以确保在不同语言的后端引擎架构之间与本原生客户端实现完美的契合。")
                                .font(CyberFont.cardBody)
                                .foregroundStyle(palette.textSecondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)

                        // Rotating Tech Orb (5 clicks → secret admin)
                        TechOrb()
                            .frame(width: 120, height: 120)
                            .pointerCursor()
                            .onTapGesture {
                                orbClickCount += 1
                                if orbClickCount >= 5 {
                                    orbClickCount = 0
                                    nav = .admin
                                }
                            }
                    }
                }

                // MARK: - Features Grid (3 columns)
                HStack(alignment: .top, spacing: 20) {
                    FeatureCard(
                        icon: "🛸",
                        title: "统一 API 交互",
                        description: "完全遵循 OpenAPI 3.0 标准。无论底层是 Java, Go 还是 Python，前端都只需对接一套标准的 REST 接口。"
                    )
                    FeatureCard(
                        icon: "🌗",
                        title: "设计系统同步",
                        description: "利用 CSS Custom Properties 维护一套原子化的 Design Tokens。所有框架共享这套玻璃拟态的科技感视觉规范。"
                    )
                    FeatureCard(
                        icon: "⛓️",
                        title: "数据层透明隔离",
                        description: "胶囊内容的锁定逻辑在服务端实现硬隔离（API 永不返回未到期内容），确保了数据的时间安全性。"
                    )
                }

                // MARK: - Tech Deep Dive
                GlassPanel(padding: 32, cornerRadius: 16) {
                    VStack(alignment: .leading, spacing: 28) {
                        Text("核心驱动 (Core Technologies)")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundStyle(palette.accent)
                            .shadow(color: palette.accentGlow, radius: 6)

                        let palette2 = palette
                        let backendFramework = appState.isTechStackLoading ? "Loading..." : (appState.techStackError || appState.techStack == nil ? "?" : appState.techStack!.framework)
                        let backendLang = appState.isTechStackLoading ? "Loading..." : (appState.techStackError || appState.techStack == nil ? "?" : appState.techStack!.language)
                        let db = appState.isTechStackLoading ? "Loading..." : (appState.techStackError || appState.techStack == nil ? "?" : appState.techStack!.database)

                        let items: [(String, String, String)] = [
                            ("SwiftUI", "swift", "桌面端框架"),
                            ("Swift 6", "swift", "桌面端语言"),
                            (backendFramework, "server.rack", "后端框架"),
                            (backendLang, "curlybraces", "后端语言"),
                            (db, "externaldrive.fill", "数据库")
                        ]

                        HStack(spacing: 0) {
                            ForEach(items, id: \.2) { item in
                                VStack(spacing: 14) {
                                    Image(systemName: item.1)
                                        .font(.system(size: 48))
                                        .foregroundStyle(palette2.accent)
                                        .shadow(color: palette2.accentGlow, radius: 10)

                                    VStack(spacing: 4) {
                                        Text(item.0)
                                            .font(CyberFont.sans(size: 15, weight: .bold))
                                            .foregroundStyle(palette2.accent)
                                            .shadow(color: palette2.accentGlow, radius: 4)
                                        Text(item.2)
                                            .font(CyberFont.mono(size: 12))
                                            .foregroundStyle(palette2.textMuted)
                                    }
                                }
                                .frame(maxWidth: .infinity)
                            }
                        }
                        .padding(.top, 12)
                    }
                }

                // MARK: - Version / secret trigger
                Button {
                    orbClickCount += 1
                    if orbClickCount >= 5 {
                        orbClickCount = 0
                        nav = .admin
                    }
                } label: {
                    Text("Version 2.0.0-cyber")
                        .font(CyberFont.mono(size: 12))
                        .foregroundStyle(palette.textMuted)
                        .opacity(0.4)
                }
                .buttonStyle(.plain)
                .pointerCursor()
                .padding(.bottom, 20)
            }
            .padding(.horizontal, 40)
            .padding(.vertical, 16)
        }
        .opacity(appeared ? 1 : 0)
        .offset(y: appeared ? 0 : 12)
        .onAppear { withAnimation(.easeOut(duration: 0.35)) { appeared = true } }
    }


}

// MARK: - Feature card

private struct FeatureCard: View {
    var icon: String
    var title: String
    var description: String

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var body: some View {
        let palette = theme.palette(for: scheme)
        GlassPanel(padding: 24, cornerRadius: 16) {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 10) {
                    Text(icon).font(.system(size: 24))
                    Text(title)
                        .font(CyberFont.sans(size: 15, weight: .semibold))
                        .foregroundStyle(palette.textPrimary)
                }

                Text(description)
                    .font(CyberFont.cardBody)
                    .foregroundStyle(palette.textMuted)
                    .fixedSize(horizontal: false, vertical: true)

                Spacer()
            }
        }
        .frame(maxWidth: .infinity)
    }
}

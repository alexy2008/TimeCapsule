import SwiftUI

struct AboutView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    
    @State private var secretClickCount = 0
    
    var body: some View {
        let palette = theme.palette(for: scheme)
        
        VStack(spacing: 0) {
            CyberNavBar(title: "关于时间胶囊 (HelloTime)", showBackButton: true, showAboutButton: false)
            
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    
                    // Main About Card
                    GlassPanel(padding: 30, cornerRadius: 20) {
                        VStack(spacing: 24) {
                            
                            // Radar/Wave Icon (Secret Admin Trigger)
                            ZStack {
                                Circle()
                                    .stroke(palette.accent.opacity(0.2), lineWidth: 1)
                                    .frame(width: 100, height: 100)
                                Circle()
                                    .stroke(palette.accent.opacity(0.4), lineWidth: 1)
                                    .frame(width: 70, height: 70)
                                
                                Circle()
                                    .fill(palette.accent)
                                    .frame(width: 30, height: 30)
                                    .shadow(color: palette.accentGlow, radius: 15)
                                    
                                // Add a subtle sweep
                                Circle()
                                    .trim(from: 0, to: 0.2)
                                    .stroke(palette.accent, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                                    .frame(width: 90, height: 90)
                                    .rotationEffect(.degrees(-90))
                            }
                            .padding(.vertical, 10)
                            .contentShape(Circle())
                            .onTapGesture {
                                handleSecretClick()
                            }
                            
                            Text("跨越时空的技术演示")
                                .font(.title3).bold()
                                .foregroundColor(palette.accent)
                                .shadow(color: palette.accentGlow.opacity(0.5), radius: 5)
                            
                            Text("HelloTime 不仅仅是一个简单的时间胶囊应用，它是一个遵循 RealWorld 规范的实验性全栈项目。本项目旨在展示在相同的业务逻辑下，如何利用不同的现代化技术架构构建具有高度一致性、可维护性和交互体验的应用程序。")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .lineSpacing(8)
                                .multilineTextAlignment(.center)
                                
                            Divider().background(Color.secondary.opacity(0.3))
                            
                            Text("每一行代码都经过精心设计，以确保在高性能后端引擎与现代化前端框架之间实现完美的契合。")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .lineSpacing(8)
                                .multilineTextAlignment(.center)
                        }
                    }
                    
                    // Feature Grid
                    VStack(spacing: 20) {
                        featureCard(
                            icon: "🛸",
                            title: "统一 API 交互",
                            content: "完全遵循 OpenAPI 3.0 标准。无论底层是 Java, Go 还是 Python，前端都只需对接一套标准的 REST 接口。"
                        )
                        
                        featureCard(
                            icon: "🌗",
                            title: "设计系统同步",
                            content: "利用自定义 Design Tokens 维护一套原子化的视觉规范。所有端共享这套玻璃拟态的科技感视觉风格。"
                        )
                        
                        featureCard(
                            icon: "⛓️",
                            title: "数据层透明隔离",
                            content: "胶囊内容的锁定逻辑在服务端实现硬隔离，确保了数据的时间安全性。"
                        )
                    }
                    
                    // Core Tech Grid
                    GlassPanel(padding: 24, cornerRadius: 20) {
                        VStack(alignment: .leading, spacing: 20) {
                            Text("核心驱动 (Core Technologies)")
                                .font(.headline).bold()
                                .foregroundColor(palette.accent)
                            
                            let tech = appState.techStack
                            
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 20) {
                                techGridItem(name: "SwiftUI", version: "Swift 6.1", icon: "swift", color: .orange)
                                techGridItem(name: "TS", version: "TS 5.x", icon: "t.square.fill", color: .blue)
                                techGridItem(name: tech?.framework ?? "后端框架", version: tech?.framework ?? "Spring/Go/...", icon: "server.rack", color: palette.accent)
                                techGridItem(name: tech?.language ?? "后端语言", version: tech?.language ?? "Java/Go/...", icon: "chevron.left.forward.slash", color: palette.accent)
                                techGridItem(name: tech?.database ?? "数据库", version: tech?.database ?? "SQLite/...", icon: "database", color: palette.accent)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .padding(.bottom, 40)
            }
        }
    }
    
    private func featureCard(icon: String, title: String, content: String) -> some View {
        GlassPanel(padding: 24, cornerRadius: 20) {
            VStack(alignment: .leading, spacing: 16) {
                HStack(spacing: 12) {
                    Text(icon)
                        .font(.title3)
                    Text(title)
                        .font(.headline).bold()
                        .foregroundColor(.primary)
                }
                
                Text(content)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineSpacing(6)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
    
    private func techGridItem(name: String, version: String, icon: String, color: Color) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            Text(name)
                .font(.caption).bold()
                .foregroundColor(.primary)
            Text(version)
                .font(.system(size: 10, design: .monospaced))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color.white.opacity(0.02))
        .cornerRadius(12)
    }
    
    private func handleSecretClick() {
        secretClickCount += 1
        if secretClickCount >= 5 {
            secretClickCount = 0
            appState.navPath.append(.admin)
        }
    }
}

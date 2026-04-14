import SwiftUI

struct HomeView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    
    var body: some View {
        let palette = theme.palette(for: scheme)
        
        VStack(spacing: 0) {
            CyberNavBar(showAboutButton: true)
            
            ScrollView(showsIndicators: false) {
                VStack(spacing: 32) {
                    
                    // HEADER SECTION
                    VStack(spacing: 16) {
                        // Badge
                        Text("TIMECAPSULE SYSTEM")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(palette.accent) // cyan
                            .padding(.horizontal, 16)
                            .padding(.vertical, 6)
                            .background(palette.accent.opacity(0.1))
                            .overlay(
                                SwiftUI.Capsule().stroke(palette.accent.opacity(0.3), lineWidth: 1)
                            )
                            .clipShape(SwiftUI.Capsule())
                            .padding(.top, 20)
                        
                        // Title
                        HStack(spacing: 0) {
                            Text("封存此刻 ")
                                .foregroundColor(.primary)
                            Text("开启未来")
                                .foregroundColor(palette.accent)
                                .shadow(color: palette.accentGlow.opacity(0.8), radius: 10)
                        }
                        .font(.system(size: 32, weight: .bold))
                        
                        // Subtitle
                        Text("将您的寄语、秘密或愿景封装于时间胶囊中，直到指定的未来时刻才能被访问。")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .lineSpacing(6)
                            .padding(.horizontal, 30)
                    }
                    
                    // CARDS SECTION
                    VStack(spacing: 20) {
                        actionCard(
                            icon: "plus",
                            iconColor: palette.accent,
                            iconGlow: palette.accentGlow,
                            title: "创建胶囊",
                            subtitle: "封存此刻寄语，投递给未来的自己"
                        ) {
                            appState.navPath.append(.create)
                        }
                        
                        actionCard(
                            icon: "magnifyingglass",
                            iconColor: palette.magenta,
                            iconGlow: palette.magentaDim,
                            title: "开启胶囊",
                            subtitle: "输入提取凭据，唤醒沉睡的时间印记"
                        ) {
                            appState.navPath.append(.open)
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    // TECH STACK FOOTER
                    if !appState.isTechStackLoading, let tech = appState.techStack {
                        techStackFooter(tech: tech)
                            .padding(.horizontal, 20)
                            .padding(.top, 20)
                            
                        // Very bottom inline text
                        HStack {
                            Circle()
                                .fill(Color.green)
                                .frame(width: 6, height: 6)
                                .shadow(color: .green, radius: 4)
                            Text("HelloTime · 时间胶囊 · \(tech.framework) · \(tech.language) · \(tech.database)")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.secondary)
                        }
                        .padding(.vertical, 16)
                        .padding(.horizontal, 20)
                        .frame(maxWidth: .infinity)
                        .glassPanel(cornerRadius: 12)
                        .padding(.horizontal, 20)
                        .padding(.bottom, 30)
                    }
                }
            }
        }
        .task {
            if appState.techStack == nil {
                await appState.fetchTechStack()
            }
        }
    }
    
    private func actionCard(icon: String, iconColor: Color, iconGlow: Color, title: String, subtitle: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            GlassPanel(padding: 24, cornerRadius: 20) {
                VStack(alignment: .leading, spacing: 20) {
                    
                    // Icon Box
                    ZStack {
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(white: scheme == .dark ? 0.1 : 0.9))
                            .frame(width: 56, height: 56)
                            
                        Image(systemName: icon)
                            .font(.system(size: 24, weight: .medium))
                            .foregroundColor(iconColor)
                            .shadow(color: iconGlow, radius: 10)
                            .shadow(color: iconGlow.opacity(0.5), radius: 20)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text(title)
                            .font(.title3)
                            .bold()
                            .foregroundColor(.primary)
                        
                        Text(subtitle)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        // Button style plain removes the default tint behavior on texts
        .buttonStyle(.plain)
        .scaleEffect(1.0)
    }
    
    private func techStackFooter(tech: String) -> some View {
         EmptyView() // Implemented in actual footer
    }
    
    private func techStackFooter(tech: TechStack) -> some View {
        GlassPanel(padding: 24, cornerRadius: 20) {
            VStack(alignment: .leading, spacing: 20) {
                Text("TECHNOLOGY STACK")
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(.secondary)
                    .letterSpacing(2)
                
                // For layout parity with image, display standard grid or layout
                HStack(spacing: 24) {
                    techItem(name: tech.framework, icon: "server.rack")
                    techItem(name: tech.language, icon: "chevron.left.forward.slash")
                }
                HStack(spacing: 24) {
                    techItem(name: "Gin", icon: "terminal")
                    techItem(name: "Go", icon: "network")
                    techItem(name: tech.database, icon: "database")
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
    
    private func techItem(name: String, icon: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(theme.palette(for: scheme).accent)
            Text(name)
                .font(.system(size: 13, design: .monospaced))
                .foregroundColor(.primary)
        }
    }
}

extension View {
    func letterSpacing(_ spacing: CGFloat) -> some View {
        if #available(iOS 16.0, *) {
            return self.kerning(spacing)
        } else {
            return self
        }
    }
}

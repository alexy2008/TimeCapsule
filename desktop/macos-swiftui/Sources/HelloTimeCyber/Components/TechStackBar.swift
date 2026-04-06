import SwiftUI

// MARK: - Tech Stack Footer Bar
// Shows 3 fixed desktop tech items: SwiftUI · Swift · macOS
// Mirrors .tech-stack-simple + .tech-logos-grid but for the desktop implementation.

struct TechStackBar: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    var appState: AppState

    private func simplify(_ text: String) -> String {
        return text.components(separatedBy: .whitespaces).first ?? text
    }

    var body: some View {
        let palette = theme.palette(for: scheme)
        let backendFramework = appState.isTechStackLoading ? "Loading..." : (appState.techStackError || appState.techStack == nil ? "?" : simplify(appState.techStack!.framework))
        let backendLang = appState.isTechStackLoading ? "Loading..." : (appState.techStackError || appState.techStack == nil ? "?" : simplify(appState.techStack!.language))
        let db = appState.isTechStackLoading ? "Loading..." : (appState.techStackError || appState.techStack == nil ? "?" : simplify(appState.techStack!.database))

        let items: [(icon: String, label: String)] = [
            ("swift", "SwiftUI"),
            ("swift", "Swift 6"),
            ("server.rack", backendFramework),
            ("curlybraces", backendLang),
            ("externaldrive.fill", db)
        ]

        GlassPanel(padding: 16, cornerRadius: 12) {
            ZStack {
                // Side items pushed to edges
                HStack(spacing: 0) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("TECHNOLOGY STACK")
                            .font(CyberFont.label)
                            .foregroundStyle(palette.textMuted)
                            .tracking(3)
                    }

                    Spacer()

                    HStack(spacing: 6) {
                        StatusDot()
                        Text("运行正常")
                            .font(CyberFont.mono(size: 11))
                            .foregroundStyle(palette.textMuted)
                    }
                }

                // Tech stack items centered
                HStack(spacing: 32) {
                    ForEach(items, id: \.label) { item in
                        HStack(spacing: 8) {
                            Image(systemName: item.icon)
                                .font(.system(size: 18))
                                .foregroundStyle(palette.accent)
                                .shadow(color: palette.accentGlow, radius: 4)

                            Text(item.label)
                                .font(CyberFont.mono(size: 13))
                                .foregroundStyle(palette.textSecondary)
                        }
                    }
                }
            }
        }
        .onAppear {
            if appState.techStack == nil {
                Task { await appState.fetchTechStack() }
            }
        }
    }
}

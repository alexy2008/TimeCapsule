import SwiftUI

// MARK: - Root View
// Replaces NavigationSplitView with a full-page layout:
//   CyberBackground (fixed) → NavBar → content → TechStackBar
// Navigation is driven by NavDestination enum with fadeIn transition.

struct RootView: View {
    @State private var nav: NavDestination = .home
    @State private var theme = CyberTheme()
    @State private var appState = AppState()

    @Environment(\.colorScheme) private var systemScheme

    var body: some View {
        let palette = theme.palette(for: effectiveScheme)

        ZStack {
            // Fixed background layer
            CyberBackground()

            VStack(spacing: 0) {
                // Top navigation bar
                NavBar(current: $nav, theme: theme)
                    .background(
                        palette.glassBg
                            .overlay(
                                Rectangle()
                                    .fill(palette.glassBorder)
                                    .frame(height: 1),
                                alignment: .bottom
                            )
                    )

                // Dynamic content area
                Group {
                    switch nav {
                    case .home:
                        HomeView(nav: $nav, appState: appState)
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    case .create:
                        CreateView(nav: $nav, appState: appState)
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    case .open:
                        OpenView(nav: $nav, appState: appState)
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    case .about:
                        AboutView(nav: $nav, appState: appState)
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    case .admin:
                        AdminView(nav: $nav, appState: appState)
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }
                }
                .animation(.easeOut(duration: 0.35), value: nav)
                .frame(maxWidth: .infinity, maxHeight: .infinity)

                // Bottom tech stack bar as footer
                TechStackBar(appState: appState)
                    .padding(.horizontal, 40)
                    .padding(.bottom, 20)
                    .padding(.top, 8)
            }
        }
        .environment(\.cyberTheme, theme)
        .preferredColorScheme(theme.preferredColorScheme)
        .frame(minWidth: 1000, minHeight: 720)
    }

    private var effectiveScheme: ColorScheme {
        theme.preferredColorScheme ?? systemScheme
    }
}

import SwiftUI

struct RootView: View {
    @State private var appState = AppState()
    
    var body: some View {
        NavigationStack(path: $appState.navPath) {
            ZStack {
                CyberBackground() // This comes from our Theme/Components
                
                HomeView()
            }
            .navigationBarHidden(true)
            .navigationDestination(for: Route.self) { route in
                ZStack {
                    CyberBackground()
                    
                    switch route {
                    case .home:
                        HomeView()
                    case .create:
                        CreateCapsuleView()
                    case .open:
                        OpenView()
                    case .admin:
                        AdminView()
                    case .about:
                        AboutView()
                    }
                }
                .navigationBarHidden(true)
            }
        }
        .environment(appState)
        .preferredColorScheme(appState.isDarkMode ? .dark : .light)
        .tint(Color(red: 0, green: 0.96, blue: 0.88))
    }
}

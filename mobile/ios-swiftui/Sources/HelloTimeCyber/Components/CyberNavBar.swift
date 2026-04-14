import SwiftUI

struct CyberNavBar: View {
    @Environment(AppState.self) private var appState
    
    // Config
    var title: String? = nil
    var showBackButton: Bool = false
    var showAboutButton: Bool = false
    var customLeadingPath: (Route)? = nil

    var body: some View {
        HStack {
            if showBackButton {
                Button(action: {
                    if !appState.navPath.isEmpty {
                        appState.navPath.removeLast()
                    }
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: "arrow.left")
                        Text("返回")
                    }
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                }
            } else {
                // Main Logo
                Button(action: {
                    appState.navPath = []
                }) {
                    Image("logo", bundle: .module)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 28, height: 28)
                }
            }
            
            if let title = title {
                if showBackButton {
                    Text(title)
                        .font(.headline).bold()
                        .foregroundColor(.primary)
                        .padding(.leading, 8)
                }
            }
            
            Spacer()
            
            // Trailing Actions
            HStack(spacing: 20) {
                if showAboutButton {
                    Button(action: {
                        appState.navPath.append(.about)
                    }) {
                        Text("关于")
                            .font(.subheadline)
                            .foregroundColor(appState.navPath.last == .about ? Color(red: 0, green: 0.96, blue: 0.88) : .secondary)
                    }
                }
                
                Button(action: {
                    withAnimation {
                        appState.isDarkMode.toggle()
                    }
                }) {
                    Image(systemName: appState.isDarkMode ? "sun.max" : "moon")
                        .font(.system(size: 16))
                        .foregroundColor(.secondary)
                        .padding(8)
                        .background(
                            RoundedRectangle(cornerRadius: 6)
                                .stroke(Color.secondary.opacity(0.3), lineWidth: 1)
                        )
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(Color.clear)
    }
}

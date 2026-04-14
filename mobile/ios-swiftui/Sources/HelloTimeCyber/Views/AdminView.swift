import SwiftUI

struct AdminView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    
    @State private var password = ""
    @State private var isLoading = false
    @State private var errorMsg: String?
    
    var body: some View {
        let palette = theme.palette(for: scheme)
        
        VStack(spacing: 0) {
            CyberNavBar(title: "系统后台", showBackButton: true, showAboutButton: false)
            
            Group {
                if !appState.isAdminLoggedIn {
                    loginView(palette: palette)
                } else {
                    dashboardView(palette: palette)
                }
            }
        }
    }
    
    // Login
    private func loginView(palette: CyberPalette) -> some View {
        ScrollView {
            VStack(spacing: 30) {
                Image(systemName: "shield.lefthalf.filled")
                    .font(.system(size: 80))
                    .foregroundColor(palette.accent)
                    .shadow(color: palette.accentGlow, radius: 10)
                    .padding(.top, 40)
                
                Text("Admin Access")
                    .font(.title2).bold()
                
                SecureField("Enter Admin Password", text: $password)
                    .padding()
                    .background(Color.white.opacity(0.02))
                    .cornerRadius(8)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.3), lineWidth: 1))
                    .padding(.horizontal, 40)
                
                if let error = errorMsg {
                    Text(error)
                        .foregroundColor(palette.magenta)
                        .font(.footnote)
                }
                
                Button(action: login) {
                    HStack {
                        if isLoading {
                            ProgressView().tint(.black)
                        } else {
                            Text("LOGIN").bold()
                            Image(systemName: "arrow.right.circle.fill")
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(password.isEmpty ? Color.gray.opacity(0.3) : palette.accent)
                    .foregroundColor(password.isEmpty ? .secondary : .black)
                    .cornerRadius(12)
                }
                .disabled(password.isEmpty || isLoading)
                .padding(.horizontal, 40)
                
                Spacer()
            }
        }
    }
    
    // Dashboard
    private func dashboardView(palette: CyberPalette) -> some View {
        VStack {
            HStack {
                Spacer()
                Button("Logout") {
                    appState.adminLogout()
                }
                .foregroundColor(palette.magenta)
                .padding()
            }
            
            List {
                if appState.adminCapsules.isEmpty {
                    Text("No capsules found.")
                        .foregroundColor(.secondary)
                        .listRowBackground(Color.clear)
                } else {
                    ForEach(appState.adminCapsules) { capsule in
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text(capsule.title)
                                    .font(.headline)
                                Spacer()
                                Text(capsule.code)
                                    .font(.caption.monospaced())
                                    .padding(4)
                                    .background(Color.secondary.opacity(0.2))
                                    .cornerRadius(4)
                            }
                            HStack {
                                Text("Creator: \(capsule.creator)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Spacer()
                                if capsule.isUnlocked {
                                    Text("Unlocked")
                                        .font(.caption)
                                        .foregroundColor(.green)
                                } else {
                                    Text("Locked")
                                        .font(.caption)
                                        .foregroundColor(palette.magenta)
                                }
                            }
                        }
                        .padding(.vertical, 4)
                        .listRowBackground(Color.white.opacity(0.02))
                    }
                    .onDelete(perform: deleteCapsules)
                }
            }
            .scrollContentBackground(.hidden)
            .refreshable {
                try? await appState.fetchAdminCapsules()
            }
            .onAppear {
                Task {
                    try? await appState.fetchAdminCapsules()
                }
            }
        }
    }
    
    private func login() {
        errorMsg = nil
        isLoading = true
        
        Task {
            do {
                try await appState.adminLogin(password: password)
                password = ""
            } catch {
                errorMsg = "Login failed: \(error.localizedDescription)"
            }
            isLoading = false
        }
    }
    
    private func deleteCapsules(at offsets: IndexSet) {
        for index in offsets {
            let capsule = appState.adminCapsules[index]
            Task {
                try? await appState.deleteAdminCapsule(code: capsule.code)
            }
        }
    }
}

import SwiftUI

struct OpenView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    
    @State private var capsuleCode: String = ""
    @State private var isLoading = false
    @State private var errorMsg: String?
    @FocusState private var isInputFocused: Bool
    
    var body: some View {
        let palette = theme.palette(for: scheme)
        
        VStack(spacing: 0) {
            CyberNavBar(title: appState.fetchedCapsule == nil ? "开启时间胶囊" : "胶囊详情", showBackButton: true, showAboutButton: false)
            
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    if appState.fetchedCapsule == nil {
                        inputCard(palette: palette)
                    } else if let capsule = appState.fetchedCapsule {
                        detailCard(capsule: capsule, palette: palette)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .padding(.bottom, 40)
            }
        }
    }
    
    private func inputCard(palette: CyberPalette) -> some View {
        GlassPanel(padding: 30, cornerRadius: 20) {
            VStack(spacing: 30) {
                
                // Icon Header
                ZStack {
                    Circle()
                        .fill(palette.magenta.opacity(0.1))
                        .frame(width: 80, height: 80)
                    Image(systemName: "lock.open.display")
                        .font(.system(size: 32, weight: .light))
                        .foregroundColor(palette.magenta)
                        .shadow(color: palette.magentaDim, radius: 10)
                }
                .padding(.top, 10)
                
                VStack(spacing: 12) {
                    Text("输入提取码")
                        .font(.title3).bold()
                        .foregroundColor(.primary)
                    
                    Text("请输入 8 位时间胶囊提取码，若未到开启时间，内容将保持封存。")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(6)
                }
                
                TextField("如 A1B2C3D4", text: $capsuleCode)
                    .font(.system(size: 24, weight: .bold, design: .monospaced))
                    .multilineTextAlignment(.center)
                    .padding(.vertical, 16)
                    .background(Color.white.opacity(0.02))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(capsuleCode.count == 8 ? palette.magenta : Color.secondary.opacity(0.3), lineWidth: capsuleCode.count == 8 ? 2 : 1)
                    )
                    .textInputAutocapitalization(.characters)
                    .autocorrectionDisabled()
                    .focused($isInputFocused)
                    .onChange(of: capsuleCode) { old, new in
                        if new.count > 8 {
                            capsuleCode = String(new.prefix(8))
                        }
                        capsuleCode = capsuleCode.uppercased()
                    }
                
                if let error = errorMsg {
                    Text(error)
                        .foregroundColor(palette.magenta)
                        .font(.footnote)
                }
                
                Button(action: fetchCapsule) {
                    HStack {
                        if isLoading {
                            ProgressView().tint(.black)
                        } else {
                            Text("立即开启").bold()
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(capsuleCode.count == 8 ? palette.magenta : Color.gray.opacity(0.3))
                    .foregroundColor(capsuleCode.count == 8 ? .white : .secondary)
                    .cornerRadius(12)
                    .shadow(color: capsuleCode.count == 8 ? palette.magentaDim : .clear, radius: 10)
                }
                .disabled(capsuleCode.count != 8 || isLoading)
                .padding(.bottom, 10)
            }
        }
    }
    
    private func detailCard(capsule: Capsule, palette: CyberPalette) -> some View {
        VStack(spacing: 24) {
            
            // Header Card
            GlassPanel(padding: 24, cornerRadius: 20) {
                VStack(alignment: .leading, spacing: 16) {
                    Text(capsule.title)
                        .font(.title2).bold()
                        .foregroundColor(.primary)
                    
                    HStack {
                        Image(systemName: "person.circle.fill")
                        Text("创建者: \(capsule.creator)")
                            .font(.subheadline)
                    }
                    .foregroundColor(.secondary)
                    
                    HStack {
                        Image(systemName: "clock.fill")
                        Text("设定开启: \(formattedDate(capsule.openAt))")
                            .font(.subheadline)
                    }
                    .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            
            // Content Card
            GlassPanel(padding: 24, cornerRadius: 20) {
                VStack(spacing: 20) {
                    if let content = capsule.content {
                        Text(content)
                            .font(.body)
                            .foregroundColor(.primary)
                            .lineSpacing(8)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    } else {
                        VStack(spacing: 16) {
                            Image(systemName: "lock.shield.fill")
                                .font(.system(size: 60))
                                .foregroundColor(palette.magenta)
                                .shadow(color: palette.magentaDim, radius: 10)
                            
                            Text("胶囊仍处于封存状态")
                                .font(.headline)
                                .foregroundColor(.primary)
                                
                            Text("这颗胶囊将在 \(formattedDate(capsule.openAt)) 时解封。在此之前，时间是不允许被窥视的。")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .lineSpacing(6)
                        }
                        .padding(.vertical, 30)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            
            Button("关闭详情") {
                withAnimation {
                    appState.clearFetchedCapsule()
                    capsuleCode = ""
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color.secondary.opacity(0.2))
            .foregroundColor(.primary)
            .cornerRadius(12)
        }
    }
    
    private func fetchCapsule() {
        errorMsg = nil
        isLoading = true
        isInputFocused = false
        
        Task {
            do {
                try await appState.fetchCapsule(code: capsuleCode)
            } catch {
                errorMsg = "提取失败: \(error.localizedDescription)"
            }
            isLoading = false
        }
    }
    
    private func formattedDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

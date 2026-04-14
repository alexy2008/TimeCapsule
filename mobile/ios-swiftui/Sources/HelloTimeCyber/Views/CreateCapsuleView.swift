import SwiftUI

struct CreateCapsuleView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    
    @State private var title: String = ""
    @State private var content: String = ""
    @State private var creator: String = ""
    @State private var unlockDate: Date = Date().addingTimeInterval(86400)
    
    @State private var isLoading = false
    @State private var errorMsg: String?
    @State private var successPopup: SuccessPopupInfo?
    
    var body: some View {
        let palette = theme.palette(for: scheme)
        
        ZStack {
            VStack(spacing: 0) {
                CyberNavBar(title: "创建时间胶囊", showBackButton: true, showAboutButton: false)
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        
                        if let errorMsg = errorMsg {
                            Text(errorMsg)
                                .foregroundColor(palette.magenta)
                                .font(.footnote)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.horizontal, 20)
                        }
                        
                        GlassPanel(padding: 24, cornerRadius: 20) {
                            VStack(spacing: 24) {
                                
                                // Title Field
                                VStack(alignment: .leading, spacing: 10) {
                                    Text("标题").font(.subheadline).foregroundColor(.secondary)
                                    TextField("给时间胶囊取个名字", text: $title)
                                        .padding()
                                        .background(Color.white.opacity(0.01))
                                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.2), lineWidth: 1))
                                        .foregroundColor(.primary)
                                }
                                
                                // Content Field
                                VStack(alignment: .leading, spacing: 10) {
                                    Text("内容").font(.subheadline).foregroundColor(.secondary)
                                    TextEditor(text: $content)
                                        .frame(height: 150)
                                        .padding(8)
                                        .scrollContentBackground(.hidden)
                                        .background(Color.white.opacity(0.01))
                                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.2), lineWidth: 1))
                                        .foregroundColor(.primary)
                                }
                                
                                // Creator Field
                                VStack(alignment: .leading, spacing: 10) {
                                    Text("发布者").font(.subheadline).foregroundColor(.secondary)
                                    TextField("你的昵称", text: $creator)
                                        .padding()
                                        .background(Color.white.opacity(0.01))
                                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.2), lineWidth: 1))
                                        .foregroundColor(.primary)
                                }
                                
                                // Date Field
                                VStack(alignment: .leading, spacing: 10) {
                                    Text("开启时间").font(.subheadline).foregroundColor(.secondary)
                                    HStack {
                                        DatePicker("", selection: $unlockDate, in: Date()..., displayedComponents: [.date, .hourAndMinute])
                                            .labelsHidden()
                                            .environment(\.locale, Locale(identifier: "zh_CN"))
                                        Spacer()
                                    }
                                    .padding(.vertical, 8)
                                    .padding(.horizontal, 16)
                                    .background(Color.white.opacity(0.01))
                                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.2), lineWidth: 1))
                                }
                                
                                // Submit Button
                                HStack {
                                    Spacer()
                                    Button(action: submitCapsule) {
                                        HStack {
                                            if isLoading {
                                                ProgressView().tint(.black)
                                            } else {
                                                Text("封存胶囊").bold()
                                            }
                                        }
                                        .frame(width: 140, height: 48)
                                        .background(palette.accent) // Solid cyan
                                        .foregroundColor(.black)
                                        .cornerRadius(8)
                                        .shadow(color: palette.accentGlow.opacity(0.8), radius: 10)
                                    }
                                    .disabled(isLoading || title.isEmpty || content.isEmpty || creator.isEmpty)
                                    .opacity((isLoading || title.isEmpty || content.isEmpty || creator.isEmpty) ? 0.6 : 1.0)
                                }
                                .padding(.top, 10)
                            }
                        }
                        .padding(.horizontal, 20)
                        
                    }
                    .padding(.top, 10)
                    .padding(.bottom, 40)
                }
            }
            
            if let popup = successPopup {
                successOverlay(popup: popup, palette: palette)
            }
        }
    }
    
    private func submitCapsule() {
        errorMsg = nil
        isLoading = true
        
        Task {
            do {
                let capsule = try await appState.createCapsule(
                    title: title,
                    content: content,
                    creator: creator,
                    openAt: unlockDate
                )
                let formatter = DateFormatter()
                formatter.dateStyle = .medium
                formatter.timeStyle = .short
                successPopup = SuccessPopupInfo(code: capsule.code, openAt: formatter.string(from: capsule.openAt))
            } catch {
                errorMsg = error.localizedDescription
            }
            isLoading = false
        }
    }
    
    private func successOverlay(popup: SuccessPopupInfo, palette: CyberPalette) -> some View {
        ZStack {
            Color.black.opacity(0.7).ignoresSafeArea()
            GlassPanel(padding: 30, cornerRadius: 20) {
                VStack(spacing: 20) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 60))
                        .foregroundColor(palette.accent)
                        .shadow(color: palette.accentGlow, radius: 10)
                    
                    Text("胶囊已封存")
                        .font(.title2).bold()
                        .foregroundColor(.primary)
                    
                    Text("您的胶囊将被锁定至 \(popup.openAt)。\n请妥善保存以下提取凭证：")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(6)
                    
                    Text(popup.code)
                        .font(.system(size: 36, weight: .bold, design: .monospaced))
                        .foregroundColor(palette.accent)
                        .padding()
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(12)
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(palette.accent.opacity(0.5), lineWidth: 1))
                        .onTapGesture {
                            UIPasteboard.general.string = popup.code
                        }
                    
                    Text("点击代码复制")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Button(action: {
                        successPopup = nil
                        appState.navPath = []
                    }) {
                        Text("完成")
                            .bold()
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(palette.accent)
                            .foregroundColor(.black)
                            .cornerRadius(12)
                    }
                    .padding(.top, 10)
                }
            }
            .padding(.horizontal, 30)
        }
    }
}

struct SuccessPopupInfo {
    let code: String
    let openAt: String
}

import SwiftUI

// MARK: - Tech Stack Footer Bar
// Simplified single-line footer matching Tauri's AppFooter component:
// "HelloTime · 时间胶囊 · SwiftUI · Swift 6 · {backend} · {language} · {database}"
// The previous version rendered a large glass panel with icons; this version
// mirrors the compact `.stack-info.cyber-glass-sm` pattern used by all Web/Tauri frontends.

struct TechStackBar: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    var appState: AppState

    private func simplify(_ text: String) -> String {
        // Strip trailing version numbers like "Spring Boot 3.4.1" → "Spring"
        text.components(separatedBy: .whitespaces).first ?? text
    }

    var body: some View {
        let palette = theme.palette(for: scheme)

        let backendParts: [String] = {
            if appState.isTechStackLoading { return ["加载中..."] }
            guard !appState.techStackError, let ts = appState.techStack else { return ["技术栈信息暂不可用"] }
            return [simplify(ts.framework), simplify(ts.language), simplify(ts.database)]
        }()

        let summary = (["SwiftUI", "Swift 6"] + backendParts).joined(separator: " · ")

        HStack(spacing: 8) {
            StatusDot()
            Text("HelloTime · 时间胶囊 · \(summary)")
                .font(CyberFont.mono(size: 12))
                .foregroundStyle(palette.textSecondary)
                .opacity(0.82)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .glassPanel(cornerRadius: 8)
        .onAppear {
            if appState.techStack == nil {
                Task { await appState.fetchTechStack() }
            }
        }
    }
}

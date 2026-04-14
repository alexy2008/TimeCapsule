import SwiftUI

// MARK: - Glass Panel ViewModifier
// Reproduces .cyber-glass: semi-transparent background, blur, border, and a top gradient shimmer line.

struct GlassPanelModifier: ViewModifier {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var cornerRadius: CGFloat = 16

    func body(content: Content) -> some View {
        let palette = theme.palette(for: scheme)
        content
            .background(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .fill(palette.glassBg)
                    .overlay(
                        // top shimmer line: linear-gradient(90deg, transparent, cyan-glow, transparent)
                        VStack {
                            LinearGradient(
                                colors: [.clear, palette.accentGlow, .clear],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                            .frame(height: 1)
                            Spacer()
                        }
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: cornerRadius)
                            .stroke(palette.glassBorder, lineWidth: 1)
                    )
                    .shadow(color: .black.opacity(palette.isDark ? 0.4 : 0.08), radius: 20, x: 0, y: 8)
            )
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
    }
}

extension View {
    func glassPanel(cornerRadius: CGFloat = 16) -> some View {
        modifier(GlassPanelModifier(cornerRadius: cornerRadius))
    }
}

// MARK: - Glass Panel View (standalone container)

struct GlassPanel<Content: View>: View {
    var padding: CGFloat = 24
    var cornerRadius: CGFloat = 16
    @ViewBuilder var content: () -> Content

    var body: some View {
        content()
            .padding(padding)
            .glassPanel(cornerRadius: cornerRadius)
    }
}

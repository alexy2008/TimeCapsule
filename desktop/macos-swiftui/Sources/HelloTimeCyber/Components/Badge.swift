import SwiftUI

// MARK: - Badge variants (mirrors .badge-locked, .badge-unlocked, .hero-badge)

enum BadgeVariant {
    case locked     // red, pulsing
    case unlocked   // green
    case hero       // cyan outline (TIMECAPSULE SYSTEM)
    case info       // secondary
}

struct CyberBadge: View {
    var text: String
    var variant: BadgeVariant

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @State private var pulsing = false

    var body: some View {
        let palette = theme.palette(for: scheme)
        Text(text)
            .font(CyberFont.badge)
            .tracking(variant == .hero ? 2 : 0.5)
            .foregroundStyle(foregroundColor(palette: palette))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: 100)
                        .fill(backgroundColor(palette: palette))
                    RoundedRectangle(cornerRadius: 100)
                        .stroke(borderColor(palette: palette), lineWidth: 1)
                }
                .shadow(
                    color: variant == .locked && pulsing ? palette.red.opacity(0.4) : .clear,
                    radius: 8
                )
            )
            .onAppear {
                if variant == .locked {
                    withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
                        pulsing = true
                    }
                }
            }
    }

    private func foregroundColor(palette: CyberPalette) -> Color {
        switch variant {
        case .locked:   return palette.red
        case .unlocked: return palette.green
        case .hero:     return palette.accent
        case .info:     return palette.textSecondary
        }
    }

    private func backgroundColor(palette: CyberPalette) -> Color {
        switch variant {
        case .locked:   return palette.red.opacity(0.1)
        case .unlocked: return palette.green.opacity(0.1)
        case .hero:     return palette.accent.opacity(0.05)
        case .info:     return palette.textMuted.opacity(0.1)
        }
    }

    private func borderColor(palette: CyberPalette) -> Color {
        switch variant {
        case .locked:   return palette.red
        case .unlocked: return palette.green
        case .hero:     return palette.accentDim
        case .info:     return palette.glassBorder
        }
    }
}

// MARK: - Status dot (green pulsing, mirrors .status-dot.green)

struct StatusDot: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @State private var glowing = false

    var body: some View {
        let palette = theme.palette(for: scheme)
        Circle()
            .fill(palette.green)
            .frame(width: 8, height: 8)
            .shadow(color: glowing ? palette.green : .clear, radius: 5)
            .onAppear {
                withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                    glowing = true
                }
            }
    }
}

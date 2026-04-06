import SwiftUI

// MARK: - Button style enumerations (mirroring .btn-primary, .btn-secondary, .btn-outline, .btn-danger-outline)

enum GlowButtonVariant {
    case primary    // cyan fill + glow on hover
    case secondary  // transparent + cyan border
    case outline    // transparent + subtle border
    case danger     // transparent + red border
    case icon       // square icon button
}

// MARK: - Primary Glow Button (with scanner shimmer on hover)

struct GlowButton: View {
    var label: String
    var icon: String? = nil
    var variant: GlowButtonVariant = .primary
    var isLoading: Bool = false
    var isSmall: Bool = false
    var action: () -> Void

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @State private var hovered = false
    @State private var scanOffset: CGFloat = -1

    var body: some View {
        let palette = theme.palette(for: scheme)
        Button(action: action) {
            HStack(spacing: 6) {
                if let icon { Image(systemName: icon) }
                if isLoading {
                    ProgressView().scaleEffect(0.7)
                } else {
                    Text(label)
                }
            }
            .font(isSmall ? CyberFont.sans(size: 13, weight: .medium) : CyberFont.button)
            .foregroundStyle(foregroundColor(palette: palette))
            .padding(.horizontal, isSmall ? 12 : 20)
            .padding(.vertical, isSmall ? 6 : 10)
            .frame(minWidth: isSmall ? 60 : 100)
            .background(
                RoundedRectangle(cornerRadius: 4)
                    .fill(backgroundColor(palette: palette))
                    .overlay(
                        // scanner shimmer for primary variant
                        Group {
                            if variant == .primary && hovered {
                                GeometryReader { geo in
                                    Rectangle()
                                        .fill(
                                            LinearGradient(
                                                colors: [.clear, .white.opacity(0.6), .clear],
                                                startPoint: .leading,
                                                endPoint: .trailing
                                            )
                                        )
                                        .frame(width: geo.size.width * 0.2)
                                        .skewX(-20)
                                        .offset(x: scanOffset * geo.size.width)
                                        .animation(
                                            .linear(duration: 1.2).repeatForever(autoreverses: false),
                                            value: scanOffset
                                        )
                                        .clipped()
                                }
                            }
                        }
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(borderColor(palette: palette), lineWidth: 1)
                    )
            )
            .shadow(
                color: (variant == .primary && hovered) ? palette.accentGlow : .clear,
                radius: 12
            )
        }
        .buttonStyle(.plain)
        .pointerCursor()
        .onHover { over in
            hovered = over
            if over && variant == .primary {
                scanOffset = -1
                withAnimation(.linear(duration: 1.2).repeatForever(autoreverses: false)) {
                    scanOffset = 2
                }
            } else {
                scanOffset = -1
            }
        }
        .scaleEffect(hovered ? 1.02 : 1.0)
        .animation(.easeOut(duration: 0.15), value: hovered)
    }

    private func backgroundColor(palette: CyberPalette) -> Color {
        switch variant {
        case .primary:
            return hovered ? palette.accent.opacity(0.9) : palette.accent
        case .secondary, .outline, .danger, .icon:
            return hovered ? (variant == .danger ? palette.red.opacity(0.1) : palette.accentDim) : .clear
        }
    }

    private func foregroundColor(palette: CyberPalette) -> Color {
        switch variant {
        case .primary:
            return palette.isDark ? .bgBase : .white
        case .secondary:
            return palette.accent
        case .danger:
            return palette.red
        case .outline, .icon:
            return palette.textPrimary
        }
    }

    private func borderColor(palette: CyberPalette) -> Color {
        switch variant {
        case .primary:  return .clear
        case .secondary: return palette.accent
        case .danger:   return hovered ? palette.red : palette.red.opacity(0.4)
        case .outline, .icon: return hovered ? palette.textSecondary : palette.glassBorder
        }
    }
}

// MARK: - Skew modifier helper

extension View {
    func skewX(_ degrees: Double) -> some View {
        transformEffect(.init(a: 1, b: 0, c: CGFloat(tan(degrees * .pi / 180)), d: 1, tx: 0, ty: 0))
    }
}

// MARK: - Hand Cursor modifier

extension View {
    func pointerCursor() -> some View {
        self.onHover { inside in
            if inside {
                NSCursor.pointingHand.push()
            } else {
                NSCursor.pop()
            }
        }
    }
}

// MARK: - Back button (← 返回)

struct BackButton: View {
    var label: String = "返回"
    var action: () -> Void

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @State private var hovered = false

    var body: some View {
        let palette = theme.palette(for: scheme)
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: "arrow.left")
                Text(label)
            }
            .font(CyberFont.navLink)
            .foregroundStyle(hovered ? palette.accent : palette.textSecondary)
        }
        .buttonStyle(.plain)
        .pointerCursor()
        .onHover { hovered = $0 }
        .animation(.easeOut(duration: 0.2), value: hovered)
    }
}

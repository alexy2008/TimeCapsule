import SwiftUI

// MARK: - Grid Background
// Reproduces .background-grid: a 40×40 px grid masked by a radial gradient.

struct BackgroundGrid: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var body: some View {
        Canvas { ctx, size in
            let palette = theme.palette(for: scheme)
            let step: CGFloat = 40
            let lineColor = palette.isDark
                ? Color(hex: 0x141E32).opacity(0.4)
                : Color.black.opacity(0.05)

            ctx.stroke(
                Path { path in
                    var x: CGFloat = 0
                    while x <= size.width {
                        path.move(to: CGPoint(x: x, y: 0))
                        path.addLine(to: CGPoint(x: x, y: size.height))
                        x += step
                    }
                    var y: CGFloat = 0
                    while y <= size.height {
                        path.move(to: CGPoint(x: 0, y: y))
                        path.addLine(to: CGPoint(x: size.width, y: y))
                        y += step
                    }
                },
                with: .color(lineColor),
                lineWidth: 1
            )
        }
        // Radial-gradient mask: visible in center, fading toward edges
        .mask(
            RadialGradient(
                colors: [.black, .clear],
                center: .center,
                startRadius: 0,
                endRadius: 500
            )
        )
        .ignoresSafeArea()
    }
}

// MARK: - Ambient Glow
// Reproduces .ambient-glow: a pulsing radial cyan blob at the center.

struct AmbientGlow: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @State private var pulsing = false

    var body: some View {
        let palette = theme.palette(for: scheme)
        GeometryReader { geo in
            RadialGradient(
                colors: [palette.accentDim, .clear],
                center: .center,
                startRadius: 0,
                endRadius: min(geo.size.width, geo.size.height) * 0.5
            )
            .frame(
                width: geo.size.width * 0.6,
                height: geo.size.height * 0.6
            )
            .position(x: geo.size.width / 2, y: geo.size.height / 2)
            .scaleEffect(pulsing ? 1.1 : 1.0)
            .opacity(pulsing ? 0.7 : 0.4)
            .animation(
                .easeInOut(duration: 8).repeatForever(autoreverses: true),
                value: pulsing
            )
            .onAppear { pulsing = true }
        }
        .ignoresSafeArea()
        .allowsHitTesting(false)
    }
}

// MARK: - Full background stack (grid + glow)

struct CyberBackground: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var body: some View {
        let palette = theme.palette(for: scheme)
        ZStack {
            palette.bgBase.ignoresSafeArea()
            BackgroundGrid()
            AmbientGlow()
        }
    }
}

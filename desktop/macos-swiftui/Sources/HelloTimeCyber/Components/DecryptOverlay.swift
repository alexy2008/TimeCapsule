import SwiftUI

// MARK: - Decrypt Animation Overlay
// Reproduces .decrypt-animation-overlay: a scanner beam sweeping down + binary rain fading out.

struct DecryptOverlay: View {
    @State private var scanY: CGFloat = -50
    @State private var binaryOpacity: Double = 0.5
    @State private var overlayOpacity: Double = 1
    @State private var didFinish = false

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var body: some View {
        let palette = theme.palette(for: scheme)

        GeometryReader { geo in
            ZStack(alignment: .top) {
                // Dark overlay background
                RoundedRectangle(cornerRadius: 0)
                    .fill(palette.isDark ? Color(hex: 0x0A0F19).opacity(0.95) : Color.white.opacity(0.95))

                // Binary rain text
                Text(binaryRain)
                    .font(CyberFont.mono(size: 12))
                    .foregroundStyle(palette.green)
                    .opacity(binaryOpacity)
                    .padding()
                    .lineLimit(nil)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)

                // Scanner beam
                Rectangle()
                    .fill(
                        LinearGradient(
                            colors: [.clear, palette.green.opacity(0.5)],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .frame(height: 50)
                    .overlay(
                        Rectangle()
                            .fill(palette.green)
                            .frame(height: 2),
                        alignment: .bottom
                    )
                    .offset(y: scanY)
                    .clipped()
            }
            .opacity(overlayOpacity)
            .onAppear { animate(height: geo.size.height) }
        }
        .allowsHitTesting(false)
    }

    private let binaryRain = String(repeating: "01001010 01100101 01101100 01101100 01111001 00100000 01100110 01101001 01110011 01101000 00001010 ", count: 10)

    private func animate(height: CGFloat) {
        withAnimation(.linear(duration: 2.5)) {
            scanY = height + 50
        }
        withAnimation(.easeIn(duration: 1.5).delay(1.5)) {
            binaryOpacity = 0
        }
        withAnimation(.easeIn(duration: 0.8).delay(2.5)) {
            overlayOpacity = 0
            didFinish = true
        }
    }
}

// MARK: - Tech Orb (About page decoration)
// Reproduces .tech-orb with rotating rings and a glowing core.

struct TechOrb: View {
    @State private var rotating1 = false
    @State private var rotating2 = false

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var body: some View {
        let palette = theme.palette(for: scheme)
        ZStack {
            // Ring 2 (outer, counter-clockwise)
            Circle()
                .stroke(
                    palette.accentDim,
                    style: StrokeStyle(lineWidth: 1, dash: [])
                )
                .frame(width: 120, height: 120)
                .overlay(
                    Circle()
                        .trim(from: 0, to: 0.15)
                        .stroke(palette.accent, lineWidth: 2)
                        .frame(width: 120, height: 120)
                )
                .rotationEffect(.degrees(rotating2 ? -360 : 0))
                .animation(.linear(duration: 15).repeatForever(autoreverses: false), value: rotating2)

            // Ring 1 (inner, clockwise)
            Circle()
                .stroke(
                    palette.accentDim,
                    style: StrokeStyle(lineWidth: 1, dash: [])
                )
                .frame(width: 80, height: 80)
                .overlay(
                    Circle()
                        .trim(from: 0, to: 0.15)
                        .stroke(palette.accent, lineWidth: 2)
                        .frame(width: 80, height: 80)
                )
                .rotationEffect(.degrees(rotating1 ? 360 : 0))
                .animation(.linear(duration: 10).repeatForever(autoreverses: false), value: rotating1)

            // Core
            Circle()
                .fill(palette.accent)
                .frame(width: 20, height: 20)
                .shadow(color: palette.accentGlow, radius: 15)
        }
        .frame(width: 120, height: 120)
        .onAppear {
            rotating1 = true
            rotating2 = true
        }
    }
}

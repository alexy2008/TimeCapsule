import SwiftUI

// MARK: - Countdown Clock
// Reproduces .countdown-display: striped background + days:hours:mins:secs in mono font with blinking colons.

struct CountdownClock: View {
    var targetDate: Date
    var onExpired: (() -> Void)? = nil

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @State private var remaining: TimeInterval = 0
    @State private var colonVisible = true
    @State private var timer: Timer? = nil

    var body: some View {
        let palette = theme.palette(for: scheme)

        ZStack {
            // Striped background (matches repeating-linear-gradient in CSS)
            Canvas { ctx, size in
                let stripeWidth: CGFloat = 14
                var x: CGFloat = -size.height
                while x < size.width + size.height {
                    let path = Path(CGRect(x: x, y: 0, width: stripeWidth / 2, height: size.height))
                    ctx.fill(
                        path.applying(.init(a: 1, b: 0, c: 0.5, d: 1, tx: 0, ty: 0)),
                        with: .color((palette.isDark ? Color.black : Color.black).opacity(0.2))
                    )
                    x += stripeWidth
                }
            }

            if remaining > 0 {
                HStack(spacing: 16) {
                    timeBlock(value: days, unit: "天", palette: palette)
                    colonSeparator(palette: palette)
                    timeBlock(value: hours, unit: "时", palette: palette)
                    colonSeparator(palette: palette)
                    timeBlock(value: minutes, unit: "分", palette: palette)
                    colonSeparator(palette: palette)
                    timeBlock(value: seconds, unit: "秒", palette: palette)
                }
                .padding(.vertical, 40)
                .padding(.horizontal, 32)
            } else {
                Text("已解锁")
                    .font(CyberFont.countdown)
                    .foregroundStyle(palette.green)
                    .shadow(color: palette.green.opacity(0.6), radius: 10)
                    .padding(.vertical, 40)
            }
        }
        .onAppear { start() }
        .onDisappear { timer?.invalidate() }
    }

    private func timeBlock(value: Int, unit: String, palette: CyberPalette) -> some View {
        VStack(spacing: 4) {
            Text(String(format: "%02d", value))
                .font(CyberFont.countdown)
                .foregroundStyle(palette.textPrimary)
                .monospacedDigit()
            Text(unit)
                .font(CyberFont.countdownUnit)
                .foregroundStyle(palette.textSecondary)
                .tracking(3)
        }
    }

    private func colonSeparator(palette: CyberPalette) -> some View {
        Text(":")
            .font(CyberFont.countdown)
            .foregroundStyle(palette.red)
            .opacity(colonVisible ? 1 : 0.2)
            .padding(.bottom, 16)
    }

    // MARK: - Time components
    private var days:    Int { max(0, Int(remaining) / 86400) }
    private var hours:   Int { max(0, (Int(remaining) % 86400) / 3600) }
    private var minutes: Int { max(0, (Int(remaining) % 3600) / 60) }
    private var seconds: Int { max(0, Int(remaining) % 60) }

    private func start() {
        update()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [self] _ in
            update()
        }
        // Blink colon every 0.5s
        Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [self] t in
            colonVisible.toggle()
            if remaining <= 0 { t.invalidate() }
        }
    }

    private func update() {
        let diff = targetDate.timeIntervalSinceNow
        if diff <= 0 {
            remaining = 0
            timer?.invalidate()
            onExpired?()
        } else {
            remaining = diff
        }
    }
}

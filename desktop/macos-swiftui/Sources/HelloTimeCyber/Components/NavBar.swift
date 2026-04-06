import SwiftUI

// MARK: - Navigation destination enum (mirrors web routes)

enum NavDestination: CaseIterable, Equatable {
    case home, create, open, about, admin
}

// MARK: - Top Navigation Bar
// Mirrors .app-header: logo left, nav links + theme toggle right.
// Active link shows a cyan underline animation (.top-nav a.active::after).

struct NavBar: View {
    @Binding var current: NavDestination
    var theme: CyberTheme

    @Environment(\.colorScheme) private var scheme
    @State private var logoHovered = false

    var body: some View {
        let palette = theme.palette(for: scheme)

        HStack(spacing: 0) {
            // Logo (Favicon + HelloTime)
            Button {
                current = .home
            } label: {
                HStack(spacing: 12) {
                    ZStack {
                        if let url = Bundle.module.url(forResource: "logo", withExtension: "png"),
                           let nsImage = NSImage(contentsOf: url) {
                            Image(nsImage: nsImage)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 28, height: 28)
                        } else {
                            // Fallback icon if image really can't be found/loaded
                            Text("⧗")
                                .font(.system(size: 20))
                                .foregroundStyle(palette.accent.opacity(0.3))
                        }
                    }
                    .frame(width: 28, height: 28)
                    .shadow(color: palette.accentGlow, radius: logoHovered ? 12 : 8)
                    .scaleEffect(logoHovered ? 1.1 : 1.0)
                    
                    Text("HelloTime")
                        .font(CyberFont.mono(size: 18, weight: .bold))
                        .foregroundStyle(logoHovered ? palette.accent : palette.textPrimary)
                        .shadow(color: logoHovered ? palette.accentGlow.opacity(0.5) : .clear, radius: 4)
                }
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: logoHovered)
            }
            .buttonStyle(.plain)
            .pointerCursor()
            .onHover { logoHovered = $0 }

            Spacer()

            // Navigation links
            HStack(spacing: 32) {
                NavLink(label: "关于", dest: .about, current: $current, palette: palette)
            }
            .padding(.trailing, 24)

            // Theme toggle button
            Button {
                theme.toggle()
            } label: {
                Image(systemName: theme.appearance == .light ? "moon.fill" : "sun.max.fill")
                    .font(.system(size: 16))
                    .foregroundStyle(palette.textPrimary)
                    .padding(8)
                    .background(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(palette.glassBorder, lineWidth: 1)
                    )
            }
            .buttonStyle(.plain)
            .pointerCursor()
        }
        .padding(.horizontal, 40)
        .padding(.vertical, 20)
    }
}

// MARK: - Individual nav link with active underline animation

private struct NavLink: View {
    var label: String
    var dest: NavDestination
    @Binding var current: NavDestination
    var palette: CyberPalette

    @State private var hovered = false

    var isActive: Bool { current == dest }

    var body: some View {
        Button {
            current = dest
        } label: {
            Text(label)
                .font(CyberFont.navLink)
                .foregroundStyle(
                    (isActive || hovered) ? palette.accent : palette.textSecondary
                )
                .shadow(color: (isActive || hovered) ? palette.accentGlow : .clear, radius: 5)
                .padding(.bottom, 6)
                .overlay(
                    Rectangle()
                        .fill(palette.accent)
                        .frame(height: 2)
                        .shadow(color: palette.accent, radius: 4)
                        .scaleEffect(x: (isActive || hovered) ? 1 : 0, anchor: .leading)
                        .animation(.easeOut(duration: 0.25), value: isActive || hovered),
                    alignment: .bottom
                )
        }
        .buttonStyle(.plain)
        .pointerCursor()
        .onHover { hovered = $0 }
    }
}

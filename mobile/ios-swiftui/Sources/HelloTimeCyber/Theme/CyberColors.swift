import SwiftUI

// MARK: - Cyber Color Palette
// Mirrors the CSS custom properties in spec/styles/cyber.css exactly.

extension Color {
    // MARK: Dark-mode base (default)
    static let bgBase      = Color(hex: 0x030712)
    static let bgGrid      = Color(hex: 0x141E32).opacity(0.4)

    // MARK: Neon accents
    static let neonCyan    = Color(hex: 0x00F0FF)
    static let neonCyanDim = Color(hex: 0x00F0FF).opacity(0.2)
    static let neonCyanGlow = Color(hex: 0x00F0FF).opacity(0.5)

    static let neonMagenta    = Color(hex: 0xFF003C)
    static let neonMagentaDim = Color(hex: 0xFF003C).opacity(0.2)

    static let neonGreen  = Color(hex: 0x39FF14)
    static let redAlert   = Color(hex: 0xFF3366)

    // MARK: Text hierarchy
    static let textPrimary   = Color(hex: 0xF8FAFC)
    static let textSecondary = Color(hex: 0x94A3B8)
    static let textMuted     = Color(hex: 0x475569)

    // MARK: Glass panel
    static let glassBg     = Color(hex: 0x0F172A).opacity(0.4)
    static let glassBorder = Color(hex: 0x38BDF8).opacity(0.15)

    // MARK: Light-mode overrides — accessed via theme-aware helpers below
    static let lightBgBase      = Color(hex: 0xF0F4F8)
    static let lightNeonCyan    = Color(hex: 0x0077FF)
    static let lightNeonCyanDim = Color(hex: 0x0077FF).opacity(0.1)
    static let lightNeonCyanGlow = Color(hex: 0x0077FF).opacity(0.3)
    static let lightNeonMagenta  = Color(hex: 0xE6004C)
    static let lightTextPrimary  = Color(hex: 0x1E293B)
    static let lightTextSecondary = Color(hex: 0x475569)
    static let lightTextMuted    = Color(hex: 0x64748B)
    static let lightGlassBg      = Color.white.opacity(0.6)
    static let lightGlassBorder  = Color.black.opacity(0.1)

    // MARK: Hex initialiser
    init(hex: UInt32, opacity: Double = 1) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8)  & 0xFF) / 255
        let b = Double(hex         & 0xFF) / 255
        self.init(red: r, green: g, blue: b, opacity: opacity)
    }
}

// MARK: - Theme-aware color resolver
struct CyberPalette {
    let isDark: Bool

    var bgBase:       Color { isDark ? .bgBase       : .lightBgBase }
    var accent:       Color { isDark ? .neonCyan      : .lightNeonCyan }
    var accentDim:    Color { isDark ? .neonCyanDim   : .lightNeonCyanDim }
    var accentGlow:   Color { isDark ? .neonCyanGlow  : .lightNeonCyanGlow }
    var magenta:      Color { isDark ? .neonMagenta   : .lightNeonMagenta }
    var magentaDim:   Color { isDark ? .neonMagentaDim : .lightNeonMagenta.opacity(0.1) }
    var textPrimary:  Color { isDark ? .textPrimary   : .lightTextPrimary }
    var textSecondary: Color { isDark ? .textSecondary : .lightTextSecondary }
    var textMuted:    Color { isDark ? .textMuted     : .lightTextMuted }
    var glassBg:      Color { isDark ? .glassBg       : .lightGlassBg }
    var glassBorder:  Color { isDark ? .glassBorder   : .lightGlassBorder }
    var green:        Color { isDark ? .neonGreen     : Color(hex: 0x00AA00) }
    var red:          Color { .redAlert }
}

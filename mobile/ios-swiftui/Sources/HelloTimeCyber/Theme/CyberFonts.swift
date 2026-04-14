import SwiftUI

// Mirrors --font-sans (Inter/system-ui) and --font-mono (JetBrains Mono / SF Mono).
// On macOS the closest built-in equivalents are used since web fonts aren't available natively.

enum CyberFont {
    // --font-sans equivalent: Inter → SF Pro (system default on macOS)
    static func sans(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .default)
    }

    // --font-mono equivalent: JetBrains Mono → SF Mono
    static func mono(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }

    // Predefined scale matching web typography
    static let heroTitle:    Font = .system(size: 40, weight: .bold,    design: .default)
    static let heroSubtitle: Font = .system(size: 16, weight: .regular, design: .default)
    static let navLink:      Font = .system(size: 14, weight: .medium,  design: .default)
    static let cardTitle:    Font = .system(size: 22, weight: .bold,    design: .default)
    static let cardBody:     Font = .system(size: 14, weight: .regular, design: .default)
    static let label:        Font = .system(size: 12, weight: .regular, design: .monospaced)
    static let badge:        Font = .system(size: 11, weight: .bold,    design: .monospaced)
    static let codeDisplay:  Font = .system(size: 32, weight: .bold,    design: .monospaced)
    static let countdown:    Font = .system(size: 36, weight: .bold,    design: .monospaced)
    static let countdownUnit: Font = .system(size: 11, weight: .regular, design: .default)
    static let formLabel:    Font = .system(size: 12, weight: .regular, design: .monospaced)
    static let button:       Font = .system(size: 15, weight: .semibold, design: .default)
    static let tableHeader:  Font = .system(size: 11, weight: .regular, design: .monospaced)
    static let tableBody:    Font = .system(size: 13, weight: .regular, design: .default)
}

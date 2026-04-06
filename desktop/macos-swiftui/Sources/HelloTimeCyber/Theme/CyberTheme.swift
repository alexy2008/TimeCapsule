import SwiftUI

// MARK: - Appearance options
enum CyberAppearance: String, CaseIterable, Identifiable {
    case system = "system"
    case dark   = "dark"
    case light  = "light"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .system: return "跟随系统"
        case .dark:   return "深色模式"
        case .light:  return "浅色模式"
        }
    }

    var colorScheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .dark:   return .dark
        case .light:  return .light
        }
    }
}

// MARK: - Theme manager (ObservableObject for iOS14-compat; @Observable on macOS14+)
@Observable
final class CyberTheme {
    var appearance: CyberAppearance = .dark

    // Call from a view that has access to the environment color scheme
    func palette(for scheme: ColorScheme) -> CyberPalette {
        let isDark: Bool
        switch appearance {
        case .system: isDark = (scheme == .dark)
        case .dark:   isDark = true
        case .light:  isDark = false
        }
        return CyberPalette(isDark: isDark)
    }

    var preferredColorScheme: ColorScheme? {
        appearance.colorScheme
    }

    func toggle() {
        switch appearance {
        case .system: appearance = .dark
        case .dark:   appearance = .light
        case .light:  appearance = .dark
        }
    }
}

// MARK: - Environment key so all child views can access theme & palette
private struct ThemeKey: EnvironmentKey {
    nonisolated(unsafe) static let defaultValue = CyberTheme()
}

extension EnvironmentValues {
    var cyberTheme: CyberTheme {
        get { self[ThemeKey.self] }
        set { self[ThemeKey.self] = newValue }
    }
}

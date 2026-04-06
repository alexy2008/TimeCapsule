import SwiftUI

// MARK: - Single-line Cyber Input Field
// Reproduces .cyber-input: dark translucent bg, border, cyan focus glow.

struct CyberInputField: View {
    var label: String
    var placeholder: String = ""
    var helpText: String? = nil
    var isMonospace: Bool = false
    @Binding var text: String

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @FocusState private var focused: Bool

    var body: some View {
        let palette = theme.palette(for: scheme)
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(CyberFont.formLabel)
                .foregroundStyle(palette.textSecondary)

            TextField(placeholder, text: $text)
                .textFieldStyle(.plain)
                .font(isMonospace ? CyberFont.mono(size: 14) : CyberFont.sans(size: 14))
                .foregroundStyle(palette.textPrimary)
                .padding(.horizontal, 12)
                .padding(.vertical, 10)
                .background(
                    RoundedRectangle(cornerRadius: 4)
                        .fill(palette.isDark ? Color(hex: 0x0A0F19).opacity(0.5) : Color.white.opacity(0.8))
                        .overlay(
                            RoundedRectangle(cornerRadius: 4)
                                .stroke(
                                    focused ? palette.accent : palette.glassBorder,
                                    lineWidth: focused ? 1.5 : 1
                                )
                        )
                        .shadow(
                            color: focused ? palette.accentDim : .clear,
                            radius: 8
                        )
                )
                .focused($focused)
                .animation(.easeOut(duration: 0.2), value: focused)

            if let helpText {
                Text(helpText)
                    .font(CyberFont.sans(size: 11))
                    .foregroundStyle(palette.textMuted)
            }
        }
    }
}

// MARK: - Multi-line Cyber TextEditor

struct CyberTextEditor: View {
    var label: String
    var placeholder: String = ""
    var helpText: String? = nil
    var minHeight: CGFloat = 120
    @Binding var text: String

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @FocusState private var focused: Bool

    var body: some View {
        let palette = theme.palette(for: scheme)
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(CyberFont.formLabel)
                .foregroundStyle(palette.textSecondary)

            ZStack(alignment: .topLeading) {
                if text.isEmpty {
                    Text(placeholder)
                        .font(CyberFont.sans(size: 14))
                        .foregroundStyle(palette.textMuted)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .allowsHitTesting(false)
                }
                TextEditor(text: $text)
                    .scrollContentBackground(.hidden)
                    .font(CyberFont.sans(size: 14))
                    .foregroundStyle(palette.textPrimary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .focused($focused)
                    .frame(minHeight: minHeight)
            }
            .background(
                RoundedRectangle(cornerRadius: 4)
                    .fill(palette.isDark ? Color(hex: 0x0A0F19).opacity(0.5) : Color.white.opacity(0.8))
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(
                                focused ? palette.accent : palette.glassBorder,
                                lineWidth: focused ? 1.5 : 1
                            )
                    )
                    .shadow(color: focused ? palette.accentDim : .clear, radius: 8)
            )
            .animation(.easeOut(duration: 0.2), value: focused)

            if let helpText {
                Text(helpText)
                    .font(CyberFont.sans(size: 11))
                    .foregroundStyle(palette.textMuted)
            }
        }
    }
}

// MARK: - Datetime picker (wraps DatePicker with cyber styling)

struct CyberDatePicker: View {
    var label: String
    var helpText: String? = nil
    @Binding var date: Date

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme

    var body: some View {
        let palette = theme.palette(for: scheme)
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(CyberFont.formLabel)
                .foregroundStyle(palette.textSecondary)

            DatePicker("", selection: $date, in: Date()..., displayedComponents: [.date, .hourAndMinute])
                .labelsHidden()
                .datePickerStyle(.compact)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 4)
                        .fill(palette.isDark ? Color(hex: 0x0A0F19).opacity(0.5) : Color.white.opacity(0.8))
                        .overlay(
                            RoundedRectangle(cornerRadius: 4)
                                .stroke(palette.glassBorder, lineWidth: 1)
                        )
                )

            if let helpText {
                Text(helpText)
                    .font(CyberFont.sans(size: 11))
                    .foregroundStyle(palette.textMuted)
            }
        }
    }
}

// MARK: - Code search input (large mono, centre-aligned, bottom border)

struct CapsuleCodeSearchInput: View {
    @Binding var code: String
    var onSubmit: (String) -> Void

    @Environment(\.colorScheme) private var scheme
    @Environment(\.cyberTheme) private var theme
    @FocusState private var focused: Bool

    var body: some View {
        let palette = theme.palette(for: scheme)
        TextField("", text: $code)
            .textFieldStyle(.plain)
            .font(CyberFont.mono(size: 32, weight: .bold))
            .multilineTextAlignment(.center)
            .foregroundStyle(palette.textPrimary)
            .tracking(8)
            .onChange(of: code) { _, new in
                // uppercase & limit to 8 chars
                let filtered = new.uppercased().filter { $0.isLetter || $0.isNumber }
                if filtered != new { code = filtered }
                if code.count > 8 { code = String(code.prefix(8)) }
            }
            .onSubmit { if code.count == 8 { onSubmit(code) } }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(
                ZStack(alignment: .bottom) {
                    RoundedRectangle(cornerRadius: 0)
                        .fill(palette.isDark ? Color(hex: 0x000000).opacity(0.4) : Color.white.opacity(0.4))
                    // Bottom cyan border effect
                    Rectangle()
                        .fill(palette.accent)
                        .frame(height: 2)
                }
                .overlay(
                    RoundedRectangle(cornerRadius: 0)
                        .stroke(palette.accentDim, lineWidth: 1)
                )
            )
            .focused($focused)
    }
}

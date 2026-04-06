import XCTest

final class HelloTimeCyberTests: XCTestCase {
    func testCyberPaletteIsDark() {
        let dark = CyberPalette(isDark: true)
        XCTAssertTrue(dark.isDark)
    }

    func testCyberPaletteIsLight() {
        let light = CyberPalette(isDark: false)
        XCTAssertFalse(light.isDark)
    }
}

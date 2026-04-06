import AppKit
import SwiftUI

@main
struct HelloTimeCyberApp: App {
    init() {
        // Ensure the app shows in Dock and has a menu bar when run via 'swift run'
        NSApplication.shared.setActivationPolicy(.regular)
        
        // Load custom app icon from resources package bundle
        if let url = Bundle.module.url(forResource: "logo", withExtension: "png"),
           let image = NSImage(contentsOf: url) {
            NSApplication.shared.applicationIconImage = image
        }
    }

    var body: some Scene {
        WindowGroup("HelloTime") {
            RootView()
                .onAppear {
                    // Bring the window to the front on launch
                    NSApplication.shared.activate(ignoringOtherApps: true)
                }
        }
        .windowStyle(.hiddenTitleBar)
        .windowResizability(.contentMinSize)
        .defaultSize(width: 1200, height: 800)
    }
}

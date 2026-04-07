import SwiftUI

// MARK: - Remote SVG Image Loader
// Loads SVG images from a URL using URLSession + NSImage (which natively supports SVG on macOS).
// Falls back to an SF Symbol icon on failure.
// Used for backend tech logos served at /tech-logos/*.svg, mirroring
// the Tauri/Web pattern of `<img src="http://localhost:8080/tech-logos/backend.svg">`.

struct RemoteSVGImage: View {
    let url: URL
    let fallbackSystemName: String
    let size: CGFloat

    @State private var nsImage: NSImage?
    @State private var loaded = false

    var body: some View {
        Group {
            if let nsImage {
                Image(nsImage: nsImage)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } else if loaded {
                // Load failed → SF Symbol fallback
                Image(systemName: fallbackSystemName)
                    .font(.system(size: size * 0.7))
                    .foregroundStyle(.secondary)
            } else {
                ProgressView()
                    .controlSize(.small)
            }
        }
        .frame(width: size, height: size)
        .task {
            do {
                let (data, _) = try await URLSession.shared.data(from: url)
                if let img = NSImage(data: data) {
                    nsImage = img
                }
            } catch {
                // Fall through to show SF Symbol fallback
            }
            loaded = true
        }
    }
}

// MARK: - Bundle Logo Image
// Loads an icon from the Swift Package Bundle (.module) by resource name.
// Tries .svg first, then .png.

struct BundleLogoImage: View {
    let resourceName: String
    let size: CGFloat

    var body: some View {
        let nsImage: NSImage? = {
            if let url = Bundle.module.url(forResource: resourceName, withExtension: "svg"),
               let data = try? Data(contentsOf: url) {
                return NSImage(data: data)
            }
            if let url = Bundle.module.url(forResource: resourceName, withExtension: "png"),
               let data = try? Data(contentsOf: url) {
                return NSImage(data: data)
            }
            return nil
        }()

        Group {
            if let nsImage {
                Image(nsImage: nsImage)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } else {
                Image(systemName: "questionmark.circle")
                    .font(.system(size: size * 0.7))
                    .foregroundStyle(.secondary)
            }
        }
        .frame(width: size, height: size)
    }
}

// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "HelloTimeCyber",
    platforms: [
        .macOS(.v14),
    ],
    products: [
        .executable(
            name: "HelloTimeCyber",
            targets: ["HelloTimeCyber"]
        ),
    ],
    targets: [
        .executableTarget(
            name: "HelloTimeCyber",
            path: "Sources/HelloTimeCyber",
            resources: [
                .process("logo.png"),
                .process("logo-swift.svg"),
                .process("logo-swiftui.png"),
            ]
        ),
        .testTarget(
            name: "HelloTimeCyberTests",
            dependencies: ["HelloTimeCyber"],
            path: "Tests/HelloTimeCyberTests"
        ),
    ]
)

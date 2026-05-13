// swift-tools-version: 6.2
// Package manifest for the OpenBZ macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "OpenBZ",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "OpenBZIPC", targets: ["OpenBZIPC"]),
        .library(name: "OpenBZDiscovery", targets: ["OpenBZDiscovery"]),
        .executable(name: "OpenBZ", targets: ["OpenBZ"]),
        .executable(name: "openbz-mac", targets: ["OpenBZMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/OpenBZKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "OpenBZIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenBZDiscovery",
            dependencies: [
                .product(name: "OpenBZKit", package: "OpenBZKit"),
            ],
            path: "Sources/OpenBZDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenBZ",
            dependencies: [
                "OpenBZIPC",
                "OpenBZDiscovery",
                .product(name: "OpenBZKit", package: "OpenBZKit"),
                .product(name: "OpenBZChatUI", package: "OpenBZKit"),
                .product(name: "OpenBZProtocol", package: "OpenBZKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/OpenBZ.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenBZMacCLI",
            dependencies: [
                "OpenBZDiscovery",
                .product(name: "OpenBZKit", package: "OpenBZKit"),
                .product(name: "OpenBZProtocol", package: "OpenBZKit"),
            ],
            path: "Sources/OpenBZMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OpenBZIPCTests",
            dependencies: [
                "OpenBZIPC",
                "OpenBZ",
                "OpenBZDiscovery",
                .product(name: "OpenBZProtocol", package: "OpenBZKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])

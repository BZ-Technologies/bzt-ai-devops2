// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "OpenBZKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "OpenBZProtocol", targets: ["OpenBZProtocol"]),
        .library(name: "OpenBZKit", targets: ["OpenBZKit"]),
        .library(name: "OpenBZChatUI", targets: ["OpenBZChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "OpenBZProtocol",
            path: "Sources/OpenBZProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenBZKit",
            dependencies: [
                "OpenBZProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/OpenBZKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenBZChatUI",
            dependencies: [
                "OpenBZKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/OpenBZChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OpenBZKitTests",
            dependencies: ["OpenBZKit", "OpenBZChatUI"],
            path: "Tests/OpenBZKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])

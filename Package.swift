// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "NordicDfu",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "NordicDfu",
            targets: ["NordicDfuPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/NordicSemiconductor/IOS-DFU-Library", from: "4.16.0"),
    ],
    targets: [
        .target(
            name: "NordicDfuPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "NordicDFU", package: "IOS-DFU-Library"),
            ],
            path: "ios/Sources/NordicDfuPlugin"),
        .testTarget(
            name: "NordicDfuPluginTests",
            dependencies: ["NordicDfuPlugin"],
            path: "ios/Tests/NordicDfuPluginTests"),
    ]
)

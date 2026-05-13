import Foundation

public enum OpenBZDeviceCommand: String, Codable, Sendable {
    case status = "device.status"
    case info = "device.info"
}

public enum OpenBZBatteryState: String, Codable, Sendable {
    case unknown
    case unplugged
    case charging
    case full
}

public enum OpenBZThermalState: String, Codable, Sendable {
    case nominal
    case fair
    case serious
    case critical
}

public enum OpenBZNetworkPathStatus: String, Codable, Sendable {
    case satisfied
    case unsatisfied
    case requiresConnection
}

public enum OpenBZNetworkInterfaceType: String, Codable, Sendable {
    case wifi
    case cellular
    case wired
    case other
}

public struct OpenBZBatteryStatusPayload: Codable, Sendable, Equatable {
    public var level: Double?
    public var state: OpenBZBatteryState
    public var lowPowerModeEnabled: Bool

    public init(level: Double?, state: OpenBZBatteryState, lowPowerModeEnabled: Bool) {
        self.level = level
        self.state = state
        self.lowPowerModeEnabled = lowPowerModeEnabled
    }
}

public struct OpenBZThermalStatusPayload: Codable, Sendable, Equatable {
    public var state: OpenBZThermalState

    public init(state: OpenBZThermalState) {
        self.state = state
    }
}

public struct OpenBZStorageStatusPayload: Codable, Sendable, Equatable {
    public var totalBytes: Int64
    public var freeBytes: Int64
    public var usedBytes: Int64

    public init(totalBytes: Int64, freeBytes: Int64, usedBytes: Int64) {
        self.totalBytes = totalBytes
        self.freeBytes = freeBytes
        self.usedBytes = usedBytes
    }
}

public struct OpenBZNetworkStatusPayload: Codable, Sendable, Equatable {
    public var status: OpenBZNetworkPathStatus
    public var isExpensive: Bool
    public var isConstrained: Bool
    public var interfaces: [OpenBZNetworkInterfaceType]

    public init(
        status: OpenBZNetworkPathStatus,
        isExpensive: Bool,
        isConstrained: Bool,
        interfaces: [OpenBZNetworkInterfaceType])
    {
        self.status = status
        self.isExpensive = isExpensive
        self.isConstrained = isConstrained
        self.interfaces = interfaces
    }
}

public struct OpenBZDeviceStatusPayload: Codable, Sendable, Equatable {
    public var battery: OpenBZBatteryStatusPayload
    public var thermal: OpenBZThermalStatusPayload
    public var storage: OpenBZStorageStatusPayload
    public var network: OpenBZNetworkStatusPayload
    public var uptimeSeconds: Double

    public init(
        battery: OpenBZBatteryStatusPayload,
        thermal: OpenBZThermalStatusPayload,
        storage: OpenBZStorageStatusPayload,
        network: OpenBZNetworkStatusPayload,
        uptimeSeconds: Double)
    {
        self.battery = battery
        self.thermal = thermal
        self.storage = storage
        self.network = network
        self.uptimeSeconds = uptimeSeconds
    }
}

public struct OpenBZDeviceInfoPayload: Codable, Sendable, Equatable {
    public var deviceName: String
    public var modelIdentifier: String
    public var systemName: String
    public var systemVersion: String
    public var appVersion: String
    public var appBuild: String
    public var locale: String

    public init(
        deviceName: String,
        modelIdentifier: String,
        systemName: String,
        systemVersion: String,
        appVersion: String,
        appBuild: String,
        locale: String)
    {
        self.deviceName = deviceName
        self.modelIdentifier = modelIdentifier
        self.systemName = systemName
        self.systemVersion = systemVersion
        self.appVersion = appVersion
        self.appBuild = appBuild
        self.locale = locale
    }
}

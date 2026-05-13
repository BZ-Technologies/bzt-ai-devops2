import Foundation

public enum OpenBZCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum OpenBZCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum OpenBZCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum OpenBZCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct OpenBZCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: OpenBZCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: OpenBZCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: OpenBZCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: OpenBZCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct OpenBZCameraClipParams: Codable, Sendable, Equatable {
    public var facing: OpenBZCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: OpenBZCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: OpenBZCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: OpenBZCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}

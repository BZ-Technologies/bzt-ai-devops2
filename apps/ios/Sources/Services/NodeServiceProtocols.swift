import CoreLocation
import Foundation
import OpenBZKit
import UIKit

typealias OpenBZCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias OpenBZCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: OpenBZCameraSnapParams) async throws -> OpenBZCameraSnapResult
    func clip(params: OpenBZCameraClipParams) async throws -> OpenBZCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: OpenBZLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: OpenBZLocationGetParams,
        desiredAccuracy: OpenBZLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: OpenBZLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> OpenBZDeviceStatusPayload
    func info() -> OpenBZDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: OpenBZPhotosLatestParams) async throws -> OpenBZPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: OpenBZContactsSearchParams) async throws -> OpenBZContactsSearchPayload
    func add(params: OpenBZContactsAddParams) async throws -> OpenBZContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: OpenBZCalendarEventsParams) async throws -> OpenBZCalendarEventsPayload
    func add(params: OpenBZCalendarAddParams) async throws -> OpenBZCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: OpenBZRemindersListParams) async throws -> OpenBZRemindersListPayload
    func add(params: OpenBZRemindersAddParams) async throws -> OpenBZRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: OpenBZMotionActivityParams) async throws -> OpenBZMotionActivityPayload
    func pedometer(params: OpenBZPedometerParams) async throws -> OpenBZPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: OpenBZWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}

package ai.openbz.app.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class OpenBZProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", OpenBZCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", OpenBZCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", OpenBZCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", OpenBZCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", OpenBZCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", OpenBZCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", OpenBZCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", OpenBZCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", OpenBZCapability.Canvas.rawValue)
    assertEquals("camera", OpenBZCapability.Camera.rawValue)
    assertEquals("voiceWake", OpenBZCapability.VoiceWake.rawValue)
    assertEquals("location", OpenBZCapability.Location.rawValue)
    assertEquals("sms", OpenBZCapability.Sms.rawValue)
    assertEquals("device", OpenBZCapability.Device.rawValue)
    assertEquals("notifications", OpenBZCapability.Notifications.rawValue)
    assertEquals("system", OpenBZCapability.System.rawValue)
    assertEquals("photos", OpenBZCapability.Photos.rawValue)
    assertEquals("contacts", OpenBZCapability.Contacts.rawValue)
    assertEquals("calendar", OpenBZCapability.Calendar.rawValue)
    assertEquals("motion", OpenBZCapability.Motion.rawValue)
    assertEquals("callLog", OpenBZCapability.CallLog.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", OpenBZCameraCommand.List.rawValue)
    assertEquals("camera.snap", OpenBZCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", OpenBZCameraCommand.Clip.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", OpenBZNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", OpenBZNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", OpenBZDeviceCommand.Status.rawValue)
    assertEquals("device.info", OpenBZDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", OpenBZDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", OpenBZDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", OpenBZSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", OpenBZPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", OpenBZContactsCommand.Search.rawValue)
    assertEquals("contacts.add", OpenBZContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", OpenBZCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", OpenBZCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", OpenBZMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", OpenBZMotionCommand.Pedometer.rawValue)
  }

  @Test
  fun callLogCommandsUseStableStrings() {
    assertEquals("callLog.search", OpenBZCallLogCommand.Search.rawValue)
  }
}

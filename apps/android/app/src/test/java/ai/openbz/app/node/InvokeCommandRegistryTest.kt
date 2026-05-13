package ai.openbz.app.node

import ai.openbz.app.protocol.OpenBZCalendarCommand
import ai.openbz.app.protocol.OpenBZCameraCommand
import ai.openbz.app.protocol.OpenBZCallLogCommand
import ai.openbz.app.protocol.OpenBZCapability
import ai.openbz.app.protocol.OpenBZContactsCommand
import ai.openbz.app.protocol.OpenBZDeviceCommand
import ai.openbz.app.protocol.OpenBZLocationCommand
import ai.openbz.app.protocol.OpenBZMotionCommand
import ai.openbz.app.protocol.OpenBZNotificationsCommand
import ai.openbz.app.protocol.OpenBZPhotosCommand
import ai.openbz.app.protocol.OpenBZSmsCommand
import ai.openbz.app.protocol.OpenBZSystemCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      OpenBZCapability.Canvas.rawValue,
      OpenBZCapability.Device.rawValue,
      OpenBZCapability.Notifications.rawValue,
      OpenBZCapability.System.rawValue,
      OpenBZCapability.Photos.rawValue,
      OpenBZCapability.Contacts.rawValue,
      OpenBZCapability.Calendar.rawValue,
      OpenBZCapability.CallLog.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      OpenBZCapability.Camera.rawValue,
      OpenBZCapability.Location.rawValue,
      OpenBZCapability.Sms.rawValue,
      OpenBZCapability.VoiceWake.rawValue,
      OpenBZCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      OpenBZDeviceCommand.Status.rawValue,
      OpenBZDeviceCommand.Info.rawValue,
      OpenBZDeviceCommand.Permissions.rawValue,
      OpenBZDeviceCommand.Health.rawValue,
      OpenBZNotificationsCommand.List.rawValue,
      OpenBZNotificationsCommand.Actions.rawValue,
      OpenBZSystemCommand.Notify.rawValue,
      OpenBZPhotosCommand.Latest.rawValue,
      OpenBZContactsCommand.Search.rawValue,
      OpenBZContactsCommand.Add.rawValue,
      OpenBZCalendarCommand.Events.rawValue,
      OpenBZCalendarCommand.Add.rawValue,
      OpenBZCallLogCommand.Search.rawValue,
    )

  private val optionalCommands =
    setOf(
      OpenBZCameraCommand.Snap.rawValue,
      OpenBZCameraCommand.Clip.rawValue,
      OpenBZCameraCommand.List.rawValue,
      OpenBZLocationCommand.Get.rawValue,
      OpenBZMotionCommand.Activity.rawValue,
      OpenBZMotionCommand.Pedometer.rawValue,
      OpenBZSmsCommand.Send.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          smsAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(OpenBZMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(OpenBZMotionCommand.Pedometer.rawValue))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    smsAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      smsAvailable = smsAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}

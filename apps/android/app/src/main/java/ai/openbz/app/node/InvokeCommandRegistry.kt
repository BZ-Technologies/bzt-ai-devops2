package ai.openbz.app.node

import ai.openbz.app.protocol.OpenBZCalendarCommand
import ai.openbz.app.protocol.OpenBZCanvasA2UICommand
import ai.openbz.app.protocol.OpenBZCanvasCommand
import ai.openbz.app.protocol.OpenBZCameraCommand
import ai.openbz.app.protocol.OpenBZCapability
import ai.openbz.app.protocol.OpenBZCallLogCommand
import ai.openbz.app.protocol.OpenBZContactsCommand
import ai.openbz.app.protocol.OpenBZDeviceCommand
import ai.openbz.app.protocol.OpenBZLocationCommand
import ai.openbz.app.protocol.OpenBZMotionCommand
import ai.openbz.app.protocol.OpenBZNotificationsCommand
import ai.openbz.app.protocol.OpenBZPhotosCommand
import ai.openbz.app.protocol.OpenBZSmsCommand
import ai.openbz.app.protocol.OpenBZSystemCommand

data class NodeRuntimeFlags(
  val cameraEnabled: Boolean,
  val locationEnabled: Boolean,
  val smsAvailable: Boolean,
  val voiceWakeEnabled: Boolean,
  val motionActivityAvailable: Boolean,
  val motionPedometerAvailable: Boolean,
  val debugBuild: Boolean,
)

enum class InvokeCommandAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  MotionActivityAvailable,
  MotionPedometerAvailable,
  DebugBuild,
}

enum class NodeCapabilityAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  VoiceWakeEnabled,
  MotionAvailable,
}

data class NodeCapabilitySpec(
  val name: String,
  val availability: NodeCapabilityAvailability = NodeCapabilityAvailability.Always,
)

data class InvokeCommandSpec(
  val name: String,
  val requiresForeground: Boolean = false,
  val availability: InvokeCommandAvailability = InvokeCommandAvailability.Always,
)

object InvokeCommandRegistry {
  val capabilityManifest: List<NodeCapabilitySpec> =
    listOf(
      NodeCapabilitySpec(name = OpenBZCapability.Canvas.rawValue),
      NodeCapabilitySpec(name = OpenBZCapability.Device.rawValue),
      NodeCapabilitySpec(name = OpenBZCapability.Notifications.rawValue),
      NodeCapabilitySpec(name = OpenBZCapability.System.rawValue),
      NodeCapabilitySpec(
        name = OpenBZCapability.Camera.rawValue,
        availability = NodeCapabilityAvailability.CameraEnabled,
      ),
      NodeCapabilitySpec(
        name = OpenBZCapability.Sms.rawValue,
        availability = NodeCapabilityAvailability.SmsAvailable,
      ),
      NodeCapabilitySpec(
        name = OpenBZCapability.VoiceWake.rawValue,
        availability = NodeCapabilityAvailability.VoiceWakeEnabled,
      ),
      NodeCapabilitySpec(
        name = OpenBZCapability.Location.rawValue,
        availability = NodeCapabilityAvailability.LocationEnabled,
      ),
      NodeCapabilitySpec(name = OpenBZCapability.Photos.rawValue),
      NodeCapabilitySpec(name = OpenBZCapability.Contacts.rawValue),
      NodeCapabilitySpec(name = OpenBZCapability.Calendar.rawValue),
      NodeCapabilitySpec(
        name = OpenBZCapability.Motion.rawValue,
        availability = NodeCapabilityAvailability.MotionAvailable,
      ),
      NodeCapabilitySpec(name = OpenBZCapability.CallLog.rawValue),
    )

  val all: List<InvokeCommandSpec> =
    listOf(
      InvokeCommandSpec(
        name = OpenBZCanvasCommand.Present.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZCanvasCommand.Hide.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZCanvasCommand.Navigate.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZCanvasCommand.Eval.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZCanvasCommand.Snapshot.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZCanvasA2UICommand.Push.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZCanvasA2UICommand.PushJSONL.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZCanvasA2UICommand.Reset.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = OpenBZSystemCommand.Notify.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZCameraCommand.List.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = OpenBZCameraCommand.Snap.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = OpenBZCameraCommand.Clip.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = OpenBZLocationCommand.Get.rawValue,
        availability = InvokeCommandAvailability.LocationEnabled,
      ),
      InvokeCommandSpec(
        name = OpenBZDeviceCommand.Status.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZDeviceCommand.Info.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZDeviceCommand.Permissions.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZDeviceCommand.Health.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZNotificationsCommand.List.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZNotificationsCommand.Actions.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZPhotosCommand.Latest.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZContactsCommand.Search.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZContactsCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZCalendarCommand.Events.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZCalendarCommand.Add.rawValue,
      ),
      InvokeCommandSpec(
        name = OpenBZMotionCommand.Activity.rawValue,
        availability = InvokeCommandAvailability.MotionActivityAvailable,
      ),
      InvokeCommandSpec(
        name = OpenBZMotionCommand.Pedometer.rawValue,
        availability = InvokeCommandAvailability.MotionPedometerAvailable,
      ),
      InvokeCommandSpec(
        name = OpenBZSmsCommand.Send.rawValue,
        availability = InvokeCommandAvailability.SmsAvailable,
      ),
      InvokeCommandSpec(
        name = OpenBZCallLogCommand.Search.rawValue,
      ),
      InvokeCommandSpec(
        name = "debug.logs",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(
        name = "debug.ed25519",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
    )

  private val byNameInternal: Map<String, InvokeCommandSpec> = all.associateBy { it.name }

  fun find(command: String): InvokeCommandSpec? = byNameInternal[command]

  fun advertisedCapabilities(flags: NodeRuntimeFlags): List<String> {
    return capabilityManifest
      .filter { spec ->
        when (spec.availability) {
          NodeCapabilityAvailability.Always -> true
          NodeCapabilityAvailability.CameraEnabled -> flags.cameraEnabled
          NodeCapabilityAvailability.LocationEnabled -> flags.locationEnabled
          NodeCapabilityAvailability.SmsAvailable -> flags.smsAvailable
          NodeCapabilityAvailability.VoiceWakeEnabled -> flags.voiceWakeEnabled
          NodeCapabilityAvailability.MotionAvailable -> flags.motionActivityAvailable || flags.motionPedometerAvailable
        }
      }
      .map { it.name }
  }

  fun advertisedCommands(flags: NodeRuntimeFlags): List<String> {
    return all
      .filter { spec ->
        when (spec.availability) {
          InvokeCommandAvailability.Always -> true
          InvokeCommandAvailability.CameraEnabled -> flags.cameraEnabled
          InvokeCommandAvailability.LocationEnabled -> flags.locationEnabled
          InvokeCommandAvailability.SmsAvailable -> flags.smsAvailable
          InvokeCommandAvailability.MotionActivityAvailable -> flags.motionActivityAvailable
          InvokeCommandAvailability.MotionPedometerAvailable -> flags.motionPedometerAvailable
          InvokeCommandAvailability.DebugBuild -> flags.debugBuild
        }
      }
      .map { it.name }
  }
}

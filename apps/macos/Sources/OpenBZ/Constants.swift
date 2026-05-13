import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-openbz writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.openbz.mac"
let gatewayLaunchdLabel = "ai.openbz.gateway"
let onboardingVersionKey = "openbz.onboardingVersion"
let onboardingSeenKey = "openbz.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "openbz.pauseEnabled"
let iconAnimationsEnabledKey = "openbz.iconAnimationsEnabled"
let swabbleEnabledKey = "openbz.swabbleEnabled"
let swabbleTriggersKey = "openbz.swabbleTriggers"
let voiceWakeTriggerChimeKey = "openbz.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "openbz.voiceWakeSendChime"
let showDockIconKey = "openbz.showDockIcon"
let defaultVoiceWakeTriggers = ["openbz"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "openbz.voiceWakeMicID"
let voiceWakeMicNameKey = "openbz.voiceWakeMicName"
let voiceWakeLocaleKey = "openbz.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "openbz.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "openbz.voicePushToTalkEnabled"
let talkEnabledKey = "openbz.talkEnabled"
let iconOverrideKey = "openbz.iconOverride"
let connectionModeKey = "openbz.connectionMode"
let remoteTargetKey = "openbz.remoteTarget"
let remoteIdentityKey = "openbz.remoteIdentity"
let remoteProjectRootKey = "openbz.remoteProjectRoot"
let remoteCliPathKey = "openbz.remoteCliPath"
let canvasEnabledKey = "openbz.canvasEnabled"
let cameraEnabledKey = "openbz.cameraEnabled"
let systemRunPolicyKey = "openbz.systemRunPolicy"
let systemRunAllowlistKey = "openbz.systemRunAllowlist"
let systemRunEnabledKey = "openbz.systemRunEnabled"
let locationModeKey = "openbz.locationMode"
let locationPreciseKey = "openbz.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "openbz.peekabooBridgeEnabled"
let deepLinkKeyKey = "openbz.deepLinkKey"
let modelCatalogPathKey = "openbz.modelCatalogPath"
let modelCatalogReloadKey = "openbz.modelCatalogReload"
let cliInstallPromptedVersionKey = "openbz.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "openbz.heartbeatsEnabled"
let debugPaneEnabledKey = "openbz.debugPaneEnabled"
let debugFileLogEnabledKey = "openbz.debug.fileLogEnabled"
let appLogLevelKey = "openbz.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26

import Capacitor
import CoreBluetooth
import Foundation
import NordicDFU
import UserNotifications

func makePendingNotificationRequestJSObject(_ request: UNNotificationRequest) -> JSObject {
    var notification: JSObject = [
        "id": Int(request.identifier) ?? -1,
        "title": request.content.title,
        "body": request.content.body
    ]

    if let userInfo = JSTypes.coerceDictionaryToJSObject(request.content.userInfo) {
        var extra = userInfo["cap_extra"] as? JSObject ?? userInfo

        for (key, value) in extra {
            if let date = value as? Date {
                extra[key] = ISO8601DateFormatter().string(from: date)
            }
        }

        notification["extra"] = extra

        if var schedule = userInfo["cap_schedule"] as? JSObject {
            if let date = schedule["at"] as? Date {
                schedule["at"] = ISO8601DateFormatter().string(from: date)
            }

            notification["schedule"] = schedule
        }
    }

    return notification
}

func makeNotificationRequestJSObject(
    _ request: UNNotificationRequest,
    notificationRequestLookup: [String: JSObject]
) -> JSObject {
    let notificationRequest = notificationRequestLookup[request.identifier] ?? [:]
    var notification = makePendingNotificationRequestJSObject(request)
    notification["sound"] = notificationRequest["sound"] ?? ""
    notification["actionTypeId"] = request.content.categoryIdentifier
    notification["attachments"] = notificationRequest["attachments"] ?? []
    return notification
}

@objc(NordicDfuPlugin)
public class NordicDfuPlugin: CAPPlugin, CBCentralManagerDelegate, DFUServiceDelegate,
                              DFUProgressDelegate, NotificationHandlerProtocol {
    public var dfuChangeEvent: String = "DFUStateChanged"
    var notificationRequestLookup = [String: JSObject]()
    private var manager: CBCentralManager?
    private var dfuStartTime: TimeInterval?

    override public func load() {
        manager = CBCentralManager(delegate: self, queue: nil)
    }

    public func willPresent(notification: UNNotification) -> UNNotificationPresentationOptions {
        let notificationData = makeNotificationRequestJSObject(
            notification.request,
            notificationRequestLookup: notificationRequestLookup
        )

        notifyListeners("localNotificationReceived", data: notificationData)

        if let options = notificationRequestLookup[notification.request.identifier] {
            let silent = options["silent"] as? Bool ?? false
            if silent {
                return []
            }
        }

        if #available(iOS 14.0, *) {
            return [
                .badge,
                .sound,
                .banner,
                .list
            ]
        } else {
            return [
                .badge,
                .sound,
                .alert
            ]
        }
    }

    public func didReceive(response: UNNotificationResponse) {
        var data = JSObject()

        // Get the info for the original notification request
        let originalNotificationRequest = response.notification.request

        let actionId = response.actionIdentifier

        // We turn the two default actions (open/dismiss) into generic strings
        if actionId == UNNotificationDefaultActionIdentifier {
            data["actionId"] = "tap"
        } else if actionId == UNNotificationDismissActionIdentifier {
            data["actionId"] = "dismiss"
        } else {
            data["actionId"] = actionId
        }

        // If the type of action was for an input type, get the value
        if let inputType = response as? UNTextInputNotificationResponse {
            data["inputValue"] = inputType.userText
        }

        data["notification"] = makeNotificationRequestJSObject(
            originalNotificationRequest,
            notificationRequestLookup: notificationRequestLookup
        )

        notifyListeners("localNotificationActionPerformed", data: data, retainUntilConsumed: true)
    }

    public func centralManagerDidUpdateState(_: CBCentralManager) {}

    public func dfuStateDidChange(to state: DFUState) {
        switch state {
        case .connecting:
            sendStateUpdate("DEVICE_CONNECTING")
        case .starting:
            sendStateUpdate("DFU_PROCESS_STARTING")
        case .enablingDfuMode:
            sendStateUpdate("ENABLING_DFU_MODE")
        case .validating:
            sendStateUpdate("VALIDATING_FIRMWARE")
        case .disconnecting:
            sendStateUpdate("DEVICE_DISCONNECTING")
        case .completed, .aborted:
            // Reset dfuStartTime at the end of the process
            dfuStartTime = nil
            sendStateUpdate(state == .completed ? "DFU_COMPLETED" : "DFU_ABORTED")
        case .uploading:
            break  // Ignore
        }
    }

    public func dfuError(_: DFUError, didOccurWithMessage _: String) {
        // Reset dfuStartTime if an error occurs
        dfuStartTime = nil
        sendStateUpdate("DFU_FAILED")
    }

    public func dfuProgressDidChange(
        for part: Int, outOf totalParts: Int, to progress: Int, currentSpeedBytesPerSecond: Double,
        avgSpeedBytesPerSecond: Double
    ) {
        if dfuStartTime == nil {
            dfuStartTime = Date().timeIntervalSince1970
        }

        let currentTime = Date().timeIntervalSince1970
        let durationInSeconds = currentTime - (dfuStartTime ?? currentTime)
        let duration = durationInSeconds * 1000  // Convert duration to milliseconds

        var remainingTime: TimeInterval = 0
        if progress > 0 {
            let estimatedTotalTimeInSeconds = durationInSeconds * (100.0 / Double(progress))
            let estimatedRemainingTimeInSeconds = estimatedTotalTimeInSeconds - durationInSeconds
            remainingTime = estimatedRemainingTimeInSeconds * 1000  // Convert remaining time to milliseconds
        }

        let data: JSObject = [
            "deviceAddress": "",
            "percent": progress,
            "speed": currentSpeedBytesPerSecond / 1000,
            "avgSpeed": avgSpeedBytesPerSecond / 1000,
            "currentPart": part,
            "partsTotal": totalParts,
            "duration": duration,
            "remainingTime": remainingTime
        ]
        sendStateUpdate("DFU_PROGRESS", data)
    }

    private func sendStateUpdate(_ state: String, _ data: JSObject = [:]) {
        let ret: JSObject = [
            "state": state,
            "data": data
        ]
        notifyListeners(dfuChangeEvent, data: ret)
    }

    private func createFirmware(from fileURL: URL) -> DFUFirmware? {
        guard fileURL.pathExtension.lowercased() == "zip" else {
            return nil
        }

        return try? DFUFirmware(urlToZipFile: fileURL)
    }

    private func configureStarter(_ starter: DFUServiceInitiator, with dfuOptions: JSObject?) {
        guard let dfuOption = dfuOptions else {
            return
        }

        if let dataObjectDelay = dfuOption["dataObjectDelay"] as? Double {
            starter.dataObjectPreparationDelay = dataObjectDelay
        }

        if let packetsReceiptNotificationsValueStr = dfuOption["packetsReceiptNotificationsValue"]
            as? String,
           let packetsReceiptNotificationsValue = UInt16(packetsReceiptNotificationsValueStr) {
            starter.packetReceiptNotificationParameter = packetsReceiptNotificationsValue
        }

        if let forceDfu = dfuOption["forceDfu"] as? Bool {
            starter.forceDfu = forceDfu
        }

        if let forceScanningForNewAddressInLegacyDfu = dfuOption[
            "forceScanningForNewAddressInLegacyDfu"] as? Bool {
            starter.forceScanningForNewAddressInLegacyDfu = forceScanningForNewAddressInLegacyDfu
        }

        if let disableResume = dfuOption["disableResume"] as? Bool {
            starter.disableResume = disableResume
        }

        if let unsafeButtonlessEnabled = dfuOption[
            "unsafeExperimentalButtonlessServiceInSecureDfuEnabled"] as? Bool {
            starter.enableUnsafeExperimentalButtonlessServiceInSecureDfu = unsafeButtonlessEnabled
        }
    }

    private func retrievePeripheral(for deviceAddress: String) -> CBPeripheral? {
        guard let manager = manager,
              let deviceUUID = UUID(uuidString: deviceAddress)
        else {
            return nil
        }

        return manager.retrievePeripherals(withIdentifiers: [deviceUUID]).first
    }

    @objc func startDFU(_ call: CAPPluginCall) {
        guard let deviceAddress = call.getString("deviceAddress"), !deviceAddress.isEmpty else {
            call.reject("deviceAddress is required")
            return
        }

        let deviceName = call.getString("deviceName")

        guard let filePath = call.getString("filePath"), !filePath.isEmpty else {
            call.reject("filePath is required")
            return
        }

        let processedFilePath = filePath.replacingOccurrences(of: "file://", with: "")
        let fileManager = FileManager.default
        if !fileManager.fileExists(atPath: processedFilePath) {
            call.reject("File not found: \(processedFilePath)")
            return
        }

        let supportedFileTypes = [".bin", ".hex", ".zip"]
        let isFileTypeSupported = supportedFileTypes.contains { processedFilePath.hasSuffix($0) }
        if !isFileTypeSupported {
            call.reject("File type not supported")
            return
        }

        let fileURL = URL(fileURLWithPath: processedFilePath)
        guard let selectedFirmware = createFirmware(from: fileURL) else {
            call.reject("Only zip files supported at the moment!")
            return
        }

        guard selectedFirmware.valid else {
            call.reject("Invalid firmware file!")
            return
        }

        let starter = DFUServiceInitiator().with(firmware: selectedFirmware)

        if let deviceName = deviceName {
            starter.alternativeAdvertisingName = deviceName
            starter.alternativeAdvertisingNameEnabled = true
        }

        configureStarter(starter, with: call.getObject("dfuOptions"))

        guard let peripheral = retrievePeripheral(for: deviceAddress) else {
            call.reject("Peripheral not found!")
            return
        }

        starter.delegate = self
        starter.progressDelegate = self
        _ = starter.start(target: peripheral)

        call.resolve()
    }

    @objc override public func requestPermissions(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()

        center.requestAuthorization(options: [.badge, .alert, .sound]) { granted, error in
            guard let error = error else {
                call.resolve(["notifications": granted ? "granted" : "denied"])
                return
            }

            call.reject(error.localizedDescription)
        }
    }

    @objc override public func checkPermissions(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()

        center.getNotificationSettings { settings in
            let status = settings.authorizationStatus

            let permission: String

            switch status {
            case .authorized, .ephemeral, .provisional:
                permission = "granted"
            case .denied:
                permission = "denied"
            case .notDetermined:
                permission = "prompt"
            @unknown default:
                permission = "prompt"
            }

            call.resolve(["notifications": permission])
        }
    }
}

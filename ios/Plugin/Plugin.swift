import Foundation
import Capacitor


@objc public class Example: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}


/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(NordicDfu)
public class NordicDfu: CAPPlugin {
    private let implementation = Example()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }
}

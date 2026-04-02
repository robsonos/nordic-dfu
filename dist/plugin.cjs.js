'use strict';

var core = require('@capacitor/core');

/**
 * Enumerates the various states in the DFU process. This helps in tracking the progress and status of the
 * firmware update.
 *
 * @since 1.0.0
 */
exports.DfuState = void 0;
(function (DfuState) {
    /**
     * The device is currently connecting.
     *
     * @since 1.0.0
     */
    DfuState["DEVICE_CONNECTING"] = "DEVICE_CONNECTING";
    /**
     * The device has successfully connected. **Available for Android only.**
     *
     * @since 1.0.0
     */
    DfuState["DEVICE_CONNECTED"] = "DEVICE_CONNECTED";
    /**
     * The DFU process is about to start.
     *
     * @since 1.0.0
     */
    DfuState["DFU_PROCESS_STARTING"] = "DFU_PROCESS_STARTING";
    /**
     * The DFU process has started. **Available for Android only.**
     *
     * @since 1.0.0
     */
    DfuState["DFU_PROCESS_STARTED"] = "DFU_PROCESS_STARTED";
    /**
     * The device is enabling DFU mode.
     *
     * @since 1.0.0
     */
    DfuState["ENABLING_DFU_MODE"] = "ENABLING_DFU_MODE";
    /**
     * The DFU process is in progress.
     *
     * @since 1.0.0
     */
    DfuState["DFU_PROGRESS"] = "DFU_PROGRESS";
    /**
     * The firmware is currently being validated.
     *
     * @since 1.0.0
     */
    DfuState["VALIDATING_FIRMWARE"] = "VALIDATING_FIRMWARE";
    /**
     * The device is disconnecting.
     *
     * @since 1.0.0
     */
    DfuState["DEVICE_DISCONNECTING"] = "DEVICE_DISCONNECTING";
    /**
     * The device has disconnected. **Available for Android only.**
     *
     * @since 1.0.0
     */
    DfuState["DEVICE_DISCONNECTED"] = "DEVICE_DISCONNECTED";
    /**
     * The DFU process has completed successfully.
     *
     * @since 1.0.0
     */
    DfuState["DFU_COMPLETED"] = "DFU_COMPLETED";
    /**
     * The DFU process has been aborted.
     *
     * @since 1.0.0
     */
    DfuState["DFU_ABORTED"] = "DFU_ABORTED";
    /**
     * The DFU process has failed.
     *
     * @since 1.0.0
     */
    DfuState["DFU_FAILED"] = "DFU_FAILED";
})(exports.DfuState || (exports.DfuState = {}));

const NordicDfu = core.registerPlugin('NordicDfu', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.NordicDfuWeb()),
});

/* eslint-disable @typescript-eslint/no-unused-vars */
class NordicDfuWeb extends core.WebPlugin {
    removeAllListeners() {
        throw this.unavailable('Method not available in this browser.');
    }
    startDFU(_dfuUpdateOptions) {
        throw this.unavailable('Method not available in this browser.');
    }
    checkPermissions() {
        throw this.unavailable('Method not available in this browser.');
    }
    requestPermissions() {
        throw this.unavailable('Method not available in this browser.');
    }
    addListener(_eventName, _listenerFunc) {
        throw this.unavailable('Method not available in this browser.');
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    NordicDfuWeb: NordicDfuWeb
});

exports.NordicDfu = NordicDfu;
//# sourceMappingURL=plugin.cjs.js.map

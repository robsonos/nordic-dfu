/**
 * Enumerates the various states in the DFU process. This helps in tracking the progress and status of the
 * firmware update.
 *
 * @since 1.0.0
 */
export var DfuState;
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
})(DfuState || (DfuState = {}));
//# sourceMappingURL=definitions.js.map
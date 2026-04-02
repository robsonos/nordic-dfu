/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebPlugin } from '@capacitor/core';
export class NordicDfuWeb extends WebPlugin {
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
//# sourceMappingURL=web.js.map
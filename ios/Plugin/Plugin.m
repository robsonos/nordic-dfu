#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(NordicDfu, "NordicDfu",
    CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)

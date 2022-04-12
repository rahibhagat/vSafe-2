//
//  SwiftReactNativeBridge.m
//  vSafe
//
//  Created by Techovarya on 28/11/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(BluetoothManager, RCTEventEmitter)

RCT_EXTERN_METHOD(startAdvertising:(NSString *)name)
RCT_EXTERN_METHOD(startScanning)


@end

//
//  BluetoothManager.swift
//  vSafe
//
//  Created by Techovarya on 28/11/20.
//  Copyright © 2020 Facebook. All rights reserved.
//


import Foundation
import CoreBluetooth
import UIKit
import React

enum Constants: String {
    case SERVICE_UUID = "50ef0497-811d-4940-8280-8c42cab67589"
}

@objc(BluetoothManager)
class BluetoothManager: RCTEventEmitter, CBPeripheralManagerDelegate, CBCentralManagerDelegate {
    
  private(set) var peripherals = Dictionary<UUID, String>()
  
  // MARK: - Private properties
  private var peripheralManager: CBPeripheralManager?
  private var centralManager: CBCentralManager?
  private var name: String?
  
  //
  override func supportedEvents() -> [String]! {
    return ["onSessionConnect","BleManagerDiscoverPeripheral","BleManagerStopScan"];
  }
  
  // MARK: - Public methods
  
  
  
  @objc  func startAdvertising(_ name: String) {
          
      self.name = name
      peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
      
      
    }
  
  
  @objc  func startScanning() {
      centralManager = CBCentralManager(delegate: self, queue: nil)
    }


  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
      if peripheral.state == .poweredOn {
          if peripheral.isAdvertising {
              peripheral.stopAdvertising()
          }

          let uuid = CBUUID(string: Constants.SERVICE_UUID.rawValue)
          let advertisingData: [String : Any] = [
              CBAdvertisementDataServiceUUIDsKey: [uuid],
            CBAdvertisementDataLocalNameKey : self.name ?? ""

          ]

          self.peripheralManager?.startAdvertising(advertisingData)
      } else {
          //#warning("handle other states")
      }
  }
    
  
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
      if central.state == .poweredOn {

          if central.isScanning {
              central.stopScan()
          }

          let uuid = CBUUID(string: Constants.SERVICE_UUID.rawValue)
        let options: [String: Any] = [CBCentralManagerScanOptionAllowDuplicatesKey:
                                      NSNumber(value: true)]
          central.scanForPeripherals(withServices: [uuid],options: options)
        /* DispatchQueue.global(qos: .background).async {
          DispatchQueue.main.asyncAfter(deadline: .now() + 30.0) {
            central.stopScan()
            NSLog("stopping Scan")
            self.sendEvent(withName: "BleManagerStopScan", body: [])
            self.startScanningAgain()
          }
        } */
      }
      else {
          //#warning("Error handling")
      }
  }
  
 /* func startScanningAgain(){
    DispatchQueue.global(qos: .background).async {
    DispatchQueue.main.asyncAfter(deadline: .now() + 60.0) {
      NSLog("starting Scan again")
      self.centralManagerDidUpdateState(self.centralManager!)
    }
    }
  } */

  // func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String: Any], rssi RSSI: NSNumber) {
  //   peripherals[peripheral.identifier] = advertisementData[CBAdvertisementDataServiceDataKey] as? String ?? ""
  //   self.sendEvent(withName: "BleManagerDiscoverPeripheral", body: advertisementData)
    
  // }
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String: Any], rssi RSSI: NSNumber) {
    peripherals[peripheral.identifier] = advertisementData[CBAdvertisementDataServiceDataKey] as? String ?? ""
    
    
    var KeyValue : [String] = []
    if let dictData =  advertisementData[CBAdvertisementDataServiceDataKey] as? Dictionary<CBUUID,Data> {
      
      
      for single in dictData.keys {
        if let CB = single as? CBUUID {
          KeyValue.append(CB.uuidString)
        }
        
      }
    }
    
    let newData = [CBAdvertisementDataServiceDataKey : KeyValue ,
                   CBAdvertisementDataLocalNameKey:  advertisementData[CBAdvertisementDataLocalNameKey],
                   "RSSI":RSSI]
    debugPrint( advertisementData)
    debugPrint( "Event Called")
    debugPrint( newData.jsonStringRepresentation ?? "")
    self.sendEvent(withName: "BleManagerDiscoverPeripheral", body: newData.jsonStringRepresentation ?? "")
    
//    if let theJSONData = try? JSONSerialization.data(
//        withJSONObject: advertisementData,
//        options: []) {
//        let theJSONText = String(data: theJSONData,
//                                   encoding: .ascii)
//       self.sendEvent(withName: "BleManagerDiscoverPeripheral", body: theJSONText)
//    }
    
    
    
  }
  
}


extension Dictionary {
    var jsonStringRepresentation: String? {
        guard let theJSONData = try? JSONSerialization.data(withJSONObject: self,
                                                            options: [.prettyPrinted]) else {
            return nil
        }

        return String(data: theJSONData, encoding: .ascii)
    }
}

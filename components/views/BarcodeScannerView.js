import React from "react";
import {View} from "react-native";
import BarcodeMask from "react-native-barcode-mask";
import {CameraView} from "expo-camera";

function BarcodeScannerView({hasPermission, scanned, handleBarcodeScanned}) {
    return (
        <View style={{
            marginBottom: 20
        }}>
            {
                hasPermission === true
                    ?
                    <View
                        testID="camera-view"
                        style={{
                            aspectRatio: 1,
                            borderRadius: 10
                        }}
                    >
                        <CameraView
                            testID="barcode-scanner"
                            style={{flex: 1}}
                            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        />
                        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine animatedLineColor="#FF0000"/>
                    </View>
                    :
                    <></>
            }
        </View>
    );
}

export default BarcodeScannerView;
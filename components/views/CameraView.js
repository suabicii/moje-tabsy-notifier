import React from "react";
import {View} from "react-native";
import {BarCodeScanner} from "expo-barcode-scanner";

function CameraView({hasPermission, scanned, handleBarcodeScanned}) {
    return (
        <>
            {
                hasPermission === true
                    ?
                    <View
                        testID="camera-view"
                        style={{
                            aspectRatio: 4 / 3,
                            borderRadius: 10,
                            marginBottom: 20,
                            marginLeft: 25
                        }}
                    >
                        <BarCodeScanner
                            style={{flex: 1}}
                            onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
                        />
                    </View>
                    :
                    <></>
            }
        </>
    );
}

export default CameraView;
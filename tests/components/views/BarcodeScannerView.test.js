import React from "react";
import renderer from "react-test-renderer";
import BarcodeScannerView from "../../../components/views/BarcodeScannerView";

it('should correctly render BarcodeScannerView with granted permission', () => {
    const tree = renderer.create(
        <BarcodeScannerView
            hasPermission={true}
            scanned={true}
            handleBarcodeScanned={jest.fn()}
        />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
import React from "react";
import renderer from "react-test-renderer";
import CameraView from "../../../components/views/CameraView";

it('should correctly render CameraView with granted permission', () => {
    const tree = renderer.create(
        <CameraView
            hasPermission={true}
            scanned={true}
            handleBarcodeScanned={jest.fn()}
        />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
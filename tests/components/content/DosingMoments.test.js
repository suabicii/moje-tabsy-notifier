import React from "react";
import renderer from "react-test-renderer";
import DosingMoments from "../../../components/content/DosingMoments";
import {drugList} from "../../fixtures/drugList";
import {fireEvent, render, screen} from "@testing-library/react-native";

const drug = drugList[0];
const handleConfirmDose = jest.fn();
const dosingMomentsContent = Object.entries(drug.dosingMoments);
it('should correctly render DosingMoments component', () => {
    const tree = renderer.create(
        <DosingMoments
            drugName={drug.name}
            content={dosingMomentsContent}
            handleConfirmDose={handleConfirmDose}
        />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should shorten dosing moment list after pressing the button to confirm the dose', () => {
    render(
        <DosingMoments
            drugName={drug.name}
            content={dosingMomentsContent}
            handleConfirmDose={handleConfirmDose}
        />
    );

    fireEvent.press(screen.getByTestId('Xanax_hour1'));

    expect(screen.queryByTestId('Xanax_hour1')).toBeNull();
});
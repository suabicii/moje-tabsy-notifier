import React from "react";
import renderer from "react-test-renderer";
import Drugs from "../../../components/content/Drugs";
import {drugList} from "../../fixtures/drugList";
import {fireEvent, render, screen} from "@testing-library/react-native";

it('should correctly render drug data', () => {
    const tree = renderer.create(<Drugs drugList={drugList}/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should shorten dosing moment list after pressing the button to confirm the dose', () => {
    render(<Drugs drugList={drugList}/>);

    fireEvent.press(screen.getByTestId('Xanaxhour1'));

    expect(screen.queryByTestId('Xanaxhour1')).toBeNull();
});
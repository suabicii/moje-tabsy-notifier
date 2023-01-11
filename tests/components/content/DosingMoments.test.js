import React from "react";
import renderer from "react-test-renderer";
import DosingMoments from "../../../components/content/DosingMoments";
import {drugList} from "../../fixtures/drugList";
import {fireEvent, render, screen} from "@testing-library/react-native";
import {DrugTakenContext} from "../../../context/DrugTakenContext";
import {TimeContext} from "../../../context/TimeContext";
import dayjs from "dayjs";
import MockDate from "mockdate";

let currentTime;

beforeAll(() => {
    MockDate.set('2020-01-01');
    currentTime = dayjs();
});

const drug = drugList[0];
const handleConfirmDose = jest.fn();
const dosingMomentsContent = Object.entries(drug.dosingMoments);
const drugTakenChecker = [];
const setDrugTakenChecker = jest.fn();
const setCurrentTime = jest.fn();
const mockUseContext = jest.fn().mockImplementation(() => ({drugTakenChecker, setDrugTakenChecker}));

React.useContext = mockUseContext;

function WrappedComponent() {
    return (
        <TimeContext.Provider value={{currentTime, setCurrentTime}}>
            <DrugTakenContext.Provider value={{drugTakenChecker, setDrugTakenChecker}}>
                <DosingMoments
                    drugName={drug.name}
                    content={dosingMomentsContent}
                    handleConfirmDose={handleConfirmDose}
                />
            </DrugTakenContext.Provider>
        </TimeContext.Provider>
    );
}

it('should correctly render DosingMoments component', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should shorten dosing moment list after pressing the button to confirm the dose', () => {
    render(<WrappedComponent/>);

    fireEvent.press(screen.getByTestId('Xanax_hour1'));

    expect(screen.queryByTestId('Xanax_hour1')).toBeNull();
});
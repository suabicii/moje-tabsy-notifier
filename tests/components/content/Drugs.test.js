import React from "react";
import renderer from "react-test-renderer";
import Drugs from "../../../components/content/Drugs";
import {drugList} from "../../fixtures/drugList";
import DrugTakenContext from "../../../context/DrugTakenContext";
import {TimeContext} from "../../../context/TimeContext";
import MockDate from "mockdate";
import dayjs from "dayjs";
import {render, screen} from "@testing-library/react-native";

let currentTime;
beforeAll(() => {
    MockDate.set('2020-01-01');
    currentTime = dayjs();
});

const drug = drugList[0];

let drugTakenChecker = [];
const setDrugTakenChecker = jest.fn();
const setCurrentTime = jest.fn();
const mockUseContext = jest.fn().mockImplementation(() => ({drugTakenChecker, setDrugTakenChecker}));

React.useContext = mockUseContext;

function WrappedComponent({customDrugTakenChecker}) {
    if (customDrugTakenChecker) {
        drugTakenChecker = customDrugTakenChecker;
    }

    return (
        <TimeContext.Provider value={{currentTime, setCurrentTime}}>
            <DrugTakenContext.Provider value={{drugTakenChecker, setDrugTakenChecker}}>
                <Drugs drugList={drugList}/>
            </DrugTakenContext.Provider>
        </TimeContext.Provider>
    );
}

it('should correctly render drug data', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should not render single drug component if all doses was already taken', () => {
    const dosingMomentKeys = Object.keys(drug.dosingMoments);
    const customDrugTakenChecker = [`${drug.name}_${dosingMomentKeys[0]}`, `${drug.name}_${dosingMomentKeys[1]}`];
    render(<WrappedComponent customDrugTakenChecker={customDrugTakenChecker}/>);

    expect(screen.queryByTestId(drug.name)).toBeFalsy();
});
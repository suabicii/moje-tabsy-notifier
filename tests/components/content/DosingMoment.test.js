import React from "react";
import renderer from "react-test-renderer";
import {TimeContext} from "../../../context/TimeContext";
import DrugTakenContext from "../../../context/DrugTakenContext";
import DosingMoment from "../../../components/content/DosingMoment";
import {drugList} from "../../fixtures/drugList";
import MockDate from "mockdate";
import dayjs from "dayjs";

let currentTime;

beforeAll(() => {
    MockDate.set('2020-01-01');
    currentTime = dayjs();
});

const drugTakenChecker = [];
const setDrugTakenChecker = jest.fn();
const setCurrentTime = jest.fn();
const mockUseContext = jest.fn().mockImplementation(() => ({drugTakenChecker, setDrugTakenChecker}));

React.useContext = mockUseContext;

function WrappedComponent() {
    const drug = drugList[0];
    const handleSetDosingMomentsToShow = jest.fn();

    return (
        <TimeContext.Provider value={{currentTime, setCurrentTime}}>
            <DrugTakenContext.Provider value={{drugTakenChecker, setDrugTakenChecker}}>
                <DosingMoment
                    name={`${Object.keys(drug.dosingMoments)[0]}`}
                    drugName={drug.name}
                    hour={`${Object.values(drug.dosingMoments)[0]}`}
                    disabled={false}
                    id={`${drug.name}_${Object.keys(drug.dosingMoments)[0]}`}
                    handleSetDosingMomentsToShow={handleSetDosingMomentsToShow}
                />
            </DrugTakenContext.Provider>
        </TimeContext.Provider>
    );
}

it('should correctly render single DosingMoment component', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});
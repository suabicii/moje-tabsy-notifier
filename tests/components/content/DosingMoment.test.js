import React from "react";
import renderer from "react-test-renderer";
import DosingMoment from "../../../components/content/DosingMoment";
import {drugList} from "../../fixtures/drugList";
import MockDate from "mockdate";
import dayjs from "dayjs";
import {Provider} from "react-redux";
import store from "../../../store";
import {setCurrentTime} from "../../../features/time/timeSlice";

beforeAll(() => {
    MockDate.set('2020-01-01');
    const mockedCurrentTime = dayjs();
    store.dispatch(setCurrentTime(JSON.stringify(mockedCurrentTime)));
});

const drug = drugList[0];
const handleSetDosingMomentsToShow = jest.fn();
const dosingMomentId = `${drug.name}_${Object.keys(drug.dosingMoments)[0]}`;

function WrappedComponent() {
    return (
        <Provider store={store}>
            <DosingMoment
                name={`${Object.keys(drug.dosingMoments)[0]}`}
                drugName={drug.name}
                hour={`${Object.values(drug.dosingMoments)[0]}`}
                disabled={false}
                id={dosingMomentId}
                handleSetDosingMomentsToShow={handleSetDosingMomentsToShow}
            />
        </Provider>
    );
}

it('should correctly render single DosingMoment component', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});
import React from "react";
import renderer from "react-test-renderer";
import Drugs from "../../../components/content/Drugs";
import {drugList} from "../../fixtures/drugList";
import MockDate from "mockdate";
import dayjs from "dayjs";
import {Provider} from "react-redux";
import store from "../../../store";
import {setCurrentTime} from "../../../features/time/timeSlice";
import {setDrugs} from "../../../features/drugs/drugsSlice";

beforeAll(() => {
    MockDate.set('2020-01-01');
    const currentTime = dayjs();
    store.dispatch(setCurrentTime(JSON.stringify(currentTime)));
    store.dispatch(setDrugs(drugList));
});

const drug = drugList[0];

function WrappedComponent() {
    return (
        <Provider store={store}>
            <Drugs/>
        </Provider>
    );
}

it('should correctly render drug data', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});
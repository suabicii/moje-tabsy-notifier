import React from "react";
import renderer from "react-test-renderer";
import Drugs from "../../../components/content/Drugs";
import {drugList} from "../../fixtures/drugList";
import MockDate from "mockdate";
import dayjs from "dayjs";
import {render, screen, waitFor} from "@testing-library/react-native";
import {Provider} from "react-redux";
import store from "../../../store";
import {setDrugsTaken} from "../../../features/drugsTaken/drugsTakenSlice";
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

const dispatchDrugsTaken = () => {
    const dosingMoments = Object.entries(drug.dosingMoments);
    const drugsTaken = [];
    for (const [key] of dosingMoments) {
        drugsTaken.push(`${drug.name}_${key}`);
    }
    store.dispatch(setDrugsTaken(drugsTaken));
};

it('should correctly render drug data', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should not render single drug component if all doses was already taken', async () => {
    dispatchDrugsTaken();

    render(<WrappedComponent/>);

    await waitFor(() => {
        expect(screen.queryByTestId(drug.name)).toBeFalsy();
    });
});
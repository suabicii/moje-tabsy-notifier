import React from "react";
import {Provider} from "react-redux";
import store from "../../../store";
import renderer from "react-test-renderer";
import Drug from "../../../components/content/Drug";
import {drugList} from "../../fixtures/drugList";
import MockDate from "mockdate";
import dayjs from "dayjs";
import {setCurrentTime} from "../../../features/time/timeSlice";
import {setDrugs} from "../../../features/drugs/drugsSlice";
import {render, screen, waitFor} from "@testing-library/react-native";
import {setDrugsTaken} from "../../../features/drugsTaken/drugsTakenSlice";

const drug = drugList[0];

beforeAll(() => {
    MockDate.set('2020-01-01');
    const currentTime = dayjs();
    store.dispatch(setCurrentTime(JSON.stringify(currentTime)));
    store.dispatch(setDrugs(drugList));
});

const dispatchDrugsTaken = () => {
    const dosingMoments = Object.entries(drug.dosingMoments);
    const drugsTaken = [];
    for (const [key] of dosingMoments) {
        drugsTaken.push(`${drug.name}_${key}`);
    }
    store.dispatch(setDrugsTaken(drugsTaken));
};

function WrappedComponent() {
    return (
        <Provider store={store}>
            <Drug drug={drugList[0]} index={0}/>
        </Provider>
    );
}

it('should correctly render Drug component', () => {
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
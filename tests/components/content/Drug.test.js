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
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react-native";
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
            <Drug drug={drugList[0]}/>
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

it('should add id of accordion with drug details to global state after accordion expansion', async () => {
    render(<WrappedComponent/>);

    await act(() => {
        fireEvent.press(screen.getByTestId(`details-${drug.name}`));
    });

    expect(store.getState().expandedAccordions.length).toBeGreaterThan(0);
});

it('should remove id of accordion with drug details from global state after accordion narrowing', async () => {
    render(<WrappedComponent/>);

    await act(() => {
        fireEvent.press(screen.getByTestId(`details-${drug.name}`)); // expand accordion
    });
    await act(() => {
        fireEvent.press(screen.getByTestId(`details-${drug.name}`)); // return to previous state
    });

    expect(store.getState().expandedAccordions.length).toBeLessThan(1);
});
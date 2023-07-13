import React from "react";
import renderer from "react-test-renderer";
import DosingMoments from "../../../components/content/DosingMoments";
import {drugList} from "../../fixtures/drugList";
import {fireEvent, render, screen, act} from "@testing-library/react-native";
import dayjs from "dayjs";
import MockDate from "mockdate";
import {Provider} from "react-redux";
import store from "../../../store";
import {setCurrentTime} from "../../../features/time/timeSlice";

beforeAll(() => {
    MockDate.set('2020-01-01');
    const mockedCurrentTime = dayjs().hour(7).minute(2);
    store.dispatch(setCurrentTime(JSON.stringify(mockedCurrentTime)));
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

const drug = drugList[0];
const handleConfirmDose = jest.fn();
const dosingMomentsContent = Object.entries(drug.dosingMoments);

function WrappedComponent() {
    return (
        <Provider store={store}>
            <DosingMoments
                drug={drug}
                content={dosingMomentsContent}
                handleConfirmDose={handleConfirmDose}
            />
        </Provider>
    );
}

it('should correctly render DosingMoments component', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should shorten dosing moment list after pressing the button to confirm the dose', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        headers: {
            get: arg => arg === 'content-type' ? 'application/json' : ''
        },
        json: () => Promise.resolve({
            status: 200
        })
    }));

    render(<WrappedComponent/>);

    await act(() => {
        fireEvent.press(screen.getByTestId('Xanax_hour1'));
    });

    expect(screen.queryByTestId('Xanax_hour1')).toBeNull();
});
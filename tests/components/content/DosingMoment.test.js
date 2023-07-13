import React from "react";
import renderer from "react-test-renderer";
import DosingMoment from "../../../components/content/DosingMoment";
import {drugList} from "../../fixtures/drugList";
import MockDate from "mockdate";
import dayjs from "dayjs";
import {Provider} from "react-redux";
import store from "../../../store";
import {setCurrentTime} from "../../../features/time/timeSlice";
import {act, fireEvent, render, screen} from "@testing-library/react-native";

const mockGetHeaders = {get: arg => arg === 'content-type' ? 'application/json' : ''};
beforeAll(() => {
    MockDate.set('2020-01-01');
    const mockedCurrentTime = dayjs();
    store.dispatch(setCurrentTime(JSON.stringify(mockedCurrentTime)));
});

let handleSetDosingMomentsToShow;

beforeEach(() => {
    handleSetDosingMomentsToShow = jest.fn();
});

const drug = drugList[0];
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

describe('handleConfirmDose', () => {
    it('should handle setDosingMomentsToShow after pressing confirmation button', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            headers: mockGetHeaders,
            json: () => Promise.resolve({
                status: 200
            })
        }));
        render(<WrappedComponent/>);

        await act(() => {
            fireEvent.press(screen.getByTestId(dosingMomentId));
        });

        expect(handleSetDosingMomentsToShow).toBeCalled();
    });

    it('should not handle setDosingMomentsToShow if request status does not equal 200', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            headers: mockGetHeaders,
            json: () => Promise.resolve({
                status: 404,
                message: 'Drug id was not found'
            })
        }));
        render(<WrappedComponent/>);

        await act(() => {
            fireEvent.press(screen.getByTestId(dosingMomentId));
        });

        expect(handleSetDosingMomentsToShow).not.toBeCalled();
    });

    it('should get error after pressing confirmation button if request was rejected', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            json: () => Promise.reject({
                status: 500,
                message: 'Something went wrong'
            })
        }));
        render(<WrappedComponent/>);

        await act(() => {
            fireEvent.press(screen.getByTestId(dosingMomentId));
        });

        expect(handleSetDosingMomentsToShow).not.toBeCalled();
    });
});
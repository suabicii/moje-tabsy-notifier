/**
 * @jest-environment jsdom
 * */
import React from "react";
import renderer from "react-test-renderer";
import Home from "../../screens/Home";
import {act, render, screen, fireEvent, waitFor} from "@testing-library/react-native";
import {BackHandler} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TimeContext} from "../../context/TimeContext";
import MockDate from "mockdate";
import dayjs from "dayjs";

let currentTime;
beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
            status: 200,
            message: 'successfully logged out'
        })
    }));

    MockDate.set('2020-01-01');
    currentTime = dayjs();
});

afterEach(() => {
    MockDate.reset();
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

const setCurrentTime = jest.fn();
const mockUseContext = jest.fn().mockImplementation(() => ({currentTime, setCurrentTime}));

React.useContext = mockUseContext;

const addListener = jest.fn();
const navigate = jest.fn();
const dispatch = jest.fn();

function WrappedComponent({navigateCustom}) {
    let navigateLocal;
    if (navigateCustom) {
        navigateLocal = navigateCustom;
    } else {
        navigateLocal = navigate;
    }

    return (
        <TimeContext.Provider value={{currentTime, setCurrentTime}}>
            <Home
                route={{
                    params: {logged: true}
                }}
                navigation={{
                    navigate: navigateLocal,
                    addListener,
                    dispatch
                }}
            />
        </TimeContext.Provider>
    );
}

it('should correctly render Home screen', async () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    await waitFor(() => {
        expect(tree).toMatchSnapshot();
    });
});

it('should go back to Login screen after pressing logout button', async () => {
    render(<WrappedComponent/>);

    await act(async () => {
        fireEvent.press(screen.getByTestId('btn-pill'));
    });

    expect(navigate).toBeCalled();
});

it('should stay in Home screen if logout request failed', async () => {
    const navigate = jest.fn();
    render(<WrappedComponent navigateCustom={navigate}/>);
    fetch.mockRejectedValueOnce(new Error('Something went wrong'));

    await act(async () => {
        fireEvent.press(screen.getByTestId('btn-pill'));
    });

    expect(navigate).toHaveBeenCalledTimes(0);
});

it('should block going back if user is logged in', async () => {
    const navigate = jest.fn();
    render(<WrappedComponent navigateCustom={navigate}/>);

    BackHandler.mockPressBack();

    await waitFor(() => {
        expect(navigate).toBeCalledTimes(0);
    });
});

it('should show modal with welcome message on first screen load after login', async () => {
    render(<WrappedComponent/>);

    await waitFor(() => {
        expect(screen.getByTestId('welcomeModal')).toBeTruthy();
    });
});

it('should not show modal with welcome message after login if AsyncStorage has information about it', async () => {
    await AsyncStorage.setItem('welcome_msg_disable', 'true');
    render(<WrappedComponent/>);

    await waitFor(() => {
        expect(screen.queryByTestId('welcomeModal')).toBeNull();
    });
});

it('should reload Drug component with drug list after pressing refresh button', async () => {
    render(<WrappedComponent/>);

    await act(() => {
        fireEvent.press(screen.getByTestId('refreshBtn'));
    });

    await waitFor(() => {
        expect(fetch).toBeCalled();
    });
});

// it('should save tomorrow time to local storage', async () => {
//     render(<WrappedComponent/>);
//
//     const tomorrowTime = await AsyncStorage.getItem('tomorrow_time');
//
//     await waitFor(() => {
//         expect(tomorrowTime).toBeTruthy();
//     });
// });
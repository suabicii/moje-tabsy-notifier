/**
 * @jest-environment jsdom
 * **/
import React from "react";
import renderer from "react-test-renderer";
import Home from "../../screens/Home";
import {act, render, screen, fireEvent, waitFor} from "@testing-library/react-native";
import {BackHandler} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MockDate from "mockdate";
import dayjs from "dayjs";
import {Provider} from "react-redux";
import store from "../../store";
import {drugList} from "../fixtures/drugList";
import {fetchDrugs} from "../../features/drugs/drugsSlice";
import {setCurrentTime} from "../../features/time/timeSlice";
import sendNotification from "../../utils/notifier";
import {setActiveSession} from "../../features/activeSession/activeSessionSlice";

let currentTime;
const mockGetHeaders = {get: arg => arg === 'content-type' ? 'application/json' : ''}
const expoPushToken = 'mock_expo_push_token123';
const loginToken = 'mock_login_token123';

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        headers: mockGetHeaders, // Avoid: "TypeError: Cannot read properties of undefined (reading 'get')"
        json: () => Promise.resolve({
            status: 200,
            message: 'successfully logged out'
        })
    }));
});

beforeEach(() => {
    store.dispatch(setActiveSession(true));
});

afterEach(() => {
    MockDate.reset();
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

const addListener = jest.fn();
const navigate = jest.fn();
const dispatch = jest.fn();

const userId = 'john@doe.com';

function WrappedComponent({navigateCustom}) {
    const navigateLocal = navigateCustom || navigate;

    return (
        <Provider store={store}>
            <Home
                route={{
                    params: {logged: true, userId, expoPushToken}
                }}
                navigation={{
                    navigate: navigateLocal,
                    addListener,
                    dispatch
                }}
            />
        </Provider>
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

    await waitFor(() => {
        expect(navigate).toBeCalled();
    });
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
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(drugList)
    }));
    store.dispatch(fetchDrugs('mock_token'));
    render(<WrappedComponent/>);

    await act(() => {
        fireEvent.press(screen.getByTestId('refreshBtn'));
    });

    await waitFor(() => {
        expect(fetch).toBeCalled();
    });
});

it('should save tomorrow time to local storage', async () => {
    render(<WrappedComponent/>);

    const tomorrowTime = dayjs().add(1, 'd').startOf('d');
    const tomorrowTimeJSON = JSON.stringify(tomorrowTime);

    await waitFor(() => {
        expect(AsyncStorage.setItem).toBeCalledWith('tomorrow_time', tomorrowTimeJSON);
    });
});

it('should remove tomorrow time and save new value in local storage if current time is same or after tomorrow time', async () => {
    const tomorrowTime = dayjs().subtract(1, 'd');
    const tomorrowTimeJSON = JSON.stringify(tomorrowTime);

    await AsyncStorage.setItem('tomorrow_time', tomorrowTimeJSON);

    render(<WrappedComponent/>);

    const tomorrowTimeNewValue = dayjs().add(1, 'd').startOf('d');
    const tomorrowTimeNewValueJSON = JSON.stringify(tomorrowTimeNewValue);

    await waitFor(() => {
        expect(AsyncStorage.setItem).toBeCalledWith('tomorrow_time', tomorrowTimeNewValueJSON);
    });
});

describe('Queue/send notifications', () => {
    let notifier;

    beforeAll(() => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            headers: mockGetHeaders,
            json: () => Promise.resolve(drugList)
        }));
    });

    beforeEach(async () => {
        notifier = require('../../utils/notifier');
        notifier = jest.spyOn(notifier, 'default');
        MockDate.set('2020-01-01');
        currentTime = dayjs();

        await act(() => {
            store.dispatch(setCurrentTime(JSON.stringify(currentTime)));
        });
    });

    afterEach(() => {
        notifier.mockClear();
        MockDate.reset();
    });

    it('should send notification at the appropriate time', async () => {
        const {dosing, name, unit} = drugList[0];
        const dosingTime = dayjs().hour(7).minute(2);
        await act(() => {
            store.dispatch(setCurrentTime(JSON.stringify(dosingTime)));
            store.dispatch(fetchDrugs(loginToken));
        });

        render(<WrappedComponent/>);

        await waitFor(() => {
            expect(sendNotification).toBeCalledWith(name, dosing, unit, expoPushToken);
        });
    });

    it('should send proper amount of notifications', async () => {
        const dosingTime = dayjs().hour(12).minute(2);
        await act(() => {
            store.dispatch(setCurrentTime(JSON.stringify(dosingTime)));
            store.dispatch(fetchDrugs(loginToken));
        });

        render(<WrappedComponent/>);

        /**
         * 3 because:
         * Xanax: 7:00,
         * Witamina C: 12:00
         * Metanabol: 12:00
         * */

        await waitFor(() => {
            expect(sendNotification).toBeCalledTimes(3);
        });
    });
});
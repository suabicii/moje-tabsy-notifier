/**
 * @jest-environment jsdom
 * */
import React from "react";
import renderer from "react-test-renderer";
import Home from "../../screens/Home";
import {act, render, screen, fireEvent, waitFor} from "@testing-library/react-native";
import {BackHandler} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
            status: 200,
            message: 'successfully logged out'
        })
    }));
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

it('should correctly render Home screen', () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    const tree = renderer.create(
        <Home
            route={{
                params: {logged: true}
            }}
            navigation={{
                navigate,
                addListener
            }}
        />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should go back to Login screen after pressing logout button', async () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    render(
        <Home
            route={{
                params: {logged: true}
            }}
            navigation={{
                navigate,
                addListener
            }}
        />
    );

    await act(async () => {
        fireEvent.press(screen.getByTestId('btn-pill'));
    });

    expect(navigate).toBeCalled();
});

it('should stay in Home screen if logout request failed', async () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    render(
        <Home
            route={{
                params: {logged: true}
            }}
            navigation={{
                navigate,
                addListener
            }}
        />
    );
    fetch.mockRejectedValueOnce(new Error('Something went wrong'));

    await act(async () => {
        fireEvent.press(screen.getByTestId('btn-pill'));
    });

    expect(navigate).toHaveBeenCalledTimes(0);
});

it('should block going back if user is logged in', () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    const dispatch = jest.fn();
    render(
        <Home
            route={{
                params: {logged: true}
            }}
            navigation={{
                navigate,
                addListener,
                dispatch
            }}
        />
    );

    BackHandler.mockPressBack();

    expect(navigate).toBeCalledTimes(0);
});

it('should show modal with welcome message on first screen load after login', async () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    render(
        <Home
            route={{
                params: {logged: true},
            }}
            navigation={{
                navigate,
                addListener
            }}
        />
    );

    await waitFor(() => {
        expect(screen.getByTestId('welcomeModal')).toBeTruthy();
    });
});

it('should not show modal with welcome message after login if AsyncStorage has information about it', async () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    await AsyncStorage.setItem('welcome_msg_disable', 'true');
    render(
        <Home
            route={{
                params: {logged: true},
            }}
            navigation={{
                navigate,
                addListener
            }}
        />
    );

    await waitFor(() => {
        expect(screen.queryByTestId('welcomeModal')).toBeNull();
    });
});
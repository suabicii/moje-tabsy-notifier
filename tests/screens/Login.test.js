import React from "react";
import renderer from "react-test-renderer";
import Login from "../../screens/Login";
import {fireEvent, render, screen, waitFor} from "@testing-library/react-native";
import {act} from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {generateToken} from "../../utils/tokenGenerator";
import {Provider} from "react-redux";
import store from "../../store";

const mockGetHeaders = {get: arg => arg === 'content-type' ? 'application/json' : ''}
const mockedExpoPushToken = '123!#*&abc456';

beforeAll(() => {
    const pushNotificationsRegistration = require("../../utils/pushNotificationsRegistration");
    jest.spyOn(pushNotificationsRegistration, "default").mockReturnValue(mockedExpoPushToken);
});

beforeEach(async () => {
    await AsyncStorage.clear();
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        headers: mockGetHeaders,
        json: () => Promise.resolve({
            status: 200,
            user_id: 'john@doe.com'
        })
    }));
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

const renderLoginScreen = (navigateCustom = null) => {
    const navigate = navigateCustom || jest.fn();
    render(
        <Provider store={store}>
            <Login navigation={{navigate}}/>
        </Provider>
    );
};

it('should correctly render Login screen', () => {
    const tree = renderer.create(
        <Provider store={store}>
            <Login/>
        </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

const submitUserData = async () => {
    await act(async () => {
        fireEvent.changeText(screen.getByTestId('email'), 'dummy@email.com');
        fireEvent.changeText(screen.getByTestId('password'), 'dummyPassword123^&!');
        fireEvent.press(screen.getByTestId('btn-pill'));
    });
};

it('should navigate to Home screen if logging in succeeded', async () => {
    const navigate = jest.fn();
    const tokenGenerator = require('../../utils/tokenGenerator');
    const mockedToken = '123!#*&abc456';
    jest.spyOn(tokenGenerator, 'generateToken').mockReturnValue(mockedToken);
    renderLoginScreen(navigate);

    await submitUserData();

    expect(navigate).toHaveBeenCalledWith('Home', {
        logged: true,
        userId: 'john@doe.com',
        loginToken: mockedToken,
        expoPushToken: mockedExpoPushToken
    });
});

it('should display error message if logging in failed due authentication error', async () => {
    renderLoginScreen();
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        headers: mockGetHeaders,
        json: () => Promise.resolve({error: 'Something went wrong'})
    }));

    await submitUserData();

    expect(screen.getByTestId('error')).toBeTruthy();
});

it('should display error message if logging in failed due connection problem', async () => {
    renderLoginScreen();
    fetch.mockRejectedValueOnce(new Error('Server error'));

    await submitUserData();

    expect(screen.getByTestId('error')).toBeTruthy();
});

it('should automatically log in if token is correct', async () => {
    const navigate = jest.fn();
    await AsyncStorage.setItem('mediminder_token', 'correct_token');

    renderLoginScreen(navigate);

    await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('Home', {
            logged: true,
            userId: 'john@doe.com',
            loginToken: 'correct_token',
            expoPushToken: mockedExpoPushToken
        })
    });
});

it('should stay in Login screen if token was not found', () => {
    const navigate = jest.fn();
    renderLoginScreen(navigate);

    expect(navigate).toBeCalledTimes(0);
});

it('should stay in Login screen and clear AsyncStorage if token was incorrect', async () => {
    await AsyncStorage.setItem('mediminder_token', 'incorrect_token');
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
            status: 200,
            message: 'Mobile app user is not logged in'
        })
    }));

    renderLoginScreen();
    const token = await AsyncStorage.getItem('incorrect_token');

    expect(token).toBeFalsy();
});
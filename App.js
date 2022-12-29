import Login from "./screens/Login";
import Home from "./screens/Home";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import registerNNPushToken from 'native-notify';
import {APP_ID, APP_TOKEN} from "@env";
import {TimeContext} from "./context/TimeContext";
import dayjs from "dayjs";
import {useMemo, useState} from "react";

const Stack = createNativeStackNavigator();

export default function App() {
    const [currentTime, setCurrentTime] = useState(dayjs());

    registerNNPushToken(APP_ID, APP_TOKEN);

    const appTitle = 'Moje-Tabsy.pl 💊';
    const headerBarStyles = {
        headerStyle: {
            backgroundColor: "#78c2ad"
        },
        headerTintColor: '#fff'
    };

    const value = useMemo(
        () => ({currentTime, setCurrentTime}),
        [currentTime]
    );

    return (
        <NavigationContainer>
            <TimeContext.Provider value={value}>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            title: `${appTitle} | Zaloguj się`,
                            ...headerBarStyles
                        }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                            title: `${appTitle} | Powiadomienia`,
                            headerBackVisible: false,
                            ...headerBarStyles
                        }}
                    />
                </Stack.Navigator>
            </TimeContext.Provider>
        </NavigationContainer>
    );
}
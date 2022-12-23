import Login from "./screens/Login";
import Home from "./screens/Home";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import registerNNPushToken from 'native-notify';
import {APP_ID, APP_TOKEN} from "@env";
import {DrugTakenContext} from "./context/DrugTakenContext";
import {useMemo, useState} from "react";

const Stack = createNativeStackNavigator();

export default function App() {
    const [drugTakenChecker, setDrugTakenChecker] = useState([]); // Array for storing strings associated
    // with dosing moment keys -> if user clicks confirmation button, key will be pushed to the array, so thanks to it
    // dosing moment won't be rendered again later

    registerNNPushToken(APP_ID, APP_TOKEN);

    const appTitle = 'Moje-Tabsy.pl 💊';
    const headerBarStyles = {
        headerStyle: {
            backgroundColor: "#78c2ad"
        },
        headerTintColor: '#fff'
    };
    const value = useMemo(
        () => ({drugTakenChecker, setDrugTakenChecker}),
        [drugTakenChecker]
    );

    return (
        <NavigationContainer>
            <DrugTakenContext.Provider value={value}>
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
            </DrugTakenContext.Provider>
        </NavigationContainer>
    );
}
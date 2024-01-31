import Login from "./screens/Login";
import Home from "./screens/Home";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Provider} from "react-redux";
import store from "./store";
import React, {useState} from "react";
import {Button} from "react-native-paper";
import {Appearance, useColorScheme} from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
    const colorScheme = useColorScheme();
    const lightModeIcon = 'white-balance-sunny';
    const darkModeIcon = 'weather-night';
    const themeTogglerIconDefault = colorScheme === "light" ? lightModeIcon : darkModeIcon;
    const [themeTogglerIcon, setThemeTogglerIcon] = useState(themeTogglerIconDefault);

    const appTitle = 'MediMinder 💊';
    const headerBarStyles = {
        headerStyle: {
            backgroundColor: "#78c2ad"
        },
        headerTintColor: '#fff'
    };

    function ThemeToggler() {
        return <Button
            mode="text"
            color="#fff"
            compact={true}
            icon={themeTogglerIcon}
            style={{marginTop: 3}}
            contentStyle={{
                padding: 0,
                height: 25,
            }}
            labelStyle={{fontSize: 25}}
            onPress={toggleTheme}
        />
    }

    const toggleTheme = () => {
        if (themeTogglerIcon === lightModeIcon) {
            Appearance.setColorScheme('dark');
            setThemeTogglerIcon(darkModeIcon);
        } else {
            Appearance.setColorScheme('light');
            setThemeTogglerIcon(lightModeIcon);
        }
    };

    return (
        <NavigationContainer>
            <Provider store={store}>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            title: `${appTitle} | Zaloguj się`,
                            headerRight: () => <ThemeToggler/>,
                            ...headerBarStyles
                        }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                            title: `${appTitle} | Powiadomienia`,
                            headerRight: () => <ThemeToggler/>,
                            headerBackVisible: false,
                            ...headerBarStyles
                        }}
                    />
                </Stack.Navigator>
            </Provider>
        </NavigationContainer>
    );
}
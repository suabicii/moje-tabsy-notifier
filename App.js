import Login from "./screens/Login";
import Home from "./screens/Home";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
    const appTitle = 'Moje-Tabsy.pl 💊';
    const headerBarStyles = {
        headerStyle: {
            backgroundColor: "#78c2ad"
        },
        headerTintColor: '#fff'
    };
    return (
        <NavigationContainer>
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
                        ...headerBarStyles
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
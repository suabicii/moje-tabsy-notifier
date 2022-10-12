import Login from "./screens/Login";
import Home from "./screens/Home";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
    const appTitle = 'Moje-Tabsy.pl 💊';
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{title: `${appTitle} | Zaloguj się`}}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{title: `${appTitle} | Powiadomienia`}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
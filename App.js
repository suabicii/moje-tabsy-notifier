import Login from "./screens/Login";
import {createStackNavigator} from "react-navigation-stack";
import Home from "./screens/Home";
import {createAppContainer} from "react-navigation";

const AppNavigator = createStackNavigator({
    Login,
    Home
});

const Navigator = createAppContainer(AppNavigator);

export default function App() {
    return (
        <Navigator>
            <Login/>
        </Navigator>
    );
}

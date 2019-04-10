import { createStackNavigator, createAppContainer } from 'react-navigation';

const MainNavigator = createStackNavigator({
  Splash: { screen: Splash },
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen }
});

const App = createAppContainer(MainNavigator);

export default App;

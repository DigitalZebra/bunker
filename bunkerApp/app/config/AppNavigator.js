import {StackNavigator, TabNavigator, addNavigationHelpers} from "react-navigation"
import React from 'react'
import {View, Text} from 'react-native'
import {connect} from 'react-redux'
import LoginScreen from '../user/LoginScreen'
import RoomScreen from '../rooms/RoomScreen'
import RoomSelector from '../rooms/RoomSelector'
import SettingsScreen from './SettingsScreen'

const HomePageTabNavigator = TabNavigator({
	MainTab: {
		screen: RoomSelector,
		navigationOptions: {
			title: 'Rooms',
			tabBarLabel: 'Rooms'
		}
	},
	SettingsTab: {
		screen: SettingsScreen,
		navigationOptions: {
			title: 'Settings',
			tabBarLabel: 'Settings'
		}
	}
});

export const AppNavigator = StackNavigator({
	Root: {screen: HomePageTabNavigator},
	Room: {screen: RoomScreen},
	Login: {screen: LoginScreen}
}, {
	navigationOptions: {
		headerStyle: {
			backgroundColor: '#45494D',
		},
		headerTitleStyle: {
			color: 'white'
		},
		headerBackTitleStyle: {
			color: 'white'
		},
		headerTintColor: 'white'
	}
});

class AppWithNavigationState extends React.PureComponent {

	// onNavigationStateChange (prevState, currentState) {
	// 	const {dispatch} = this.props
	// }

	render() {
		const {dispatch, nav} = this.props
		const navigation = addNavigationHelpers({dispatch, state: nav})
		return <AppNavigator navigation={navigation}/>
	}
}

const mapStateToProps = (state) => ({nav: state.nav })
const mapDispatchToProps = dispatch => ({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState)

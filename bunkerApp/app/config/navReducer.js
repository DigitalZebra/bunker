import {LayoutAnimation} from 'react-native'
import {NavigationActions} from 'react-navigation'
import {AppNavigator} from './AppNavigator'

export default (state, action) => {
	if (state && state.asMutable) {
		state = state.asMutable({deep: true})
	}
	// TODO: need to do a logout specific reducer???
	// type: 'user/signOut'
	// this should redirect the user to the 'rooms' screen.

	const newState = AppNavigator.router.getStateForAction(action, state)
	return newState || state
}



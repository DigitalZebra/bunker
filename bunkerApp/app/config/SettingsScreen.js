import React from 'react'
import {View, Text, Button} from 'react-native'
import {connect} from 'react-redux'
import {signUserOut} from '../session/sessionThunks'

class SettingsScreen extends React.PureComponent {

	render() {

		return (
			<View>
				<Text>Settings here</Text>
				<Button onPress={() => this.props.signUserOut()} title='Sign Out' color="#990022" />
			</View>);
	}
}

export default connect(null, { signUserOut })(SettingsScreen);

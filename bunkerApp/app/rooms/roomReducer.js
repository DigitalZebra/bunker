import _ from 'lodash'
import Immutable from 'seamless-immutable'
import {makeReducer} from '../config/reduxTools'
import {reduceMessage, reduceMessages} from './messages/messageReducer'

const INITIAL_STATE = Immutable({
	rooms: null,
	currentBunkerUser: null
});

const reducer = {}

reducer['socketio-init'] = (state, {rooms, user}) => {
	rooms.forEach((room) => {
		room.$messages = reduceMessages(user, room.$messages);
	});

	return state.merge({rooms: _.keyBy(rooms, '_id'), currentBunkerUser: user});
};

reducer['socketio-room-messaged'] = (state, {data}) => {
	const message = data
	const roomId = message.room
	const room = state.rooms[roomId]

	if (message.edited) {
		const index = _.findIndex(room.$messages, { _id: message._id });

		if (index === -1) return state;

		const $messages =
			[
				...room.$messages.slice(0, index),
				reduceMessage(state.currentBunkerUser, message, room.$messages[index + 1]),
				...room.$messages.slice(index + 1)
			];

		return state.setIn(['rooms', roomId, '$messages'], $messages);
	} else {
		const $messages = [reduceMessage(state.currentBunkerUser, message, room.$messages[0]), ...room.$messages]
		return state.setIn(['rooms',roomId,'$messages'], $messages)
	}
}

reducer['room/messagesFetched'] = (state, {roomId, messages}) => {

	const room = state.rooms[roomId];

	messages = reduceMessages(state.currentBunkerUser, messages);

	let $messages = messages;

	// this is goofy but we have to replace the last message of the original list to make various variables correct,
	// then merge everything together.
	if (room.$messages.length) {
		$messages = [...room.$messages.slice(0, room.$messages.length - 1),
			_.extend({}, reduceMessage(state.currentBunkerUser, room.$messages[room.$messages.length - 1], messages[0])),
			...messages];
	}

	return state.setIn(['rooms', roomId, '$messages'], $messages);
};

export const messagesFetched = (roomId, messages) => ({type: 'room/messagesFetched', roomId, messages});

export default makeReducer(INITIAL_STATE, reducer)


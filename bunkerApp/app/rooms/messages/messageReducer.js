
import _ from 'lodash'

const isSameDay = (message, previousMessage) => {
	const currMessageDate = new Date(message.createdAt);

	if (!previousMessage) {
		return false;
	}

	const prevMessageDate = new Date(previousMessage.createdAt);
	return currMessageDate.toDateString() === prevMessageDate.toDateString();
};

// This method assumes that the previous message was reduced first
export const reduceMessage = (user, message, previousMessage) => {

	// full author object is populated sometimes, we just want ID.
	message.author = _.isString(message.author) ? message.author : message.author && message.author._id;

	message.isCurrentUser = message.author && message.author.toLowerCase() === user._id.toLowerCase();

	message.isFirstInRun = true;

	if (previousMessage && previousMessage.author && previousMessage.author.toLowerCase() === message.author.toLowerCase()) {
		message.isFirstInRun = false;
	}

	message.isSameDay = isSameDay(message, previousMessage);

	return message;
};

export const reduceMessages = (user, messages) => {
	const newMessagesArray = [];

	// walk the messages list in reverse, reducing as we go.
	for (let i = messages.length - 1; i >= 0; i--) {
		newMessagesArray[i] = reduceMessage(user, messages[i], newMessagesArray[i + 1]);
	}

	return newMessagesArray;
};

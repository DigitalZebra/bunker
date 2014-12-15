/* global User, Room, _, actionUtil, require */

/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict';

var moment = require('moment');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

// GET /room/:id
// Overridden from sails blueprint to disable subscribing
module.exports.findOne = function (req, res) {
	var pk = actionUtil.requirePk(req);
	Room.findOne(pk).populateAll().exec(function found(err, matchingRecord) {
		if (err) return res.serverError(err);
		if (!matchingRecord) return res.notFound('No record found with the specified `id`.');
		res.ok(matchingRecord);
	});
};


// POST /room
// Create a room
module.exports.create = function (req, res) {
	var userId = req.session.userId;
	var name = req.param('name') || 'Untitled';

	// Create new instance of model using data from params
	Room.create({name: name}).exec(function (err, room) {

		// Make user an administrator
		RoomMember.create({room: room.id, user: userId, role: 'administrator'}).exec(function (error, roomMember) {
			RoomMember.publishCreate(roomMember);

			// WARNING
			// Do not publishCreate of this room, it will go to all users who's client will then join it

			res.status(201);
			res.ok(room.toJSON());
		});
	});
};

// GET /room/:id/join
// Join a room
module.exports.join = function (req, res) {
	var pk = actionUtil.requirePk(req);
	var userId = req.session.userId;

	Room.findOne(pk).exec(function (err, room) {
		if (err) return res.serverError(err);
		if (!room) return res.notFound();

		res.ok(room); // Can return the room info immediately; perform the subscriptions asynchronously below

		// Subscribe the socket to message and updates of this room
		// Socket will now receive messages when a new message is created
		Room.subscribe(req, room, ['message', 'update']);
		RoomMember.watch(req); // TODO probably an information leak but ARS can't update without it

		RoomMember.find().where({room: pk})
			.then(function (roomMembers) {
				if (_.find(roomMembers, {user: userId})) { // Do we need to add as a member?
					return roomMembers;
				}

				return RoomMember.create({room: pk, user: userId}).then(function (roomMember) {
					RoomMember.publishCreate(roomMember);

					// Create system message to inform other users of this user joining
					User.findOne(userId).then(function (user) {
						RoomService.messageRoom(pk, user.nick + ' has joined the room');
					});
					return roomMembers;
				});
			})
			.then(function (roomMembers) {
				// Subscribe the new user to every existing user
				_.each(roomMembers, function (member) {
					User.subscribe(req, member.user, ['message', 'update']);
				});

				// Subscribe all of the existing subscribers to this new user
				_.each(Room.subscribers(pk, 'update'), function (subscriber) {
					User.subscribe(subscriber, userId, ['message', 'update']);
				});
			})
			.catch(res.serverError);
	});
};

// PUT /room/:id/leave
// Current user requesting to leave a room
module.exports.leave = function (req, res) {
	var pk = actionUtil.requirePk(req);
	var userId = req.session.userId;

	Room.findOne(pk).exec(function (error, room) {
		if (error) return res.serverError();
		if (!room) return res.notFound();

		res.ok(room);

		// Unsubscribe socket from this room
		Room.unsubscribe(req, room, ['message', 'update']);
		// TODO unsubscribe all members? probably not... need to figure out which ones

		// Remove room membership
		RoomMember.destroy({room: pk, user: userId}).exec(function (err, destroyedRecords) {
			_.each(destroyedRecords, function (destroyed) {
				RoomMember.publishDestroy(destroyed.id);
				RoomMember.retire(destroyed);

				// Create system message to inform other users of this user leaving
				User.findOne(userId).exec(function (err, user) {
					if (err) return res.serverError(err);
					RoomService.messageRoom(pk, user.nick + ' has left the room');
				});
			});
		});
	});
};

// GET /room/:id/messages
// Get the messages of a room, with optional skip amount
module.exports.messages = function (req, res) {
	var roomId = actionUtil.requirePk(req);
	var skip = req.param('skip') || 0;
	// TODO check for roomId and user values

	// find finds multiple instances of a model, using the where criteria (in this case the roomId
	// we also want to sort in DESCing (latest) order and limit to 50
	// populateAll hydrates all of the associations
	Message.find().where({room: roomId}).sort('createdAt DESC').skip(skip).limit(50).populateAll().exec(function (error, messages) {
		res.ok(messages); // send the messages
	});
};

// GET /room/:id/history
// Get historical messages of a room
module.exports.history = function (req, res) {
	var roomId = actionUtil.requirePk(req);
	var startDate = req.param('startDate');
	var endDate = req.param('endDate');

	Message.find({room: roomId, createdAt: {'>': moment(startDate).toDate(), '<': moment(endDate).toDate()}})
		.populate('author')
		.exec(function (err, messages) {
			if (err) return res.serverError(err);
			res.ok(messages);
		});
};

"use strict";

jQuery(function ($) {
	var socket = io.connect(),
        $questionForm = $('#question-submit'), 
		$questionBox = $('#question'), 
		$users = $('#users'), 
		$questions = $('#questions-display'), 
		$usernameForm = $('#username-set'), 
		$usernameError = $('#username-error'), 
		$usernameBox = $('#username');

	// First step is to handle our username form
	$usernameForm.submit(function (e) {
		e.preventDefault();

		// create a new socket event called create_user
		socket.emit('create_user', $usernameBox.val(), function (data) {
			// If we've created a valid user we hide the username form and display our questions
			if (data) {
				$('#username-wrapper').hide();
				$('#content').show();
			} else {
				$usernameError.html('That username is already taken! Try again.');
			}
		});
		$usernameBox.val('');
	});

	// Now we need to handle the case where we receive an updated list of users
	socket.on('usernames', function (data) {
		// Have an empty string of html that we append with all our users
		var html = '', i;
		for (i = 0; i < data.length; i++) {
			html += data[i] + '<br/>';
		}
		// Replaces current value of $users with our modified string of html
		$users.html(html);
	});

	// For handling question submissions we define a send_question socket event
	$questionForm.submit(function (e) {
		e.preventDefault();
		socket.emit('send_question', $questionBox.val());
		$questionBox.val('');
	});

	// When we receive a new question we just append to our list of questions 
	socket.on('new_question', function (data) {
		$questions.append('<b>' + data.username + ': </b>' + data.question + "<br/>");
	});

});
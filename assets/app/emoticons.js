app.factory('emoticons', function () {
	var files = [
		'3.gif',
		'allthethings.png',
		'argh.gif',
		'arya.png',
		'awthanks.png',
		'badass.png',
		'bang.gif',
		'banjo.gif',
		'beer.png',
		'boom.gif',
		'bravo.gif',
		'buddy.gif',
		'buildchicken.jpg',
		'burger.gif',
		'cacodemon.gif',
		'cake.png',
		'canada.gif',
		'cat.png',
		'catdrugs.gif',
		'catstare.gif',
		'ceilingcat.png',
		'chef.gif',
		'chewie.png',
		'china.gif',
		'chompy.gif',
		'clint.gif',
		'comeatmebro.png',
		'crossarms.gif',
		'crushed.png',
		'damn.gif',
		'dance.gif',
		'dealwithit.gif',
		'devil.gif',
		'dice.gif',
		'disapproval.png',
		'doge.png',
		'doomguy.gif',
		'eel.png',
		'effort.gif',
		'eng101.gif',
		'f5.gif',
		'facepalm.gif',
		'feelsgood.png',
		'foreveralone.png',
		'france.gif',
		'frog.gif',
		'frown.gif',
		'fwp.png',
		'fuuu.png',
		'getin.gif',
		'getout.gif',
		'golfclap.gif',
		'goodnews.png',
		'google.gif',
		'grumpycat.png',
		'hattip.gif',
		'haveaseat.png',
		'heart.gif',
		'hellyeah.gif',
		'heythere.gif',
		'hist101.gif',
		'hodor.png',
		'iceburn.gif',
		'idontalways.png',
		'imp.gif',
		'indeed.png',
		'itsatrap.png',
		'japan.gif',
		'jonsnow.png',
		'likeasir.png',
		'mad.gif',
		'mancubus.gif',
		'masterstroke.gif',
		'mindblown.gif',
		'motherofgod.gif',
		'munch.gif',
		'ninja.gif',
		'nyan.gif',
		'notbad.png',
		'notsureif.png',
		'ohdear.png',
		'okay.png',
		'old.gif',
		'omgwhy.gif',
		'orly.png',
		'parrot.gif',
		'panic.gif',
		'pbjtime.gif',
		'pinky.gif',
		'psyduck.gif',
		'qq.gif',
		'quagmire.gif',
		'rageguy.png',
		'rant.gif',
		'rimshot.gif',
		'rolldice.gif',
		'rolleyes.gif',
		'russia.gif',
		'sadpanda.png',
		'sarge.gif',
		'sax.gif',
		'science.gif',
		'shh.gif',
		'shipit.png',
		'shrug.png',
		'sigh.gif',
		'siren.gif',
		'skull.gif',
		'smile.gif',
		'smith.gif',
		'smug.gif',
		'smugdog.gif',
		'soulsphere.gif',
		'ssj.gif',
		'stare.png',
		'stare2.gif',
		'successkid.png',
		'suspense.gif',
		'sweatdrop.gif',
		'tableflip.png',
		'therent.png',
		'thumbsdown.png',
		'thumbsnone.png',
		'thumbsup.png',
		'tinfoil.gif',
		'toot.gif',
		'trollface.png',
		'truestory.png',
		'twss.png',
		'unlocked.gif',
		'unsmith.gif',
		'usa.gif',
		'v.gif',
		'waffenss.gif',
		'wat.png',
		'wink.gif',
		'woop.gif',
		'words.gif',
		'xd.gif',
		'yaycloud.gif'
	];

	var list = _.map(files, function (file) {
		return {name: emoticonName(file), file: file, $count: 0};
	});

	return {
		list: list,
		names: _.pluck(list, 'name'),
		files: _.pluck(list, 'file')
	};
});

app.filter("emoticonName", function () {
	return emoticonName;
});

function emoticonName(input) {
	return input.replace(/.\w+$/, '');
}

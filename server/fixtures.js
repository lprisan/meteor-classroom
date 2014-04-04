if (Classrooms.find().count() === 0) {
	Classrooms.insert({
		id: 1,
		title: 'A first test classroom',
		blackout: false,
		presentTags: []
	});
}

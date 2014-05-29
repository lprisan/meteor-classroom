
if (Classrooms.find().count() === 0) {
	Classrooms.insert({
		_id: "9AWkshbxHiE45Aci7",
		name: 'A first test classroom',
		global: {
			paused: false,
			pauserDevice: '',
			masterHint: ''
		},
		devices: ["LziCQ4oJQ7bpQv7sA", "mmLHNnR5iWk87Xx2i"]
	});
}

if (Devices.find().count() === 0) {
	Devices.insert({
		_id: "LziCQ4oJQ7bpQv7sA",
		name: 'Red Lamp',
		current:{
			activity: {
				id: 1,
				name: 'Kill the bug',
				state: {
					completedMaps: 0,
					stepsDone: 0,
					stepsToGo: 0,
					hintPresent: '',
					wrongMoves: 0
				}
			},
			presentTags: []
		}

	});
	Devices.insert({
		_id: "mmLHNnR5iWk87Xx2i",
		name: 'Blue Lamp',
		current:{
			activity: {
				id: 1,
				name: 'Kill the bug',
				state: {
					completedMaps: 0,
					stepsDone: 0,
					stepsToGo: 0,
					hintPresent: '',
					wrongMoves: 0
				}
			},
			presentTags: []
		}

	});
}
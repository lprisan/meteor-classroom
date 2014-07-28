
if (Classrooms.find().count() === 0) {
	Classrooms.insert({
		_id: "9AWkshbxHiE45Aci7",
		name: 'A first test classroom',
		global: {
			paused: false,
			pauserDevice: '',
			masterHint: ''
		},
		devices: ["LziCQ4oJQ7bpQv7sA", "mmLHNnR5iWk87Xx2i", "uAXTQLmEnD5GNDpqy"]
	});
}

if (Devices.find().count() === 0) {
	Devices.insert({
		_id: "LziCQ4oJQ7bpQv7sA",
		name: 'LP Desktop',
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
		name: 'Yellow Lamp - transformer05',
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
		_id: "uAXTQLmEnD5GNDpqy",
		name: 'Red Lamp - transformer00',
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
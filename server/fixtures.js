
if (Classrooms.find().count() === 0) {
	Classrooms.insert({
		_id: "9AWkshbxHiE45Aci7",
		name: 'A first test classroom',
		global: {
			paused: false,
			pauserDevice: ''
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
				name: 'Construct fraction',
				state: {
					numerator: 0,
					denominator: 1,
					value: 0,
					representation: "circular"
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
				name: 'Construct fraction',
				state: {
					numerator: 0,
					denominator: 1,
					value: 0,
					representation: "circular"
				}
			},
			presentTags: []
		}

	});
}
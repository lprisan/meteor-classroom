
if (Classrooms.find().count() === 0) {
	Classrooms.insert({
		id: 1,
		name: 'A first test classroom',
		global: {
			paused: false
		},
		devices: [1, 2]
	});
}

if (Devices.find().count() === 0) {
	Devices.insert({
		id: 1,
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
		id: 2,
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
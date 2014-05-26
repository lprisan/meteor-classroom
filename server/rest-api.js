// Method #1: HTTP Publish (https://github.com/CollectionFS/Meteor-http-publish)
// // Add access points for `GET`, `POST`, `PUT`, `DELETE`
//   HTTP.publish({collection: Classrooms}, function(data) {
//     // this.userId, this.query, this.params
//     return Classrooms.find({});
//   });


// // Add access points for `GET`, `POST`, `PUT`, `DELETE`
//   HTTP.publish({collection: Devices}, function(data) {
//     // this.userId, this.query, this.params
//     return Devices.find({});
//   });

// Method #2: CollectionAPI (https://github.com/crazytoad/meteor-collectionapi) 
// it allows the execution of a method before the insertion (we want to have a historic of the states of classroom and devices)

if (Meteor.isServer) {
  Meteor.startup(function () {

    // All values listed below are default
    collectionApi = new CollectionAPI({
      authToken: undefined,              // Require this string to be passed in on each request
      apiPath: 'api',          // API path prefix
      standAlone: false,                 // Run as a stand-alone HTTP(S) server
      sslEnabled: false,                 // Disable/Enable SSL (stand-alone only)
      listenPort: 3005,                  // Port to listen to (stand-alone only)
      listenHost: undefined,             // Host to bind to (stand-alone only)
      privateKeyFile: 'privatekey.pem',  // SSL private key file (only used if SSL is enabled)
      certificateFile: 'certificate.pem' // SSL certificate key file (only used if SSL is enabled)
    });

    // Add the collection Classrooms to the API "/classrooms" path
    collectionApi.addCollection(Classrooms, 'classrooms', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: insertClassroomHistory,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });


    // Add the collection Devices to the API "/devices" path
    collectionApi.addCollection(Devices, 'devices', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: insertDeviceHistory,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Starts the API server
    collectionApi.start();
  });
}


insertClassroomHistory = function(collectionID, obj, newValues) {

	newValues.timestamp = new Date().getTime();

	//if the old and new values are different, we insert the newValues into the classroom history
	// if((obj.global.paused != newValues.global.paused) ||
	// 	(obj.global.pauserDevice != newValues.global.pauserDevice)) {
	// 	var record = JSON.parse(JSON.stringify(newValues));//We create a copy of the new classroom state object
	// 	record.classroomid = record._id;//Each history entry should have a different _id, so we pass the classroom id to another field
	// 	record._id = undefined;
	// 	console.log('Detected classroom state change - instering into history...'+record);
	// 	var newId = ClassroomHistory.insert(record,displayResult);
	// 	console.log('inserting into classroom history: '+newId);
	// }

	return true;
}

insertDeviceHistory = function(collectionID, obj, newValues) {

	newValues.timestamp = new Date().getTime();

	//if the old and new values are different, we insert the newValues into the device history
	// if(true) { //TODO: COMPLETE!!!!
	// 	var record = JSON.parse(JSON.stringify(newValues));//We create a copy of the new device state object
	// 	record.deviceid = record._id;//Each history entry should have a different _id, so we pass the device id to another field
	// 	record._id = undefined;
	// 	console.log('Detected device state change - instering into history...'+record);
	// 	var newId = DeviceHistory.insert(record,displayResult);
	// 	console.log('inserting into device history: '+newId);
	// }

	return true;
}


// displayResult = function(error, result){
// 	if(typeof error != 'undefined') console.log('There was an error '+error);
// 	else console.log('Record inserted successfully '+result);
// }
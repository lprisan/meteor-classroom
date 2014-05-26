//Note: The classroom data should be available under the Classrooms variable! (in classrooms.js)

//Reactive code to react to changes in the classroom data
Deps.autorun(function() {
    console.log("entering autorun");
  var classroomData = Classrooms.findOne({_id: "9AWkshbxHiE45Aci7"});

  if(classroomData){
        var status;

        //we black out the classroom if so set
        if(classroomData.global.paused){
            document.body.style.background = 'black';  
            status = classroomData.name +  " has been stopped!\n";
        } 
        else{
            document.body.style.background = 'white';  
            status = classroomData.name +  " is transcurring normally.\n";
        } 

        if(classroomData.devices.length>0){
            for(i=0;i<classroomData.devices.length;i++){

                var device = Devices.findOne({_id: classroomData.devices[i]});

                if(device){
                    if(device.current.presentTags){
                        status += "Tags present in device "+classroomData.devices[i]+": "+device.current.presentTags.toString()+"\n";
                    }
                }

            }

        }


        console.log(status);

        if(document.getElementById('status')){
            if(document.getElementById('status').childNodes[0]){//if there is already a child node
                document.getElementById('status').childNodes[0].nodeValue = status;

            }else{
                var statusText = document.createTextNode('');
                document.getElementById('status').appendChild(statusText);
                statusText.nodeValue = status;
            }
        }
  }
  return null;

});


// chilitags variables
var fpsText, start;
var tagBlackout = "tag_1";
var tagAnother = "tag_2";

var rendered = false;

// If it is the camera version, we initialize the whole camera and chilitags setup
Template.camera.rendered = function() {
        console.log("entering camera rendered");

 if (!rendered) {
        //prevent to do the initialization twice
        rendered = true;

        initPaprikaEvents();
    }
}

// If it is the non-camera version, we do the simplified initialization
Template.nocamera.rendered = function() {
 console.log("entering nocamera rendered");

 if (!rendered) {
        //prevent to do the initialization twice
        rendered = true;

        initSimpleClassroom();
    }
}


function initSimpleClassroom() {
    // chilitags info - not needed in the simple classroom
    // fpsText = document.createTextNode('');
    // document.getElementById('fps').appendChild(fpsText);
    // fpsText.nodeValue = "Waiting for classroom data...";
}

function initPaprikaEvents() {
    Paprika.start(document.getElementById('videoFrame'));
    
    // chilitags info
    fpsText = document.createTextNode('');
    document.getElementById('fps').appendChild(fpsText);

    start = new Date();

    Paprika.onTagUpdate(function(objects) {
        var end = new Date();

        var str = 'Objects: ';
        for(var obj in objects){
            str += obj + "(" +objects[obj][3]+ ")" + " ";
        }
        fpsText.nodeValue = "Chilitags processing = " + (end.getTime() - start.getTime()) + "ms." + str;
        start = end;
    });

    //blackout tag
    Paprika.onAppear(blackoutScreen, tagBlackout);
    Paprika.onDisappear(normalScreen, tagBlackout);
    //other tag - only updates status
    Paprika.onAppear(addAnotherTag, tagAnother);
    Paprika.onDisappear(removeAnotherTag, tagAnother);
}

function blackoutScreen() {
    document.body.style.background = 'black';

    //Modify the database if the classroom was not already blacked
    var classroomData = Classrooms.findOne({_id: "9AWkshbxHiE45Aci7"});
    var classId = classroomData._id;
    if(!classroomData.global.paused){
        Classrooms.update({_id: classId},{$set: {global: {paused: true}}});

        //For now, we assume we are in device 1 always
        var deviceData = Devices.findOne({_id: "LziCQ4oJQ7bpQv7sA"});
        var devId = deviceData._id;
        if(deviceData.current.presentTags){
            console.log("updating device info for device "+deviceData.id);
            Devices.update({_id: devId},{$push: {"current.presentTags": tagBlackout}});
        }

    }



}

function normalScreen(){
    document.body.style.background = 'white';    

    //Modify the database if the classroom was not already unblacked
    var classroomData = Classrooms.findOne({_id: "9AWkshbxHiE45Aci7"});
    var classId = classroomData._id;
    if(classroomData.global.paused){
        Classrooms.update({_id: classId},{$set: {global: {paused: false}}});

        //For now, we assume we are in device 1 always
        var deviceData = Devices.findOne({_id: "LziCQ4oJQ7bpQv7sA"});
        var devId = deviceData._id;
        if(deviceData.current.presentTags){
            Devices.update({_id: devId},{$pull: {"current.presentTags": tagBlackout}});
        }
    }


}

function addAnotherTag() {

          //For now, we assume we are in device 1 always
        var deviceData = Devices.findOne({_id: "LziCQ4oJQ7bpQv7sA"});
        var devId = deviceData._id;
        if(deviceData.current.presentTags){
            Devices.update({_id: devId},{$push: {"current.presentTags": tagAnother}});
        }

}

function removeAnotherTag(){

         //For now, we assume we are in device 1 always
        var deviceData = Devices.findOne({_id: "LziCQ4oJQ7bpQv7sA"});
        var devId = deviceData._id;
        if(deviceData.current.presentTags){
            Devices.update({_id: devId},{$pull: {"current.presentTags": tagAnother}});
        }

}

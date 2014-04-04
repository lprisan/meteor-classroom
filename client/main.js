// Meteor.startup(function(){
//     initPaprikaEvents();
// });

//Note: The classroom data should be available under the Classrooms variable! (in classrooms.js)

//Reactive code to react to changes in the classroom data
Deps.autorun(function() {
    console.log("entering autorun");
  var classroomData = Classrooms.findOne({id: 1});

  if(classroomData){
        var status;

        //we black out the classroom if so set
        if(classroomData.blackout){
            document.body.style.background = 'black';  
            status = classroomData.title +  " has been stopped!";
        } 
        else{
            document.body.style.background = 'white';  
            status = classroomData.title +  " is transcurring normally. On camera tags " + classroomData.presentTags;
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
    var classroomData = Classrooms.findOne({id: 1});
    var classId = classroomData._id;
    if(!classroomData.blackout){
        Classrooms.update({_id: classId},{$set: {blackout: true}, $push: {presentTags: tagBlackout}});
    }

}

function normalScreen(){
    document.body.style.background = 'white';    

    //Modify the database if the classroom was not already unblacked
    var classroomData = Classrooms.findOne({id: 1});
    var classId = classroomData._id;
    if(classroomData.blackout){
        Classrooms.update({_id: classId},{$set: {blackout: false}, $pull: {presentTags: tagBlackout}});
    }

}

function addAnotherTag() {

    //Modify the database if the tag was not already present
    var classroomData = Classrooms.findOne({id: 1});
    var classId = classroomData._id;
    if(classroomData.presentTags.indexOf(tagAnother)===-1){
        Classrooms.update({_id: classId},{$push: {presentTags: tagAnother}});
    }

}

function removeAnotherTag(){

    //Modify the database if the tag was present
    var classroomData = Classrooms.findOne({id: 1});
    var classId = classroomData._id;
    if(classroomData.presentTags.indexOf(tagAnother)!=-1){
        Classrooms.update({_id: classId},{$pull: {presentTags: tagAnother}});
    }

}

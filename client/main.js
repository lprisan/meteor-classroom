//Note: The classroom data should be available under the Classrooms variable! (in classrooms.js)

var classroomData = undefined;
//var devicesHistoryCount = new Array();
var STEPS_PER_MAP = 12;
var game = undefined;
var pausedSprite = undefined;
var bugInitialState = {
    completedMaps: 0,
    stepsDone: 0,
    stepsToGo: 0,
    hintPresent: '',
    wrongMoves: 0
};
var devicesData = new Array();
var bugStates = new Array();//this will store each bug/device state
var bugGroups = new Array();//this will store the sprites for each bug/device line of the game
var bugTexts = new Array();//this will store each bug/device text


//Reactive code to react to changes in the classroom data
Deps.autorun(function() {
    console.log("entering autorun");
  classroomData = Classrooms.findOne({_id: "9AWkshbxHiE45Aci7"});

  if(classroomData){
        var status;

        //we black out the classroom if so set
        if(classroomData.global.paused){

            if(Template.camera.rendered || Template.nocamera.rendered){
                //document.body.style.background = 'black';  
                status = classroomData.name +  " has been stopped!\n";
            }

            if(game) pauseGame();

        } 
        else{
            if(Template.camera.rendered || Template.nocamera.rendered){
                //document.body.style.background = 'white';  
                status = classroomData.name +  " is transcurring normally.\n";
            }

            if(game) unpauseGame();

        } 

        if(classroomData.devices.length>0){
            for(i=0;i<classroomData.devices.length;i++){

                var device = Devices.findOne({_id: classroomData.devices[i]});

                if(device){
                    if(device.current.presentTags){
                        status += "Tags present in device "+classroomData.devices[i]+": "+device.current.presentTags.toString()+"\n";
                    }
                    devicesData[i] = JSON.parse(JSON.stringify(device));//We set the devices data variable, from which the state will be calculated
                }


                //Initial implementation: for now, we just count the number of entries in each device's history
                //devicesHistoryCount[i] = DeviceHistory.find({deviceid: classroomData.devices[i]}).count();

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


function pauseGame(){
    if(!game.paused){
        pausedSprite = game.add.sprite(game.world.centerX, game.world.centerY, 'pause');
        pausedSprite.anchor.setTo(0.5, 0.5);
        game.paused = true;
    }
}

function unpauseGame(){
    if(game.paused && pausedSprite){
        game.paused = false;
        pausedSprite.destroy();
        pausedSprite = undefined;
    }
}


// chilitags variables
var fpsText, start;

//old way of defining tags in paprika
//var tagBlackout = "tag_1";
//var tagAnother = "tag_2";

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


Template.visualization.rendered = function() {

    console.log("entering visualization rendered");

    if (!rendered) {
        //prevent to do the initialization twice
        rendered = true;
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    }


}




function preload () {
    
    game.stage.backgroundColor = '#FFFFFF';
    game.load.image('bug', 'ladybug_sq64.png');
    game.load.image('pause', 'pause.png');
    game.load.image('step','ballgreen32.png');
    game.load.image('togo','ballwhite32.png');
    game.load.image('map','map64.png');

}

//Some constants for the graphical representation, in pixels
var INITIAL_X = 50;
var INITIAL_Y = 100;
var Y_STEP = 110;
var MAP_STEP = 75;
var BALL_STEP = 32;
var BUG_STEP = 64;
var Y_OFFSET = Math.floor(BUG_STEP/2)+10;//For the display of the text on top of the bug and the balls

function create () {

    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'bug');
    //We create the groups for the team bugs
    if(classroomData){
        if(classroomData.devices.length>0){
            bugGroups = new Array(classroomData.devices.length);
            bugStates = new Array(classroomData.devices.length);
        }
        for(var i = 0; i<classroomData.devices.length; i++){
            bugGroups[i] = game.add.group();
            bugGroups[i].deviceid = classroomData.devices[i];//we add the device id, just in case we want to check the order is being maintained
            //console.log('within create(), initial state is '+bugInitialState+' and there are states: '+bugStates.length);
            bugStates[i] = JSON.parse(JSON.stringify(bugInitialState));//we clone the initial state data and add it to the array of states
            bugStates[i].deviceid = classroomData.devices[i];//we add the device id, just in case we want to check the order is being maintained
            var yval = INITIAL_Y + (i * Y_STEP);
            //console.log('calling drawing for '+bugGroups[i]+' and '+bugStates[i]);
            drawRowState(bugGroups[i], bugStates[i], yval, i);            
        }
    }//TODO: what if we have not received the classroom data yet??

}


function drawRowState(group, state, yval, index){

    if(bugTexts[index]) bugTexts[index].destroy();
    try{
        group.removeAll(true); //We cleanup all sprites in this group
    }catch(err){}//If there was an error, we do not care and continue

    var currentx = INITIAL_X; //to keep track of the drawing of everything in a row
    for(var i=0;i<state.completedMaps;i++){
        var newSprite = group.create(currentx,yval,'map');
        newSprite.anchor.setTo(0.5, 0.5);
        currentx = currentx + MAP_STEP;
    }

    for(var i=0;i<state.stepsDone;i++){
        var newSprite = group.create(currentx,yval,'step');
        newSprite.anchor.setTo(0.5, 0.5);
        currentx = currentx + BALL_STEP;
        //TODO: at the middle of the balls, draw the fraction of the path done
    }

    var bugSprite = group.create(currentx,yval,'bug');
    bugSprite.anchor.setTo(0.5, 0.5);
    //We draw the text on top of the bug, depending on the hints and wrong moves
    var bugText = '';
    if(state.hintPresent.length>0) bugText += '?';
    for(var i=0;i<state.wrongMoves;i++) bugText += '!';
    var style = { font: "30px Times New Roman", fill: "#000000", align: "center" };
    bugTexts[index] = game.add.text(currentx, yval-Y_OFFSET, bugText, style);
    bugTexts[index].anchor.setTo(0.5, 0.5);
    currentx = currentx + BUG_STEP;

    for(var i=0;i<state.stepsToGo;i++){
        var newSprite = group.create(currentx,yval,'togo');
        newSprite.anchor.setTo(0.5, 0.5);
        currentx = currentx + BALL_STEP;
        //TODO: at the middle of the balls, draw the fraction of the path to go
    }    

}



function update(){
    if(classroomData){
        for(var i = 0; i<classroomData.devices.length; i++){
            bugStates[i] = calculateCurrentState(i);
            var yval = INITIAL_Y + (i * Y_STEP);
            drawRowState(bugGroups[i], bugStates[i], yval); //TODO: probably, it would be more efficient to move sprites around instead of recreating them each time!   
        }
    }    //TODO: what if we have not received the classroom data yet??    
}

function calculateCurrentState(device){

    //Right now, the bug state is directly derived from the device state, this could get more complex if we have different activities, etc
    var completed = devicesData[device].current.activity.state.completedMaps;
    var done = devicesData[device].current.activity.state.stepsDone;
    var togo = devicesData[device].current.activity.state.stepsToGo;
    var hint = devicesData[device].current.activity.state.hintPresent;
    var wrong = devicesData[device].current.activity.state.wrongMoves;


    var currentstate = {
        completedMaps: completed,
        stepsDone: done,
        stepsToGo: togo,
        hintPresent: hint,
        wrongMoves: wrong
    };
    //console.log('current state: '+completedMaps+' completed, '+steps+' steps, '+togo+' to go.')
    return currentstate;
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

    Paprika.onUpdate(function(objects) {
        var end = new Date();
        var str = "Objects: ";
        
        for(var obj in objects) { str += obj + ", "; }
        
        fpsText.nodeValue = "Chilitags processing = " + 
                            (end.getTime() - start.getTime()) + 
                            "ms.\n" + str;
        start = end;
    });

    //New way of defining cards in paprika
    var card = {};
    card[3] = {size: 20, dx: 0, dy: 0};
    card[4] = {size: 20, dx: 0, dy: 0, back:true};
    Paprika.defineCards({card:card});


    //blackout tag
    //Paprika.onAppear(blackoutScreen, tagBlackout);
    //Paprika.onDisappear(normalScreen, tagBlackout);
    //other tag - only updates status
    //Paprika.onAppear(addAnotherTag, tagAnother);
    //Paprika.onDisappear(removeAnotherTag, tagAnother);
    //We make the pause toggle with the flip of the pause card
    Paprika.onFlip(togglePause, "card")
}

function togglePause(data) {

    console.log("objectName: " + data.objectName +
                        ", facing: " + data.facing + 
                        ", tilt: " + data.tilt + 
                        ", orientation: " + data.orientation);

    var classroomData = Classrooms.findOne({_id: "9AWkshbxHiE45Aci7"});
    var classId = classroomData._id;
    if(!classroomData.global.paused) blackoutScreen();
    else normalScreen();

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
            //console.log("updating device info for device "+deviceData.id);
            Devices.update({_id: devId},{$push: {"current.presentTags": "PauseTags"}});
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
            Devices.update({_id: devId},{$pull: {"current.presentTags": "PauseTags"}});
        }
    }


}

// not used anymore
// function addAnotherTag() {
//           //For now, we assume we are in device 1 always
//         var deviceData = Devices.findOne({_id: "LziCQ4oJQ7bpQv7sA"});
//         var devId = deviceData._id;
//         if(deviceData.current.presentTags){
//             Devices.update({_id: devId},{$push: {"current.presentTags": tagAnother}});
//         }
// }
// function removeAnotherTag(){
//          //For now, we assume we are in device 1 always
//         var deviceData = Devices.findOne({_id: "LziCQ4oJQ7bpQv7sA"});
//         var devId = deviceData._id;
//         if(deviceData.current.presentTags){
//             Devices.update({_id: devId},{$pull: {"current.presentTags": tagAnother}});
//         }
// }

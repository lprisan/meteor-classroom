Meteor.startup(function(){
   initPaprikaEvents();
});


// chilitags variables
var fpsText, start;
var tagBlackout = "tag_1";
var tagAnother = "tag_2";

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

    // restart game
    Paprika.onAppear(blackoutScreen, tagBlackout);
    Paprika.onDisappear(normalScreen, tagBlackout);
}

function blackoutScreen() {
    document.body.style.background = 'black';
}

function normalScreen(){
    document.body.style.background = 'white';    
}

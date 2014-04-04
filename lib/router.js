Router.configure({
	layoutTemplate: 'layout'
});

// Router.add({
//     '/camera': function() {
//             return 'camera';
//     }, '/nocamera': function() {
//             return 'nocamera';
//     }
// });
Router.map( function () {
  this.route('camera');
  this.route('nocamera');
});

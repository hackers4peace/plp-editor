$(function(){
  document.getElementById('profile_output').innerHTML = window.localStorage.getItem('profile');
  console.log(window.localStorage.getItem('profile'));
  remoteStorage.access.claim('shares', 'rw');
  remoteStorage.displayWidget();

  // Listen for changes
  //editor.on("change",  function() {
    //var data = editor.getValue();
    //remoteStorage.shares.storeFile('application/json-ld', 'me.json', JSON.stringify(data)).then(function(url) {
      //console.log(url);
    //});
  //});

//  $('#publish_btn').click(function() {
//    var request = require('superagent');
//    request
//  .post(window.plp.config.provider)
//   .send(window.localStorage.getItem('profile'))
//   .set('Content-Type', 'application/json')
//  .end(function(res){
//     if (res.ok) {
//       alert('yay got ' + JSON.stringify(res.body));
//     } else {
//       alert('Oh no! error ' + res.text);
//     }
//   });
// });

});

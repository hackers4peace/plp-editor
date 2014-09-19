$(function(){
  // remoteStorage
  remoteStorage.access.claim('shares', 'rw');
  remoteStorage.displayWidget();


  $('#publish_btn').click(function() {
  superagent.post(window.plp.config.provider)
   .send(localStorage.profile)
   .set('Content-Type', 'application/json')
    .end(function(provRes){
       if(provRes.ok) {
         console.log('yay got ' + JSON.stringify(provRes.body));
         superagent.post(window.plp.config.directory)
          .send(provRes.body)
          .set('Content-Type', 'application/json')
           .end(function(dirRes){
             console.log(dirRes.body);
           });
       } else {
         console.log('Oh no! error ' + res.text);
       }
     });
 });

});

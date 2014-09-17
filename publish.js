$(function(){
  remoteStorage.access.claim('shares', 'rw');
  remoteStorage.displayWidget();

  // Listen for changes
  //editor.on("change",  function() {
    //var data = editor.getValue();
    //remoteStorage.shares.storeFile('application/json-ld', 'me.json', JSON.stringify(data)).then(function(url) {
      //console.log(url);
    //});
  //});
});

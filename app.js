$(function(){

  // Set default options
  JSONEditor.defaults.options.theme = 'bootstrap3';
  JSONEditor.defaults.options.disable_collapse = true;
  JSONEditor.defaults.options.disable_edit_json = true;
  JSONEditor.defaults.options.disable_properties = true;
  JSONEditor.defaults.options.ajax = true;

  var editor;
  var profileType = 'Person';

  //Initialize the editor
  function initEditor(type,profile){

    profileType = type;

    $.getJSON(window.plp.config.prototypesDir+profileType+'.json', function(json){

      document.getElementById('editor_holder').innerHTML = "";
      editor = new JSONEditor(document.getElementById('editor_holder'),json);
      editor.on('change',function() {

        var errors = editor.validate();
        if(errors.length) {

          $('#validator').removeClass('ok');
          $('#validator').text('Not valid');
          $('#validator').addClass('error');
          $('#generate_btn').addClass('disabled');

        }else{

          $('#validator').removeClass('error');
          $('#validator').text('Valid');
          $('#validator').addClass('ok');
          $('#generate_btn').removeClass('disabled');

        }

      });

      editor.on('change',function() {
        if (profile){
          editor.setValue(profile);
        }
      });

    });

  }

  // TABS
  $(".profileSelector ").on('click',function() {
    var profileType = $(this).attr('profileType');
    initEditor(profileType);
    selectProfileType(profileType);
  });

  // STEP 1

  // new profile btn
  $('#toStep2Create').on('click',function() {

    initEditor(profileType);

    $('#step1').fadeOut();
    $('#banner_step1').slideUp();
    $('#step2').removeClass('hidden');
    $('#step2').fadeIn();

  });

  $('#toStep2Edit').on('click',function() {

    var url = $('#existing_profile_field').val();

    if (validateURL(url)){

      superagent.get(url)
        .accept('application/ld+json')
        .end(function(err,res){

            if (err){

              console.log('Error ' + err);

              $('#existing_profile_field').val('Something went wrong');
              $('#existing_profile_field').addClass('error');

            }else{

              if(res.ok) {

                console.log('Profile correctly downloaded from provider ' + res.text);

                var profile = JSON.parse(res.text);
                var type = profile["@type"];
                initEditor(type,profile);
                selectProfileType(type);

                $('#step1').fadeOut();
                $('#banner_step1').slideUp();
                $('#step2').removeClass('hidden');
                $('#step2').fadeIn();

              }

            }

         });

    }else{

      $('#toStep2Edit').addClass('disabled');

    }

  });

  $('#existing_profile_field').on('input',function() {

    var url = $('#existing_profile_field').val();

    if (validateURL(url)){

      $('#toStep2Edit').removeClass('disabled');

    }else{

      $('#toStep2Edit').addClass('disabled');

    }

  });

  // STEP 2

  $('#toStep3Generate').on('click',function() {

    // Validate
    var errors = editor.validate();
    if(!errors.length) {

      saveProfile();

      $('#step2').fadeOut();
      $('#step3').removeClass('hidden');
      $('#step3').fadeIn();

    }

  });

  $('#backToStep1').on('click',function() {

    $('#step2').fadeOut();
    $('#step1').fadeIn();
    $('#banner_step1').slideDown();

  });

  // STEP 3
  $('#backToStep2').on('click',function() {

    $('#step3').fadeOut();
    $('#step2').fadeIn();

  });

  /**
   * token - JWT authorization token
   */
  function publishToProvider(token){
    return new Promise(function(resolve, reject){
      superagent.post(window.plp.config.provider.url)
        .withCredentials()
        .type('application/ld+json')
        .accept('application/ld+json')
        .set('Authorization', 'Bearer ' + token)
        .send(localStorage.profile)
        .end(function(err,provRes){
          if (err){
            $('#result-uri').html('<p class="error">Something went wrong: '+err+'</p>');
            console.log('Error ' + err);
            reject(err);
          }else{
            if(provRes.ok) {
              console.log('Profile successfully pushed to provider ' + provRes.text);
              // FIXME: handle errors
              var profile = JSON.parse(provRes.text);
              $('#result-uri').html('<h1>Your profile lives here:</h1><h3>'+profile['@id']+'</h3><p>You can use this URI for listing it in the different <a href="https://github.com/hackers4peace/plp-docs">directories supporting PLP</a></p>');
              resolve(profile);
            }
          }
        });
    });
  }

  function listInDirectory(profile){
    if(window.plp.config.directory) {
      return new Promise(function(resolve, reject){
        superagent.post(window.plp.config.directory.url)
        .type('application/ld+json')
        .accept('application/ld+json')
        .send(JSON.stringify(profile))
        .end(function(err,dirRes){
          if (err){
            console.log('Error ' + err);
            reject(err);
          }
          if (dirRes.ok){
            console.log('Profile succesfully listed in directory ' + dirRes.text);
            resolve();
          }
        });
      });
    }
  }

  $('#step3Option1Btn').on('click',function() {
    window.login.provider()
    .then(publishToProvider)
    .then(listInDirectory)
    .catch(function(err){ console.log(err); });
  });

  $('#step3Option2Btn').on('click',function() {
    downloadLocallyStoredProfile();
  });

  // UTILITY FUNCTIONS
  function showProfilePublishedError(){
    $('#result-uri').html('<p class="error">Something went wrong: '+err+'</p>');
  }

  function showProfilePublishedOk(profileUri){
    $('#result-uri').html('<h1>Your profile lives here:</h1><h3>'+profileUri+'</h3><p>You can use this URI for listing it in the different <a href="https://github.com/hackers4peace/plp-docs">directories supporting PLP</a></p>');
  }

  function downloadLocallyStoredProfile(){
    var profile = localStorage.profile;
    var filename = "urn:uuid"+uuid.v4();
    var blob = new Blob([profile], {type: "application/ld+json;charset=utf-8"});
    saveAs(blob, filename+".json");
  }

  function profileHasId(profile){
    return _.has(profile,"@id");
  }

  function postProfileToDirectory(profile){

    if (window.plp.config.directory){

      superagent.post(window.plp.config.directory)
        .type('application/ld+json')
        .accept('application/ld+json')
        .send(JSON.stringify(profile))
        .end(function(err,dirRes){

          if (err){
            console.log('Error ' + err);
          }else{
            if (dirRes.status == 409){
              console.log('Profile was already listed in directory ' + dirRes.text);
            }else if (dirRes.ok){
              console.log('Profile succesfully listed in directory ' + dirRes.text);
            }
            showProfilePublishedOk(profile["@id"]);
          }

      });

    }

  }

  function selectProfileType(profile){

    $(".profileSelector").removeClass('active');


    $("#tab"+profile).addClass('active');

  }

  function profileWithoutId(profile){
    return delete profile['@id'];
  }

  function saveProfile(){

    var editorValue = editor.getValue();
    editorValue["@context"] = window.plp.config.context;
    editorValue["describedBy"] = {
      "plp:prototype": {
        "git:tag": window.plp.config.prototypesTag
      }
    }

    var profile = JSON.stringify(editorValue);
    window.localStorage.setItem('profile', profile);
    console.log("Profile stored in localStorage " + profile);

  }

  function enableRemoteStorage(){

    remoteStorage.access.claim('shares', 'rw');
    remoteStorage.displayWidget();

  }

  function validateURL(value) {

    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);

  }

  var agent = {};

  /**
   * resolves with JWT token
   */
  function login(endpoint, assertion){
    return new Promise(function(resolve, reject){
      superagent.post(endpoint)
      .withCredentials() // FIXME needed?
      .send({ assertion: assertion })
      .end(function(response){
        if(response.status === 200){
          var data = response.body;
          console.log('Persona.onlogin() ' + endpoint, data);
          agent.persona = data;
          resolve(data.token);
        } else {
          console.log('error', response.error);
          reject();
          // FIXME handle case of 403 etc.
        }
      });
    });
  }

  function logout(endpoint){
    // FIXME decide if needs to sent assertion!
    superagent.post(endpoint)
    .withCredentials()
    .end(function(response){
      console.log('Persona.onlogout() ' + endpoint, response);
      agent = {};
    });
  }

  window.login = {};
  window.login.provider = function(){
    return new Promise(function(resolve, reject){
      navigator.id.get(function(assertion){
        login(window.plp.config.provider.url + '/auth/login', assertion)
        .then(resolve, reject);
      }, window.plp.config.provider.persona);
    });
  };
});

$(function(){

  // Hide steps 2 and 3
  $('#step2').hide();
  $('#step3').hide();

  // Set default options
  JSONEditor.defaults.options.theme = 'bootstrap3';

  //Initialize the editor
  var editor = new JSONEditor(document.getElementById("editor_holder"),{

    schema: {
      title: "Person",
      type: "object",
      properties: {
        name: { "type": "string" },
        additionalname: { "type": "string"},
        description: { "type": "string" },
         birthDate:  { "type": "string"},
          nationality : { "type" : "string"},
        address: {
          type: "object",
          properties: {
            street: { "type": "string"},
            code: { "type": "string"},
            city: { "type" : "string"},
            country: { "type" : "string"}
          }
        },
        telephone: { "type" : "string"},
        faxNumber: { "type" : "string"},
        website:  { "type" : "string"},
        image: { "type": "string" },
        workLocation: {
          title: "company",
          type: "object",
          properties: {
                company: { "type" : "string"},
                jobtitle: { "type" : "string"},
                street: { "type" : "string"},
                code: { "type" : "string"},
                city:  { "type" : "string"}
              }
        },
        contactPoint: {
          type: "array",
          uniqueItems: true,
          items: {
            type: "object",
            title: "ContactPoint",
            properties: {
              id: {
                title: "URL",
                type: "string"
              }
            }
          },
          default: [
            { id: "mailto:" }
          ]
        },

        member: {
          type: "array",
          uniqueItems: true,
          items: {
            type: "object",
            title: "Membership",
            properties: {
              id: {
                title: "website",
                type: "string"
              },
              name: { title: "name", type: "string" }
            }
          }
        },
        interest: {
          type: "array",
          uniqueItems: true,
          items: {
            type: "object",
            title: "Interest",
            properties: {
              name: {
                title: "name",
                type: "string",
                enum: [
                  "zzz",
                  "bbb",
                  "kkk"
                ]
              }
            }
          }
        }
      }
    }
  });

  // Set the value
  //editor.setValue({
    //name: "John Smith"
  //});

  // BUTTONRY

  $('#create_btn').click(function() {
    $('#step1').fadeOut();
    $('#banner_step1').slideUp();
    $('#step2').fadeIn();
  });

  $('#generate_btn').click(function() {

    // Validate
    var errors = editor.validate();
    if(errors.length) {

      // Not valid

    }else{

      saveProfile();
      $('#step2').fadeOut();
      $('#step3').fadeIn();

    }

  });

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

  // UTIL FUNCTIONS

  function saveProfile(){

    // Print data in console
    var data = editor.getValue();
    console.log(data);

    // Store locally
    window.localStorage.setItem('profile',JSON.stringify(editor.getValue()));

  }

  function enableRemoteStorage(){

    remoteStorage.access.claim('shares', 'rw');
    remoteStorage.displayWidget();

  }

});

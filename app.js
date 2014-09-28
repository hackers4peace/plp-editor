$(function(){

  // Hide steps 2 and 3
  $('#step2').hide();
  $('#step3').hide();

  // Set default options
  JSONEditor.defaults.options.theme = 'bootstrap3';
  JSONEditor.defaults.options.disable_collapse = true;
  JSONEditor.defaults.options.disable_edit_json = true;
  JSONEditor.defaults.options.disable_properties = true;

  //Initialize the editor
  var editor = new JSONEditor(document.getElementById("editor_holder"),{

    schema: {
      title: "Person",
      type: "object",
      properties: {
        name: { "type": "string" , "title": "Name"},
        additionalname: { "type": "string" , "title": "Additional Name"},
        description: { "type": "string", "title": "About yourself"},
        birthDate:  { "type": "string" , "title": "Birth date"},
        nationality : { "type" : "string", "title": "Nationality"},
        telephone: { "type" : "string" , "title": "Phone number"},
        faxNumber: { "type" : "string", "title": "Fax number"},
        website:  { "type" : "string", "title": "Homepagge"},
        image: { "type": "string" , "title": "Image URL"},
        address: {
          type: "array",
          uniqueItems: true,
          title: "Locations",
          items: {
            type: "object",
            title: "Location",
              properties: {
              street: { "type": "string", "title": "Street"},
              code: { "type": "string", "title": "Zip code"},
              city: { "type" : "string", "title": "City"},
              country: { "type" : "string", "title": "Country"}
            }
          }
        },
        member: {
          type: "array",
          uniqueItems: true,
          title: "Your companies, groups or organisations",
          items: {
            type: "object",
            properties: {
                company: { "type" : "string", "title": "Organiastion name"},
                jobtitle: { "type" : "string", "title": "Position"},
                street: { "type" : "string", "title": "Street"},
                code: { "type" : "string", "title": "Zip code"},
                city:  { "type" : "string", "title": "City"},
                country: { "type" : "string", "title": "Country"}
              }
          }
        },
        contactPoint: {
          type: "array",
          uniqueItems: true,
          title: "Contact information (email, social networks, etc)",
          items: {
            type: "object",
            title: "Contact",
            properties: {
              type: {
                title: "Type",
                type: "string",
                enum: [
                  "Email",
                  "Facebook",
                  "Twitter",
                  "Github",
                  "LinkedIn",
                  "Website"
                ]
              },
              id: {
                title: "URL",
                type: "string"
              }
            }
          }
        },
        // member: {
        //   type: "array",
        //   uniqueItems: true,
        //   items: {
        //     type: "object",
        //     title: "Membership",
        //     properties: {
        //       id: {
        //         title: "website",
        //         type: "string"
        //       },
        //       name: { title: "name", type: "string" }
        //     }
        //   }
        // },
        interest: {
          type: "array",
          uniqueItems: true,
          title: "Areas of interest",
          items: {
            type: "object",
            title: "Interest",
            properties: {
              name: {
                title: "name",
                type: "string"
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

  editor.on('change',function() {

    var errors = editor.validate();
    if(errors.length) {

      $('#generate_btn').addClass('disabled');

    }else{

      $('#generate_btn').removeClass('disabled');

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

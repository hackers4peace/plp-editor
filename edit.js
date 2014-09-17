$(function(){
  // Set default options
  JSONEditor.defaults.options.theme = 'bootstrap3';

  //Initialize the editor
  var editor = new JSONEditor(document.getElementById("editor_holder"),{
    schema: {
      title: "Person",
      type: "object",
      properties: {
        name: { "type": "string" },
        description: { "type": "string" },
        image: { "type": "string" },
        country: { "type": "string" },
        city: { "type": "string" },
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

  // Get the value
  var data = editor.getValue();
  console.log(data.name); // "John Smith"

  // Validate
  var errors = editor.validate();
  if(errors.length) {
    // Not valid
  }
});


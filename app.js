$(function(){

	// EDITOR

	// Set default options
	JSONEditor.defaults.options.theme = 'bootstrap3';
	JSONEditor.defaults.options.disable_collapse = true;
	JSONEditor.defaults.options.disable_edit_json = true;
	JSONEditor.defaults.options.disable_properties = true;


	var editor;

	//Initialize the editor
	function initEditor(){

		  editor = new JSONEditor(document.getElementById('editor_holder'),{

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

	}

	// Set the value
	//editor.setValue({
		//name: "John Smith"
	//});

	// STEP 1

	// new profile btn
	$('#toStep2Create').on('click',function() {

		initEditor();

		$('#step1').fadeOut();
		$('#banner_step1').slideUp();
		$('#step2').removeClass('hidden');
		$('#step2').fadeIn();

	});

	$('#toStep2Edit').on('click',function() {

		var url = $('#existing_profile_field').val();

		if (validateURL(url)){

			superagent.get(url)
				.end(function(err,res){

						if (err){

							console.log('Error ' + err);

							$('#existing_profile_field').val('Something went wrong');
							$('#existing_profile_field').addClass('error');

						}else{

							if(res.ok) {

								console.log('Profile correctly downloaded from provider ' + res.body);

								initEditor();
								editor.setValue(JSON.parse(res.body));

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

	$('#step3Option1Btn').on('click',function() {

		superagent.post(window.plp.config.provider)
		.send(localStorage.profile)
		.set('Content-Type', 'application/json')
			.end(function(err,provRes){

				if (err){

					console.log('Error ' + err);

				}else{

					if(provRes.ok) {

						console.log('Profile successfully pushed to provider ' + JSON.stringify(provRes.body));

						$('#banner_step3').html('<h1>Your profile lives here:</h1><h3>'+provRes.body['@id']+'</h3><p>You can use this URI for listing it in the different <a href="https://github.com/hackers4peace/plp-docs">directories supporting PLP</a></p>');

						if (window.plp.config.directory){

							superagent.post(window.plp.config.directory)
								.send(provRes.body)
								.set('Content-Type', 'application/json')
								.end(function(err,dirRes){

									if (err){

										console.log('Error ' + err);

									}

									if (dirRes.ok){

										console.log('Profile succesfully listed in directory ' + JSON.stringify(dirRes.body));

									}

							});

						}

					}

				}

			});

	});

	$('#step3Option1Btn').on('click',function() {

		// What to do here

	});

	// UTILITY FUNCTIONS

	function profileWithoutId(profile){
		return delete profile['@id'];
	}

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

	function validateURL(value) {

		return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);

	}

});

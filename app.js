$(function(){

	// Set default options
	JSONEditor.defaults.options.theme = 'bootstrap3';
	JSONEditor.defaults.options.disable_collapse = true;
	JSONEditor.defaults.options.disable_edit_json = true;
	JSONEditor.defaults.options.disable_properties = true;

	var editor;
	var profileType = 'Person';

	//Initialize the editor
	function initEditor(type,profile){

		profileType = type;

		$.getJSON('schemas/'+profileType+'.json', function(json){

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

				if (profile){
					editor.setValue(profile);
				}

			});

		});

	}

	// TABS
	$("#tabPerson").on('click',function() {
		initEditor('Person');
		selectProfileType("Person");
	});

	$("#tabOrganization").on('click',function() {
		initEditor('Organization');
		selectProfileType("Organization");
	});

	$("#tabPlace").on('click',function() {
		initEditor('Place');
		selectProfileType("Place");
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


								// TODO test parse profileType (modify provider to store also @type)
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

	$('#step3Option1Btn').on('click',function() {

		superagent.post(window.plp.config.provider)
      .type('application/ld+json')
      .accept('application/ld+json')
      .send(localStorage.profile)
			.end(function(err,provRes){

				if (err){

					$('#result-uri').html('<p class="error">Something went wrong: '+err+'</p>');
					console.log('Error ' + err);

				}else{

					if(provRes.ok) {

						console.log('Profile successfully pushed to provider ' + provRes.text);
            // FIXME: handle errors
            var profile = JSON.parse(provRes.text);

						$('#result-uri').html('<h1>Your profile lives here:</h1><h3>'+profile['@id']+'</h3><p>You can use this URI for listing it in the different <a href="https://github.com/hackers4peace/plp-docs">directories supporting PLP</a></p>');

						if (window.plp.config.directory){

							superagent.post(window.plp.config.directory)
								.type('application/ld+json')
								.accept('application/ld+json')
								.send(JSON.stringify(profile))
								.end(function(err,dirRes){

									if (err){

										console.log('Error ' + err);

									}

									if (dirRes.ok){

										console.log('Profile succesfully listed in directory ' + dirRes.text);

									}

							});

						}

					}

				}

			});

	});

	$('#step3Option2Btn').on('click',function() {

		var profile = localStorage.profile;
		var filename = "urn:uuid"+uuid.v4();
		var blob = new Blob([profile], {type: "application/ld+json;charset=utf-8"});
		saveAs(blob, filename+".json");

	});

	// UTILITY FUNCTIONS

	function selectProfileType(profile){

		$("#tabPerson").removeClass('active');
		$("#tabOrganization").removeClass('active');
		$("#tabPlace").removeClass('active');

		$("#tab"+profile).addClass('active');

	}

	function profileWithoutId(profile){
		return delete profile['@id'];
	}

	function saveProfile(){

		var data = editor.getValue();
		data["@context"] = window.plp.config.context;
		data["@type"] = profileType;

		console.log(data);

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

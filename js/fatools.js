(function() {

	const utils = {
		get_querystring() {

		      // Capture query string and initialize new object
		      var query = window.location.search;
		      var obj = {};

		      // If no query string, return empty object
		      if (query === '') return obj;

		      query = decodeURI(query);

		      // Remove the '?' at front of query string
		      query = query.slice(1);

		      // Split the query string into key/value pairs (ampersand-separated)
		      query = query.split('&');

		      // Loop through each key/value pair
		      query.forEach((d, i) =>  {
		        var key;
		        var value;
		        var pair; 

		        // Split each key/value pair into their separate parts
		        pair = d.split('=');
		        key = pair[0];
		        value = pair[1];

		        // If the key doesn't exist yet, set it
		        if (!obj[key]) {
		          obj[key] = value;
		        } else {

		          // If it does already exist...

		          // If it's not an array, make it an array
		          if (!Array.isArray(obj[key])) {
		            obj[key] = [obj[key]];
		          }

		          // Push the new value to the key's array
		          obj[key].push(value);
		        }
		      });

		      // Return the query string object
		      return obj;

		},

	    get_inputs_by_type(group_id, input_type) {

	    	// assign group node to a variable
	    	let group = document.getElementById(group_id);

	    	// collect all inputs and assign them to an array
	    	let inputs = Array.from(
	    		document.querySelectorAll("#" + group_id + " input[type=\'" + input_type, "\']")
	    	);

	    	// collect all fields and assign them to an array
	    	let fields = Array.from(
	    		group.getElementsByClassName("oneField")
	    	);

	    	// create the input group object that we'll return
	    	obj = {
	    		group : group,
	    		fields : fields,
	    		inputs : inputs, 
	    	};

	    	// return the input group object
	    	return obj;

	    },

	    str_replace_all(string, pattern, replacement) {

	    	// define the regular expression that will match all instances of the pattern
	    	let re = new RegExp(pattern, "g");

	    	// replace all instances of the pattern in the string with the replacement
	    	let new_text = string.replace(re, replacement);

	    	// return the updated text
	    	return new_text;

	    },

	    array_sum(x) {
	    	// declare the sum of the array
	    	let res = x.reduce((a, b) => a + b, 0);

	    	// return the sum of the array
	    	return res;

	    },

	    iso_date(x) {

	    	// slice the date object after converting it to an isostring
	    	let res = x.toISOString().slice(0, 10);

	    	// return the string
	    	return res;
	    },
	};

	const helpers = {

	    replace_keys(node, keys, values) {

	    	// replace an array of keys with an array of values
			keys.map((d, i) => {

		    	// get html text from the node
		    	let old_text = node.innerHTML;
		    	
		    	// wrap key in handlebars
				let placeholder = "{{" + d + "}}";
				
				// replace all instances of the key with the value
				let new_text = utils.str_replace_all(old_text, placeholder, values[i]);

				// update the text in the node
				node.innerHTML = new_text;

			});

		},

		show_hide(field_group, switch_array) {

			// get the number of checked values in the switch array
			let n = utils.array_sum(switch_array);

			// if more than one is checked, reveal some inputs in the target group
			if(n > 1) {

				// show the target radio field group
				field_group.group.classList.remove("offstate"); 
				// show radio fields if their index corresponds to a true value in the switch array
				field_group.fields.map((d, i, r) => {
					// if the corresponding switch is false, uncheck the radio input and hide it
					if(!switch_array[i]) {
						field_group.inputs[i].checked = false;
						d.classList.add("offstate");

					// otherwise, show the radio input
					} else {
						d.classList.remove("offstate");
					};
				});

			// if the source group has 1 or fewer checked boxes, hide the whole target field group
			} else {
				field_group.group.classList.add("offstate");
			};

		},

		update_switch_array(inputs) {

			// get indices of all checked inputs
			let switch_array = inputs.map((d, i) => {return d.checked});

			// return checked indices as a boolean array
			return switch_array;

		},

		unselect_all_but_one(radio_inputs, selected) {

			// map over inputs, unchecking if they are not equal to selected
			radio_inputs.map((d, i) => {
				if(i != selected) {d.checked = false};
			});

		}, 

		get_expiry_date(months_from_now = 2) {

			// initialize new date object
			let expiry_date = new Date();

			let month_now = expiry_date.getMonth();

			expiry_date.setMonth(month_now + months_from_now);

			let res = utils.iso_date(expiry_date);

			return res;

		},

		compose_campaign_request_body(
			contact, 
			price = 1500, 
			brand_codes = ['itunesus', 'amazonus'], 
			gift_id,
			gift_template = "SCQEQHJLTTZD") {

			let body = {
				"gift_template": gift_template,
			    "contacts": [contact],
			    "price_in_cents": price,
			    "brand_codes": brand_codes,
			    "expiry": this.get_expiry_date(),
			    "id": gift_id
			}

			return body;

		},
	};

	const fatools = {

		make_radio_group_exclusive(radio_group) {
			// add a click event listener to each input that unselects
			// all inputs but the clicked one
			radio_group.inputs.map((d, i, r) => {
				d.onclick = () => {
					helpers.unselect_all_but_one(r, i);
				};
			});

		}, 

		carry_forward(source_id, target_id) {

			// initialize the switch array
			let switch_array = []; 
			// collect source input group
			let source = utils.get_inputs_by_type(source_id, 'checkbox');
			// collect target input group
			let target = utils.get_inputs_by_type(target_id, 'radio');

			// hide target input group
			target.group.classList.add("offstate");
			// hide each individual target input field
			target.fields.map((d, i) => {d.classList.add("offstate")});

			// make the target radio group exclusive (single select)
			this.make_radio_group_exclusive(target)

			// add a click event listener to each source input that 
			// shows the appropriate fields in the target input group
			source.inputs.map((d, i, r) => {

				d.onclick = () =>  {
					switch_array = helpers.update_switch_array(r);
					helpers.show_hide(target, switch_array);
				}

			})

		},

		pipe_querystring_text() {

			let html_content_nodes = Array.from(document.querySelectorAll(".htmlContent, legend, label"));
			let querystring = utils.get_querystring(); 
			let keys = Object.keys(querystring);
			let vals = Object.values(querystring);

			html_content_nodes.map((d, i) => {
				helpers.replace_keys(d, keys, vals);
			});

		},

		create_giftbit_campaign() {

			// collect contact information 
			let contact = ""
			// get response id or enrollment + survey id
			let gift_id = ""

		},
	};

	// Make sure we're in a browser
    if (window) {

        // Make sure we're not overwriting the fatools key
        if (!window.fatools) {
            window.fatools = fatools;
        } else {
            throw new Error('Error bootstrapping fatools: window.fatools already set.');
        }
        
    };

})();
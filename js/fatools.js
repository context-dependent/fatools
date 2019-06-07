(function() {

	const fatools = {
		utils : {
			get_querystring : function () {

		      // Capture query string and initialize new object
		      var query = window.location.search;
		      var obj = {};

		      // If no query string, return empty object
		      if (query === '') return obj;

		      // Remove the '?' at front of query string
		      query = query.slice(1);

		      // Split the query string into key/value pairs (ampersand-separated)
		      query = query.split('&');

		      // Loop through each key/value pair
		      query.map(function (part) {
		        var key;
		        var value;

		        // Split each key/value pair into their separate parts
		        part = part.split('=');
		        key = part[0];
		        value = part[1];

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
		    get_inputs_by_type : function(group_id, input_type) {
		    	let group = document.getElementById(group_id);

		    	let inputs = Array.from(
		    		document.querySelectorAll("#" + group_id + " input[type=\'" + input_type, "\']")
		    	);

		    	let fields = Array.from(
		    			group.getElementsByClassName("oneField")
		    	);

		    	obj = {
		    		group : group,
		    		fields : fields,
		    		inputs : inputs, 
		    	};

		    	return obj;
		    },
		    str_replace_all : function(string, pattern, replacement) {
		    	let re = new RegExp(pattern, "g");
		    	let new_text = string.replace(re, replacement);
		    	return new_text;
		    },

		    replace_keys : function(node, keys, values) {

		    	const utils = this;
				
				function replace_key(key, value) {
					let old_text = node.innerText;
					let placeholder = "{{" + key + "}}";
					let new_text = utils.str_replace_all(old_text, placeholder, value);


					node.innerText = new_text;
				};

				keys.map((d, i) => {
					replace_key(d, values[i]);
				});
			},
		    get_this : function() {
		    	console.log(this);
		    },
		},

		helpers : {
			show_hide : function(field_group, switch_array) {
				let n = switch_array.reduce((a, b) => a + b, 0);

				if(n > 1) {

					field_group.group.classList.remove("offstate"); 

					field_group.fields.map((d, i, r) => {
						if(!switch_array[i]) {
							field_group.inputs[i].checked = false;
							d.classList.add("offstate");
						} else {
							d.classList.remove("offstate");
						};
					});

				} else {
					field_group.group.classList.add("offstate");
				};

			},

			update_switch_array : function(inputs) {
				let switch_array = inputs.map((d, i) => {return d.checked});

				return switch_array;
			},

			
		},

		make_radio_group_exclusive : function(radio_group) {

			function unselect_all_but_one(radio_inputs, selected) {
				radio_inputs.map((d, i) => {
					if(i != selected) {d.checked = false};
				});
			} 

			radio_group.inputs.map((d, i, r) => {
				d.onclick = () => {
					unselect_all_but_one(r, i);
				};
			});
		}, 

		carry_forward : function(source_id, target_id) {

			let switch_array = []; 
			let source = this.utils.get_inputs_by_type(source_id, 'checkbox');
			let target = this.utils.get_inputs_by_type(target_id, 'radio');

			target.group.classList.add("offstate");
			target.fields.map((d, i) => {d.classList.add("offstate")});

			this.make_radio_group_exclusive(target)

			source.inputs.map((d, i, r) => {

				d.onclick = () =>  {
					switch_array = this.helpers.update_switch_array(r);
					this.helpers.show_hide(target, switch_array);
				}

			})

		},

		pipe_text : function() {

			let html_content_nodes = Array.from(document.getElementsByClassName("htmlContent"));
			let querystring = this.utils.get_querystring(); 
			let keys = Object.keys(querystring);
			let vals = Object.values(querystring);

			html_content_nodes.map((d, i) => {
				this.utils.replace_keys(d, keys, vals);
			});


		},
	};

	return fatools; 

})();
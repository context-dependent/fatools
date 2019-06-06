// Force a group of radio button questions to act like a single-answer multiple-choice question
function make_radio_group_exclusive(radio_group_id) {

	// Select all of the "input" html nodes within the question group radio_group_id
	let target_radio_nodes = document
		.getElementById(radio_group_id)
		.getElementsByTagName("input");

	// Convert the htmlcollection returned by getElements* into an array
	// so that we can leverage the powerful .map method
	let target_radio_array = Array.from(target_radio_nodes);

	// Define the function that produces the outcome we want to happen 
	// each time a radio button is clicked 
	function unselect_all_radios_but_one(arradios, selected) {
		arradios.map((d, i) => {
			if(i != selected) {d.checked = false};
		});
	}

	// Define a function that adds an event listener to each radio button that triggers 
	// unselect_all_radios_but_one whenever they are clicked
	function add_click_event_listener(arradios) {
		arradios.map((d, i, r) => {
			d.onclick = () => {
				unselect_all_radios_but_one(r, i);
			}
		});
	}

	// Execute the function above on the array of radio buttons
	add_click_event_listener(target_radio_array);

}

function make_radio_group_exclusive_v2(radio_inputs) {

	// Define the function that produces the outcome we want to happen 
	// each time a radio button is clicked 
	function unselect_all_radios_but_one(arradios, selected) {
		arradios.map((d, i) => {
			if(i != selected) {d.checked = false};
		});
	}

	// Define a function that adds an event listener to each radio button that triggers 
	// unselect_all_radios_but_one whenever they are clicked
	function add_click_event_listener(arradios) {
		arradios.map((d, i, r) => {
			d.onclick = () => {
				unselect_all_radios_but_one(r, i);
			}
		});
	}

	// Execute the function above on the array of radio buttons
	add_click_event_listener(radio_inputs);

}


function update_switch_array(checkbox_array) {

	let switch_array = checkbox_array.map((d, i) => {return d.checked});

	console.log(switch_array);

	return switch_array;
};

function show_hide_radios(radio_group_id, radio_field_array, switch_array) {

	let n_selected = switch_array.reduce((a, b) => a + b, 0);
	let radio_group = document.getElementById(radio_group_id);

	if(n_selected > 1) {

		radio_group.classList.remove("offstate");

		radio_field_array.map((d, i, r) => {
			if(!switch_array[i]) {
				d.checked = false;
				d.classList.add("offstate");
			} else {
				d.classList.remove("offstate");
			}
		}); 

	} else {
		radio_group.classList.add("offstate");
	}
};

function get_radio_field_array(radio_group_id) {

	let radio_field_nodes = document
		.getElementById(radio_group_id)
		.getElementsByClassName("oneField");

	let radio_field_array = Array.from(radio_field_nodes);

	return radio_field_array;

};

function get_checkbox_input_array(checkbox_group_id) {

	let target_check_nodes = document
		.querySelectorAll("#" + checkbox_group_id + " input[type='checkbox']");

	let target_check_array = Array.from(target_check_nodes);

	return target_check_array;


};


function carry_forward(source_id, target_id) {

	let switch_array = [];
	let checkbox_input_array = get_checkbox_input_array(source_id);
	let radio_field_array = get_radio_field_array(target_id);
	let radio_group = document.getElementById(target_id);
	let radio_inputs = Array.from(radio_group.getElementsByTagName("input"));

	radio_group.classList.add("offstate");

	radio_field_array.map((d, i) => {
		d.classList.add("offstate");
	});

	make_radio_group_exclusive_v2(radio_inputs);

	function add_click_event_listener(checkbox_input_array, radio_field_array) {
		checkbox_input_array.map((d, i, r) => {

			d.onclick = () => {
				switch_array = update_switch_array(r);
				show_hide_radios(target_id, radio_field_array, switch_array);
			};

		});
	};

	add_click_event_listener(checkbox_input_array, radio_field_array);


};
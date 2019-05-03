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

		arradios.map((d, i) => {
			d.onclick = () => {
				unselect_all_radios_but_one(arradios, i);
			}
		});
	}

	// Execute the function above on the array of radio buttons
	add_click_event_listener(target_radio_array);

}
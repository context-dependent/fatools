function make_radio_group_exclusive(radio_group_id) {

	let target_radio_nodes = document
		.getElementById(radio_group_id)
		.getElementsByTagName("input");

	let target_radio_array = Array.from(target_radio_nodes);

	function unselect_all_radios_but_one(arradios, selected) {
		arradios.map((d, i) => {
			if(i != selected) {d.checked = false};
		});
	}

	function add_click_event_listener(arradios) {
		arradios.map((d, i) => {
			d.onclick = function() {
				unselect_all_radios_but_one(arradios, i);
			}
		});
	}

	add_click_event_listener(target_radio_array);

}
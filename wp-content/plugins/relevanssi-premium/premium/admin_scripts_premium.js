jQuery(document).ready(function($) {
	var show_post_controls = $("#show_post_controls");
	$("#relevanssi_hide_post_controls").change(function() {
		show_post_controls.toggleClass('screen-reader-text');
	});

    $("#build_index").click(function() {
        $("#relevanssi-progress").show();
		$("#results").show();
		$("#relevanssi-timer").show();
		$("#relevanssi-indexing-instructions").show();
		$("#stateoftheindex").html(relevanssi.reload_state);
		$("#indexing_button_instructions").hide();
		var results = document.getElementById("results");
		results.value = "";

		var data = {
			'action': 'relevanssi_truncate_index',
		};

		intervalID = window.setInterval(relevanssiUpdateClock, 1000);

		console.log("Truncating index.");
		results.value += relevanssi.truncating_index + " ";
		jQuery.post(ajaxurl, data, function(response) {
			truncate_response = JSON.parse(response);
			console.log("Truncate index: " + truncate_response);
			if (truncate_response == true) {
				results.value += relevanssi.done + "\n";
			}

			var data = {
				'action': 'relevanssi_count_users',
			}
			console.log("Counting users.");
			results.value += relevanssi.counting_users + " ";
			jQuery.post(ajaxurl, data, function(response) {
				count_response = JSON.parse(response);
				console.log("Counted " + count_response + " users.");
				if (count_response < 0) {
					results.value += relevanssi.user_disabled + "\n";
				}
				else {
					results.value += count_response + " " + relevanssi.users_found + "\n";
				}

				var user_total = count_response;

				var data = {
					'action': 'relevanssi_count_taxonomies',
				};
				console.log("Counting taxonomies.");
				results.value += relevanssi.counting_terms + " ";
				jQuery.post(ajaxurl, data, function(response) {
					count_response = JSON.parse(response);
					console.log("Counted " + count_response + " taxonomy terms.");
					if (count_response < 0) {
						results.value += relevanssi.taxonomy_disabled + "\n";
					}
					else {
						results.value += count_response + " " + relevanssi.terms_found + "\n";
					}
					
					var taxonomy_total = count_response;

					var data = {
						'action': 'relevanssi_count_posts',
					};
					console.log("Counting posts.");
					results.value += relevanssi.counting_posts + " ";
					jQuery.post(ajaxurl, data, function(response) {
						count_response = JSON.parse(response);
						console.log("Counted " + count_response + " posts.");
						var post_total = parseInt(count_response);
						results.value += count_response + " " + relevanssi.posts_found + "\n";

						var data = {
							'action': 'relevanssi_list_taxonomies',
						};
						console.log("Listing taxonomies.");
						jQuery.post(ajaxurl, data, function(response) {
							taxonomies_response = JSON.parse(response);
							console.log("Listing taxonomies: " + taxonomies_response);
							console.log("Starting indexing.");
							console.log("User total " + user_total);
							if (user_total > 0) {
								console.log("Indexing users.");
								var args = {
									'total' : user_total,
									'completed' : 0,
									'total_seconds' : 0,
									'post_total' : post_total,
									'limit' : 10,
									'taxonomies' : taxonomies_response,
									'taxonomies_total' : taxonomy_total,
								}
								process_user_step(args);
							}
							else if (taxonomy_total > 0) {
								console.log("Indexing taxonomies.");
								results.value += relevanssi.indexing_taxonomies + " ";
								results.value += taxonomies_response + "\n";
								var args = {
									'taxonomies' : taxonomies_response,
									'completed' : 0,
									'total' : taxonomy_total,
									'total_seconds' : 0,
									'post_total' : post_total,
									'current_taxonomy' : '',
									'offset' : 0,
									'limit' : 20,
								};
								process_taxonomy_step(args);
							}
							else {
								console.log("Just indexing.");
								var args = {
									'completed' : 0,
									'total' : post_total,
									'offset' : 0,
									'total_seconds' : 0,
									'limit' : 10,
									'extend' : false,
									'security' : nonce.indexing_nonce,
								};
								process_indexing_step(args);				
							}
						});
					});
				});
			})
		});
	});
});

function process_user_step(args) {
	var completed = args.completed;
	var total = args.total;
	var total_seconds = args.total_seconds;
	
	console.log(completed + " / " + total);
	var t0 = performance.now();

	jQuery.ajax({
		type: 'POST',
		url: ajaxurl, 
		data: {
			action: 'relevanssi_index_users',
			limit: args.limit,
			offset: args.offset,
			completed: completed,
			total: total,
			security: nonce.user_indexing_nonce,
		},
		dataType: 'json',
		success: function(response) {
			console.log(response);
			if (response.completed == "done") {
				var t1 = performance.now();
				var time_seconds = (t1 - t0) / 1000;
				time_seconds = Math.round(time_seconds * 100) / 100;
				total_seconds += time_seconds;

				var results_textarea = document.getElementById("results");
				results_textarea.value += response.feedback;
				results_textarea.scrollTop = results_textarea.scrollHeight;
				var percentage_rounded = Math.round(response.percentage);

				jQuery('.rpi-progress div').animate({
					width: percentage_rounded + '%',
					}, 50, function() {
					// Animation complete.
				});
				
				console.log("Done indexing users.");

				if (args.taxonomies_total > 0) {
					var new_args = {
						'completed' : 0,
						'total' : args.taxonomies_total,
						'taxonomies' : args.taxonomies,
						'current_taxonomy': '',
						'post_total' : args.post_total,
						'offset' : 0,
						'total_seconds' : total_seconds,
						'limit' : 20,
						'extend' : false,
					};
					process_taxonomy_step(new_args);
				}
				else {
					var new_args = {
						'security' : nonce.indexing_nonce,
						'completed' : 0,
						'total' : args.post_total,
						'offset' : 0,
						'total_seconds' : 0,
						'limit' : 10,
						'extend' : false,
					};
					process_indexing_step(new_args);
				}
			}
			else {
				var t1 = performance.now();
				var time_seconds = (t1 - t0) / 1000;
				time_seconds = Math.round(time_seconds * 100) / 100;
				total_seconds += time_seconds;
				
				var estimated_time = rlv_format_approximate_time(Math.round(total_seconds / response.percentage * 100 - total_seconds));
				
				document.getElementById("relevanssi_estimated").innerHTML = estimated_time;
				
				if (time_seconds < 2) {
					args.limit = args.limit * 2;
					// current limit can be indexed in less than two seconds; double the limit
				}
				else if (time_seconds < 5) {
					args.limit += 5;
					// current limit can be indexed in less than five seconds; up the limit
				}
				else if (time_seconds > 20) {
					args.limit = Math.round(args.limit / 2);
					if (args.limit < 1) args.limit = 1;
					// current limit takes more than twenty seconds; halve the limit
				}
				else if (time_seconds > 10) {
					args.limit -= 5;
					if (args.limit < 1) args.limit = 1;
					// current limit takes more than ten seconds; reduce the limit
				}

				var results_textarea = document.getElementById("results");
				results_textarea.value += response.feedback;
				results_textarea.scrollTop = results_textarea.scrollHeight;
				var percentage_rounded = Math.round(response.percentage);

				jQuery('.rpi-progress div').animate({
					width: percentage_rounded + '%',
					}, 50, function() {
					// Animation complete.
				});
				console.log("Next step.");
				var new_args = {
					'completed' : parseInt(response.completed),
					'total' : args.total,
					'total_seconds' : total_seconds,
					'offset' : response.offset,
					'limit' : args.limit,
					'post_total' : args.post_total,
					'taxonomies' : args.taxonomies,
					'taxonomies_total' : args.taxonomies_total,
				};
				process_user_step(new_args);
			}
		}
	})
}

function process_taxonomy_step(args) {
	var completed = args.completed;
	var total = args.total;
	var total_seconds = args.total_seconds;
	
	console.log(completed + " / " + total);
	var t0 = performance.now();

	if (args.current_taxonomy == "") {
		taxonomy = args.taxonomies.shift();
		args.offset = 0;
		args.limit = 20;
	}
	else {
		taxonomy = args.current_taxonomy;
	}	

	if (taxonomy != undefined) {
		var results_textarea = document.getElementById("results");
		results_textarea.value += "Indexing " + "'" + taxonomy + "': ";
		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'relevanssi_index_taxonomies',
				completed: completed,
				total: total,
				taxonomy: taxonomy,
				offset : args.offset,
				limit : args.limit,
				security: nonce.taxonomy_indexing_nonce,
			},
			dataType: 'json',
			success: function(response) {
				console.log(response);
				if (response.completed == "done") {
					var t1 = performance.now();
					var time_seconds = (t1 - t0) / 1000;
					time_seconds = Math.round(time_seconds * 100) / 100;
					total_seconds += time_seconds;
					
					var results_textarea = document.getElementById("results");
					results_textarea.value += response.feedback;
					
					console.log("Done indexing taxonomies.");

					var new_args = {
						'completed' : 0,
						'total' : args.post_total,
						'offset' : 0,
						'total_seconds' : 0,
						'limit' : 10,
						'extend' : false,
						'security' : nonce.indexing_nonce,
					};
					process_indexing_step(new_args);
				}
				else {
					var t1 = performance.now();
					var time_seconds = (t1 - t0) / 1000;
					time_seconds = Math.round(time_seconds * 100) / 100;
					total_seconds += time_seconds;
					
					var estimated_time = rlv_format_approximate_time(Math.round(total_seconds / response.percentage * 100 - total_seconds));
					
					document.getElementById("relevanssi_estimated").innerHTML = estimated_time;
					
					if (time_seconds < 2) {
						args.limit = args.limit * 2;
						// current limit can be indexed in less than two seconds; double the limit
					}
					else if (time_seconds < 5) {
						args.limit += 5;
						// current limit can be indexed in less than five seconds; up the limit
					}
					else if (time_seconds > 20) {
						args.limit = Math.round(args.limit / 2);
						if (args.limit < 1) args.limit = 1;
						// current limit takes more than twenty seconds; halve the limit
					}
					else if (time_seconds > 10) {
						args.limit -= 5;
						if (args.limit < 1) args.limit = 1;
						// current limit takes more than ten seconds; reduce the limit
					}

					var results_textarea = document.getElementById("results");
					results_textarea.value += response.feedback;
					results_textarea.scrollTop = results_textarea.scrollHeight;
					var percentage_rounded = Math.round(response.percentage);
	
					jQuery('.rpi-progress div').animate({
						width: percentage_rounded + '%',
						}, 50, function() {
						// Animation complete.
					});
					console.log("Next step.");
					if (response.new_taxonomy) taxonomy = "";
					var new_args = {
						'taxonomies' : args.taxonomies,
						'completed' : parseInt(response.completed),
						'total' : args.total,
						'total_seconds' : total_seconds,
						'post_total' : args.post_total,
						'current_taxonomy' : taxonomy,
						'offset' : response.offset,
						'limit' : args.limit,
					};
					process_taxonomy_step(new_args);
				}
			}
		})
	}
	else {
		var new_args = {
			'completed' : 0,
			'total' : args.post_total,
			'offset' : 0,
			'total_seconds' : 0,
			'limit' : 10,
			'extend' : false,
			'security' : nonce.indexing_nonce,
		};
		process_indexing_step(new_args);
	}
}
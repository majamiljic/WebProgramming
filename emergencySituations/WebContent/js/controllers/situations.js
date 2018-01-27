var allSituations;
var filteredSituations;

$(document).ready(function() {
	$.ajax({
		type : 'GET',
		url : 'rest/situations/getSituations',
		success : function(situations) {
			allSituations = situations;
			filteredSituations = situations;
			renderSituations(situations);
		}
	});
});

function renderSituations(data) {
	var sit = data.situations == null ? 
			{} : (data.situations instanceof Array ? 
					data.situations : [ data.situations ]);
	var map = sit[0];
	var section = $("#situationsSection");
	section.empty();
	Object.keys(map).forEach(function(key) {
		renderSituation(map[key], section);
	});
}

function renderSituation(situation, section) {
	
}
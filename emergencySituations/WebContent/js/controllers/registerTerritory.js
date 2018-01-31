$(document).on('submit', '#regTerrForm', function(e) {
	var name = $('#name').val();
	var area = $('#area').val();
	var population = $('#population').val();
	
	if(name == "" || area == "" || population == "")
		window.alert("All fields are required");
	else {
		var terrInfo = {
			name : name,
			area : area,
			population : population
		}
	
		$.ajax({
			type : 'POST',
			url : 'rest/users/registerTerritory',
			dataType : 'json',
			data : JSON.stringify(terrInfo),
			contentType : 'application/json',
			success : function(data) {
				window.location.replace("profileAdmin.html");
			}
		});
	}
});
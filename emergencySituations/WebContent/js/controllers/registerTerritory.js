$(document).on('submit', '#regTerrForm', function(e)
{
	e.preventDefault();
	var terrInfo = {
		name : $('input#name').val(),
		area : $('input#area').val(),
		population : $('input#population').val()
	}
	
	console.log(terrInfo);

	$.ajax({
		type : 'POST',
		url : 'rest/users/registerTerritory',
		dataType : 'json',
		data : JSON.stringify(terrInfo),
		contentType : 'application/json',
		success : function(data) {
			window.location.replace("profileAdmin.html");
		},
		error : function() { console.log("Error"); }
	});
});
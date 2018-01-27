$(document).ready(function() {
	$.ajax({
		type : 'GET',
		url : 'rest/users/getTerritories',
		success : function(data) {
			var keys = Object.keys(data.territories);
			var territoryList = $("#territoryList");
			for(var i = 0; i < keys.length; i++)
				territoryList.append("<option value=\"" + keys[i] + "\">" + keys[i] + "</option>");
		}
	});
});

function registerSituation() {
	var situation = {
		name : $('input#name').val(),
		description : $('input#description').val(),
		address : $('input#address').val(),
		district : $('input#district').val(),
		territory : $('#territoryList').val(),
		emergencyLevel : $('#emergencyLevel').val()
	}
	
	$.ajax({
		type : 'POST',
		url : 'rest/situations/registerSituation',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(situation),
		success : function(data) {
			if(data) {
				var file = $("#image")[0].files[0];
				uploadImage(file);
				window.location.replace("situations.html");
			}
		}
	});
};

function uploadImage(file) {
	$.ajax({
        type : 'POST',
		url : 'rest/situations/uploadImage',
        contentType : "multipart/form-data",
        data : file,
        processData : false
	}); 
}
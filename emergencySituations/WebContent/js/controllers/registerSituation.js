var loggedUser;

$(document).ready(function() {
	getLoggedUser();
	getTerritories();
});

function getLoggedUser() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(data) {
			loggedUser = data;
		}
	});
}

function goToProfile() {
	if(loggedUser.username == "majami")
		window.location.replace("profileAdmin.html");
	else
		window.location.replace("profileUser.html");
}

function getTerritories() {
	$.ajax({
		type : 'GET',
		url : 'rest/users/getTerritories',
		success : function(data) {
			var values = Object.values(data.territories);
			var territoryList = $("#territoryList");
			for(var i = 0; i < values.length; i++)
				territoryList.append("<option value=\"" + values[i].id + "\">" + values[i].name + "</option>");
		}
	});
}

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
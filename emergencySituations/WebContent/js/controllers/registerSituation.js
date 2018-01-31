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
	var name = $('#name').val();
	var description = $('#description').val();
	var address = $('#address').val();
	var district = $('#district').val();
	var territory = $('#territoryList').val();
	var emergencyLevel = $('#emergencyLevel').val();
	var image = $('#image').val();
	
	if(name == "" || description == "" || address == "" || district == "" ||
			territory == "" || emergencyLevel == "" || image == "")
		window.alert("All fields are required");
	else {
		var situation = {
			name : name,
			description : description,
			address : address,
			district : district,
			territory : territory,
			emergencyLevel : emergencyLevel
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
	}
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
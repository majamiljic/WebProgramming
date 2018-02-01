$(document).ready(function() {
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
});

function register() {
	var email = $('#email').val();
	var username = $('#username').val();
	var password = $('#password').val();
	var name = $('#name').val();
	var surname = $('#surname').val();
	var phoneNumber = $('#phoneNumber').val();
	var territory = $('#territoryList').val();
	var image = $('#image').val();
	
	if(email == "" || username == "" || password == "" || territory == "" ||
		name == "" || surname == "" || phoneNumber == "" || image == "")
		window.alert("All fields are required");
	else if(username.indexOf(' ') !== -1)
		window.alert("Blank spaces in Username are not allowed");
	else if(email.indexOf('@') == -1 || email.indexOf('.') == -1)
		window.alert("Email must contains characters @ and .");
	else {
		var user = {
			email : email,
			username : username,
			password : password,
			name : name,
			surname : surname,
			phoneNumber : phoneNumber,
			territory : territory
		}
		
		$.ajax({
			type : 'POST',
			url : 'rest/users/register',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(user),
			success : function(data) {
				if(data) {
					var file = $("#image")[0].files[0];
					uploadImage(file);
					window.location.replace("login.html");
				}
				else
					alert("Username already exists!");
			}
		});
	}
};

function uploadImage(file) {
	$.ajax({
        type : 'POST',
		url : 'rest/users/uploadImage',
        contentType : "multipart/form-data",
        data : file,
        processData : false
	}); 
}
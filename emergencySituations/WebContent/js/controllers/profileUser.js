$(document).ready(function() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(loggedUser) {
			setProfileData(loggedUser);
		}
	});
});

function setProfileData(loggedUser) {
	pic = $("#pic");
	pic.empty();
	pic.append("<img src='" + getPicturePath(loggedUser.username)
			+ "'style='width:100px; height:110px; border-style:solid; border-width:2px'>")
	username = $("#username");
	username.empty();
	username.append(loggedUser.username);

	email = $("#email");
	email.empty();
	email.append(loggedUser.email);

	surname = $("#surname");
	surname.empty();
	surname.append(loggedUser.name + " " + loggedUser.surname);

	phoneNumber = $("#phoneNumber");
	phoneNumber.empty();
	phoneNumber.append(loggedUser.phoneNumber);

	territory = $("#territory");
	territory.empty();
	territory.append(loggedUser.territory.name);
}

function getPicturePath(picName) {
	var path = "";
	$.ajax({
		type : 'GET',
		url : "rest/users/getImage",
		dataType : "json",
		success : function(data) {
			path = data.responseText;
		}
	});
	return path + picName + ".jpg";
}
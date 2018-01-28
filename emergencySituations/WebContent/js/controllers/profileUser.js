$(document).ready(function() {
	getLoggedUser();
});

function getLoggedUser() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(loggedUser) {
			setProfileData(loggedUser);
			if(loggedUser.status == "Blocked") {
				var regSit = $('#regSit');
				regSit.hide();
			}
		}
	});
}

function setProfileData(loggedUser) {
	pic = $("#pic");
	pic.empty();
	pic.append("<img src='" + getPicturePath(loggedUser.username)
			+ "'style='width:100px; height:110px; border-style:solid; border-width:2px'>");
	
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

function editProfileInfo() {
	usernameModal = $("#usernameModal").val();
	passwordModal = $("#passwordModal").val();
	emailModal = $("#emailModal").val();
	nameModal = $("#nameModal").val();
	surnameModal = $("#surnameModal").val();
	phoneNumberModal = $("#phoneNumberModal").val();

	var user = {
		email : emailModal,
		username : usernameModal,
		password : passwordModal,
		name : nameModal,
		surname : surnameModal,
		phoneNumber : phoneNumberModal
	}
	
	$.ajax({
		type : 'POST',
		url : 'rest/users/editProfileInfo',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(user),
		success : function(data) {
			if(data)
				getLoggedUser();
			else
				alert("Username already exists!");
		}
	});
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
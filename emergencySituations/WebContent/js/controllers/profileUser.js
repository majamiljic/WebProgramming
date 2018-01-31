var logUser;

$(document).ready(function() {
	getLoggedUser();
});

function getLoggedUser() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(loggedUser) {
			logUser = loggedUser;
			setProfileData(loggedUser);
			getMySituations(loggedUser);
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

function setExistingData() {
	usernameModal = $("#usernameModal");
	passwordModal = $("#passwordModal");
	emailModal = $("#emailModal");
	nameModal = $("#nameModal");
	surnameModal = $("#surnameModal");
	phoneNumberModal = $("#phoneNumberModal");

	usernameModal.attr("placeholder", logUser.username);
	passwordModal.attr("placeholder", logUser.password);
	emailModal.attr("placeholder", logUser.email);
	nameModal.attr("placeholder", logUser.name);
	surnameModal.attr("placeholder", logUser.surname);
	phoneNumberModal.attr("placeholder", logUser.phoneNumber);
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

function getMySituations(loggedUser) {
	$.ajax({
		url: "rest/users/" + loggedUser.username + "/getMySituations",
		type: "GET",
		contentType: "application/json",
		complete: function(data) {
			situations = JSON.parse(data.responseText).situations;
			renderSituations(situations);
		}
	});
}

function renderSituations(situations) {
	var situationList = $(".mySituationsTable");
	situationList.empty();
	
	$.each(situations, function(index, situation) {
		var $situation = '<tr id="situation' + situation.id + '"></tr>';
		var situationHtml = 
			"<td>"
				+ "<img src='" + getPicturePath(situation.name) + "' style='width:90px; height:70px;'>"
			+ "</td>"
			+ "<td>" + situation.name + "</td>"
			+ "<td>" + situation.district + "</td>"
			+ "<td>" + situation.description + "</td>"
			+ "<td>" + situation.territory.name + "</td>"
			+ "<td>" + situation.emergencyLevel + "</td>";
		
        situationList.append($situation);
		var $addedSituation = $("#situation" + situation.id);
		$addedSituation.append(situationHtml);
	});
}
var logUser;
$(document).ready(function() {
	getLoggedUser();
	getVolunteers();
	getTerritories();
});
function getLoggedUser() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(loggedUser) {
			setProfileData(loggedUser);
			logUser = loggedUser;
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

function getVolunteers() {
	$.ajax({
		url: "rest/users/getVolunteers",
		type: "GET",
		contentType: "application/json",
		complete: function(data) {
			volunteers = JSON.parse(data.responseText).users;
			renderUsers(volunteers);
		}
	});
}

function getTerritories() {
	$.ajax({
		url: "rest/users/getTerritories",
		type: "GET",
		contentType: "application/json",
		complete: function(data) {
			territories = JSON.parse(data.responseText).territories;
			renderTerritories(territories);
		}
	});
}

function renderUsers(users) {
	var usersList = $(".volunteersTable");
	usersList.empty();
	
	$.each(users, function(index, user) {
		var $user = '<tr id="user' + user.username + '"></tr>';
		var userHtml = 
			"<td>"
				+ "<img src='" + getPicturePath(user.username) + "' style='width:70px; height:70px;'>"
			+ "</td>"
			+ "<td>" + user.name + " " + user.surname + "</td>"
			+ "<td>" + user.username + "</td>"
			+ "<td>" + user.phoneNumber + "</td>"
			+ "<td>" + user.territory.name + "</td>"
			+ "<td>" + user.email + "</td>"
			+ "<td id='blockUnblock" + user.username + "'>"
            + "<span class='fa-stack'>"
	            + "<i class='fa fa-square fa-stack-2x'></i>";
            if(user.status == "Active")
                userHtml += "<i class='fa fa-check fa-stack-1x fa-inverse' onclick=blockUser() id=\"" + user.username + "\"></i>";
            else
            	userHtml += "<i class='fa fa-close fa-stack-1x fa-inverse' onclick=unblockUser() id=\"" + user.username + "\"></i>";
            userHtml += "</span></td>";
		
		usersList.append($user);
		var $addedUser = $("#user" + user.username);
		$addedUser.append(userHtml);
	});
}

function renderTerritories(territories) {
	var territoriesList = $(".territoriesTable");
	territoriesList.empty();
	$.each(territories, function(index, territory) {
		var $territory = '<tr id="territory' + territory.id + '"></tr>';
		var terrHtml = 
			"<td>" + territory.name + "</td>"
			+ "<td>" + territory.area+ "</td>"
			+ "<td>" + territory.population + "</td>"
			+ "<td>"
			+ "<button type=\"button\" class=\"btn btn-default\" data-toggle=\"modal\" data-target=\"#editT\""
			+ "onclick=setTerritoryId() id=\"" + territory.id + "\">Edit&nbsp;&nbsp;</button>&nbsp;&nbsp;"
			+ "<button type=\"button\" class=\"btn btn-danger\""
			+ "onclick=deleteTerritory() id=\"" + territory.id + "\">Delete</button>"
			+ "</td>";
		
		territoriesList.append($territory);
		var $addedTerritory = $("#territory" + territory.id);
		$addedTerritory.append(terrHtml);
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

function blockUser() {
	var e = window.event;
	username = $(e.target)[0].id;
	$.ajax({
		type : 'PUT',
		url : "rest/users/" + username + "/block",
		success : function(data) {
			blockUnblock = $("#blockUnblock" + username);
			blockUnblock.empty();
			blockUnblock.append(
					"<span class='fa-stack'><i class='fa fa-square fa-stack-2x'></i>" +
					"<i class='fa fa-close fa-stack-1x fa-inverse'" +
					"onclick=unblockUser() id=\"" + username + "\"></i></span>");
		}
	});
}

function unblockUser() {
	var e = window.event;
	username = $(e.target)[0].id;
	$.ajax({
		type : 'PUT',
		url : "rest/users/" + username + "/unblock",
		success : function(data) {
			blockUnblock = $("#blockUnblock" + username);
			blockUnblock.empty();
			blockUnblock.append(
					"<span class='fa-stack'><i class='fa fa-square fa-stack-2x'></i>" +
					"<i class='fa fa-check fa-stack-1x fa-inverse'" +
					"onclick=blockUser() id=\"" + username + "\"></i></span>")
		}
	});
}

function deleteTerritory() {
	var e = window.event;
	id = $(e.target)[0].id;
	$.ajax ({
		type : 'DELETE',
		url : "rest/users/" + id + "/deleteTerritory",
		success : function() {
			$("#territory" + id).remove();
		}
	});
}

var terrirotyId;

function setTerritoryId() {
	var e = window.event;
	terrirotyId = $(e.target)[0].id;

	terrNameModal = $("#terrNameModal");
	areaModal = $("#areaModal");
	populationModal = $("#populationModal");
	
	
}

function editTerritory() {
	terrNameModal = $("#terrNameModal").val();
	areaModal = $("#areaModal").val();
	populationModal = $("#populationModal").val();

	var territory = {
		id : terrirotyId,
		name : terrNameModal,
		area : areaModal,
		population : populationModal
	}
	
	$.ajax({
		type : 'POST',
		url : 'rest/users/editTerritory',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(territory),
		success : function(data) {
			if(data)
				getTerritories();
			else
				alert("Territory with that name already exists!");
		}
	});
}
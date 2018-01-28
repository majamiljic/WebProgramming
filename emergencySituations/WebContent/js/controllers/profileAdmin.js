$(document).ready(function() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(loggedUser) {
			setProfileData(loggedUser);
			getVolunteers();
			getTerritories();
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
			+ "<td style='width: 20%;' id='blockUnblock" + user.username + "'>"
            + "<span class='fa-stack'>"
	            + "<i class='fa fa-square fa-stack-2x'></i>";
            if(user.status == "Active")
                userHtml += "<i class='fa fa-check fa-stack-1x fa-inverse' onclick=blockUser() id=\"" + user.username + "\"></i>";
            else
            	userHtml += "<i class='fa fa-close fa-stack-1x fa-inverse' onclick=unblockUser() id=\"" + user.username + "\"></i>";
            userHtml += "</span>";
		
		usersList.append($user);
		var $addedUser = $("#user" + user.username);
		$addedUser.append(userHtml);
	});
}

function renderTerritories(territories) {
	var territoriesList = $(".territoriesTable");
	territoriesList.empty();
	$.each(territories, function(index, territory) {
		var $territory = '<tr id="territory' + territory.name + '"></tr>';
		var terrHtml = 
			"<td>" + territory.name + "</td>"
			+ "<td>" + territory.area+ "</td>"
			+ "<td>" + territory.population + "</td>"
			+ "<td> <span class='fa-stack'>"
            + "<i class='fa fa-square fa-stack-2x'></i>"
			+ "<i class='fa fa-close fa-stack-1x fa-inverse'"
			+ "onclick=deleteTerritory() id=\"" + territory.name + "\"></i>"
			+ "</span></td>";
		
		territoriesList.append($territory);
		var $addedTerritory = $("#territory" + territory.name);
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
					"onclick=unblockUser()></i></span>");
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
					"onclick=blockUser()></i></span>")
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
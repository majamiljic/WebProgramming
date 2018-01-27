$(document).ready(function() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(loggedUser) {
			getVolunteers();
			getTerritories();
		}
	});
});

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
                userHtml += "<i class='fa fa-check fa-stack-1x fa-inverse' onclick=blockUser()></i>";
            else
            	userHtml += "<i class='fa fa-close fa-stack-1x fa-inverse' onclick=unblockUser()></i>";
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
		var $territory = '<tr id="territory' + territory.area + '"></tr>';
		var terrHtml = 
			"<td>" + territory.name + "</td>"
			+ "<td>" + territory.area+ "</td>"
			+ "<td>" + territory.population + "</td>";
		
		territoriesList.append($territory);
		var $addedTerritory = $("#territory" + territory.area);
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
	username = $(e.target).parent().parent().parent()[0].id.substring(4);
	$.ajax({
		type : 'PUT',
		url : "rest/users/" + username + "/block",
		success : function(data) {
			blockUnblock = $("#blockUnblock" + username);
			blockUnblock.empty();
			blockUnblock.append("<span class='fa-stack'><i class='fa fa-square fa-stack-2x'></i><i class='fa fa-close fa-stack-1x fa-inverse' onclick=unblockUser()></i></span>");
		}
	});
}

function unblockUser() {
	var e = window.event;
	username = $(e.target).parent().parent().parent()[0].id.substring(4);;
	$.ajax({
		type : 'PUT',
		url : "rest/users/" + username + "/unblock",
		success : function(data) {
			blockUnblock = $("#blockUnblock" + username);
			blockUnblock.empty();
			blockUnblock.append("<span class='fa-stack'><i class='fa fa-square fa-stack-2x'></i><i class='fa fa-check fa-stack-1x fa-inverse' onclick=blockUser()></i></span>")
		}
	});
}
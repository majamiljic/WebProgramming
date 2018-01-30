var loggedUser;
var allSituations;
var filteredSituations;

$(document).ready(function() {
	getLoggedUser();
	getSituations();
	$("#choiceSelect").on("change", function() {
		choiceChanged();
	});
});

function getLoggedUser() {
	$.ajax({
		url : "rest/users/loggedUser",
		type : "GET",
		dataType : "json",
		success : function(data) {
			loggedUser = data;
			if(loggedUser.status == "Blocked") {
				var regSit = $('#regSit');
				regSit.hide();
			}
		}
	});
}

function goToProfile() {
	if(loggedUser.username == "majami")
		window.location.replace("profileAdmin.html");
	else
		window.location.replace("profileUser.html");
}

function getSituations() {
	$.ajax({
		type : 'GET',
		url : 'rest/situations/getSituations',
		success : function(situations) {
			allSituations = situations;
			filteredSituations = situations;
			renderSituations(situations);
		}
	});
}

function getTerritories() {
	$.ajax({
		type : 'GET',
		url : 'rest/users/getTerritories',
		success : function(data) {
			var values = Object.values(data.territories);
			var territoryList = $("#territoryList");
			for(var i = 0; i < values.length; i++)
				territoryList.append("<option value=\"" + values[i].name + "\">" + values[i].name + "</option>");
		}
	});
}

function choiceChanged() {
	var inputStuffPlace = $("#inputStuffPlace");

	if($('#choiceSelect').val() == "all") {
		var inputStuffPlace = $("#inputStuffPlace");
		inputStuffPlace.hide();
	}
	else if($('#choiceSelect').val() == "date") {
		var str = "<input type=\"date\" id=\"dateSelect\" name=\"dateSelect\">";
		inputStuffPlace.show();
		inputStuffPlace.empty();
		inputStuffPlace.append(str);
	}
	else if ($('#choiceSelect').val() == "territory") {
		var str = "<select class=\"form-control\" style=\"width:200px\" id=\"territoryList\"></select>";
		inputStuffPlace.show();
		inputStuffPlace.empty();
		inputStuffPlace.append(str);
		getTerritories();
	}
	else if($('#choiceSelect').val() == "emergencyLevel") {
		var str = "<select class=\"form-control\" style=\"width:200px\" id=\"emergencyLevelList\"></select>";
		inputStuffPlace.show();
		inputStuffPlace.empty();
		inputStuffPlace.append(str);
		
		var emergencyLevelList = $("#emergencyLevelList");
		emergencyLevelList.append("<option value=\"Red\">Red</option>");
		emergencyLevelList.append("<option value=\"Orange\">Orange</option>");
		emergencyLevelList.append("<option value=\"Blue\">Blue</option>");
	}
}

function situationFilter() {	
	var type = $('#choiceSelect').val();
	
	if (type == "all") {
		getSituations();
	}
	else if (type == "date") {
		var date = $('#dateSelect').val();
		ajaxSearch("rest/situations/filterByDate", date);
	}
	else if (type == "territory") {
		var t = $('#territoryList').val();
		ajaxSearch("rest/situations/filterByTerritory", t);
	}
	else if (type == "emergencyLevel") {
		var emergencyLevel = $('#emergencyLevelList').val();
		ajaxSearch("rest/situations/filterByEmergencyLevel", emergencyLevel);
	}
}

function ajaxSearch(serviceUrl, param) {
	var json = JSON.stringify(param);
	$.ajax ({
		url: serviceUrl,
		type: "PUT",
		contentType: "application/json",
		dataType: "json",
		data: json,
		success: function(responseData) {
			allSituations = responseData;
			if (allSituations != null) {
				filteredSituations = allSituations;
				renderSituations(filteredSituations);
			}
		}
	});
}

function renderSituations(data) {
	var sit = data.situations == null ? 
			{} : (data.situations instanceof Array ? 
					data.situations : [ data.situations ]);

	var map = sit[0];
	var section = $("#situationsDiv");
	section.empty();
	Object.keys(map).forEach(function(key) {
		renderSituation(map[key], section);
	});
}

function renderSituation(situation, section) {
	var situationhtml =
		"<div id=\"wholeSituation" + situation.id + "\">"
		+ "<div id=\"wrap" + situation.id +"\">"
		+ "<div id=\"main" + situation.id + "\">"
		+ "<div class=\"row\">"
		+ "<div class=\"col-md-12\">"
		+ "<div class=\"media-body\" id=\"containerForDelete" + situation.id + "\">"
		+ "<div class=\"col-md-3\">"
			+ "<img style=\"width: 170px; height: 130px; margin-top:20px; padding: 5px\" class=\"media-object\" id=\"picture" + situation.id + "\">"
		+ "</div>"
		+ "<div class=\"well well-lg\" style=\"height: 200px\" id=\"situationDiv" + situation.id + "\">"
		+ "<h4 class=\"media-heading text-uppercase reviews\" id=\"sitName" + situation.id + "\"></h4>"
		+ "<h4 class=\"media-heading text-uppercase reviews\" id=\"volName" + situation.id + "\"></h4>"
		+ "<h6 class=\"media-heading text-uppercase reviews\" id=\"territory" + situation.id + "\"></h6>"
		+ "<h6 class=\"media-heading text-uppercase reviews\" id=\"sitDate" + situation.id + "\"></h6>"
		+ "<h6 class=\"media-heading text-uppercase reviews\" id=\"sitDescription" + situation.id + "\"></h6>"
		+ "</div></div></div></div></div></div></div><hr/>";
		
	section.prepend(situationhtml);
	var sitPic = $("#picture" + situation.id);
	sitPic.attr("src", situation.name + ".jpg");
	var sitName = $("#sitName" + situation.id)
	sitName.append("<b>" + situation.name + "</b>");
	var volName = $("#volName" + situation.id);
	if(situation.volunteer != null)
		volName.append(situation.volunteer.name + " " + situation.volunteer.surname);
	var territoryDiv = $("#territory" + situation.id)
	territoryDiv.append(situation.territory.name + ", " + situation.district);
	var descDiv = $("#sitDescription" + situation.id);
	descDiv.append(situation.description);
	var sitDate = $("#sitDate" + situation.id);
	var d = new Date(situation.date);
	sitDate.append(d.toDateString());
	
	if(loggedUser.username == "majami") {
		var situationDiv = $("#situationDiv" + situation.id);
		var changeStat =
		"<div>"
			+ "<div id='activateArchive" + situation.id + "'>"
				+ "STATUS: &nbsp;&nbsp;"
				
				+ "<span class='fa-stack'>"
		        + "<i class='fa fa-square fa-stack-2x'></i>";
		        if(situation.status == "Active")
		        	changeStat += "<i class='fa fa-check fa-stack-1x fa-inverse' onclick=archiveSituation() id=\"" + situation.id + "\"></i>";
		        else
		        	changeStat += "<i class='fa fa-close fa-stack-1x fa-inverse' onclick=activateSituation() id=\"" + situation.id + "\"></i>";
		        changeStat += 
		        "</span><br>"
		        + "<div id=\"putItHere" + situation.id + "\">"
			        + "<button class=\"btn btn-default\" style=\"width:150px\" id=\"showSelect" + situation.id + "\""
			        + "onclick=getVolunteers()>Set Volunteer</button>"
		        + "</div>"
	        + "</div>"
        + "</div>";
		situationDiv.append(changeStat);
	}
	
	if(situation.status == "Active" && loggedUser.status == "Active") {
		var comments = $("#wrap" + situation.id);
		var commentFormHtml =
			"<div class=\"row\""
			+ "<div id=\"commentsDiv\""
			+ "style=\"background-color:white; border: 1px solid; border-radius:15px; width:80%; margin-left: 10%\">"
			+ "</div></div><br><br>"
			+ "<div class=\"row\">"
			+ "<div class=\"col-md-12\">"
			+ "<div class=\"form-group\">"
			+ "<form action=\"\" id=\"commentform" + situation.id + "\">"
			+ "<div id=\"comment-message\" class=\"form-row\">"
	        + "<textarea class=\"form-control\" name=\"comment\" placeholder=\"Comment...\""
	        + "class=\"comment\" id=\"commentArea" + situation.id + "\""
	        + "style=\"max-width:100%; min-width:100%; max-height:150px\" rows=\"3\" ></textarea><br />"
	        + "</div>"
			+ "<a>"
			+ "<input class=\"btn btn-default\" name=\"submit\" id=\"commentSubmit" + situation.id + "\""
			+ "value=\"Comment\" onclick=submitComment()></a><br />"
			+ "</form></div></div></div>";
		comments.append(commentFormHtml);
		
		if(situation.comments != null) {
			renderComment(situation.comments);
		}
	}
}

function renderComment(comments) {
	var commentsDiv = $("#commentsDiv");
	commentsDiv.empty();
	
	$.each(comments, function(index, comm) {
		var $comm = "<div class=\"row\" id=\"comm\"" + comm.id + "\">"
		+ "<div class=\"col-md-3\">"
			+ "<img style=\"width: 80px; height: 90px; border-radius:20px; padding: 5px\""
			+ "class=\"media-object\" id=\"userPicture" + comm.id + "\">"
		+ "</div> &nbsp;&nbsp;"
		+ "<div class=\"col-md-9\">"
			+ "<h4 class=\"media-heading text-uppercase reviews\" id=\"commUsername" + comm.id + "\"></h4>"
			+ "<h6 class=\"media-heading text-uppercase reviews\" id=\"commText" + comm.id + "\"></h6>"
			+ "<p id=\"commDate" + comm.id + "\"></p>"
		+ "</div>"
		+ "<hr width=\"2px\"></div>";
		
		commentsDiv.append($comm);

		var userPicture = $("#userPicture" + comm.id);
		userPicture.attr("src", getPicturePath(comm.user.username));
		var commUsername = $("#commUsername" + comm.id)
		commUsername.append("<b>" + comm.user.username + "</b>");
		var commText = $("#commText" + comm.id)
		commText.append(comm.text);
		var commDate = $("#commDate" + comm.id)
		var d = new Date(comm.date);
		commDate.append(d.toDateString());

	});
}

function archiveSituation() {
	var e = window.event;
	id = $(e.target)[0].id;
	$.ajax({
		type : 'PUT',
		url : "rest/situations/" + id + "/archive",
		success : function(data) {
			activateArchive = $("#activateArchive" + id);
			activateArchive.empty();
			activateArchive.append(
					"<span class='fa-stack'><i class='fa fa-square fa-stack-2x'></i>"
					+ "<i class='fa fa-close fa-stack-1x fa-inverse'"
					+ "onclick=activateSituation() id=\"" + id + "\"></i></span>");
			getSituations();
		}
	});
}

function activateSituation() {
	var e = window.event;
	id = $(e.target)[0].id;
	$.ajax({
		type : 'PUT',
		url : "rest/situations/" + id + "/activate",
		success : function(data) {
			activateArchive = $("#activateArchive" + id);
			activateArchive.empty();
			activateArchive.append(
					"<span class='fa-stack'><i class='fa fa-square fa-stack-2x'></i>"
					+ "<i class='fa fa-check fa-stack-1x fa-inverse'"
					+ "onclick=archiveSituation() id=\"" + id + "\"></i></span>");
			getSituations();
		}
	});
}

function getVolunteers() {
	var e = window.event;
	id = $(e.target)[0].id;
	id = id.split("showSelect")[1];
	
	var showSelect = $("#showSelect"+id);
	showSelect.hide();
	
	var putItHere = $("#putItHere"+id);
	var selectHtmlPart =
		"<select class=\"form-control col-sm-4\" style=\"width:150px\" id=\"volList" + id + "\">"
		+ "<option>&nbsp;</option>"
		+ "</select>"
	    + "<button class=\"btn btn-default col-sm-4\" style=\"width:150px\" id=\"addVolButton" + id + "\""
	    + "onclick=setVolunteer()>Set</button>";
	putItHere.prepend(selectHtmlPart);
	var volList = $("#volList"+id);
	
	$.ajax({
		url: "rest/situations/" + id + "/getVolunteers",
		type: "GET",
		contentType: "application/json",
		complete: function(data) {
			volunteers = JSON.parse(data.responseText).users;
			var keys = Object.keys(volunteers);
			for(var i = 0; i < keys.length; i++) {
				volList.append("<option value=\"" + keys[i] + "\">" + keys[i] + "</option>");	
			}
		}
	});
}

function setVolunteer() {
	var e = window.event;
	id = $(e.target)[0].id;
	id = id.split("addVolButton")[1];

	var selected = $("#volList"+id).val();
	
	$.ajax({
		type : 'PUT',
		url : "rest/situations/" + id + "/setVolunteer/" + selected,
		success : function() {
			getSituations();
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
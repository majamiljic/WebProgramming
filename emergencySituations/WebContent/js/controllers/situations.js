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
		console.log(date);
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
	var section = $("#situationsSection");
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
		+ "<a class=\"col-md-3\">"
			+ "<img style=\"width: 170px; height: 130px; margin-top:20px; padding: 5px\" class=\"media-object\" id=\"picture" + situation.id + "\">"
		+ "</a>"
		+ "<div class=\"well well-lg\" style=\"height: 170px\" id=\"deleteProhibit" + situation.id + "\">"
		+ "<h4 class=\"media-heading text-uppercase reviews\" id=\"sitName" + situation.id + "\"></h4>"
		+ "<h4 class=\"media-heading text-uppercase reviews\" id=\"opName" + situation.id + "\"></h4>"
		+ "<h6 class=\"media-heading text-uppercase reviews\" id=\"territory" + situation.id + "\"></h6>"
		+ "<h6 class=\"media-heading text-uppercase reviews\" id=\"sitDate" + situation.id + "\"></h6>"
		+ "<h6 class=\"media-heading text-uppercase reviews\" id=\"sitDescription" + situation.id + "\"></h6>"
		+ "</div></div></div></div></div></div><hr/>"
		+ "<div class=\"tab-content\">"
	    + "<div class=\"tab-pane active\" id=\"comments-logout\">"               
	    + "<ul class=\"media-list\" id = \"snippetComments" + situation.id + "\">";
		
	section.prepend(situationhtml);
	var opPic = $("#picture" + situation.id);
	opPic.attr("src", situation.name + ".jpg");
	var sitName = $("#sitName" + situation.id)
	sitName.append("<b>" + situation.name + "</b>");
	var opName = $("#opName" + situation.id);
	if(situation.volunteer != null)
		opName.append(situation.volunteer.name + " " + situation.volunteer.surname);
	var territoryDiv = $("#territory" + situation.id)
	territoryDiv.append(situation.territory.name + ", " + situation.district);
	var descDiv = $("#sitDescription" + situation.id);
	descDiv.append(situation.description);
	var sitDate = $("#sitDate" + situation.id);
	var d = new Date(situation.date);
	sitDate.append(d.toDateString());
	
	if(loggedUser.username == "majami") {
		var deleteProhibit = $("#deleteProhibit" + situation.id);
		var deleteBanComments =
		"<div>"
		/*+ "<button class=\"btn btn-primary\" id=\"deleteButton" + situation.id + "\" onclick=deleteSnippetRest()>Delete</button>&nbsp;"
	    + "<button class=\"btn btn-primary\" id=\"banCommentsButton" + situation.id + "\" onclick=banCommentsRest()>Prohibit Comments</button>"*/
		+ "<td style='width: 20%;' id='activateArchive" + situation.id + "'> STATUS: "
        + "<span class='fa-stack'>"
        + "<i class='fa fa-square fa-stack-2x'></i>";
        if(situation.status == "Active")
        	deleteBanComments += "<i class='fa fa-check fa-stack-1x fa-inverse' onclick=archiveSituation() id=\"" + situation.id + "\"></i>";
        else
        	deleteBanComments += "<i class='fa fa-close fa-stack-1x fa-inverse' onclick=activateSituation() id=\"" + situation.id + "\"></i>";
        deleteBanComments += "</span>";
	    + "</div>";
		deleteProhibit.append(deleteBanComments);
	}

	if(situation.status == "Active") {
		sortedComments = sortComments(situation.comments);
		$.each(sortedComments, function(index, comment) {
			addComment(comment, situation.id);
		});
	}
	
	if(situation.status == "Active" && loggedUser.status == "Active") {
		var comments = $("#wrap" + situation.id);
		var commentFormHtml = "<div class=\"row\">"
			+ "<div class=\"col-md-12\">"
			+ "<div class=\"form-group\">"
			+ "<form action=\"\" id=\"commentform" + situation.id + "\">"
			+ "<div id=\"comment-message\" class=\"form-row\">"
	        + "<textarea name=\"comment\" placeholder=\"Comment...\" class=\"comment\" id=\"commentArea"
        	+ situation.id
	        + "\" style=\"max-width:100%; min-width:100%; max-height:150px\" rows=\"3\" ></textarea><br />"
	        + "</div>"
			+ "<a><input class=\"btn btn-default\" name=\"submit\" id=\"commentSubmit" + situation.id + "\" value=\"Comment\" onclick=submitComment()></a><br />"
			+ "</form>" + "</div>" + "</div>" + "</div>";
		comments.append(commentFormHtml);
	}
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
					+ "<i class='fa fa-close fa-stack-1x fa-inverse' onclick=activateSituation("
					+ id + ")></i></span>");
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
					+ "<i class='fa fa-check fa-stack-1x fa-inverse' onclick=archiveSituation("
					+ id + ")></i></span>");
			getSituations();
		}
	});
}

function sortComments(comments)
{
	var sorted = [];
	for(var key in comments)
		sorted.push(comments[key])
	var criteria = $("#commentSort").val();
	for(var i = 0; i < sorted.length; i++)
	{
		for(var j = i; j < sorted.length; j++)
		{
			console.log(criteria);
			if(criteria == "date" && sorted[i].date > sorted[j].date)
			{
				var tmp = sorted[i];
				sorted[i] = sorted[j];
				sorted[j] = tmp;
			}
			else if(criteria == "rating" && sorted[i].mark > sorted[j].mark)
			{
				var tmp = sorted[i];
				sorted[i] = sorted[j];
				sorted[j] = tmp;
			}
		}
	}
	return sorted;
}

function deleteSnippet(snippetId)
{
	$("#wholeSnippet" + snippetId).remove();
}

function deleteComment(comment)
{
	$("#wholeComment" + comment.id).remove();
}

function addComment(comment, snippetId)
{
	var comments = $("#snippetComments" + snippetId);
	var commentHtml = "<li class=\"media-top\" id=\"wholeComment" + comment.id + "\">"
		+ "<img class=\"media-object img-circle pull-left commentPicture\" id=\"image" + comment.id + "\">"
		+ "<div class=\"media-body\">"
		+ "<div class=\"well well-lg\" id=\"commentMainArea" + comment.id + "\">"
		+ "<h4 class=\"media-heading text-uppercase reviews\" id=\"user" + comment.id + "\"></h4>"
		+ "<p class=\"media-comment\" id=\"commentDate" + comment.id + "\"></p>"
		+ "<p class=\"media-comment\" id = \"commentText" + comment.id + "\"></p>"
		+ "</div>"
		+ "</div>"
		+ "</li>";
	comments.prepend(commentHtml);
	changeComment(comment);
}

function changeComment(comment)
{
	console.log(comment);
	var loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
	if(((loggedUser.username == comment.user.username) && !loggedUser.blocked) || (loggedUser.role == "Admin"))
	{
		var placeForDeleteButton = $("#commentMainArea" + comment.id);
		placeForDeleteButton.append("<button class=\"btn btn-info btn-circle text-uppercase\" id=\"deleteButton" + comment.id + "\" onclick=\"deleteCommentRest()\">Delete</button>");
	}
	
	var placeForVoteButtons = $("#commentMainArea" + comment.id);
	placeForVoteButtons.append("<div class=\"pull-right\" id=\"placeForVote" + comment.id + "\"></div>")
	votePlace = $("#placeForVote" + comment.id);
	votePlace.empty();
	votePlace.append("<h5 class=\"markValue\">" + comment.mark + "</h5>")
	if((loggedUser.username != comment.user.username) && (!loggedUser.blocked) && (comment.users.indexOf(loggedUser.username) == -1) && (loggedUser.role != "Guest"))
	{
		
		
		votePlace.append
		(
		      	"<button class=\"btn btn-success btn-circle text-uppercase voteBtns\" id=\"upVote" + comment.id + "\" onclick=\"voteUp()\">+</button>" +
		      	"<button class=\"btn btn-danger btn-circle text-uppercase voteBtns\" id=\"downVote" + comment.id + "\" onclick=\"voteDown()\">-</button>"
		);
	}
	
	var image = $("#image" + comment.id);
	image.attr("src", comment.user.picture);
	var nameOfTheUser = $("#user" + comment.id);
	nameOfTheUser.empty();
	nameOfTheUser.append(comment.user.firstName + " " + comment.user.lastName);
	var com = $("#commentText" + comment.id);
	com.empty();
	com.append(comment.text);
	var datePlace = $("#commentDate" + comment.id);
	var date = new Date(comment.date);
	var month = date.getMonth() + 1;
	datePlace.empty();
	datePlace.append("" + date.getDate() + ". " + month + ". " + date.getFullYear() + ".");
}


function submitComment(e)
{
	e = e || window.event;
	var id = e.target.id.substring(13);
	var commentText = $("#commentArea" + id).val();
	$.ajax({
		type : 'POST',
		url : "rest/snippets/" + id + "/addComment",
		contentType : "application/json",
		dataType : "json",
		data : commentText,
		success : function(responseData)
		{
			if(responseData != null)
				addComment(responseData, id)
		}
	});

}

function voteUp(e)
{
	e = e || window.event;
	var id = e.target.id.substring(6);
	var snippetId = $(e.target).parent().parent().parent().parent().parent()[0].id.substring(15);
	var mark = 1;
	$.ajax({
		type : 'PUT',
		url : "rest/snippets/" + snippetId + "/" + id + "/rateComment",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(mark),
		success : function(responseData)
		{
			if(responseData != undefined && responseData != null)
				changeComment(responseData);
		}
	});
}

function voteDown(e)
{
	e = e || window.event;
	var id = e.target.id.substring(8);
	var snippetId = $(e.target).parent().parent().parent().parent().parent()[0].id.substring(15);
	var mark = -1;
	$.ajax({
		type : 'PUT',
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify(mark),
		url : "rest/snippets/" + snippetId + "/" + id + "/rateComment",
		success : function(responseData)
		{
			changeComment(responseData);
		}
	});
}

function deleteSnippetRest(e)
{
	e = e || window.event;
	var id = e.target.id.substring(12);
	$.ajax({
		type : 'DELETE',
		url : "rest/snippets/" + id + "/removeSnippet",
		success : function()
		{
			deleteSnippet(id);
		}
	});
}

function banCommentsRest(e)
{
}
$(document).ready(function() {
	if (localStorage.getItem("hasCodeRunBefore") === null) {
		$.ajax({
			type : 'GET',
			url : 'rest/users/getTerritories',
			success : function(data) {
				var keys = Object.keys(data.territories);
				var territoryList = $("#territoryList");
				for(var i = 0; i < keys.length; i++)
					territoryList.append("<option value=\"" + keys[i] + "\">" + keys[i] + "</option>");
			}
		});
        localStorage.setItem("hasCodeRunBefore", true);
    }
	else
		window.location.replace("login.html");
});

function register() {
	var user = {
		email : $('input#email').val(),
		username : $('input#username').val(),
		password : $('input#password').val(),
		name : $('input#name').val(),
		surname : $('input#surname').val(),
		phoneNumber : $('input#phoneNumber').val(),
		territory : $('#territoryList').val()
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
			}
		}
	});
};

function uploadImage(file) {
	$.ajax({
		url : 'rest/users/uploadImage',
        type : "POST",
        contentType : "multipart/form-data",
        data : file,
        processData : false
	}); 
}
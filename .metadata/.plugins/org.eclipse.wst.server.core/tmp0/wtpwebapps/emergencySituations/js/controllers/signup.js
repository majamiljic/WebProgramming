var register_url = "rest/users/register";
var image_url = "rest/users/uploadImage";

function register()
{
	var user = {
		username : $('input[name="username"]').val(),
		password : $('input[name="password"]').val(),
		name : $('input[name="name"]').val(),
		surname : $('input[name="surname"]').val(),
		phoneNumber : $('input[name="phoneNumber"]').val(),
		email : $('input[name="email"]').val(),
		territory : $('input[name="territory"]').val()
	}
	
	$.ajax({
		type : 'POST',
		url : register_url,
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
		url : image_url,
        type : "POST",
        contentType : "multipart/form-data",
        data : file,
        processData : false
	}); 
}
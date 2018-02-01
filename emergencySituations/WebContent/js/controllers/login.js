$(document).on('submit', '#loginForm', function(e) {
	localStorage.setItem("loggedUser", {});

	var loginInfo = {
		username : $('#username').val(),
		password : $('#password').val()
	}

	$.ajax({
		type : 'POST',
		url : 'rest/users/login',
		dataType : 'json',
		data : JSON.stringify(loginInfo),
		contentType : 'application/json',
		success : function(data) {
			if(data != null) {
				localStorage.setItem("loggedUser", JSON.stringify(data));
				window.location.replace("situations.html");
			}
			else
				alert("Wrong username or password");
		}
	});
});
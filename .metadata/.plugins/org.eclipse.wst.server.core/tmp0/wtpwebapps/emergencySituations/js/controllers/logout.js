function logout() {
	var us = localStorage;
	
	$.ajax({
		type : 'POST',
		url : "rest/users/logout",
		success : function() {
			us.setItem("loggedUser", {});
			window.location.replace("index.html");
		}
	});
}
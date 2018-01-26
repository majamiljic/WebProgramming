function logout() {
	var us = localStorage;
	
	$.ajax({
		type : 'POST',
		url : "rest/users/logout",
		success : function()
		{
			us.setItem("loggedUser", {});
	        us.setItem("hasCodeRunBefore", false);
			window.location.replace("index.html");
		}
	});
}
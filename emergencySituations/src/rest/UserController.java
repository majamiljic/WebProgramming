package rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import model.EmergencySituation;
import model.EmergencySituations;
import model.Territories;
import model.Territory;
import model.User;
import model.Users;
import util.Util;

@Path("/users")
public class UserController {
	
	@Context
	ServletContext ctx;
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User login(@Context HttpServletRequest request, HashMap<String, String> hashMap) {
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			Users u = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", u);
			users = (Users) ctx.getAttribute("users");
		}

		String username = hashMap.get("username");
		String password = hashMap.get("password");
		
		if(users.getUser(username) != null) {
			if(users.getUser(username).getPassword().equals(password)) {
				request.getSession().setAttribute("user", users.getUser(username));
				User ret = users.getUser(username);
				return ret;
			}
		}
		return null;
	}
	
	@POST
	@Path("/logout")
	public void logout(@Context HttpServletRequest request) {
		request.getSession().invalidate();
	}
	
	@GET
	@Path("/getTerritories")
	@Produces(MediaType.APPLICATION_JSON)
	public Territories getTerritories(@Context HttpServletRequest request) {
		Territories terr = (Territories) ctx.getAttribute("territories");
		if (terr == null) {
			terr = Util.readTerritories(ctx.getRealPath(""));
			ctx.setAttribute("territories", terr);
		}
		return (Territories) ctx.getAttribute("territories");
	}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean register(@Context HttpServletRequest request, HashMap<String, String> hashMap) {		
		Territories terr = (Territories) ctx.getAttribute("territories");
		Territory territory = terr.getTerritory(hashMap.get("territory"));
		
		User user = new User(
				hashMap.get("username"),
				hashMap.get("password"),
				hashMap.get("name"),
				hashMap.get("surname"),
				hashMap.get("phoneNumber"),
				hashMap.get("email"),
				territory,
				"Active",
				hashMap.get("username") + ".jpg");
		
		if(usernameExists(user.getUsername()))
			return false;
		
		addUser(user);
		request.getSession().setAttribute("image", user.getUsername() + ".jpg");
		return true;
	}

	@POST
	@Path("/editProfileInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean editProfileInfo(@Context HttpServletRequest request, HashMap<String, String> hashMap) {
		User u = (User)request.getSession().getAttribute("user");
		
		if(!hashMap.get("email").equals(""))
			u.setEmail(hashMap.get("email"));
		if(!hashMap.get("password").equals(""))
			u.setPassword(hashMap.get("password"));
		if(!hashMap.get("name").equals(""))
			u.setName(hashMap.get("name"));
		if(!hashMap.get("surname").equals(""))
			u.setSurname(hashMap.get("surname"));
		if(!hashMap.get("phoneNumber").equals(""))
			u.setPhoneNumber(hashMap.get("phoneNumber"));
		if(!hashMap.get("username").equals("")) {
			if(usernameExists(hashMap.get("username")))
				return false;
			else
				u.setUsername(hashMap.get("username"));
		}

		addUser(u);
		return true;
	}
	
	private boolean usernameExists(String username) {
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			try {
				Users u = Util.readUsers(ctx.getRealPath(""));
				ctx.setAttribute("users", u);
				users = (Users) ctx.getAttribute("users");
			} catch (Exception e) {
				users = new Users();
				ctx.setAttribute("users", users);
			}
		}
		return users.usernameExists(username);
	}
	
	private void addUser(User u) {
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			Users us = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", us);
			users = (Users) ctx.getAttribute("users");
		}
		users.addUser(u);
		Util.writeUsers(ctx.getRealPath(""), users);
	}
	
	@POST
	@Path("/uploadImage")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public void uploadImage(@Context HttpServletRequest request, InputStream is) throws IOException {
		String imageName = (String) request.getSession().getAttribute("image");
		int read;
		byte[] bytes = new byte[1024];
		File f = new File(ctx.getRealPath("") + File.separator + imageName);
		//f.createNewFile();
		OutputStream os = new FileOutputStream(f);
		
		while((read = is.read(bytes)) != -1)
			os.write(bytes, 0, read);
		
		os.flush();
		os.close();
	}
	
	@GET
	@Path("/getImage")
	@Produces(MediaType.APPLICATION_JSON)
	public String getImagePath(@Context HttpServletRequest request) {
		return ctx.getRealPath("") + File.separator;
	}
	
	@POST
	@Path("/guestLogin")
	@Produces(MediaType.APPLICATION_JSON)
	public User createGuest(@Context HttpServletRequest request) {
		User u = new User("guest", "g", "Guest",
				"Guest", "phoneNumber", "email",
				new Territory(), "", "guest.jpg");
		request.getSession().setAttribute("user", u);
		return u;
	}
	
	@GET
	@Path("/getVolunteers")
	@Produces(MediaType.APPLICATION_JSON)
	public Users getUsers(@Context HttpServletRequest request) {
		Users retVal = new Users();
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			users = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", users);
		}
		for(User u : users.getUsers().values()) {
			if(!u.getUsername().equals("majami"))
				retVal.addUser(u);
		}

		return retVal;
	}
	
	@GET
	@Path("/{id}/getMySituations")
	@Produces(MediaType.APPLICATION_JSON)
	public EmergencySituations getMySituations(@Context HttpServletRequest request, @PathParam("id") String id) {
		EmergencySituations retVal = new EmergencySituations();
		
		EmergencySituations sit = (EmergencySituations) ctx.getAttribute("situations");
		if (sit == null) {
			sit = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", sit);
		}
		
		for(EmergencySituation situation : sit.getSituations().values()) {
			if(situation.getStatus().equals("Active")) {
				if(situation.getVolunteer() != null)
					if(situation.getVolunteer().getUsername().equals(id))
						retVal.addSituation(situation);
			}
		}
		
		return retVal;
	}
	
	@GET
	@Path("/loggedUser")
	@Produces(MediaType.APPLICATION_JSON)
	public User getLoggedUser(@Context HttpServletRequest request) {
		User u = (User)request.getSession().getAttribute("user");
		return u;
	}
	
	@PUT
	@Path("/{username}/block")
	public void blockUser(@Context HttpServletRequest request, @PathParam("username") String username) {
		User loggedUser = (User) request.getSession().getAttribute("user");
		
		if(!loggedUser.getUsername().equals("majami"))
			return;
		
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			Users u = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", u);
			users = (Users) ctx.getAttribute("users");
		}
		
		User u = users.getUser(username);
		u.setStatus("Blocked");
		Util.writeUsers(ctx.getRealPath(""), users);
	}
	
	@PUT
	@Path("/{username}/unblock")
	public void unblockUser(@Context HttpServletRequest request, @PathParam("username") String username) {
		User loggedUser = (User) request.getSession().getAttribute("user");
		
		if(!loggedUser.getUsername().equals("majami"))
			return;
		
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			Users u = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", u);
			users = (Users) ctx.getAttribute("users");
		}
		
		User u = users.getUser(username);
		u.setStatus("Active");
		Util.writeUsers(ctx.getRealPath(""), users);
	}

	@POST
	@Path("/registerTerritory")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void registerTerritory(@Context HttpServletRequest request, HashMap<String, String> hashMap) {
		Territory territory = new Territory(
				hashMap.get("name"), 
				Integer.parseInt(hashMap.get("area")), 
				Integer.parseInt(hashMap.get("population")));
		
		addTerritory(territory);
	}
	
	private void addTerritory(Territory territory) {
		Territories terr = ((Territories) ctx.getAttribute("territories"));
		if (terr == null) {
			terr = Util.readTerritories(ctx.getRealPath(""));
			ctx.setAttribute("territories", terr);
		}
		
		terr.addTerritory(territory);
		Util.writeTerritories(ctx.getRealPath(""), terr);
	}

	@DELETE
	@Path("/{id}/deleteTerritory")
	public synchronized void deleteTerritory(@Context HttpServletRequest request, @PathParam("id") String id) {
		Territories terr = ((Territories) ctx.getAttribute("territories"));
		if (terr == null) {
			terr = Util.readTerritories(ctx.getRealPath(""));
			ctx.setAttribute("territories", terr);
		}
		
		Territory t = terr.getTerritory(id);
		terr.removeTerritory(t);
		Util.writeTerritories(ctx.getRealPath(""), terr);
	}

	@POST
	@Path("/editTerritory")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean editTerritory(@Context HttpServletRequest request, HashMap<String, String> hashMap) {
		Territories terr = ((Territories) ctx.getAttribute("territories"));
		if (terr == null) {
			terr = Util.readTerritories(ctx.getRealPath(""));
			ctx.setAttribute("territories", terr);
		}
		Territory territory = terr.getTerritory(hashMap.get("id"));
		
		if(!hashMap.get("area").equals("")) {
			if(Integer.parseInt(hashMap.get("area")) > 0)
				territory.setArea(Integer.parseInt(hashMap.get("area")));
		}
		if(!hashMap.get("population").equals("")) {
			if(Integer.parseInt(hashMap.get("population")) > 0)
				territory.setPopulation(Integer.parseInt(hashMap.get("population")));
		}
		if(!hashMap.get("name").equals("")) {
			if(terr.territoryExists(hashMap.get("name")))
				return false;
			else
				territory.setName(hashMap.get("name"));
		}

		terr.addTerritory(territory);
		Util.writeTerritories(ctx.getRealPath(""), terr);
		return true;
	}

}

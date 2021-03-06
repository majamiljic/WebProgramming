package rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import model.Comment;
import model.EmergencySituation;
import model.EmergencySituations;
import model.Territories;
import model.Territory;
import model.User;
import model.Users;
import util.Util;

@Path("/situations")
public class SituationController {
	
	@Context
	ServletContext ctx;

	@GET
	@Path("/getSituations")
	@Produces(MediaType.APPLICATION_JSON)
	public EmergencySituations getSituations(@Context HttpServletRequest request) {
		EmergencySituations sit = (EmergencySituations) ctx.getAttribute("situations");
		if (sit == null) {
			sit = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", sit);
		}
		return (EmergencySituations) ctx.getAttribute("situations");
	}

	@POST
	@Path("/registerSituation")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public boolean addSituation(@Context HttpServletRequest request, HashMap<String, String> hashMap) {
		Territories terr = (Territories) ctx.getAttribute("territories");
		Territory territory = terr.getTerritory(hashMap.get("territory"));
		
		User loggedUser = (User) request.getSession().getAttribute("user");
		if (loggedUser.getStatus().equals("Blocked"))
			return false;
		
		EmergencySituation situation = new EmergencySituation(
				hashMap.get("name"),
				hashMap.get("district"),
				hashMap.get("description"),
				new Date(),
				hashMap.get("address"),
				territory,
				hashMap.get("emergencyLevel"),
				hashMap.get("name") + ".jpg",
				"Active",
				loggedUser);
		
		addSituation(situation);
		request.getSession().setAttribute("image", situation.getName() + ".jpg");
		return true;
	}
	
	private void addSituation(EmergencySituation situation) {
		EmergencySituations sit = ((EmergencySituations) ctx.getAttribute("situations"));
		if (sit == null) {
			sit = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", sit);
		}
		
		sit.addSituation(situation);
		Util.writeSituations(ctx.getRealPath(""), sit);
	}
	
	@POST
	@Path("/uploadImage")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public void uploadImage(@Context HttpServletRequest request, InputStream is) {
		try {
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
		catch (IOException e) {
			System.out.println("");
		}
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/filterByDate")
	public EmergencySituations filterByDate(@Context HttpServletRequest request, String date) {
		String d = date.replaceAll("[\"-]", "");
		
		int day = Integer.parseInt(d.substring(6, 8));
		int month = Integer.parseInt(d.substring(4, 6));
		int year = Integer.parseInt(d.substring(0, 4));
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			Calendar cal = Calendar.getInstance();
		    cal.setTime(sit.getDate());
		    int y = cal.get(Calendar.YEAR);
		    int m = cal.get(Calendar.MONTH)+1;
		    int dd = cal.get(Calendar.DAY_OF_MONTH);
			if (day == dd && month == m && year == y)
				filtered.addSituation(sit);
		}
		return filtered;
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/filterByTerritory")
	public EmergencySituations filterByTerritory(@Context HttpServletRequest request, String territory) {
		String t = territory.substring(1, territory.length() - 1);	// Uklanjanje navodnika
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			if (sit.getTerritory().getName().equals(t))
				filtered.addSituation(sit);
		}
		return filtered;
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/filterByEmergencyLevel")
	public EmergencySituations filterByEmergencyLevel(@Context HttpServletRequest request, String emLevel) {
		String emL = emLevel.substring(1, emLevel.length() - 1);
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			if (sit.getEmergencyLevel().equals(emL))
				filtered.addSituation(sit);
		}
		return filtered;
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/filterByNoVolunteer")
	public EmergencySituations filterByNoVolunteer(@Context HttpServletRequest request, String emLevel) {
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			if (sit.getVolunteer() == null)
				filtered.addSituation(sit);
		}
		
		return filtered;
	}
	
	@PUT
	@Path("/{id}/archive")
	public void archiveSituation(@Context HttpServletRequest request, @PathParam("id") String id) {
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituation es = s.getSituation(id);
		es.setStatus("Archived");
		Util.writeSituations(ctx.getRealPath(""), s);
	}
	
	@PUT
	@Path("/{id}/activate")
	public void activateSituation(@Context HttpServletRequest request, @PathParam("id") String id) {
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituation es = s.getSituation(id);
		es.setStatus("Active");
		Util.writeSituations(ctx.getRealPath(""), s);
	}
	
	@GET
	@Path("/{id}/getVolunteers")
	@Produces(MediaType.APPLICATION_JSON)
	public Users getVolunteers(@Context HttpServletRequest request, @PathParam("id") String id) {
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituation es = s.getSituation(id);
		
		Users retVal = new Users();
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			users = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", users);
		}
		for(User u : users.getUsers().values()) {
			if(!u.getUsername().equals("majami")
					&& es.getTerritory().getId().equals(u.getTerritory().getId())
						&& u.getStatus().equals("Active"))
				retVal.addUser(u);
		}

		return retVal;
	}
	
	@PUT
	@Path("/{sitId}/setVolunteer/{userId}")
	public void setVolunteer(@Context HttpServletRequest request,
			@PathParam("sitId") String sitId, @PathParam("userId") String userId) {
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			users = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", users);
		}
		
		User u = users.getUser(userId);
		EmergencySituation es = s.getSituation(sitId);
		es.setVolunteer(u);
		Util.writeSituations(ctx.getRealPath(""), s);
	}
	
	@POST
	@Path("/submitComment")
	@Consumes(MediaType.APPLICATION_JSON)
	public void submitComment(@Context HttpServletRequest request, HashMap<String, String> hashMap) {
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		EmergencySituation es = s.getSituation(hashMap.get("sitId"));

		Users users = (Users) ctx.getAttribute("users");
		if(users == null) {
			users = Util.readUsers(ctx.getRealPath(""));
			ctx.setAttribute("users", users);
		}
		User user = users.getUser(hashMap.get("usersId"));
		
		Comment comment = new Comment();
		comment.setText(hashMap.get("text"));
		comment.setUser(user);
		comment.setDate(new Date());
		
		es.addComment(comment);
		
		Util.writeSituations(ctx.getRealPath(""), s);
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/searchByTerritoryName")
	public EmergencySituations searchByTerritoryName(@Context HttpServletRequest request, String param) {
		String searchParam = param.substring(1, param.length() - 1);
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			if (sit.getTerritory().getName().toLowerCase().contains(searchParam.toLowerCase()))
				filtered.addSituation(sit);
		}
		
		return filtered;
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/searchByDistrict")
	public EmergencySituations searchByDistrict(@Context HttpServletRequest request, String param) {
		String searchParam = param.substring(1, param.length() - 1);
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			if (sit.getDistrict().toLowerCase().contains(searchParam.toLowerCase()))
				filtered.addSituation(sit);
		}
		
		return filtered;
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/searchByDescription")
	public EmergencySituations searchByDescription(@Context HttpServletRequest request, String param) {
		String searchParam = param.substring(1, param.length() - 1);
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			if (sit.getDescription().toLowerCase().contains(searchParam.toLowerCase()))
				filtered.addSituation(sit);
		}

		return filtered;
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/searchByVolunteer")
	public EmergencySituations searchByVolunteer(@Context HttpServletRequest request, String param) {
		String searchParam = param.substring(1, param.length() - 1);
		
		EmergencySituations s = (EmergencySituations) ctx.getAttribute("situations");
		if (s == null) {
			s = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", s);
		}
		
		EmergencySituations filtered = new EmergencySituations();
		for (EmergencySituation sit : s.getSituations().values()) {
			if (sit.getVolunteer().getUsername().toLowerCase().contains(searchParam.toLowerCase())
					|| sit.getVolunteer().getName().toLowerCase().contains(searchParam.toLowerCase())
					|| sit.getVolunteer().getSurname().toLowerCase().contains(searchParam.toLowerCase())
					|| sit.getVolunteer().getEmail().toLowerCase().contains(searchParam.toLowerCase()))
				filtered.addSituation(sit);
		}

		return filtered;
	}

}

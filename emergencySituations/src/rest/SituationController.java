package rest;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import model.EmergencySituations;
import util.Util;

@Path("/situations")
public class SituationController {
	
	@Context
	ServletContext ctx;

	@GET
	@Path("/getSituations")
	@Produces(MediaType.APPLICATION_JSON)
	public EmergencySituations getSituations(@Context HttpServletRequest request)
	{
		EmergencySituations sit = (EmergencySituations) ctx.getAttribute("situations");
		if (sit == null) {
			sit = Util.readSituations(ctx.getRealPath(""));
			ctx.setAttribute("situations", sit);
		}
		return (EmergencySituations) ctx.getAttribute("situations");
	}

}

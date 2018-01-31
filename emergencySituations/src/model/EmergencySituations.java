package model;

import java.util.HashMap;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect
public class EmergencySituations {
	private HashMap<String, EmergencySituation> situations;

	public EmergencySituations() {
		super();
		this.situations = new HashMap<String, EmergencySituation>();
	}

	public EmergencySituations(HashMap<String, EmergencySituation> situations) {
		super();
		this.situations = situations;
	}

	public HashMap<String, EmergencySituation> getSituations() {
		return situations;
	}

	public void setSituations(HashMap<String, EmergencySituation> situations) {
		this.situations = situations;
	}
	
	public void addSituation(EmergencySituation situation) {
		if(situation.getId() == null)
			situation.setId(UUID.randomUUID().toString());
		if(situation.getComments() == null)
			situation.setComments(new HashMap<String, Comment>());
		this.situations.put(situation.getId(), situation);
	}
	
	public EmergencySituation getSituation(String situationId) {
		return this.situations.get(situationId);
	}

	@Override
	public String toString() {
		return "EmergencySituations [situations=" + situations + "]";
	}
	
}

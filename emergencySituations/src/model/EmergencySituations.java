package model;

import java.util.HashMap;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect
public class EmergencySituations {
	private HashMap<String, EmergencySituation> situations;

	public EmergencySituations() {
		super();
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
		situation.setId(UUID.randomUUID().toString());
		this.situations.put(situation.getId(), situation);
	}
	
	public void removeSituation(EmergencySituation situation) {
		this.situations.remove(situation.getId());
	}
	
	public EmergencySituation getSituation(String situationId) {
		return this.situations.get(situationId);
	}

	public void removeSituation(String situationId) {
		this.situations.remove(situationId);
	}

	@Override
	public String toString() {
		return "EmergencySituations [situations=" + situations + "]";
	}
	
}

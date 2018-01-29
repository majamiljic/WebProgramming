package model;

import java.util.Collection;
import java.util.HashMap;
import java.util.UUID;

public class Territories {
	private HashMap<String, Territory> territories;

	public Territories() {
		super();
		this.territories = new HashMap<String, Territory>();
	}

	public Territories(HashMap<String, Territory> territories) {
		super();
		this.territories = territories;
	}
	
	public Territories(Territories terr) {
		this.territories = terr.territories;
	}

	public HashMap<String, Territory> getTerritories() {
		return territories;
	}

	public void setTerritories(HashMap<String, Territory> territories) {
		this.territories = territories;
	}
	
	public void addTerritory(Territory territory) {
		if(territory.getId() == null)
			territory.setId(UUID.randomUUID().toString());
		this.territories.put(territory.getId(), territory);
	}
	
	public void removeTerritory(Territory territory) {
		this.territories.remove(territory.getId());
	}
	
	public Territory getTerritory(String territoryId) {
		return this.territories.get(territoryId);
	}

	public void removeTerritory(String territoryId) {
		this.territories.remove(territoryId);
	}

	public boolean territoryExists(String name) {
		Collection<Territory> t;
		t = territories.values();
		for (Territory territory : t) {
			if(territory.getName().equalsIgnoreCase(name))
				return true;
			else
				return false;
		}
		return false;
	}

	@Override
	public String toString() {
		return "Territories [territories=" + territories + "]";
	}
	
}

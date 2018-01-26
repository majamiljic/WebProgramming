package model;

import java.util.HashMap;

public class Territories {
	private HashMap<String, Territory> territories;

	public Territories() {
		super();
	}

	public Territories(HashMap<String, Territory> territories) {
		super();
		this.territories = territories;
	}

	public HashMap<String, Territory> getTerritories() {
		return territories;
	}

	public void setTerritories(HashMap<String, Territory> territories) {
		this.territories = territories;
	}
	
	public void addTerritory(Territory territory) {
		this.territories.put(territory.getName(), territory);
	}
	
	public void removeTerritory(Territory territory) {
		this.territories.remove(territory.getName());
	}
	
	public Territory getTerritory(String territoryId) {
		return this.territories.get(territoryId);
	}

	public void removeTerritory(String territoryId) {
		this.territories.remove(territoryId);
	}

	@Override
	public String toString() {
		return "Territories [territories=" + territories + "]";
	}
	
}

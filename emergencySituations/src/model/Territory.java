package model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect
public class Territory {
	private String id;
	private String name;
	private int area;
	private int population;
	
	public Territory() {
		super();
	}

	public Territory(String name, int area, int population) {
		super();
		this.name = name;
		this.area = area;
		this.population = population;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getArea() {
		return area;
	}

	public void setArea(int area) {
		this.area = area;
	}

	public int getPopulation() {
		return population;
	}

	public void setPopulation(int population) {
		this.population = population;
	}

	@Override
	public String toString() {
		return "Territory [id=" + id + ", name=" + name + ", area=" + area + ", population=" + population + "]";
	}
}

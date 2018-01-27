package model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect
public class EmergencySituation {
	private String id;
	private String name;
	private String district;
	private String description;
	private Date date;
	private String address;
	private Territory territory;
	private String emergencyLevel;		// Red, Orange, Blue
	private String image;
	private String status;				// Active, Archived
	private User volunteer;
	private User user;
	
	public EmergencySituation() {
		super();
	}

	public EmergencySituation(String name, String district, String description, Date date, String address,
			Territory territory, String emergencyLevel, String image, String status, User user) {
		super();
		this.name = name;
		this.district = district;
		this.description = description;
		this.date = date;
		this.address = address;
		this.territory = territory;
		this.emergencyLevel = emergencyLevel;
		this.image = image;
		this.status = status;
		this.user = user;
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

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Territory getTerritory() {
		return territory;
	}

	public void setTerritory(Territory territory) {
		this.territory = territory;
	}

	public String getEmergencyLevel() {
		return emergencyLevel;
	}

	public void setEmergencyLevel(String emergencyLevel) {
		this.emergencyLevel = emergencyLevel;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public User getVolunteer() {
		return volunteer;
	}

	public void setVolunteer(User volunteer) {
		this.volunteer = volunteer;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Override
	public String toString() {
		return "EmergencySituation [id=" + id + ", name=" + name + ", district=" + district + ", description=" + description
				+ ", date=" + date + ", address=" + address + ", territory=" + territory + ", emergencyLevel="
				+ emergencyLevel + ", image=" + image + ", status=" + status + ", volunteer=" + volunteer + ", user=" + user + "]";
	}
}

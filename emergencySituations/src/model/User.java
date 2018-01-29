package model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect
public class User {
	private String username;
	private String password;
	private String name;
	private String surname;
	private String phoneNumber;
	private String email;
	private Territory territory;
	private String status;		// Active, Blocked
	private String image;
	
	public User() {
		super();
	}

	public User(String username, String password, String name, String surname, String phoneNumber, String email,
			Territory territory, String status, String image) {
		super();
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.territory = territory;
		this.status = status;
		this.image = image;
	}
	
	public User(User u)	{
		this.username = u.getUsername();
		//this.password = "";
		this.password = u.getPassword();
		this.name = u.getName();
		this.surname = u.getSurname();
		this.phoneNumber = u.getPhoneNumber();
		this.email = u.getEmail();
		this.territory = u.getTerritory();
		this.status = u.getStatus();
		this.image = u.getImage();
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Territory getTerritory() {
		return territory;
	}

	public void setTerritory(Territory territory) {
		this.territory = territory;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + ", name=" + name + ", surname=" + surname
				+ ", phoneNumber=" + phoneNumber + ", email=" + email + ", territory=" + territory + ", status="
				+ status + ", image=" + image + "]";
	}
	
}

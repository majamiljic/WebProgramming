package model;

import java.util.HashMap;

public class Users {
	private HashMap<String, User> users;

	public Users() {
		super();
		this.users = new HashMap<String, User>();
	}

	public Users(HashMap<String, User> users) {
		super();
		this.users = users;
	}

	public HashMap<String, User> getUsers() {
		return users;
	}

	public void setUsers(HashMap<String, User> users) {
		this.users = users;
	}
	
	public void addUser(User user) {
		users.put(user.getUsername(), user);
	}
	
	public void removeUser(User user) {
		users.remove(user.getUsername());
	}

	public boolean usernameExists(String username) {
		return users.get(username) != null;
	}
	
	public User getUser(String username) {
		return users.get(username);
	}

	@Override
	public String toString() {
		return "Users [users=" + users + "]";
	}
	
}

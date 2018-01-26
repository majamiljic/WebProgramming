package model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect
public class Comment {
	private String id;
	private String text;
	private Date date;
	private User user;
	
	public Comment() {
		super();
	}

	public Comment(String text, Date date, User user) {
		super();
		this.text = text;
		this.date = date;
		this.user = user;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Override
	public String toString() {
		return "Comment [id=" + id + ", text=" + text + ", date=" + date + ", user=" + user + "]";
	}
}

package util;

import java.io.File;
import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.EmergencySituations;
import model.Territories;
import model.Users;

public class Util {

	public static EmergencySituations readSituations(String path) {
		ObjectMapper om = new ObjectMapper();
		EmergencySituations sit = null;
		try {
			sit = om.readValue(new File(path + File.separator + "situations.json"), EmergencySituations.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sit;
	}
	
	public static void writeSituations(String path, EmergencySituations situations) {
		ObjectMapper om = new ObjectMapper();
		try {
			om.writeValue(new File(path + File.separator + "situations.json"), situations);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static Territories readTerritories(String path) {
		ObjectMapper om = new ObjectMapper();
		Territories terr = null;
		try {
			terr = om.readValue(new File(path + File.separator + "territories.json"), Territories.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return terr;
	}
	
	public static void writeTerritories(String path, Territories territories) {
		ObjectMapper om = new ObjectMapper();
		try {
			om.writeValue(new File(path + File.separator + "territories.json"), territories);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static Users readUsers(String path) {
		System.out.println(path);
		ObjectMapper om = new ObjectMapper();
		Users users = null;
		try {
			users = om.readValue(new File(path + File.separator + "users.json"), Users.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return users;
	}

	public static void writeUsers(String path, Users users) {
		ObjectMapper om = new ObjectMapper();
		try {
			om.writeValue(new File(path + File.separator + "users.json"), users);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.jpa.GenericModel;

import com.sun.istack.internal.NotNull;

@Entity
public class ViewUserAgeStats extends GenericModel {
	
	/**
	 * 날짜
	 */
	@Id
	@NotNull
	public Timestamp regDate;
	/**
	 * 6세 이하
	 */
	@Id
	@NotNull
	public int age1;
	
	/**
	 * 7 - 12
	 */
	public int age2;
	
	/**
	 * 13 - 15
	 */	
	public int age3;
	
	/**
	 * 16 - 18
	 */
	public int age4;
	
	/**
	 * 19 - 22
	 */
	public int age5;
	
	/**
	 * 23 - 29
	 */
	public int age6;
	
	/**
	 * 30 - 39
	 */
	public int age7;
	
	/**
	 * 40 - 49
	 */
	public int age8;
	
	/**
	 * 50 - 59
	 */
	public int age9;
	
	/**
	 * 60세 이상
	 */
	public int age10;
	
}

package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.sun.istack.internal.NotNull;

import play.db.jpa.GenericModel;

@Entity
public class ViewUserStats extends GenericModel{
	
	/**
	 * 날짜
	 */
	@Id
	@NotNull
	public String regDate;
	
	/**
	 * 가입수
	 */
	public int cnt;

}

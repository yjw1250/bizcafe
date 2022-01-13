package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.sun.istack.internal.NotNull;

import play.db.jpa.GenericModel;

@Entity
public class ViewUserOutStats extends GenericModel {
	
	/**
	 * 날짜 (년-월-일)
	 */
	@Id
	@NotNull
	public String regDate;
	
	/**
	 * 탈퇴수
	 */
	public int cnt;
	

}

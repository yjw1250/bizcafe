package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.sun.istack.internal.NotNull;

import play.db.jpa.GenericModel;

@Entity
public class ViewUserLoginStats extends GenericModel {
	
	/**
	 * 날짜 (년-월-일)
	 */
	@Id
	@NotNull
	public String loginDate;
	
	/**
	 * 로그인 회원수
	 */
	public int cnt;
	

}

package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.jpa.GenericModel;

/**
 * 공통 코드
 * 
 * @author	유재헌
 * @since	2012-02-16
 */
@Entity
public class CodeMst extends GenericModel {
	
	/**
	 * cmcd
	 * 대표 코드값
	 */
	@Id
	public String cmcd;	
	
	/**
	 * 코드 설명
	 */
	@Id
	public String cmnm;
	
	/**
	 * 코드 상세 설명	
	 */
	public String cmDesc;
	
	/**
	 * 등록 일시
	 */
	public Timestamp regDate;
	
	/**
	 * 사용 여부 , 삭제구분
	 */
	public String delYN;
	

}
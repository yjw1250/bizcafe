package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.jpa.GenericModel;

/**
 * 공통 코드
 * 
 * @author	이상준
 * @since	2012-01-27
 */
@Entity
public class CodeDtl extends GenericModel {
	
	/**
	 * cmcd
	 */
	@Id
	public String cmcd;	
	
	/**
	 * cdcd
	 */
	@Id
	public String cdcd;
	
	/**
	 * 코드값	
	 */
	public String cdnm;
	
	/**
	 * 코드 설명
	 */
	public String cdDesc;
	
	/**
	 * 등록 일시
	 */
	public Timestamp regDate;
	
	/**
	 * 사용 여부
	 */
	public String delYN;
	
	/**
	 * 정렬
	 */
//	@Column(name = "sortNo", nullable = true)
	public int sortNo ;// 정렬

}
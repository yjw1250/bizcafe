package models;

import java.sql.Timestamp;

import javax.persistence.Entity;

/**
* 설문지 항목
* @author : yjw1250
* @since : 2012-03-13
* @version : 0.1
* 
*/
@Entity
public class Survey extends JeiModel{

	/**
	 * 설문지번호
	 */
	public int surveyNum; 
	
	/**
	 * 문항번호
	 */
	public int itemNum; 
	
	/**
	 * 문항내용
	 */
	public String itemTitle;
	
	/**
	 * 사용여부
	 */
	public String  delYN;
	  
	/**
	 * 정렬순서
	 */
	public int itemSort;

	/**
	 * 등록일
	 */
	public Timestamp regDate;
}
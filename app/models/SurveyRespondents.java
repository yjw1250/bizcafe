package models;

import java.sql.Timestamp;

import javax.persistence.Entity;

/**
* 설문참여내역
* @author : yjw1250
* @since : 2012-03-13
* @version : 0.1
* 
*/
@Entity
public class SurveyRespondents extends JeiModel{

	/**
	 * 설문지
	 */
	public int surveyIdx;
	
	/**
	 * 설문지번호
	 */
	public int surveyNum;
	
	/**
	 * 문항번호
	 */
	public int itemNum;
	
	/**
	 * 설문답(만족,불만)
	 */
	public String answer;
	 
	/**
	 * 기타의견
	 */
	public String etcComment;
	
	/**
	 * 예약번호
	 */
	public String resIdx;
	
	/**
	 * 설문 참여자 ID
	 */
	public String regID;
	
	/**
	 * 설문참여자이름
	 */
	
	public String regName;
	
	/**
	 * 설문참여일
	 */
	public Timestamp regDate;
}

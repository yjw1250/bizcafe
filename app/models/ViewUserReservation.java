package models;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.sun.istack.internal.NotNull;

import play.db.jpa.GenericModel;

/**
* 관리자 회원 리스트 모델 
* 
* @author yujaeheon
* @since : 2012-02-29
* @version : 1.0
* 
*/
@Entity
public class ViewUserReservation  extends GenericModel{

	/**
	 * 회원 아이디
	 */
	@Id
	@NotNull
	public String userID;
	
	/**
	 * 회원 이름
	 */	
	public String userName;
	
	/**
	 * 휴대폰 번호
	 */
	public String phone;
	
	/**
	 * 이메일
	 */
	public String email;
	
	/**
	 * 우편번호 앞자리
	 */
	public String zip1;
	
	/**
	 * 우편번호 뒷자리
	 */
	public String zip2;
	
	/**
	 * 주소
	 */
	public String addr1;
	
	/** 
	 * 나머지 주소
	 */
	public String addr2;
	
	/**
	 * 가입일시
	 */
	public Timestamp regDate;
	
	/**
	 * 비즈니스 공간 사용 수
	 */
	public int resBzCnt;
	
	/**
	 * 소호 사무실 사용 수 
	 */
	public int resOfCnt;
	
	/**
	 * 총 사용수
	 */
	public int resCnt;
	
	public String getRegDate(){
		SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd"); 
		String textDate=dateTimeFormat.format(regDate);
		return textDate;
	}
	
}

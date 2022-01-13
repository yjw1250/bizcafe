package models;

import java.sql.Timestamp;

import javax.persistence.Entity;

/**
* SMS 발송 
* @author : yjw1250
* @since : 2012-02-20
* @version : 0.1
* 
*/
@Entity
public class SendSMS extends JeiModel{
	
	/**
	 * 발송일(YYYY-MM-DD)
	 */
	public String sendDate;
	
	/**
	 * 발송구분(1:회원가입인증,2:예약인증,3:예약완료알림)
	 */
	public String sendFlag;
	
	/**
	 * 수신자 회원ID
	 */
	public String recID;
	
	/**
	 * 수신자 이름
	 */
	public String recName;
	
	/**
	 * 수신번호
	 */
	public String recPhone;
	
	/**
	 * 인증번호
	 */
	public String certifyNo;
	
	/**
	 * 발송메시지
	 */
	public String sendMsg;
	
	/**
	 * 발송일 
	 */
	public Timestamp regDate;

}

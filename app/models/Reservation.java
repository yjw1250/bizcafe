package models;

import javax.persistence.Entity;

import java.sql.Date;
import java.sql.Timestamp;

/**
* 예약 등록,수정
* @author : yjw1250
* @since : 2012-02-20
* @version : 0.1
* 
*/
@Entity
public class Reservation extends JeiModel{
	
	/**
	 * 예약구분(BZ:비즈니스룸,OF:소호룸)
	 */
	public String resType;
	
	/**
	 * 이용부스 정보(코드)
	 */
	public String resRoom;
	
	/**
	 * 예약일
	 */
	public String resDate;
	
	/**
	 * 시작시간
	 */
	public String resStartHour;
	
	/**
	 * 종료시간
	 */
	public String resEndHour;
	
	/**
	 * 인원수
	 */
	public int resPerson;
	
	/**
	 * 이용금액
	 */
	public int payment;
	
	/**
	 * 상태(0:예약중,1:예약완료,9:취소) - 코드 테이블 연동
	 */
	public String stateCD;
	
	/**
	 * 소호룸 예약개월수
	 */
	public int resMonthNum;
	
	/**
	 * 소호룸 예치금 완납유무(Y:완납,N:미납) :Default = N
	 */
	public String resBalance;
	
	/**
	 * 예약자 연락처
	 */
	public String resPhone;
	
	/**
	 * 예약자 아이디
	 */
	public String resUserID;
	
	/**
	 * 예약자 이름
	 */
	public String resUserName;
	
	/**
	 * 예약번호(유니크한 코드생성(조회용))
	 */
	public String resIdx;
	
	/**
	 * 신청일시
	 */
	public Timestamp regDate;
	
	/**
	 * 신청자 아이디
	 */
	public String regID;
	
	/**
	 * 수정일자
	 */
	public Timestamp updDate;
	
	/**
	 * 수정자 아이디
	 */
	public String updID;
	
	/**
	 * 승인일자
	 */
	public Timestamp confirmDate;
	
	/**
	 * 승인자 아이디
	 */
	public String confirmID;
	
	/**
	 * 관리자 메모
	 */
	public String memo;
	
	
}

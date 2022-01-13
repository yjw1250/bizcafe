package models;

import javax.persistence.Entity;

import java.sql.Date;
import java.sql.Timestamp;

/**
* 예약 조회
* @author : yjw1250
* @since : 2012-02-20
* @version : 0.1
* 
*/
@Entity
public class ViewReservation extends JeiModel {
	
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
	 * 종료일(소호사무실용)
	 */
	public String resEndDate;
	
	/**
	 * 인원수
	 */
	public String resPerson;
	
	/**
	 * 이용금액
	 */
	public String payment;
	
	/**
	 * 상태(0:예약중,1:예약완료,9:취소) - 코드 테이블 연동
	 */
	public String stateCD;
	
	/**
	 * 상태명
	 */
	public String stateName;
	
	/**
	 * 소호룸 예약개월수
	 */
	public String resMonthNum;
	
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
	 * 예약자 이메일
	 */
	public String resEmail;
	
	
	/**
	 * 예약자 이름(감춤처리)
	 */
	public String resSecretUserName;
	
	/**
	 * 예약번호(유니크한 코드생성(조회용))
	 */
	public String resIdx;
	
	/**
	 * 신청일
	 */
	public String regDate;
	
	/**
	 * 신청일시
	 */
	public String regDatetime;
	
	/**
	 * 신청자 아이디
	 */
	public String regID;
	
	/**
	 * 수정일자
	 */
	public String updDate;
	
	/**
	 * 수정자 아이디
	 */
	public String updID;
	
	/**
	 * 승인일자
	 */
	public String confirmDate;
	
	/**
	 * 승인자 아이디
	 */
	public String confirmID;
	
	/**
	 * 관리자 메모
	 */
	public String memo;
	
	/**
	 * 비즈룸(1:현재일보다 이전일,0:현재일 이후)
	 */
	public String BizState;
	
	/**
	 * 소호룸(1:현재일보다 이전일,0:현재일 이후)
	 */
	public String SohoState;
}

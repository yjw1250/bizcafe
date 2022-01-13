package models;

import javax.persistence.Entity;

import java.sql.Date;
import java.sql.Timestamp;

/**
* 예약 룸 정보
* @author : yjw1250
* @since : 2012-02-24
* @version : 0.1
* 
*/
@Entity
public class ReservationRoom extends JeiModel {
	
	 /**
	  * 예약번호
	  */
	  public String resIdx;
	  
	  /**
	   * 예약일
	   */
	  public String resDate; 
	  
	  /**
	   * 이용부스 (코드관리)
	   */
	  public String resRoomCode; 
	  
	  /*
	   * 사용시간 (00시 0타임, 타임 = 1: 00~29분, 2: 30~59분)
	   */
	  public String resTime;
	  /**
	   * 신청일시
	   */
	  public Timestamp regDate ;
}

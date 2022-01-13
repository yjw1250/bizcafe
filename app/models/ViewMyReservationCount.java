package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import play.db.jpa.GenericModel;

import com.sun.istack.internal.NotNull;


/**
 * 메인의 나의 예약 내역 건수
 * @author babyyh
 * @since	2012-03-14
 */
@Entity
public class ViewMyReservationCount extends GenericModel{

	@Id
    @NotNull
    
	/**
	 * 예약자 ID	
	 */    
	public String resUserID; 

	/**
	 * 비즈니스 미팅공간 예약건수
	 */ 
	public int resBzCnt; 
	
	/**
	 * 소호 사무실 예약건수
	 */ 	
	public int resOfCnt; 

	/**
	 * (비즈니스 미팅공간+소호 사무실) 예약건수
	 */ 	
	public int resCnt; 
	
}

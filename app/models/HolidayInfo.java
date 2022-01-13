package models;

import java.sql.Date;

import javax.persistence.Entity;


/**
 * 휴일정보
 * 
 * @author	유정운
 * @since	2012-02-21
 */
@Entity
public class HolidayInfo extends JeiModel{
	
	/**
	 * 공휴일(YYYY-MM-DD)
	 */
	public String holiday;
	
	/**
	 * 공휴일이름
	 */
	public String holidayName;
}

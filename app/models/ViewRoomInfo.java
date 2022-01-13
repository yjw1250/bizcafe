package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.jpa.GenericModel;

/**
 * 룸정보 조회용
 * 
 * @author	유정운
 * @since	2012-02-17
 */
@Entity
public class ViewRoomInfo extends GenericModel {
	
	/**
	 * 부스코드
	 */
	@Id
	public String roomCode;
	
	/**
	 * 부스이름
	 */
	public String roomName;
	
	/**
	 * 최소인원
	 */
	public int minPerson;
	
	/**
	 * 최대인원
	 */
	public int maxPerson;
	
	/**
	 * 예약단위
	 */
	public int unit;
	
	/**
	 * 단위명
	 */
	public String unitName;
	
	/**
	 * 예약단위당 요금
	 */
	public int unitCost;
	
	
	/**
	 * 30분당 요금
	 */
	public int unitCostEtc;
	
	/**
	 * 부스코드1(항목)
	 */
	public String roomCode01;
	
	/**
	 * 부스코드2(공간타입)
	 */
	public String roomCode02;
	
	/**
	 * 부스코드3(묶음단위 인원)
	 */
	public String roomCode03;
	
	/**
	 * 부스코드4(방번호)
	 */
	public String roomCode04;
	
	
	/**
	 * 부스코드1 항목 이름
	 */
	public String roomName01;
	
	/**
	 * 부스코드2 공간타입 이름
	 */
	public String roomName02;
	
	/**
	 * 부스코드3 (묶음단위 인원) 이름
	 */
	public String roomName03;
	
	/**
	 * 부스코드4 방이름
	 */
	public String roomName04;
	
	
	/**
	 * 부스코드4 방이름(메인에서 사용)
	 */
	public String roomName04etc;
	
}
package controllers.admin;

import static utils.Constants.BLOCK_LIST_COUNT;
import static utils.Constants.BLOCK_PAGE_COUNT;
import static utils.Constants.SITE_NAME;
import static utils.Constants.tmpFilePath;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import javax.persistence.Query;

import jxl.Workbook;
import jxl.format.UnderlineStyle;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

import models.Reservation;
import models.User;
import models.ViewReservation;
import models.ViewRoomInfo;
import models.ViewRoomPerson;
import play.db.jpa.JPA;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.FormMail;
import utils.JeiUtils;
import utils.ReserverUtils;
import utils.Sms;
import utils.validators.LoggedInValidatorUserAdmin;
/**
 * 예약관리자 컨트롤
 * @author 유정운
 * @since 2012-02-28
 */
@With(LoggedInValidatorUserAdmin.class)
public class AdminBooking extends Controller {
	
	
	/**
	 * 회원별 비즈니스 미팅룸 예약 현황 보기 
	 */
	public static void businesslist(){
		String userID = params.get("id");
		User user = User.findById(userID);
		render(user);
	}
	
	/**
	 * 회원별 소호룸 예약 현황 보기 
	 */
	public static void soholist(){
		String userID = params.get("id");
		User user = User.findById(userID);
		render(user);
	}
	
	/**
	 * 비즈니스룸 예약 목록을  회원별로 Json으로 출력한다
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public static void businessUserListJSON(int page, String resUserID) { 
		long totalCount = 0;		
		List<ViewReservation> businessList = null;
		Map<String, Object> jsonData = new HashMap<String, Object>();
		if (page == 0)
    		page = 1;
		
		
		StringBuffer wheres = new StringBuffer(); 
		wheres.append(" resType='BZ' "); 
		
		/*
		 * 회원
		 */
		if(resUserID != null && resUserID.length() >0 ){
				wheres.append(" AND resUserID = '"+ resUserID + "' ");
		}
		else{
				wheres.append(" AND stateCD != '9' ");
		}
		
		wheres.append(" order by idx desc ");
		
		totalCount = ViewReservation.count(wheres.toString()); 
		businessList = ViewReservation.find(wheres.toString()).from(((page - 1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);
		
		int k = businessList.size()-1;
		while(k >= 0){
			if(!businessList.get(k).resRoom.isEmpty()){
				businessList.get(k).resRoom = ReserverUtils.getRoominfo(businessList.get(k).resRoom);
			}
			k--; 
		}
		jsonData.put("page", page);
    	jsonData.put("count", totalCount);
    	jsonData.put("businessList", businessList);    	
    	jsonData.put("listNo", BLOCK_PAGE_COUNT);
    	jsonData.put("result", "200");
		renderJSON(jsonData);
	}
	
	/**
	 * 소호사무실 예약 목록을  회원별로 Json으로 출력한다
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public static void sohoUserListJSON(int page, String resUserID)  { 
		long totalCount = 0;		
		List<ViewReservation> sohoList = null;
		Map<String, Object> jsonData = new HashMap<String, Object>();
		
		if (page == 0)
    		page = 1;

		
		StringBuffer wheres = new StringBuffer(); 
		
		wheres.append(" resType='OF' ");
		/*
		 * 회원
		 */
		if(resUserID != null && resUserID.length() >0 ){
				wheres.append(" AND resUserID = '"+ resUserID + "' ");
		}
		else{
				wheres.append(" AND stateCD != '9' ");
		}
		
		wheres.append(" order by idx desc ");
		totalCount = ViewReservation.count(wheres.toString()); 
		sohoList = ViewReservation.find(wheres.toString()).from(((page - 1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);
		
		int k = sohoList.size()-1;
		while(k >= 0){
			if(!sohoList.get(k).resRoom.isEmpty()){
				sohoList.get(k).resRoom = ReserverUtils.getRoominfo(sohoList.get(k).resRoom);
			}
			k--; 
		}
		jsonData.put("page", page);
    	jsonData.put("count", totalCount);
    	jsonData.put("sohoList", sohoList);    	
    	jsonData.put("listNo", BLOCK_PAGE_COUNT);
    	jsonData.put("result", "200");
		renderJSON(jsonData);
	}
	
	/**
	 *  비즈니스 미팅룸 예약 현황 보기
	 */
	public static void businessstate() {
		render();
	}
	
	
	/**
	 * 소호 사무실 예약 현황 보기 
	 */
	public static void sohostate() {
		render();
	}
	
	/**
	 * 비즈니스 룸 회원 대행 예약 
	 */
	public static void businessmem() {
		String resdate;
		String person;
		resdate = params.get("date");
		person = params.get("person");
		
		// 룸(인원) 정보  선택박스
		ViewRoomPerson resRoom = ViewRoomPerson.find("1=1").first();
		int roommax = resRoom.maxPerson;
		List resRoomList = new ArrayList();
		int i = 1;
		while (i<=roommax){
			resRoomList.add(i);
			i++;
		}
		
		/**
		 * 비회원
		*/
		User user = new User();
		user.phone = "";
		render(resRoomList,resdate,person,user);
	}
	
	/**
	 * 비즈니스 룸 비회원 대행 예약 
	 */
	public static void businessnomem() {
		String resdate;
		String person;
		resdate = params.get("date");
		person = params.get("person");
		
		// 룸(인원) 정보  선택박스
		ViewRoomPerson resRoom = ViewRoomPerson.find("1=1").first();
		int roommax = resRoom.maxPerson;

		List resRoomList = new ArrayList();
		int i = 1;
		while (i<=roommax){
			resRoomList.add(i);
			i++;
		}
		/**
		 * 비회원
		*/
		User user = new User();
		user.phone = "";
		render(resRoomList,resdate,person,user);
	}
	
	
	/**
	 * 소호 사무실 회원 대행 예약 
	 */
	public static void sohomem() {
		List<ViewRoomInfo> roomList  = ViewRoomInfo.find("roomCode01 ='B'").fetch();	
		render(roomList);
	}
	
	
	
	/**
	 * 소호사무실 비회원 대행 예약 
	 */
	public static void sohonomem() {
		List<ViewRoomInfo> roomList  = ViewRoomInfo.find("roomCode01 ='B'").fetch();	
		render(roomList);
	}
	
	
	/**
	 * 소호사무실 예약 
	 */
	public static void soho() {
		render();
	}
	
	/**
	 * 비즈니스룸 정보
	 */
	public static void businessinfo() {
		render();
	}
	
	
	/**
	 * 룸정보
	 */
	public static void roominfoJSON(String roomCode01, int Person){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> RoomList = null;
		RoomList = ViewRoomInfo.find("roomCode01='"+roomCode01+"' and (minPerson = "+Person+" or maxPerson = "+Person+")").fetch();
		jsonData.put("roomlist", RoomList); 
		renderJSON(jsonData);
	}
	
	
	/**
	 * 비즈니스 미팅룸 등록페이지에서 예약내용 가져오기(날짜 조회)
	 * @param resdate : 예약일
	 * @param resIdx : 예약번호
	 */
	public static void reserverJSON(String resdate, String resIdx){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> Reserver = null;
		Reserver = Reservation.find("resType='BZ' And resDate='"+resdate+"' And resIdx != '"+resIdx+"' And stateCD != '9'").fetch();
		Reservation UserReserver = Reservation.find("resType='BZ' And resDate='"+resdate+"' And resIdx = '"+resIdx+"' And stateCD != '9' ").first();
		jsonData.put("reserver", Reserver); 
		jsonData.put("userreserver", UserReserver); 
		renderJSON(jsonData);
	}
	
	/**
	 * 소호룸  등록페이지에서 예약내용 가져오기(년도 조회)
	 * @param resdate
	 */
	public static void sohoreserverJSON(String resyear){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> Reserver = null;
		Reserver = Reservation.find(" substring(resDate,1,4) = '"+resyear+"' And resType='OF' And stateCD != '9'").fetch();
		jsonData.put("reserver", Reserver); 
		renderJSON(jsonData);
	}
	

	/**
	 * 룸정보(인원별로)
	 * @param roomCode01
	 * @param Person
	 */
	public static void businessroominfoJSON(String roomCode01, int Person) {
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> RoomList = null;
		if(Person >= 1){
			RoomList = ViewRoomInfo.find("roomCode01='"+roomCode01+"' and (minPerson = "+Person+" or maxPerson = "+Person+")").fetch();
		}
		else{
			RoomList = ViewRoomInfo.find("roomCode01='"+roomCode01+"'").fetch();
		}
		jsonData.put("roomlist", RoomList); 
		renderJSON(jsonData);
	}
	
	
	/**
	 * 룸정보(전체 현황)
	 * @param roomCode01
	 */
	public static void businessallinfoJSON(String roomCode01) {
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> RoomList = null;
		RoomList = ViewRoomInfo.find("roomCode01='"+roomCode01+"' Order by minPerson, roomName04").fetch();
		jsonData.put("roomlist", RoomList); 
		renderJSON(jsonData);
	}
	
	/**
	 * 비즈니스룸 예약 정보 가져오기
	 * @param resdate
	 */
	public static void businessreserverJSON(String resdate) {
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> Reserver = null;
		Reserver = Reservation.find("resType='BZ' And resDate='"+resdate+"' And stateCD != '9'").fetch();
		jsonData.put("reserver", Reserver); 
		renderJSON(jsonData);
	}
	
	
	/**
	 * 예약 목록을 Json으로 출력한다
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public static void businessListJSON(int page,  String resType, String stateCD) { 
		long totalCount = 0;		
		List<ViewReservation> businessList = null;
		Map<String, Object> jsonData = new HashMap<String, Object>();
		if (page == 0)
    		page = 1;
		
		StringBuffer wheres = new StringBuffer(); 
		
		wheres.append(" 1=1 ");
		/*
		 * 예약종류(BZ:비즈니스,OF:소호)
		 */
		if(resType != null && resType.length() >0 ){
				wheres.append(" AND resType = '"+ resType + "' ");
		}
		else{
				wheres.append(" AND stateCD != '9' ");
		}

		/*
		 * 상태
		 */
		if(stateCD != null && stateCD.length() >0 ){
				wheres.append(" AND stateCD = '"+ stateCD + "' ");
		}
		wheres.append(" order by idx desc ");
		totalCount = ViewReservation.count(wheres.toString()); 
		businessList = ViewReservation.find(wheres.toString()).from(((page - 1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);
		
		int k = businessList.size()-1;
		while(k >= 0){
			if(!businessList.get(k).resRoom.isEmpty()){
				businessList.get(k).resRoom = ReserverUtils.getRoominfo(businessList.get(k).resRoom);
			}
			k--;
		}
		jsonData.put("page", page);
    	jsonData.put("count", totalCount);
    	jsonData.put("businessList", businessList);    	
    	jsonData.put("stateCD", stateCD);
    	jsonData.put("listNo", BLOCK_PAGE_COUNT);
    	jsonData.put("result", "200");
		renderJSON(jsonData);
	}
	
	/**
	 * 비즈니스 예약 정보 보기 페이지
	 */
	public static void businessdetail(){
		String idx = params.get("id");
		ViewReservation Reserver = ViewReservation.find("idx='"+idx+"'").first();
		long resIdxCount;
		resIdxCount = Reservation.count("idx='"+idx+"'");
		if(resIdxCount <= 0){
			renderText("존재하지 않는 예약 정보입니다.");
			return;
		}
		
		ViewRoomPerson resRoom = ViewRoomPerson.find("1=1").first();
		int roommax = resRoom.maxPerson;
		List resRoomList = new ArrayList();
		int i = 1;
		while(i<=roommax){
			resRoomList.add(i);
			i++;
		}
		render(Reserver,resRoomList);
		
	}
	
	/**
	 * 소호 사무실 정보 보기 페이지
	 */
	public static void sohodetail(){
		String idx = params.get("id");
		ViewReservation Reserver = ViewReservation.find("idx='"+idx+"'").first();
		long resIdxCount;
		resIdxCount = Reservation.count("idx='"+idx+"'");
		if(resIdxCount <= 0){
			renderText("존재하지 않는 예약 정보입니다.");
			return;
		}
		// 룸(인원) 정보  선택박스
		List<ViewRoomInfo> roomList  = ViewRoomInfo.find("roomCode01 ='B'").fetch();	
		render(Reserver,roomList);
		
	}
    
	public static void businessholidayJSON() {
		render();
	}
		
	/**
	 * 비즈니스룸 예약완료 확인 페이지 
	 */
	public static void complete(){
		JeiUtils utils = new JeiUtils();
		String resIdx = params.get("id");
		ViewReservation Reserver = ViewReservation.find("resIdx='"+resIdx+"'").first();
		long resIdxCount;
		resIdxCount = Reservation.count("resIdx='"+resIdx+"'");
		if(resIdxCount <= 0){
			renderText("존재하지 않는 예약 정보입니다.");
		}
		
		List roomlists = ReserverUtils.getListRoominfo(Reserver.resRoom); 

		String[] StartHour = Reserver.resStartHour.split(":");
		String[] EndHour = Reserver.resEndHour.split(":");

		Reserver.regDate = utils.getformatdate(Reserver.regDate,"yyyy년 MM월 dd일");
		Reserver.resDate = utils.getformatdate(Reserver.resDate,"yyyy년 MM월 dd일");
		Reserver.resStartHour = StartHour[0] + "시" + StartHour[1] + "분";
		Reserver.resEndHour = EndHour[0] + "시" + EndHour[1] + "분";
		render(Reserver,roomlists);
		
	}
	
	/**
	 * 소호 사무실 예약완료 확인 페이지
	 */
	public static void sohocomplete(){
		JeiUtils utils = new JeiUtils();
		String resIdx = params.get("id");
		ViewReservation Reserver = ViewReservation.find("resIdx='"+resIdx+"'").first();
		long resIdxCount;
		resIdxCount = Reservation.count("resIdx='"+resIdx+"'");
		if(resIdxCount <= 0){
			renderText("존재하지 않는 예약 정보입니다.");
			return;
		}
		List roomlists = ReserverUtils.getListRoominfo(Reserver.resRoom); 
		Reserver.regDate = utils.getformatdate(Reserver.regDate,"yyyy년 MM월 dd일");
		Reserver.resDate = utils.getformatdate(Reserver.resDate,"yyyy년 MM월 dd일");
		render(Reserver,roomlists);
	}
	
	/**
	 * 예약승인
	 * @param reservation
	 */
	
	public static void businessroomauthJSON(Reservation reservation){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		Date date = new Date();
		Cookies cookie = new Cookies();
		 
		reservation.confirmID = cookie.getCookie("BZ_ADMINUID");
		reservation.updDate = new Timestamp(date.getTime());
		reservation.confirmDate = new Timestamp(date.getTime());
		reservation.resBalance = "Y";
		reservation.stateCD = "2";
		reservation.save();
		jsonData.put("result", "200"); 
		renderJSON(jsonData);
	}
	
	/**
	 * 예약취소
	 * @param reservation
	 */
	public static void businessroomcancelJSON(Reservation reservation){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		Date date = new Date();
		Cookies cookie = new Cookies();
		//reservation.resRoom = "";
		reservation.updID = cookie.getCookie("BZ_ADMINUID");
		reservation.updDate = new Timestamp(date.getTime());
		reservation.stateCD = "9";
		reservation.save();
		//ReservationRoom.delete(" resIdx = '"+reservation.resIdx+"' ");
		jsonData.put("result", "200"); 
		renderJSON(jsonData);
	}
	
	
	/**
	 * 이용완료
	 * @param reservation
	 */
	public static void businessroomconfirmJSON(Reservation reservation){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		Date date = new Date();
		Cookies cookie = new Cookies();
		reservation.confirmID = cookie.getCookie("BZ_ADMINUID");
		reservation.updDate = new Timestamp(date.getTime());
		reservation.confirmDate = new Timestamp(date.getTime());
		reservation.stateCD = "1";
		reservation.save();
		
		/** 
		 * 이용완료시 폼 메일 발송 (서비스 만족도 조사  포함)
		 */
		ViewReservation Reserver = ViewReservation.find("idx='"+reservation.idx+"'").first();
		/* 회원정보 조회 */
		User user = User.findById(Reserver.resUserID);
		/* 메일 발송 */
		FormMail formMail;
		try {
			formMail = new FormMail();
			formMail.serviceDone(user.email,Reserver.resIdx);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		jsonData.put("result", "200"); 
		renderJSON(jsonData);
	}

	
	/**
	 * 룸예약
	 * @param reservation
	 * @param action
	 */
	public static void businessroomsaveJSON(Reservation reservation,String action){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		Cookies cookie = new Cookies();
		JeiUtils utils = new JeiUtils();		
		String sRegDate = utils.getformatdate(reservation.resDate, "yyyy-MM-dd");
		String resRooms = reservation.resRoom;
		
		StringBuffer wheres = new StringBuffer(); 
		
		if(reservation.resType.equals("BZ")){
			resRooms = resRooms.substring(1, resRooms.length());
			StringTokenizer Roomarray = new StringTokenizer( resRooms, "," );
			int RoomarryCount = Roomarray.countTokens();
			wheres.append(" idx != '"+reservation.idx+"' And stateCD != '9' And resType='BZ' And resDate='"+sRegDate+"' And ( ");
			int i = 1;
			while(Roomarray.hasMoreElements()){
				if(i < RoomarryCount){
					wheres.append(" resRoom like '%"+Roomarray.nextToken()+"%' OR ");
				}
				else{
					wheres.append(" resRoom like '%"+Roomarray.nextToken()+"%'  ");
				}
				i++;
			}
			wheres.append(" ) ");
		}
		else if(reservation.resType.equals("OF")){
			String sStartDate = utils.getformatdate(reservation.resStartHour, "yyyy-MM-dd");
			String sEndDate = utils.getformatdate(reservation.resEndHour, "yyyy-MM-dd");
			wheres.append(" idx != '"+reservation.idx+"' And stateCD != '9' And resType='OF' and resRoom='"+resRooms+"'");
			wheres.append(" and ( '"+sStartDate+"' between resStartHour and resEndHour  ");
			wheres.append(" OR '"+sEndDate+"' between resStartHour and resEndHour ) ");
		}
		
		int Roomchk = (int) Reservation.count(wheres.toString()); 
			
		if(Roomchk >= 1){
			jsonData.put("result", "101");
		}
		else{
			Date date = new Date();
			if(reservation.resType.isEmpty()){
				reservation.resType = "BZ";
			}
			if(action.equals("add")){
				if(reservation.resType.equals("BZ")){
					reservation.resIdx = ReserverUtils.resnumber("B","num",9);
				}
				else if(reservation.resType.equals("OF")){
					reservation.resIdx = ReserverUtils.resnumber("S","num",9);
				}
				reservation.regDate = new Timestamp(date.getTime());
				reservation.regID = cookie.getCookie("BZ_ADMINUID"); 
				reservation.updID = ""; //임시 관리자 아이디 (수정해야함)
				reservation.confirmID = ""; //임시 관리자 아이디 (수정해야함)
			}
			else if(action.equals("update")){
				reservation.updDate = new Timestamp(date.getTime());
				reservation.updID = cookie.getCookie("BZ_ADMINUID");
			}
			reservation.resRoom = resRooms;
			reservation.resDate = sRegDate;
			reservation.resBalance = "N";		
			reservation.stateCD = "0";
			reservation.save();
			
			/* 룸 세부 테이블에 저장 */
			if(reservation.resType.equals("BZ")){
				ReserverUtils.saveResBusinessRoom(sRegDate,reservation.resIdx,resRooms);
			}
			else if(reservation.resType.equals("OF")){
				ReserverUtils.saveResSohoRoom(sRegDate,reservation.resIdx,resRooms);
			}
			
			/* 예약완료 확인 SMS 발송 */
			long lastidx = 0;
			if(action.equals("add")){
				lastidx = reservation.getIdx();
			}
			else if(action.equals("update")){
				lastidx = reservation.idx;
			}
			
			ViewReservation Reserver = ViewReservation.find("idx='"+lastidx+"'").first();
			long resIdxCount;
			resIdxCount = Reservation.count("idx='"+lastidx+"'");
			
			if(resIdxCount >= 1){
				
				String StartString = null;
				String EndString = null;
				String Msg = null;
				
				/* 회원정보 조회 */
				User user = User.findById(reservation.resUserID);
				
				String[] StartHour = Reserver.resStartHour.split(":");
				String[] EndHour = Reserver.resEndHour.split(":");
				StartString = StartHour[0] + "시" + StartHour[1] + "분";
				EndString =  EndHour[0] + "시" + EndHour[1] + "분";
				
				if(reservation.resType.equals("BZ")){
					if(action.equals("add")){
						Msg = Reserver.regDate + "일 " + StartString + "~" +  EndString + " " + SITE_NAME + " 의 예약신청이 접수 되었습니다";
					}
					else if(action.equals("update")){
						Msg = Reserver.regDate + "일 " + StartString + "~" +  EndString + " " + SITE_NAME + " 의 예약신청이 수정 되었습니다";
					}
				}
				else if(reservation.resType.equals("OF")){
					if(action.equals("add")){
						Msg = reservation.resStartHour + "~" + reservation.resEndHour + " " + SITE_NAME + " 의 예약신청이 접수 되었습니다";
					}
					else if(action.equals("update")){
						Msg = reservation.resStartHour + "~" + reservation.resEndHour + " " + SITE_NAME + " 의 예약신청이 수정 되었습니다";
					}
				}
				
				Sms.sendAdminSms(user,"3",Msg);
				
				/* 메일 발송 */
				FormMail formMail;
				try {
					formMail = new FormMail();
					if(reservation.resType.equals("BZ")){
						String resRoom =ReserverUtils.getRoominfo(Reserver.resRoom);
						formMail.bookingBusiness(user.email, Reserver.resIdx,Reserver.regDate, sRegDate, StartString, EndString, Reserver.resPerson,resRoom, Reserver.payment);
					}
					else if(reservation.resType.equals("OF")){
						String resRoom =ReserverUtils.getRoominfo(Reserver.resRoom);
						formMail.bookingSoho(user.email, Reserver.resIdx,Reserver.regDate, sRegDate,Reserver.resMonthNum,Reserver.resPerson,resRoom,Reserver.resPhone);
					}
					
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			jsonData.put("resIdx", reservation.resIdx);
			jsonData.put("result", "200"); 
		}
    	renderJSON(jsonData);
		
	}
	
	/**
	 * 비즈니스룸  현황 가져오기
	 */
	public static void BizRoomState(){
		List<ViewRoomInfo> roomList  = ViewRoomInfo.find("roomCode01 ='A' order by minPerson, roomCode04").fetch();	
		render(roomList);
	}
	
	/**
	 * 소호룸 현황 가져오기
	 */
	public static void SohoRoomState(){
		render();
	}
	
	/**
	 * 비즈니스룸 현황
	 * @param resDate : 선택년월
	 * @param roomCode : 룸코드
	 */
	public static void BizRoomStateJSON(String resDate, String roomCode){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		String Query = " Call BizRoomState('"+resDate+"','"+roomCode+"') ";
		Query query = JPA.em().createNativeQuery(Query);
		List<Object[]>  biz = query.getResultList();   
		List<Object> roomstatus = new ArrayList<Object>();
		int allroom = 0;
		int room1 = 0;
		int room2 = 0;
		int room3 = 0;
		int payment = 0;
		double bookingper = 0;
		double cancelper = 0;
		String[] chars;
		String[] chars2;
		for (Object[] objects : biz) { 
			   Map<String, Object> roomlist = new HashMap<String, Object>();
		       roomlist.put("resDate", objects[0]); 
		       roomlist.put("resRoomCode", objects[1]); 
		       roomlist.put("room1", objects[2]); 
		       roomlist.put("room2", objects[3]); 
		       roomlist.put("room3", objects[4]); 
		       roomlist.put("totalroom", objects[5]); 
		       roomlist.put("bookingper", objects[6]); 
		       roomlist.put("cancelper", objects[7]); 
		       roomlist.put("payment", objects[8]); 
		       
		       /** 
		        * object value 사용하다 발견한 object value의 int형  처리 방법
		        *  String.valueOf(오브텍트 value)로 변환후에 사용가능
		        */ 
		       
		       /**
		        * 전체 통계 페이지 작업을 위한 처리
		        */
		       room1 = room1 + Integer.parseInt(String.valueOf(objects[2]));
		       room2 = room2 + Integer.parseInt(String.valueOf(objects[3]));
		       room3 = room3 + Integer.parseInt(String.valueOf(objects[4]));
		       payment = payment  + Integer.parseInt(String.valueOf(objects[11]));
		       allroom = allroom +  Integer.parseInt(String.valueOf(objects[5]));
		       
		       chars = ((String) objects[9]).split(",");
		       chars2 =  ((String) objects[10]).split(",");
		       List<Object> resuser = new ArrayList<Object>();
		       int i = 0;
		       int charlen = chars.length;
		       while(i < charlen) {
		    	   Map<String, Object> resUserName = new HashMap<String, Object>();
		    	   resUserName.put("username",chars[i]);
		    	   resUserName.put("userid",chars2[i]);
		    	   resuser.add(resUserName);
		    	   i++;
		       }
		       roomlist.put("resuser", resuser); 
		       roomlist.put("userid", objects[10]); 
		       roomstatus.add(roomlist);
		} 
		
		/*
		 * 전체 예약률
		 */
		bookingper = ((room1 + room2) / (double) allroom ) * 100;
		float per1 = Math.round(bookingper*10)/10F;
		
		/*
		 * 전체 취소율
		 */
		cancelper = ( room3 / (double) allroom ) * 100;
		float per2 = Math.round(cancelper*10)/10F;
		jsonData.put("per1",per1);
		jsonData.put("per2",per2);
		jsonData.put("payment",payment);
		jsonData.put("roomstatus", roomstatus);
		jsonData.put("result", "200"); 
		renderJSON(jsonData);
	}
	
	public static void BizRoomEXCEL(String resDate, String roomCode){
		String Query = " Call BizRoomState('"+resDate+"','"+roomCode+"') ";
		Query query = JPA.em().createNativeQuery(Query);
		List<Object[]>  biz = query.getResultList();   
		
		ViewRoomInfo RoomInfo = ViewRoomInfo.find("roomCode ='"+roomCode+"'").first();	
		String RoomNames = RoomInfo.roomName;
		
		WritableWorkbook workbook = null;
		WritableSheet sheet = null;
		File excelFile = new File(tmpFilePath + "/bizroom.xls");
		
		
		try {
			 workbook = Workbook.createWorkbook(excelFile);
			 /* 헤더 타이틀 형식 */
			 WritableCellFormat format_head_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 13, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.BLACK));
			   
			 /* 헤더 메인(제목) 형식 */
			 WritableCellFormat format_main_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 11, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.WHITE));
			 format_main_title.setAlignment(jxl.format.Alignment.CENTRE);
			 format_main_title.setBackground(jxl.format.Colour.GRAY_50);  
			 
			 /* 내용 형식 */
			 WritableCellFormat format_sub = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 10));
			 format_sub.setAlignment(jxl.format.Alignment.CENTRE);
			 
			 workbook.createSheet("bizroom", 0);
			 sheet = workbook.getSheet(0);
			 
			 sheet.setColumnView(0, 10); //sheet의 첫번째 열의 크기를 40으로 설정한다
			 sheet.setColumnView(1, 20); 
			 sheet.setColumnView(2, 20); 
			 sheet.setColumnView(3, 20); 
			 sheet.setColumnView(4, 50); 
			   
			 String excelheader = resDate + " " + RoomNames + " 비즈니스 미팅공간 이용현황";
			   
			 sheet.addCell(new Label(0,0, excelheader,format_head_title));
			 
			 
			 sheet.addCell(new Label(0,1, "일자",format_main_title));
			 sheet.addCell(new Label(1,1,"예약율",format_main_title));
			 sheet.addCell(new Label(2,1,"취소율",format_main_title));
			 sheet.addCell(new Label(3,1,"예상매출액(원)",format_main_title));
			 sheet.addCell(new Label(4,1,"이용자(예약자)",format_main_title));
			 

			 int i=2;
			 for (Object[] objects : biz) { 
				 sheet.addCell(new Label(0, i, String.valueOf(objects[0])));
				 sheet.addCell(new Label(1, i, String.valueOf(objects[6])));
				 sheet.addCell(new Label(2, i, String.valueOf(objects[7])));
				 sheet.addCell(new Label(3, i, String.valueOf(objects[8])));
				 sheet.addCell(new Label(4, i, String.valueOf(objects[9])));
			 i++;      
			 }
			 
			 workbook.write();
			 workbook.close();
			 
			 if (excelFile.exists()) {
				 excelFile.deleteOnExit();
				 renderBinary(excelFile,"bizexcel.xls");
			 } 
			 
			   
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		   
		
	}
	
	/**
	 * 소호룸 예약 현황
	 * @param resDate
	 */
	public static void SohoRoomStateJSON(String resDate){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		String Query = " call SohoRoomState('"+resDate+"') ";
		Query query = JPA.em().createNativeQuery(Query);
		List<Object[]>  folks = query.getResultList();   
		List<Object> roomstatus = new ArrayList<Object>();
		
		
		int resRate = 0;
		int cancelRate = 0;
		double totalresRate = 0;
		double totalcancelRate = 0;
		String[] sohores;
		String[] chars;
		String[] chars2;
		for (Object[] objects : folks) { 
			   Map<String, Object> roomlist = new HashMap<String, Object>();
		       roomlist.put("month", objects[0]); 
		       
		       sohores = String.valueOf(objects[1]).split("-");	
		       
		       resRate = resRate + Integer.parseInt(sohores[1]);
		       cancelRate = cancelRate + Integer.parseInt(sohores[3]);
		       
		       roomlist.put("resrate", sohores[1]);
		       roomlist.put("cancelrate", sohores[3]);
		       
		       chars = ((String) objects[3]).split(",");
		       chars2 =  ((String) objects[4]).split(",");
		       List<Object> resuser = new ArrayList<Object>();
		       
		       int i = 0;
		       int charlen =  chars.length;
		       while(i < charlen) {
		    	   Map<String, Object> resUserName = new HashMap<String, Object>();
		    	   resUserName.put("username",chars[i]);
		    	   resUserName.put("userid",chars2[i]);
		    	   resuser.add(resUserName);
		    	   i++;
		       }
		       roomlist.put("resuser", resuser); 
		       roomstatus.add(roomlist);
		} 
		
		totalresRate = resRate / 12;
		totalcancelRate = cancelRate / 12;
		
		jsonData.put("totalresRate",totalresRate);
		jsonData.put("totalcancelRate",totalcancelRate);
		jsonData.put("roomstatus", roomstatus);
		jsonData.put("result", "200"); 
		renderJSON(jsonData);
	}
	
	public static void SohoRoomEXCEL(String resDate) throws WriteException, IOException{
		String Query = " call SohoRoomState('"+resDate+"') ";
		Query query = JPA.em().createNativeQuery(Query);
		List<Object[]>  folks = query.getResultList();   
		

		WritableWorkbook sohoworkbook = null;
		WritableSheet sohosheet = null;
		File sohoexcelFile = new File(tmpFilePath + "/sohoroom.xls");
		
		 try {
			 sohoworkbook = Workbook.createWorkbook(sohoexcelFile);
			
			/* 헤더 타이틀 형식 */
			 WritableCellFormat format_head_soho_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 13, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.BLACK));
			   
			 /* 헤더 메인(제목) 형식 */
			 WritableCellFormat format_main_soho_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 11, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.WHITE));
			 
			 format_main_soho_title.setAlignment(jxl.format.Alignment.CENTRE);
			 format_main_soho_title.setBackground(jxl.format.Colour.GRAY_50);  
			 
			 /* 내용 형식 */
			 WritableCellFormat format_sub = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 10));
			 format_sub.setAlignment(jxl.format.Alignment.CENTRE);
			 
			 sohoworkbook.createSheet("sohoroom", 0);
			 sohosheet = sohoworkbook.getSheet(0);
			 
			 sohosheet.setColumnView(0, 10); //sheet의 첫번째 열의 크기를 40으로 설정한다
			 sohosheet.setColumnView(1, 20); 
			 sohosheet.setColumnView(2, 20); 
			 sohosheet.setColumnView(3, 50);
			 
			 String excelheader = resDate + " " + " 소호사무실 이용현황";
			   
			 sohosheet.addCell(new Label(0,0, excelheader,format_head_soho_title));
			 
			 sohosheet.addCell(new Label(0,1, "월",format_main_soho_title));
			 sohosheet.addCell(new Label(1,1,"예약율",format_main_soho_title));
			 sohosheet.addCell(new Label(2,1,"취소율",format_main_soho_title));
			 sohosheet.addCell(new Label(3,1,"이용자(예약자)",format_main_soho_title));
			 
			 String[] sohores;
		
			 int i=2;
			 for (Object[] objects :  folks) { 
				 sohosheet.addCell(new Label(0, i, String.valueOf(objects[0])));
				 sohores = String.valueOf(objects[1]).split("-");	
				 sohosheet.addCell(new Label(1, i, sohores[1]+"%"));
				 sohosheet.addCell(new Label(2, i, sohores[3]+"%"));
				 sohosheet.addCell(new Label(3, i, String.valueOf(objects[3])));
				 
			 i++;      
			 }
			 
			 sohoworkbook.write();
			 sohoworkbook.close();
			 
			 if (sohoexcelFile.exists()) {
				 sohoexcelFile.deleteOnExit();
				 renderBinary(sohoexcelFile,"sohoexcel.xls");
			 } 
			 
			 
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 
		 
		
		
	}
	
	/**
	 * 서비스 만족도 페이지
	 * @param resDate
	 */
	public static void service(){
		render();
	}
	
	/**
	 * 서비스 만족도 현황
	 * @param resDate : 선택 년월
 	 * @param prevDate : 이전 년월
	 */
	public static void surveylistJSON(String resDate, String prevDate){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		
		if(resDate == null || resDate.length() < 1){
			jsonData.put("result", "400");
			renderJSON(jsonData);
			return;
		}
		
		String Query = " Call SurveyState('"+resDate+"','"+prevDate+"') ";
		Query query = JPA.em().createNativeQuery(Query);
		List<Object[]>  Survey = query.getResultList(); 
		List<Object> surveylist = new ArrayList<Object>();
		
		long totalScore = 0;
		long GoodCnt = 0;
		long BadCnt = 0;
		long ScoreCnt = 0;
		long PrevScoreCnt;
		for (Object[] objects : Survey) { 
			 Map<String, Object> surveys = new HashMap<String, Object>();
			 surveys.put("itemNum", objects[0]); 
			 surveys.put("itemTitle", objects[1]);
			 surveys.put("itemSort", objects[2]);
			 
			 GoodCnt = (long)Double.parseDouble(String.valueOf(objects[3]));
			 BadCnt = (long)Double.parseDouble(String.valueOf(objects[4]));
			 ScoreCnt = (long)Double.parseDouble(String.valueOf(objects[5]));
			 PrevScoreCnt = (long)Double.parseDouble(String.valueOf(objects[6]));
			 
			 totalScore = totalScore + ScoreCnt;
			 
			 if( GoodCnt >= 1){
				 surveys.put("Good", "+" + GoodCnt);
			 }
			 
			 if( GoodCnt <= 0){
				 surveys.put("Good", GoodCnt);
			 }
		 
			 if( BadCnt >= 1){
				 surveys.put("Bad", "-" + BadCnt);
			 }
			 
			 if( BadCnt <= 0){
				 surveys.put("Bad", BadCnt);
			 }
			 
			 if( ScoreCnt >= 1){
				 surveys.put("Score", "+" + ScoreCnt);
			 }
			 
			 if( ScoreCnt <= 0){
				 surveys.put("Score", ScoreCnt);
			 }
			 
			 if( PrevScoreCnt >= 1){
				 surveys.put("PrevScore", "+" + PrevScoreCnt);
			 }
			 
			 if( PrevScoreCnt <= 0){
				 surveys.put("PrevScore", PrevScoreCnt);
			 }
			 			 
			 surveylist.add(surveys);
		}
		
		jsonData.put("result", "200");
		jsonData.put("totalScore", totalScore);
		jsonData.put("surveylist", surveylist);
		renderJSON(jsonData);
	}
	
	
	/**
	 * 서비스 만족도 현황(엑셀)
	 * @param resDate : 선택 년월
 	 * @param prevDate : 이전 년월
	 */
	public static void surveylistEXCEL(String resDate, String prevDate){
		if(resDate == null || resDate.length() < 1){
			return;
		}
		
		String Query = " Call SurveyState('"+resDate+"','"+prevDate+"') ";
		Query query = JPA.em().createNativeQuery(Query);
		List<Object[]>  Survey = query.getResultList(); 
		
		WritableWorkbook workbook = null;
		WritableSheet sheet = null;
		File excelFile = new File(tmpFilePath + "/survey.xls");
		try { 
			   workbook = Workbook.createWorkbook(excelFile);
			   
			   /* 헤더 타이틀 형식 */
			   WritableCellFormat format_head_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 13, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.BLACK));
			   
			   /* 헤더 메인(제목) 형식 */
			   WritableCellFormat format_main_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 11, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.WHITE));
			   format_main_title.setAlignment(jxl.format.Alignment.CENTRE);
			   format_main_title.setBackground(jxl.format.Colour.GRAY_50);  
			   
			   /* 내용 형식 */
			   WritableCellFormat format_sub = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 10));
			   format_sub.setAlignment(jxl.format.Alignment.CENTRE);
			   
			   
			   workbook.createSheet("survey", 0);
			   sheet = workbook.getSheet(0);
			   sheet.setColumnView(0, 40); //sheet의 첫번째 열의 크기를 40으로 설정한다
			   sheet.setColumnView(1, 20); 
			   sheet.setColumnView(2, 20); 
			   sheet.setColumnView(3, 20); 
			   sheet.setColumnView(4, 20); 
			   
			   String excelheader = resDate + "월 서비스 만족도 현황";
			   
			   sheet.addCell(new Label(0,0, excelheader,format_head_title));
			   
			   sheet.addCell(new Label(0,1, "월/구분",format_main_title));
			   sheet.addCell(new Label(1,1,"만족(+1점)",format_main_title));
			   sheet.addCell(new Label(2,1,"불만(-1점)",format_main_title));
			   sheet.addCell(new Label(3,1,"서비스점수",format_main_title));
			   sheet.addCell(new Label(4,1,"전월 서비스점수",format_main_title));
			   
			   long totalScore = 0;
			   int i = 2;
			   
			   String Goods;
			   String Bads;
			   String Scores;
			   String PrevScores;
			   String Title;
			   
			   long GoodCnt = 0;
			   long BadCnt = 0;
			   long ScoreCnt = 0;
			   long PrevScoreCnt = 0;
			   for (Object[] objects : Survey) { 
				     Title = String.valueOf(objects[0]) + " " + String.valueOf(objects[1]);
				     GoodCnt = (long)Double.parseDouble(String.valueOf(objects[3]));
				     BadCnt = (long)Double.parseDouble(String.valueOf(objects[4]));
					 ScoreCnt = (long)Double.parseDouble(String.valueOf(objects[5]));
					 PrevScoreCnt = (long)Double.parseDouble(String.valueOf(objects[6]));
					 
					 totalScore = totalScore + ScoreCnt;
						 
				     Goods = ""+ GoodCnt;
				     Bads = ""+BadCnt;
				     Scores = ""+ScoreCnt;
				     PrevScores = ""+PrevScoreCnt;
				     
				     if( GoodCnt >= 1){
						 Goods = "+" + GoodCnt;
					 }
				     
				     if( BadCnt >= 1){
				    	 Bads = "+" + BadCnt;
					 }
				     
				     if( ScoreCnt >= 1){
				    	 Scores = "+" + ScoreCnt;
					 }
				     
				     if( PrevScoreCnt >= 1){
				    	 PrevScores = "+" + PrevScoreCnt;
					 }
				     
					 sheet.addCell(new Label(0, i, Title));
					 sheet.addCell(new Label(1, i, Goods,format_sub));
					 sheet.addCell(new Label(2, i, Bads,format_sub));
					 sheet.addCell(new Label(3, i, Scores,format_sub));
					 sheet.addCell(new Label(4, i, PrevScores,format_sub));
					 
			   i++;
			   }

			   workbook.write();
			   workbook.close();
			   
			if (excelFile.exists()) {
			 excelFile.deleteOnExit();
			 renderBinary(excelFile,"surveyexcel.xls");
			} 
			   
		} catch( Exception e)    {
			   e.printStackTrace();
		}
	   
	}
	
	
	/**
	 * 서비스 만족도 현황 리스트 출력
	 * @param page
	 * @param resDate
	 */
	public static void surveytotalJSON(int page,String resDate){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		
		String Query = " Call SurveyList('list','"+page+"','"+BLOCK_LIST_COUNT+"','"+resDate+"') ";
		Query query = JPA.em().createNativeQuery(Query);
		
		String countQuery = " Call SurveyList('count','"+page+"','"+BLOCK_LIST_COUNT+"','"+resDate+"') ";
		Query countquery = JPA.em().createNativeQuery(countQuery);
		
		
		List<Object[]>  Survey = query.getResultList(); 
		List<Object> surveylist = new ArrayList<Object>();

		int totalCount = countquery.getSingleResult().hashCode();
		
		JeiUtils utils = new JeiUtils();
		
		for (Object[] objects : Survey) { 
			 Map<String, Object> surveys = new HashMap<String, Object>();
			 surveys.put("resIdx", objects[0]); 
			 surveys.put("regID", objects[1]);
			 surveys.put("regName", objects[2]);
			 surveys.put("regDate", objects[3]);
			 surveys.put("item1", objects[4]);
			 surveys.put("item2", objects[5]);
			 surveys.put("item3", objects[6]);
			 surveys.put("item4", objects[7]);
			 surveys.put("item5", objects[8]);
			 surveys.put("item6", objects[9]);
			 surveys.put("etcFullComment", utils.nl2br(String.valueOf(objects[10])));
			 
			 if(!String.valueOf(objects[10]).equals("") && String.valueOf(objects[10]).length() > 20){
				 surveys.put("etcComment", String.valueOf(objects[10]).substring(0,20));
			 }
			 else{
				 surveys.put("etcComment", objects[10]);
			 }
			 
			
			 surveylist.add(surveys);
		}
		
		jsonData.put("page", page);
		jsonData.put("result", "200");
		jsonData.put("count", totalCount);
		jsonData.put("surveytotallist", surveylist);
		jsonData.put("listNo", BLOCK_PAGE_COUNT);
		renderJSON(jsonData);
	}
	
	
}

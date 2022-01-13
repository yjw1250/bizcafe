package controllers.user;

import static utils.Constants.SITE_DOMAIN;
import static utils.Constants.BLOCK_LIST_COUNT;
import static utils.Constants.BLOCK_PAGE_COUNT;
import static utils.Constants.SITE_NAME;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.StringTokenizer;
import java.util.TreeSet;

import models.CodeDtl;
import models.HolidayInfo;
import models.Reservation;
import models.User;
import models.ViewReservation;
import models.ViewRoomInfo;
import models.ViewRoomPerson;
import play.db.jpa.GenericModel;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.JeiUtils;
import utils.ReserverUtils;
import utils.validators.LoggedInUserInfo;


/**
 * 예약처리
 * @author 유정운
 * 
 */
@With(LoggedInUserInfo.class)
public class UserBooking  extends Controller {
	
	/**
	 * 예약안내 페이지 
	 */
	public static void info(){
		String domain = SITE_DOMAIN;
		render(domain);
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
			return;
		}
		
		List roomlists = ReserverUtils.getListRoominfo(Reserver.resRoom); 

		String[] StartHour = Reserver.resStartHour.split(":");
		String[] EndHour = Reserver.resEndHour.split(":");

		Reserver.regDate = utils.getformatdate(Reserver.regDate,"yyyy년 MM월 dd일");
		Reserver.resDate = utils.getformatdate(Reserver.resDate,"yyyy년 MM월 dd일");
		Reserver.resStartHour = StartHour[0] + "시" + StartHour[1] + "분";
		Reserver.resEndHour = EndHour[0] + "시" + EndHour[1] + "분";

		String SnsMessage = SITE_NAME + " 비즈니스 미팅공간 예약신청이 완료되었습니다.  예약일 :" + Reserver.resDate +  "시간 :" + Reserver.resStartHour + "부터" + Reserver.resEndHour + "까지";
		render(Reserver,roomlists,SnsMessage);
		
	}
	
	
	/**
	 * 소호룸 예약 완료 확인 페이지
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
	 * 국공휴일 체크
	 * @param resDate
	 */
	public static void holidayJSON(String resDate){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		HolidayInfo holidayinfo = HolidayInfo.find("holiday='"+resDate+"'").first();
		String message = "200";
		String holidayname = "";
		if(holidayinfo != null){
			if(resDate.equalsIgnoreCase(holidayinfo.holiday)){
				holidayname = holidayinfo.holidayName;
				message = "400";
			}
		}
		jsonData.put("holidayname", holidayname);
		jsonData.put("result", message);
		renderJSON(jsonData);
	}
	
	/**
	 * 비즈니스 예약 현황 페이지(회원용)
	 */
	public static void businessstate() {
		/* 회원 정보 가져오기 */
		Cookies cookie = new Cookies();			
		int usercount = 0;
		if(!cookie.getCookie("BZ_UID").isEmpty()){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			usercount = (int) user.count();
			render(user,usercount);
			return;
		}
		/**
		 * 비회원
		 */
		User user = new User();
		user.userID = "";	
		renderTemplate("user/UserBooking/businessstatetotal.html",user,usercount);
	}
	
	
	/**
	 * 비즈니스 예약 현황 페이지(비회원용)
	 */
	public static void businessstatetotal() {
		/* 회원 정보 가져오기 */
		Cookies cookie = new Cookies();			
		/**
		 * 회원
		 */
		int usercount = 0;
		if((cookie.getCookie("BZ_UID") != null) && (!cookie.getCookie("BZ_UID").equals(""))){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			/**
			 * 회원 정보만 유무만 가져오기 때문에 회원수는 0으로 초기화 한다 
			 */
			usercount = 0;
			render(user,usercount);
			return;
		}
		/**
		 * 비회원
		 */
		User user = new User();
		user.userID = "";	
		render(user,usercount);
	}
	
	
	/**
	 * 비즈니스 예약 현황 페이지(비회원용)
	 */
	public static void sohostatetotal() {
		/* 회원 정보 가져오기 */
		Cookies cookie = new Cookies();			
		/**
		 * 회원
		 */
		int usercount = 0;
		if((cookie.getCookie("BZ_UID") != null) && (!cookie.getCookie("BZ_UID").equals(""))){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			/**
			 * 회원 정보만 유무만 가져오기 때문에 회원수는 0으로 초기화 한다 
			 */
			usercount = 0;
			render(user,usercount);
			return;
		}
		/**
		 * 비회원
		 */
		User user = new User();
		user.userID = "";	
		render(user,usercount);
		
	}
	
	/**
	 * 룸정보(전체 현황)
	 * @param page
	 * @param roomCode01
	 */
	public static void businessallinfoJSON(int page,String roomCode01) {
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> RoomList = null;
		RoomList = ViewRoomInfo.find("roomCode01='"+roomCode01+"' Order by minPerson, roomName04").from(((page - 1) * 5)).fetch(5);
		long RoomCount = ViewRoomInfo.count("roomCode01='"+roomCode01+"' Order by minPerson, roomName04");
		jsonData.put("roomcount", RoomCount); 
		jsonData.put("roomlist", RoomList); 
		renderJSON(jsonData);
	}
	
	/**
	 * 비즈니스 룸 예약 정보 가져오기
	 * @param resdate
	 */
	public static void businessreserverJSON(String resdate) {
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> Reserver = null;
		Reserver = Reservation.find("resType='BZ' and resDate='"+resdate+"' And stateCD != '9'").fetch();
		jsonData.put("reserver", Reserver); 
		renderJSON(jsonData);
	}
	
	/**
	 * 예약 목록을 Json으로 출력한다
	 * @param page
	 * @param resType
	 * @param resUserID
	 * @param roomCode
	 * @throws Exception
	 */
	public static void businessListJSON(int page, String resType, String pageType, String resUserID, String roomCode) throws Exception { 
		long totalCount = 0;		
		List<ViewReservation> businessList = null;
		Map<String, Object> jsonData = new HashMap<String, Object>();
		
		if (page == 0)
    		page = 1;
		
		StringBuffer wheres = new StringBuffer(); 
		wheres.append(" 1=1 ");
		/*
		 * 오늘날짜 가져오기
		 */
		Date date = new Date();
		Timestamp today = new Timestamp(date.getTime());
		String todate = today.toString().substring(0,10);
		
		/*
		 * 예약종류(BZ:비즈니스,OF:소호)
		 */
		if(resType != null && resType.length() >0 ){
				wheres.append(" AND resType = '"+ resType + "' ");
		}
		else{
				if(pageType.equals("state")){
					wheres.append(" AND stateCD != '9' AND resDate >= '"+todate+"'");
				}
				else if(pageType.equals("add")){
					wheres.append(" AND stateCD != '9'");
				}
		}
		
		/*
		 * 룸코드 
		 */
		if(resType != null && resType.length() >0 && resType.equals("OF") && roomCode != null && roomCode.length() >0){
			wheres.append(" AND resRoom = '"+ roomCode +"' ");
		}
		
		/*
		 * 회원
		 */
		if(resUserID != null && resUserID.length() >0 ){
				wheres.append(" AND resUserID = '"+ resUserID + "' ");
		}
		else{
				if(pageType.equals("state")){
					wheres.append(" AND stateCD != '9' AND resDate >= '"+todate+"'");
				}
				else if(pageType.equals("add")){
					wheres.append(" AND stateCD != '9'");
				}
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
	
	
}

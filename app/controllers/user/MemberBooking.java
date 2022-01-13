package controllers.user;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.StringTokenizer;
import java.util.TreeSet;

import models.Reservation;
import models.ReservationRoom;
import models.SendSMS;
import models.Survey;
import models.SurveyRespondents;
import models.User;
import models.ViewReservation;
import models.ViewRoomInfo;
import models.ViewRoomPerson;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.FormMail;
import utils.JeiUtils;
import utils.ReserverUtils;
import utils.Sms;
import utils.validators.LoggedInValidatorUser;
import static utils.Constants.SITE_NAME;

@With(LoggedInValidatorUser.class)
public class MemberBooking extends Controller{
	
	/**
	 * 비즈니스 미팅 공간 예약 
	 */
	public static void business() {
		String resdate;
		String person;
		resdate = params.get("date");
		person = params.get("person");
		
		// 룸(인원) 정보  선택박스
		ViewRoomPerson resRoom = ViewRoomPerson.find("1=1").first();
		int roommax = resRoom.maxPerson;

		List resRoomList = new ArrayList();
		int i = 1;
		while(i<=roommax){
			resRoomList.add(i);
			i++;
		}
		
		/* 회원 정보 가져오기 */
		Cookies cookie = new Cookies();
		if(!cookie.getCookie("BZ_UID").isEmpty()){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			renderTemplate("user/UserBooking/business.html", resRoomList,resdate,person,user);
			return;
		}
		
		/**
		 * 비회원
		*/
		User user = new User();
		user.phone = "";
		renderTemplate("user/UserBooking/business.html", resRoomList,resdate,person,user);
    }
	
	/**
	 * 소호  예약 페이지
	 */
	public static void soho() {
		String resdate;
		String person;
		resdate = params.get("date");
		person = params.get("person");
		// 룸(인원) 정보  선택박스
		List<ViewRoomInfo> roomList  = ViewRoomInfo.find("roomCode01 ='B'").fetch();		
		
        /* 회원 정보 가져오기 */
		Cookies cookie = new Cookies();
		
		if(!cookie.getCookie("BZ_UID").isEmpty()){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			renderTemplate("user/UserBooking/soho.html", user,resdate,person,roomList);
			return;
		}
		
		/**
		 * 비회원
		*/
		User user = new User();
		user.phone = "";
		renderTemplate("user/UserBooking/soho.html",user,resdate,person,roomList);
	}
	
	
	/**
	 * 소호 예약 현황 페이지(회원용)
	 */
	public static void sohostate() {
		/* 회원 정보 가져오기 */
		Cookies cookie = new Cookies();			
		int usercount = 0;
		if(!cookie.getCookie("BZ_UID").isEmpty()){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			usercount = (int) user.count();
			renderTemplate("user/UserBooking/sohostate.html",user,usercount);
			return;
		}
		/**
		 * 비회원
		 */
		//User user = new User();
		//user.userID = "";	
		//renderTemplate("user/UserBooking/sohostatetotal.html",user,usercount);
	}
	
	/**
	 * 비즈니스룸 예약취소
	 * @param reservation
	 */
	public static void businessroomcancelJSON(Reservation reservation){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		Date date = new Date();
		Cookies cookie = new Cookies();
		if(!cookie.getCookie("BZ_UID").isEmpty()){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			//reservation.resRoom = "";
			reservation.updID = user.userID;
			reservation.updDate = new Timestamp(date.getTime());
			reservation.stateCD = "9";
			reservation.save();
			//ReservationRoom.delete(" resIdx = '"+reservation.resIdx+"' ");
			jsonData.put("result", "200"); 
			renderJSON(jsonData);
		}
	}
	
	
	/**
	 * 소호룸 예약취소
	 * @param reservation
	 */
	public static void sohoroomcancelJSON(Reservation reservation){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		Date date = new Date();
		Cookies cookie = new Cookies();
		if(!cookie.getCookie("BZ_UID").isEmpty()){
			User user = User.findById(cookie.getCookie("BZ_UID"));
			//reservation.resRoom = "";
			reservation.updID = user.userID;
			reservation.updDate = new Timestamp(date.getTime());
			reservation.stateCD = "9";
			reservation.save();
			//ReservationRoom.delete(" resIdx = '"+reservation.resIdx+"' ");
			jsonData.put("result", "200"); 
			renderJSON(jsonData);
		}
	}
	
	/**
	 * 비즈니스 예약 정보 보기 페이지
	 */
	public static void businessdetail(){
		String idx = params.get("id");
		ViewReservation Reserver = ViewReservation.find("resIdx='"+idx+"'").first();
		long resIdxCount;
		resIdxCount = Reservation.count("resIdx='"+idx+"'");
		if(resIdxCount >= 1){
			Cookies cookie = new Cookies();
			if(!cookie.getCookie("BZ_UID").isEmpty()){
				ViewRoomPerson resRoom = ViewRoomPerson.find("1=1").first();
				int roommax = resRoom.maxPerson;
				List resRoomList = new ArrayList();
				int i=1;
				while(i<=roommax){
					resRoomList.add(i);
					i++;
				}
				renderTemplate("user/UserBooking/businessdetail.html",Reserver,resRoomList);
			}
		}else{
			renderText("존재하지 않는 예약 정보입니다.");
		}
	}
	
	
	/**
	 * 소호룸 예약 정보 보기 페이지
	 */
	public static void sohodetail(){
		String idx = params.get("id");
		ViewReservation Reserver = ViewReservation.find("resIdx='"+idx+"'").first();
		long resIdxCount;
		resIdxCount = Reservation.count("resIdx='"+idx+"'");
		if(resIdxCount >= 1){
			Cookies cookie = new Cookies();
			if(!cookie.getCookie("BZ_UID").isEmpty()){
				// 룸(인원) 정보  선택박스
				List<ViewRoomInfo> roomList  = ViewRoomInfo.find("roomCode01 ='B'").fetch();		
				renderTemplate("user/UserBooking/sohodetail.html",Reserver,roomList);
			}
			
		}else{
			renderText("존재하지 않는 예약 정보입니다.");
		}
	}
	
	
	/**
	 * 룸정보(인원별)
	 * @param roomCode01
	 * @param Person
	 */
	public static void roominfoJSON(String roomCode01, int Person){
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
	 * 룸예약(등록)
	 * @param reservation
	 */
	public static void roomsaveJSON(Reservation reservation){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		JeiUtils utils = new JeiUtils();		
		String sRegDate = utils.getformatdate(reservation.resDate, "yyyy-MM-dd");
		String resRooms = reservation.resRoom;
		
		StringBuffer wheres = new StringBuffer(); 
		
		
		if(reservation.resType.equals("BZ")){
			resRooms = resRooms.substring(1, resRooms.length());
			StringTokenizer Roomarray = new StringTokenizer( resRooms, "," );
			int RoomarryCount = Roomarray.countTokens();
			wheres.append(" resType='BZ' And stateCD != '9' And resDate='"+sRegDate+"' And ( ");
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
		
		if(reservation.resType.equals("OF")){
			String sStartDate = utils.getformatdate(reservation.resStartHour, "yyyy-MM-dd");
			String sEndDate = utils.getformatdate(reservation.resEndHour, "yyyy-MM-dd");
			
			wheres.append(" resType='OF' And stateCD != '9' And resRoom='"+resRooms+"'");
			wheres.append(" And ( '"+sStartDate+"' between resStartHour and resEndHour  ");
			wheres.append(" OR '"+sEndDate+"' between resStartHour and resEndHour )");
		}
		
		int Roomchk = (int) Reservation.count(wheres.toString()); 
			
		if(Roomchk >= 1){
			jsonData.put("result", "101");
		}
		else{
	
			Cookies cookie = new Cookies();			
			User user = User.findById(cookie.getCookie("BZ_UID"));
			Date date = new Date();
			reservation.resDate = sRegDate;
			reservation.resUserID = user.userID;
			reservation.resUserName = user.userName;
			
			if(reservation.resPhone.isEmpty()){
				reservation.resPhone = user.phone;
			}
			
			reservation.resRoom = resRooms;
			
			reservation.resBalance = "N";
			reservation.updID = "";
			reservation.confirmID = "";
			
			if(reservation.resType.isEmpty()){
				reservation.resType = "BZ";
			}
			
			if(reservation.resType.equals("BZ")){
				reservation.resIdx = ReserverUtils.resnumber("B","num",9);
			}
			else if(reservation.resType.equals("OF")){
				reservation.resIdx = ReserverUtils.resnumber("S","num",9);
			}
		
			reservation.regDate = new Timestamp(date.getTime());
			reservation.regID = user.userID;
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
			long lastidx = reservation.getIdx();
			ViewReservation Reserver = ViewReservation.find("idx='"+lastidx+"'").first();
			long resIdxCount;
			resIdxCount = Reservation.count("idx='"+lastidx+"'");
			
			if(resIdxCount >= 1){
				String StartString = null;
				String EndString = null;
				String Msg = null;
				
				if(reservation.resType.equals("BZ")){
					String[] StartHour = Reserver.resStartHour.split(":");
					String[] EndHour = Reserver.resEndHour.split(":");
				
					StartString = StartHour[0] + "시" + StartHour[1] + "분";
					EndString =  EndHour[0] + "시" + EndHour[1] + "분";
					Msg = Reserver.regDate + "일 " + StartString + "~" +  EndString + " " + SITE_NAME + " 의 예약신청이 완료 되었습니다";
				}
				else if(reservation.resType.equals("OF")){
					Msg = reservation.resStartHour + "~" + reservation.resEndHour + " " + SITE_NAME + " 의 예약신청이 완료 되었습니다";
				}
				
				Sms.sendSms("3",Msg);
				
				/* 메일 발송 */
				FormMail formMail;
				try {
					formMail = new FormMail();
					
					if(reservation.resType.equals("BZ")){
						String resRoom =ReserverUtils.getMemberRoominfo(Reserver.resRoom);
						formMail.bookingBusiness(user.email, Reserver.resIdx,Reserver.regDate, sRegDate, StartString, EndString, Reserver.resPerson,resRoom, Reserver.payment);
					}
					else if(reservation.resType.equals("OF")){
						String resRoom =ReserverUtils.getMemberRoominfo(Reserver.resRoom);
						formMail.bookingSoho(user.email, Reserver.resIdx,Reserver.regDate, sRegDate,Reserver.resMonthNum,Reserver.resPerson,resRoom,Reserver.resPhone);
					}
					
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			
			jsonData.put("resIdx", reservation.resIdx); 
			jsonData.put("result", "200"); 
		}
    	renderJSON(jsonData);
		
	}
	
	
	/**
	 * 룸예약(업데이트)
	 * @param reservation
	 * @param action
	 */
	public static void roomupdateJSON(Reservation reservation,String action){
		Map<String, Object> jsonData = new HashMap<String, Object>();
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
		
		if(reservation.resType.equals("OF")){
			String sStartDate = utils.getformatdate(reservation.resStartHour, "yyyy-MM-dd");
			String sEndDate = utils.getformatdate(reservation.resEndHour, "yyyy-MM-dd");
			wheres.append(" idx != '"+reservation.idx+"' And stateCD != '9' And resType='OF' and resRoom='"+resRooms+"'");
			wheres.append(" And ( '"+sStartDate+"' between resStartHour and resEndHour  ");
			wheres.append(" OR '"+sEndDate+"' between resStartHour and resEndHour )");
		}
		
		int Roomchk = (int) Reservation.count(wheres.toString()); 
		
		
		if(Roomchk >= 1){
			jsonData.put("result", "101");
		}
		else{
			
			Date date = new Date();
			Cookies cookie = new Cookies();			
			User user = User.findById(cookie.getCookie("BZ_UID"));
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
				reservation.regID = user.userID; 
				reservation.updID = user.userID; 
				reservation.confirmID = ""; 
			}
			else if(action.equals("update")){
				reservation.updDate = new Timestamp(date.getTime());
				reservation.updID = user.userID;
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
			long lastidx = reservation.idx;
			ViewReservation Reserver = ViewReservation.find("idx='"+lastidx+"'").first();
			long resIdxCount;
			resIdxCount = Reservation.count("idx='"+lastidx+"'");
			
			if(resIdxCount >= 1){
				String StartString = null;
				String EndString = null;
				String Msg = null;
				
				if(reservation.resType.equals("BZ")){
					String[] StartHour = Reserver.resStartHour.split(":");
					String[] EndHour = Reserver.resEndHour.split(":");
				
					StartString = StartHour[0] + "시" + StartHour[1] + "분";
					EndString =  EndHour[0] + "시" + EndHour[1] + "분";
					Msg = Reserver.regDate + "일 " + StartString + "~" +  EndString + " " + SITE_NAME + " 의 예약신청이 수정 되었습니다";
				}
				else if(reservation.resType.equals("OF")){
					Msg = reservation.resStartHour + "~" + reservation.resEndHour + " " + SITE_NAME + " 의 예약신청이 수정 되었습니다";
				}
				
				Sms.sendSms("3",Msg);
				
				/* 메일 발송 */
				FormMail formMail;
				try {
					formMail = new FormMail();
					if(reservation.resType.equals("BZ")){
						String resRoom =ReserverUtils.getMemberRoominfo(Reserver.resRoom);
						formMail.bookingBusiness(user.email, Reserver.resIdx,Reserver.regDate, sRegDate, StartString, EndString, Reserver.resPerson,resRoom, Reserver.payment);
					}
					else if(reservation.resType.equals("OF")){
						String resRoom =ReserverUtils.getMemberRoominfo(Reserver.resRoom);
						formMail.bookingSoho(user.email, Reserver.resIdx,Reserver.regDate, sRegDate,Reserver.resMonthNum,Reserver.resPerson,resRoom,Reserver.resPhone);
					}
					
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			
			jsonData.put("resIdx", reservation.resIdx); 
			jsonData.put("result", "200"); 
		}
    	renderJSON(jsonData);
		
	}
	
	/**
	 * 비즈니스 미팅룸 등록페이지에서 예약내용 가져오기(날짜 조회)
	 * @param resdate
	 */
	public static void reserverJSON(String resdate){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> Reserver = null;
		Reserver = Reservation.find("resDate='"+resdate+"' And resType='BZ' And stateCD != '9'").fetch();
		jsonData.put("reserver", Reserver); 
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
	 * 수정시 예약내용 가져오기(날짜/예약번호 조회)
	 * @param resdate : 예약일
	 * @param resIdx : 예약번호
	 */
	public static void reserverUserJSON(String resdate, String resIdx){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<ViewRoomInfo> Reserver = null;
		Reserver = Reservation.find("resDate='"+resdate+"' And resIdx != '"+resIdx+"' And stateCD != '9'").fetch();
		Reservation UserReserver = Reservation.find("resDate='"+resdate+"' And resIdx = '"+resIdx+"' And stateCD != '9'").first();
		jsonData.put("userreserver", UserReserver); 
		jsonData.put("reserver", Reserver); 
		renderJSON(jsonData);
	}
	
	/**
	 * 서비스 만족도 등록 페이지(비즈니스)
	 * @param resIdx : 예약번호
	 */
	public static void servicecomplete(){
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
		List surveyLists = Survey.find("delYN='1' and itemNum != '7' order by itemSort").fetch();
		
		if(Reserver.resType.equals("BZ")){
			String[] StartHour = Reserver.resStartHour.split(":");
			String[] EndHour = Reserver.resEndHour.split(":");
			Reserver.regDate = utils.getformatdate(Reserver.regDate,"yyyy년 MM월 dd일");
			Reserver.resDate = utils.getformatdate(Reserver.resDate,"yyyy년 MM월 dd일");
			Reserver.resStartHour = StartHour[0] + "시" + StartHour[1] + "분";
			Reserver.resEndHour = EndHour[0] + "시" + EndHour[1] + "분";
		}
		else if(Reserver.resType.equals("OF")){
			Reserver.regDate = utils.getformatdate(Reserver.regDate,"yyyy년 MM월 dd일");
			Reserver.resDate = utils.getformatdate(Reserver.resDate,"yyyy년 MM월 dd일");
		}

		renderTemplate("user/UserBooking/servicecomplete.html",Reserver,roomlists,surveyLists);
	}
	
	/**
	 * 서비스 만족도 등록
	 * @param resIdx
	 * @param survey_idx
	 * @param survey_num
	 * @param item_num
	 * @param answer
	 * @param etcComment
	 */
	public static void servicesave(String resIdx, String[] survey_idx, String[] survey_num, String[] item_num, String[] answer, String etcComment){
		
		Map<String, Object> jsonData = new HashMap<String, Object>();
		
		if(survey_idx.length <= 0){
			jsonData.put("result", "400");
			renderJSON(jsonData);
			return;
		}
		
		
		Date date = new Date();
		Cookies cookie = new Cookies();			
		User user = User.findById(cookie.getCookie("BZ_UID"));
	
		ViewReservation Reserver = ViewReservation.find("resIdx='"+resIdx+"'").first();
		
		if(!Reserver.resUserID.equals(user.userID)){
			jsonData.put("result", "100");
			renderJSON(jsonData);
			return;
		}
		
		
		StringBuffer wheres = new StringBuffer(); 
		wheres.append(" resIdx = '"+resIdx+"' and regID = '"+user.userID+"' ");
		
		int servicecount = (int) SurveyRespondents.count(wheres.toString());
		
		if(servicecount >= 1){
			jsonData.put("result", "300");
			renderJSON(jsonData);
			return;
		}
		
		int i = 0;
		int surveylen = survey_idx.length;
		while(i<surveylen){
			SurveyRespondents surveyrespondents = new SurveyRespondents();
			surveyrespondents.surveyIdx = Integer.parseInt(survey_idx[i]);
			surveyrespondents.surveyNum = Integer.parseInt(survey_num[i]);
			surveyrespondents.itemNum = Integer.parseInt(item_num[i]);
			surveyrespondents.answer = answer[i];
			surveyrespondents.resIdx = resIdx;
			surveyrespondents.regID = user.userID;
			surveyrespondents.regName = user.userName;
			surveyrespondents.regDate = new Timestamp(date.getTime());;
			surveyrespondents.save();
			i++;
		}
		
		SurveyRespondents surveyrespondents = new SurveyRespondents();
		if(etcComment != null && etcComment.length() >= 1){
			surveyrespondents.surveyIdx = 7;
			surveyrespondents.surveyNum = 1;
			surveyrespondents.itemNum = 7;
			surveyrespondents.answer = "";
			surveyrespondents.resIdx = resIdx;
			surveyrespondents.regID = user.userID;
			surveyrespondents.regName = user.userName;
			surveyrespondents.regDate = new Timestamp(date.getTime());;
			surveyrespondents.etcComment = etcComment;
			surveyrespondents.save();
		}
		
		jsonData.put("result", "200"); 
		renderJSON(jsonData);
	}
}

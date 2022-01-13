package utils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.StringTokenizer;
import java.util.TreeSet;

import models.ReservationRoom;
import models.ViewRoomInfo;

/**
 * 예약관련 공통 메소드 모음
 * @author 유정운
 *
 */
public class ReserverUtils {

	/**
	 * 예약번호 생성기
	 * @param resType : 예약구분코드(B:비즈니스,S:소호사무실)
	 * @param type : 종류(num:숫자만,str:문자열만)
	 * @param length : 길이
	 * @return
	 */
	public static String resnumber(String resType,String type,int length){
		
		if(resType.equals("") && resType.length() <= 0){
			return "";
		}
		
		if(type.equals("") && type.length() <= 0){
			return "";
		}
		
		if(length <= 0){
			return "";
		}
		
		StringBuffer buffer = new StringBuffer();  
		Random random = new Random();   
		String chars[] = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(","); 
		int i = 0;
		while(i<length)  {    
			if(type.equals("num")){
				buffer.append(random.nextInt(9));  
			}else if(type.equals("str")){
				buffer.append(chars[random.nextInt(chars.length)]);  
			}
			i++;
		}
		
		String resnumber;
		if(resType.equals("")){
			resnumber = buffer.toString();
		}
		else{
			resnumber = resType + buffer.toString();
		}
		
		return resnumber;
	}
	
	
	/**
	 * 예약된 정보의 룸정보
	 * @param resRoom
	 * @return
	 */
	public static String getRoominfo(String resRoom){
		
		if(resRoom.equals("") && resRoom.length() <= 0){
			return "";
		}
		
		String ResRooms = resRoom; 
		StringTokenizer Roomarray = new StringTokenizer( ResRooms, "," );
		String[] RoomInfos;
		String RoomInfo;
		String RoomView = "";
		
		while(Roomarray.hasMoreElements()){
			RoomInfos = Roomarray.nextToken().split(":");
			RoomInfo  = RoomInfos[0];
			if(RoomInfo.equals(RoomInfos[0])){
				RoomView = RoomView + "," + RoomInfo;
				
			}
				
		}

		 TreeSet tset = new TreeSet();
		 RoomView = RoomView.substring(1, RoomView.length());
	     String[] tokens = RoomView.split(",");
	     int i = 0;
	     int tokenslen = tokens.length;
	     while(i < tokenslen) {
	    	  tset.add(tokens[i]);
	    	  i++;
	     }
	     
	     Iterator itor = tset.iterator();
	     
	     String roomcode = null;
	     String roomName = "";
	     while(itor.hasNext()) {
	    	 	roomcode = (String) itor.next();
	    		ViewRoomInfo viewroominfo = ViewRoomInfo.find("roomCode='"+roomcode+"'").first();
	    		roomName = roomName + "<p>" + viewroominfo.roomName + "</p>";
	    		
	     }
	     
		return roomName;
	}
	
	
	/**
	 * 예약된 비즈니스룸 정보
	 * @param resRoom
	 * @return
	 */
	public static List getListRoominfo(String resRoom){
		
		List<Object> roomlists = new ArrayList<Object>();
		 
		if(resRoom.equals("") && resRoom.length() <= 0){
			return roomlists;
		}
		
		String ResRooms = resRoom; 
		StringTokenizer Roomarray = new StringTokenizer( ResRooms, "," );
		String[] RoomInfos;
		String RoomInfo;
		String RoomView = "";
		
		while(Roomarray.hasMoreElements()){
			RoomInfos = Roomarray.nextToken().split(":");
			RoomInfo  = RoomInfos[0];
			if(RoomInfo.equals(RoomInfos[0])){
				RoomView = RoomView + "," + RoomInfo;
				
			}
				
		}

		 TreeSet tset = new TreeSet();
		 RoomView = RoomView.substring(1, RoomView.length());
	     String[] tokens = RoomView.split(",");
	     
	     int i = 0;
	     int tokenlen = tokens.length;
	     while(i<tokenlen) {
	    	  tset.add(tokens[i]);
	    	  i++;
	     }
	     
	    
	     Iterator itor = tset.iterator();
	     
	     String roomcode = null;
	     while(itor.hasNext()) {
	    	 	roomcode = (String) itor.next();
	    	 	Map<String, Object> viewroomlist = new HashMap<String, Object>();
	    		ViewRoomInfo viewroominfo = ViewRoomInfo.find("roomCode='"+roomcode+"'").first();
	    		viewroomlist.put("roomcode",viewroominfo.roomName04);
	    		viewroomlist.put("roomSourceCode",viewroominfo.roomCode);
	    		viewroomlist.put("roomname02",viewroominfo.roomName02);
	    		viewroomlist.put("roomname03",viewroominfo.roomName03);
	    		roomlists.add(viewroomlist);
	     }
	     
		return roomlists;
	}
	
	
	/**
	 * 예약된 정보의 룸정보
	 * @param resRoom
	 * @return
	 */
	public static String getMemberRoominfo(String resRoom){
		
		if(resRoom.equals("") && resRoom.length() <= 0){
			return "";
		}
		
		String ResRooms = resRoom; 
		StringTokenizer Roomarray = new StringTokenizer( ResRooms, "," );
		String[] RoomInfos;
		String RoomInfo;
		String RoomView = "";
		
		while(Roomarray.hasMoreElements()){
			RoomInfos = Roomarray.nextToken().split(":");
			RoomInfo  = RoomInfos[0];
			if(RoomInfo.equals(RoomInfos[0])){
				RoomView = RoomView + "," + RoomInfo;
				
			}
				
		}

		 TreeSet tset = new TreeSet();
		 RoomView = RoomView.substring(1, RoomView.length());
	     String[] tokens = RoomView.split(",");
	     
	     int i = 0;
	     int tokenlen = tokens.length;
	     while(i<tokenlen) {
	    	  tset.add(tokens[i]);
	    	  i++;
	     }
	     
	     
	     Iterator itor = tset.iterator();
	     
	     String roomcode = null;
	     String roomName = "";
	     while(itor.hasNext()) {
	    	 	roomcode = (String) itor.next();
	    		ViewRoomInfo viewroominfo = ViewRoomInfo.find("roomCode='"+roomcode+"'").first();
	    		roomName = roomName + "<p>" + viewroominfo.roomName + "</p>";
	    		
	     }
	     
		return roomName;
	}
	
	/**
	 * 사용자 예약테이블과 연결시킬 예약 세부 테이블에  비즈니스룸 예약시간별로 저장
	 * @param resIdx
	 * @param resRooms
	 */
	public static String saveResBusinessRoom(String resDate, String resIdx, String resRooms){
		
		if(resDate.equals("") && resDate.length() <= 0){
			return "error";
		}
		
		if(resIdx.equals("") && resIdx.length() <= 0){
			return "error";
		}
		
		if(resRooms.equals("") && resRooms.length() <= 0){
			return "error";
		}
		
		
		StringTokenizer Roomarray = new StringTokenizer( resRooms, "," );
		String[] RoomToken;
		String RoomCode;
		Date date = new Date();
		int Roomchk;
		
		/* 데이터 입력,수정시 기존 정보는 삭제하고 다시 쓴다*/
		ReservationRoom.delete(" resIdx = '"+resIdx+"' ");
		ReservationRoom reservationroom = null;	
		/**
		 * 대용량 데이타 입력시 문제될 소지가 있는 구문임 추후 수정 필요(2012년 2월 24일 : 유정운)
		 */
		while(Roomarray.hasMoreElements()){
			RoomToken = Roomarray.nextToken().split(":");
			RoomCode = RoomToken[0];
			Roomchk = (int) ReservationRoom.count(" resIdx = '"+resIdx+"' AND resDate = '"+resDate+"' AND resRoomCode = '"+RoomCode+"' AND resTime = '"+RoomToken[1]+"' "); 
			if(Roomchk <= 0){
				reservationroom = new ReservationRoom();
				reservationroom.resTime = RoomToken[1];
				reservationroom.resDate = resDate;
				reservationroom.resIdx = resIdx;
				reservationroom.resRoomCode = RoomCode;
				reservationroom.regDate = new Timestamp(date.getTime());
				reservationroom.save();
			}
			
		}
		
		return "ok";
	}
	
	/**
	 * 사용자 예약테이블과 연결시킬 예약 세부 테이블에  소호룸 예약시간별로 저장
	 * @param resIdx
	 * @param resRooms
	 */
	public static String saveResSohoRoom(String resDate, String resIdx, String resRoomCode){
		
		if(resDate.equals("") && resDate.length() <= 0){
			return "error";
		}
		
		if(resIdx.equals("") && resIdx.length() <= 0){
			return "error";
		}
		
		if(resRoomCode.equals("") && resRoomCode.length() <= 0){
			return "error";
		}
		
		Date date = new Date();
		int Roomchk;
		
		/* 데이터 입력,수정시 기존 정보는 삭제하고 다시 쓴다*/
		ReservationRoom.delete(" resIdx = '"+resIdx+"' ");
		ReservationRoom reservationroom = null;	
		
		Roomchk = (int) ReservationRoom.count(" resIdx = '"+resIdx+"' AND resDate = '"+resDate+"' AND resRoomCode = '"+resRoomCode+"'"); 
		if(Roomchk <= 0){
			reservationroom = new ReservationRoom();
			reservationroom.resDate = resDate;
			reservationroom.resIdx = resIdx;
			reservationroom.resRoomCode = resRoomCode;
			reservationroom.regDate = new Timestamp(date.getTime());
			reservationroom.save();
		}
				
		return "ok";
	}
	
}
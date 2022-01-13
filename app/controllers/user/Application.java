package controllers.user;

import java.util.ArrayList;
import java.util.List;

import models.ViewMyReservationCount;
import models.ViewRoomPerson;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.validators.LoggedInUserInfo;
/**
 * 사용자 메인
 * @author 노윤희
 * @since 2012-03-14
 */
@With(LoggedInUserInfo.class)
public class Application extends Controller {

	/**
	 * 나의 예약 내역 건수
	 * 실시간 예약> 예약인원  선택박스
	 */		
    public static void index() {
    
    	 
    	//나의 예약 내역 건수
    	Cookies cookie = new Cookies();
		String resUserID 	= cookie.getCookie("BZ_UID");
		
		int myResCnt = 0 ;
		
		ViewMyReservationCount myReservationCount = ViewMyReservationCount.findById(resUserID); 
		
		if(myReservationCount != null){
			myResCnt = myReservationCount.resCnt ;			
		}
		
		
		// 실시간 예약> 예약인원  선택박스
		ViewRoomPerson resRoom = ViewRoomPerson.find("1=1").first();
		int roommax = resRoom.maxPerson;

		List resRoomList = new ArrayList();
		for (int i=1; i<=roommax; i++){
			resRoomList.add(i);
		}
		
		render(resRoomList,myResCnt);
		
    }
    
    //서비스 준비중일때 사용
    public static void indexReady() {
    	render();
    }
}
package utils.validators;

import static utils.Constants.HTTPS_DOMAIN;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import models.ViewsJeiBoardList;
import play.mvc.Before;
import play.mvc.Controller;
import utils.Cookies;

public class LoggedInUserInfo extends Controller {


	/**
	 * 로그인 된 회원의 정보
	 *  
	 * @throws Exception
	 */
	@Before
	public static void validate() throws Exception {
		
		Cookies cookie = new Cookies();
		Map<String, Object> memberInfo = new HashMap<String, Object>();		
	
		// 1. 쿠키값이 있는지 체크
		String cookieUserId 	= cookie.getCookie("BZ_UID");
		String cookieUserName 	= cookie.getCookie("BZ_UNAME");
		
		// 아이디 저장 쿠키
		String cookieSaveId 	= cookie.getCookie("BZ_SAVEID");
		
		// 사용자 정보 Map 생성		
		memberInfo.put("result", "LOGINNED");
		memberInfo.put("userID", cookieUserId);
		memberInfo.put("userName", cookieUserName);
		memberInfo.put("saveID", cookieSaveId);

		//공지사항 최신글 3건 
    	List<ViewsJeiBoardList> noticeList = ViewsJeiBoardList.find("boardCode = 'notice' ORDER BY idx DESC").fetch(3);
    	
    	SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd");    	
    	String nowDate = dateTimeFormat.format(new Date().getTime());
    	
		// Views쪽으로 사용자 정보 전달
    	renderArgs.put("memberInfo",memberInfo);
    	renderArgs.put("noticeList",noticeList);
    	renderArgs.put("nowDate",nowDate);
    	
    	// 로그인 주소
    	renderArgs.put("httpsDomain", HTTPS_DOMAIN);
    	
    	
	}	
}

package utils.validators;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import models.UserAdmin;

import play.Logger;
import play.mvc.Before;
import play.mvc.Controller;
import utils.Cookies;

public class LoggedInValidatorUserAdmin extends Controller {

	/**
	 * 관리자인지 검증한다.
	 * 관리자가 아니면, 로그인 페이지를 출력한다.
	 * 관리자이면 쿠키정보와 로그인 정보를 전달한다. 
	 * @throws Exception
	 */
	@Before
	public static void validate() throws Exception {
		
		Cookies cookie = new Cookies();
		Map<String, Object> adminInfo = new HashMap<String, Object>();		
	
		// 1. 쿠키값이 있는지 체크
		String cookieUserId 	= cookie.getCookie("BZ_ADMINUID");
		String cookieUserName 	= cookie.getCookie("BZ_ADMINUNAME");		
		
		if(cookieUserId == null || cookieUserId.length() == 0) {
			cookie.setCookie("errorResult", "100");
	    	
//	    	Logger.error("errro");
	    	redirect("/admin");	    	
		}		
		// 사용자 정보 Map 생성		
		adminInfo.put("result", "LOGINNED");
		adminInfo.put("adminID", cookieUserId);
		adminInfo.put("adminName", cookieUserName);

		
		// 사용자 정보 가져오기
		UserAdmin userAdmin = UserAdmin.findById(cookieUserId);
		
		SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd (E)");
		SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm:ss");
		
    	String nowDate = dateTimeFormat.format(new Date().getTime());
    	
		String logDate = dateTimeFormat.format(userAdmin.latestLoginDate);
		String logTime = timeFormat.format(userAdmin.latestLoginDate);
		
		adminInfo.put("logDate", logDate);
		adminInfo.put("logTime", logTime);
		adminInfo.put("logIp", userAdmin.latestLoginIp);
		
		// 관리자 메뉴 설정		
		String menu = userAdmin.menuAuthority;		
		String[] menuAuth = null;
		if (menu != null && !("".equals(menu))) {
			menuAuth = menu.split(",");
		}
		
		Map<String, String> menuMap = new HashMap<String, String>();
		if (menuAuth != null) {
			for (int i=1; i < menuAuth.length; i++ ) {
				String num = menuAuth[i];
				String menuNum = "menu"+num;
				menuMap.put(menuNum, "1");
				
			}
		}
//		adminInfo.put("adminMenu", userAdmin.menuAuthority);
    	
		// Views쪽으로 사용자 정보 전달
    	renderArgs.put("adminInfo",adminInfo);
    	renderArgs.put("nowDate",nowDate);
    	renderArgs.put("adminMenu",menuMap); 

	}	
}
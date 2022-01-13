package controllers.user;

import play.mvc.Controller;
import play.mvc.With;
import utils.validators.LoggedInUserInfo;

/**
 * 고객센터
 * @author	nizyuichi
 * @since	2012-03-22
 */
@With(LoggedInUserInfo.class)

public class Cs extends Controller {
	
	/**
	 * 사이트맵
	 */
	public static void siteMap(){
		render();		
	}
	
	/**
	 * 이용약관
	 */
	public static void rules() {
		render();
	}
	
	/**
	 * 개인정보처리방침
	 */
	public static void privacy() {
		render();
	}
	
	/**
	 * 이메일무단수집거부
	 */
	public static void emailCollect() {
		render();
	}
}

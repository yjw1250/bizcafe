package controllers.user;

import java.sql.Timestamp;
import java.util.Date;

import models.User;
import models.UserAdmin;
import models.UserLoginHis;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.encryptors.SHA256Encryptor;
import utils.validators.LoggedInUserInfo;
import static utils.Constants.SITE_DOMAIN;


/**
 * 회원로그인 컨트롤러
 * @author yujaeheon
 * @since 2012-03-02
 *
 */
@With(LoggedInUserInfo.class)
public class UserLogin extends Controller {
	
	// 로그인폼
	public static void index() {
		render();
	}
	
	// 로그인 https 갔다옴 ssl 방식
	public static void loginProcess(String loginID, String loginPasswd, String saveID) throws Exception {
		
		
		Cookies cookies = new Cookies();

		
		// 필수 입력 값
		if (loginID == null || loginID.trim().length() == 0 || loginPasswd == null || loginPasswd.trim().length() == 0) {
			cookies.setCookie("errorResult", "103");			
			index();
			return;
		}

		// 암호화
		String shaUserPasswd = SHA256Encryptor.encrypt(loginPasswd);

		User user = User.findById(loginID);
		
		if (user == null || !shaUserPasswd.equals(user.userPasswd)) {
			cookies.setCookie("errorResult", "101");	
			redirect(SITE_DOMAIN + "/user/login");
			//index();
			return;
			
		} 
		
		// 히스토리 등록
		createHistory(loginID);
		// 정보 업데이트 
		insertLoginInfo(loginID);
			
		// 아이디 저장
		if ("1".equals(saveID)) {
			cookies.setCookie("BZ_SAVEID",user.userID);
		} else {
			cookies.setCookie("BZ_SAVEID","");
		}
		
		// 쿠키 생성
		cookies.setCookie("BZ_UID", user.userID);
		cookies.setCookie("BZ_UNAME", user.userName);
		cookies.setCookie("BZ_UEMAIL", user.email);
		
		redirect(SITE_DOMAIN);
	
	}
	
	
	// 로그인 - ajax 방식
	public static void loginProcessTest(String loginID, String loginPasswd, String saveID) throws Exception {
		
		if (loginID == null || loginID.trim().length() == 0 || loginPasswd == null || loginPasswd.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 암호화
		String shaUserPasswd = SHA256Encryptor.encrypt(loginPasswd);

		User user = User.findById(loginID);
		
		if (user == null || !shaUserPasswd.equals(user.userPasswd)) {
			//renderText(user.userPasswd);
			renderText("101");
			return;
			
		} 
			
		Cookies cookies = new Cookies();
		
		// 히스토리 등록
		createHistory(loginID);
		// 정보 업데이트 
		insertLoginInfo(loginID);
		
		// 아이디 저장
		if ("1".equals(saveID)) {
			cookies.setCookie("BZ_SAVEID",user.userID);
		} else {
			cookies.setCookie("BZ_SAVEID","");
		}
		
		
		// 쿠키 생성
		cookies.setCookie("BZ_UID", user.userID);
		cookies.setCookie("BZ_UNAME", user.userName);
		cookies.setCookie("BZ_UEMAIL", user.email);
		
		renderText("000");
		
	}
	
	// 로그인 성공 후 정보 업데이트 
	private static void insertLoginInfo(String loginID) {
		
		User user = User.findById(loginID);
		
		user.userID = loginID;
		Date date = new Date();
		
		user.latestLoginDate = new Timestamp(date.getTime());
		user.latestLoginIp = request.remoteAddress;
		user.save();
		
	}
	
	// 로그인 히스토리 입력
	private static void createHistory(String loginID) {
		
		
		UserLoginHis userHistory = new UserLoginHis();
		
		Date date = new Date();
		
		userHistory.userID = loginID;
		userHistory.loginDate = new Timestamp(date.getTime());
		userHistory.loginIp = request.remoteAddress;
		
		userHistory.save();
		
	}
	
	// 로그아웃
	public static void logoutProcess() {
		
		Cookies cookies = new Cookies();
		
		// 쿠키 삭제
		cookies.setCookie("BZ_UID", "");
		cookies.setCookie("BZ_UNAME", "");		
		cookies.setCookie("BZ_UEMAIL", "");
		cookies.setCookie("errorResult", "");	
		
//    	cookies.expireCookies();
    	redirect(SITE_DOMAIN);
	}
	
}
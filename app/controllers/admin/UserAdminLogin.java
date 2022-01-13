package controllers.admin;

import static utils.Constants.HTTPS_ADMIN_DOMAIN;
import static utils.Constants.SITE_DOMAIN;

import java.sql.Timestamp;
import java.util.Date;

import models.UserAdmin;
import models.UserAdminLoginHis;
import play.mvc.Controller;
import utils.Cookies;
import utils.encryptors.SHA256Encryptor;

/**
 * 관리자 로그인
 * @author yujaeheon
 * @since 2012/02/13
 */
public class UserAdminLogin extends Controller {
	
	static Cookies cookies = new Cookies();
	
	// 로그인폼
	public static void index() {
		
		String httpsAdminDomain = HTTPS_ADMIN_DOMAIN;
	
		String adminID = cookies.getCookie("adminID");
		if (adminID.length() > 0){
			redirect("/admin/user");
			return;
			
		}
		render(httpsAdminDomain);
	}
	
	// 로그인 ssl 이용시
	public static void loginProcess(String loginID, String loginPasswd) throws Exception {
		
		if (loginID == null || loginID.trim().length() == 0) {
			cookies.setCookie("errorResult", "103");		
			index();
			return;
		}
		
		// 암호화
		String shaUserPasswd = SHA256Encryptor.encrypt(loginPasswd);
		
		UserAdmin userAdmin = UserAdmin.findById(loginID);
		
		
		if (userAdmin == null || !shaUserPasswd.equals(userAdmin.adminPasswd)) {
			cookies.setCookie("errorResult", "101");
			index();
			return;
		} 
		
		//히스토리 등록
		createHistory(loginID);
		// 로그인 정보업데이트 			
		insertLoginInfo(loginID); 
		cookies.setCookie("BZ_ADMINUID", userAdmin.adminID);
		cookies.setCookie("BZ_ADMINUNAME", userAdmin.adminName);	
		
		String url = SITE_DOMAIN + "/admin/stats/visit";
		redirect(url);
		
	}
	
	
	// 로그인 -- ajax 이용시
	public static void loginProcessTest(String loginID, String loginPasswd) throws Exception {
		
		if (loginID == null || loginID.trim().length() == 0 || loginPasswd == null || loginPasswd.trim().length() == 0) {
			renderText("101");
			return;
		}
		// 암호화
		String shaUserPasswd = SHA256Encryptor.encrypt(loginPasswd);
		
		UserAdmin userAdmin = UserAdmin.findById(loginID);
		
		if (userAdmin == null || !shaUserPasswd.equals(userAdmin.adminPasswd)) {
			renderText("101");
			return;
		} else {
			//히스토리 등록
			createHistory(loginID);
			// 로그인 정보업데이트 			
			insertLoginInfo(loginID); 
			
			cookies.setCookie("BZ_ADMINUID", userAdmin.adminID);
			cookies.setCookie("BZ_ADMINUNAME", userAdmin.adminName);	
			
			renderText("000");
//			redirect("/admin/user");
		}
	}
	
	// 로그인 성공 후 정보 업데이트 
	private static void insertLoginInfo(String loginID) {
		
		UserAdmin userAdmin = UserAdmin.findById(loginID);
		
		userAdmin.adminID = loginID;
		Date date = new Date();
		
		userAdmin.latestLoginDate = new Timestamp(date.getTime());
		userAdmin.latestLoginIp = request.remoteAddress;
		userAdmin.save();
		
	}
	
	// 로그인 히스토리 입력
	private static void createHistory(String loginID) {
		
		UserAdminLoginHis userAdminHistory = new UserAdminLoginHis();
		
		Date date = new Date();
		
		userAdminHistory.userID = loginID;
		userAdminHistory.loginDate = new Timestamp(date.getTime());
		userAdminHistory.loginIp = request.remoteAddress;
		
		userAdminHistory.save();
		
	}
	
	// 로그아웃
	public static void logoutProcess() {
		
		// 쿠키 삭제
		cookies.setCookie("BZ_ADMINUID", "");
		cookies.setCookie("BZ_ADMINUNAME", "");	
		
//    	cookies.expireCookies();
		String url = SITE_DOMAIN + "/admin";
		redirect(url);
	}
	
}

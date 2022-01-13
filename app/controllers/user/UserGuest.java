package controllers.user;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import models.User;
import play.mvc.Controller;
import utils.encryptors.SHA256Encryptor;


/**
 * 비회원 컨트롤러
 * @author YuJaeheon
 * @since 2012/02/13
 * 
 */

public class UserGuest extends Controller {
	
	public static void index() {
		render();
	}
	
	/* 회원 중복 체크 */
	public static void userIdCreate(String userID) {
		Map<String, Object> userData = new HashMap<String, Object>();
		
		long userCount;
		userCount = User.count("userID = '"+userID+"' ");
		
		if (userCount <= 0) {
			userData.put("newUserID", userID);
			userData.put("result", "200");
			
		} else {
			userData.put("newUserID", "");	
			userData.put("result", "400");
		}
		
		renderJSON(userData);
		
	}
	

	// 회원 정보
	public static void read(String userID) {
		
		// 아이디 체크
		if (userID == null || userID.trim().length() == 0){
			renderText("101");
			return;
		}
		
		// 회원 정보 변수 선언
		Map<String, Object> userData = new HashMap<String, Object>();
		
		// 값 매칭
		User user = User.findById(userID);
		userData.put("user", user);
		
		renderJSON(userData);
	
	}
	
	// 회원가입
	public static void create(User user) throws Exception {
		
		user.userPasswd = SHA256Encryptor.encrypt(params.get("userPasswd"));
		
		Date date = new Date();
		
		user.regDate = new Timestamp(date.getTime());
		user.updDate = new Timestamp(date.getTime());
		user.latestLoginDate = new Timestamp(date.getTime());
		
		user.save();

	}
	
}

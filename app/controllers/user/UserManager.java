package controllers.user;

import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import models.CodeDtl;
import models.User;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.FormMail;
import utils.PasswordReset;
import utils.encryptors.SHA256Encryptor;
import utils.validators.LoggedInUserInfo;

/**
 * 회원 컨트롤러
 * 
 * @author YuJaeheon
 * @since 2012/02/13
 * 
 */

@With(LoggedInUserInfo.class)
public class UserManager extends Controller {

	public static void index() {

		render();
	}

	/**
	 * 회원정보
	 */
	public static void read() {

		Cookies cookies = new Cookies();
		String userID = cookies.getCookie("BZ_UID");

		// 아이디 체크
		if (userID == null || userID.trim().length() == 0) {
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

	/**
	 * 회원가입 화면
	 */
	public static void join() throws UnsupportedEncodingException {

		Map<String, Object> data = new HashMap<String, Object>();

		// 코드 정보 class
		CodeController code = new CodeController();

		// 도메인 가져오기
		List<CodeDtl> domainInfo = code.getCodeDtl("0002");
		data.put("domainInfo", domainInfo);

		// 휴대폰번호 앞자리 가져오기
		List<CodeDtl> hpList = code.getCodeDtl("0003");
		data.put("hpList", hpList);

		render(data);
	}

	/**
	 * 회원가입
	 */
	public static void create(User user) throws Exception {

		if ("1800-01-01".equals(user.birth)) {
			user.birth = null;
		}

		user.userPasswd = SHA256Encryptor.encrypt(user.userPasswd);

		Date date = new Date();

		user.regDate = new Timestamp(date.getTime());
		user.updDate = new Timestamp(date.getTime());
		user.latestLoginDate = new Timestamp(date.getTime());

		user.save();

		// 폼메일
		FormMail mail = new FormMail();
		mail.join(user.email, user.userName);

		renderText("200");
	}

	/** 
	 * 회원정보 수정 화면
	 */
	public static void modify() {

		Cookies cookie = new Cookies();
		String userID = cookie.getCookie("BZ_UID");

		// 아이디 체크
		if (userID == null || userID.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 회원 정보 변수 선언
		Map<String, Object> data = new HashMap<String, Object>();

		// 코드 정보 class
		CodeController code = new CodeController();

		// 도메인 가져오기
		List<CodeDtl> domainInfo = code.getCodeDtl("0002");
		data.put("domainInfo", domainInfo);

		// 휴대폰번호 앞자리 가져오기
		List<CodeDtl> hpList = code.getCodeDtl("0003");
		data.put("hpList", hpList);

		// 회원정보
		User user = User.findById(userID);

		// 생일 정보
		String birth = user.birth;
		if (birth != null && birth.length() != 0) {
			String[] birthTemp = birth.split("-");

			// 비교를 위해 형변환
			int birthYear = Integer.parseInt(birthTemp[0]);
			int birthMonth = Integer.parseInt(birthTemp[1]);
			int birthDay = Integer.parseInt(birthTemp[2]);

			data.put("birthYear", birthYear);
			data.put("birthMonth", birthMonth);
			data.put("birthDay", birthDay);
		}

		// 휴대폰 정보
		String phone = user.phone;
		if (phone != null && phone.length() != 0) {
			String[] phoneTemp = phone.split("-");

			data.put("phone1", phoneTemp[0]);
			data.put("phone2", phoneTemp[1]);
			data.put("phone3", phoneTemp[2]);
		}
		// 이메일 정보
		String email = user.email;
		if (email != null && email.length() != 0) {
			String[] email_temp = email.split("@");
			data.put("emailID", email_temp[0]);
			data.put("emailDomain", email_temp[1]);
		}

		data.put("user", user);

		render(data);
	}

	/**
	 * 회원정보 수정
	 */
	public static void update(User user) throws Exception {

		if ("1800-01-01".equals(user.birth)) {
			user.birth = null;
		}

		if (user.userPasswd.length() < 64) {
			user.userPasswd = SHA256Encryptor.encrypt(user.userPasswd);
		}

		Date date = new Date();
		user.updDate = new Timestamp(date.getTime());

		user.save();
		renderText("200");
	}

	/**
	 * 아이디 중복 체크
	 * @param userID
	 */
	public static void userIDcheck(String userID) {

		// 필수입력값 체크
		// 리턴 코드값은 util/Constants.java에 정의
		if (userID == null || userID.trim().length() == 0) {
			renderText("101");
			return;
		}
		
		// 불가능한 아이디 세팅 . 중복 된걸로 인식 - 추후에 디비로 관리 할것
		if ("admin".equals(userID) || "administrator".equals(userID) || "fuck".equals(userID)) {
			renderText("200");
			return;

		}

		// 회원정보
		User user = User.findById(userID);

		if (user == null) {
			System.out.println(userID);
			renderText("401");
			return;
		}

		renderText("200");
	}

	/**
	 * 아이디 패스워드 찾기 화면
	 */
	public static void searchIdPassword() {
		render();

	}

	/**
	 * 아이디 찾기 
	 */
	public static void searchId(String userName, String email) {

		// 리턴 코드값은 util/Constants.java에 정의
		if (userName == null || userName.trim().length() == 0) {
			renderText("101");
			return;
		}

		if (email == null || email.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 회원정보
		List<User> userinfo = User.find("userName = ? AND email = ? ", userName, email).fetch();
		
		if (userinfo.size() == 0) {
			renderText("401");
			return;
		}
		
		String userId = "";
		userId = userinfo.get(0).userID;
		
		renderText(userId);

	}

	/**
	 * 패스워드 찾기
	 */
	public static void searchPassword(String userID, String userName, String email) throws Exception {

		if (userID == null || userID.trim().length() == 0) {
			renderText("101");
			return;
		}

		if (userName == null || userName.trim().length() == 0) {
			renderText("101");
			return;
		}

		if (email == null || email.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 회원정보
		User userinfo = User.find("userID = ? AND userName = ? AND email = ? ",	userID, userName, email).first();

		if (userinfo == null) {
			renderText("401");
			return;
		}

		// 패스워드 리셋
		PasswordReset passwordReset = new PasswordReset().create();
		String newPassword = passwordReset.password();

		User user = User.findById(userID);
		user.userID = userID;

		user.userPasswd = SHA256Encryptor.encrypt(newPassword);
		user.save();

		// 폼메일
		// String userId = userinfo.userID;
		String userEmail = userinfo.email;
		String userName1 = userinfo.userName;

		FormMail mail = new FormMail();
		mail.password(userEmail, userName1, newPassword);

		renderText("200");

	}

	/**
	 * 우편번호 찾기 화면
	 */
	public static void zipcode() {
		render();

	}

	/**
	 * 우편번호 찾기 결과 리스트 - 우편번호 api 에서 값을 가져옴
	 * @param dong
	 */
	public static void zipcodeSearch(String dong) {

		ZipCode zipcode = new ZipCode();
		List<Object> zipcodeList = zipcode.getPostAndAddress(dong);

		renderJSON(zipcodeList);

	}

	/**
	 *  회원가입 완료 이메일 보내기
	 *  
	 */	
	public static void sendEmail() {

	}

	/**
	 * 회원 이메일 수신 거부 처리
	 * 
	 * @param email
	 */
	public static void emailDeny(String email) {

		if (email == null || email.trim().length() == 0) {
			renderHtml("<script>alert('필수값이 전달되지 않았습니다.');window.close();</script>");
			return;
		}

		User user = User.find("email = ? ", email).first();

		if (user == null) {
			renderHtml("<script>alert('일치하는 정보가 존재하지 않습니다.');window.close();</script>");
			return;
		}

		user.mailling = 1;
		user.save();

		renderHtml("<script>alert('수신거부처리되었습니다.');window.close();</script>");
	}

}
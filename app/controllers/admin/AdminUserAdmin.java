package controllers.admin;

import static utils.Constants.BLOCK_LIST_COUNT;

import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import controllers.user.CodeController;
import controllers.user.ZipCode;



import models.CodeDtl;
import models.UserAdmin;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.Pagination;
import utils.encryptors.SHA256Encryptor;
import utils.validators.LoggedInValidatorUserAdmin;

/**
 * 제목 : 관리자 회원 컨트롤러
 * @author yujaeheon
 * @since 2012/02/13
 */
@With(LoggedInValidatorUserAdmin.class)
public class AdminUserAdmin extends Controller {

	public static void index() {
		render();
	}

	// 회원리스트
	public static void list(int page, String searchKey, String searchVal) {

		if (page == 0) {
			page = 1;
		}

		String where = "";
		if (searchKey != null && searchVal.trim().length() > 0) {
			where = makeSearch(searchKey, searchVal);
		}

		List<UserAdmin> userAdminList = UserAdmin.find(where + " ORDER BY regDate desc").from(((page - 1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);

		int userCount = (int) userAdminCount(where);
		int countNumber = countNumber(userCount, page);

		Pagination pagination = new Pagination("/admin/userAdmin/list", page, userCount);

		render(userAdminList, userCount, countNumber, page, pagination,	searchKey, searchVal);
	}

	public static String makeSearch(String searchKey, String searchVal) {

		String where = "1=1";

		if (searchKey != null && searchVal.length() > 0) {
			where = where + " AND " + searchKey + " like '%" + searchVal + "%'";
		}

		return where;

	}

	// 총 회원수
	private static long userAdminCount(String where) {
		long userAdminCount = UserAdmin.count(where);
		return userAdminCount;
	}

	// 리스트에서의 번호
	private static int countNumber(int totalCount, int page) {
		return totalCount - (BLOCK_LIST_COUNT * (page - 1));
	}

	// 회원 정보
	public static void read(String adminID) {

		// 아이디 체크
		if (adminID == null || adminID.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 회원 정보 변수 선언
		// 값 매칭
		UserAdmin userAdmin = UserAdmin.findById(adminID);
//		userAdminData.put("userAdmin", userAdmin);
		
		// 메뉴 나누기
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
		render(userAdmin, menuMap);
	}

	// 관리자 등록 폼
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

	// 관리자 등록
	public static void create(UserAdmin userAdmin) throws Exception {

		Cookies cookie = new Cookies();
		userAdmin.regID = cookie.getCookie("BZ_ADMINUID");

		userAdmin.adminPasswd = SHA256Encryptor.encrypt(userAdmin.adminID);

		Date date = new Date();

		userAdmin.latestLoginDate = new Timestamp(date.getTime());
		userAdmin.regDate = new Timestamp(date.getTime());
		userAdmin.updDate = new Timestamp(date.getTime());

		userAdmin.save();
		renderText("200");
	}

	// 관리자 정보 수정
	public static void update(UserAdmin userAdmin) throws Exception {
		
		Date date = new Date();
		userAdmin.updDate = new Timestamp(date.getTime());
		
		userAdmin.save();
		renderText("200");
	}

	// 관리자 삭제
	public static void delete(UserAdmin userAdmin) {
		userAdmin.delete();
	}

	// 아이디 중복 체크
	public static void userAdminIDcheck(String adminID) {

		// 필수입력값 체크
		// 리턴 코드값은 util/Constants.java에 정의
		if (adminID == null || adminID.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 회원정보
		UserAdmin userAdmin = UserAdmin.findById(adminID);

		if (userAdmin == null) {
			renderText("401");
			return;
		}

		renderText("200");
	}

	// 아이디 패스워드 찾기 폼
	public static void searchIdPassword() {
		render();

	}

	// 아이디 찾기
	public static void searchId(String adminName, String email) {

		// 리턴 코드값은 util/Constants.java에 정의
		if (adminName == null || adminName.trim().length() == 0) {
			renderText("101");
			return;
		}

		if (email == null || email.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 회원정보
		List<UserAdmin> userAdmininfo = UserAdmin.find(
				"adminName = ? AND email = ? ", adminName, email).fetch();
		String userAdminId = "";
		if (userAdmininfo.size() == 0) {
			renderText("401");
			return;
		} else {
			userAdminId = userAdmininfo.get(0).adminID;
		}

		renderText(userAdminId);

	}

	// 패스워드 찾기
	public static void searchPassword(String adminID, String adminName,
			String email) {
		// 리턴 코드값은 util/Constants.java에 정의
		if (adminID == null || adminID.trim().length() == 0) {
			renderText("101");
			return;
		}

		if (adminName == null || adminName.trim().length() == 0) {
			renderText("101");
			return;
		}

		if (email == null || email.trim().length() == 0) {
			renderText("101");
			return;
		}

		// 회원정보
		List<UserAdmin> userAdminInfo = UserAdmin.find(
				"adminID = ? AND adminName = ? AND email = ? ", adminID,
				adminName, email).fetch();

		if (userAdminInfo == null) {
			renderText("401");
			return;
		}
		String userAdminId = userAdminInfo.get(0).adminID;

		renderText(userAdminId);

	}

	// 우편번호 찾기 화면
	public static void zipcode() {
		render();

	}

	// 우편번호 찾기 결과 리스트 - 우편번호 api 에서 값을 가져옴
	public static void zipcodeSearch(String dong) {

		ZipCode zipcode = new ZipCode();
		List<Object> zipcodeList = zipcode.getPostAndAddress(dong);

		renderJSON(zipcodeList);

	}

	// 회원가입 완료 이메일 보내기
	public static void sendEmail() {

	}
	
	/**
	 * 회원 찾기 
	 * @author : 유정운
	 * @since : 2012년 2월 27일
	 */
	public static void findmember(){
		render();
	}

}

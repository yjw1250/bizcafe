package controllers.admin;

import static utils.Constants.BLOCK_LIST_COUNT;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import models.User;
import models.ViewUserReservation;
import play.mvc.Controller;
import play.mvc.With;
import utils.Pagination;
import utils.validators.LoggedInValidatorUserAdmin;

/**
 * 회원관리 
 * @author yujaeheon
 *
 */
@With(LoggedInValidatorUserAdmin.class)
public class AdminUserManager extends Controller {

	// 회원리스트
	public static void list(int page,String searchKey, String searchVal) {

		if (page == 0) {
			page = 1;
		}
		
		// 탈퇴된 회원은 제외
		String where = "1=1";
		if(searchKey != null && searchVal.trim().length() > 0) {
			where += makeSearch(searchKey, searchVal);
		}
		
//		List<User> userList = User.find(where + " Order by regDate desc").from(((page-1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);
		
		List<ViewUserReservation> userList = ViewUserReservation.find(where + " Order by regDate desc").from(((page-1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);
		
		int userCount = (int) userCount(where);
		int countNumber = countNumber(userCount,page);
		
		Pagination pagination = new Pagination("/admin/user/list", page, userCount);
//		renderJSON(userList);
		render(userList, userCount, countNumber,page, pagination, searchKey, searchVal);
		
	}
	
	public static void listJson(int page,String searchKey, String searchVal) {

		if (page == 0) {
			page = 1;
		}
		
		// 탈퇴된 회원은 제외
		String where = "1=1";
		if(searchKey != null && searchVal.trim().length() > 0) {
			where += makeSearch(searchKey, searchVal);
		}

//		List<User> userList = User.find(where + " Order by regDate desc").from(((page-1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);
		List<ViewUserReservation> userList = ViewUserReservation.find(where + " Order by regDate desc").from(((page-1) * BLOCK_LIST_COUNT)).fetch(BLOCK_LIST_COUNT);
		
		int userCount = (int) userCount(where);
		int countNumber = countNumber(userCount,page);
		Pagination pagination = new Pagination("/admin/user/list",page,userCount);

		Map<String, Object>	userMap = new HashMap<String, Object>();
		userMap.put("userList",userList);
		userMap.put("userCount", userCount);
		userMap.put("countNumber", countNumber);
		userMap.put("pagination", pagination);
		
		renderJSON(userMap);

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
//		renderText(userID);
		ViewUserReservation user = ViewUserReservation.findById(userID);
		userData.put("user", user);
		
		renderJSON(userData);
	
	}
	
	// 회원 삭제
	public static void delete(User user) {		
		user.delete();		
	}
	
	// 검색 
	public static String makeSearch(String searchKey, String searchVal) {

		String where = "";

		if(searchKey != null && searchVal.length() > 0) {
			where = where + " AND " + searchKey + " like '%" + searchVal + "%'";		
		}

		return where;

	}
	
	// 총 회원수
	private static long userCount(String where){
		long userCount = User.count(where);
		return userCount;
		
	}
	
	
	// 리스트에서의 번호
	private static int countNumber(int totalCount,int page){
    	return totalCount - (BLOCK_LIST_COUNT * (page - 1)); 
    }
    


}

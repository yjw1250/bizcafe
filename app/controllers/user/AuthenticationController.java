package controllers.user;

import play.libs.Crypto;
import play.mvc.Catch;
import play.mvc.Controller;
import utils.Cookies;

/**
 * 
 * @author YuJaeheon
 * @since 2012/02/13
 *  descrition 인증 컨트롤러 Authentication 
 */
public class AuthenticationController extends Controller {
	
	public static void index(){
		render();
	}
	/**
	 * 로그인 처리 
	 * 
	 * @param	userID, sslKey, errorResult	
	 * @return
	 * @exception	Exception	
	 */	       
    public static void loginPost(String userID, String sslKey, String errorResult) throws Exception {    	
    	Cookies cookie = new Cookies();
    	
    	// 권한 체크에서 오류가 발생했을 경우
    	if(errorResult != null && errorResult.length() > 0) {
    		cookie.setCookie("errorResult", errorResult);			
			index();
			return;
    	}
    	
		// 필수입력값 체크	
		if (userID == null || userID.trim().length() == 0 || sslKey == null || sslKey.trim().length() == 0){
			cookie.setCookie("errorResult", "103");			
			index();
			return;
		}
		
		// 선택한 관리자 정보   	
    	//if(adminView == null || !adminView.sslKey.equals(sslKey)) {
    		// 로그인 오류시 오류 코드 쿠키값 생성 후 로그인 페이지로 이동
    	//	cookie.setCookie("errorResult", "104");		
		//	index();
		//} else {
			// 암호화된 검증 쿠키 생성	
			// 사용자 타입 + 레벨 + 아이디 + 사용자 IP
			cookie.setCookie("EA_UID", userID);	
//			cookie.setCookie("EA_UNAME", userName);	
	    	
			redirect("/admin");
		//}
    }
    
    /**
	 * 로그아웃 처리 
	 * 
	 * @param		
	 * @return
	 * @exception	Exception	
	 */	    
    public static void logoutPost() throws Exception {
    	Cookies cookies = new Cookies();
    	cookies.expireCookies();
    	    	
    	index();
    }
    
    @Catch
    public static void exception() {
    	//System.out.println("LoginAdminContoller ERROR");    	
    } 
	
	
	
	
}

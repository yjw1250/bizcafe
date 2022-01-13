package controllers.user;

import models.CodeDtl;
import models.User;
import models.UserOut;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.FormMail;
import utils.validators.LoggedInUserInfo;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 회원탈퇴 컨트롤러
 * @author yujaeheon
 * @since 2012-03-02
 */
@With(LoggedInUserInfo.class)
public class UserOutManager extends Controller {
	
	// 회원 탈퇴 화면
	public static void index() {
		
		// 코드 정보 class
		CodeController code = new CodeController();
		
		// 휴대폰번호 앞자리 가져오기
		List<CodeDtl> outReason = code.getCodeDtl("0007");
		
		render(outReason);
		
	}
	
	// 회원 탈퇴 처리 
	public static void out(UserOut userOut) throws Exception {
		
		Cookies cookie = new Cookies();
		String userID = cookie.getCookie("BZ_UID");
		
		if (userID == null || userID.length() == 0) {
			renderText("101");
			return;
		}
		
		// 회원정보
		User user = User.findById(userID);
		
		userOut.userID =  user.userID;
		userOut.userName = user.userName;
		
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String regDate = formatter.format(user.regDate);
		
		long nowTime = System.currentTimeMillis();
		String outDate = formatter.format(nowTime);
		
		userOut.inDate = regDate;
		userOut.outDate = outDate;
		
		Date date = new Date();
		userOut.regDate = new Timestamp(date.getTime());
		
		// 탈퇴 정보 입력		
		userOut.save();
		
		String email = user.email;		
		
		// 회원정보 지우기
		user.userID = userID;
		user.userName = "";
		user.userPasswd = "";
		user.userLevel = 0;
		user.birth = "1800-01-01";
		user.email = "";
		user.mailling = 0;
		user.phone = "";
		user.zip1 ="";
		user.zip2 = "";
		user.addr1 = "";
		user.addr2 = "";
		user.outDate = new Timestamp(date.getTime());
		
		// 회원정보 수정
		user.save();
		
		// 폼메일 
		if (email != null && !("".equals(email))) {
			FormMail mail = new FormMail();
			mail.out(email);
		}
    	
		// 로그아웃 처리 
		Cookies cookies = new Cookies();
    	cookies.expireCookies();
		
    	renderText("200");

	}
	
}

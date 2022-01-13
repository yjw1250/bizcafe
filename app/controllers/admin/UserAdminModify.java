package controllers.admin;

import java.sql.Timestamp;
import java.util.Date;

import models.UserAdmin;
import play.mvc.Controller;
import play.mvc.With;
import utils.Cookies;
import utils.encryptors.SHA256Encryptor;
import utils.validators.LoggedInValidatorUserAdmin;

/**
 * 관리자 정보 수정
 * @author yujaeheon
 * @since 2012/02/13
 */
@With(LoggedInValidatorUserAdmin.class)
public class UserAdminModify extends Controller {
	
	public static void index() {
		
		Cookies cookies = new Cookies();
		
		String adminID = cookies.getCookie("BZ_ADMINUID");
		
		UserAdmin userAdmin = UserAdmin.findById(adminID);
		
	
		render(userAdmin);
	}
	
	// 관리자 정보 수정
	public static void update(UserAdmin userAdmin) throws Exception {
		
		if (userAdmin.adminPasswd.trim() != null || !"".equals(userAdmin.adminPasswd.trim()) ) {
			if (userAdmin.adminPasswd.length() < 64) {
				userAdmin.adminPasswd = SHA256Encryptor.encrypt(userAdmin.adminPasswd);
			
			}
		}
		
		Date date = new Date();
		userAdmin.updDate = new Timestamp(date.getTime());
		
		userAdmin.save();
		renderText("200");
	}

}	

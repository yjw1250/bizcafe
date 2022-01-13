package controllers.user;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import models.ReservationRoom;
import models.SendSMS;
import models.User;
import models.ViewRoomPerson;
import play.db.jpa.JPA;
import play.mvc.Controller;
import utils.Cookies;
import utils.JeiUtils;
import static utils.Constants.SITE_NAME;
import static utils.Constants.SITE_TEL_NO;
import static utils.Constants.SMS_LIMIT;
/**
 * SMS 처리
 * @author 유정운
 * 
 */
public class SmsManager extends Controller{

	/**
	 * 인증 번호 발송(페이지 호출시)
	 * @param sendsms
	 */
	public static void sendsmsJSON(SendSMS sendsms){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		Date date = new Date();
		JeiUtils utils = new JeiUtils();
		Cookies cookie = new Cookies();			
		User user = User.findById(cookie.getCookie("BZ_UID"));
		String phone = "";
		if (user == null) {
			sendsms.recID = "";
			phone = sendsms.recPhone;
		} else {
			sendsms.recID = user.userID;
			sendsms.recName = user.userName;
			phone = user.phone;
		}
		
		if(sendsms.recPhone == null){
			sendsms.recPhone = user.phone;
			phone = user.phone;
		}
		else{
			phone = sendsms.recPhone;
		}
		
		
		sendsms.regDate = new Timestamp(date.getTime());
		sendsms.certifyNo = utils.randcode("num", 6); //6자리로 된 랜덤 인증번호(숫자) 생성
		sendsms.save();
		long lastidx = sendsms.getIdx();
		SendSMS chksms  = sendsms.findById(lastidx);
		Date TRSENDDATE = new Timestamp(date.getTime());
		String TRMSG = SITE_NAME + "에 요청하신 인증번호는 [" + chksms.certifyNo + "] 입니다";
		String TRPHONE = SITE_TEL_NO;
		
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String sRegDate = formatter.format(sendsms.regDate);
		String chkQuery = "select count(1) as cnt FROM jeisms.SC_TRAN where TR_PHONE='"+phone+"' and TR_SENDDATE like '"+sRegDate+"%'";
		Query countquery = JPA.em().createNativeQuery(chkQuery);
		
		//System.out.println("chkQuery =" + chkQuery);
		
		int totalCount = countquery.getSingleResult().hashCode();
		
		//System.out.println(totalCount);
		
		if(totalCount > SMS_LIMIT){
			String msg = "금일 SMS 문자 발송 제한 횟수를 초과하였습니다.";
			jsonData.put("result", "400"); 
			jsonData.put("msg",msg);
			jsonData.put("certifyNo", "");
		}
		else{
			JPA.em().createNativeQuery(" insert into jeisms.SC_TRAN (TR_SENDDATE,TR_PHONE,TR_CALLBACK,TR_MSG) " +  " values ('"+TRSENDDATE+"','"+phone+"','"+TRPHONE+"','"+TRMSG+"')")
			.executeUpdate();
			jsonData.put("result", "200");
			jsonData.put("certifyNo", chksms.certifyNo);
		}
		
		
		
		renderJSON(jsonData);
	}
	
	/**
	 * 인증번호 조회
	 * @param certifysms
	 */
	public static void certifysmsJSON(String certifyNo){
		Map<String, Object> jsonData = new HashMap<String, Object>();
		List<SendSMS> sendsms  = SendSMS.find(" certifyNo = '"+certifyNo+"' ").fetch(1);
		if(sendsms.isEmpty() == false){
			jsonData.put("result", "200"); 
			jsonData.put("certifyNo", sendsms.get(0).certifyNo);
			renderJSON(jsonData);
			return;
		}
		jsonData.put("result", "400"); 
		renderJSON(jsonData);
		
	}
	
}
package utils;

import static utils.Constants.SITE_TEL_NO;
import static utils.Constants.SMS_LIMIT;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Query;

import models.SendSMS;
import models.User;
import play.db.jpa.JPA;

public class Sms {
	
	/**
	 * 사용자단 SMS 보내기
	 * @param Flag
	 * @param Msg
	 * @return
	 */
	public static boolean sendSms(String Flag,String Msg){
		SendSMS sendSms = new SendSMS();
		Date date = new Date();
		Cookies cookie = new Cookies();			
		User user = User.findById(cookie.getCookie("BZ_UID"));
		
		sendSms.recID = user.userID;
		sendSms.recName = user.userName;
		sendSms.recPhone = user.phone;
		sendSms.sendFlag = Flag;
		sendSms.sendMsg = Msg;
		sendSms.regDate = new Timestamp(date.getTime());
		sendSms.save();
	
		long lastIdx = sendSms.getIdx();
		SendSMS chkSms  = sendSms.findById(lastIdx);
		
		if(chkSms == null){
			return false;
		}	
		
		Date TRSENDDATE = new Timestamp(date.getTime());
		String TRMSG = Msg;
		String TRPHONE = SITE_TEL_NO;
		
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String sRegDate = formatter.format(sendSms.regDate);
		String chkQuery = "select count(1) as cnt FROM jeisms.SC_TRAN where TR_PHONE='"+user.phone+"' and TR_SENDDATE like '"+sRegDate+"%'";
		Query countquery = JPA.em().createNativeQuery(chkQuery);
		
		int totalCount = countquery.getSingleResult().hashCode();
		if(totalCount > SMS_LIMIT){
			//System.out.println("sms 발송 안됐어요~~~");
			return false;
		}
		
		JPA.em().createNativeQuery(" insert into jeisms.SC_TRAN (TR_SENDDATE,TR_PHONE,TR_CALLBACK,TR_MSG) " +  " values ('"+TRSENDDATE+"','"+user.phone+"','"+TRPHONE+"','"+TRMSG+"')")
		.executeUpdate();
		return true;
		
		
	}
	
	
    /**
     * 관리자단 sms 보내기
     * @param Flag
     * @param Msg
     * @return
     */
    public static boolean sendAdminSms(User user,String Flag,String Msg){
		
		SendSMS sendSms = new SendSMS();
		Date date = new Date();
		sendSms.recID = user.userID;
		sendSms.recName = user.userName;
		sendSms.recPhone = user.phone;
		sendSms.sendFlag = Flag;
		sendSms.sendMsg = Msg;
		sendSms.regDate = new Timestamp(date.getTime());
		sendSms.save();
	
		long lastIdx = sendSms.getIdx();
		SendSMS chkSms  = sendSms.findById(lastIdx);
		
		if(chkSms == null){
			return false;
		}
		
		Date TRSENDDATE = new Timestamp(date.getTime());
		String TRMSG = Msg;
		String TRPHONE = SITE_TEL_NO;
		
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String sRegDate = formatter.format(sendSms.regDate);
		String chkQuery = "select count(1) as cnt FROM jeisms.SC_TRAN where TR_PHONE='"+user.phone+"' and TR_SENDDATE like '"+sRegDate+"%'";
		Query countquery = JPA.em().createNativeQuery(chkQuery);
		
		int totalCount = countquery.getSingleResult().hashCode();
		if(totalCount > SMS_LIMIT){
			//System.out.println("sms 발송 안됐어요~~~");
			return false;
		}

		JPA.em().createNativeQuery(" insert into jeisms.SC_TRAN (TR_SENDDATE,TR_PHONE,TR_CALLBACK,TR_MSG) " +  " values ('"+TRSENDDATE+"','"+user.phone+"','"+TRPHONE+"','"+TRMSG+"')")
		.executeUpdate();
		return true;
		
		
	}
}

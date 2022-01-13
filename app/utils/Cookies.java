package utils;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import play.mvc.Http;
import play.mvc.Http.Cookie;
import utils.encoders.Base64Decoder;
import utils.encoders.Base64Encoder;

/**
 * 쿠키 class
 *
 * @since	2012-02-06
 * @author	이상준
 */
public class Cookies {

    /**
	 * 쿠키값 설정 
	 * 
	 * @param	key, value
	 * @return
	 * @exception	Exception	
	 */		
	public void setCookie(String key, String value) {	
		
		if(key != null && key.length() > 0) {
			if(value!= null && value.length() > 0) {	
				try {			
					Http.Response.current().setCookie(key,Base64Encoder.encode(value).replaceAll("\r\n", ""));
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}				
			} else {				
				Http.Response.current().removeCookie(key) ;
			}		
		}		
	}

    /**
	 * 쿠키값 삭제 (특정 쿠키)
	 * 
	 * @param	key
	 * @return
	 * @exception		
	 */	
	public void expireCookie(String key) {
		Http.Response.current().removeCookie(key) ;		
	}

    /**
	 * 쿠키값 삭제 (전체 쿠키)
	 * 
	 * @param	
	 * @return
	 * @exception		
	 */	
	public void expireCookies() {
    	Map<String, Cookie> cookieData = Http.Request.current().cookies;
		
    	// 현재 설정된 쿠키값 모두 리턴
    	Set<String> keySet = cookieData.keySet();
    	Iterator<String> iterator = keySet.iterator();
		  
    	if(!keySet.isEmpty()) {
    		while(iterator.hasNext()){
    			String key = iterator.next();
    			Http.Response.current().removeCookie(key) ;	
    		}
    	}
	}
	
    /**
	 * 쿠키값 반환 
	 * 
	 * @param	key
	 * @return	String
	 * @exception	
	 */		
	public String getCookie(String key) {
		
		String returnVal = "" ;				
		
		if(key != null && key.length() > 0) {
			try {
				returnVal = Http.Request.current().cookies.get(key) == null ? "" : Base64Decoder.decode(Http.Request.current().cookies.get(key).value);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}		
		return returnVal ;
	}
	
    /**
	 * 모든 쿠키값을 문자로 리턴 
	 * 
	 * @param		
	 * @return
	 */		
	public String toString(){

    	Map<String, Cookie> cookieData = Http.Request.current().cookies;
    	
		String returnTxt = "";		
	
    	// 현재 설정된 쿠키값 모두 리턴
    	Set<String> keySet = cookieData.keySet();
    	Iterator<String> iterator = keySet.iterator();
		  
    	if(!keySet.isEmpty()) {
    		while(iterator.hasNext()){
    			String key = iterator.next();
    			String value = "";
    			
				try {
					value = cookieData.get(key) == null ? "" : Base64Decoder.decode(cookieData.get(key).value);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
    			
    			returnTxt += key +" : " + value + "\r\n";    						  
    		}
    	}
    	
    	return returnTxt ;
	}
}

package utils;

import utils.encryptors.SHA256Encryptor;

/**
 * 
 * @author yujaeheon
 * 비밀번호 세팅
 *
 */
public class PasswordReset {
	
	public static PasswordReset create() {
		return new PasswordReset();
	}
	
	public static String password() throws Exception {
		
		long nowTime = System.currentTimeMillis();
		
		String a1 = Long.toString(nowTime);
		
		long a = Long.valueOf(a1.substring(0,8)).longValue();
		long b = Long.valueOf(a1.substring(5)).longValue();
		
		long c = a+b;
		String d = Long.toString(c);
		String e = SHA256Encryptor.encrypt(d);
		String f = e.substring(0,8);
		

		return f;
	}
	
}
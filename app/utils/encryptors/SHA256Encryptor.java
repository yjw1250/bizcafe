package utils.encryptors;

import java.security.MessageDigest;

/**
 * SHA-256 단방향 암호화 Class
 * SHA-256은 64바이트 문자열로 암호화 된다. 
 * SHA-256 온라인 암호화 사이트 : http://hash.online-convert.com/sha256-generator
 * 
 * @author	김용웅
 * @since	2012/01/25
 * 
 */
public class SHA256Encryptor extends Encryptor {
	
	/**
	 * SHA-256 방식으로 암호화 한다. 
	 * 
	 * @param		source
	 * @return		String
	 * @exception	Exception
	 */
	public static String encrypt(String source) throws Exception {
		if (source == null || source.trim().length() == 0)
			return "";

		byte[] b = source.getBytes(); 
		MessageDigest digest = MessageDigest.getInstance("SHA-256");
		digest.update(b);
		byte[] hash = digest.digest();
		return byteArrayToHex(hash);    	
    }

}
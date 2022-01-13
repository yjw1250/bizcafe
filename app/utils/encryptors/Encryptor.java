package utils.encryptors;

/**
 * 암호화 공통 Class
 * 암호화 클래스들은 이 클래스를 상속 받아 개발한다.
 * 
 * @author	김용웅
 * @since	2012/01/25
 * 
 */
public class Encryptor {
	
	/**
	 * byteArray 배열형 데이터를 16진수형으로 변환한다. 
	 * 
	 * @param		source
	 * @return		String
	 * @exception
	 */
	public static String byteArrayToHex(byte[] ba) {
	    if (ba == null || ba.length == 0) {
	        return null;
	    }

	    StringBuffer sb = new StringBuffer(ba.length * 2);
	    String hexNumber;
	    for (int x = 0; x < ba.length; x++) {
	        hexNumber = "0" + Integer.toHexString(0xff & ba[x]);
	        sb.append(hexNumber.substring(hexNumber.length() - 2));
	    }

	    return sb.toString();
	}
}
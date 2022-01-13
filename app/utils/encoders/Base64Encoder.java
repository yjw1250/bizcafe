package utils.encoders;

import sun.misc.BASE64Encoder;

/**
 * 문자열을 Base64로 인코딩 하는 Class
 * ※ Base64 웹 인코더 : http://base64encode.org/
 * 
 * @author	김용웅
 * @since	2012/01/20
 * 
 */
public class Base64Encoder {

	/**
	 * 문자열을 Base64로 인코딩 한다. 
	 * 
	 * @param	source
	 * @return	String
	 */
	public static String encode(String source) throws Exception {
		if (source == null || source.length() == 0)
			return "";

		BASE64Encoder encoder = new BASE64Encoder();
		return encoder.encode(source.getBytes());
	}
}
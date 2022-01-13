package utils.encoders;

import sun.misc.BASE64Decoder;

/**
 * 문자열을 Base64로 디코딩 하는 Class
 * ※ Base64 웹 디코더 : http://base64decode.org/
 * 
 * @author	김용웅
 * @since	2012/01/20
 * 
 */
public class Base64Decoder {

	/**
	 * Base64로 인코딩된 문자열을  디코딩 한다.
	 *
	 * @param	source
	 * @return	String
	 */	
	public static String decode(String source) throws Exception {
		if (source == null || source.length() == 0)
			return "";
		
		BASE64Decoder decoder = new BASE64Decoder();
		return new String(decoder.decodeBuffer(source));		
	}
}
package utils;

import java.text.ParseException;
import java.util.Date;
import java.util.Random;

public class JeiUtils {
	
	// option 만드는 함수 Integer 로 구성
	public String select(int start,int end, int value) {
		
		String options="";
		for (int i = start ; i <= end ; i++) {
			if (i == value) {
				options = options + "<option value='"+i+"' selected>"+i+"</option>";
			} else {
				options = options + "<option value='"+i+"'>"+i+"</option>";				
			}
		}
		return options;
	
	}
	
	/**
	 * 랜덤 코드 생성기
	 * @param type : 종류(num:숫자만,str:문자열만)
	 * @param length : 길이
	 * @return
	 */
	public String randcode(String type,int length){
		
		StringBuffer buffer = new StringBuffer();  
		Random random = new Random();   
		String chars[] =     "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");   
		for (int i=0 ; i<length ; i++)  {    
			if(type.equals("num")){
				buffer.append(random.nextInt(9));  
			}else if(type.equals("str")){
				buffer.append(chars[random.nextInt(chars.length)]);  
			}
		}
		
		String randnumber;
		randnumber = buffer.toString();
		
		return randnumber;
	}
	
	/**
	 * 날짜 포맷 변경(시간변경 오류 있슴 : 수정필요)
	 * @param convertdate : 예(날짜 데이타)
	 * @param format : 예 (YYYY-mm-dd)
	 * @return
	 * @throws ParseException 
	 */
	public String getformatdate(String convertdate, String format){
		try {
			java.text.SimpleDateFormat formatdate = new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.KOREA);  
			Date date = formatdate.parse(convertdate);			
			java.text.SimpleDateFormat format1 = new java.text.SimpleDateFormat(format, java.util.Locale.KOREA);   
			String dateString = format1.format(date);
			return dateString;
		} catch (ParseException e) {
			e.printStackTrace();
			String dateString = convertdate;
			return dateString;
		} 
		
	}
	
	public String nl2br(String str) {
		   str = str.replaceAll("\r\n", "<br>");
		   str = str.replaceAll("\r", "<br>");
		   str = str.replaceAll("\n", "<br>");
		   return str;
	}

}

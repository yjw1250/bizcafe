package models;

import java.sql.Date;
import java.text.SimpleDateFormat;

import play.db.jpa.GenericModel;
import play.db.jpa.Model;
 
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.joda.time.format.DateTimeFormat;

/**
* 게시판 모델 LIST
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/
@Entity
public class ViewsJeiBoardView extends JeiModel {
	
	public String boardCode;        
	public int category;
	public String regUserId;//작성자 ID                                                                                                                       
	public String regUserName;//작성자 이름                                                                                                                   
	public String title;//제목
	public String contents;//내용
	public int hitNum;//조회수
	public int fileNum;//파일 갯수
	public String adminCode;//관리자 아이디
	public String adminName;//관리자 명
	public java.sql.Timestamp regDate;//등록일                                                                                                                          
	public java.sql.Timestamp updDate;//수정일                                              
	public String etcVarchar1;//Q&A는 답변으로 사용함
   	
	/**
	 * 리스트에 boardCode 명
	 */     
	public String getBoardName() {
		if (boardCode == null)
			return "";
		
		if (boardCode.equals("notice"))
			return "공지사항";
		
		if (boardCode.equals("faq"))
			return "FAQ";

		return "";
	}
	
	/**
	 * datetime 형식의 날짜 노출을 2012-02-03 으로 변환
	 */  
	public String getRegDate(){
		SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd (HH:mm)"); 
		String textDate=dateTimeFormat.format(regDate);
		return textDate;
	}
	
	public String getUpdDate(){
		SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd (HH:mm)"); 
		String textDate=dateTimeFormat.format(updDate);
		return textDate;
	}
	
	public String getCategory(){
		

		if(category == 1){
			return "이용";
		}
		
		if(category == 2){
			return "장소";
		}
		if(category == 3){
			return "요금";
		}
		
		return "";
	}
}
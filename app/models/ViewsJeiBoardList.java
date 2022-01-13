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
public class ViewsJeiBoardList extends JeiModel {
	
	public String boardCode;
	public String parentBoardCode;//게시판 원래코드                                                                                                             
	public int parentIdx;//부모 ID                                                                                                                          
	public int depathIdx;//답변 ID                                                                                                                          
	public int levelIdx ;//답변 정렬                                                                                                                                                                                                                          
	public String isNotice;//공지사항 A:게시판 공지 , B:각 게시판 코드 공지                                                                    
	public int category;//대 카테고리                                                                                                                   
	public int subCategory;//중 카테고리                                                                                                                   
	public int lowCategory;//소 카테고리                                                                                                                   
	public String regUserId;//작성자 ID                                                                                                                       
	public String regUserName;//작성자 이름                                                                                                                   
	public String regUserHkey;//작성자 회원번호                                                                                                             
	public String regUserType;//작성자 회원타입 A - 학습지 회원,B - 정회원 , C - 회원 , D - 사원 , E - 선생님 , F - 비회원 , Z - 관리자
	public String title;//제목
	public String contents;//내용
	public int hitNum;//조회수                                                                                                                          
	public int commentNum;//코멘트수                                                                                                                       
	public String viewCD;//노출 Y:노출 N:비노출                                                                                                        
	public java.sql.Timestamp regDate;//등록일                                                                                                                          
	public java.sql.Timestamp updDate;//수정일                                              
   	public String etcVarchar1;//Q&A에서 답변 글로 사용함
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
		SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd"); 
		String textDate=dateTimeFormat.format(regDate);
		return textDate;
	}
	
	public String getCategory(){
		
		if(category == 1){
			return "이용";
		}
		
		if(category == 2){
			return "요금";
		}
		if(category == 3){
			return "서비스";
		}
		if(category == 4){
			return "기타";
		}
		if(category == 5){
			return "직원채용";
		}
		
		return "";
	}

}
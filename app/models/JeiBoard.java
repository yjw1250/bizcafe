package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Transient;

import net.sf.oval.constraint.MaxSize;

/**
* 게시판 모델 , INSERT , UPDATE
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/
@Entity
public class JeiBoard extends JeiModel {

	public String boardCode;// 게시판 코드
	public String parentBoardCode;//게시판 원래코드
	public int parentIdx;//부모 ID                                                                                                                          
	public int depathIdx;//답변 ID                                                                                                                          
	public int levelIdx ;//답변 정렬                                                                                                                      
	public String isComment;//코멘트                                                                                                                          
	public int parentBoardId;//코멘트 게시판 ID                                                                                                             
	public String isNotice;//공지사항 A:게시판 공지 , B:각 게시판 코드 공지                                                                    
	public int category;//대 카테고리                                                                                                                   
	public int subCategory;//중 카테고리                                                                                                                   
	public int lowCategory;//소 카테고리                                                                                                                   
	public String regUserId;//작성자 ID                                                                                                                       
	public String regUserName;//작성자 이름                                                                                                                   
	public String regUserHkey;//작성자 회원번호                                                                                                             
	public String regUserType;//작성자 회원타입 A - 학습지 회원,B - 정회원 , C - 회원 , D - 사원 , E - 선생님 , F - 비회원 , Z - 관리자
	public String regUserEmail;//작성자 이메일                                                                                                                
	public String regUserIp;//작성자 아이피                                                                                                                
	public String title;//제목
	
	//@Lob
	//@Column(length=4000000, nullable=false) 
	public String contents;//내용                                                                                                                             
	public int hitNum;//조회수                                                                                                                          
	public int commentNum;//코멘트수                                                                                                                       
	public int fileNum;//파일수                                                                                                                          
	public int downloadNum;//다운로드수                                                                                                                    
	public int recommendNum;//추천수                                                                                                                          
	public int badRecommendNum;//비추천수                                                                                                                       
	public int goodNum;//좋아요수                                                                                                                       
	public int badNum;//싫어요수                                                                                                                                                                                                   
	public String viewCD;//노출 Y:노출 N:비노출                                                                                                        
	public String adminCode;//관리자 아이디                                                                                                                
	public String adminName;//관리자 명                                                                                                                      
	public String adminComment;//관리자 끼리만 보는 코멘트
	public java.sql.Timestamp regDate;//등록일                                                                                                                          
	public java.sql.Timestamp updDate;//수정일                                              
	public int etcInt1;//INT 여유필드1
	public int etcInt2;//INT 여유필드2',
	public int etcInt3;//INT 여유필드3',
	public int etcInt4;//INT 여유필드4',
	public int etcInt5;//INT 여유필드5',
	public String etcVarchar1;//VARCHAR 여유필드1',
	public String etcVarchar2;//VARCHAR 여유필드2',
	public String etcVarchar3;//VARCHAR 여유필드3',
	public String etcVarchar4;//VARCHAR 여유필드4',
	public String etcVarchar5;//VARCHAR 여유필드5',
	   
}
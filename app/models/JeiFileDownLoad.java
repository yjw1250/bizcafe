package models;

import javax.persistence.Entity;

/**
* 파일 다운로드 HISTORY
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/
@Entity
public class JeiFileDownLoad extends JeiModel {
	
	public String tableName;//'테이블 명',
	public String boardCode;//게시판 코드
	public long boardIdx;//'게시물 idx',
	public long fileIdx;//'파일 idx,
	public String regUserId;//다운로드 ID
	public String regUserName;//다운로드 ID
	public java.sql.Timestamp regDate;//등록일             
}

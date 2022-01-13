package models;

import javax.persistence.Entity;

/**
* 파일 정보
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/
@Entity
public class JeiFile extends JeiModel {
	
	public String tableName;//'테이블 명',
	public String boardCode;//게시판 코드
	public long boardIdx;//'게시물 idx',
	public String fileType;//'파일 업로드 방법 A : 파일업로드 , B : 파일 경로',
	public String fileFormat;//'파일 포멧 A:일반 B:썸네일 C:큰이미지',
	public String fileUrl;//'파일 경로',
	public String fileName;//'파일 명',
	public String fileRealName;//'실제 파일명',
	public String fileExt;//'파일 확장자',
	public int fileWidth;//'파일 넓이',
	public int fileHeight;//'파일 높이',
	public long fileSize;//'파일 크기',
	public int filDownLoadCount;//'파일 다운로드수',

}

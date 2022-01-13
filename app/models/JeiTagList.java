package models;

import javax.persistence.Entity;
import javax.persistence.Transient;

/**
* 태그
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/
@Entity
public class JeiTagList extends JeiModel {

	public String tableName;//'테이블 명',
	public String boardCode;//'게시판 코드',
	public long boardIdx;//'게시물 idx',
	public String tag;//'태그',

}
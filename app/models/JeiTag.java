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
public class JeiTag extends JeiModel {
	
	public String tag;//'태그 명',
	public int tagCnt;//'태그 수',
	
}

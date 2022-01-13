package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.jpa.GenericModel;

/**
 * 인원수를 가져온다
 * 
 * @author	유정운
 * @since	2012-02-17
 */
@Entity
public class ViewRoomPerson extends GenericModel{
	
	@Id
	public int maxPerson;
}

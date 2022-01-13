package models;

import javax.persistence.Entity;
import javax.persistence.Table;

import play.db.jpa.Blob;
import play.db.jpa.Model;


/**
 * 에디터상 이미지 업로드 정보
 * @author babyyh
 * @since  2012-03-14
 */

@Entity
@Table(name="Upload")
public class Upload extends Model {
 
	/**
	 * 원본 파일명
	 */	
    public String photoFileName;
    
    /**
	 * 컨버젼된 파일명
	 */    
    public Blob photo;
    
    @Override
    public void _delete() {
       super._delete();
       photo.getFile().delete();
    }

}
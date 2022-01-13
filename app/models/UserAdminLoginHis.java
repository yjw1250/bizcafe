package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.jpa.GenericModel;

import com.sun.istack.internal.NotNull;

/**
 * 관리자 로그인 히스토리
 * @since	2012-02-13
 * @author	유재헌
 */
@Entity
public class UserAdminLoginHis extends GenericModel {
	
	/**
	 * 관리자 아이디
	 */
	@Id
    @NotNull
    public String userID;
	
	/** 
	 * 로그인 일시
	 */
    public Timestamp loginDate;
    
    /** 
     * 로그인 아이피
     */
    public String loginIp;
	
	
}

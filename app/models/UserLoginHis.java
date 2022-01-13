package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import com.sun.istack.internal.NotNull;

import play.db.jpa.GenericModel;

/**
 * 회원로그인 히스토리
 * @since	2012-02-13
 * @author	유재헌
 */
@Entity
public class UserLoginHis extends GenericModel {

	/**
	 * 회원아이디
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
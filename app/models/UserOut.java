package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import com.sun.istack.internal.NotNull;

import play.db.jpa.GenericModel;

/**
 * 회원탈퇴
 * @since	2012-02-13
 * @author	유재헌
 */
@Entity
public class UserOut extends JeiModel {

	/**
	 * 회원 아이디
	 */
    public String userID;
    
    /**
     * 회원 이름
     */
    public String userName;
    
    /**
     * 회원가입 일시
     */
    public String inDate;
    
    /**
     * 회원 탈퇴 일시
     */
    public String outDate;
    
    /**
     * 회원 탈퇴 이유
     */    
    public String outReason;
    
    /**
     * 회원탈퇴 상세 이유
     */
    public String outReasonDetail;
    
    /**
     * 등록 아이디
     */
    public String regID;
    
    /** 
     * 적용일
     */
    public Timestamp regDate;
    

}
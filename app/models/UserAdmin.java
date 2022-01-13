package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import com.sun.istack.internal.NotNull;

import play.db.jpa.GenericModel;

/**
 * 관리자 정보
 * @author	유재헌
 * @since	2012-02-13
 */
@Entity
public class UserAdmin extends GenericModel {

	/**
	 * 관리자 아이디	
	 */
    @Id
    @NotNull
    public String adminID;
    
    /**
     * 관리자 이름
     */   
    public String adminName;
    
    /**
     * 관리자 패스워드
     */
    public String adminPasswd;
    
    /** 
     * 관리자 레벨
     */
    public String adminLevel;
    
    /**
     * 부서
     */
    public String department;
    
    /**
     * 직급
     */
    public String duty;
    
    /**
     * 회사
     */
    public String company;
    
    /** 
     * 메일
     */
    public String email;
    
    /** 
     * 전화번호
     */
    public String tel;
    
    /**
     * 휴대폰 번호
     */
    public String hp;
    
    /**
     * 회원접속 상태
     */
    public String stateCD;
    
    /**
     * 최근 로그인 일시
     */
    public Timestamp latestLoginDate;
    
    /** 
     * 최근 로그인 아이피
     */
    public String latestLoginIp;
    
    /** 
     * 최근 로그인 실패 일시
     */
    public Timestamp latestLoginFailDate;
    
    /**
     * 최근 로그인 실패 아이피
     */
    public String latestLoginFailIp;
    
    /**
     * 메뉴 권한
     * 권한이 있으면 ,(콤마)로 구분하여 메뉴 번호 입력
     */
    public String menuAuthority;
    
    /**
     * 등록 아이디
     */
    public String regID;
    
    /**
     * 등록 일시
     */
    public Timestamp regDate;
    
    /** 
     * 수정 일시
     */
    public Timestamp updDate;


}
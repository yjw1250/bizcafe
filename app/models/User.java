package models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.jpa.GenericModel;

import com.sun.istack.internal.NotNull;

/**
 * 회원정보
 * @since	2012-02-13
 * @author	유재헌
 */
@Entity
public class User extends GenericModel {
	
	/**
	 * 회원 아이디
	 */
    @Id
    @NotNull
    public String userID;
   
    /**
     * 회원 성명
     */
    public String userName;
    
    /**
     * 회원 패스워드
     */
    public String userPasswd;
    
    /**
     * 회원 권한
     */
    public int userLevel;
    
    /**
     * 생년월일 
     * 형식 : 2000-01-01
     */
    public String birth;
    
    /**
     * 이메일
     */
    public String email;
    
    /**
     * 메일 수신여부
     * 1 : 수신 , 0 : 미수신
     */
    public int mailling;
    
    /**
     * 휴대폰 번호
     */
    public String phone;
    
    /**
     * 우편번호 앞자리
     */
    public String zip1;
    
    /**
     * 우편번호 뒷자리
     */
    public String zip2;
    
    /**
     * 주소: 우편번호 검색후 나오는 주소
     */
    public String addr1;
    
    /**
     * 나머지 주소
     */
    public String addr2;
    
    /**
     * 등록 관리자 아이디
     */
    public String regAdminID;
    
    /**
     * 가입일시
     */
    public Timestamp regDate;
    
    /**
     * 수정관리자 아이디
     */
    public String updAdminID;
    
    /**
     * 수정일시
     */
    public Timestamp updDate;
    
    /**
     * 탈퇴 일시
     */
    public Timestamp outDate;
    
    /**
     * 최근 로그인 일시
     */
    public Timestamp latestLoginDate;
    
    /**
     * 최근 로그인 아이피 
     */
    public String latestLoginIp;

}
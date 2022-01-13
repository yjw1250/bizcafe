package utils;

import java.io.File;


/**
* 게시판에 필요한 리스트 목록 기본 설정
*
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/

public class Constants {
	
	public static String SITE_DOMAIN = "http://biz1.jei.com"; //테스트
	//public static String SITE_DOMAIN = "http://www.bizstudio.co.kr"; //실서버

    public int nowPage 	= 1;
    public static int BLOCK_LIST_COUNT	= 10;
    public static int BLOCK_PAGE_GALLERY_COUNT	= 12;
    public static int BLOCK_PAGE_COUNT	= 10;
    public static long fileLimit = 2*1024*1024; //업로드 가능한 파일의 용량은 기본 2메가  
    public static String upLoadDirPath = "data";//파일 업로드 기본 폴더    
    public static String upLoadDirUrl = "/public/"+upLoadDirPath;
    //public static String downloadPath = "D:/pfile/workspace/bizcafe"+File.separator+"public"+File.separator+upLoadDirPath+File.separator; //로컬
    public static String downloadPath = "/home/bizcafe/public_html/"+File.separator+"public"+File.separator+upLoadDirPath+File.separator; //(186)
    //public static String downloadPath = "/home/bizcafe/public/"+upLoadDirPath+"/";//실서버
    
    //public static String tmpFilePath = "D:/java/bizcafe"; //엑셀생성 로컬
    public static String tmpFilePath = "/home/bizcafe/public_html"; //엑셀생성 186
    //public static String tmpFilePath = "/home/bizcafe/public/data"; //엑셀생성 실서버    

    public static String COOKIE_EXPIRE = "0" ; 
    public static int IS_FILE_UPLOAD = 1; 
    public static String SITE_TEL_NO = "02-779-0430";
    
    public static String HTTPS_HOST = "https://www.bizstudio.co.kr";  // 로그인 경로(테스트)
    //public static String HTTPS_HOST = "https://www.bizstudio.co.kr";  // 로그인 경로(실서버)    
    public static String HTTPS_DOMAIN = HTTPS_HOST + "/user/login";  // 로그인 경로
    public static String HTTPS_ADMIN_DOMAIN = HTTPS_HOST + "/admin";  // 관리자 로그인 경로
    public static String FORM_MAIL_URL = SITE_DOMAIN + "/public/images/formMail";
    public static String SITE_NAME = "BIZ STUDIO";   
    public static int SMS_LIMIT = 30; //일일 문자 제한수
	//    result 코드
    //
	//    입력값 관련
	//    101 필수 입력값 누락
	//    102 입력값이 잘못 되었슴.  예) 숫자가 들어와야 되는데 문자가 들어오는 경우
	//    
	//    처리 관련
	//    200 처리 완료
	//    201 처리 실패
	//    
	//    서버 관련
	//    301 서버 접속 실패
	//    
	//    입력 조회 관련
	//    401 중복값 존재
	//    402 해당 하는 값이 없슴
    //    
    //    로그인 관련 (LoginAdminController.java)
    //	  101 로그인 필요
    //    102 로그인 실패
    //	  103 sslKey값이 없음
    //    104 필수 입력값 누락
    
    
    
    //스마트 에디터에서 사용
    public static String NBOARD_IMAGE_UPLOAD_URL = "/admin/ui/photos"; //"/public/upload/"; 
    public static String NBOARD_EMOTICON_URL = "/public/javascripts/smarteditor/img/emoticon";
    public static String NBOARD_SKIN_URL = "/public/javascripts/smarteditor/SEditorSkin.html";
    
    
    // 우편번호 API Key Value
    public static String ZIPCODE_MYAPI = "ab13558531c777ea81329097854815";
    
        
     
}

package controllers.user;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

import play.*;
import play.data.Upload;
import play.db.jpa.Blob;
import play.db.jpa.JPA;
import play.libs.MimeTypes;
import play.mvc.*;
import utils.Cookies;
import utils.FileUpload;
import utils.HTMLInputFilter;
import utils.Pagination;
import utils.Tag;
import utils.JeiFiles;

import static utils.Constants.BLOCK_LIST_COUNT;
import static utils.Constants.BLOCK_PAGE_GALLERY_COUNT;
import static utils.Constants.BLOCK_PAGE_COUNT;
import static utils.Constants.BLOCK_PAGE_GALLERY_COUNT;
import static utils.Constants.NBOARD_EMOTICON_URL;
import static utils.Constants.NBOARD_IMAGE_UPLOAD_URL;
import static utils.Constants.NBOARD_SKIN_URL;
import static utils.Constants.upLoadDirPath;
import static utils.Constants.IS_FILE_UPLOAD;
import static utils.Constants.upLoadDirUrl;
import static utils.Constants.downloadPath;


import models.*;

import utils.validators.LoggedInUserInfo;


/**
 *
 * @author : Boky
 * @since : 2012-01-16
 * @version : 
 * 
*/
@With(LoggedInUserInfo.class)
public class Board extends Controller {
	

	/**
	 * 조건
	 * 
	 * @param		boardCode		게시판코드
	 * @param		searchKey  		검색키
	 * @param		searchValue		검색값
	 * @return
	 */ 
	
	private static String makeSearch(String boardCode , String searchKey , String searchVal){
		
		String cleanKey = "";
		String cleanVal = "";
		
		if(!searchVal.equals("")){
			cleanKey = new HTMLInputFilter().filter( searchKey );
			cleanVal = new HTMLInputFilter().filter( searchVal );
		} 
		
		String where = " 1=1 ";
		if (boardCode.equals(""))
			boardCode = null;
		
		if ((boardCode != null) && (boardCode.length() > 0))
			where = where+" AND boardCode = '"+ boardCode + "'";
		
		if(cleanKey == null || cleanVal.length() == 0)
			return where;

		int searchType = cleanKey.indexOf("|");
		int searchType1 = cleanKey.indexOf("&");
		int j = 1;
		String searchMode = "";
		
		if(searchType > 0 || searchType1 > 0){
			String where1 = " ( ";
			String[] searchArray;
			
			if(searchType > 0){
				searchArray = cleanKey.split("\\|");
				searchMode = " OR ";
			} else {
				searchArray = cleanKey.split("\\&");
				searchMode = " AND ";
			}
			
			for(int i=0;i<searchArray.length;i++){
				
				where1 +=searchArray[i]+" LIKE '%"+cleanVal+"%'";
				
				if(j < searchArray.length) {
					where1 += searchMode;
				}
				j = j+1;
			}
			
			
			where1 += " ) ";
			where += " AND "+where1;
			return where;
		}

		if(searchKey.equals("regUserId")){
			where += " AND "+cleanKey+" = '"+cleanVal+"'";
		} else {
			where += " AND "+cleanKey+" LIKE '%"+cleanVal+"%'";
		}
		
				
		return where;
	}
	
	/**
	 * 게시판 코드에 따른 관리자 메뉴 번호
	 * @param boardCode
	 * @return
	 */
	private static int menuNum(String boardCode){
			
		Map<String, Integer> map = new HashMap<String, Integer>();
		
		map.put("notice",12);
		map.put("recruit",13);
		map.put("faq",41);
		map.put("qna",42);
		map.put("gallery",51);
		
		return map.get(boardCode);
				
		
	}
	
	/**
	 * 게시판 코드 명
	 * 
	 * @param		boardCode		게시판코드
	 * @return
	 */  
	public static String boardCodeName(String boardCode){
		
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("notice","공지사항");
		map.put("recruit","채용");
		map.put("faq","FAQ");
		map.put("qna","1:1문의");
		map.put("gallery","갤러리");
	
		return map.get(boardCode);
		
	}
	
	
	/**
	 * 게시판  이미지
	 * 
	 * @param		boardCode		게시판코드
	 * @return
	 */  
	public static String boardCodeTitle(String boardCode){
		
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("notice","st2");
		map.put("recruit","st3");
		map.put("faq","st1");
		map.put("qna","st2");
		map.put("gallery","갤러리");
	
		return map.get(boardCode);
		
	}
	
	
	/**
	 * 총 게시물 갯수
	 * 
	 * @param		boardCode		게시판코드
	 * @return
	 */  
	private static long totalCount(String boardCode , String searchKey , String searchVal){
		String where = makeSearch(boardCode,searchKey,searchVal);
		
		if(boardCode.equals("qna")){
			Cookies cookie = new Cookies();	
	    	String regUserId = cookie.getCookie("BZ_UID");
	    	where += " AND regUserId = '"+regUserId+"'";    	
		}
		
		long boardTotalCount = JeiBoard.count(where);
		return boardTotalCount;
		
	}
	
	
	
	/**
	 * 게시판 목록
	 * 
	 * @param		boardCode		게시판코드
	 * @param		searchKey  		검색키
	 * @param		searchValue		검색값
	 * @return
	 */     
    public static void list(String boardCode, int page , String searchKey , String searchVal){
    	
    	Cookies cookie = new Cookies();	
    	String regUserId = cookie.getCookie("BZ_UID");
    	
    	if(boardCode.equals("qna")){
    		
    		if(regUserId == ""){
    			cookie.setCookie("errorResult", "100");       
    			redirect("/user/login");     
    			return;
    		}
		}
    	if(page == 0)
    		page = 1;
    	
      	String urlDecodeSearchVal = "";
      	if(searchVal != null){
      		try {
				urlDecodeSearchVal = URLDecoder.decode(searchVal,"UTF-8");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				urlDecodeSearchVal = searchVal;
			}
      	} else {
      		urlDecodeSearchVal = "";
      	}
       	
    	SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd");
    	String nowDate = dateTimeFormat.format(new Date().getTime());
    	
    	String where = makeSearch(boardCode,searchKey,urlDecodeSearchVal);
    	
    	int boardTotalCount = (int)totalCount(boardCode , searchKey , urlDecodeSearchVal);
    	int boardNumber = boardNumber(boardTotalCount,page);
    	String boardCodeName = boardCodeName(boardCode);
    	
    	int menuNum = menuNum(boardCode);
    	String boardCodeTitle = boardCodeTitle(boardCode);
    	
    	Pagination pagination = new Pagination("/board/"+boardCode,page,boardTotalCount);
    	
    	if(boardCode.equals("qna")){
	    	where += " AND regUserId = '"+regUserId+"'";    	
		}
    	
    	int listBlock = 0;
    	if(boardCode.equals("gallery")){
    		listBlock = BLOCK_PAGE_GALLERY_COUNT;
    	} else {
    		listBlock = BLOCK_PAGE_COUNT;
    	}
    	
    	List<ViewsJeiBoardList> list = ViewsJeiBoardList.find(where+" ORDER BY idx DESC").from(((page - 1) * BLOCK_LIST_COUNT)).fetch(listBlock);
    	
    	if(boardCode.equals("gallery")){
    		JeiFiles jeiFiles = new JeiFiles("JeiBoard",boardCode);
    		List<Object> data = new ArrayList<Object>();
    		
    		for(int i=0;i<list.size();i++){
    			
    			Map<String, Object> gallery = new HashMap<String, Object>();
    			List<JeiFile> readFile = jeiFiles.readFile(list.get(i).idx);
    			
    			gallery.put("idx",list.get(i).idx);
    			gallery.put("title",list.get(i).title);
    			
    			for(int j=0;j<readFile.size();j++){
    				if(j==0){
    					gallery.put("thumbFileName",readFile.get(j).fileName);
    				} else {
    					gallery.put("bigFileName",readFile.get(j).fileName);
    				}
    			}
    			
    			data.add(gallery);
    		}
    		
    		String fileUrl = upLoadDirUrl+"/JeiBoard";
    		
    		renderTemplate("/public/board/gallery.html", data, boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , menuNum ,fileUrl);
    		
    	} else if(boardCode.equals("qna")){
    		renderTemplate("/public/board/list.html", list, boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , searchKey,searchVal ,menuNum , nowDate , urlDecodeSearchVal);
    	} else if(boardCode.equals("faq")){
    		renderTemplate("/public/board/faq.html", list, boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , searchKey,searchVal ,menuNum , nowDate , urlDecodeSearchVal);
    	} else {
    		render(list , boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , searchKey,searchVal , menuNum , nowDate , urlDecodeSearchVal,boardCodeTitle);
    	}
    	
    }
    



	/**
     * 게시판 뷰
     * @param boardCode
     * @param idx
     * @param page
     * @param searchKey
     * @param searchVal
     */
    public static void read(String boardCode , long idx , int page , String searchKey , String searchVal){
    	
    	
    	if(idx == 0){
    		redirect("/board/"+boardCode);
    		return;
    	}
    	
    	String urlDecodeSearchVal = "";
      	if(searchVal != null){
      		try {
				urlDecodeSearchVal = URLEncoder.encode(searchVal,"UTF-8");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				urlDecodeSearchVal = searchVal;
			}
      	} else {
      		urlDecodeSearchVal = "";
      	}
    	      	
    	String boardCodeName = boardCodeName(boardCode);
    	ViewsJeiBoardView jeiView = ViewsJeiBoardView.find("idx = ? AND boardCode = ? ",idx,boardCode).first();
    	
    	if(boardCode.equals("qna")){
    		Cookies cookie = new Cookies();
    		String regUserId = cookie.getCookie("BZ_UID");
    		
    		if(regUserId == ""){
    			redirect("/board/"+boardCode);
        		return;
    		}
    		
    		
    		if(!jeiView.regUserId.equals(regUserId)){
    			redirect("/board/"+boardCode);
        		return;
    		}
    	}
    	
    	JeiBoard jeiReadUpdate= JeiBoard.findById(idx);
    	
    	jeiReadUpdate.hitNum = jeiReadUpdate.hitNum + 1;
    	jeiReadUpdate.save();
    	
    	/*Tag tag = new Tag("","JeiBoard",boardCode,idx);
    	List jeiTagList = tag.readTag();*/
    	
    	JeiFiles jeiFiles = new JeiFiles("JeiBoard",boardCode);
    	List readFiles = jeiFiles.readFile(idx);
    	int menuNum = menuNum(boardCode);
    	String boardCodeTitle = boardCodeTitle(boardCode);
    	if(boardCode.equals("qna")){
    		renderTemplate("/public/board/read.html", jeiView, boardCode , boardCodeName, page , searchKey , urlDecodeSearchVal,menuNum,boardCodeTitle);
    	} else if(boardCode.equals("faq")){
    		renderTemplate("/public/board/faqRead.html", jeiView, boardCode , boardCodeName, page , searchKey , urlDecodeSearchVal,menuNum,boardCodeTitle);
    	} else {
    		render(jeiView,readFiles,boardCode,boardCodeName,page,searchKey,urlDecodeSearchVal,menuNum,boardCodeTitle);
    	}
    	
    	
    }
    
    /**
     * 삭제
     * @param boardCode
     * @param idx
     */
    public static void delete(String boardCode , long idx , int page){
    	
    	if(idx == 0){
    		redirect("/board/"+boardCode);
    		return;
    	}
    	
    	ViewsJeiBoardView jeiView = ViewsJeiBoardView.find("idx = ? AND boardCode = ? ",idx,boardCode).first();
    	
    	//파일 있으면 삭제
    	if(jeiView.fileNum > 0){
    		//long boardIdx = idx;  	
    		JeiFile.delete(" boardIdx = "+idx);
    	}
    	
    	JeiBoard jeiDelete = JeiBoard.findById(idx);
    	jeiDelete.delete();
    	
    	redirect("/board/"+boardCode+"?page="+page);
    	
    }
    
    
    /**
	 * 글쓰기
	 * 
	 * @param		boardCode		게시판코드
	 * @param		mode			입력 / 수정 구분
	 */    
    public static void write(String boardCode){
    	
    	String nBoardImageUploadUrl	= NBOARD_IMAGE_UPLOAD_URL;		
    	String nBoardEmoticonUrl 	= NBOARD_EMOTICON_URL;
    	String nBoardSkinUrl 		= NBOARD_SKIN_URL;
    	
    	if(boardCode.equals("qna")){
    		Cookies cookie = new Cookies();
    		String regUserId = cookie.getCookie("BZ_UID");
    		
    		if(regUserId == ""){
    			redirect("/board/"+boardCode);
        		return;
    		}
    	}
    	
    	String boardCodeName = boardCodeName(boardCode);
    	int menuNum = menuNum(boardCode);
    	render(boardCode,boardCodeName , menuNum , nBoardImageUploadUrl , nBoardEmoticonUrl , nBoardSkinUrl);
    }
    
    
    /**
	 * 글 수정
	 * 
	 * @param		boardCode		게시판코드
	 * @param		mode			입력 / 수정 구분
	 */    
    public static void modify(String boardCode , long idx ){
    	
    	
    	String nBoardImageUploadUrl	= NBOARD_IMAGE_UPLOAD_URL;		
    	String nBoardEmoticonUrl 	= NBOARD_EMOTICON_URL;
    	String nBoardSkinUrl 		= NBOARD_SKIN_URL;
    	
    	ViewsJeiBoardView jeiView = ViewsJeiBoardView.find("idx = ? AND boardCode = ? ",idx,boardCode).first();
    	
    	if(boardCode.equals("qna")){
    		Cookies cookie = new Cookies();
    		String regUserId = cookie.getCookie("BZ_UID");
    		
    		if(regUserId == ""){
    			redirect("/board/"+boardCode);
        		return;
    		}
    		
    		if(!jeiView.regUserId.equals(regUserId)){
    			redirect("/board/"+boardCode);
        		return;
    		}
    	}
    	
    	
    	
    	String boardCodeName = boardCodeName(boardCode);
    	int menuNum = menuNum(boardCode);
    	render(jeiView,boardCode,boardCodeName , menuNum , nBoardImageUploadUrl , nBoardEmoticonUrl , nBoardSkinUrl);
    }
    
    /**
	 * 입력 
	 * 
	 * @param		userFiles		파일
	 */  
    public static void create(File userFile , String boardCode , JeiBoard jeiBoard){
    	
    	String tableName = "JeiBoard";
    	int fileCount = 0;    	
		List<Upload> files = (List<Upload>) request.args.get("__UPLOADS");
		Cookies cookie = new Cookies();	
		FileUpload file = null;
		try{	
			/*file = new FileUpload(tableName , files);
		    	
	    	String fileError = file.fileError("image");
	    	fileCount = file.fileCount();
	    	
	    	if(fileError.equals("true") && fileCount > 0){
	    		renderTemplate("", boardCode, fileError);
	    		return;
	    	}*/
		} catch(Exception e) {
		}
		
		
		
    	jeiBoard.title				= params.get("title").trim();
    	jeiBoard.contents			= params.get("contents").trim();
    	jeiBoard.boardCode 			= boardCode;
    	jeiBoard.parentBoardCode 	= boardCode;
    	jeiBoard.regUserId 			= cookie.getCookie("BZ_UID");
    	jeiBoard.regUserName		= cookie.getCookie("BZ_UNAME");
    	jeiBoard.regUserIp			= request.remoteAddress;
    	jeiBoard.fileNum 			= fileCount;
    	jeiBoard.regDate 			= new Timestamp(new Date().getTime());
    	jeiBoard.updDate			= new Timestamp(new Date().getTime());
    	jeiBoard.save();
    	
    	long lastIdx = jeiBoard.getIdx();
    	
    	if(file!=null){
	    	//파일
	    	/*try{
				String fileUploadType = "A";
				String fileFormat = "A";
				String fileUrl = "http://localhost:9001/public/data/"+tableName;
				file.uploadFile(boardCode,fileUploadType,fileFormat,fileUrl , lastIdx);
	    	}catch(Exception e){}*/
    	}
    	
    	/*태그 가 필요하면
    	String paramsTag = params.get("tag");
    	
    	Tag tag = new Tag(paramsTag,"JeiBoard",boardCode,lastIdx);
    	tag.tagList();*/
    	
    	redirect("/board/"+boardCode+"/read?idx="+lastIdx);
    	
	}
    
    
    public static void update(File userFile , String boardCode , long idx , int page , JeiBoard jeiBoard)  throws Exception {
    	
    	String tableName = "JeiBoard";
    	int fileCount = 0;    	
		List<Upload> files = (List<Upload>) request.args.get("__UPLOADS");
			
		FileUpload file = null;
		try{	
			/*file = new FileUpload(tableName , files);
		    	
	    	String fileError = file.fileError("image");
	    	fileCount = file.fileCount();
	    	
	    	if(fileError.equals("true") && fileCount > 0){
	    		renderTemplate("", boardCode, fileError);
	    		return;
	    	}*/
		} catch(Exception e) {
		}
		
		JeiBoard jeiBoardUpdate			= JeiBoard.findById(idx);
		jeiBoardUpdate.title			= params.get("title").trim();
		jeiBoardUpdate.contents			= params.get("contents").trim();
		jeiBoardUpdate.regUserIp		= request.remoteAddress;
		jeiBoardUpdate.updDate			= new Timestamp(new Date().getTime());
    	
    	jeiBoardUpdate.save();
    	
    	/*태그 가 필요하면
    	String paramsTag = params.get("tag");
    	
    	Tag tag = new Tag(paramsTag,"JeiBoard",boardCode,lastIdx);
    	tag.tagList();*/
    	
    	redirect("/board/"+boardCode+"/read?idx="+idx);
    	
	}
    
    /**
	 * 게시판 번호
	 * 
	 * @param		totalCount		게시물 전체 갯수
	 * @param		page			현재 게시물 번호
	 */  
    private static int boardNumber(int totalCount,int page){
    	return totalCount - (BLOCK_LIST_COUNT * (page - 1)); 
    }
    
    
    /**
     * 파일다운로드
     * @param boardCode
     * @param idx
     * @param fileIdx
     */
    public static void download(String boardCode,long idx , long fileIdx){
    	JeiFiles jeiFiles = new JeiFiles("JeiBoard",boardCode);
    	
    	Cookies cookie = new Cookies();
		String regUserId = cookie.getCookie("BZ_UID");
		String regUserName = cookie.getCookie("BZ_UNAME");

		jeiFiles.fileDownLoadHistory(idx,fileIdx,regUserId,regUserName);

    	JeiFile data = jeiFiles.fileNames(idx,fileIdx);
    	String path = downloadPath+"JeiBoard/";
    	String fileUrl = path+data.fileName;
    	String fileName = data.fileRealName;
    	
    	File file = new File(fileUrl);
    	String type = MimeTypes.getContentType(file.getName());	
		response.setContentTypeIfNotSet(type);
		renderBinary(file, fileName);
		
		    	
    }

   
    
}
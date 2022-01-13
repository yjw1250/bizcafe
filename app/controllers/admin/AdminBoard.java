package controllers.admin;


import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
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
import static utils.Constants.NBOARD_EMOTICON_URL;
import static utils.Constants.NBOARD_IMAGE_UPLOAD_URL;
import static utils.Constants.NBOARD_SKIN_URL;
import static utils.Constants.downloadPath;
import static utils.Constants.upLoadDirPath;
import static utils.Constants.IS_FILE_UPLOAD;
import static utils.Constants.upLoadDirUrl;

import models.*;

import utils.validators.LoggedInValidatorUserAdmin;

/**
 *
 * @author : Boky
 * @since : 2012-01-16
 * @version : 
 * 
*/
@With(LoggedInValidatorUserAdmin.class)
public class AdminBoard extends Controller {
	
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
	private static int adminMenuNum(String boardCode){
		
				Map<String, Integer> map = new HashMap<String, Integer>();
		
		map.put("notice",43);
		map.put("recruit",44);
		map.put("faq",45);
		map.put("qna",46);
		map.put("gallery",47);
	
		return map.get(boardCode);
				
		
	}
	
	/**
	 * 게시판 코드 명
	 * 
	 * @param		boardCode		게시판코드
	 * @return
	 */  
	private static String boardCodeName(String boardCode){
		
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("notice","공지사항");
		map.put("recruit","채용");
		map.put("faq","FAQ");
		map.put("qna","1:1문의");
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
      	}
    	
    	SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd");
    	String nowDate = dateTimeFormat.format(new Date().getTime());
    	
    	String where = makeSearch(boardCode,searchKey,urlDecodeSearchVal);
    	int boardTotalCount = (int)totalCount(boardCode , searchKey , urlDecodeSearchVal);
    	int boardNumber = boardNumber(boardTotalCount,page);
    	String boardCodeName = boardCodeName(boardCode);
    	
    	int adminMenuNum = adminMenuNum(boardCode);
    	   	
    	Pagination pagination = new Pagination("/board/"+boardCode,page,boardTotalCount);
    	 	
    	List<ViewsJeiBoardList> list = ViewsJeiBoardList.find(where+" ORDER BY idx DESC").from(((page - 1) * BLOCK_LIST_COUNT)).fetch(10);
    	    	
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
    		renderTemplate("/public/board/adminGallery.html", data , boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , searchKey,urlDecodeSearchVal , adminMenuNum,nowDate,fileUrl);
    		return;
    	} 
    	if(boardCode.equals("faq")){
    		renderTemplate("/public/board/adminFaqList.html", list , boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , searchKey,urlDecodeSearchVal , adminMenuNum,nowDate);
    	} else if(boardCode.equals("qna")){
    		renderTemplate("/public/board/adminQnaList.html", list , boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , searchKey,urlDecodeSearchVal , adminMenuNum,nowDate);
    	} else {
    		render(list , boardCode , boardTotalCount, boardCodeName, pagination , boardNumber , searchKey,urlDecodeSearchVal , adminMenuNum , nowDate);
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
    		redirect("/admin/board/"+boardCode);
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
    	
    	String nBoardImageUploadUrl	= NBOARD_IMAGE_UPLOAD_URL;		
    	String nBoardEmoticonUrl 	= NBOARD_EMOTICON_URL;
    	String nBoardSkinUrl 		= NBOARD_SKIN_URL;
    	    	
    	JeiFiles jeiFiles = new JeiFiles("JeiBoard",boardCode);
    	List<JeiFile> readFile = jeiFiles.readFile(idx);
    	int adminMenuNum = adminMenuNum(boardCode);
    	
    	if(boardCode.equals("recruit")){
    		renderTemplate("/public/board/adminRecruit.html", jeiView ,readFile ,boardCode ,boardCode,boardCodeName,page,searchKey,urlDecodeSearchVal,adminMenuNum,nBoardImageUploadUrl,nBoardEmoticonUrl,nBoardSkinUrl);
    	} else if(boardCode.equals("faq")){
    		renderTemplate("/public/board/adminFaqRead.html", jeiView ,readFile ,boardCode ,boardCode,boardCodeName,page,searchKey,urlDecodeSearchVal,adminMenuNum);
    	} else {
    		render(jeiView,readFile,boardCode,boardCodeName,page,searchKey,urlDecodeSearchVal,adminMenuNum,nBoardImageUploadUrl,nBoardEmoticonUrl,nBoardSkinUrl);
    	}
    	
    	
    }
    
    /**
     * 삭제
     * @param boardCode
     * @param idx
     */
    public static void delete(String boardCode , long idx , int page){
    	
    	if(idx == 0){
    		redirect("/admin/board/"+boardCode);
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
    	
    	redirect("/admin/board/"+boardCode+"?page="+page);
    	
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
    			
    	
    	String boardCodeName = boardCodeName(boardCode);
    	int adminMenuNum = adminMenuNum(boardCode);
    	
    	if(boardCode.equals("gallery")){
    		renderTemplate("/public/board/adminGalleryWrite.html", boardCode, boardCodeName , adminMenuNum);
    	} else if(boardCode.equals("faq")){
    		renderTemplate("/public/board/adminFaqWrite.html", boardCode, boardCodeName , adminMenuNum, nBoardImageUploadUrl , nBoardEmoticonUrl , nBoardSkinUrl);
    	} else {
    	  	render(boardCode,boardCodeName , adminMenuNum , nBoardImageUploadUrl , nBoardEmoticonUrl , nBoardSkinUrl);
    	}
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
    	
    	String boardCodeName = boardCodeName(boardCode);
    	int adminMenuNum = adminMenuNum(boardCode);
    	
    	
    	JeiFiles jeiFiles = new JeiFiles("JeiBoard",boardCode);
    	List<JeiFile> readFile = jeiFiles.readFile(jeiView.idx);
    	
    	if(boardCode.equals("faq")){
    		renderTemplate("/public/board/adminFaqModify.html", jeiView,boardCode,boardCodeName , adminMenuNum , nBoardImageUploadUrl , nBoardEmoticonUrl , nBoardSkinUrl);
    	} else if(boardCode.equals("gallery")){
    		int i = 0;
    		Map<Integer, String> fileTitle = new HashMap<Integer, String>();
    		fileTitle.put(1,"큰이미지");
    		fileTitle.put(0,"썸네일 이미지");
    		renderTemplate("/public/board/adminGalleryModify.html", jeiView,boardCode,boardCodeName , adminMenuNum ,  readFile , fileTitle,i);
    	} else {
    		render(jeiView,boardCode,boardCodeName , adminMenuNum , nBoardImageUploadUrl , nBoardEmoticonUrl , nBoardSkinUrl , readFile);
    	}
    	render(jeiView,boardCode,boardCodeName , adminMenuNum , nBoardImageUploadUrl , nBoardEmoticonUrl , nBoardSkinUrl);
    }
    
    /**
	 * 입력 
	 * 
	 * @param		userFiles		파일
	 */  
    public static void create(File userFile , String boardCode , JeiBoard jeiBoard,
    		String title, int category, String contents
    )  throws Exception {
    	
    	String tableName = "JeiBoard";
    	int fileCount = 0;    	
		List<Upload> files = (List<Upload>) request.args.get("__UPLOADS");
		Cookies cookie = new Cookies();		
		FileUpload file = null;
		
		try{	
			file = new FileUpload(tableName , boardCode , files);
			
			String fileError = "";
			
			if(boardCode.equals("gallery")){
				fileError = file.fileError("image");
			} else {
				fileError = file.fileError("imgdoc");
			}
			
			//System.out.println(fileError);
			
			fileCount = file.fileCount();
	    	if(!fileError.equals("true") && fileCount > 0){
	    		renderTemplate("/public/board/error.html", boardCode, fileError);
	    		return;
	    	}
		} catch(Exception e) {
		}
		
		

		jeiBoard.title				= title.trim();
		jeiBoard.category			= category;
		jeiBoard.contents			= contents.trim();
    	jeiBoard.boardCode 			= boardCode;
    	jeiBoard.parentBoardCode 	= boardCode;
    	jeiBoard.regUserId 			= cookie.getCookie("BZ_ADMINUID");
    	jeiBoard.regUserName		= cookie.getCookie("BZ_ADMINUNAME");
    	jeiBoard.adminCode			= cookie.getCookie("BZ_ADMINUID");
    	jeiBoard.adminName			= cookie.getCookie("BZ_ADMINUNAME");
    	jeiBoard.regUserIp			= request.remoteAddress;
    	jeiBoard.fileNum 			= fileCount;
    	jeiBoard.regDate 			= new Timestamp(new Date().getTime());
    	jeiBoard.updDate			= new Timestamp(new Date().getTime());
    	
    	//System.out.println("jeiBoard.contents = " + jeiBoard.contents);
    	
    	jeiBoard.save();
    	
    	long lastIdx = jeiBoard.getIdx();
    	
    	if(files != null){
			String fileUploadType = "A";
			String fileFormat = "A";
			String fileUrl = upLoadDirUrl+File.separator+tableName;
			List<Map> info = file.uploadFile();
			
			String fileName = "";
			String newFileName = "";
			String fileExt = "";
			int fileWidth = 0;
			int fileHeight = 0;
			long fileSize = 0;
			
			for(int i=0;i<info.size();i++){
				fileName = (String) info.get(i).get("fileName");
				newFileName = (String) info.get(i).get("newFileName");
				fileExt = (String) info.get(i).get("fileExt");
				fileWidth = (Integer) info.get(i).get("fileWidth");
				fileHeight = (Integer) info.get(i).get("fileHeight");
				fileSize = (Long) info.get(i).get("fileSize");
				file.createFile(lastIdx,fileUploadType,fileFormat,fileUrl,fileName,newFileName,fileExt,fileWidth,fileHeight,fileSize);
			}
	    	
    	}
    	
    	if(boardCode.equals("gallery")){
    		redirect("/admin/board/"+boardCode);
    	} else {
    		redirect("/admin/board/"+boardCode+"/read?idx="+lastIdx);	
    	}
    	
    	
	}
    
    
    public static void update(File userFile , String boardCode , long idx , int page , JeiBoard jeiBoard)  throws Exception {
    	
    	String tableName = "JeiBoard";
    	int fileCount = 0;    	
		List<Upload> files = (List<Upload>) request.args.get("__UPLOADS");
		Cookies cookie = new Cookies();			
		FileUpload file = null;
		try{	
			file = new FileUpload(tableName , boardCode , files);
		    	
			String fileError = "";
			
			if(boardCode.equals("gallery")){
				fileError = file.fileError("image");
			} else {
				fileError = file.fileError("imgdoc");
			}
			
			fileCount = file.fileCount();
			
			
		} catch(Exception e) {
		}
		
		
		
		JeiBoard jeiBoardUpdate			= JeiBoard.findById(idx);
		jeiBoardUpdate.title			= params.get("title").trim();
		try{
			int category = Integer.parseInt(params.get("category"));
			jeiBoardUpdate.category		= category;
		}catch(Exception e) {
		}
		jeiBoardUpdate.contents			= params.get("contents").trim();
		jeiBoardUpdate.boardCode 		= boardCode;
		jeiBoardUpdate.parentBoardCode 	= boardCode;
		jeiBoardUpdate.regUserId 		= cookie.getCookie("BZ_ADMINUID");
		jeiBoardUpdate.regUserName		= cookie.getCookie("BZ_ADMINUNAME");
		jeiBoardUpdate.adminCode		= cookie.getCookie("BZ_ADMINUID");
		jeiBoardUpdate.adminName		= cookie.getCookie("BZ_ADMINUNAME");
		jeiBoardUpdate.regUserIp		= request.remoteAddress;
		jeiBoardUpdate.updDate			= new Timestamp(new Date().getTime());
    	jeiBoardUpdate.save();
    	
    	
    	if(files != null){
    		
	    	//파일
	    	
			String fileUploadType = "A";
			String fileFormat = "A";
			String fileUrl = upLoadDirUrl+File.separator+tableName;
			List<Map> info = file.uploadFile();
			String[] fileIdx = params.getAll("fileIdx");
			
			int i = 0;
			int infoCount = info.size();
			String fileName = "";
			String newFileName = "";
			String fileExt = "";
			int fileWidth = 0;
			int fileHeight = 0;
			long fileSize = 0;
			long fIdx = 0;
			
			for(i=0;i<infoCount;i++){
				
				fileName = (String) info.get(i).get("fileName");
				newFileName = (String) info.get(i).get("newFileName");
				fileExt = (String) info.get(i).get("fileExt");
				fileWidth = (Integer) info.get(i).get("fileWidth");
				fileHeight = (Integer) info.get(i).get("fileHeight");
				fileSize = (Long) info.get(i).get("fileSize");
				fIdx = Integer.parseInt(fileIdx[i]);
				
				file.updateFile(fileName,newFileName,fileExt,fileWidth,fileHeight,fileSize,fIdx);
				
			}
	    	
    	}
    	
    	/*태그 가 필요하면
    	String paramsTag = params.get("tag");
    	
    	Tag tag = new Tag(paramsTag,"JeiBoard",boardCode,lastIdx);
    	tag.tagList();*/
    	
    	if(boardCode.equals("gallery")){
    		redirect("/admin/board/"+boardCode);
    	} else {
    		redirect("/admin/board/"+boardCode+"/read?idx="+idx);	
    	}
    	
    	
	}
    
    
    
    /**
     * Q&A답변
     * @param boardCode
     * @param idx
     * @param page
     * @param jeiBoard
     * @throws Exception
     */
    public static void reply(String boardCode , long idx , int page , JeiBoard jeiBoard)  throws Exception {
    	
    	String tableName = "JeiBoard";
    	Cookies cookie = new Cookies();					
		JeiBoard jeiBoardUpdate			= JeiBoard.findById(idx);
		jeiBoardUpdate.adminCode		= cookie.getCookie("BZ_ADMINUID");
		jeiBoardUpdate.adminName		= cookie.getCookie("BZ_ADMINUNAME");
		jeiBoardUpdate.regUserIp		= request.remoteAddress;
		jeiBoardUpdate.updDate			= new Timestamp(new Date().getTime());
		jeiBoardUpdate.etcVarchar1		= params.get("etcVarchar1").trim();
    	jeiBoardUpdate.save();
    	
    	redirect("/admin/board/"+boardCode+"/read?idx="+idx+"&page="+page);
    	
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
  
    	JeiFile data = jeiFiles.fileNames(idx,fileIdx);
    	String path = downloadPath+"JeiBoard"+File.separator;
    	String fileUrl = path+data.fileName;
    	String fileName = data.fileRealName;
    	
    	File file = new File(fileUrl);
    	String type = MimeTypes.getContentType(file.getName());	
		response.setContentTypeIfNotSet(type);
		renderBinary(file, fileName);
    	
    }
    
}
package utils;
import static utils.Constants.upLoadDirPath;
import play.*;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import models.JeiFile;
import models.JeiFileDownLoad;
import play.db.jpa.JPA;

public class JeiFiles {
	
	
	private static String tableName = "";
	private static String boardCode = "";
	
	
	/**
	 * 생성자
	 * @param tableName
	 * @param boardCode
	 * @param idx
	 */
	public JeiFiles(String tableName,String boardCode){
		this.tableName = tableName;
		this.boardCode = boardCode;
		
	}
	
	/**
	 * 게시물 LIST
	 * @return
	 */
	public List readFile(long idx){
		
		//final JeiFile jeiFile = new JeiFile();
		List<JeiFile> list = JeiFile.find("tableName = ? AND boardCode = ? AND boardIdx = ? ORDER BY idx ASC" , this.tableName, this.boardCode, idx).fetch();
		return list;
		
	}
	
	/**
	 * 게시물 LIST
	 * @return
	 */
	public JeiFile fileNames(long idx , long fileIdx){
		
		//final JeiFile jeiFile = new JeiFile();
		
		JeiFile data = JeiFile.find("tableName = ? AND boardCode = ? AND boardIdx = ? AND idx = ? ORDER BY idx DESC" , this.tableName, this.boardCode,idx ,fileIdx).first();
		return data;
		
	}
	
	/**
	 * 파일 다운로드
	 * @param fileUrl
	 * @param fileRealName
	 */
	public void fileDownLoad(String fileUrl , String fileRealName){
		
		//final int BUFFER_SIZE = 8192; // 8kb
		byte[] buffer = new byte[1024]; 
		
		OutputStream out = null; 
		URLConnection conn = null; 
		InputStream  in = null; 
		try{
			URL url = new URL(fileUrl); 
			out = new BufferedOutputStream(new FileOutputStream(fileRealName)); 
			conn = url.openConnection(); 
			in = conn.getInputStream(); 
			
	         int numRead; 
	         long numWritten = 0; 
	         while ((numRead = in.read(buffer)) != -1) { 
	             out.write(buffer, 0, numRead); 
	             numWritten += numRead; 
	         } 
		} catch (Exception exception) {}
		
	}
	
	/**
	 * 파일 다운로드 HISTORY
	 * @param boardCode
	 * @param idx
	 * @param fileIdx
	 */	
	public static void fileDownLoadHistory(long idx , long fileIdx , String regUserId, String regUserName){
		
		final JeiFileDownLoad downLoad = new JeiFileDownLoad();
				
		downLoad.tableName = tableName;
		downLoad.boardCode = boardCode;
		downLoad.boardIdx = idx;
		downLoad.fileIdx = fileIdx;
		downLoad.regUserId = regUserId;
		downLoad.regUserName = regUserName;
		downLoad.regDate = new Timestamp(new Date().getTime());
		downLoad.save();		
	}

}

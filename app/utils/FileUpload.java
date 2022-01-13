package utils;

import play.*;
import play.data.MemoryUpload;
import play.data.Upload;
import play.libs.IO;
import play.libs.MimeTypes;
import play.mvc.Scope.Session;


import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

import org.h2.util.IOUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;


import models.JeiFile;
import play.db.jpa.JPA;

import utils.encryptors.SHA256Encryptor;

import static utils.Constants.fileLimit;
import static utils.Constants.upLoadDirPath;
import static utils.Constants.downloadPath;

/**
 * 파일 업로드
 * @author boky
 *
 */
public class FileUpload {
	
	private String tableName = "";
	private List<Upload> userFiles = null;
	private String boardCode = "";
	private String uploadFolder = "";	
	/**
	 * 생성자
	 * @param tableName
	 * @param files
	 */
	public FileUpload(String tableName , String boardCode , List<Upload> files){
		
		this.tableName = tableName;
		this.userFiles = files;
		this.boardCode = boardCode;
		this.uploadFolder = File.separator+"public"+File.separator+upLoadDirPath+File.separator+tableName+File.separator;
		

	}
	/**
	 * 파일 전체 갯수
	 * @return
	 */
	public int fileCount(){
		int i = 0;
		for(Upload file : this.userFiles) {
			if(file != null) {
				String fileName = file.getFileName();
				if(fileName != ""){
					i++;
				}
			}
		}
		return i;
	}
	
	/**
	 * 파일 에러 체크
	 * @return
	 */
	public String fileError(String format){
		
		for(Upload file : this.userFiles) {
			if(file != null) {
				String fileType = file.getContentType();
				String fileName = file.getFileName();
				
				
				//System.out.println("fileType : "+fileType);
				//System.out.println("fileName : "+fileName);
				if(fileName != ""){
					long fileSize = file.getSize();
					
					boolean isMineCheck = isFileMineType(format,fileType);
					boolean isSizeCheck = isFileSize(fileSize);
					
					if(!isMineCheck){
						return "mine";
					} 
					
					if(! isSizeCheck){
						return "size";
					}
				}
			}
		}
		return "true";
	}
	
	/**
	 * 파일 업로드후 배열로 저장
	 * @return
	 * @throws Exception
	 */
	public List<Map> uploadFile() throws Exception{
		
		InputStream inStream;
		
		List<Map> fileInfo = new ArrayList<Map>();
		
		for(Upload file : this.userFiles) {
			
			if(file != null) {
				
				boolean isImages = false;
				int fileWidth = 0;
				int fileHeight = 0;
				
				String fileType = file.getContentType();
				isImages = inArray(mineTypeImages(),fileType);
				String fName = file.getFileName();
				
				if(fName != ""){
					
					if(isImages == true){
						BufferedImage source = ImageIO.read(file.asFile());
						fileWidth = source.getWidth();
						fileHeight = source.getHeight();
					} else {
						fileWidth = 0;
						fileHeight = 0;
					}
					
					long fileSize = file.getSize();
					String fileName = file.getFileName();
					String fileExt = fileExt(fileName);
					String newFileName = newFileName(fileName);
					
					inStream = new java.io.FileInputStream(file.asFile());
					
					File dir = new File(this.uploadFolder);
					makeDir(dir);
					String fileData = this.uploadFolder+newFileName;
					IOUtils.copy(inStream, new FileOutputStream(Play.getFile(fileData)));
					Map<String, Object> info = new HashMap<String, Object>();
					info.put("fileName",fileName);
					info.put("newFileName",newFileName);
					info.put("fileExt",fileExt);
					info.put("fileWidth",fileWidth);
					info.put("fileHeight",fileHeight);
					info.put("fileSize",fileSize);
					fileInfo.add(info);
				}
			}
		}
		
		return fileInfo;

	}
	/**
	 * 파일 정보 저장
	 * @param type
	 * @param format
	 * @param url
	 * @param name
	 * @param newName
	 * @param ext
	 * @param width
	 * @param height
	 * @param size
	 */
	public void createFile(long idx , String type , String format , String url , String fileName , String newName , String ext , int width , int height , long size){
		
		final JeiFile jeiFile = new JeiFile();
		
		jeiFile.tableName = this.tableName;
		jeiFile.boardCode = this.boardCode;
		jeiFile.boardIdx = idx;
		jeiFile.fileType = type;
		jeiFile.fileFormat = format;
		jeiFile.fileUrl = url;
		jeiFile.fileRealName = fileName;
		jeiFile.fileName = newName;
		jeiFile.fileExt = ext;
		jeiFile.fileWidth = width;
		jeiFile.fileHeight = height;
		jeiFile.fileSize = size;
		
		jeiFile.save();
	}
	
	
	/**
	 * 파일 정보 업데이트
	 * @param type
	 * @param format
	 * @param url
	 * @param name
	 * @param newName
	 * @param ext
	 * @param width
	 * @param height
	 * @param size
	 */
	public void updateFile( String fileName , String newName , String ext , int width , int height , long size , long fileIdx){
		
		JeiFile jeiFileUpdate			= JeiFile.findById(fileIdx);
		
		jeiFileUpdate.fileRealName = fileName;
		jeiFileUpdate.fileName = newName;
		jeiFileUpdate.fileExt = ext;
		jeiFileUpdate.fileWidth = width;
		jeiFileUpdate.fileHeight = height;
		jeiFileUpdate.fileSize = size;
		
		jeiFileUpdate.save();
	}
	
	/**
	 * 파일명 변경
	 * @param fileName
	 * @return
	 * @throws Exception
	 */
	private String newFileName(String fileName) throws Exception{
		
		String ext = fileExt(fileName);
		long time = System.currentTimeMillis() / 1000;
		
		String name = time+fileName;
		String newName = SHA256Encryptor.encrypt(name.trim());
		String newFile = newName+"."+ext;
		
		return newFile;
		
	}
	
	/**
	 * 디렉토리 생성
	 */
	private void makeDir(File dir){
		//File dir = new File(this.uploadDir);

	    if (!dir.exists()) {
	        dir.mkdirs();
	    }
	}
	
	/**
	 * 용량 구하기
	 */
	private boolean isFileSize(long size){
		if(fileLimit > size){
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 확장자 구하기
	 */
	private String fileExt(String fileName){
		int pos = fileName.lastIndexOf( "." );
		String ext = fileName.substring( pos + 1 );
		return ext;
	}
	
	/**
	 * PHP in_array
	 * @param array
	 * @param needle
	 * @return
	 */
	private boolean inArray(String[] array , String needle) {
	    for(int i=0;i<array.length;i++) {
	        if(array[i].equals(needle)) {
	        	return true;
	        }
	    }
	    return false;
	}
	
	/**
	 * 이미지 mine type
	 * @return
	 */
	private String[] mineTypeImages(){
		String images[] = new String[3];
		images[0] = "image/gif";
		images[1] = "image/jpeg";
		images[2] = "image/pjpeg";
		return images;
	}
	/**
	 * 문서 타입 mine type
	 * @return
	 */
	private String[] mineTypeDoc(){
		
		String doc[] = new String[5]; 
		doc[0] = "application/vnd.msword";
		doc[1] = "application.vnd.ms-excel";
		doc[2] = "application/vnd.ms-powerpoint";
		doc[3] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		doc[4] = "text/plain";
		
		return doc;
	}
	
	/**
	 * 파일 타입 체크 해서 파일 업로드 안되게
	 *
	 * @param	mode
	 * @param	fileMineType
	 * @return	boolean
	 */
	private boolean isFileMineType(String mode, String fileMineType) {
//		boolean isImages = false;
//		boolean isDoc = false;
//		boolean isCheck = false;
		
		if(mode.equals("image")) {
			if(inArray(mineTypeImages(),fileMineType))
				return true;
		}
		
		if(mode.equals("doc")){
			if(inArray(mineTypeDoc(),fileMineType))
				return true;
		}
		
		if(mode.equals("imgdoc")){
			if(inArray(mineTypeImages(),fileMineType) || inArray(mineTypeDoc(),fileMineType))
				return true;
		}
		
		return false;
		
	}
	
	/**
	 * 파일 삭제
	 * @param name
	 */
	public void fileDelete(String name){
		String path = downloadPath;
    	path +=name;
    	File file = new File(path);
    	file.delete();
	}
	
}

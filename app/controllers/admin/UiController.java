package controllers.admin;

import static utils.Constants.NBOARD_EMOTICON_URL;
import static utils.Constants.NBOARD_IMAGE_UPLOAD_URL;
import static utils.Constants.NBOARD_SKIN_URL;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import models.Upload;
import play.db.jpa.Blob;
import play.libs.MimeTypes;
import play.mvc.Controller;

/**
 * UI 공통 샘플용
 * @author 노윤희
 * @since 2012-03-14
 */
public class UiController extends Controller {

	public static void index(){
		render();		
	}
	public static void validation(){
		render();
	}

	//스마트 에디터 
	public static void smartedit(){		
		String nboardimageuploadurl = NBOARD_IMAGE_UPLOAD_URL;		
		String nboardemoticonurl = NBOARD_EMOTICON_URL;
		String nboardskinurl = NBOARD_SKIN_URL;
		
		render(nboardimageuploadurl,nboardemoticonurl,nboardskinurl);
	}
	public static void smarteditok(String content1){
		render(content1);
	}	
	public static void smarteditemoticon(){
    	String id = params.get("id");
		render(id);
	}
	public static void smarteditimgupload(){
    	String id = params.get("id");
		render(id);
	}
	public static void smarteditimguploadpro(File updateimage) throws FileNotFoundException {
	
		final Upload upload = new Upload();
		upload.photoFileName = updateimage.getName();
		
		//파일 용량,확장자,가로x세로 사이즈 체크등 필요		
		if(updateimage.length() > 1024 * 1024 * 2 ){			
			System.out.println("file upload fail");
			String msg = "파일 제한 용량 2M 초과";
			renderText(msg);
		}
		else{			
			upload.photo = new Blob();
			upload.photo.set(new FileInputStream(updateimage), MimeTypes.getContentType(updateimage.getName()));
			upload.save();
			String id = params.get("id");
			long fileid = upload.getId();
			render(id,fileid);		
		
						
		}	
	}		
	public static void filePhoto(long id) {
 	   final Upload upload = Upload.findById(id);
 	   notFoundIfNull(upload);
 	   response.setContentTypeIfNotSet(upload.photo.type());
 	   renderBinary(upload.photo.get());
   }	
		
	
	
}

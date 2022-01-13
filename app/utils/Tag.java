package utils;
import play.*;
import java.util.List;

import play.db.jpa.JPA;
import models.JeiTag;
import models.JeiTagList;

/**
*
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/
public class Tag {
	
	private String tag;
	private String tableName;
	private String boardCode;
	private long idx;
	private long tagIdx;
	
	/**
	 * 생성자 
	 * @param tag 태그
	 * @param tableName 게시판 이름
	 * @param boardCode 게시판 코드
	 * @param idx 게시물 idx
	 */
	public Tag(String tag , String tableName , String boardCode , long idx){
		this.tag 		= tag;
		this.tableName 	= tableName;
		this.boardCode 	= boardCode;
		this.idx 		= idx;
	}
	
	
	/**
	 * 태그 명
	 * @param tag
	 */
	private void createTag(String tag){
		final JeiTag jeiTag = new JeiTag();
	
		JeiTag data = jeiTag.find("ByTag",tag).first();
		long idx = data.idx;
		
		if(idx > 0){
			JeiTag tagCntUp = jeiTag.findById(idx);
			tagCntUp.tagCnt = tagCntUp.tagCnt + 1;
			tagCntUp.save();
		} else {
			jeiTag.tag = tag;
			jeiTag.tagCnt = 1;
			jeiTag.save();			
		}
	}
	
	
	/**
	 * 태그 저장
	 * @param tag
	 */
	private void createTagList(String tag){
		final JeiTagList jeiTagList = new JeiTagList();
		jeiTagList.tableName = tableName;
		jeiTagList.boardCode = boardCode;
		jeiTagList.boardIdx = idx;
		jeiTagList.tag = tag;
		jeiTagList.save();
	}
	
	/**
	 * 태그 리스트 
	 * @param tag
	 * @return
	 */
	public void tagList(){
		if(this.tag == null || this.tag.length() == 0)
			return;
	
		String[] tagArray;	
		tagArray = tag.split(",");
		for(int i=0;i<tagArray.length;i++){
			if(!tagArray[i].isEmpty()){
				createTagList(tagArray[i]);
			}
		}
		
	}
	
	/**
	 * 태그 뷰
	 * @param idx
	 * @param tableName
	 * @param boardCode
	 */
	public List readTag(){
		//final JeiTagList jeiTagList = new JeiTagList();
		List<JeiTagList> data = JeiTagList.find("boardIdx = ? AND tableName = ? AND boardCode = ? ",this.idx,this.tableName,this.boardCode).fetch();
		return data;
	}
	
	
	
	/**
	 * 게시물 태그 수정
	 * @param tag
	 * @return
	 */
	private boolean editTagList(String tag){
			
		//final JeiTagList jeiTagList = new JeiTagList();
		
		List<JeiTagList> data = JeiTagList.find("boardIdx = ? AND tableName = ? AND boardCode = ? ",this.idx,this.tableName,this.boardCode).fetch();
		int boardTagCount = data.size();
		
		
		if(this.tag != null && this.tag.length() > 0){
			int tagIndex = this.tag.indexOf(",");
			
			if(tagIndex > 0){
				
				String[] tagArray;	
				tagArray = tag.split(",");
				
				for(int j=0;j<boardTagCount;j++){
					
					long idx = data.get(j).idx;
					String tagName = data.get(j).tag;
					
					for(int i=0;i<tagArray.length;i++){
						
						if(tagName.equals(tagArray[i])){
							
						} else {
							
							JeiTagList tagDel = JeiTagList.findById(idx);
							tagDel.delete();							
						}
					}
				}
				
			}
			
		}
		
		/*if(boardTagCount == 0){
			jeiTagList.tableName = this.tableName;
			jeiTagList.boardCode = this.boardCode;
			jeiTagList.boardIdx = this.idx;
			jeiTagList.tag = tag;
			jeiTagList.save();
			return true;
		} else {
			
			for(int i=0;i<boardTagCount;i++){
				data.get(i).tag
			}
			
			return false;
		}*/
		
		return true;
		
		
	}
	
	
	
}
package utils;

import static utils.Constants.BLOCK_LIST_COUNT;
import static utils.Constants.BLOCK_PAGE_COUNT;

/**
* 페이징
* @author : Boky
* @since : 2012-01-16
* @version : 
* 
*/
public class Pagination {

	private String location;

	private int page;
	private int totalCount;
	
	private int limitPage 	= BLOCK_LIST_COUNT;
	private int limitBlock	= BLOCK_PAGE_COUNT;
	
	private int totalBlock;
	private int block;
	private int totalPage;
	
	public int getTotalPage() {
		return totalPage;
	}

	private int firstPage;
	private int lastPage;
	
	private int firstBlock;
	private int prevPage;
	private int lastBlock;
	private int nextPage;
	
	public Pagination(String location, int page, int totalCount){
		
		this.location		= location;
		this.page			= page;
		this.totalCount		= totalCount;
				
		this.totalPage		= (int)Math.ceil((double)this.totalCount / (double)this.limitPage);
		this.totalBlock		= (int)Math.ceil((double)this.totalPage/(double)this.limitBlock);
		this.block			= (int)Math.ceil((double)this.page /(double)this.limitBlock);
		
		this.firstPage		= (this.block-1) * this.limitBlock;
		this.lastPage		= this.lastPage();
		
		this.firstBlock		= 10;
		this.prevPage		= this.prevPage();
		this.nextPage		= this.nextPage();
		this.lastBlock		= this.lastBlock();
	
	}
	
	public int getBlock() {
		return block;
	}

	private int lastPage(){
		
		int lastPage = this.block * this.limitBlock;

		if(this.block >= this.totalBlock) lastPage = this.totalPage;

		return lastPage;

	}
	
	public int getTotalBlock() {
		return totalBlock;
	}

	public String getLocation() {
		return location;
	}

	public int getPage() {
		return page;
	}

	public int getFirstPage() {
		return firstPage;
	}

	public int getLastPage() {
		return lastPage;
	}

	public int getFirstBlock() {
		return firstBlock;
	}

	public int getPrevPage() {
		return prevPage;
	}

	public int getLastBlock() {
		return lastBlock;
	}

	public int getNextPage() {
		return nextPage;
	}

	private int firstBlock(){
		if(this.block > 1){
			return 1;
		} else {
			return 0;
		}
	}
	
	private int prevPage(){
		if(this.page > 1) {
			return this.page - 1;
		} else {
			return 0;
		}
	}
	
	private int nextPage(){
		if(this.totalPage > this.page){
			return this.page + 1;
		} else {
			return 0;
		}
		
	}
	
	private int lastBlock(){
		if(this.block < this.totalBlock){
			return this.totalPage;
		} else {
			return 0;
		}
		
	}
}

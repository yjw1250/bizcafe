/**
 * 게시판 
 * @author BOKY
 * @since 2012/02/14
 * 
 */

var isPatternNumber = /\d/;//숫자
$(document).ready(function() {
	
	$(function(){
		
		$.extend({
			modify:function(){
				var boardCode = $('#boardCode').val();
				$("#viewForm").attr({
					action: "/admin/board/"+boardCode+"/modify"
				});
				$('#viewForm').submit();
			},
			
			search:function(){
				var boardCode = $('#boardCode').val();
				var searchVal = $.trim($('#searchVal').val());
				var searchValLen = searchVal.length;
				
				if(searchValLen < 2){
					alert("검색어를 2자 이상 입력해주세요");
					return;
				}
				
				
				$("#listForm").attr({
					action: "/board/"+boardCode+"/search",
					method: "post"
				});
				$('#listForm').submit();
			},
			
			page:function(page){
				if(!isPatternNumber.test(page)){
					return;
				}
				var boardCode = $('#boardCode').val();
				var encode = encodeURIComponent($.trim($('#searchVal').val()));
				
				$('#searchVal').val(encode);
				
				$("#listForm").attr({
					action: "/board/"+boardCode,
					method: "get"
				});
				$('#page').val(page);
				$('#listForm').submit();
			},
			
			view:function(idx){

				var boardCode = $('#boardCode').val();
				var encode = encodeURIComponent($.trim($('#searchVal').val()));
				
				$('#searchVal').val(encode);
				$('#idx').val(idx);
				
				$("#listForm").attr({
					action: "/board/"+boardCode+"/read",
					method: "get"
				});
				$('#listForm').submit();
			},
			
			// 이미지삽입 함수 imgupload_pro.asp 에서 호출
			insertIMG : function(irid,fileame){
				var sHTML = "<img src='" + imagepath + "/" + fileame + "' border='0'>";
				oEditors.getById[irid].exec("PASTE_HTML", [sHTML]);
			},
			
			// 이모티콘삽입 함수
			insertEmoticonIMG : function(irid,fileame){
				var sHTML = "<img src='" + emoticonpath + "/" + fileame + "' border='0'>";
				oEditors.getById[irid].exec("PASTE_HTML", [sHTML]);
			}
			
			
		});
		
	});
	
	
	
	$(".gallery_list li").live('click',function() {
		
		var bigImageWidth = "";
		var bigImageHeight = "";
		var index = $(".gallery_list li").index(this);
		var bigImageUrl = $('.bigImages').eq(index).attr("src");
		bigImageWidth = $('.bigImages').eq(index).width();
		bigImageHeight = $('.bigImages').eq(index).height();
		
		var imgMaxW = 600;
		var imgMaxH = 445;
		
		var imgW = bigImageWidth;
		var imgH = bigImageHeight;
		
		if ( bigImageWidth > imgMaxW ) {  // 이미지가 600보다 크다면 너비를 600으로 맞우고 비율에 맞춰 세로값을 변경한다.      
			var imgH = bigImageHeight /( bigImageWidth / imgMaxW);
			var imgW = imgMaxW;     
		}
		
		if ( bigImageHeight > imgMaxH ) {  // 이미지가 400보다 크다면 너비를 400으로 맞우고 비율에 맞춰 세로값을 변경한다.      
			var imgW = bigImageWidth /(bigImageHeight / imgMaxH);
			var imgH = imgMaxH;
		}
		
		$('.pop_wrap').show();
		$('.gallery_pop img').attr({
			src:bigImageUrl,
			width:imgW,
			height:imgH
		});
		
	});
	
	$(".popBtn").live('click',function() {
		$(".pop_wrap").hide();
	});
	
	$("#galleryHide").live('click',function() {
		$(".pop_wrap").hide();
	});
	
	$("#contentText").bind('focus',function(){
		$(this).removeClass("bg_txt_qna");
	});
	
	$("#btnRegister").bind('click',function(){
		
		var title = $.trim($('#title').val());
		var contents = $.trim($('#contentText').val());
		var titleLen = title.length;
		
		if(title==""){
			alert("제목을 입력해주세요.");
			return;
		}
		
		if(titleLen > 100){
			alert("제목을 100자 이내로 입력해주세요.");
			return;
		}
		
		if(contents==""){
			alert("내용을 입력해주세요.");
			return;
		}
		$('#proceForm').submit();
	});
	
	$("#btnModify").bind('click',function(){
		var boardCode = $('#boardCode').val();
		$('#viewForm').attr({
			action:'/board/'+boardCode+'/modify',
			method:'post'
		});
		$('#viewForm').submit();
	});
	
	$("#btnList").bind('click',function(){
		var boardCode = $('#boardCode').val();
		$('#viewForm').attr({
			action:'/board/'+boardCode,
			method:'get'
		})
		$('#viewForm').submit();
	});
	
	
	$("#btnDel").bind('click',function(){
		var con = confirm("삭제 하시겠습니까?");
		
		if(con == true){
			var boardCode = $('#boardCode').val();
			$('#viewForm').attr({
				action:'/board/'+boardCode+"/delete",
				method:'post'
			})
			$('#viewForm').submit();
		}
	});
	
	$("#btnPrint").bind('click',function(){
		window.print();
	});
	
	$(".file_attach").live('click',function() {
	
		var index = $(this).index();
		
		
		var boardCode = $('#boardCode').val();
		var file_idx = $('.file_idx').eq(index).val();
		
		
		
		$('#fileIdx').val(file_idx);
		$('#viewForm').attr({
			action:'/board/'+boardCode+"/download",
			method:'post'
		})
		$('#viewForm').submit();
	
	});
	
	resizeImages('contents','550');
	
});

var tagCheck = function(str,limit){
	if(str == ""){
		return true;
	}
	
	var tag = str.split(",");
	var tagCnt = tag.length;
	
	if(tagCnt > limit){
		return false;
	}
	
	
}

//이미지 사이즈 조정
resizeImages = function(id,imgWidth){
	var resizeWidth = parseInt(imgWidth);
	$('#'+id+' img').each(function(){
		var tmpWidth = $(this).width();
		if(tmpWidth > resizeWidth) $(this).width(resizeWidth);
		$(this).load(function() {
			tmpWidth = $(this).width();
			if(tmpWidth > resizeWidth) $(this).width(resizeWidth);
		});
	});
}
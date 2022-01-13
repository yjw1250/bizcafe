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
			galleryModify:function(){
				var boardCode = $('#boardCode').val();
				$("#listForm").attr({
					method:"post",
					action: "/admin/board/"+boardCode+"/modify"
				});
				$('#listForm').submit();
			},
			galleryDelete:function(){
				var con = confirm("삭제 하시겠습니까?");
				if(con == true){
					var boardCode = $('#boardCode').val();
					$("#listForm").attr({
						method:"post",
						action: "/admin/board/"+boardCode+"/delete"
					});
					$('#listForm').submit();
				}
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
					method:"post",
					action: "/admin/board/"+boardCode+"/search"
				});
				$('#listForm').submit();
			},
			page:function(page){
				if(!isPatternNumber.test(page)){
					return;
				}
				var boardCode = $('#boardCode').val();
				$('#page').val(page);
				$("#listForm").attr({
					method:"get",
					action: "/admin/board/"+boardCode
				});
				$('#listForm').submit();
			},
			del:function(){
				var con = confirm("삭제 하시겠습니까?");
				if(con == true){
					var boardCode = $('#boardCode').val();
					$("#viewForm").attr({
						action: "/admin/board/"+boardCode+"/delete"
					});
					$('#viewForm').submit();
				}
			},
			galleryClose:function(){
				$('.pop_wrap').hide();
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
	
	resizeImages('contents','550');
	
	$(".gallery_list li").bind('click',function() {
		
		var index = $(this).index();
		var bigImageUrl = $('.bigImages').eq(index).attr("src");
		var bigImageIdx = $('.bigImages').eq(index).attr("alt");
		var bigImageWidth = $('.bigImages').eq(index).width();
		var bigImageHeight = $('.bigImages').eq(index).height();
		
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
		
		
		$('#idx').val(bigImageIdx);
		$('.pop_wrap').show();
		$('.pop_wrap .gallery_pop img').attr({
			src:bigImageUrl,
			width:imgW,
			height:imgH
		});
		
	});
	
	$(".file_attach").live('click',function() {
		
		var index = $(this).index();
		
		
		var boardCode = $('#boardCode').val();
		var file_idx = $('.file_idx').eq(index).val();
		
		
		
		$('#fileIdx').val(file_idx);
		$('#viewForm').attr({
			action:'/admin/board/'+boardCode+"/download",
			method:'post'
		})
		$('#viewForm').submit();
	
	});
	
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
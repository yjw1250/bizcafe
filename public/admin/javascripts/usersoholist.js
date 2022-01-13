var _LISTUNIT = 10 ; // 게시물 수
var _PAGEUNIT = 10 ; // 페이징 수
var _PAGE = 1 ;		// 현재 페이지
$(document).ready(function() {
	$(function() {
		
		$.extend({
			
			// 소호사무실 회원 예약 현황
			sohoUserList:function(page) {		
				if(!page)
				page = _PAGE ;				
			 		$.ajax({
			 		type: "GET",
			 		url:"/admin/booking/sohouserlist.json",
			 		data:"page="+page+"&resUserID="+$("#userID").val(),
			 		cache: false,
			 		async: true,
			 		dataType : "json",	
			 		success: function(jsonData, textStatus, XMLHttpRequest) {
			 			$("#listHeader").html(TrimPath.processDOMTemplate("templateList", jsonData));
			 			$("#pageNavi").html($.paging(page, jsonData.count));
			 		},
			 		error:function (xhr, ajaxOptions, thrownError){	
			 			alert(_THROWNERROR);
			 			// Do nothing
			 		}
			 	});
			}
			
		});
		
		$.sohoUserList();
		
		// paging 클릭
		$(".naviPage").live("click",function() {
			var page = $(this).attr('pageNo');	
			_PAGE = page ;
			$.sohoUserList(page);
			
		});
		
	});
});
var _LISTUNIT = 10 ; // 게시물 수
var _PAGEUNIT = 10 ; // 페이징 수
var _PAGE = 1 ;		// 현재 페이지
$(document).ready(function() {
	$(function() {
		
		$.extend({
			// 전체 예약 현황 
			sohoList:function(page) {		
				if(!page)
					page = _PAGE ;				
				 	$.ajax({
					type: "GET",
					url:"/booking/businesslist.json",
					data:"page="+page+"&pageType=state&resType=OF",
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
			},
	
			/* 예약수정 */
			modifyReserver:function(idx){
				location.href="/booking/sohodetail/"+idx;
			},
			
			/* 예약내역 보기 */
			showReserver:function(residx){
				location.href="/booking/service/complete/"+residx;
			},
			
			/* 예약취소 */
			cancelReserver:function(idx){
				
				if(confirm("예약을 정말 취소 하시겠습니까?")) {
					$.ajax({
						type: "PUT",
						url:"/booking/sohoroomcancel.json",
						data: {
							"reservation.idx" : idx
						},
						cache: false,
						async: true,
						dataType : "json",
						success: function(jsonData, textStatus, XMLHttpRequest) {
							switch(jsonData.result) {	
									case "200" : 
										alert("예약이  취소 되었습니다");
										$.sohoUserList();
									break;
							}
						},
						error:function (xhr, ajaxOptions, thrownError){	
							alert(_THROWNERROR);
						}
					});
				}
				
				
			},
			// 회원 예약 현황
			sohoUserList:function(page) {		
				if(!page)
					page = _PAGE ;				
				 	$.ajax({
					type: "GET",
					url:"/booking/businesslist.json",
					data:"page="+page+"&pageType=state&resType=OF&resUserID="+$("#userID").val(),
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
	
		if($("#usercount").val() >= 1){
			$.sohoUserList();
		}
		else{
			$.sohoList();
		}
		
		
		// paging 클릭
		$(".naviPage").live("click",function() {
			var page = $(this).attr('pageNo');	
			_PAGE = page ;
			if($("#usercount").val() >= 1){
				$.sohoUserList(page);
			}
			else{
				$.sohoList(page);
			}
		});
		
		//예약바로가기 클릭
		$("#gobusiness").bind("click",function(){
			location.href="/booking/soho";
		});
		
		//전체 비즈니스 예약 현황 보기
		$("#business_totallist").bind("click",function(){
			location.href="/booking/sohostatetotal";
		});
		
		//내 예약현황 보기
		$("#business_mylist").bind("click",function(){
			location.href="/booking/sohostate";
		});
	});
	
	
});
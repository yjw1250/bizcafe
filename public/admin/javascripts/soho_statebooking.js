
var _LISTUNIT = 10 ; // 게시물 수
var _PAGEUNIT = 10 ; // 페이징 수
var _PAGE = 1 ;		// 현재 페이지

var timedata= [];
$(document).ready(function() {
	
	var today = new Date(); //오늘 날짜
	var sel_time = today.getFullYear();
	var room_title;
	var room_cnt; //룸갯수
	var admin = 2; //사용자 모드
	
	var stateCD = 0; // 리스트 상태값(0:예약중,1:이용완료,9:예약취소)
	$(function() {
		
		$.extend({
			//리스트  상태별로 바꾸기
			changestate:function(stateCD){
				$("#stateCD").val(stateCD);
				$.businessList();

				if(stateCD == '0'){
					$("#res0").attr("class","selected");
					$("#res1").attr("class","");
					$("#res2").attr("class","");
					$("#res9").attr("class","");
				}
				else if(stateCD == '1'){
					$("#res1").attr("class","selected");
					$("#res0").attr("class","");
					$("#res2").attr("class","");
					$("#res9").attr("class","");
				}
				else if(stateCD == '2'){
					$("#res2").attr("class","selected");
					$("#res0").attr("class","");
					$("#res1").attr("class","");
					$("#res9").attr("class","");
				}
				else if(stateCD == '9'){
					$("#res9").attr("class","selected");
					$("#res0").attr("class","");
					$("#res1").attr("class","");
					$("#res2").attr("class","");
				}
			},
			// 사용자 리스트 
			businessList:function(page) {						
				if(!page)
					page = _PAGE ;				
				 	$.ajax({
					type: "GET",
					url:"/admin/booking/businesslist.json",
					data:"page="+page+"&resType=OF&stateCD="+$("#stateCD").val(),
					cache: false,
					async: true,
					dataType : "json",	
					success: function(jsonData, textStatus, XMLHttpRequest) {
						$("#stateCD").val(jsonData.stateCD);
						$("#totalCount").html(jsonData.count);						
						$("#listHeader").html(TrimPath.processDOMTemplate("templateList", jsonData));
						$("#pageNavi").html($.paging(page, jsonData.count));
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
						// Do nothing
					}
				});
			},
			
			
			
			/* 예약정보 가져오기 */
			getReserver:function(year){
				$.ajax({
					type: "GET",
					url:"/admin/booking/sohoreserver.json",
					data:"resyear="+year,
					cache: false,
					async: true,
					dataType : "json",
					success:function(jsonData, textStatus, XMLHttpRequest){
						jsondata =jsonData;
						//$.getRoomInfo("B");	
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});
			},
			
			getRoomInfo:function(roomCode01){
				$.ajax({
					type: "GET",
					url:"/admin/booking/businessroominfo.json",
					data:"roomCode01="+roomCode01,
					cache: false,
					async: true,
					dataType : "json",					
					complete: function(XMLHttpRequest) {
					},					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						
						
						var addroom = "";
						var room_name = "";
						var room_name_max = "";
						var roomcode = ""; //룸코드
						
						for(var key in jsonData.roomlist){
							
							room_name = room_name + "," + jsonData.roomlist[key].roomName04;
							room_name_max = room_name_max + "," + jsonData.roomlist[key].roomName03;
							roomcode = roomcode + "," + jsonData.roomlist[key].roomCode;
							
							var g = parseInt(key,10) + 1;
							var getroom_max = jsonData.roomlist[key].roomName03;
							
							if(key == 0){
								addroom = getroom_max;
							}
							else{
								if((g < jsonData.roomlist.length) && (getroom_max != jsonData.roomlist[g].roomName03)){
									addroom = addroom + "," + jsonData.roomlist[g].roomName03;
								}
							}
						}
						room_title = jsonData.roomlist[0].roomName02; //룸제목
						room_cnt = jsonData.roomlist.length; //룸갯수
						
						$("#sel_time").val(sel_time);
						$("#showyear").text(sel_time);
						$("#soho").html($.soho_display(sel_time,room_title,room_cnt,roomcode,room_name,room_name_max,admin,jsondata));
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});	
			},
			
			/* 전체룸정보 호출 */
			getRoomShow:function(){
				/*룸 정보 호출 */
				$.getReserver(sel_time);
			}
			
			
		});
		
		$("#stateCD").val(stateCD);
		$("#res0").attr("class","selected");
		
		$.businessList();
		
		// paging 클릭
		jQuery(".naviPage").live("click",function() {
			var page = $(this).attr('pageNo');	
			_PAGE = page ;
			$.businessList(page);
		});
		
		var todayString = leadingZeros(today.getFullYear(),4) + "-" + leadingZeros((today.getMonth()+1),2) + "-" + leadingZeros(today.getDate(),2);
		$("#resdate").val(todayString);
		
		//이전 년도 검색
		$("#prevyear").bind("click",function(){
			sel_time = $.getYear(sel_time,-1);
			
			var toDay = today.getFullYear();
			if(sel_time < toDay){
				alert("지나간 년도는 예약할수 없습니다.");
				return;
			}
			
			$.getRoomShow();
		});
		
		//다음 년도 검색
		$("#nextyear").bind("click",function(){
			sel_time = $.getYear(sel_time,+1);
			$.getRoomShow();
		});
		
		// 회원 검색 팝업 창닫기
		$("#btnClose,#btnCloseBic").bind("click", function() {
			$("#readUserInfo").hide();
		});
		
		$.getRoomShow();
		
	});
	
	
});
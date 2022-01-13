
var _LISTUNIT = 10 ; // 게시물 수
var _PAGEUNIT = 10 ; // 페이징 수
var _PAGE = 1 ;		// 현재 페이지

var timedata= [];
$(document).ready(function() {
	
	var start_time = 8; //시작시간
	var end_time = 21; //종료시간
	var room_cnt; //룸갯수
	var room_title;
	var room_code; //룸코드명
	var today = new Date(); //오늘 날짜
	var current_hour = today.getHours(); //현재시간
	var current_min	= today.getMinutes(); //현재분
	var sel_time; //선택된 날짜
	var admin = 2; //관리자 모드(1:일반관리자,2:현황보기)
	var jsondata =""; //기 예약 정보
	
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
					$("#res9").attr("class","");
				}
				else if(stateCD == '1'){
					$("#res1").attr("class","selected");
					$("#res0").attr("class","");
					$("#res9").attr("class","");
				}
				else if(stateCD == '9'){
					$("#res9").attr("class","selected");
					$("#res0").attr("class","");
					$("#res1").attr("class","");
				}
				
			},
			// 사용자 리스트 
			businessList:function(page) {						
				if(!page)
					page = _PAGE ;				
				 	$.ajax({
					type: "GET",
					url:"/admin/booking/businesslist.json",
					data:"page="+page+"&resType=BZ&stateCD="+$("#stateCD").val(),
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
						alert(thrownError);
						// Do nothing
					}
				});
			},
			
			
			
			/* 예약정보 가져오기 */
			getReserver:function(date){
				$.ajax({
					type: "GET",
					url:"/admin/booking/businessreserver.json",
					data:"resdate="+date,
					cache: false,
					async: true,
					dataType : "json",
					complete:function(XMLHttpRequest){
						
					},
					success:function(jsonData, textStatus, XMLHttpRequest){
						jsondata = jsonData;
						$.getRoomInfo("A");
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});
			},
			
			getRoomInfo:function(roomCode01){
				$.ajax({
					type: "GET",
					url:"/admin/booking/businessallinfo.json",
					data:"roomCode01="+roomCode01,
					cache: false,
					async: true,
					dataType : "json",					
					complete: function(XMLHttpRequest) {
					},					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						
						
						sel_time = $("#resdate").val(); //선택한 날짜						
						$("#showdate").text(sel_time);
						
						var sel1 =  sel_time.split("-"); //선택된 날짜 나누기(0000-00-00 의 '-' 구분자로 년월일 나누기)
						var sel2 =  new Date(sel1[0],sel1[1]-1,sel1[2]); //선택된 날짜 가져오기
						
						switch(sel2.getDay()) {
							case 0 : 
								start_time = 10;
								end_time = 17;
							break;
							case 6 :
								start_time = 10;
								end_time = 19;
							break;
							default :
								start_time = 8;
								end_time = 21;
						}
						
						
						var addroom = "";
						var room_name = "";
						var room_name_max = "";
						var roomcode = ""; //룸코드
						for(var key in jsonData.roomlist){
							
							room_name = room_name + "," + jsonData.roomlist[key].roomName04;
							room_name_max = room_name_max + "," + jsonData.roomlist[key].roomName03;
							roomcode = roomcode + "," + jsonData.roomlist[key].roomCode;
							
							room_cnt = jsonData.roomlist.length; //룸갯수
							//room_title = jsonData.roomlist[key].roomName03; //룸제목
							room_title = ""; //룸제목
							room_code = jsonData.roomlist[key].roomCode02; //룸코드명
							
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
						
						
						
						/* 보여줄 날짜 출력 */
						$("#booking").html($.booking_display(start_time,end_time,sel_time,room_cnt,room_title,roomcode,room_name,room_name_max,addroom,admin,jsondata));
						
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});	
			},
			
			/* 전체룸정보 호출 */
			getRoomShow:function(){
				/*룸 정보 호출 */
				$.getReserver($("#resdate").val());
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
		
		//이전 날짜 검색
		$("#prevday").bind("click",function(){
			var seldate = $("#resdate").val();
			var DateString = $.getDate(seldate,-1);
			$("#resdate").val(DateString);
			$.getRoomShow();
		});
		
		//이후 날짜 검색
		$("#nextday").bind("click",function(){
			var seldate = $("#resdate").val();
			var DateString = $.getDate(seldate,1);
			$("#resdate").val(DateString);
			$.getRoomShow();
		});
		
		// 회원 검색 팝업 창닫기
		$("#btnClose,#btnCloseBic").bind("click", function() {
			$("#readUserInfo").hide();
		});
		
		$.getRoomShow();
		
	});
	
	
});
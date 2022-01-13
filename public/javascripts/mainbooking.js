/*
 * 숫자에 0을 자릿수 만큼 더해준다 
 * @param n : 변환할 숫자값
 * @param digits : 자릿수
 */
function leadingZeros(n, digits) {
	  var zero = '';
	  n = n.toString();

	  if (n.length < digits) {
	    for (i = 0; i < digits - n.length; i++)
	      zero += '0';
	  }
	  return zero + n;
}

//전역 변수 선언
var _LISTS = 5 ; // 게시물 수
var _PAGES = 10 ; // 페이징 수
var _PAGE = 1 ;

$(document).ready(function() {
	
	var today = new Date(); //오늘 날짜
	var current_hour = today.getHours(); //현재시간
	var current_min	= today.getMinutes(); //현재분
	
	$(function() {
		
		$.extend({
			
			// 페이징
			bookpaging:function(thisPage, totalCnt) {	
				if(totalCnt <=0)
					return "" ;				
				
				var listUnit = _LISTS ;
				var pageUnit = _PAGES;

				var totPages = Math.ceil(totalCnt/listUnit); //총페이지수
				var thisBlock = Math.ceil(thisPage/pageUnit); //현재 페이징블럭
				var startPage, endPage; // 현재 페이징블럭 처음, 마지막 페지이
				var preBlock, nextBlock ; // 이전, 다음 페이징 블럭
				var html = "";
				
				if(thisPage > 1){
					preBlock = parseInt(thisPage,10) - 1;
				}
				else if(thisPage == 1){
					preBlock = totPages;
				}
				else{
					preBlock = thisPage;
				}
				
				if(thisPage < totPages){
					nextBlock = parseInt(thisPage,10) + 1;
				}
				else if(thisPage == totPages){
					nextBlock = 1;
				}
				else{
					nextBlock = thisPage;
				}
				
				//console.log("nextBlock = " + thisPage);
				
				html += "<span><a href=\"javascript:;\"><img src=\"public/images/main/btn_prev.gif\" alt=\"이전\" class='naviPage' pageNo='"+preBlock+"' /></a></span>"; // 현재블럭의 전페이지
				html += "<span><a href=\"javascript:;\"><img src=\"public/images/main/btn_next.gif\" alt=\"다음\" class='naviPage' pageNo='"+nextBlock+"' /></a></span>"; // 현재 블럭의 다음페이지
				
				html += "<span class=\"info\">공휴일은 운영하지 않습니다.</span>";
				
				return html;
			},
			
			/* 예약정보 가져오기 */
			getReserver:function(date,page){
				$.ajax({
					type: "GET",
					url:"/booking/businessreserver.json",
					data:"resdate="+date,
					cache: false,
					async: true,
					dataType : "json",
					success:function(jsonData, textStatus, XMLHttpRequest){
						jsondata = jsonData;
						$.getRoomInfo("A",page);
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});
			},
			getRoomInfo:function(roomCode01,page){
				if(!page)
					page = _PAGE ;
				$.ajax({
					type: "GET",
					url:"/booking/businessallinfo.json",
					data:"page="+page+"&roomCode01="+roomCode01,
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						sel_time = $("#bookingresdate").val(); //선택한 날짜						
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
							break;
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
							room_title = ""; //룸제목
							room_code = jsonData.roomlist[key].roomCode02; //룸코드명
							
							var g = parseInt(key) + 1;
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
						
						//console.log(start_time + "-" + end_time + "-" + sel_time + "-" + room_cnt + "-" + room_title + "-" + roomcode + "-" + room_name + "-" + room_name_max + "-" + addroom + "-" + jsondata)
						//console.log(roomcode)
						
						/* 현황표 출력 */
						$("#mainbooking").html($.mainbooking(start_time,end_time,sel_time,room_cnt,room_title,roomcode,room_name,room_name_max,addroom,jsondata));

						/* 이전 다음 페이징 처리 */
						$("#pageNavi").html($.bookpaging(page, jsonData.roomcount));
						
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});	
			},
		
			mainbooking:function(start_time,end_time,sel_time,room_cnt,room_title,roomcode,room_name,room_name_max,addroom,jsondata){
				
				var half_time_cnt = (end_time - start_time) + 1; //출력할 셀수 = (종료시간 - 시작시간 ) + 1시간
				var currentday = new Date(today.getFullYear(),(today.getMonth()+1),today.getDate()); //오늘날짜
				var seldays = sel_time.split("-"); //선택된 날짜 나누기(0000-00-00 의 '-' 구분자로 년월일 나누기)
				var selday =  new Date(seldays[0],seldays[1],seldays[2]); //선택된 날짜 가져오기
				
				var maincontent; //메인  테이블 정보
				var subcontent; //서브 테이블 정보
				var footcontent; //풋터 테이블 정보
				var timestr; //메인 테이블 해더 시간 출력
				var setclass = ""; //메인 테이블 헤더 클래스 이름 지정
				var unchecknum = 0;
				
				subcontent ="<th class=\"divide\">Time</th>";
				
				for(var i=parseInt(start_time); i<=parseInt(end_time); i++){
					timestr = i.toString();
					
					if(timestr.length == 1){
						timestr = "0"+timestr;
					}
				
					//현재날짜와 선택된 날짜가 같은 경우
					if(currentday.valueOf() == selday.valueOf()){
						//현재시간과 같으면
						if(timestr == current_hour){
							setclass = "current";
						}
						else{
							setclass = "";
						}
					}
					else{
						setclass = "";
					}
					
					subcontent +="<th class="+setclass+">"+timestr+"</th>";
					
				}
				
				
				subcontent += "</thead>";
				subcontent += "</tr>";
				subcontent += "<tbody>";
				
				/* 룸이름 */
				var roomnames;
				if(room_name.length >= 1){
					roomnames = room_name.split(",");
				}
				
				/* 룸정보(~인실) */
				var roomnames_maxs;
				if(room_name_max.length >= 1){
					roomnames_maxs = room_name_max.split(",");
				}
				
				
				/* 룸코드 */
				var roomcodes;
				if(roomcode.length >= 1){
					roomcodes = roomcode.split(",");
				}
				
				/*
				 * 예약된 시간 가져오기 
				 */
				
				var resdata = "";
				for(var key in jsondata.reserver){
					if(jsondata.reserver[key].resDate == sel_time){
						resdata = resdata + "," + jsondata.reserver[key].resRoom; //예약 정보 합치기
					}
				}

				var resdatas = resdata.split(","); //예약정보 나누기

				var restimes = "";
				for(r=0; r<resdatas.length; r++){
					if(resdatas[r]){
						restimes = restimes + "," + resdatas[r]
					}
				}
				restimes = restimes.replace(/:/gi, "_key_"); //나누어진 예약정보의 키값을 id키와 매칭시키기 위해 변환
				
				for(var k = 1; k<=room_cnt; k++){
					subcontent += "<tr>";
					
					if(room_title == ""){
						subcontent += "<th class=\"tit\">"+roomnames[k]+" ["+roomnames_maxs[k]+"]</th>";
					}
						
					
					var timekey = start_time - 1; //시작시간을 정한다
					var sethref_class = ""; //링크 클래스
					var roomchk=true; // 룸체크
					var cellnum = 1;
					
						for(var kd=parseInt(start_time); kd<parseInt(half_time_cnt) + parseInt(start_time); kd++){
						
						timekey = parseInt(timekey)+1;
						
						var msg; //메시지
						var msg2; //알림 메시지
						var roomkey = roomcodes[k] + "_key_" + timekey;
						var set_hours = timekey;
						var set_hour = set_hours;
						var timekey2 = 0;
						
						/* 셀의 시간 */
						var subtime = new Date(selday.getFullYear(),(selday.getMonth()),selday.getDate(),set_hour);
						
						/* 현재 시간 */
						var current_time = new Date(today.getFullYear(),(today.getMonth()+1),today.getDate(),today.getHours());
						
						/* 현재 셀의 위치 찾기 */
						var current_cell = current_hour;
						
						if((parseInt(subtime.valueOf()) - parseInt(current_time.valueOf())) == 0){
							timekey2 = parseInt(today.getHours());
						}
						
						
						/* 셀의 시간이 현재시간 보다 이전이면 */
						if(subtime.valueOf() < current_time.valueOf()){
							sethref_class = "";
						}
						else{
							sethref_class = "";
						}
						
						if(timekey == current_cell) {
							sethref_class = "";
						}
						
						if(timekey2>0){
							unchecknum = ( parseInt(timekey2) - parseInt(start_time) + 1);
						}
						
						
						if(cellnum <= unchecknum){
							sethref_class = "";	
						}
						
						
						/* 해당 셀의 예약이 존재하는 경우 */
						if(restimes.indexOf(roomkey) != -1){
							sethref_class = "on";
							/* 셀의 시간이 현재시간 보다 이전이면 */
							if(subtime.valueOf() < current_time.valueOf()){
								sethref_class = "off";	
							}
						}
						
						var roomkey_arr  = roomkey.split("_key_");
						var roomkey_room = roomkey_arr[0]; //룸코드
						var roomkey_seltime = roomkey_arr[1]; //룸체크시간
						
						subcontent += "<td><span id=\"tag"+roomkey+"\" class=\""+sethref_class+"\" ></span></td>";
						cellnum++;
						
					}
						subcontent += "</tr>";
				}
				
				footcontent = "<div class=\"btn\" id=\"pageNavi\"></div>";
				
				var tableHtmlArr = ["<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">"];   
			    for (var row = 0; row < 1; row++) {   
			         tableHtmlArr.push(subcontent);   
			    }   
			    
			    tableHtmlArr.push("</table>");   
			    tableHtmlArr.push(footcontent);
			    maincontent = tableHtmlArr.join("");
				return maincontent;
			},
			
			/* 전체룸정보 호출 */
			getRoomShow:function(page){
				/*룸 정보 호출 */
				if($("#bookingresdate").val()){
					$.getReserver($("#bookingresdate").val(),page);
				}
				else{
					var current = leadingZeros(today.getFullYear(),4) + "-" + leadingZeros((today.getMonth()+1),2) + "-" + leadingZeros(today.getDate(),2);
					$("#currentday").text(leadingZeros((today.getMonth()+1),2) + "월 " + leadingZeros(today.getDate(),2) + "일");
					$("#bookingresdate").val(current);
					$.getReserver(current,page);
				}
			}
			
		});
		
		$.getRoomShow();
		
		// paging 클릭
		jQuery(".naviPage").live("click",function() {
			var page = $(this).attr('pageNo');	
			_PAGE = page ;
			$.getRoomShow(page);
		});
		
	});
});
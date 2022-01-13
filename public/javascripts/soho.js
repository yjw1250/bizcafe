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

/**
 * 예약 테이블 화면 (소호)
 * @author : 유정운
 * 예약관련 안내
 * 
 */
$(document).ready(function() {
	
	var today = new Date(); //오늘 날짜
	var sel_time = today.getFullYear();
	var room_title;
	var room_cnt; //룸갯수
	var admin = 0; //사용자 모드
	
	$(function() {
		
		$.extend({
			/* 룸정보 호출 */
			getRoomShow:function(){
				/*룸 정보 호출 */
				$.getReserver(sel_time);
			},
			
			/* 예약정보 가져오기 */
			getReserver:function(year){
				$.ajax({
					type: "GET",
					url:"/booking/sohoreserver.json",
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
		
			/* 룸정보 가져오기 */
			getRoomInfo:function(roomCode01){
				$.ajax({
					type: "GET",
					url:"/booking/roominfo.json",
					data:"roomCode01="+roomCode01,
					cache: false,
					async: true,
					dataType : "json",
					beforesend: function(){
						$("#soho").html("<img src='/public/images/loading.gif' />");
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
						
						
						$("#room_title").val(jsonData.roomlist[0].roomName02);
						$("#room_cnt").val(jsonData.roomlist.length);

						room_title = $("#room_title").val(); //룸제목
						room_cnt = $("#room_cnt").val(); //룸갯수
						
						$("#sel_time").val(sel_time);
						$("#showyear").text(sel_time);
						$("#soho").html($.soho_display(sel_time,room_title,room_cnt,roomcode,room_name,room_name_max,admin,jsondata));
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});	
			},
			
			/* 예약등록 */
			createReserver:function(){
				var result;
				var completeid;
				$.ajax({
					type: "POST",
					url:"/booking/roomsave" + ".json",
					data: {
						"reservation.resPerson" : $("#room_user").val(),
						"reservation.resMonthNum" : $("#resMonthNum").val(),
						"reservation.resStartHour" : $("#resdate").val(),
						"reservation.resEndHour" : $("#resEndHour").val(),
						"reservation.resDate" : $("#resdate").val(),
						"reservation.resRoom" : $("#resRoom").val(),
						"reservation.resPhone" : $("#resPhone").val(),
						"reservation.resType" : "OF"			
					},
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						result = jsonData.result;
						switch(jsonData.result) {	
							case "101" : 
									alert("이미 예약이 되어 있습니다.");
									$.getRoomShow();
									break;
							case "401" : 
									break;
							case "200" : 
									completeid = jsonData.resIdx;
									alert("예약이 접수되었습니다.");
									break;
						}
					},
					complete: function(XMLHttpRequest) {
						if(result == "200"){
							window.location.href ="/booking/soho/complete/"+completeid;
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}
				});
				
			},
			
			submitReserver:function(){
				/* 메시지 기존의 alert 창으로 */
				$.validator.setDefaults({
			         onkeyup:false,
			         onclick:false,
			         onfocusout:false,
			         showErrors:function(errorMap, errorList){
			            if(this.numberOfInvalids()) { // 에러가 있을 때만..
			                alert(errorList[0].message);
			            }
			        }
			    });
				
				var startDay = "2012-04-16";				
				if($("#resdate").val() < startDay){
					alert("예약일은 " + startDay + "이후로 선택해 주세요.");
					return;
				}
				
				$("#frmRegist").validate({
					rules: {  	
						resdate 		: {required : true},
						resRoom 		: {required : true},
						resMonthNum		: {required : true},
						phonenumber1	: {required : true},
						phonenumber2    : {required : true},
						phonenumber3    : {required : true}
					},
					messages: {
						resdate 		: {required : "예약일을 입력해 주세요"},
						resRoom 		: {required : "이용부스를 선택해 주세요"},
						resMonthNum		: {required : "예약기간을 선택해 주세요"},
						phonenumber1	: {required : "연락처를 선택해주세요"},
						phonenumber2    : {required : "전화번호 앞자리를 입력해주세요"},
						phonenumber3    : {required : "전화번호 뒷자리를 입력해주세요"}
					},
					submitHandler: function() {	
						
						$.numeric("phonenumber2","전화번호 앞자리");
						$.numeric("phonenumber3","전화번호 뒷자리");
						
						if($("#phonenumber1").val()!="" || $("#phonenumber2").val()!="" || $("#phonenumber3").val()!=""){
							$("#resPhone").val($("#phonenumber1").val() + "-" + $("#phonenumber2").val() + "-" + $("#phonenumber3").val());
							if(!($.telCheck("resPhone","전화번호"))){return;};		
						}
						
						if(parseInt($("#resMonthNum").val(),10) >= 1){
							var resdate_array = $("#resdate").val().split('-');
							var resdates = resdate_array[1] + "/" + resdate_array[2]  + "/" + resdate_array[0];
							
							var enddate = new Date(resdates); //종료일 날짜 가져오기
							enddate.setMonth(enddate.getMonth() + parseInt($("#resMonthNum").val(),10)); 
							
							$("#resEndHour").val(enddate.getFullYear() + "-" + leadingZeros(parseInt(enddate.getMonth())+1,2) + "-" + leadingZeros(enddate.getDate(),2));
						}
						
						if($("#resRoom").val() != ''){
							//$("#room_user").val($("#resRoom").val().trim().substr(3,1));
							$("#room_user").val($("#resRoom").val().substr(3,1));
						}
						
						$.createReserver();
					},
					errorPlacement: function(error, element) { 
				    	error.insertAfter(element);
					}								
				});		
				$("#frmRegist").submit();	
			
			},
			
			hoilday:function(){
				$.ajax({
					type:"GET",
					url:"/booking/hoilday" + ".json",
					data:"resDate="+$("#resdate").val(),
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						switch(jsonData.result) {	
						case "400" : 
							alert('선택하신 날짜는 ' + jsonData.holidayname +  '이므로 예약하실수 없습니다\r\n다시 선택해주세요');
							$("#resdate").val("");
							$("#resdate").focus();
							break;
						case "200" : 
							break;	
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}

				});
			}
					
		});
		
		
		/* 예약을 GET 방식으로 받아 들일 경우 */
		var persons = $("#person").val();
		var resdates =  $("#resdate").val();
		
		if(persons != "" && resdates != ""){
			
			if(persons == "1"){
				$("#resRoom > option[value=BR0101]").attr("selected", "true");
				_roomCode = "BR0101";
			}
			else if(persons == "2"){
				$("#resRoom > option[value=BR0201]").attr("selected", "true");
				_roomCode = "BR0201";
			}
			else{
				alert('정해진 인원수를 초과하였습니다.');
				history.go(-1);
			}
			
			$.getRoomShow();
			$.sohoList();
		}
		
		var phonenumber_array = $("#phonenumber").val().split('-');
		$("#phonenumber1").val(phonenumber_array[0]); 
		$("#phonenumber2").val(phonenumber_array[1]);
		$("#phonenumber3").val(phonenumber_array[2]); 
		
		//달력 클릭
		$("#btnCalendar").bind("click", function(){
			Calendar_Create("resdate");
		});
		$("#resdate").bind("click", function(){
			Calendar_Create("resdate");
		});
		
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
		
		/* 등록(인증창 출력포함) */
		$("#btnSubmit").bind("click", function() {
			$.submitReserver()
		});
		
		$.getRoomShow();
		
	});
	
});

//달력 날짜 선택후 추가로  체크가 필요한 항목이 있다면...
CALENDAR_EVENT = 2; 
function calendar_app_fun(){
	var element = "resdate";
	
		
	//이전일인가?
	var toDay = $.toDay();
	var startDay = "2012-04-16";
	
	if($("#"+element).val()< toDay){
		alert("예약일은 오늘이후로 선택해 주세요.");
		$("#"+element).val("");
		$("#"+element).focus();		
		return;
	}
	
	if($("#"+element).val() < startDay){
		alert("예약일은 " + startDay + " 이후로 선택해 주세요.");
		$("#"+element).val("");
		$("#"+element).focus();		
		return;
	}
	
	$.hoilday();
}
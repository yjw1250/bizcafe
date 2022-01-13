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
	var admin = 1; //사용자 모드
	var phonenumber; //회원폰번호
	var userID;
	
	$(function() {
		
		$.extend({
			
			
			//회원 자동 등록
			createMember:function(){
				userID = $("#userID").val();
				
				if(userID == ""){
					alert('아이디를 입력해주세요');
					return;
				}
				
				
				if ($.memberIdCheck("userID","아이디") == false) {
					$("#userID").focus();
					return;
				}
				
				$.ajax({
					type:"POST",
					url:"/user",
					data:{
						"user.userID" : userID,
						"user.userPasswd" : userID,
						"user.phone" : $("#Phone").val(),
						"user.userName" : $("#userName").val(),
						"user.email" : $("#email").val(),
						"user.regAdminID" : "admin" 
					},
					cache: false,
					async: true,
					dataType : "text",					
					success: function(Data, textStatus, XMLHttpRequest) {
						switch(Data) {	
								case "200" : 
								//alert("회원 등록이 완료되었습니다.")
								break;
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}
					
				});
				
			},
			
			//아이디 중복 체크 
			checkID:function(){
				userID = $("#userID").val();
				
				if(userID == ""){
					alert('아이디를 입력해주세요');
					return;
				}
				
				if ($.memberIdCheck("userID","아이디") == false) {
					$("#userID").focus();
					return;
				}
				
				$.ajax({
					type:"GET",
					url:"/user/new/newid.json",
					data:"userID="+userID,
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						switch(jsonData.result) {	
								case "200" : 
								$("#idcheck").val("ok");
								alert("사용하셔도 좋습니다.")
								break;
								case "400" : 
								$("#userID").val("");
								$("#userID").focus();
								$("#idcheck").val("");
								alert("이미 사용중인 아이디입니다.")
								break;
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}
					
				});
			},
			
			//SMS 인증 번호 발송
			sendSms:function(){
				
				phonenumber = $("#Phone").val();
				
				if(phonenumber == ""){
					alert('휴대폰 번호를 입력해주세요');
					return;
				}
				
				$.ajax({
					type:"POST",
					url:"/sms/sendsms.json",
					data:{
						"sendsms.sendFlag" : 2,
						"sendsms.recPhone" : phonenumber,
						"sendsms.sendMsg" : "인증확인"
					},
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						switch(jsonData.result) {	
							case "200" : 
								$("#snscertifyNo").val(jsonData.certifyNo);
								$("#phonecertiy").text(jsonData.certifyNo);
								alert("인증 메시지가 정상적으로 발송되었습니다.")
								break;
							case "400" : 
								$("#snscertifyNo").val('');
								$("#phonecertiy").text('');
								alert(jsonData.msg);
								break;	
						}
						
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}
					
				});
			},
		
			/* 룸정보 호출 */
			getRoomShow:function(){
				/*룸 정보 호출 */
				if($("#resdate").val()==""){
					alert('날짜를 입력해주세요');
					$("#resdate").focus();
					return;
				}
		
				$.getReserver(sel_time);
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
						$("#resever_table").css("display","block");
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
					url:"/admin/booking/businessroominfo.json",
					data:"roomCode01="+roomCode01,
					cache: false,
					async: true,
					dataType : "json",					
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
						
						//$("#resever_table").css("display","block");
						
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
				
				/* 비회원 예약접수후 회원 자동 등록 처리 */
				if($("#userType").val() == "N"){
					$.createMember();
				}
				
				var result;
				$.ajax({
					type: "POST",
					url:"/admin/booking/businessroomsave.json",
					data: {
						"action" : "add",
						"reservation.resUserID" : $("#userID").val(),
						"reservation.resUserName" : $("#userName").val(),
						"reservation.resPhone" : $("#Phone").val(),
						"reservation.memo" : "관리자 회원 대행 등록",
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
									alert("예약이 접수되었습니다")
									location.replace("/admin/booking/soho/complete/"+jsonData.resIdx);
									break;
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
				
				if($("#userType").val() == "Y"){
					if($("#userID").val() == ""){
						alert('회원정보를 검색하여 등록하셔야 합니다.');
						return;
					}
				}
				else if($("#userType").val() == "N"){
					
					if($("#idcheck").val() == ""){
						alert('아이디 중복 체크를 하셔야합니다.');
						return;
					}
					
					if($("#userName").val() == ""){
						alert('회원이름을 입력하세요.');
						return;
					}
					
					if($("#Phone").val() == ""){
						alert('휴대폰 번호를 입력하세요.');
						return;
					}
					
					if($("#email").val() == ""){
						alert('이메일 주소를 입력하세요.');
						return;
					}
					
					if($("#snscertifyNo").val() == ""){
						alert('회원정보를 입력하고 인증번호를 발급받아야 합니다.');
						return;
					}
				}
				
				$("#frmRegist").validate({
					rules: {  	
						resdate 		: {required : true},
						resRoom 		: {required : true},
						resMonthNum		: {required : true},
						resPhone		: {required : true},	
						userID			: {required : true}
					},
					messages: {
						resdate 		: {required : "예약일을 입력해 주세요"},
						resRoom 		: {required : "이용부스를 선택해 주세요"},
						resMonthNum		: {required : "예약기간을 선택해 주세요"},
						resPhone		: {required : "전화번호를 등록해 주세요"},
						userID			: {required : "회원정보를 등록해 주세요"}
					},
					submitHandler: function() {	
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
						else{
							alert('이용부스를 선택해 주세요');
							return;
						}
						
						if($("#Phone").val() != ''){
							$("#resPhone").val($("#Phone").val())
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
					url:"/booking/hoilday.json",
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
		
		/* 회원검색 */
		$("#btnMember").bind("click",function(){
			window.open("/admin/userAdmin/findmember","members","width=450,height=350");
		});
		
		/* 아이디 중복 체크 */
		$("#btncheckID").bind("click",function(){
			$.checkID();
			//alert('중복체크');
		});
		
		
		/* 휴대폰 인증 번호 발송 */
		$("#btncertifyNo").bind("click", function() {
			$.sendSms();
		});
		
		
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
		
		/* 검색 */
		$("#search_resever").bind("click", function(){
			$.getRoomShow();
		});
		
	});
	
});

//달력 날짜 선택후 추가로  체크가 필요한 항목이 있다면...
CALENDAR_EVENT = 2; 
function calendar_app_fun(){
	var element = "resdate";
		
	//이전일인가?
	var toDay = $.toDay();
	if($("#"+element).val()< toDay){
		alert("예약일은 오늘이후로 선택해 주세요.");
		$("#"+element).val("");
		$("#"+element).focus();		
		return;
	}
	
	$.hoilday();
}
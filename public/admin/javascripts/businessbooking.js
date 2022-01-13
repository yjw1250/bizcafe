/**
 * 예약 테이블 화면 
 * @author : 유정운
 * 예약관련 안내
 * 
 * 1) 관리자는 예약불가(이미 예약된것)를 제외한 나머지 시간은 현재 시간 이전 이라도 선택, 수정 가능 
 * => 이유는 관리상의 문제(운영상의 실수에 의해 발생하는 문제를 방지하기 위해)
 * 2) 사용자는 현재시간에 (+1 시간) 이후만 가능하며 그외에 이전시간이나 현재시간은 예약이 불가하며
 *    매 시간당 10분 미만(예: 1시 10분, 1시 40분, 2시 10분, 2시 40분, 3시 10분, 3시 40분....)인 경우 
 *    다음 시간 선택가능(예 현재시간이 3시 40분인 경우 4시 30분 예약이 가능하지만 3시 41분 인 경우 5시 부터 예약가능)
 */
var timedata= [];
$(document).ready(function() {
	
	//디폴트
	var phonenumber; //회원폰번호
	var start_time = 8; //시작시간
	var end_time = 21; //종료시간
	var room_cnt; //룸갯수
	var room_title;
	var room_code; //룸코드명
	var sel_time; //선택된 날짜
	var jsondata = ""; //예약 데이터
	var admin = 0; //사용자 모드
	var cashunit;  //단가정보 * 2
	var cashuser; //사용인원 
	var first_arr;
	var end_arr;
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
					url:"/sms/sendsms" + ".json",
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
		
			/* 예약등록 */
			createReserver:function(){
				
				/* 비회원 예약접수후 회원 자동 등록 처리 */
				if($("#userType").val() == "N"){
					$.createMember();
				}
				
				
				$.ajax({
					type: "POST",
					url:"/admin/booking/businessroomsave.json",
					data: {
						"action" : "add",
						"reservation.resUserID" : $("#userID").val(),
						"reservation.resUserName" : $("#userName").val(),
						"reservation.resPhone" : $("#Phone").val(),
						"reservation.memo" : "관리자 회원 대행 등록",
 						"reservation.payment" : $("#payment").val(),
						"reservation.resPerson" : $("#room_user").val(),
						"reservation.resStartHour" : $("#sel_time").val() + " " + $("#starttime").val() + ":00",
						"reservation.resEndHour" : $("#sel_time").val() + " " + $("#endtime").val() + ":00",
						"reservation.resDate" : $("#sel_time").val(),
						"reservation.resRoom" : $("#resRoom").val(),
						"reservation.resType" : "BZ"			
					},
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						switch(jsonData.result) {	
							case "101" : 
									alert("이미 예약이 되어 있습니다.")
									$.getRoomShow();
									break;
							case "401" : 
									break;
							case "200" : 
									alert("예약이 접수되었습니다")
									location.replace("/admin/booking/complete/"+jsonData.resIdx);
									break;
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}
				});
			},
			
			/* 예약정보 가져오기 */
			getReserver:function(date){
				$.ajax({
					type: "GET",
					url:"/admin/booking/reserver" + ".json",
					data:"resdate="+date,
					cache: false,
					async: true,
					dataType : "json",
					complete:function(XMLHttpRequest){
						
					},
					success:function(jsonData, textStatus, XMLHttpRequest){
						jsondata =jsonData;
						$.getRoomInfo("A",$("#room_user").val());	
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});
			},
			
			/* 룸정보 가져오기 */
			getRoomInfo:function(roomCode01,Person){
				$.ajax({
					type: "GET",
					url:"/admin/booking/roominfo" + ".json",
					data:"roomCode01="+roomCode01+"&Person="+Person,
					cache: false,
					async: true,
					dataType : "json",					
					complete: function(XMLHttpRequest) {
						
					},					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						
						timedata = []; //시간데이타 초기화
						$("#sel_time").val($("#resdate").val());
						
						/* 시간 초기화 */
						$("#cashhour").text("");
						
						/* 총결제금액 초기화 */
						$("#totalcash").text("");
						
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
						$("#room_code").val(jsonData.roomlist[0].roomCode02);
						$("#room_cnt").val(jsonData.roomlist.length);
						$("#account_unit").val(jsonData.roomlist[0].unitCostEtc);
						
						cashunit = $("#account_unit").val() * 2; //단가*2
						cashuser = $("#room_user").val(); //예약자수
						room_cnt = $("#room_cnt").val(); //룸갯수
						room_title = $("#room_title").val(); //룸제목
						room_code = $("#room_code").val(); //룸코드명
						
						$("#showdate").text($("#sel_time").val());
						$("#resever_table").css("display","block");
					
						sel_time = $("#sel_time").val(); //선택한 날짜
						admin = $("#adminchk").val(); //false : 사용자, true : 관리자
						
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
						
						
						/* 보여줄 날짜 출력 */
						$("#showdate").text($("#sel_time").val());
						$("#booking").html($.booking_display(start_time,end_time,sel_time,room_cnt,room_title,roomcode,room_name,room_name_max,addroom,admin,jsondata));
						
						/* 단가 정보를 가져와 시간당 요금을 계산 */
						$("#cashunit").text(numberFormat(cashunit.toString()));
						
						/* 인원 할당 */
						$("#cashuser").text(numberFormat(cashuser.toString()));
						
					
						
					},
					error:function(xhr, ajaxOptions, thrownError){
						alert(_THROWNERROR);
					}
				});	
			},
			
			/* 
			 * 예약 버튼 클릭 체크
			 * @param sel_time : 예약날짜
			 * @param id : 예약 아이디 키값
			 * @param roomkey : 룸코드
			 * @param roomtime : 룸 선택 시간
			 * @param roomorder : 룸 순서
			 * @param roomchk : 예약가능 여부(1: 예약가능,0:예약불가)
			 * @param msg : 예약 메시지
			 */
			click_resdate : function(sel_time,id,roomkey,roomtime,roomorder,roomchk,msg){
				
				if(roomchk != 1) {
					alert(msg);
					return;
				}
				
				var idtime_room = roomkey;
				var idtime_seltime = roomtime;
				var idroomkey = idtime_room + "+" + idtime_seltime;
				var idhour_arr  = roomtime.split("-");
				var start_hour = idhour_arr[0];
				var end_hour = idhour_arr[0];
				var start_time;
				var end_time;
				var room_order_number = roomorder;
				
				if(idhour_arr[1] == "1"){
					start_time = "00";
					end_time = "30";
				}
				else if(idhour_arr[1] == "2"){
					start_time = "30";
					end_time = "00";
					end_hour = parseInt(end_hour,10) + 1;
				}
				
				
				var seldays2 = sel_time.split("-"); //선택된 날짜 나누기(0000-00-00 의 '-' 구분자로 년월일 나누기)
				var selday2 =  new Date(seldays2[0],seldays2[1]-1,seldays2[2]); //선택된 날짜 가져오기
								
				var res_starttime = new Date(selday2.getFullYear(),selday2.getMonth(), selday2.getDate(),start_hour,start_time);
				var res_endtime = new Date(selday2.getFullYear(),selday2.getMonth(), selday2.getDate(),end_hour,end_time);
								
				/* 예약이 열려 있는 경우 */
				
				var _room2 = idroomkey.split("+");						
				var _order2 = room_order_number;
				var lastdata = timedata[timedata.length-1];
				
				if(roomchk == 1){
					/* 예약이 이미 체크 되어 있는 경우 */
					if($("#tag"+id).attr("class") == "selectOn"){
						
						if(timedata.length >= 1){
							
							var getRoomidx = $.getRoomKey(timedata,_order2,0);
							var prevRoomidx = $.getRoomKey(timedata,_order2,+1); //이전키
							var nextRoomidx = $.getRoomKey(timedata,_order2,-1); //다음키
							//console.log(prevRoomidx + "-" + getRoomidx  + "-" + nextRoomidx);
							
							if(parseInt(prevRoomidx,10) >=0 && parseInt(nextRoomidx,10) >=0 ){
								if((parseInt(getRoomidx,10) - parseInt(prevRoomidx,10)) == 1 && (parseInt(nextRoomidx,10) - parseInt(getRoomidx,10)) == 1){
									alert('중간에 빈 시간을 두실수 없습니다');
									return;
								}
							}	
						}
	
						$("#tag"+id).attr("class","select"); /* 예약 선택 해제 */
						$.deleteItemByIdRoomKey(idroomkey);
					}
					else{
						$("#tag"+id).attr("class","selectOn"); /* 예약 선택 */
						for(i=0; i<timedata.length; i++){
							
							var _room1 = timedata[i].idroomkey.split("+");
							
							if(timedata[i].starttime == res_starttime.valueOf()){
									alert('같은 시간대를 예약하실수 없습니다');
									$("#tag"+id).attr("class","select");
									return
							}	
							
							
							if(_room1[0] != null){
								if(cashuser >= 2 && timedata.length < 4){
									if(_room1[0] != _room2[0]){
										alert('2인실 이상인 경우 같은 부스를 2시간 이상 선택하셔야 합니다');
										$("#tag"+id).attr("class","select");
										return
									}
								}
								
								if(cashuser == 1 && timedata.length < 2){
									if(_room1[0] != _room2[0]){
										alert('1인실 이상인 경우 같은 부스를 1시간 이상 선택하셔야 합니다');
										$("#tag"+id).attr("class","select");
										return
									}
								}
						
								
							}
							
							if((room_order_number - parseInt(end_arr.room_order_number,10)) > 1 ||  ( parseInt(first_arr.room_order_number,10) - room_order_number) > 1){
								alert('중간에 빈 시간을 두실수 없습니다');
								$("#tag"+id).attr("class","select");
								return;
							}
							
							
							continue;
						}
						timedata.push({ "idroomkey":idroomkey, "room_order_number":room_order_number, "starttime":res_starttime.valueOf(), "endtime":res_endtime.valueOf()});
					}
				}
				
				/* 
				 * 정렬 (종료시간으로 정렬) 
				 * 특정 value key 명으로 정렬이 가능함
				 */ 
				timedata.sort(function(a,b){
					return a.endtime - b.endtime; 
				});
				
				first_arr = timedata[0]; /* 첫번째 키 */
				end_arr = timedata[timedata.length-1]; /* 마지막키 */
				
//				console.log("<-------->");
//				for(i=0; i<timedata.length; i++){
//						console.log("key : "+timedata[i].idroomkey + ", room order : "+ timedata[i].room_order_number + ", start time : " + timedata[i].starttime + ", end time : " + timedata[i].endtime);
//				}	
//				console.log("<-------->")
				
				$.changePayment(timedata);
				
			},
			
			/* 결재 금액 계산 */ 
			changePayment:function(timedata){
				
				if(timedata.length == 0 || timedata == null){ 
					$("#starttime").val("")
					$("#endtime").val("");
					$("#cashhour").text("");
					$("#totalcash").text("");
					return;
				}	
				
				var first_time = returntime(first_arr.starttime); //시작시간
				var end_time = returntime(end_arr.endtime); //종료시간
				
				var cashrange = (end_time.getTime() - first_time.getTime()) / 60000; //분단위로 변경
				var cashhour = cashrange / 60;
				var totalcash = ((cashrange / 30) * cashunit / 2 ) * parseInt($("#room_user").val(),10);
				$("#cashhour").text(cashhour);
				$("#totalcash").text(numberFormat(totalcash.toString()));
				
				if(totalcash){
					$("#payment").val(totalcash);
				}
				
				$("#starttime").val(leadingZeros(first_time.getHours(),2) + ":"+ leadingZeros(first_time.getMinutes(),2));
				$("#endtime").val(leadingZeros(end_time.getHours(),2) + ":"+ leadingZeros(end_time.getMinutes(),2));
			},
			
			/* 룸정보 호출 */
			getRoomShow:function(){
				if($("#resdate").val()==""){
					alert('날짜를 입력해주세요');
					$("#resdate").focus();
					return;
				}
				
				/*룸 인원수 할당*/
				$("#room_user").val($("#resPerson option:selected").val());
				
				/*룸 정보 호출 */
				$.getReserver($("#resdate").val());
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
				
				var resRoom = "";
				for(i=0; i<timedata.length; i++){
					if(timedata[i].idroomkey != null){
						resRoom = resRoom + "," + timedata[i].idroomkey
					}
				}
				
				resRoom = resRoom.replace(/\+/gi, ":");
				$("#resRoom").val(resRoom);
				
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
				
				if(cashuser <= 1){
					if(timedata.length < 2){
						alert('1인실은 반드시 1시간을 기본으로 선택하셔야 합니다.');
						return;
					}
				}else if(cashuser >= 2){
					if(timedata.length < 4){
						alert('2인실 이상은 반드시 2시간을 이상 기본으로 선택하셔야 합니다.');
						return;
					}
				}
				
				
				$("#frmRegist").validate({
					rules: {  	
						starttime 		: {required : true},
						endtime 		: {required : true},
						resRoom			: {required : true},
						payment			: {required : true}
					},
					messages: {
						starttime 		: {required : "시작 시간을 입력하세요."},
						endtime 		: {required : "종료 시간을 입력하세요."},
						resRoom			: {required : "예약할 룸을 선택하세요."},
						payment			: {required : "총 결제금액이 없습니다."}
					},
					submitHandler: function() {	
							if(confirm("저장 하시겠습니까?")) {
								$.createReserver();
							}
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
							alert('선택하신 날짜는 ' + jsonData.holidayname +  '이므로 예약하실수 없습니다\r\n다시 선택해주세요')
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
		
		})
		
		/* 예약을 GET 방식으로 받아 들일 경우 */
		var persons = $("#person").val();
		var resdates =  $("#resdate").val();
		
		if(persons != "" && resdates != ""){
			$("#resPerson > option[value = " + persons + "]").attr("selected", "true");
			$.getRoomShow();
		}
		
		
		//달력 클릭
		$("#btnCalendar").bind("click", function(){
			Calendar_Create("resdate");
		});
		$("#resdate").bind("click", function(){
			Calendar_Create("resdate");
		});
		
		//이전 날짜 검색
		$("#prevday").bind("click",function(){
			var seldate = $("#sel_time").val();
			var DateString = $.getDate(seldate,-1);
			$("#resdate").val(DateString);
			$.getRoomShow();
		});
		
		//이후 날짜 검색
		$("#nextday").bind("click",function(){
			var seldate = $("#sel_time").val();
			var DateString = $.getDate(seldate,1);
			$("#resdate").val(DateString);
			$.getRoomShow();
		});
		
		/* 검색 */
		$("#search_resever").bind("click", function(){
			$.getRoomShow();
		});
		
		/* 등록(인증창 출력포함) */
		$("#btnSubmit").bind("click", function() {
			$.submitReserver()
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
	})
	
	
})

//달력 날짜 선택후 추가로  체크가 필요한 항목이 있다면...
CALENDAR_EVENT = 2; 
function calendar_app_fun(){
	$.hoilday();
}		
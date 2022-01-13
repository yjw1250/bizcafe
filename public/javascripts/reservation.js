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

/*
 * 타임스탬프 값을 날짜 형식으로 바꿔준다
 * 
 */
function returntime(timestamp) { 
	var time = new Date(timestamp);
	return time;
} 

//콤마찍기
function numberFormat(num) {
	var pattern = /(-?[0-9]+)([0-9]{3})/;
	while(pattern.test(num)) {
		num = num.replace(pattern,"$1,$2");
	}
	return num;
}

$(document).ready(function() {
	
	var today = new Date(); //오늘 날짜
	var current_hour = today.getHours(); //현재시간
	var current_min	= today.getMinutes(); //현재분
	
	$(function() {
		
		$.extend({
			
			/* 룸 상세 페이지 연결 */
			linkroom:function(roomkey_room){
				//프리미엄 룸 이동
				if(roomkey_room.substr(0,4) == "AP01"){
					location.href="/guide/business/space?type=0";
				}
				//미팅룸 이동
				else if(roomkey_room.substr(0,4) == "AM01"){
					location.href="/guide/business/space?type=1";
				}
				//세미나룸 4인실 이동
				else if(roomkey_room.substr(0,4) == "AS01"){
					location.href="/guide/business/space?type=2";
				}
				//세미나룸 4~5인실 이동(S-3)
				else if(roomkey_room.substr(0,6) == "AS0201"){
					location.href="/guide/business/space?type=3";
				}
				//세미나룸 4~5인실 이동(S-4)
				else if(roomkey_room.substr(0,6) == "AS0202"){
					location.href="/guide/business/space?type=4";
				}
				//컨퍼런스룸 6~7인실 이동(C-1,C-2)
				else if(roomkey_room.substr(0,6) == "AC0101" || roomkey_room.substr(0,6) == "AC0102"){
					location.href="/guide/business/space?type=5";
				}
				//컨퍼런스룸  6~7인실 이동(C-3)
				else if(roomkey_room.substr(0,6) == "AC0103"){
					location.href="/guide/business/space?type=6";
				}
				//컨퍼런스룸 8인실 이동(C-4,C-5)
				else if(roomkey_room.substr(0,4) == "AC02"){
					location.href="/guide/business/space?type=7";
				}
				
			},
			
			/* 룸키 찾기 */
			getRoomKey:function(obj,value,findkey){
				var returnKey = -1;
				
				$.each(obj, function(key, info) { 
			        if (info.room_order_number == value) { 
			         	returnKey = key - findkey; 
			           return false;  
			        };    
			    }); 
				
				if(obj[returnKey] == undefined){
					returnKey = -1;					
				}	
				
				return returnKey;
			},
			
			/* 날짜 가져오기(이전,이후 날짜) */
			getDate:function(date,val){
				var getdate = date.split("-"); //선택된 날짜 나누기(0000-00-00 의 '-' 구분자로 년월일 나누기)
				var syear = getdate[0];
				var smonth = parseInt(getdate[1]-1,10);
				var sdate = parseInt(getdate[2],10);
				var setdate = new Date(syear,smonth,sdate+parseInt(val,10)); //선택된 날짜 가져오기
				var DateString = leadingZeros(setdate.getFullYear(),4) + "-" + leadingZeros((setdate.getMonth()+1),2) + "-" + leadingZeros(setdate.getDate(),2);
				return DateString;
			},
			
			/* 삭제(선택된 셀바를 다시 체크할 경우 삭제처리) */
			deleteItemByIdRoomKey:function(idroomkey){
				if((timedata == null || timedata.length == 0) && idroomkey )
					return;
				
				var newTimeData = [];
				for (var i=0; i<timedata.length; i++) {
					if (timedata[i].idroomkey == idroomkey)
						continue;
					
					newTimeData.push(timedata[i]);
				}
				timedata = newTimeData;
				
			},
			
			/*
			 * 예약 테이블 출력(비즈니스 미팅룸)
			 * @param start_time : 시작시간
			 * @param end_time : 종료시간
			 * @param sel_time : 선택된 날짜
			 * @param room_cnt : 룸갯수
			 * @param room_title : 룸타이틀
			 * @param admin : 관리자 체크(true : 관리자 모드용 예약 테이블, false : 사용자 모드 예약 테이블)
			 * @param jsondata : 예약데이타
			 */
			booking_display : function(start_time,end_time,sel_time,room_cnt,room_title,roomcode,room_name,room_name_max,addroom,admin,jsondata){
				var half_time_cnt = ((end_time - start_time) +1) *2; //출력할 셀수 = (종료시간 - 시작시간 ) + 1시간 * 2배수
				var colspans = half_time_cnt + 2; //출력할 셀수
				var currentday = new Date(today.getFullYear(),(today.getMonth()+1),today.getDate()); //오늘날짜
				var seldays = sel_time.split("-"); //선택된 날짜 나누기(0000-00-00 의 '-' 구분자로 년월일 나누기)
				var selday =  new Date(seldays[0],(seldays[1]-1),seldays[2]); //선택된 날짜 가져오기
				
				var maincontent; //메인  테이블 정보
				var subcontent; //서브 테이블 정보
				var footcontent; //풋터 테이블 정보
				var timestr; //메인 테이블 해더 시간 출력
				var setclass = ""; //메인 테이블 헤더 클래스 이름 지정
				var unchecknum = 0;
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
			
				
				subcontent  = "<colgroup>";
				subcontent += "<col width=\"66px\"><col width=\"62px\">";
				subcontent += "<col width=\"\" colspan=\""+colspans+"\">";
				subcontent += "<col width=\"*\"></colgroup>";
				subcontent += "<thead><tr>";
				subcontent += "<th colspan=\"2\" class=\"booth\"  scope=\"col\">&nbsp;</th>";
				
								
				for(var i=parseInt(start_time,10); i<=parseInt(end_time,10); i++){
					timestr = i.toString();
					
					if(timestr.length == 1){
						timestr = "0"+timestr;
					}
					
					var idkey = "res-" + timestr;
					
					//현재날짜와 선택된 날짜가 같은 경우
					if(currentday.valueOf() == selday.valueOf()){
						//현재시간과 같으면
						if(timestr == current_hour){
							setclass = "ontime";
						}
						else{
							setclass = "";
						}
					}
					else{
						setclass = "";
					}
					
					subcontent +="<th id=\""+idkey+"\" colspan=\"2\" scope=\"col\" class="+setclass+">"+timestr+"</th>";
					
				}
				
				/* 현황 보기 페이지에서 상세 보기 차단 */
				if(admin != "2"){
					subcontent += "<th scope=\"col\">상세정보</th>";
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
					//console.log(roomcode);
				}
				
				for(var k = 1; k<=room_cnt; k++){
					subcontent += "<tr>";
					
					if(room_title == ""){
						if(admin == "2"){
						}
						subcontent += "<th class=\"th3\" colspan=\"2\">"+roomnames[k]+"<br>["+roomnames_maxs[k]+"]</th>";
					}
					else{
						if(k==1){
							subcontent += "<th class=\"th2\" rowspan=\""+room_cnt+"\" scope=\"row\">"+room_title+"</th>";
						}
						subcontent += "<th class=\"th3\">"+roomnames[k]+"<br>["+roomnames_maxs[k]+"]</th>";
					}	
					
					var timekey = start_time - 1; //시작시간을 정한다
					var settd_class = "range"; //td클래스
					var sethref_class = "select"; //링크 클래스
					var setblind_txt = "공실";
					var roomchk=true; // 룸체크
					var cellnum = 1;
					
					for(var kd=parseInt(start_time); kd<parseInt(half_time_cnt) + parseInt(start_time); kd++){
						
						/* 0~30분 */
						if(kd/2%1 == 0){
							timekey = (parseInt(timekey)+1) +  "-1"; //홀수
						}
						/* 31~60분 */
						else if(kd/2%1 == 0.5){
							timekey = parseInt(timekey) +  "-2"; //짝수
						}
						
						var msg; //메시지
						var msg2; //알림 메시지
						//var roomkey = roomnames[k] + "_key_" + timekey;
						var roomkey = roomcodes[k] + "_key_" + timekey;
						var set_hours = timekey.split('-');
						var set_hour = set_hours[0];
						
						/* 셀의 시간 */
						var subtime = new Date(selday.getFullYear(),(selday.getMonth()+1),selday.getDate(),set_hour);
						
						/* 현재 시간 */
						var current_time = new Date(today.getFullYear(),(today.getMonth()+1),today.getDate(),today.getHours());
						
						/* 현재 시간(분) */
						var now_time = new Date(today.getFullYear(),(today.getMonth()+1), today.getDate(), today.getHours(),today.getMinutes());
						//var now_time = new Date(today.getFullYear(),(today.getMonth()+1), today.getDate(), today.getHours(),41);
						
						/* 현재시간과 선택된 시간이 같은 경우 */
						var now_chk_val = -1;
						var now_chk_sel = 0;
						var timekey2 = "";
						var timekey2_arr = "";
						var timekey_arr = "";
						
						/* 선택된 시간의 1셀의 시작 분 */
						var cell_time_range1 = new Date(selday.getFullYear(),(selday.getMonth()+1), selday.getDate(), set_hour, 0);
						/* 선택된 시간의 1셀의 종료분 */
						var cell_time_range2 = new Date(selday.getFullYear(),(selday.getMonth()+1), selday.getDate(), set_hour, 29);
						/* 선택된 시간의 2셀의 시작 분 */
						var cell_time_range3 = new Date(selday.getFullYear(),(selday.getMonth()+1), selday.getDate(), set_hour, 30);
						/* 선택된 시간의 2셀의 종료 분 */
						var cell_time_range4 = new Date(selday.getFullYear(),(selday.getMonth()+1), selday.getDate(), set_hour, 59);
						
						if(parseInt(now_time.valueOf()) <= parseInt(cell_time_range2.valueOf()) && parseInt(now_time.valueOf()) >= parseInt(cell_time_range1.valueOf())){
							now_chk_sel = 1;
						}
						else if(parseInt(now_time.valueOf()) <= parseInt(cell_time_range4.valueOf()) && parseInt(now_time.valueOf()) >= parseInt(cell_time_range3.valueOf())){
							now_chk_sel = 2;
						}
						
						/* 현재 셀의 위치 찾기 */
						var current_cell = current_hour + "-" + now_chk_sel;
						
						if((parseInt(subtime.valueOf()) - parseInt(current_time.valueOf())) == 0){
							var chktimes = timekey.split("-");
							
							if((parseInt(now_time.getMinutes()) - 11) < 0 && (parseInt(now_time.getMinutes()) - 41)  < 0){
								timekey2 = (parseInt(today.getHours()) + 1) + "-1";								
							}
							else if((parseInt(now_time.getMinutes()) - 11) >= 0 && (parseInt(now_time.getMinutes()) - 41) < 0){
								timekey2 = (parseInt(today.getHours()) + 1) + "-2";
							}
							else if((parseInt(now_time.getMinutes()) - 11) >= 0 && (parseInt(now_time.getMinutes()) - 41) >= 0){
								timekey2 = (parseInt(today.getHours()) + 2) + "-1";
							}
							
						}
						
						if(timekey == current_cell) {
							settd_class = "ontime";
							sethref_class = "select";
							msg = "공실";
							msg2 = "공실입니다";
							roomchk = 1; //예약가능
						}
						
						//console.log(admin);
						
						/* 관리자인 경우 현재시간도 예약가능 */
						if(admin >= 1){
							
							
							/* 셀의 시간이 현재시간 보다 이전이면 */
							if(subtime.valueOf() < current_time.valueOf()){
								settd_class = "range";
								sethref_class = "select";
								msg = "공실";
								msg2 = "공실입니다";
								roomchk = 1; //예약가능
								
								//console.log(subtime.valueOf() + "-" + current_time.valueOf())
								
								var adminselday =  new Date(seldays[0],seldays[1],seldays[2]); //선택된 날짜 가져오기
								
								/* 오늘날짜가 아니면 관리자에서 예약 임의 처리 불가능하게 */
								if(adminselday.valueOf() < currentday.valueOf()){
									settd_class = "rangeOut";
									sethref_class = "select";
									msg = "공실";
									msg2 = "이전 날짜는 예약 및 수정 하실수 없습니다";
									roomchk = 0; //예약불가
									//console.log(selday.getMonth() + "-" + currentday.getMonth())
								}
							}
							else{
								settd_class = "range";
								sethref_class = "select";
								msg = "공실";
								msg2 = "공실입니다";
								roomchk = 1; //예약가능
							}
							
							if(timekey2 != ""){
								timekey2_arr = timekey2.split("-");
								if(timekey2_arr.length >= 1){
									/*(현재시간셀 - 시작시간 ) *  2(1시간당 셀수)  = (결과) + (1타임)*/
									unchecknum = ( parseInt(timekey2_arr[0]) - parseInt(start_time) ) * 2;
									unchecknum = unchecknum + parseInt(timekey2_arr[1]) - 1;
								}
							}
							
							
							if(cellnum <= unchecknum){
								
								if(timekey == current_cell) {
									settd_class = "ontime";
									sethref_class = "selectOut";
									msg = "공실";
									msg2 = "관리자는 선택 가능합니다";
									roomchk = 1; //예약불가능
								}
								else{
									settd_class = "range";	
									sethref_class = "select";
									msg = "공실";
									msg2 = "관리자는 선택 가능합니다";
									roomchk = 1; //예약불가능
								}
							}
							
						}
						/* 사용자인 경우 현재시간 예약 불가 */
						else{
							/* 셀의 시간이 현재시간 보다 이전이면 */
							if(subtime.valueOf() < current_time.valueOf()){
								settd_class = "rangeOut";
								sethref_class = "select";
								msg = "공실";
								msg2 = "선택하신 시간은  예약하실수 없습니다";
								roomchk = 0; //예약불가
							}
							else{
								settd_class = "range";
								sethref_class = "select";
								msg = "공실";
								msg2 = "공실입니다";
								roomchk = 1;
							}
							
							
							if(timekey2 != ""){
								timekey2_arr = timekey2.split("-");
								if(timekey2_arr.length >= 1){
									/*(현재시간셀 - 시작시간 ) *  2(1시간당 셀수)  = (결과) + (1타임)*/
									unchecknum = ( parseInt(timekey2_arr[0]) - parseInt(start_time) ) * 2;
									unchecknum = unchecknum + parseInt(timekey2_arr[1]) - 1;
								}
							}
							
							
							if(cellnum <= unchecknum){
								
								if(timekey == current_cell) {
									settd_class = "ontime";
									sethref_class = "selectOut";
									msg = "공실";
									msg2 = "선택하신 시간은  예약하실수 없습니다";
									roomchk = 0; //예약불가능
								}
								else{
									settd_class = "rangeOut";	
									sethref_class = "select";
									msg = "공실";
									msg2 = "선택하신 시간은  예약하실수 없습니다";
									roomchk = 0; //예약불가능
								}
							}
							
							
						}
						
						
						/* 해당 셀의 예약이 존재하는 경우 */
						if(restimes.indexOf(roomkey) != -1){
							settd_class = "rangeOut"; 
							sethref_class = "selectOut";
							msg = "이용완료";
							msg2 = "선택하신 시간은  예약하실수 없습니다";
							roomchk = 0; //예약불가능
							
							if(timekey == current_cell) {
								//settd_class = "ontime";
							}
						}
						
						if (cellnum % 2 == 0){
							settd_class = settd_class + " td2";
						}
						else{
							settd_class = settd_class + " td1";
						}

						
						setblind_txt = msg; //메시지(이미지 없을경우 보여주는 기본 텍스트 메시지)
						
						var roomkey_arr  = roomkey.split("_key_");
						var roomkey_room = roomkey_arr[0]; //룸코드
						var roomkey_seltime = roomkey_arr[1]; //룸체크시간
						
						if(admin != "2"){
							subcontent += "<td class=\""+settd_class+"\" id="+roomkey+"><a href=\"javascript:$.click_resdate('"+sel_time+"','"+roomkey+"','"+roomkey_room+"','"+roomkey_seltime+"','"+cellnum+"',"+roomchk+",'"+msg2+"');\" id=\"tag"+roomkey+"\" class=\""+sethref_class+"\" style=\"cursor:pointer\"><span class=\"blind\">"+setblind_txt+"</span></a></td>";
						}
						else{
							subcontent += "<td class=\""+settd_class+"\" id="+roomkey+"><a href=\"javascript:;\" id=\"tag"+roomkey+"\" class=\""+sethref_class+"\" style=\"cursor:pointer\"><span class=\"blind\">"+setblind_txt+"</span></a></td>";
						}
						
						cellnum++;
					}
					
					/* 현황 보기 페이지에서 상세 보기 차단 */
					if(admin != "2"){
						subcontent += "<td class=\"detail\"><a href=\"javascript:$.linkroom('"+roomkey_room+"');\"><img src=\"/public/images/booking/btn_detail_veiw.gif\" alt=\"상세\"></a></td>";
					}
					
					subcontent += "</tr>";
				}
				
				/* 현황 보기 페이지에서 시간 입력 차단 */
				if(admin != "2"){
					footcontent = "<div class=\"tbl_bookingIn\">";
					footcontent += "<dl>";
					footcontent += "<dt>예약시간</dt>";
					footcontent += "<dd>";
					footcontent += "<input type=\"text\" style=\"ime-mode:active;width:100px\" value=\"\" name=\"starttime\" id=\"starttime\" class=\"input_txt\"  readOnly>";
					footcontent += "~<input type=\"text\" style=\"ime-mode:active;width:100px\" value=\"\" name=\"endtime\" id=\"endtime\" class=\"input_txt\"  readOnly>";
					footcontent += "<span class=\"note_attach\">* 위의 표에서 선택하시면 자동 입력됩니다.</span>";
					footcontent += "</dd>";
					footcontent += "</dl>";
					footcontent += "</div>";
					footcontent += "<div class=\"booking_expn\">";
					footcontent += "<p>* 1인실은 기본 1시간, 2인실 이상은 기본 2시간 이상 선택 필수.</p>";
					footcontent += "</div>";
				}
				
				var tableHtmlArr = ["<table cellspacing=\"0\" border=\"1\" summary=\"예약테이블\">"];   
			    for (var row = 0; row < 1; row++) {   
			         tableHtmlArr.push(subcontent);   
			    }   
			    tableHtmlArr.push("</TABLE>");   
			    tableHtmlArr.push(footcontent);
			    maincontent = tableHtmlArr.join("");
				return maincontent;
			}
		
		});
	
	});
});
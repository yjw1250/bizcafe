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

var _LISTUNIT = 10 ; // 게시물 수
var _PAGEUNIT = 10 ; // 페이징 수
var _PAGE = 1 ;		// 현재 페이지
var _roomCode = ""; //룸코드

$(document).ready(function() {
	
	var today = new Date(); //오늘 날짜
	var sel_time = today.getFullYear();
	
	$(function() {
		
		$.extend({
			
			// 전체 예약 현황 
			sohoList:function(page) {
				if(_roomCode != null)
					var roomCode = _roomCode;
				if(!page)
					page = _PAGE ;				
				 	$.ajax({
					type: "GET",
					url:"/booking/businesslist.json",
					data:"page="+page+"&pageType=add&resType=OF&roomCode="+roomCode,
					cache: false,
					async: true,
					dataType : "json",	
					beforesend:function(){
						$("#listHeader").html("<img src='/public/images/loading.gif' />");
					},
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
			/* 룸 상세 페이지 연결 */
			linkroom:function(roomkey_room){
				if(roomkey_room == "BR0101" || roomkey_room == "BR0102" || roomkey_room == "BR0104"){
					location.href="/guide/soho/space?type=0";
				}
				else if(roomkey_room == "BR0103" || roomkey_room == "BR0105" || roomkey_room == "BR0106"){
					location.href="/guide/soho/space?type=1";
				}
				else if(roomkey_room == "BR0201" || roomkey_room == "BR0202"){
					location.href="/guide/soho/space?type=2";
				}
				
			},
			
			
			soho_display : function(sel_time,room_title,room_cnt,roomcode,room_name,room_name_max,admin,jsondata){
				var timestr; //메인 테이블 해더 월별 출력
				var maincontent; //메인  테이블 정보
				var subcontent; //서브 테이블 정보
				var footcontent; //풋터 테이블 정보
				
			
				subcontent  = "<colgroup>";
				subcontent += "<col width=\"66px\">";
				subcontent += "<col width=\"62px\">";
				subcontent += "<col width=\"\" colspan=\"16\">";
				subcontent += "<col width=\"*\"></colgroup>";
				subcontent += "<thead>";
				subcontent += "<tr>";
				subcontent += "<th colspan=\"2\" scope=\"col\" class=\"booth\">&nbsp;</th>";
				
				
				
				/* 현재 시간 */
				
				var current_month = new Date(today.getFullYear(),(today.getMonth()+1));
				var current_day = new Date(today.getFullYear(),(today.getMonth()+1),today.getDate());
				
			
				
				for(var i=1; i<=12; i++){
					timestr = i.toString();
					
					if(timestr.length == 1){
						timestr = "0"+timestr;
					}
					
					/* 셀의 시간 */
					var sub_month = new Date(sel_time,timestr);
					
					if(current_month.valueOf() ==  sub_month.valueOf()){
						subcontent += "<th colspan=\"2\" scope=\"col\" class=\"ontime\">"+timestr+"</th>";
					}
					else{
						subcontent += "<th colspan=\"2\" scope=\"col\" class=\"time\">"+timestr+"</th>";
					}
					
					
					
				}
				
				/* 현황 보기 페이지에서 상세 보기 차단 */
				if(admin != "2"){
					subcontent += "<th scope=\"col\" class=\"detail\">상세정보</th>";
				}
				
				subcontent += "</tr>";
				subcontent += "</thead>";
				subcontent += "<tbody>";
				
				
				/* 룸이름 */
				var roomnames;
				if(room_name != ""){
					roomnames = room_name.split(",");
				}
				
				/* 룸정보(~인실) */
				var roomnames_maxs;
				if(room_name_max.length >= 1){
					roomnames_maxs = room_name_max.split(",");
				}
				
				
				/* 룸코드 */
				var roomcodes
				if(roomcode.length >= 1){
					roomcodes = roomcode.split(",");
				}
				
				
				/*
				 * 예약된 부스정보 가져오기 
				 */
				var resStartArray = [];
				var resEndArray = [];
				var resYmdStart = []
				var resYmdEnd = []
				var resYmdtime1 = [];
				var resYmdtime2 = [];
				
				var resTimeData = [];
				var resTimeStart = [];
				var resTimeEnd = [];
				
				var resdata = "";
				var resMonthNum = "";
				var k=0;
				for(var key in jsondata.reserver){
						resdata = resdata + "," + jsondata.reserver[key].resRoom; //예약 정보 합치기
						resMonthNum = resMonthNum + "," + jsondata.reserver[key].resMonthNum; //기간 정보 합치기
						
						if(jsondata.reserver[key].resRoom){
							//시작 시간 가져오기
							resStartArray = jsondata.reserver[key].resStartHour.split(' ');
							//종료 시간 가져오기
							resEndArray = jsondata.reserver[key].resEndHour.split(' ');

							resTimeStart[k] = new Date(resStartArray[0].split('-')[0],resStartArray[0].split('-')[1],resStartArray[0].split('-')[2]);
							resTimeEnd[k] = new Date(resEndArray[0].split('-')[0],resEndArray[0].split('-')[1],resEndArray[0].split('-')[2]);
							resTimeData[k] = jsondata.reserver[key].resRoom + ":"+ resTimeStart[k].valueOf() + ":" + resTimeEnd[k].valueOf();
							
							if(parseInt(resStartArray[0].split('-')[2],10) <= 15 && parseInt(resStartArray[0].split('-')[2],10) >= 1){
								if(parseInt(resStartArray[0].split('-')[2],10) < 7){
									resYmdStart[k] = jsondata.reserver[key].resRoom + "_" + resStartArray[0].split('-')[0] + "-" + parseInt(resStartArray[0].split('-')[1],10) + "-1";
									resYmdtime1[k] = "start";
								}
								else{
									resYmdStart[k] = jsondata.reserver[key].resRoom + "_" + resStartArray[0].split('-')[0] + "-" + parseInt(resStartArray[0].split('-')[1],10) + "-1";
									resYmdtime1[k] = "end";
								}
							} 
							else{
								if(parseInt(resStartArray[0].split('-')[2],10) <= 23 && parseInt(resStartArray[0].split('-')[2],10) >= 16){
									resYmdStart[k] = jsondata.reserver[key].resRoom + "_" + resStartArray[0].split('-')[0] + "-" + parseInt(resStartArray[0].split('-')[1],10) + "-2";
									resYmdtime1[k] = "start";
								}
								else{
									resYmdStart[k] = jsondata.reserver[key].resRoom + "_" + resStartArray[0].split('-')[0] + "-" + parseInt(resStartArray[0].split('-')[1],10) + "-2";
									resYmdtime1[k] = "end";
								}
							}

							if(parseInt(resEndArray[0].split('-')[2],10) <= 15 && parseInt(resEndArray[0].split('-')[2],10) >= 1){
								if(parseInt(resStartArray[0].split('-')[2],10) < 7){
									resYmdEnd[k] = jsondata.reserver[key].resRoom + "_" + resEndArray[0].split('-')[0] + "-" + parseInt(resEndArray[0].split('-')[1],10) + "-1";
									resYmdtime2[k] = "start";
								}
								else{
									resYmdEnd[k] = jsondata.reserver[key].resRoom + "_" + resEndArray[0].split('-')[0] + "-" + parseInt(resEndArray[0].split('-')[1],10) + "-1";
									resYmdtime2[k] = "end";
								}

							} 
							else{
								if(parseInt(resStartArray[0].split('-')[2],10) <= 23 && parseInt(resStartArray[0].split('-')[2],10) >= 16){
									resYmdEnd[k] = jsondata.reserver[key].resRoom + "_" + resEndArray[0].split('-')[0] + "-" + parseInt(resEndArray[0].split('-')[1],10) + "-2";
									resYmdtime2[k] = "start";
								}
								else{
									resYmdEnd[k] = jsondata.reserver[key].resRoom + "_" + resEndArray[0].split('-')[0] + "-" + parseInt(resEndArray[0].split('-')[1],10) + "-2";
									resYmdtime2[k] = "end";
								}
							}
						}
						k++;
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
					
					var timekey = 0; //시작시간을 정한다
					var tdrow1 = "";
					var tdrow2 = "";
					var set_href = "";
					var setblind_txt ="공실";
					
					var setcell_type = [];
					var prevcell_type = [];
					
					for(var kd=1; kd<=24; kd++){	
						tdrow1 = "range";
						
						/* 0~15일 */
						if(kd/2%1 == 0.5){
							timekey = (parseInt(timekey) +1) +  "-1"; //홀수
							tdrow2 = "td1";
							set_href= "select";
						}
						/* 16~30일 */
						else if(kd/2%1 == 0){
							timekey = parseInt(timekey) +  "-2"; //짝수
							tdrow2 = "td2";
							set_href= "select";
						}
						
						/* 셀의 시간 */
						var timestr2 = timekey.split("-");
						var sub_month2 = new Date(sel_time,timestr2[0]);
						
						var yeartimekey = sel_time + "-" + leadingZeros(timestr2[0],2);
						var yeartimekey2 = roomcodes[k] + "_" + sel_time + "-" + timekey;
						
						setcell_type[kd] = 1;
						
						/* 해당 셀의 예약이 존재하는 경우 */
						if(resdata.indexOf(roomcodes[k]) != -1){
							for(var key in resYmdStart){
								if(yeartimekey2 == resYmdStart[key]){
									if(yeartimekey2.substr(-1)  == "1"){
										setcell_type[kd] = 2;
									}
									else if(yeartimekey2.substr(-1)  == "2"){
										setcell_type[kd] = 3;
									}
								}
							}
							
							for(var key in resYmdEnd){
								if(yeartimekey2 == resYmdEnd[key]){
									if(yeartimekey2.substr(-1)  == "1"){
										setcell_type[kd] = 4;
									}
									else if(yeartimekey2.substr(-1)  == "2"){
										setcell_type[kd] = 5;
									}
								}								
							}

						}
						
						
						if(setcell_type[kd] > 1){
							set_href = "selectOut";
						}
						
						//console.log("기간 : " + resMonthNum[kd] + " " + yeartimekey2 + "===>" + "이전선택 : " + prevcell_type[pk-1] + " 이전 : " + setcell_type[kd-1] + " 현재 :" + setcell_type[kd]);
						
						//console.log("기간 : " + resMonthNum[k] + " 현재 :" + yeartimekey2);
						
						subcontent += "<td class=\""+tdrow1+" "+tdrow2+"\"><a href=\"#\" id=\""+yeartimekey2+"\" onclick=\"return false;\" class=\""+set_href+"\"><span class=\"blind\">"+setblind_txt+"</span></a></td>";
						
						
					}
					
					
					/* 현황 보기 페이지에서 상세 보기 차단 */
					if(admin != "2"){
						subcontent += "<td class=\"detail\"><a href=\"javascript:$.linkroom('"+roomcodes[k]+"');\"><img src=\"/public/images/booking/btn_detail_veiw.gif\" alt=\"상세\"></a></td>";
					}
					
					subcontent += "</tr>"; 
				}
				subcontent += "</tbody>";
				
				var tableHtmlArr = ["<table cellspacing=\"0\" border=\"1\" summary=\"예약테이블\">"];   
			    for (var row = 0; row < 1; row++) {   
			         tableHtmlArr.push(subcontent);   
			    }   
			    tableHtmlArr.push("</TABLE>");   
			    tableHtmlArr.push(footcontent);
			    maincontent = tableHtmlArr.join("");
				return maincontent;
				
			},
			
			
			/* 년도 가져오기(이전,다음 년도) */
			getYear:function(year,val){
				var setdate = new Date(parseInt(year)+parseInt(val),today.getMonth(),today.getDate()); //선택된 날짜 가져오기
				var yearString = setdate.getFullYear();
				return yearString;
			}
			
		});
		
		if($("#resRoom").val() != undefined){
			_roomCode = $("#resRoom").val();
			//alert(_roomCode);
		}
		
		$.sohoList();
				
		$("#resRoom").bind("change",function(){
			_roomCode = $(this).val();
			_PAGE = 1;
			$.sohoList();
		});
		
		// paging 클릭
		$(".naviPage").live("click",function() {
			var page = $(this).attr('pageNo');	
			_PAGE = page ;
			$.sohoList(page);
		});
		
	});
	
});
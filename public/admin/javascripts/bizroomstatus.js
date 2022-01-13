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
	var today_year = today.getFullYear();
	var today_month = today.getMonth() + 1;
	var roomCode = "";
	var setdate = today_year + "-" + leadingZeros(today_month,2);
	
	$(function() {
		$.extend({
			
			//인쇄
			print:function(){
				$.pagePrint(print_page);
				//window.top.print(); 
			},
			pagePrint:function(Obj,type) { 
			    var W = Obj.offsetWidth;        //screen.availWidth; 
			    var H = Obj.offsetHeight;       //screen.availHeight;

			    var features = "menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,width=" + W + ",height=" + H + ",left=0,top=0"; 
			    var PrintPage = window.open("about:blank",Obj.id,features); 

			   
			    PrintPage.document.open(); 
			    
			    
			    	PrintPage.document.write("<html xmlns='http://www.w3.org/1999/xhtml'>" 
			    			+ "<head>"
			    			+ " <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />"
			    			+ "<link rel='stylesheet' type='text/css' href='/public/admin/stylesheets/admin.css' />"
			    			+ "</head>"
			    			+ "<body>"	
			    			+ "<div id='wrap'>"
			    			+ "<div id='container'>"
			    			+ "<div class='container_wrap'><div class='board_complete'>"
			    			+ Obj.innerHTML
			    			+ "</div></div>"
			    			+ "</div>"
			    			+ "</div>"
			    			+ "\n</body></html>"
			    	);
			  			    
			    PrintPage.document.close(); 
			    
			    PrintPage.document.title = "예약내역"; 
			    PrintPage.print(PrintPage.location.reload()); 
			},
			// 비즈니스룸 예약현황(월별)
			bizStatusList:function() {
				   setdate = today_year + "-" + leadingZeros(today_month,2);
				   $.ajax({
					type: "GET",
					url:"/admin/status/bizroomstate.json",
					data:"resDate="+setdate+"&roomCode="+roomCode,
					cache: false,
					async: true,
					dataType : "json",	
					success: function(jsonData, textStatus, XMLHttpRequest) {
						$("#listHeader").html(TrimPath.processDOMTemplate("templateList", jsonData));
						$("#per1").text(jsonData.per1);
						$("#per2").text(jsonData.per2);
						$("#payment").text(numberFormat(jsonData.payment.toString()));
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
						// Do nothing
					}
				});
			},
			/* 년도 가져오기(이전,다음 년도) */
			getYear:function(year,val){
				var setdate1 = new Date(parseInt(year)+parseInt(val,10),today.getMonth(),today.getDate()); //선택된 날짜 가져오기
				var yearString = setdate1.getFullYear();
				return yearString;
			},
			/* 월 가져오기(이전,다음 월) */
			getMonth:function(month,val){
				var setdate_array = setdate.split('-');
				var tmpdate = new Date(setdate_array[0],parseInt(month)-1,1);
				tmpdate.setMonth(parseInt(tmpdate.getMonth(),10) + val);
				var monthString = parseInt(tmpdate.getMonth(),10) +1;
				
				/* 해가 바뀌면 년도를 자동 바꿈 */
				today_year = tmpdate.getFullYear();
				$("#showyear").text(today_year);
				
				return monthString;
			}
			,
			//엑셀 다운로드
			excelDown:function(){
				window.location.href="/admin/status/bizroomexcel?resDate="+setdate+"&roomCode="+roomCode;
			}
			
		});
		
		
		
		
		if($("#resRoom").val()){
			roomCode = $("#resRoom").val();
		}
		
		//이전 년도 검색
		$("#prevyear").bind("click",function(){
			today_year = $.getYear(today_year,-1);
			$("#showyear").text(today_year);
			$.bizStatusList();
		});
		
		//다음 년도 검색
		$("#nextyear").bind("click",function(){
			today_year = $.getYear(today_year,+1);
			$("#showyear").text(today_year);
			$.bizStatusList();
		});
		
		//이전 월 검색
		$("#prevmonth").bind("click",function(){
			today_month = $.getMonth(today_month,-1);
			$("#showmonth").text(today_month);
			$.bizStatusList();
		});
		
		//다음 월 검색
		$("#nextmonth").bind("click",function(){
			today_month = $.getMonth(today_month,+1);
			$("#showmonth").text(today_month);
			$.bizStatusList();
		});
		
		$("#resRoom").bind("change",function(){
			roomCode = $(this).val();
			$.bizStatusList();
		});
		
		$("#showyear").text(today_year);
		$("#showmonth").text(today_month);
		$.bizStatusList();
		
		
		
	});
});
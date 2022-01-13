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


$(document).ready(function() {
	
	var today = new Date(); //오늘 날짜
	var today_year = today.getFullYear();
	var setdate = today_year;
	
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
			// 소호룸 예약현황(월별)
			bizStatusList:function() {
				   setdate = today_year;
				   $.ajax({
					type: "GET",
					url:"/admin/status/sohoroomstate.json",
					data:"resDate="+setdate,
					cache: false,
					async: true,
					dataType : "json",	
					success: function(jsonData, textStatus, XMLHttpRequest) {
						$("#totalresRate").text(jsonData.totalresRate);
						$("#totalcancelRate").text(jsonData.totalcancelRate);
						$("#listHeader").html(TrimPath.processDOMTemplate("templateList", jsonData));
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
			//엑셀 다운로드
			excelDown:function(){
				window.location.href="/admin/status/sohoroomexcel?resDate="+setdate;
			}
		});
		
		
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
		
		
		$("#showyear").text(today_year);
		$.bizStatusList();
		
		
	});
});
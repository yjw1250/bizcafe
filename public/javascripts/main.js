
$(document).ready(function() {


	$(function() {
		$.extend({
			
			//예약시 공휴일 체크	
			hoilday:function(element){
				$.ajax({
					type:"GET",
					url:"/booking/hoilday.json",
					data:"resDate="+$("#"+element).val(),
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						switch(jsonData.result) {	
						case "400" : 
							alert('선택하신 날짜는 ' + jsonData.holidayname +  '이므로 예약하실수 없습니다\r\n다시 선택해주세요')
							$("#"+element).val("");
							$("#"+element).focus();
							break;
						case "200" : 
							break;	
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}

				});
			},
			//예약하기
			bookingSubmit:function() {
				if($.cookie("BZ_UID") == null || $.cookie("BZ_UID")=="") {		
					alert('로그인이  필요합니다.');
					return;
				}
				
				if($("#resType").val()=="BZ"){
					if(!(	$.required("resdate","예약일") &&
							$.required("resPerson","예약인원")))
					{return;}		

					location.href = "/booking/business/"+$('#resdate').val()+"/"+$('#resPerson').val();
					
				}else{
					if(!(	$.required("resdateSh","소호 사무실 예약일") &&
							$.required("resPersonSh","소호 사무실 예약인원")))
					{return;}				
					
					location.href = "/booking/soho/"+$('#resdateSh').val()+"/"+$('#resPersonSh').val();					
					return;
				}				
				

			}
			
		}); //extend  End		
		

		//예약일,달력 클릭
		$("#resdate, #btnCalendar, #resdateSh, #btnCalendarSh").bind("click", function(){
			if($("#resType").val()=="BZ"){
				Calendar_Create("resdate");	
			}else{
				Calendar_Create("resdateSh");				
			}
		});

		//예약하기		
		$("#btnBooking, #btnBookingSh").bind("click", function(){
			$.bookingSubmit();
		});	
		//실시간 예약 더보기
		$("a[href=#btnBooking]").bind("click", function(){
			if($("#resType").val()=="BZ"){
				location.href="/booking/business";				
			}else{
				location.href="/booking/soho";
			}
		});
		
		
		
		
		//좌측 하단 예약하기 tab	
		$("#tab_busi1").bind("click", function(){
			$("#resType").val("BZ");
		});
		//소호사무실 	
		$("#tab_busi2").bind("click", function(){
			$("#resType").val("OF");
		});
		
		$('#TabMenuAdd li').click(function(){
	
			if (!$(this).hasClass('selected')) {    
				$('#TabMenuAdd li').removeClass('selected');
				$(this).addClass('selected');
				
				$('#boxBody div.business').hide();
				$('#boxBody div.business:eq(' + $('#TabMenuAdd > li').index(this) + ')').show();
			}
		  });
		
		//갤러리 썸네일 레이어 호출
		$("a[href=#galleryDetail1]").bind('click',function(){
			$('.g1').show();
			$("#pop_wrap_img").attr("src","public/images/main/m_popup_438x289_1.jpg");
			$("#pop_wrap_title").text("BIZ STUDIO 안내데스크");			
			return false;
		});
		$("a[href=#galleryDetail2]").bind('click',function(){
			$('.g1').show();
			$("#pop_wrap_img").attr("src","public/images/main/m_popup_438x289_2.jpg");
			$("#pop_wrap_title").text("카페");
			return false;
		});
		$("a[href=#galleryDetail3]").bind('click',function(){
			$('.g1').show();
			$("#pop_wrap_img").attr("src","public/images/main/m_popup_438x289_3.jpg");
			$("#pop_wrap_title").text("미팅공간");
			return false;
		});
		$("a[href=#galleryDetail4]").bind('click',function(){
			$('.g1').show();
			$("#pop_wrap_img").attr("src","public/images/main/m_popup_438x289_4.jpg");
			$("#pop_wrap_title").text("소호사무실");
			return false;
		});
		//레이어 닫기
		$('.pop_wrap .input_btn,a[href=#btn_x]').bind('click',function(){
			$('.g1').hide();
		});
		
	});
});

//예약일 선택후 예약불가일(이전일,공휴일) 체크
CALENDAR_EVENT = 2; 
function calendar_app_fun(){
	var element;
	if($("#resType").val()=="BZ"){
		element = "resdate";
	}else{
		element = "resdateSh";
	}
		
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
	
	//공휴일인가?
	if($("#resType").val()=="BZ"){	
		$.hoilday(element);
	}
}


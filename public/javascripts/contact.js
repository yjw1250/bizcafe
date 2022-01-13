/**
 * @
 * JEI소개 > 찾아오시는길
 * introduce > contact
 * 탭 컨트롤, 레이어팝업 호출
 */
// 페이지 로딩 직후, 실행되어야 할 내용은 이 안에서 처리합니다.
$(document).ready(function() {
	
	//레이어 초기화
//	$('.pop_wrap').hide();
	
	//탭메뉴
	initTabMenu("tab-movie");

	// 이벤트 바인딩은 이 안에서 합니다.
	$(function() {
		
		//레이어 호출 이벤트
		$("a[href=#busDetail]").bind('click',function(){
			$('.pop_wrap').css({top:'-100px',left:'30px'}).show();
			return false;
		});
		
		//레이어 닫기
		$('.pop_wrap .input_btn,a[href=#btn_x]').bind('click',function(){
			$('.pop_wrap').hide();
		});
		
		$('a[href=#movie2]').bind('click',function(){
			$('#mapApi').attr('src', $("#mapApi").attr('src'))
		});
	});

});
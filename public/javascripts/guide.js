/**
 * @
 * JEI소개 > 찾아오시는길
 * introduce > contact
 * 탭 컨트롤, 레이어팝업 호출
 */
// 페이지 로딩 직후, 실행되어야 할 내용은 이 안에서 처리합니다.
$(document).ready(function() {
	
	gallery(0);
	
	// 이벤트 바인딩은 이 안에서 합니다.
	$(function() {
		$('.goBookingBusiness').bind('click',function(){
			location.href='/booking/business';
		});
		$('.goBookingSoho').bind('click',function(){
			location.href='/booking/soho';
			return;
		});
		$('select[name=noteType]').bind('change',function(){
			SelChange($(this).attr('space'),$(this).find('option:selected').val());
		});
	});
	var type = $('select[name=noteType]').attr('parameter') ;
	if ( type != "" )
	{
		SelChange($('select[name=noteType]').attr('space'),type);
		$('select[name=noteType] > option[value=' + type + ']').attr('selected',true);
	}

});
<!--
//공간타입 셀렉트 스크립트
function SelChange(value,xVal){
	var j = ( value == "soho" ) ? 2 : 7 ;
	for(var i=0; i<=j; i++){
		if( i == xVal){
			document.getElementById("space_"+i).style.display = "block";
			gallery(i);
		}else{
			document.getElementById("space_"+i).style.display = "none";
		}
	}
}

//공간소개 갤러리 스크립트
function gallery(n){
	sg = document.getElementById('semiGallery_'+n);
	sgList = document.getElementById('semiGalleryList_'+n).getElementsByTagName('img');
	for(var j=0, c=sgList.length; j<c; j++){
		sgList[j].onmouseover = function(event){
			event = event || window.event;
			sg.src = (event.target || event.srcElement).src;
		}
	}
}
//-->
/**
 * @author yujaeheon
 * @since 2012/02/14
 * 설명 . 관리자 메뉴 설정 파일.
 * 
 */

$(document).ready(function() {

	$(function() {
		
		
		var adminMenuNum = $("#adminMenuNum").val();
		var topMenu,subMenu,subMenuSeq;
				
		if (adminMenuNum != undefined && adminMenuNum !="" ){
			topMenu = adminMenuNum.substring(0,1);
			subMenu = adminMenuNum.substring(1,2);
			subMenuSeq = parseInt(subMenu)-1;	
			
			$("#submenu0"+topMenu+">ul>li").removeClass("selected");			
			if(subMenuSeq>=0){$("#submenu0"+topMenu+">ul>li:eq("+subMenuSeq+")").addClass("selected");}
		}

		// 관리자 상단 메뉴 class 적용		
		switch (topMenu) {
			case "1":$("#menu01").addClass("selected");$("#submenu01").show();break;
			case "2":$("#menu02").addClass("selected");$("#submenu02").show();break;
			case "3":$("#menu03").addClass("selected");$("#submenu03").show();break;
			case "4":$("#menu04").addClass("selected");$("#submenu04").show();break;
			case "5":$("#menu05").addClass("selected");$("#submenu05").show();break;
			case "6":$("#menu06").addClass("selected");$("#submenu06").show();break;		
			default:break;	
		}
		
	});
});

function menuAlertMsg(){
	alert('서비스 준비중입니다.');
	return;
}
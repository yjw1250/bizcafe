$(document).ready(function() {

	// 이벤트 바인딩은 이 안에서 합니다.
	$(function() {
		
		$.alertError = function() {
			
			if($.cookie("errorResult") != null && $.cookie("errorResult")) {
				switch($.base64Decode($.cookie("errorResult"))) {
				case '100' :
					alert('로그인이 필요한 페이지 입니다. 로그인 하십시요.');
					break;
				case '101' :
					alert('아이디또는 암호가 틀렸습니다. 다시 로그인 하십시요.');
					break;
				case '102' :
					alert('차단된 아이디입니다. 다른 아이디로 다시 로그인 하십시요.');
					break;
				case '103' :
					alert('로그인 하지 못하였습니다. 다시 로그인 하십시요.');
					break;
				case '104' :
					alert('아이디에 해당하는 관리자 정보가 존재하지 않습니다.');
				case '105' :
					alert('로그인 아이피와 현재 사용자 아이피가 상이합니다. 잠시후에 다시 로그인 하십시요.');
						break;
				case '106' :
					alert('해당 메뉴에 대한 관리 권한이 없습니다.');
					break;	
				}
				$.cookie("errorResult",null);
			}
			$.cookie("errorResult",null);
		}
		
		$.alertError();
		
	});
	
});

$(document).ready(function() {
	
	// 이벤트 바인딩은 이 안에서 합니다.
	$(function() {		
			
		$("#loginForm").validate({
			rules: {
				loginID:"required",
				loginPasswd:"required"
			},
			messages: {
				loginID:"아이디를 입력해 주세요",
				loginPasswd:"패스워드를 입력해 주세요"				
			},
			submitHandler:function(form) {
				
				var loginID = $("#loginID").val();
				var loginPasswd = $("#loginPasswd").val();
				var saveID = $("#saveID:checked").val();
				
				// teset 일경우
				if(_DOMAIN != document.domain){
					alert("알맞지 않은 도메인입니다.");
					location.href="http://www.bizstudio.co.kr";
//					
//					$.ajax({
//						url: "/user/loginTest",
//						type: "POST",
//						data: {
//							"loginID":loginID,
//							"loginPasswd":loginPasswd,
//							"saveID":saveID
//						},
//						cache: false,
//						async: true,
//						dataType: "text",
//						beforeSend: function(XMLHttpRequest) {
//							// 전송 전 처리
//						},
//						success:function(data, textStatus, XMLHttpRequest) {
//	//						alert(data);
//							if (data == "101") {
//								alert("아이디 패스워드 정보가 일치 하지 않습니다.");
//								$("#logiID").val("");
//								$("#loginPasswd").val("");
//							} else if (data == "000"){
//								location.href="/";
//							}
//						},
//						error:function(){
//							alert('fail');
//						}
//						
//					});
				} else {
					// ssl 일경우
					form.submit();
				}
			}
		});
		
	
	});
	
});

$(document).ready(function() {

	$(function() {
			
		$("#frmLogin").validate({
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
				
			
				// teset 일경우
				if(_DOMAIN != document.domain){
					
					$.ajax({
						url: "/adminTest",
						type: "POST",
						data: {
							"loginID":loginID,
							"loginPasswd":loginPasswd
						},
						cache: false,
						async: true,
						dataType: "text",
						beforeSend: function(XMLHttpRequest) {
							// 전송 전 처리
						},
						success:function(data, textStatus, XMLHttpRequest) {
	//						alert(data);
							if (data == "101") {
								alert("아이디 패스워드 정보가 일치 하지 않습니다.");
								$("#logiID").val("");
								$("#loginPasswd").val("");
							} else if (data == "000"){
								location.href="/admin/user";
							}
						},
						error:function(){
							alert('fail');
						}
						
					});
				} else { 
					form.submit();
				}
			}
		});
		
	});
	
});
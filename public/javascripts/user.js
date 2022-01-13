
$(document).ready(function() {

	// 이벤트 바인딩은 이 안에서 합니다.
	$(function() {
		
		$.extend ({
			
			// 우편번호 검색후 입력
			zipcodeInsert: function(address,zipcode1,zipcode2) {
				var f = document.joinForm;
				
				$("#zip1").val(zipcode1);
				$("#zip2").val(zipcode2);
				$("#addr1").val(address);				
			},
			
			// 아이디 중복 체크 
			idCheck: function(userID) {
				$.ajax({
					url: "/user/idcheck",
					type: "GET",
					data: {
						"userID":userID
					},
					cache: false,
					async: true,
					dataType: "json",
					success:function(data, textStatus, XMLHttpRequest) {
//						alert(data);
						if (data == "401") { // 없으므로 사용가능
							$("#idCheckYes").show();
							$("#idCheckNo").hide();
							$("#certifyID").val("1");
						} else if (data == "200"){
							$("#idCheckYes").hide();
							$("#idCheckNo").show();
							$("#certifyID").val("");
							
						}
					},
					error:function(){
						alert('fail');
					}
					
				});
				
			},
			
			// 아이디 찾기
			searchID: function() {
				
				if ($.trim($("#idUserName").val()) == "") {
					alert("이름을 입력해 주세요");
					$("#idUserName").focus();
					return false;				
				}
				if ($.trim($("#idEmail").val()) == "") {
					alert("이메일을 입력해 주세요");
					$("#idEmail").focus();
					return false;				
				}
				
				var userName = $("#idUserName").val();
				var email = $("#idEmail").val();
				
//				var userName = encodeURIComponent($("#idUserName").val());
//				var email = encodeURIComponent($("#idEmail").val());
				
//				$("#aa").val("userName="+userName+"&email="+email);
				$.ajax({
					url: "/user/searchId",
					type: "POST",
					data: {
						"userName":userName,
						"email":email
					},
					cache: false,
					async: true,
					dataType: "text",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
						if (data == "101") {
							alert('정보가 일치 하지 않습니다.');
						} else if (data == "401") {
							alert('회원정보가 존재 하지 않습니다.');
						} else {
							alert('회원님의 아이디는 '+data+' 입니다.');
						}
						
					},
					error:function(){
						alert('fail');
					}
				});
			},
			
			// 패스워드 찾기
			searchPasswd: function() {
				
				if ($.trim($("#passUserID").val()) == "") {
					alert("아이디를 입력해 주세요");
					$("#passUserID").focus();
					return false;				
				}
				if ($.trim($("#passUserName").val()) == "") {
					alert("이름을 입력해 주세요");
					$("#passUserName").focus();
					return false;				
				}
				if ($.trim($("#passEmail").val()) == "") {
					alert("이메일을 입력해 주세요");
					$("#passEmail").focus();
					return false;				
				}
				var userID = $("#passUserID").val();
				var userName = $("#passUserName").val();
				var email = $("#passEmail").val();
//				var userID = encodeURIComponent($("#passUserID").val());
//				var userName = encodeURIComponent($("#passUserName").val());
//				var email = encodeURIComponent($("#passEmail").val());
				
				$.ajax({
					url: "/user/searchPassword",
					type: "POST",
					data: {
						"userID":userID,
						"userName":userName,
						"email":email
					},
					cache: false,
					async: true,
					dataType: "text",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
						if (data == "101") {
							alert('정보가 일치 하지 않습니다.');
						} else if (data == "401") {
							alert('회원정보가 존재 하지 않습니다.');
						} else {
							alert('회원님의 임시 패스워드가 이메일로 전송되었습니다.');
						}
						
					},
					error:function(){
						alert('fail');
					}
				});
			},
			
			// 우편번호 검색
			searchZipcode:function() {
				var dong = $("#dong").val();
				
				if ($.trim(dong) == "") {
					alert("동을 입력하세요");
				}			
				
				$(".dongName").text($("#dong").val());
				$.ajax({
					url: "/user/zipcode/zipcode.json",
					type: "GET",
					data: {
						"dong":dong
					},
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
						//alert(data);
						// 데이타가 없을경우에 noneZipcode 활성화
						if (data == "") {
							$("#isZipcode").hide();
							$("#isZipcodeList").hide();
							$("#noneZipcode").show();
						} else {
							$("#isZipcode").show();
							$("#isZipcodeList").show();
							$("#noneZipcode").hide();
							$("")
							var jsonData = {
		       			         "zipcode": data
		       				   };
							$("#zipcodeList").html(TrimPath.processDOMTemplate("templateRow", jsonData));
						}
					},
					error:function(){
						alert('fail');
					}
				});
			},			
			
			//SMS 인증 번호 발송
			sendSms:function(){
				
				if($("#phone1").val()=="" || $("#phone2").val()=="" || $("#phone3").val()==""){
					alert("휴대폰 번호를 모두 입력하세요");
					return;
				}			
				
				var userName = $("#userName").val();
				var phone = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
				
				$.ajax({
					type:"POST",
					url:"/sms/sendsms.json",
					data:{
						"sendsms.sendFlag" : 1,
						"sendsms.recPhone" : phone,
						"sendsms.recName": userName,
						"sendsms.sendMsg" : "인증확인"
					},
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						switch(jsonData.result) {	
						case "200" : 
							$("#certifyNo").val(jsonData.certifyNo);
							if(_DOMAIN != document.domain){
								alert("인증번호 = "+ jsonData.certifyNo);
							}
							alert("인증 메시지가 정상적으로 발송되었습니다.")
							break;
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}
					
				});
			}
			
		});
		
		// 회원가입		
		$("#joinForm").validate({
			rules:{
				userName:{
					required: true, 	
					maxlength: 50,
					minlength: 1	
				},
				birthYear:"required",
				birthMonth:"required",
				birthDay:"required",				
				userID : {
					required : true,
					maxlength : 10,
					minlength : 3
				},
				userPasswd:"required",
				userPasswd1:{
					required:true,
					equalTo:"#userPasswd"
				},
				phone1:"required",
				phone2:"required",
				phone3:"required",
				emailID:"required",
				emailDomain:"required"
					
			},
			messages:{
				userName:{
					required:"성명을 입력해 주세요.",
					minlength:"1자 이상 입력해 주세요."
				},
				birthYear:"생일의 년을 선택해 주세요",
				birthMonth:"생일의 월을 선택해 주세요",
				birthDay:"생일의 일을 선택해 주세요",	
				userID:{
					required : "아이디를 입력하세요.",
					en_num : "영문과 숫자로만 입력해주세요",
					maxlength : "10자 이하로 입력해주세요",
					minlength : "3자 이상 입력해주세요"
				},
				userPasswd:"비밀번호를 입력해 주세요.",
				userPasswd1:{
					required:"비밀번호 재확인을 입력해 주세요.",
					equalTo:"비밀번호가 일치 하지 않습니다."
				},
				phone1:"연락처를 선택해 주세요",
				phone2:"연락처를 입력해 주세요",
				phone3:"연락처를 입력해 주세요",
				emailID:"이메일을 입력하세요",
				emailDomain:"이메일 도메인을 입력해 주세요."
				
			},
			submitHandler:function(form) {
				
				if ($.memberIdCheck("userID","아이디") == false) {
					return;
				}
				
				if ($("#certifyID").val() == "") {
					alert("아이디 중복확인을 해주세요");
					return;
				}
				
				$.memberIdCheck("userID","아이디");
				
				//생년월일					
				if($("#birthYear").val()!="" && $("#birthMonth").val()!="" && $("#birthDay").val()!=""){
					$("#birth").val($("#birthYear").val() + "-" + $("#birthMonth").val() + "-" + $("#birthDay").val());
				} else {
					$("#birth").val("1800-01-01");		
				}
				
				//핸드폰					
				if($("#phone1").val()!="" || $("#phone2").val()!="" || $("#phone3").val()!=""){
					$("#phone").val($("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val());
					if(!($.telCheck("phone","연락처"))){return;};		
				}
				
				$.numeric("phone2","휴대폰번호 앞자리 ");
				$.numeric("phone3","휴대폰번호 뒷자리 ");
				
				if ($("#certify_num").val() == "") {
					alert('인증번호 입력을 해주세요.')
					$("#certify_num").focus();
					return ;
				}	
				
				if ($("#certifyNo").val() != $("#certify_num").val()) {
					alert("인증 번호가 올바르지 않습니다.");
					$("#certify_num").focus();
					return ;					
				}

				var userinfo = {
						"user.userID":$("#userID").val(),
						"user.birth":$("#birth").val(),
						"user.userName":$("#userName").val(),
						"user.userPasswd":$("#userPasswd").val(),
						"user.phone":$("#phone").val(),
						"user.email":$("#emailID").val() + "@" + $("#emailDomain").val(),
						"user.zip1":$("#zip1").val(),
						"user.zip2":$("#zip2").val(),
						"user.addr1":$("#addr1").val(),
						"user.addr2":$("#addr2").val()
				};
				
				$.ajax({
					url: "/user",
					type: "POST",
					data: userinfo,
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
//						alert(data);
						if (data == "200") {
							alert("회원가입이 완료되었습니다.");
							location.href="/";
						}
					},
					error:function(){
						alert('fail');
					}
				});
			}			
		});
		
		// 회원정보 수정
		$("#modifyForm").validate({
			rules:{
//				userPasswd:"required",
				userPasswd1:{
					equalTo:"#userPasswd"
				},
				phone1:"required",
				phone2:"required",
				phone3:"required",
				emailID:"required",
				emailDomain:"required"
			},
			messages:{
				
//				userPasswd:"비밀번호를 입력해 주세요.",
				userPasswd1:{
					equalTo:"비밀번호가 일치 하지 않습니다."
				},
				phone1:"연락처를 선택해 주세요",
				phone2:"연락처를 입력해 주세요",
				phone3:"연락처를 입력해 주세요",
				emailID:"이메일을 입력하세요",
				emailDomain:"이메일 도메인을 입력해 주세요."
				
			},
			submitHandler:function(form) {
				
				//생년월일					
				if($("#birthYear").val()!="" && $("#birthMonth").val()!="" && $("#birthDay").val()!=""){
					$("#birth").val($("#birthYear").val() + "-" + $("#birthMonth").val() + "-" + $("#birthDay").val());
				} else {
					$("#birth").val("1800-01-01");		
				}
				
				//핸드폰					
				if($("#phone1").val()!="" || $("#phone2").val()!="" || $("#phone3").val()!=""){
					$("#phone").val($("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val());
					if(!($.telCheck("phone","연락처"))){return;};		
				}
				
				// 휴대폰 번호 변경됨.
				if ($("#phone").val() != $("#phoneChk").val()) {
					if ($("#certifyNo").val() == "") {
						alert("휴대폰 번호가 수정되었습니다.\n\n인증 번호를 발송받으신뒤 확인 하시기 바랍니다.");
						return;
					}					
				}
				var userinfo ;
				if ($("#userPasswd").val() != "") {
					userinfo = {"user.userPasswd":$("#userPasswd").val()};
				}
				
				if ($("#userPasswd").val() == "") {
					var userinfo = {
							"user.userID":$("#userID").val(),
							"user.birth":$("#birth").val(),
							"user.phone":$("#phone").val(),
							"user.email":$("#emailID").val() + "@" + $("#emailDomain").val(),
							"user.zip1":$("#zip1").val(),
							"user.zip2":$("#zip2").val(),
							"user.addr1":$("#addr1").val(),
							"user.addr2":$("#addr2").val()
					};
				} else {
					var userinfo = {
							"user.userID":$("#userID").val(),
							"user.birth":$("#birth").val(),
							"user.userPasswd":$("#userPasswd").val(),
							"user.phone":$("#phone").val(),
							"user.email":$("#emailID").val() + "@" + $("#emailDomain").val(),
							"user.zip1":$("#zip1").val(),
							"user.zip2":$("#zip2").val(),
							"user.addr1":$("#addr1").val(),
							"user.addr2":$("#addr2").val()
					};
				}

				$.ajax({
					url: "/user",
					type: "PUT",
					data: userinfo,
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
//						console.log(data);
//						alert(data);
						if (data == "200") {
							alert("수정이 완료되었습니다.");
							location.href="/";
						}
					},
					error:function(){
						alert('fail');
					}
				});
			}
			
		});

		// 회원탈퇴처리
		$("#userOutForm").validate({
			rules:{},
			messages:{},
			
			submitHandler:function(form) {
				var reason = new Array();
				$("input[name=reason[]]:checked").each(function() {
					reason.push($(this).val());
				});
				
				var userinfo = {
					"userOut.outReason":reason,
					"userOut.outReasonDetail":$("#outReasonDetail").val()
				};
				
//				alert(reason);

				$.ajax({
					url: "/user/outProcess",
					type: "POST",
					data: userinfo,
					cache: false,
					async: true,
					dataType: "text",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
//						alert("data" + data);
						if (data == "101") {
							alert("로그인 정보가 잘못되었습니다.로그아웃 됩니다.");
							location.href="/user/logout";
						} else if (data == "200") {
							alert("탈퇴처리가 완료되었습니다.");
							location.href="/";
						}
					},
					error:function(){
						alert('fail');
					}
				});
			}
		});
		
		// 이용약관 가입하기 
		$("#btnAgree").bind("click", function() {
			if ($("#agreeCheck1:checked").val() != "1") {
				alert('서비스 이용약관에 동의 하셔야 합니다.');
				return;
			}
			
			if ($("#agreeCheck2:checked").val() != "1") {
				alert('개인정보 수집 및 이용안내에 동의 하셔야 합니다.');
				return;
			}
			
			$("#agreeForm").submit();
		});
		
		// 휴대폰 번호
		$("#phone2").bind("keydown", function() {
			$.onlyNumeric(this);			
		});
		
		// 휴대폰 번호
		$("#phone3").bind("keydown", function() {
			$.onlyNumeric(this);			
		});
		
		// 회원가입 버튼 클릭		
		$("#btnJoin").bind("click", function() {
			$("#joinForm").submit();
		});
		
		// 아이디 중복체크
		$("#btnIdCheck").bind("click", function() {
			
			var uid = $.trim($("#userID").val());
			if (uid == "" ) {
				alert("아이디를 입력해 주세요.");
				$("#userID").focus();
				return false;
			}
			
			$.memberIdCheck("userID","아이디");
			$.idCheck(uid); 
		});
		
		// 휴대폰 인증 번호 발송
		$("#btnCertify").bind("click", function() {
			$.sendSms();
		});
		
		// 인증번호 확인 
		$("#btnCertifyOk").bind("click", function() {
			
			if ($("#certify_num").val() == "") {
				alert('인증 번호를 입력하세요');
				$("#certify_num").focus();
				return;
			}
			
			if ($("#certifyNo").val() == $("#certify_num").val()) {
				$("#certifyCheckYes").show();
				$("#certifyCheckNo").hide();
			} else {
				$("#certifyCheckYes").hide();
				$("#certifyCheckNo").show();
			}			
		});
		
		// 이메일 도메인 셀렉트
		$("#emailDomainSelect").bind("change", function() {
			var domain = $(this).val();
			if (domain != "") {
				$("#emailDomain").attr("readonly",true);
			} else {
				$("#emailDomain").attr("readonly",false);
			}
			$("#emailDomain").val($(this).val());
		});
		
		// 주소 찾기
		$("#btnZipcode").bind("click", function() {
			var form = "joinForm";
			var zip1 = "zip1";
			var zip2 = "zip2";
			var addr = "addr1";
			
			window.open("/user/zipcode","zipcode","width=600,height=515");
		});
		
		// 우편번호 검색 팝업 창닫기
		$("#btnClose,#btnClose1").bind("click", function() {
			
			self.close();
		});
		// 우편번호 찾기 검색버튼
		$("#btnZipcodeSearch").bind("click", function() {
			$.searchZipcode();
		});
		
		// 우편번호 입력하기
		$(".post").live("click", function() {
			
			var address = $(this).text();
			var zipcode = $(this).attr("zipcode");
		
			var zip = zipcode.split("-");
			var zip1 = zip[0];
			var zip2 = zip[1];
			
			opener.$.zipcodeInsert(address,zip1,zip2);
			self.close();
			
		});
		
		// 아이디 찾기 
		$("#btnSearchId").bind("click", function() {
			$.searchID();
		});
		
		// 패스워드 찾기
		$("#btnSearchPassword").bind("click", function() {
			$.searchPasswd();
			
		});
		
		// 정보 수정
		$("#btnModify").bind("click", function() {
			$("#modifyForm").submit();			
		});
		
		// 회원탈퇴
		$("#btnUserOut").bind("click", function() {
			if(confirm('정말 탈퇴 하시겠습니까?')) {
				$("#userOutForm").submit();
			}
		});

	});
});


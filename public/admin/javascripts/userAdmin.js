var isPatternNumber = /\d/;//숫자

$(document).ready(function() {

	$(function() {
		
		$.extend ({
			
			page:function(page){
				if(!isPatternNumber.test(page)){
					return;
				}
				$("#page").val(page);
				$("#userListForm").submit();
			},
			
			// 아이디 중복 체크 
			idCheck: function(userID) {
				$.ajax({
					url: "/admin/userAdmin/idcheck",
					type: "GET",
					data: "adminID="+userID,
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
//						alert(data);
						if (data == "401") { // 없으므로 사용가능
							alert("사용가능합니다");
							$("#certifyID").val("1");
						} else if (data == "200"){
							alert("중복된 아이디가 존재 합니다.");
							$("#adminID").val("");
						}
					},
					error:function(){
						alert('fail');
					}
					
				});
				
			},
			
			// 회원정보 가져오기 
			userRead:function(userID) {
				
				$.ajax({
					url: "/admin/user/read/"+userID,
					type: "GET",
					data: "",
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
//						alert(data.user.userName);
						var zipcode = data.user.zip1 + "-" + data.user.zip2;
						var address = data.user.addr1 + data.user.addr2;
						var userName = data.user.userName + "(" + data.user.userID + ")";
						$("#readUserName").text(userName);
						$("#readUserPhone").text(data.user.phone);
						$("#readUserZipCode").text(zipcode);
						$("#readUserAddress").text(address);
						
						$("#readUserInfo").show();
						
					},
					error:function(){
						alert('fail');
					}					
				});
			
			},
			
			// 회원 검색 
			userSearch:function () {
				
				//var page = $("#page").val();
				var searchKey = $("#searchKey > option:selected").val();
				var searchVal = $.trim($("#searchVal").val());
				if (searchVal == "") {
					alert("검색어를 입력하세요1");
					$("#searchString").focus()
					return;
				}
				
				if (searchVal.length < 2) {
					alert("검색어는 2자 이상 입력하세요");
					$("#searchString").focus()
					return;
				
				}
				
				$("#searchForm").submit();
			}
		});
		

		$("#joinForm").validate({
			rules:{
				adminID : {
					required : true,
					maxlength : 10,
					minlength : 3
				},
				adminName:{
					required: true, 	
					maxlength: 50,
					minlength: 1	
				}
			},
			messages:{
				adminID:{
					required : "관리자 아이디를 입력하세요.",
					en_num : "영문과 숫자로만 입력해주세요",
					maxlength : "10자 이하로 입력해주세요",
					minlength : "3자 이상 입력해주세요"
				},
				adminName:{
					required:"성명을 입력해 주세요.",
					minlength:"1자 이상 입력해 주세요."
					
				}				
			},
			submitHandler:function(form) {
				
				if ($("#certifyID").val() == "") {
					alert("아이디 중복확인을 해주세요");
					return;
				}
				var menu = "";
				var menuAuthority = "";
				$("input[name=menuAutority[]]:checked").each(function() {
					menu = $(this).val();
					menuAuthority = menuAuthority + "," + menu;
				});
				
				var userinfo = {
						"userAdmin.adminID":$("#adminID").val(),
						"userAdmin.adminName":$("#adminName").val(),
						"userAdmin.tel":$("#tel").val(),
						"userAdmin.hp":$("#hp").val(),
						"userAdmin.email":$("#email").val(),
						"userAdmin.department":$("#department").val(),
						"userAdmin.duty":$("#duty").val(),
						"userAdmin.company":$("#company > option:checked").val(),
						"userAdmin.adminLevel":$("#adminLevel > option:checked").val(),
						"userAdmin.menuAuthority":menuAuthority
					
				};
				
				$.ajax({
					url: "/admin/userAdmin",
					type: "POST",
					data: userinfo,
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
						//alert(data);
						if (data == "200") {
							if ($("#mode").val() == "update") {
								alert("관리자 수정이 완료되었습니다.");								
							} else {
								alert("관리자 등록이 완료되었습니다.");								
							}
							location.href="/admin/userAdmin";
						}
					},
					error:function(){
						alert('fail');
					}
				});
				
				
			}
		});
		// 관리자 정보 수정
		$("#modifyForm").validate({
			rules:{
				adminPasswd1:{
					equalTo:"#adminPasswd"
				}
			},
			messages:{
				adminPasswd1:{
					equalTo:"비밀번호가 일치 하지 않습니다."
				}					
			},
			submitHandler:function(form) {
				
				var menu = "";
				var menuAuthority = "";
				$("input[name=menuAutority[]]:checked").each(function() {
					menu = $(this).val();
					menuAuthority = menuAuthority + "," + menu;
				});
				
				var userinfo = {
						"userAdmin.adminID":$("#adminID").val(),
						"userAdmin.tel":$("#tel").val(),
						"userAdmin.hp":$("#hp").val(),
						"userAdmin.email":$("#email").val(),
						"userAdmin.department":$("#department").val(),
						"userAdmin.duty":$("#duty").val(),
						"userAdmin.company":$("#company > option:checked").val(),
						"userAdmin.adminLevel":$("#adminLevel > option:checked").val(),
						"userAdmin.menuAuthority":menuAuthority
				};
				
				$.ajax({
					url: "/admin/userAdmin",
					type: "PUT",
					data: userinfo,
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
						//alert(data);
						if (data == "200") {
							alert("관리자 수정이 완료되었습니다.");							
							location.href="/admin/userAdmin";
						}
					},
					error:function(){
						alert('fail');
					}
				});
				
			}
		
		});
		
		
		// 내 정보 수정 - 관리자
		$("#myModifyForm").validate({
			rules:{
				adminPasswd1:{
					equalTo:"#adminPasswd"
				}
			},
			messages:{
				adminPasswd1:{
					equalTo:"비밀번호가 일치 하지 않습니다."
				}					
			},
			submitHandler:function(form) {
				
				if ($("#adminPasswd").val() == "") {
				
					var userinfo = {
							"userAdmin.adminID":$("#adminID").val(),
							"userAdmin.adminName":$("#adminName").val(),
							"userAdmin.tel":$("#tel").val(),
							"userAdmin.hp":$("#hp").val(),
							"userAdmin.email":$("#email").val(),
							"userAdmin.department":$("#department").val(),
							"userAdmin.duty":$("#duty").val()
					};
					
				} else {
					var userinfo = {
							"userAdmin.adminID":$("#adminID").val(),
							"userAdmin.adminName":$("#adminName").val(),
							"userAdmin.adminPasswd":$("#adminPasswd").val(),
							"userAdmin.tel":$("#tel").val(),
							"userAdmin.hp":$("#hp").val(),
							"userAdmin.email":$("#email").val(),
							"userAdmin.department":$("#department").val(),
							"userAdmin.duty":$("#duty").val()						
					};
					
				}
				
				$.ajax({
					url: "/admin/modify",
					type: "PUT",
					data: userinfo,
					cache: false,
					async: true,
					dataType: "text",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
//						alert(data);
						if (data == "200") {
							alert("관리자 수정이 완료되었습니다.");							
							location.href="/admin/modify";
						}
					},
					error:function(){
						alert('fail');
					}
				});
				
			}
		
		});
		
		// 회원 상세 보기 닫기 버튼
		$("#btnClose ,#btnCloseBic").bind("click", function() {
			$("#readUserInfo").hide();
		});
		
		// 회원 검색
		$("#btnSearch").bind("click", function() {
			$.userSearch();
			
		});
		
		// 아이디 중복 검색 
		$("#btnIdCheck").bind("click", function() {
			var uid = $.trim($("#adminID").val());
			if (uid == "" ) {
				alert("아이디를 입력해 주세요.");
				$("#adminID").focus();
				return false;
			}
			
			$.idCheck(uid);
		});
		
		// 가입
		$("#btnAdminJoin").bind("click", function() {
			$("#joinForm").submit();
		});
		
		// 수정
		$("#btnAdminUpdate").bind("click", function() {
			$("#modifyForm").submit();			
		});
		
		// 내 정보변경
		$("#btnMyModify").bind("click", function() {
			$("#myModifyForm").submit();
		});

	});
});


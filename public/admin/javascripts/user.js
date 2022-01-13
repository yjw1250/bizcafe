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
			
			// 우편번호 검색후 입력
			zipcodeInsert: function(address,zipcode1,zipcode2) {
				var f = document.joinForm;
				
				$("#zip1").val(zipcode1);
				$("#zip2").val(zipcode2);
				$("#addr1").val(address);				
			},
			
			// 회원리스트 json
			userList:function() {
				$.ajax({
					url: "/admin/user/list.json",
					type: "GET",
					data: "",
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
						//alert(data);
						var jsonData = {
		       			         "users": data
		       			         
		       				   };
							$("#adminUserList").html(TrimPath.processDOMTemplate("templateRow", jsonData));
							
					},
					error:function(){
						alert('fail');
					}					
				});
				
				
			},
			// 회원정보 가져오기 
			userRead:function(userID) {
				$.ajax({
					url: "/admin/user/read/"+userID+".json",
					type: "GET",
					data: "",
					cache: false,
					async: true,
					dataType: "json",
					success:function(data, textStatus, XMLHttpRequest) {
						var zipcode = data.user.zip1 + "-" + data.user.zip2;
						var address = data.user.addr1 + data.user.addr2;
						var userName = data.user.userName + "(" + data.user.userID + ")";
						$("#readUserName").text(userName);
						$("#readUserPhone").text(data.user.phone);
						
						if (zipcode == "-") {
							$("#readUserZipCode").text(zipcode);
						} else {
							$("#readUserZipCode").text("");							
						}
						if (address) {
							$("#readUserAddress").text(address);
						} else {
							$("#readUserAddress").text("");							
						}
						$("#readBzCnt").text(data.user.resBzCnt);
						$("#readSohoCnt").text(data.user.resOfCnt);
						$("#readBzLink").attr("href","/admin/booking/businesslist/"+data.user.userID);
						$("#readSohoLink").attr("href","/admin/booking/soholist/"+data.user.userID);
						$("#readUserInfo").show();
						
					},
					error:function(){
						alert('fail');
					}					
				});
			
			},
			
			// 회원정보 가져오기 
			userReadview:function(userID,data,top,left) {
				
				top = (typeof(top) != 'undefined') ? top : 0;
			    left = (typeof(left) != 'undefined') ? left : 0;

				var id = $("#"+data.id);
				var tops = $("#"+data.id).position().top + top;
				var lefts = $("#"+data.id).position().left + left;	
				
				$.ajax({
					url: "/admin/user/read/"+userID+".json",
					type: "GET",
					data: "",
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
						$("#readUserInfo").css( 
								{ 
							     "position":"absolute",
								 "top":tops+"px",
								 "left":lefts+"px"	
								}
						
						);
					},
					success:function(data, textStatus, XMLHttpRequest) {
						var zipcode = data.user.zip1 + "-" + data.user.zip2;
						var address = data.user.addr1 + data.user.addr2;
						var userName = data.user.userName + "(" + data.user.userID + ")";
						$("#readUserName").text(userName);
						$("#readUserPhone").text(data.user.phone);
						$("#readUserZipCode").text(zipcode);
						$("#readUserAddress").text(address);
						$("#readBzCnt").text(data.user.resBzCnt);
						$("#readSohoCnt").text(data.user.resOfCnt);
						$("#readBzLink").attr("href","/admin/booking/businesslist/"+data.user.userID);
						$("#readSohoLink").attr("href","/admin/booking/soholist/"+data.user.userID);
						$("#readUserInfo").show();
						
					},
					error:function(){
						alert('fail');
					}					
				});
			
			},
			
			// 회원 검색 
			userSearch:function() {
				
				//var page = $("#page").val();
				var searchKey = $("#searchKey > option:selected").val();
				var searchVal = $.trim($("#searchVal").val());
				if (searchVal == "") {
					alert("검색어를 입력하세요");
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
		
		// 회원 상세 보기 닫기 버튼
		$("#btnClose ,#btnCloseBic").bind("click", function() {
			$("#readUserInfo").hide();
		});
		
		// 회원 검색
		$("#btnSearch").bind("click", function() {
			$.userSearch();
			
		});
		

	});
});


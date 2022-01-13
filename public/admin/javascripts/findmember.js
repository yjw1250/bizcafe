var _LISTUNIT = 10 ; // 게시물 수
var _PAGEUNIT = 10 ; // 페이징 수
var _PAGE = 1 ;		// 현재 페이지

$(document).ready(function() {

	// 이벤트 바인딩은 이 안에서 합니다.
	$(function() {
		
		$.extend ({
			
			// 회원정보 가져오기 
			readMember:function(userID) {
				$.ajax({
					url: "/admin/user/read/"+userID+".json",
					type: "GET",
					data: "",
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(data, textStatus, XMLHttpRequest) {
						var zipcode = data.user.zip1 + "-" + data.user.zip2;
						var address = data.user.addr1 + data.user.addr2;
						var userName = data.user.userName + "(" + data.user.userID + ")";
						$("#findmember").hide();
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
			//회원 정보 등록 
			setMember:function(userID,userName,Phone){
				$("#username",opener.document).text(userName);
				$("#userphone",opener.document).text(Phone);
				
				$("#userName",opener.document).val(userName);
				$("#Phone",opener.document).val(Phone);
				$("#userID",opener.document).val(userID);
				self.close();
			},
			
			// 회원 찾기			
			findmember:function(page){
				
				if(!page) page = _PAGE ;	
				
				var searchVal = encodeURIComponent($("#searchVal").val());
				var searchKey = encodeURIComponent($("#searchKey option:selected").val());
				var keytext = $("#searchKey option:selected").text();
			
				if ($.trim(searchVal) == "") {
					alert(keytext + "을 입력하세요");
					return;
				}
				
				$.ajax({
					url: "/admin/user/list.json",
					type: "GET",
					data: "page="+page+"&searchKey="+searchKey+"&searchVal="+searchVal,
					cache: false,
					async: true,
					dataType: "json",
					beforeSend: function(XMLHttpRequest) {
						// 전송 전 처리
					},
					success:function(jsonData, textStatus, XMLHttpRequest) {
						// 데이타가 없을경우에 noneZipcode 활성화
						if (jsonData == "") {
							$(".result_wrap").hide();
							$(".note_attach star").hide();
						} else {
							$(".result_wrap").show();					
							if(parseInt(jsonData.userCount) >= 1){
								$(".note_attach star").show();
							}
							else{
								$(".note_attach star").hide();
							}
							
							$("#searchText").text($("#searchVal").val());
							$("#userCount").text(jsonData.userCount)
							$("#memberList").html(TrimPath.processDOMTemplate("templateRow", jsonData));
							$("#pageNavi").html($.paging(page, jsonData.userCount));
						}
					},
					error:function(){
						alert('fail');
					}
				});
			}
			
			
		})
		
		// 회원 정보 상세창 닫고 리스트로
		$("#btnCloseBic").bind("click",function(){
			$("#findmember").show();
			$("#readUserInfo").hide();
		});
	
		// 회원 검색 팝업 창닫기
		$("#btnClose,#btnClose1").bind("click", function() {
			self.close();
		});
		
		// 회원검색(enter )
		$("#searchVal").bind("keydown",function(event){
			var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
		    if (keycode == 13) { // keycode for enter key
		    	$.findmember();
		    }
		});
		
		// 회원검색(버튼 )
		$("#btnMemberSearch").bind("click", function() {
			$.findmember();
		});
		
		// paging 클릭
		jQuery(".naviPage").live("click",function() {
			var page = $(this).attr('pageNo');	
			_PAGE = page ;
			$.findmember(page);
		});
	})
})
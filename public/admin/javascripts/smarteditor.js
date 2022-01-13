
//------------  스마트 에디터 ---------------------// 
$(document).ready(function() {

	$(function() {

		$.extend({
			
			// 이미지삽입 함수 imgupload_pro.asp 에서 호출
			insertIMG : function(irid,fileame){
				var sHTML = "<img src='" + imagepath + "/" + fileame + "' border='0'>";
				oEditors.getById[irid].exec("PASTE_HTML", [sHTML]);
			},
			
			// 이모티콘삽입 함수
			insertEmoticonIMG : function(irid,fileame){
				var sHTML = "<img src='" + emoticonpath + "/" + fileame + "' border='0'>";
				oEditors.getById[irid].exec("PASTE_HTML", [sHTML]);
			},				
			
			pasteHTMLDemo : function(){
				var sHTML = "<span style='color:#FF0000'>이미지 등도 이렇게 삽입하면 됩니다.</span>";
				oEditors.getById["ir1"].exec("PASTE_HTML", [sHTML]);		
			},
			
			showHTML : function(){
				alert(oEditors.getById["ir1"].getIR());
			},
			
			_onSubmit : function(){

				// 에디터의 내용을 에디터 생성시에 사용했던 textarea에 넣어 줍니다.
				oEditors.getById["ir1"].exec("UPDATE_IR_FIELD", []);
								
				// 에디터의 내용에 대한 값 검증은 이곳에서 document.getElementById("ir1").value를 이용해서 처리하면 됩니다.
				$("#content1").val($("#ir1").val());				
				if ($.paramValueCheck("content1","내용","focus") == false) return false;
												
				try{
					//elClicked.form.submit();
					w_form.action = "/admin/ui/smarteditok";
					w_form.submit();
				}catch(e){}
			},

			// param check 폼체크
			paramValueCheck: function(element,name,options) {
				if ($.trim($("#"+element).val()) == "") {
					alert(name + "을 입력하세요");
					if (options == "focus") {
						$("#"+element).focus();
					}
					return false;
				} else {
					return true;
				}
			}			
			
			
		});		
				

		// HTML삽입 예제
		$("#pasteHTMLDemo").bind("click", function() {
			$.pasteHTMLDemo();
		});		
		
		// HTML보기 예제	
		$("#showHTML").bind("click", function() {
			$.showHTML();
		});
		
		// 저장	
		$("#_onSubmit").bind("click", function() {
			$._onSubmit();
		});		
						
	});
	
	
});
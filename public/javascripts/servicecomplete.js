$(document).ready(function() {
	$(function() {
		
		$.extend({
			
			/* 예약수정 */
			createSurvey:function(){
				
				var survey_idx = new Array();
				var survey_Num = new Array();
				var item_Num = new Array();
				var answer = new Array();
				
				var i = 0;
				$('input:radio').each(function(){
					 if ($(this).attr('checked')){
						 var idnum = $(this).attr("id").slice(-1);
						 if($("#surveyIdx"+idnum).val() != null)
					 	 survey_idx[i] = $("#surveyIdx"+idnum).val();
						 survey_Num[i] = $("#surveyNum"+idnum).val();
						 item_Num[i] = $("#itemNum"+idnum).val();
							 
						 if($("#answer"+idnum+":checked").val()){
							 answer[i] =  $("#answer"+idnum+":checked").val();
						 }
						 else{
							 answer[i] =  "N";
						 }
						 
						 i++;
					 }
				});
				
				if(i <= 0){
					alert('서비스 만족도 조사 항목을 하나 이상 선택해 주세요');
					return;
				}
				
				
				$.ajax({
					type: "POST",
					url:"/booking/servicesave.json",
					data: {
						"resIdx" : $("#resIdx").val(),
						"survey_idx" : survey_idx,
						"survey_num" : survey_Num,
						"item_num" : item_Num,
						"answer" : answer,
						"etcComment" : $("#etcComment").val()
					},
					cache: false,
					async: true,
					dataType : "json",					
					success: function(jsonData, textStatus, XMLHttpRequest) {
						switch(jsonData.result) {	
							case "100" :
								alert('회원님이 예약하신 내역이 아닙니다');
								break;
							case "300" :
								alert('이미 서비스 만족도 조사에 참여하셨습니다.');
								break;
							case "400" : 
								alert('서비스 만족도 조사가 정상적으로 이루어지지 않았습니다.');
								break;
							case "200" :
								alert('서비스 만족도 조사에 참여가 완료되었습니다.');
								break;
						}
					},
					error:function (xhr, ajaxOptions, thrownError){	
						alert(_THROWNERROR);
					}
				});
			},
			
			submitReserver:function(){
				/* 메시지 기존의 alert 창으로 */
				$.validator.setDefaults({
			         onkeyup:false,
			         onclick:false,
			         onfocusout:false,
			         showErrors:function(errorMap, errorList){
			            if(this.numberOfInvalids()) { // 에러가 있을 때만..
			                alert(errorList[0].message);
			            }
			        }
			    });
												
				$("#frmRegist").validate({
					submitHandler: function() {	
							if(confirm("저장 하시겠습니까?")) {
								$.createSurvey();
							}
					},
					errorPlacement: function(error, element) { 
				    	error.insertAfter(element);
					}								
				});		
				$("#frmRegist").submit();		
			}
			
		});
		
		/* 등록(인증창 출력포함) */
		$("#btnSubmit").bind("click", function() {
			$.submitReserver();
		});
		
	});
});
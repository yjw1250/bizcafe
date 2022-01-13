//입력폼값 체크  

$(document).ready(function(){

	$(function(){
		$.extend({
			// email2 select 선택
			Email_Srv:function() {
				
				if($("#email_addr2").val()!=""){
					$("#email2").val($("#email_addr2").val());					
					$("#email2").attr("disabled",true);
				}else{
					$("#email2").val("");					
					$("#email2").attr("disabled",false);
				}
			},
			//배포범위 지정
			distribute_all:function() {
				if($("#distribute_all:checked").length > 0){
					$("input[name=distribute]").attr("checked", false);
					$("input[name=distribute]").attr("disabled", true);
				}else{
					$("input[name=distribute]").attr("checked", false);
					$("input[name=distribute]").attr("disabled", false);					
				}
			},
			saveUserInfo:function() {					
				alert('작업중~~저장 ok 페이지로 GOGO~~');
			}				

		}); //extend  End
		

		// 등록버튼 클릭
		$("#btnSubmit").bind("click", function() {
			
			$("#frmRegist").validate({
				rules: {  	
					userLevel 			: {required: true},							
					userID 				: {required: true, minlength: 6, maxlength: 10},	//,en_num: true, remote:"id중복체크,유효성체크 페이지"}			
					userName			: {required: true, minlength: 1, maxlength: 50},		
					userMail			: {required: true, email: true},					
					userPasswd 			: {required: true, minlength: 4, maxlength: 12},			
					userPasswdConfirm 	: {equalTo: "#userPasswd"},
					fileField1 			: {accept: "jpg|jpeg|gif"}
				},
				messages: {
					userLevel 		: {required : "좋아하는 커피를 선택 하세요."},					
					userID : {
						required 	: "아이디를 입력하세요.",
						//en_num 		: "아이디를 영문과 숫자로만 입력해주세요",
						minlength 	: jQuery.format("아이디는 {0}자 이상으로 입력해 주세요."),						
						maxlength 	: jQuery.format("아이디는 {0}자 이하로 입력해 주세요.")//,remote : jQuery.format("{0}는 이미 있는 아이디")
					},		
					userName: {
					    required 	: "이름을 입력하세요." ,
						minlength 	: jQuery.format("이름은 {0}자 이상으로 입력해 주세요."),
						maxlength 	: jQuery.format("이름은 {0}자 이하로 입력해 주세요.")
					},
					userMail : {
						required 	: "userMail을  입력해 주세요.",
						email		: "올바른 userMail을 입력해 주세요." 
					},							
					userPasswd : {
						required 	: "비밀번호를 입력하세요.",
						minlength 	: jQuery.format("비밀번호는 {0}자 이상으로 입력해 주세요."),
						maxlength 	: jQuery.format("비밀번호는 {0}자 이하로 입력해 주세요.")
					},
					userPasswdConfirm : {equalTo : "비밀번호가 일치하지 않습니다. 비밀번호를 확인해 주세요."},
					fileField1 : {
						accept 		: jQuery.format("썸네일 이미지를 확장자 jpg|jpeg|gif 로 업로드 해 주세요.")
					}					
				},
				submitHandler: function() {			
				    //아이디	
					if(!($.memberIdCheck("userID","회원 아이디"))){return;};					
						
					//이름
					if(!($.hangulAlphaNumeric("userName","회원 이름"))){return;};		
					
					
					//나이
					if(!(	$.required("userage","나이") &&
							$.numeric("userage","나이")))
					{return;};
					
					//활성상태
					if(!($.required("userState","활성상태"))){return;};					
					
					//이메일 형식 체크
					if($("#email1").val()!="" || $("#email2").val()!=""){
						$("#email").val($("#email1").val() + "@" + $("#email2").val());
						if(!($.emailCheck("email","이메일"))){return;};								
					}
					
					//전화번호, 핸드폰 둘 중 하나는 필수					
					if($("#tel1").val()!="" || $("#tel2").val()!="" || $("#tel3").val()!=""){
						$("#tel").val($("#tel1").val() + "-" + $("#tel2").val() + "-" + $("#tel3").val());
						if(!($.telCheck("tel","전화번호"))){return;};		
					}
					if($("#hp1").val()!="" || $("#hp2").val()!="" || $("#hp3").val()!=""){
						$("#hp").val($("#hp1").val() + "-" + $("#hp2").val() + "-" + $("#hp3").val());	
						if(!($.telCheck("hp","핸드폰번호"))){return;};				
					}	
					if($("#tel").val()=="" && $("#hp").val()==""){		
					    alert("집전화와 휴대전화 중 1가지는 필수입력사항입니다.");
					    return ;						
					}
					
					//일반파일:금지확장자 체크
					if($("#fileField2").val()!=""){if(!($.fileNameChk("fileField2",""))){return;};}
					
					
										
					if(confirm("저장 하시겠습니까?")) {
						$.saveUserInfo();				
					}						
				},
				errorPlacement: function(error, element) { 
			    	error.insertAfter(element);
				}								
			});		
			//$("#frmRegist").valid();
			
			$("#frmRegist").submit();			
		});	
		
		//달력 클릭
		$("#regDate, #btnCalendar").bind("click", function(){
			Calendar_Create("regDate");
		});

		// email2 select 선택
		$("#email_addr2").bind("change", function() {			
			$.Email_Srv();
		});
		
		//배포범위 지정
		$("#distribute_all").bind("click", function() {
			$.distribute_all();
		});		
		
		//전체선택,해제
		$("#check_all").bind("click", function() {
			$.check_all("check_all","chk");
		});
		
		//SNS 공유
		$("#goFacebook").bind("click", function(){
			$.facebook();
		});
		$("#goTwitter").bind("click", function(){
			$.twitter();
		});
		$("#goMe2Day").bind("click", function(){
			$.me2day();
		});

		
	});
});

//달력 날짜 선택후 추가로  체크가 필요한 항목이 있다면...
//CALENDAR_EVENT = 2; 
//function calendar_app_fun(){
//	alert('선택된 날짜는 ' + $("#regDate").val()+',달력 날짜지정후 추가 함수가 필요하다면  여기에 처리사항 넣어 주세요');
//}



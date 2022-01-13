/**
 * 공통으로 사용하는 자바스크립트 펑션을 정의 합니다.
 */

// 전역 변수 선언
//var _DOMAIN = "http://localhost:9001"; 사용하는곳을 모르겠음.ㅠㅠ 그래서 일단 막아봄

var _DOMAIN = "www.bizstudio.co.kr";
var _LISTUNIT = 20 ; // 게시물 수
var _PAGEUNIT = 10 ; // 페이징 수
var _SEARCHWDRULE = /[~!@\#$%^&*\()\=+|\\/:;?"<>']/gi; // 검색어 규칙
var _THROWNERROR = "현재 페이지에서 오류가 발생하였습니다.\n한번 더 시도해 보시고 그래도  오류가  발생시에는  1:1문의로 접수 해 주십시요.";

jQuery.validator.setDefaults({      
	onkeyup:false,      
	onclick:false,      
	onfocusout:false,      
	showErrors:function(errorMap, errorList){  
		if(errorList != "") {		
			alert(errorList[0].message);
		}
	}      
});

$(document).ready(function(){
	
	$(function(){
		$.extend({	
			
			
			// 페이징
			paging:function(thisPage, totalCnt) {	
				if(totalCnt <=0)
					return "" ;				
				
				var listUnit = _LISTUNIT ;
				var pageUnit = _PAGEUNIT;

				var totPages = Math.ceil(totalCnt/listUnit); //총페이지수
				var thisBlock = Math.ceil(thisPage/pageUnit); //현재 페이징블럭
				var startPage, endPage; // 현재 페이징블럭 처음, 마지막 페지이
				var preBlock, nextBlock ; // 이전, 다음 페이징 블럭
				var html = "";

				// 현재 페이지블럭의 시작페이지번호, 전페이지번호
				if(thisBlock > 1){
					startPage = (thisBlock-1)*pageUnit+1;
					preBlock = startPage -1;
				}else{
					startPage = preBlock = 1;					
				}

				// 현재 페이지블럭의 끝페이지번호, 다음페이지번호
				if( (thisBlock*pageUnit) >= totPages ){
					endPage = totPages;
					nextBlock = endPage ;
				}else{
					endPage = thisBlock*pageUnit;
					nextBlock = endPage +1
				} 

				if(thisPage > 1){
					html += "<a class='first' href='javascript:;'><img alt='처음' class='naviPage' pageNo='1' src='/public/admin/images/btn_pagenavi_fist.gif'></a> "; // 맨처음으로 가기
					html += "<a class='prev' href='javascript:;'><img alt='이전' class='naviPage' pageNo='"+preBlock+"' src='/public/admin/images/btn_pagenavi_prev.gif'></a> "; // 현재블럭의 전페이지
				}
				
				for(i = startPage; i <= endPage; i++){
					if(i != thisPage){
						html += " <a class='naviPage' href='javascript:;' pageNo='"+i+"'>"+i+"</a>";
					} else {
						html += " <strong>"+i+"</strong>" ;
					}
				}

				if(thisPage != totPages){
					html += "<a class='first' href='javascript:;'><img alt='다음' class='naviPage' pageNo='"+nextBlock+"' src='/public/admin/images/btn_pagenavi_next.gif'></a> "; // 현재 블럭의 다음페이지
					html += "<a class='prev' href='javascript:;'><img alt='끝' class='naviPage' pageNo='"+totPages+"' src='/public/admin/images/btn_pagenavi_end.gif'></a> "; // 맨끝으로 가기
				}
				return html;
			},
			
			// 검색어 체크
			searchValueCheck: function(element) {
				
				var schValue = jQuery.trim($("#"+element).val().replace(_SEARCHWDRULE,''));
				$("#"+element).val(schValue);
				
				if(!$("#"+element).val()) { alert("검색어를 2글자이상 입력하세요 \n\n특수문자는 검색 불가능합니다");$("#"+element).val('');$("#"+element).focus(); return false; }
				if($("#"+element).val().length < 2) { alert("검색어는 2글자이상 입력하셔야 합니다\n\n특수문자는 검색 불가능합니다");$("#"+element).focus(); return false; }
			},
			
			//전체선택,해제			
			check_all:function(element1,element2) {
				
				if ($("#"+element1+":checked").length > 0) { 
					$("input[name="+element2+"]").attr("checked", true);
				}else {
					$("input[name="+element2+"]").attr("checked", false);
				}				
			},
			
			//전화번호, 핸드폰 번호 형식 체크
			telCheck:function(element,str) {			
				var pattern = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;					
				if(!pattern.test($.trim($("#"+element).val()))){
				    alert(str + " 형식이 올바르지 않습니다.\n\n{2,3}-{3,4}-{4}자리로 입력해 주십시오.\n");
				    return false;
				}	
				return true;		
			},
			
			//email 형식 체크
			emailCheck:function(element,str) {			
				var pattern = /([0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)\.([0-9a-zA-Z_-]+)/; //pattern = /(\S+)@(\S+)\.(\S+)/; 이메일주소에 한글 사용시
				if(!pattern.test($.trim($("#"+element).val()))){
				    alert(str + " 형식을 맞춰주세요. 예)hong@korea.com");
				    return false;
				}			
				return true;
			},

			//회원 아이디 형식 체크
			memberIdCheck:function(element,str) {			
				var pattern = /(^([a-z0-9]+)([a-z0-9_]+$))/;
				if(!pattern.test($.trim($("#"+element).val()))){
				    alert(str + " 형식이 아닙니다.\n\n영소문자, 숫자, _ 만 가능.\n\n첫글자는 영소문자, 숫자만 가능\n");
				    return false;
				}				
				return true;
			},
			
			//한글인지 검사 (자음, 모음만 있는 한글은 불가)
			hangul:function(element,str){
				var pattern = /([^가-힣\x20])/i; 
				if(pattern.test($.trim($("#"+element).val()))){
				    alert(str + ":한글이 아닙니다. (자음, 모음만 있는 한글은 처리하지 않습니다.)\n");
				    return false;
				}		
				return true;			
			},
			//한글인지 검사2 (자음, 모음만 있는 한글도 가능)
			hangul2:function(element,str){
				var pattern = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i; 
				if(pattern.test($.trim($("#"+element).val()))){
				    alert(str + ":한글이 아닙니다.\n");
				    return false;
				}		
				return true;			
			},			
			//한글,영문,숫자인지 검사3
			hangulAlphaNumeric:function(element,str){
				var pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i; 
				if(pattern.test($.trim($("#"+element).val()))){
				    alert(str + ":한글, 영문, 숫자가 아닙니다.\n");
				    return false;
				}		
				return true;
			},	
		    // 숫자인지검사 			
			numeric:function(element,str){
				var pattern = /(^[0-9]+$)/; 
				if(!pattern.test($.trim($("#"+element).val()))){
				    alert(str + ":숫자가 아닙니다.\n");
				    return false;
				}		
				return true;
			},
			// 숫자만 입려되게 함 ie 전용
			onlyNumeric: function(obj) {
				if(/[^0123456789]/g.test(obj.value)) {
					alert('숫자만 입력하세요');
					obj.value = "";
//					obj.value = Number(String(obj.value).replace(/\..*|[^\d]/g,""));
				}
					
				
			},
			
		    // 양쪽 공백 없애기
		    trimvalue:function(element){
		        var pattern = /(^\s*)|(\s*$)/g; // \s 공백 문자		        
				var trimValue = jQuery.trim($("#"+element).val().replace(pattern,''));				
				$("#"+element).val(trimValue);	
				return trimValue;
		    },
		    // 필수 입력 검사
		    required:function (element,str) {
				var chk = false;					
				if($("#"+element).attr("type") == 'radio' || $("#"+element).attr("type") == 'checkbox'){	
					var chk_fld = $("input[name="+element+"]");
					for(var i=0; i<chk_fld.length; i++)
					{
						if(chk_fld[i].checked){
							chk = true;
							break;
						}
					}
					if(!chk)
					{
						str = str + " : 필수 선택 입니다.\n";
					}
				}else {					
		            if ($.trimvalue(element) != ""){
		            	chk = true;
		            }else{
		            	str = str + " : 필수 "+($("#"+element).attr("type")=="select-one"?"선택":"입력")+"입니다.\n";
		            }
		        }
				
				if (!chk){alert(str);}
				return chk;
		    },

		    //파일 종류체크
		    fileNameChk:function (element,flag){
		    	var type = "";
		    	var str = "";
		    	
		    	switch (flag){
			    	case "img":	type = "jpg, jpeg, gif";	str = "이미지 파일("+ type +")";	break;
			    	case "jpg":	type = "jpg";				str = "이미지 파일("+ type +")";	break;		    		
			    	case "swf":	type = "swf";				str = "플래시 파일("+ type +")";	break;
			    	case "vod":	type = "mov, avi, wmv, asf";str = "동영상 파일("+ type +")";	break;		    		
			    	case "audio":type = "wma, mp3, ogg";	str = "오디오 파일("+ type +")";	break;		    		
			    	case "multi":type = "mov, avi, wmv, asf, wma, mp3, ogg";	str = "멀티미디어 파일("+ type +")";		    		
			    	default:break;
		    	}
		    	
			  	var file_ext=($("#"+element).val().substring($("#"+element).val().lastIndexOf(".")+1,$("#"+element).val().length));
			  	file_ext=file_ext.toLowerCase();
			  	
			  	var strfile = $("#"+element).val();			
			  	var sp_v = strfile.split("\\");
			  	var file_name =(sp_v[sp_v.length-1]);
			  	

			  	//업로드 금지 확장자 체크
			  	var xBadFile = 'html,htm,php,asp,jsp,exe,script,js,dll,asa,hta,aspx,ini,db';
			  	if (xBadFile.indexOf(file_ext) != -1){
			  		alert('업로드가 금지된 확장자 파일입니다.');
			  		$("#"+element).val("");
			  		return false;
			  	}

			  	var cnt  = 0; var file_chk = "";
			  	
			  	for (i=0;i<file_name.length;i++) 
			  	{
			  		file_chk=file_name.substring(i,i+1);
			  		if(file_chk=='!'||file_chk=='@'||file_chk=='#'||file_chk=='$'||file_chk=='%'||file_chk=='^'||file_chk=='&'||file_chk=='*') {
			  			cnt = cnt + 1;
			  			break;
			  		}
			  	}

			  	if(cnt > 0) {
			  		alert('첨부파일명에 특수문자가 있으면 정상적으로 다운로드 되지 않습니다...(ex:&,%,$,# 등)');
			  		$("#"+element).val();
			  		return false;
			  	}
			  	else {
			  		if(type == ''){
			  			return true;
			  		} else {			
			  			if (type.indexOf(file_ext) == -1) {
			  				alert(str + '만 첨부 가능합니다.');					
			  				return false;
			  			} else {
			  				return true;
			  			}
			  		}
			  	}	
		    },
		    
			// SNS 공유
		    facebook:function (url,text) {
		    	var fullurl = url;
		    	var url = fullurl;
		    	var text = encodeURIComponent(text);
				window.open("http://www.facebook.com/sharer.php?u="+url+"&t="+text,"");
			},
			twitter:function (url,text) {
				var fullurl = url;
		    	var url = fullurl;
		    	var text = encodeURIComponent(text);
				window.open("http://twitter.com/share?url="+url+"&text="+text+"&new_post[tags]=","");
			},
			me2day:function (body) {
				var body = encodeURIComponent(body);
				window.open("http://me2day.net/posts/new?new_post[body]="+body+"&new_post[tags]=비즈카페","");
			},
			
			/**
			 * License by Blueⓘ
			 *
			 * @param String longURL 짧게 변경할 긴 문자열의 URL
			 * @return String 짧게 변환된 URL
			 */
			getShortURL:function(longURL) {
				var ret;
				$.getJSON(
						"http://api.bit.ly/shorten?version=2.0.1&longUrl="+longURL+"&login=yjw1250&apiKey=R_d5cd1b7507a7ce7a1678b73f129af2d1",
						function(data) {
							ret = data.results.shortUrl;
						}
				);
				return ret;
			},

			//이미지 사이즈 조정
			resizeImages:function(id,imgWidth){
				var resizeWidth = parseInt(imgWidth);
				$('#'+id+' img').each(function(){
					var tmpWidth = $(this).width();
					if(tmpWidth > resizeWidth) $(this).width(resizeWidth);
					$(this).load(function() {
						tmpWidth = $(this).width();
						if(tmpWidth > resizeWidth) $(this).width(resizeWidth);
					});
				});
			},
			
			//오늘날짜 구하기(YYYY-MM-DD)
			toDay:function (){
				var now = new Date();	
				var year = parseInt(now.getFullYear());
				var month = parseInt(now.getMonth()) + 1;
				var day =  parseInt(now.getDate());
				
				if(month<10){
					month = "0" + month;
				}
				if(day<10){
					day = "0" + day;
				}
				
				var toDay = year + "-" + month + "-" +  day;
				return toDay;
			}
		    
			
		}); //extend  End
					
	});
});		
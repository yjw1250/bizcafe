$(document).ready(function() {

	$(function() {
		$.extend({
			
			
			pagePrint:function(Obj,type) { 
			    var W = Obj.offsetWidth;        //screen.availWidth; 
			    var H = Obj.offsetHeight;       //screen.availHeight;

			    var features = "menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,width=" + W + ",height=" + H + ",left=0,top=0"; 
			    var PrintPage = window.open("about:blank",Obj.id,features); 

			   
			    PrintPage.document.open(); 
			    
			    if(type == "admin"){
			    	PrintPage.document.write("<html xmlns='http://www.w3.org/1999/xhtml'>" 
			    			+ "<head>"
			    			+ " <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />"
			    			+ "<link rel='stylesheet' type='text/css' href='/public/admin/stylesheets/admin.css' />"
			    			+ "</head>"
			    			+ "<body>"	
			    			+ "<div id='wrap'>"
			    			+ "<div id='container'>"
			    			+ "<div class='container_wrap'><div class='board_complete'>"
			    			+ Obj.innerHTML
			    			+ "</div></div>"
			    			+ "</div>"
			    			+ "</div>"
			    			+ "\n</body></html>"
			    	);
			    }
			    else if(type == "front"){
			    	PrintPage.document.write("<html xmlns='http://www.w3.org/1999/xhtml'>" 
			    			+ "<head>"
			    			+ "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />"
			    			+ "<link rel='stylesheet' type='text/css' href='/public/stylesheets/import.css' />"
			    			+ "</head>"
			    			+ "<body>"	
			    			+ "<div id='contents' style='float:none;'><div class='contents'><div class='board_complete'>"
			    			+ Obj.innerHTML
			    			+ "</div></div></div>"
			    			+ "\n</body></html>"
			    	);
			    }
			    
			    PrintPage.document.close(); 
			    
			    PrintPage.document.title = "예약내역"; 
			    PrintPage.print(PrintPage.location.reload()); 
			},
			
			print:function(type){
				$.pagePrint(print_page,type);
				//window.top.print(); 
			},
			
			/* 룸 상세 페이지 연결 */
			linkroom:function(roomkey_room){
				//프리미엄 룸 이동
				if(roomkey_room.substr(0,4) == "AP01"){
					location.href="/guide/business/space?type=0";
				}
				//미팅룸 이동
				else if(roomkey_room.substr(0,4) == "AM01"){
					location.href="/guide/business/space?type=1";
				}
				//세미나룸 4인실 이동
				else if(roomkey_room.substr(0,4) == "AS01"){
					location.href="/guide/business/space?type=2";
				}
				//세미나룸 4~5인실 이동(S-3)
				else if(roomkey_room.substr(0,6) == "AS0201"){
					location.href="/guide/business/space?type=3";
				}
				//세미나룸 4~5인실 이동(S-4)
				else if(roomkey_room.substr(0,6) == "AS0202"){
					location.href="/guide/business/space?type=4";
				}
				//컨퍼런스룸 6~7인실 이동(C-1,C-2)
				else if(roomkey_room.substr(0,6) == "AC0101" || roomkey_room.substr(0,6) == "AC0102"){
					location.href="/guide/business/space?type=5";
				}
				//컨퍼런스룸  6~7인실 이동(C-3)
				else if(roomkey_room.substr(0,6) == "AC0103"){
					location.href="/guide/business/space?type=6";
				}
				//컨퍼런스룸 8인실 이동(C-4,C-5)
				else if(roomkey_room.substr(0,4) == "AC02"){
					location.href="/guide/business/space?type=7";
				}
				
				else if(roomkey_room == "BR0101" || roomkey_room == "BR0102" || roomkey_room == "BR0104"){
					location.href="/guide/soho/space?type=0";
				}
				else if(roomkey_room == "BR0103" || roomkey_room == "BR0105" || roomkey_room == "BR0106"){
					location.href="/guide/soho/space?type=1";
				}
				else if(roomkey_room == "BR0201" || roomkey_room == "BR0202"){
					location.href="/guide/soho/space?type=2";
				}
			}
				
		});
		
	});
});
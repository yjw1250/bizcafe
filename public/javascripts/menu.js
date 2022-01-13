$(document).ready(function() {

	$(function() {
				
		$.extend({
			
			//탑메뉴 마우스 오버,아웃시 투뎁스 메뉴 컨트롤(구분,오버아웃번호)
			topMenuOverOut: function(flag,seq) {
				var nSeq = (parseInt(seq) - 1);
				
				if(flag=='over'){
					$("#sub_depth>ul").removeClass("selectBox");
					if(nSeq>=0){$("#sub_depth>ul:eq("+nSeq+")").addClass("selectBox");}		
					$("#topMenu>li").removeClass("selected");			
					if(nSeq>=0){$("#topMenu>li:eq("+nSeq+")").addClass("selected");}
					
					$('.nav_visual').css('background-image','url(/public/images/common/nav-open_visual'+seq+'.png)');
					$('.nav_visual').css({opacity: 0.0}).animate({opacity: 1.0}, 500);	
					
				}else {		
					$("#sub_depth>ul").removeClass("selectBox");				
					$("#sub_depth>li:eq("+nSeq+")").removeClass("selectBox");
					$("#topMenu>li").removeClass("selected");		
					$("#topMenu>li:eq("+nSeq+")").removeClass("selected");
				}
			}			
		});		
		
		$("#menu01").bind("mouseenter", function(){$.topMenuOverOut('over','1');});
		$("#menu02").bind("mouseenter", function(){$.topMenuOverOut('over','2');});
		$("#menu03").bind("mouseenter", function(){$.topMenuOverOut('over','3');});		
		$("#menu04").bind("mouseenter", function(){$.topMenuOverOut('over','4');});		
		$("#menu05").bind("mouseenter", function(){$.topMenuOverOut('over','5');});				
		$("#menu01").bind("mouseleave", function(){$.topMenuOverOut('out','1');});
		$("#menu02").bind("mouseleave", function(){$.topMenuOverOut('out','2');});
		$("#menu03").bind("mouseleave", function(){$.topMenuOverOut('out','3');});		
		$("#menu04").bind("mouseleave", function(){$.topMenuOverOut('out','4');});		
		$("#menu05").bind("mouseleave", function(){$.topMenuOverOut('out','5');});

		$("#sub_depth_1").bind("mouseenter", function(){$.topMenuOverOut('over','1');});
		$("#sub_depth_2").bind("mouseenter", function(){$.topMenuOverOut('over','2');});
		$("#sub_depth_3").bind("mouseenter", function(){$.topMenuOverOut('over','3');});		
		$("#sub_depth_4").bind("mouseenter", function(){$.topMenuOverOut('over','4');});		
		$("#sub_depth_5").bind("mouseenter", function(){$.topMenuOverOut('over','5');});				
		$("#sub_depth_1").bind("mouseleave", function(){$.topMenuOverOut('out','1');});
		$("#sub_depth_2").bind("mouseleave", function(){$.topMenuOverOut('out','2');});
		$("#sub_depth_3").bind("mouseleave", function(){$.topMenuOverOut('out','3');});		
		$("#sub_depth_4").bind("mouseleave", function(){$.topMenuOverOut('out','4');});		
		$("#sub_depth_5").bind("mouseleave", function(){$.topMenuOverOut('out','5');});		
				
		
		
		var menuNum = $("#menuNum").val();
		var topMenu,subMenu1,subMenu2,subMenuSeq1,subMenuSeq2;
		
		if (menuNum != undefined && menuNum !="" ){
			topMenu = menuNum.substring(0,1);
			subMenu1 = menuNum.substring(1,2);
			subMenu2 = menuNum.substring(2,3);
			subMenuSeq1 = parseInt(subMenu1)-1;
			subMenuSeq2 = parseInt(subMenu2)-1;	
			
			$("#submenu0"+topMenu+">ul>li").removeClass("selected");			
			if(subMenuSeq1>=0){$("#submenu0"+topMenu+">ul>li:eq("+subMenuSeq1+")").addClass("selected");}
			if(subMenuSeq2>=0){
				$("#snb_2deth"+topMenu+subMenu1+">ul>li").removeClass("selected");			
				$("#snb_2deth"+topMenu+subMenu1+">ul>li:eq("+subMenuSeq2+")").addClass("selected");
			}				
		}
		
		if (topMenu == "1") {
			$("#container_wrap").addClass("introduce");
			$("#submenu01").show();	
		} else if (topMenu == "2") {
			$("#container_wrap").addClass("guide");
			$("#submenu02").show();
			if(subMenu1 == "1"){
				$("#snb_2deth21").show();
			}else if(subMenu1 == "2"){
				$("#snb_2deth22").show();				
			}
		} else if (topMenu == "3") {
			$("#container_wrap").addClass("booking");
			$("#submenu03").show();
			if(subMenu1 == "4"){
				$("#snb_2deth34").show();
			}			
		} else if (topMenu == "4" ) {
			$("#container_wrap").addClass("cs");
			$("#submenu04").show();
		} else if (topMenu == "5") {
			$("#container_wrap").addClass("gallery");
			$("#submenu05").show();
		} else if (topMenu == "6") {
			$("#container_wrap").addClass("terms");
			$("#submenu06").show();
		} else if (topMenu == "7") {
			$("#container_wrap").addClass("member");
		}
			
	});
});




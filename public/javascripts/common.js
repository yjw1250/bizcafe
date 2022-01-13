function setPng24(obj) { 
    obj.width=obj.height=1; 
    obj.className=obj.className.replace(/\bpng24\b/i,''); 
    obj.style.filter = 
    "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ obj.src 

+"',sizingMethod='image');" 
    obj.src='';  
    return ''; 
} 

function svcMenu(xFlag, xSeq) {
    if (xFlag == 'over') {
        document.getElementById('svc_2depth').style.display = 'block';
    }else{
        document.getElementById('svc_2depth').style.display = 'none';
    }
}

// 이미지 링크 점선테두리 없애기
function autoBlur(){
  if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG")
  document.body.focus();
}
document.onfocusin=autoBlur;



$(function(){
// nav
	$('.nav').mouseover(function(){
		$('.nav-open-wrap').show();
		//$('.nav').css('background-image','url(../images/common/bg_nav-on2.png)');
	});
	$('#header').mouseleave(function(){
		//$('.nav').css('background-image','url(../images/common/bg_nav-off2.png)');
		$('.nav-open-wrap').hide();
	});
	
});

//Tab Content
function initTabMenu(tabContainerID) {
	var tabContainer = document.getElementById(tabContainerID);
	var tabAnchor = tabContainer.getElementsByTagName('a');
	var current;

	for(i = 0, cnt = tabAnchor.length; i < cnt; i++) {
		tabAnchor.item(i).onclick = function () {
			this.targetEl = document.getElementById(this.href.split('#')[1]);
			this.imgEl = this.getElementsByTagName('img').item(0);

			if (this == current) {
				return false;
			}

			if (current) {
				current.targetEl.style.display = 'none';
				if (current.imgEl) {
					current.imgEl.src = current.imgEl.src.replace('_on.gif', '.gif');
				} else {
					current.className = current.className.replace(' on', '');
				}
			}
			this.targetEl.style.display = 'block';
			if (this.imgEl) {
				this.imgEl.src = this.imgEl.src.replace('.gif', '_on.gif');
			} else {
				this.className += ' on';
			}
			current = this;

			return false;
		};
	}
	tabAnchor.item(0).onclick();
}

function writeEmail(id, hostType) {
	var hostType = "";
	switch(hostType) {
		case "jei":
			host = "jei.com";
			break;
		case "naver":
			host = "naver.com";
			break;
		default:
			host = "bizstudio.co.kr";
			break;
	}
	document.write("<a hre" + "f=ma" + "ilto:" + id + "@" + host + ">" + id + "@" + host + "</a>"); 
}

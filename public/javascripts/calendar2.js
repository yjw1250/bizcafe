/*
Calendar for GNUBOARD.
2009-02-20 Han, Su-young.
*/

var CALENDAR_EVENT ; //CALENDAR_EVENT = 1 상시업무에서 사용함.
if (typeof(CALENDAR_JS) == 'undefined') // 한번만 실행
{
	var CALENDAR_JS = true;
//    if (typeof g4_path == 'undefined')
//        alert('g4_path 변수가 선언되지 않았습니다. js/calendar.js');

	var Cal_Today = new Date();
	var Cal_Year = Cur_Year = parseInt(Cal_Today.getFullYear());
	var Cal_Month = Cur_Month = parseInt(Cal_Today.getMonth()) + 1;

	var Cal_Date = Cur_Date = parseInt(Cal_Today.getDate());
	var Fld_Obj;
/* 달력 환경설정 */
	function Calendar_Config(type){
		//날짜 셀의 크기지정 가로, 세로
		var cell = new Array(25, 21);
		//요일타이틀 색깔지정 혹은 이미지 대체 (일, 월, 화, 수, 목, 금, 토) 순으로
		var yoil = new Array("<img src='/public/images/calendar/cal_0.jpg'>","<img src='/public/images/calendar/cal_1.jpg'>","<img src='/public/images/calendar/cal_2.jpg'>","<img src='/public/images/calendar/cal_3.jpg'>","<img src='/public/images/calendar/cal_4.jpg'>","<img src='/public/images/calendar/cal_5.jpg'>","<img src='/public/images/calendar/cal_6.jpg'>");
		//날짜 색깔지정 (일, 월, 화, 수, 목, 금, 토) 순으로
		var yoil_color = new Array("#CC0000", "#000000", "#000000", "#000000", "#000000", "#000000", "#0000CC");
		//오늘 날짜 색깔 및 배경지정 (스타일태그시작, 종료,스타일(배경등))
		var today = new Array("<b style='color:#006600'>", "</b>", "background: url() no-repeat; background-position:2 0;");
		//마우스 오버 색깔
		var over = '#E1E1E1';
		//달력 이동 버튼들
		var move = new Array("<img src='/public/images/calendar/month_prev.gif' border=0><img src='/public/images/calendar/month_prev.gif' border=0>", "<img src='/public/images/calendar/month_prev.gif' border=0>", "<img src='/public/images/calendar/month_next.gif' border=0>", "<img src='/public/images/calendar/month_next.gif' border=0><img src='/public/images/calendar/month_next.gif' border=0>");
		//분리문자 2009-01-01
		var sp = "-";
		return eval(type);
	}
/* 달력 초기화 및 삭제 */
	function Calendar_Reset(){
		Fld_Obj = null;
		Cal_Year = parseInt(Cal_Today.getFullYear());
		Cal_Month = parseInt(Cal_Today.getMonth()) + 1;
		Cal_Date = parseInt(Cal_Today.getDate());
		var Cal_Div = document.getElementById('Calendar_Div');
		Cal_Div.parentNode.removeChild(Cal_Div);
		selectBoxVisible();
	}
/* 달력 초기세팅 및 출력 */
	function Calendar_Create(id, move){
		if(id){
			Fld_Obj = document.getElementById(id);
		}
		if((Fld_Obj.value && Fld_Obj.value != ('0000' + Calendar_Config('sp') + '00' + Calendar_Config('sp') + '00')) && !move){
			var tmp = Fld_Obj.value.split(Calendar_Config('sp'));
			Cal_Year = parseInt(tmp[0]);
			Cal_Month = parseInt(tmp[1],10);
		} else if(!move){
			Cal_Year = parseInt(Cal_Today.getFullYear());
			Cal_Month = parseInt(Cal_Today.getMonth())+1;
		}
		
		Cal_Date = 1;
		Cal_Time = new Date(Cal_Year, Cal_Month, 1);
		Start_Date = new Date(Cal_Year, Cal_Month-1, 1).getDay();
		Last_Date = Calendar_LastDate(Cal_Year, Cal_Month);

		Calendar_Display(Start_Date, Last_Date);
	}
/* 인풋박스의 위치값 */
	function Calendar_Get_XY(fld){
		var Fld_Element = new Object();
		var obj = fld.getBoundingClientRect();
		Fld_Element.left = obj.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
		Fld_Element.top = obj.top + (document.documentElement.scrollTop || document.body.scrollTop);
		Fld_Element.height = obj.bottom - obj.top;
		var XY = new Array(Fld_Element.left, Fld_Element.top, Fld_Element.height);
		return XY;
	}
/* 달력 마지막 일자 계산 */
	function Calendar_LastDate(year, month){
		var dateCount = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

		if( (year%400 == 0) || ((year%4 == 0) && (year % 100 != 0)) ) {
			dateCount[1] = 29;
		}
		return dateCount[Number(month)-1];
	}
/* 년 +, - 이동 */
	function Calendar_Move_Year(num){
		Cal_Year += num;
		Calendar_Create("", true);
	}
/* 월 +, - 이동 */
	function Calendar_Move_Month(num){
		Cal_Month += num;
		if(Cal_Month < 1) { Cal_Year--; Cal_Month = 12; }
		if(Cal_Month > 12) { Cal_Year++; Cal_Month = 1; }
		Calendar_Create("", true);
	}
/* 년월 동시 이동 */
	function Calendar_Move_All(year, month){
		if(year) Cal_Year = parseInt(year);
		if(month) Cal_Month = parseInt(month);
		Calendar_Create("", true);
	}
/* 달력 실제 출력부 */
	function Calendar_Display(sd, ld){				
		if(!document.getElementById('Calendar_Div')){ 
			//생성된 레이어가 없다면 레이어 생성 
			if(document.layers){ // isNS4 
				document.layers['Calendar_Div'] = new Layer(1); 				
			} else if (document.all){ // isIE 
				document.body.insertAdjacentHTML("BeforeEnd","<DIV ID='Calendar_Div' style='z-index:1000'></DIV>");				
			} else { // etc 
				Make_Div = document.createElement('div'); 
				Make_Div.setAttribute("id", "Calendar_Div"); 
				document.body.appendChild(Make_Div);				
			} 			
		} 

		var Cal_Div = document.getElementById('Calendar_Div');
		var XY = Calendar_Get_XY(Fld_Obj); //위치값 계산
		//환경설정 값 읽어옴
		var disp_date = 1; //날짜출력
		var disp_yoil = 0; //요일출력
		var yoil = Calendar_Config('yoil'); //요일타이틀
		var yoil_color = Calendar_Config('yoil_color'); //요일별 날짜색상
		var today_style = Calendar_Config('today'); //오늘표기
		var button = Calendar_Config('move'); //버튼
		var size = Calendar_Config('cell'); //셀크기
		var div_width = size[0] * 7 + 10; //레이어 크기계산
		var sel_year = "";  //셀렉트박스
		var sel_month = ""; //셀렉트박스

		with(Cal_Div.style){
			position = 'absolute';
			width =  div_width +'px';
			backgroundColor = '#e1e1e1';
			left = (XY[0] - 2) + 'px';
			top = (XY[1] + XY[2] - 2) + 'px';
			padding = '5px';
			display = 'block';
		}
		selectBoxHidden('Calendar_Div');

		var In_HTML = "";
		var disp_y = Cal_Year + "년";
		var disp_m = Cal_Month < 10 ? "0"+Cal_Month+"월" : Cal_Month+"월";
		In_HTML += "<table border=0 width=100% cellpadding=0 cellspacing=0 bgcolor='#FFFFFF'>\n"
				+  "<tr align=center height=30><td colspan=7>"
				+  "<a href='javascript:Calendar_Move_Year(-1);'>" + button[0] + "</a> "
				+  "<a href='javascript:Calendar_Move_Month(-1);'>" + button[1] + "</a>"
				+  "&nbsp;&nbsp;&nbsp;<b>" + disp_y + " " + disp_m + "</b>&nbsp;&nbsp;&nbsp;"
				+  "<a href='javascript:Calendar_Move_Month(1);'>" + button[2] + "</a> "
				+  "<a href='javascript:Calendar_Move_Year(1);'>" + button[3] + "</a></td></tr>\n"
				+  "<tr><td colspan='7' bgcolor='e1e1e1'></td></tr>"
				+  "<tr align=center height=22>";
		//요일출력
		for(var i=0; i<yoil.length; i++){
			In_HTML += "<td>" + yoil[i] + "</td>";
		}
		In_HTML += "</tr>\n"
				+  "<tr><td colspan='7' bgcolor='e1e1e1'></td></tr>";
		//날짜출력
		for(var i=0; i<ld+sd; i++){
			if(disp_yoil > 6) disp_yoil = 0;

			if(i == 0) In_HTML += "\n<tr height="+size[1]+">";
			if(i>0 && i%7 == 0){
				if(i%7 == 0) In_HTML += "\n</tr>\n<tr height="+size[1]+">\n";
			}
			if(i < sd) {
				In_HTML += "<td>&nbsp;</td>";
			} else if(Cal_Year == Cur_Year && Cal_Month == Cur_Month && disp_date == Cur_Date){
				In_HTML += "<td align=center style=\"cursor:pointer;";
				if(today_style[2]) In_HTML += " " + today_style[2];
				In_HTML += "\" onclick='Calendar_SetValue(" + disp_date + ");'>" + today_style[0] + disp_date + today_style[1] + "</td>";
				disp_date++;
			} else {
				In_HTML += "<td align=center style=\"cursor:pointer;\" onclick='Calendar_SetValue(" + disp_date + ");' onmouseover=\"Calendar_ChangeBG(this, 'set');\" onmouseout=\"Calendar_ChangeBG(this, 'unset');\"><font color='" + yoil_color[disp_yoil] + "'>" + disp_date + "</font></td>";
				disp_date++;
			}
			disp_yoil++;
		}
		//빈칸 메꾸기
		if(disp_yoil < 7){
			for(var i=disp_yoil; i<7; i++){
				In_HTML += "<td>&nbsp;</td>";
			}
		}
		if(Cal_Year + 10 > Cur_Year){
			start_year = Cal_Year + 10 ;
		//	end_year = Cal_Year - 10;
		//	start_year = 2009;
			end_year = 1900;
		} else if(Cal_Year + 10 < Cur_Year){
			start_year = Cur_Year;
		//	end_year = Cal_Year - 10;
		//	start_year = 2009;
			end_year =1900;
		} else{
		//	start_year = 2009;
			end_year = 1900;
			//end_year = Cur_year - 10;
			start_year = Cur_Year + 10;
		}
		for(i=start_year; i>end_year; i--){
			sel_year += "<option value='" + i + "'" + (i == Cal_Year ? ' selected' : '') + ">" + i + "년</option>";
		}
		for(i=1; i<=12; i++){
			sel_month += "<option value='" + i + "'" + (i == Cal_Month ? ' selected' : '') + ">" + (i < 10 ? '0'+i : i) + "월</option>";
		}
		In_HTML += "\n</tr>"
				+  "<tr><td colspan='7' bgcolor='e1e1e1'></td></tr>"
				+  "<tr><td colspan=3 align=left style='padding:3 3;'><a href='javascript:Calendar_Sub_Layer();'>[빠른이동]</a></td>"
				+  "<td colspan=4 align=right style='padding:3 3;'><a href='javascript:Calendar_Move_All("+Cur_Year+", "+Cur_Month+")'>[오늘]</a> <a href='javascript:Calendar_Reset();'>[닫기]</a></td></tr>"
				+  "<tr><td colspan='7' align=center>"
				+  "<table border=0 cellpadding=0 cellspacing=0 id='Cal_Quick_Move' style='display:none;padding:3 3;'><tr><td align=center>"
				+  "<select onchange=\"Calendar_Move_All(this.value,'');\">"+sel_year+"</select>&nbsp;&nbsp;<select onchange=\"Calendar_Move_All('',this.value);\">"+sel_month+"</select>"
				+  "</td></tr></table>"
				+  "</td></tr>"
				+  "</table>";

		Cal_Div.innerHTML = In_HTML;
		
	}
/* 날짜클릭으로 인풋박스에 값 넣기 */
	function Calendar_SetValue(date){
		
		var sp = Calendar_Config('sp');
		Fld_Obj.value = Cal_Year + sp + (Cal_Month < 10 ? '0'+Cal_Month : Cal_Month) + sp + (date < 10 ? '0'+date : date);
		
		if (CALENDAR_EVENT == 1) {//  상시업무에서 새로운 항목에 값을 대입 시킨다.
			check_day();
		}
		if(CALENDAR_EVENT == 2){// 추가 이벤트가 필요한 경우
			calendar_app_fun();
		}
		Calendar_Reset();
	}
/* [오늘] 을 클릭했을시 달력이 사라지면서 오늘날짜를 바로 넣기 */
	function Calendar_SetToday(){
		Cal_Year = Cur_Year;
		Cal_Month = Cur_Month;
		Calendar_SetValue(Cur_Date);
	}
/* 날짜에 마우스 오버시 배경색 변경 */
	function Calendar_ChangeBG(obj, type){
		if(type == 'set'){
			obj.style.backgroundColor = Calendar_Config('over');
		} else {
			obj.style.backgroundColor = '';
		}
	}
/* 빠른이동시 보여지는 레이어 컨트롤 */
	function Calendar_Sub_Layer(id){
		if(!id)
			id = 'Cal_Quick_Move';
		document.getElementById(id).style.display = 'inline';
	}	
	
	
	
	
	
    // Internet Explorer에서 셀렉트박스와 레이어가 겹칠시 레이어가 셀렉트 박스 뒤로 숨는 현상을 해결하는 함수
    // 레이어가 셀렉트 박스를 침범하면 셀렉트 박스를 hidden 시킴
    // <div id=LayerID style="display:none; position:absolute;" onpropertychange="selectBoxHidden('LayerID')">
    function selectBoxHidden(layer_id) 
    {
        //var ly = eval(layer_id);
        var ly = document.getElementById(layer_id);

        // 레이어 좌표
        var ly_left   = ly.offsetLeft;
        var ly_top    = ly.offsetTop;
        var ly_right  = ly.offsetLeft + ly.offsetWidth;
        var ly_bottom = ly.offsetTop + ly.offsetHeight;

        // 셀렉트박스의 좌표
        var el;

        for (i=0; i<document.forms.length; i++) {
            for (k=0; k<document.forms[i].length; k++) {
                el = document.forms[i].elements[k];    
                if (el.type == "select-one") {
                    var el_left = el_top = 0;
                    var obj = el;
                    if (obj.offsetParent) {
                        while (obj.offsetParent) {
                            el_left += obj.offsetLeft;
                            el_top  += obj.offsetTop;
                            obj = obj.offsetParent;
                        }
                    }
                    el_left   += el.clientLeft;
                    el_top    += el.clientTop;
                    el_right  = el_left + el.clientWidth;
                    el_bottom = el_top + el.clientHeight;

                    // 좌표를 따져 레이어가 셀렉트 박스를 침범했으면 셀렉트 박스를 hidden 시킴
                    if ( (el_left >= ly_left && el_top >= ly_top && el_left <= ly_right && el_top <= ly_bottom) || 
                         (el_right >= ly_left && el_right <= ly_right && el_top >= ly_top && el_top <= ly_bottom) ||
                         (el_left >= ly_left && el_bottom >= ly_top && el_right <= ly_right && el_bottom <= ly_bottom) ||
                         (el_left >= ly_left && el_left <= ly_right && el_bottom >= ly_top && el_bottom <= ly_bottom) ||
                         (el_top <= ly_bottom && el_left <= ly_left && el_right >= ly_right)
                        )
                        el.style.visibility = 'hidden';
                }
            }
        }
    }

    // 감추어진 셀렉트 박스를 모두 보이게 함
    function selectBoxVisible() 
    {
        for (i=0; i<document.forms.length; i++) 
        {
            for (k=0; k<document.forms[i].length; k++) 
            {
                el = document.forms[i].elements[k];    
                if (el.type == "select-one" && el.style.visibility == 'hidden')
                    el.style.visibility = 'visible';
            }
        }
    }
	
}
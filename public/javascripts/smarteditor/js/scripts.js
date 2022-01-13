<!--
  function bluring(){
    if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG") document.body.focus();
  }
  document.onfocusin=bluring;

  var favoriteurl = "http://www.webjjang.net";
  var favoritetitle = "웹짱닷넷";
  function addfavorites(){
    if (document.all)
    window.external.AddFavorite(favoriteurl,favoritetitle)
  }

  function not_login(rtn_page){
    var msg = "로그인이 필요한 서비스입니다."
    if(confirm(msg)){
      document.location.href = "/member/login.asp?rtn_page=" + rtn_page;
    }else{
      return;
    }
  }

  function goBoard(board_link,bc_seq,method,page,b_seq,search_key,search_word){
    document.location.href = board_link + "?bc_seq=" + bc_seq + "&method=" + method + "&page=" + page + "&b_seq=" + b_seq + "&search_key=" + search_key + "&search_word=" + search_word;
  }

  function win_open(winname,strlink,width,height,scroll){
    window.open(strlink,winname,'width=' + width + ',height=' + height + ',scrollbars=' + scroll + ',resizable=no');
    return;
  }

  //이미지 보기
  function openImage(img){
    img_conf1= new Image();
    img_conf1.src=(img);
    img_view_conf(img);
  }

  function img_view_conf(img){
    if((img_conf1.width!=0)&&(img_conf1.height!=0)){
      img_view_img(img);
    }else{
      funzione="img_view_conf('"+img+"')";
      intervallo=setTimeout(funzione,20);
    }
  }

  var img_view = null;
  function img_view_img(img){
    if(img_view != null){
      if(!img_view.closed){
        img_view.close();
      }
    }

    img_width=img_conf1.width+6;
    img_height=img_conf1.height+6;

    if(img_height > screen.height - 80){
      img_height = screen.height - 80;
      img_width = img_width + 16;
      str_img = "width="+img_width+",height="+img_height+",scrollbars=1";
    }else{
      str_img = "width="+img_width+",height="+img_height;
    }

    img_view=window.open("about:blank","",str_img);
    img_view.document.open(); // document.open()
    img_view.document.writeln("<html>");
    img_view.document.writeln("<head>");
    img_view.document.writeln("<title>이미지보기</title>");
    img_view.document.writeln("<meta http-equiv='content-type' content='text/html; charset=euc-kr'>");
    img_view.document.writeln("<meta http-equiv='imagetoolbar' content='no'>");
    var start="<";
//    img_view.document.writeln("<script language='javascript'>");
//    img_view.document.writeln("function click() {");
//    img_view.document.writeln("if ((event.button==1) || (event.button==2)) {");
//    img_view.document.writeln("top.close();");
//    img_view.document.writeln(" }");
//    img_view.document.writeln("}");
//    img_view.document.writeln("document.onmousedown=click");
//    img_view.document.writeln(start+"/script>");
    img_view.document.writeln("</head>");
    img_view.document.writeln("<body style='margin:3px;'>");
    img_view.document.writeln("<center><img src="+ img +" border=0 style='cursor:hand' onclick='top.close();'></center>") // 소스 테스트 부분
    img_view.document.writeln("</body></html>");
    img_view.document.close(); // 반드시 document.close() 닫아주어야 함
    img_view.focus();
    return;
  }

  /*** 부모 iframe 사이즈 변경하는  function */
  function resizeParentIframe(iframeObj, w, h){
    if(iframeObj) {
      iframeObj.width=w;
      iframeObj.height=h;
    }
  }

  // 기본 스크립트
  function chkNull(obj, msg){
    if(obj.value.split(" ").join("") == ""){
      alert(msg);
      if(obj.type != "hidden"){
        obj.focus();
      }
      return false;
    }else{
      return true;
    }
  }

  function chkLen(obj, minSize, maxSize, msg){
    if(minSize > maxSize){
      alert(obj.name + '에 대한 길이 체크에 잘못된 범위를 사용했습니다.');
      return false;
    }

    var objval_len = obj.value.length;
    var temp;

    for(i = 0; i < objval_len; i++){
      temp = obj.value.charAt(i);
      if(escape(temp).length > 4)
      objval_len++;
    }

    if((objval_len < minSize) || (objval_len > maxSize)){
      alert(msg);
      obj.focus();
      return false;
    }else{
      return true;
    }
  }

  function chkByte(obj, minSize, maxSize, msg){
    var curText;
    var strLen;
    var byteIs;
    var lastByte;
    var thisChar;
    var escChar;
    var curTotalMsg;
    var okMsg;

    curText = new String(obj.value);
    strLen = curText.length;
    byteIs = 0;

    for(i=0; i<strLen; i++) {
      thisChar = curText.charAt(i);
      escChar = escape(thisChar);

      // ´,¨, ¸ : 2byte 임에도 브라우져에서 1byte로 계산
      if(thisChar == "´" || thisChar == "¨" || thisChar == "¸" || thisChar == "§" ){
        byteIs++;
      }

      if (escChar.length > 4) {
        byteIs += 2;  //특수문자 한글인 경우.
      }else if(thisChar != '\r') {  //개행을 제외한 이외의 경우
        byteIs += 1;
      }

      lastByte = byteIs;
    }

    if((byteIs < minSize) || (byteIs > maxSize)){
      alert(msg);
//      obj.focus();
      return false;
    }else{
      return true;
    }
  }

  function number_validate(theForm){
    if(theForm.value != ""){
      var str=theForm.value;
      for(var i = 0; i< str.length; i++){
        var ch = str.substring(i, i + 1);
        if((ch<"0" || ch>"9")){
          alert("숫자 만을 입력할수 있읍니다.");
          tye = 1;
          theForm.value="";
          theForm.focus();
          return false;
        }else{
          tye=0;
        }
      }
    }else{
      tye=0;
    }
    return true;
  }

  function chkCheck(obj, msg){
    var cnt = 0;
    if(obj.length > 1){
      for(var i = 0; i < obj.length; i++){
        if(obj[i].checked){
          cnt++;
        }
      }
    }else{
      if(obj.checked){
        cnt++;
      }
    }

    if(cnt == 0){
      alert(msg);
//      obj.focus();
      return false;
    }else{
      return true;
    }
  }

  function chkRadio(obj, msg){
    var rchk = "0";
    if(obj.length > 1){
      for(var i = 0; i < obj.length; i++){
        if(obj[i].checked){
          rchk = "1";
          break;
        }
      }
    }else{
      if(obj.checked){
        rchk = "1";
      }
    }

    if(rchk == "0"){
      alert(msg);
      return false;
    }else{
      return true;
    }
  }

  function chkEmail(obj){
    var val = obj.value;

    if(val != ""){
      if(val.indexOf(" ") != -1){
        alert("공백허용 되지 않습니다.");
        obj.focus();
        return false;
      }
      if(val.indexOf("@") < 1){
        alert("'@' 누락되었습니다.");
        obj.focus();
        return false;
      }
      if(val.indexOf(".") == -1){
        alert("'.' 누락되었습니다.");
        obj.focus();
        return false;
      }
      if(val.indexOf(".") - val.indexOf("@") == 1){
        alert("'@' 다음에 바로 '.'이 올 수 없습니다.");
        obj.focus();
        return false;
      }
      if(val.charAt(val.length-1) == '.'){
        alert("'.'은 EMAIL주소 끝에 올 수 없습니다.");
        obj.focus();
        return false;
      }
      if(val.charAt(val.length-1) == '@'){
        alert("'@'은 EMAIL주소 끝에 올 수 없습니다.");
        obj.focus();
        return false;
      }
    }

    return true;
  }

  //영문+숫자 체크
  function isAlphanumeric(s){
    var i;
    if (isEmpty(s))
      if (isAlphanumeric.arguments.length == 1) return defaultEmptyOK;
      else return (isAlphanumeric.arguments[1] == true);

    for (i = 0; i < s.length; i++) {
      var c = s.charAt(i);

    if (!(isLetter(c) || isDigit(c)))
      return false;
    }
    return true;
  }

  function isDigit(c){
    return ((c >= "0") && (c <= "9"))
  }
  function isEmpty(s){
    return ((s == null) || (s.length == 0))
  }
  function isLetter(c){
    return ( ((c >= "a") && (c <= "z")) || ((c >= "A") && (c <= "Z")) || c=="_")
  }

  // SET_VALUE
  function set_value(object, value){
    if(object!='[object]'||object=='undefined') return
    if(object.type=='hidden' || object.type=='text' || object.type=='password' || object.type=='textarea'){
      object.value=value
    }else if(object.type=='checkbox'){
      if(object.value.toUpperCase()==value.toUpperCase()) object.checked = true
    }else if(!isNaN(object.length)){
      for(i=0; i<object.length; i++){
        if(object(i).value.toUpperCase()==value.toUpperCase()){
          if(object.type=='select-one') object.value=value
          if(object(0).type=='radio') object(i).checked = true
        }
      }
    }
  }

  // 체크박스 배열로체크
  function set_checkarr(object, value){
    if(object!='[object]'||object=='undefined') return;

    var vcnt = value.indexOf(",");

    if(vcnt < 1){
      set_checkbox(object, value);
    }else{
      var szvalue = value.split(",");

      for(var i = 0; i < szvalue.length; i++){
        set_checkbox(object, szvalue[i]);
      }
    }
  }

  // 체크박스체크
  function set_checkbox(object, value){
    if(object!='[object]'||object=='undefined') return;

    if(object.length > 1){
      for(var i = 0; i < object.length; i++){
        if(object[i].value.toUpperCase() == value.toUpperCase()) object[i].checked = true;
      }
    }else{
      if(object.value.toUpperCase() == value.toUpperCase()) object.checked = true;
    }
  }

  // 콤마 나누는 부분
  function commaSplit(srcNumber){
    var txtNumber = '' + srcNumber;
    var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
    var arrNumber = txtNumber.split('.');
    arrNumber[0] += '.';

    do{
      arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
    }
    while(rxSplit.test(arrNumber[0]));

    if(arrNumber.length > 1){
      return arrNumber.join('');
    }else{
      return arrNumber[0].split('.')[0];
    }
  }

  function f_comma(str_number) {
    var t_align = "right"; // 텍스트 필드 정렬
    var t_num = str_number.value.substring(0,1); // 첫글자 확인 변수
    var num = /^[/,/,0,1,2,3,4,5,6,7,8,9,/]/; // 숫자와 , 만 가능
    var cnjValue = "";
    var cnjValue2 = "";
    if(!num.test(str_number.value)) {
      alert('숫자만 입력하십시오.');
      str_number.value="";
      str_number.focus();
      return false;
    }

    if ((t_num < "0" || "9" < t_num)){
      alert("숫자만 입력하십시오.");
      str_number.value="";
      str_number.focus();
      return false;
    }

    for(i=0; i<str_number.value.length; i++) {
      if(str_number.value.charAt(str_number.value.length - i -1) != ",") {
        cnjValue2 = str_number.value.charAt(str_number.value.length - i -1) + cnjValue2;
      }
    }

    for(i=0; i<cnjValue2.length; i++) {
      if(i > 0 && (i%3)==0) {
        cnjValue = cnjValue2.charAt(cnjValue2.length - i -1) + "," + cnjValue;
      } else {
        cnjValue = cnjValue2.charAt(cnjValue2.length - i -1) + cnjValue;
      }
    }

    str_number.value = cnjValue;
    str_number.style.textAlign = t_align;
  }

  //주민번호체크
  function chkRegNo(RegNo1,RegNo2){
    var chk =0;
    var yy = RegNo1.value.substring(0,2);
    var mm = RegNo1.value.substring(2,4);
    var dd = RegNo2.value.substring(4,6);
    var sex = RegNo2.value.substring(0,1);

    if ((RegNo1.value.length!=6)||(mm <1||mm>12||dd<1)){
      RegNo1.value = ""
      alert ('주민등록번호 앞자리가 잘못되었습니다.');
      RegNo1.focus();
      return false;
    }

    if ((sex != 1 && sex !=2 )||(RegNo2.value.length != 7 )){
      RegNo2.value = ""
      alert('주민등록번호 뒷자리가 잘못되었습니다.');
      RegNo2.focus();
      return false;
    }

    for(var i = 0; i <=5 ; i++){
      chk = chk + ((i%8+2) * parseInt(RegNo1.value.substring(i,i+1)))
    }

    for(var i = 6; i <=11 ; i++){
      chk = chk + ((i%8+2) * parseInt(RegNo2.value.substring(i-6,i-5)))
    }

    chk = 11 - (chk %11)
    chk = chk % 10
    if (chk != RegNo2.value.substring(6,7)){
      RegNo1.value = ""
      RegNo2.value = ""
      alert ('형식에 맞지 않는 주민등록번호입니다.');
      RegNo1.focus();
      return false;
    }
    return true;
  }

  // 사업자번호 체크 로직
  // - 포함한 값
  function chkCorpNo(resno){
    var fmt = /^\d{3}-\d{2}-\d{5}$/;
    if(!fmt.test(resno)){
      alert("올바르지 않은 사업자번호입니다");
      return false;
    }

    buf = new Array(10);
    for(i=0;i<3;i++){
      buf[i] = parseInt(resno.charAt(i));
    }

    for(i=3;i<5;i++){
      buf[i] = parseInt(resno.charAt(i+1));
    }

    for(i=5;i<10;i++){
      buf[i] = parseInt(resno.charAt(i+2));
    }

    multipliers = [1,3,7,1,3,7,1,3,5,1];
      for(i=0,sum=0;i<10;i++){
      if(i==0 || i==9){
        sum += (buf[i] * multipliers[i]);
      }else{
        sum += (buf[i] * multipliers[i]%10);
        if(i == 8){
          sum += Math.floor(buf[i] * multipliers[i]/10);
        }
      }
    }

    if(sum % 10 != 0){
      alert( '올바르지 않은 사업자번호입니다' );
      return false;
    }
    return true;
  }

  // 문자열 공백제거
  function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }

  //롤오버이미지
  function MM_swapImgRestore() { //v3.0
    var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
  }

  function MM_preloadImages() { //v3.0
    var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
      var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
      if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
  }

  function MM_findObj(n, d) { //v4.01
    var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
      d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
    if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
    for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
    if(!x && d.getElementById) x=d.getElementById(n); return x;
  }

  function MM_swapImage() { //v3.0
    var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
     if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
  }

  //플레쉬등 라인없애기
  function ObjectEmbed(str){
    document.write(str);
  }

  function flash(url,w,h,bg,wmode,vars){
    var s=
    "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='"+w+"' height='"+h+"' align='middle'>"+
    "<param name='movie' value='"+url+"' />"+
    "<param name='wmode' value='"+wmode+"' />"+
    "<param name='quality' value='high' />"+
    "<param name='flashvars' value='"+vars+"' />"+
    "<param name='bgcolor' value='"+bg+"' />"+
    "<embed src='"+url+"' quality='high' wmode='"+wmode+"' bgcolor='"+bg+"' width='"+w+"' height='"+h+"' align='middle' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' />"+
    "</object>";
    document.write(s);
  }

  //퀵메뉴 이동
  function scrollLayer(p_obj_name, p_gap_point){
    var start_point, end_point, timer;
    var obj_layer  = document.getElementById(p_obj_name);  // 레이어 오브젝트
    start_point = parseInt(obj_layer.style.top, 10);
    if(start_point < p_gap_point) start_point = p_gap_point;
    end_point = document.body.scrollTop + p_gap_point;
    limit_point = parseInt(window.document.body.scrollHeight) - parseInt(obj_layer.offsetHeight) -10;
    if(end_point > limit_point) end_point = limit_point;

    if(start_point != end_point){
      scroll_amount = Math.ceil(Math.abs(end_point - start_point) / 15);
      obj_layer.style.top = parseInt(start_point, 10) + ((end_point < start_point) ? -scroll_amount : scroll_amount);
    }

    timer = window.setTimeout("scrollLayer('" + p_obj_name + "', " + p_gap_point + ");", 1);
  }

  function _ID(obj){return document.getElementById(obj)}

  function getTargetElement(evt){
    if ( evt.srcElement ) return target_Element = evt.srcElement; // 익스
    else return target_Element = evt.target; // 익스외
  }

  function inArray( needle, haystack ){
    for ( i = 0; i < haystack.length; i++ )
      if ( haystack[i] == needle ) return true;
    return false;
  }

  /* 브라우저별 이벤트 처리*/
  function addEvent(obj, evType, fn){
    if (obj.addEventListener) {
      obj.addEventListener(evType, fn, false);
      return true;
    } else if (obj.attachEvent) {
      var r = obj.attachEvent("on"+evType, fn);
      return r;
    } else {
      return false;
    }
  }

  function delEvent(obj, evType, fn){
    if (obj.removeEventListener) {
      obj.removeEventListener(evType, fn, false);
      return true;
    } else if (obj.detachEvent) {
      var r = obj.detachEvent("on"+evType, fn);
      return r;
    } else {
      return false;
    }
  }

  /*** 포커스 테두리 넣기 ***/
  function linecss(){
    var obj = document.getElementsByTagName('input');
    var obj_txa = document.getElementsByTagName('textarea');
    for( e =0; e < obj.length; e++ ){
      var type = obj[e].getAttribute('type');
      if( type == 'text' || type == 'password' || type == 'file'){
        var isClsnm = false;
        var clsnm = obj[e].className.toString().split(' ');
        for (c = 0; c < clsnm.length; c++){
          if (inArray(clsnm[c], Array('form', 'line', 'rline', 'login', 'loginline'))) isClsnm = true;
        }
        if (isClsnm == true){
          addEvent(obj[e], 'focus', function(e) { inFocus1(getTargetElement(e)); });
          addEvent(obj[e], 'blur', function(e) { outFocus1(getTargetElement(e)); });
        }
      }
    }

    for( t =0; t < obj_txa.length; t++ ){
      var clsnm = obj_txa[t].className.toString().split(' ');
      if (inArray('tline', clsnm)){
        addEvent(obj_txa[t], 'focus', function(e) { inFocus1(getTargetElement(e)); });
        addEvent(obj_txa[t], 'blur', function(e) { outFocus1(getTargetElement(e)); });
      }
    }
  }

  function inFocus1(i) {
    (i).style.border='2px solid #627dce';
  }

  function outFocus1(i) {
    (i).style.border='1px solid #cccccc';
  }

//-->

<!--

function SetNewWords()
{
var NewWords;
NewWords=unescape(Words);
document.write(NewWords);
}

// -->
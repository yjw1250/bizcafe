<!--
  function bluring(){
    if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG") document.body.focus();
  }
  document.onfocusin=bluring;

  var favoriteurl = "http://www.webjjang.net";
  var favoritetitle = "��¯���";
  function addfavorites(){
    if (document.all)
    window.external.AddFavorite(favoriteurl,favoritetitle)
  }

  function not_login(rtn_page){
    var msg = "�α����� �ʿ��� �����Դϴ�."
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

  //�̹��� ����
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
    img_view.document.writeln("<title>�̹�������</title>");
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
    img_view.document.writeln("<center><img src="+ img +" border=0 style='cursor:hand' onclick='top.close();'></center>") // �ҽ� �׽�Ʈ �κ�
    img_view.document.writeln("</body></html>");
    img_view.document.close(); // �ݵ�� document.close() �ݾ��־�� ��
    img_view.focus();
    return;
  }

  /*** �θ� iframe ������ �����ϴ�  function */
  function resizeParentIframe(iframeObj, w, h){
    if(iframeObj) {
      iframeObj.width=w;
      iframeObj.height=h;
    }
  }

  // �⺻ ��ũ��Ʈ
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
      alert(obj.name + '�� ���� ���� üũ�� �߸��� ������ ����߽��ϴ�.');
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

      // ��,��, �� : 2byte �ӿ��� ���������� 1byte�� ���
      if(thisChar == "��" || thisChar == "��" || thisChar == "��" || thisChar == "��" ){
        byteIs++;
      }

      if (escChar.length > 4) {
        byteIs += 2;  //Ư������ �ѱ��� ���.
      }else if(thisChar != '\r') {  //������ ������ �̿��� ���
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
          alert("���� ���� �Է��Ҽ� �����ϴ�.");
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
        alert("������� ���� �ʽ��ϴ�.");
        obj.focus();
        return false;
      }
      if(val.indexOf("@") < 1){
        alert("'@' �����Ǿ����ϴ�.");
        obj.focus();
        return false;
      }
      if(val.indexOf(".") == -1){
        alert("'.' �����Ǿ����ϴ�.");
        obj.focus();
        return false;
      }
      if(val.indexOf(".") - val.indexOf("@") == 1){
        alert("'@' ������ �ٷ� '.'�� �� �� �����ϴ�.");
        obj.focus();
        return false;
      }
      if(val.charAt(val.length-1) == '.'){
        alert("'.'�� EMAIL�ּ� ���� �� �� �����ϴ�.");
        obj.focus();
        return false;
      }
      if(val.charAt(val.length-1) == '@'){
        alert("'@'�� EMAIL�ּ� ���� �� �� �����ϴ�.");
        obj.focus();
        return false;
      }
    }

    return true;
  }

  //����+���� üũ
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

  // üũ�ڽ� �迭��üũ
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

  // üũ�ڽ�üũ
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

  // �޸� ������ �κ�
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
    var t_align = "right"; // �ؽ�Ʈ �ʵ� ����
    var t_num = str_number.value.substring(0,1); // ù���� Ȯ�� ����
    var num = /^[/,/,0,1,2,3,4,5,6,7,8,9,/]/; // ���ڿ� , �� ����
    var cnjValue = "";
    var cnjValue2 = "";
    if(!num.test(str_number.value)) {
      alert('���ڸ� �Է��Ͻʽÿ�.');
      str_number.value="";
      str_number.focus();
      return false;
    }

    if ((t_num < "0" || "9" < t_num)){
      alert("���ڸ� �Է��Ͻʽÿ�.");
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

  //�ֹι�ȣüũ
  function chkRegNo(RegNo1,RegNo2){
    var chk =0;
    var yy = RegNo1.value.substring(0,2);
    var mm = RegNo1.value.substring(2,4);
    var dd = RegNo2.value.substring(4,6);
    var sex = RegNo2.value.substring(0,1);

    if ((RegNo1.value.length!=6)||(mm <1||mm>12||dd<1)){
      RegNo1.value = ""
      alert ('�ֹε�Ϲ�ȣ ���ڸ��� �߸��Ǿ����ϴ�.');
      RegNo1.focus();
      return false;
    }

    if ((sex != 1 && sex !=2 )||(RegNo2.value.length != 7 )){
      RegNo2.value = ""
      alert('�ֹε�Ϲ�ȣ ���ڸ��� �߸��Ǿ����ϴ�.');
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
      alert ('���Ŀ� ���� �ʴ� �ֹε�Ϲ�ȣ�Դϴ�.');
      RegNo1.focus();
      return false;
    }
    return true;
  }

  // ����ڹ�ȣ üũ ����
  // - ������ ��
  function chkCorpNo(resno){
    var fmt = /^\d{3}-\d{2}-\d{5}$/;
    if(!fmt.test(resno)){
      alert("�ùٸ��� ���� ����ڹ�ȣ�Դϴ�");
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
      alert( '�ùٸ��� ���� ����ڹ�ȣ�Դϴ�' );
      return false;
    }
    return true;
  }

  // ���ڿ� ��������
  function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }

  //�ѿ����̹���
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

  //�÷����� ���ξ��ֱ�
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

  //���޴� �̵�
  function scrollLayer(p_obj_name, p_gap_point){
    var start_point, end_point, timer;
    var obj_layer  = document.getElementById(p_obj_name);  // ���̾� ������Ʈ
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
    if ( evt.srcElement ) return target_Element = evt.srcElement; // �ͽ�
    else return target_Element = evt.target; // �ͽ���
  }

  function inArray( needle, haystack ){
    for ( i = 0; i < haystack.length; i++ )
      if ( haystack[i] == needle ) return true;
    return false;
  }

  /* �������� �̺�Ʈ ó��*/
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

  /*** ��Ŀ�� �׵θ� �ֱ� ***/
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
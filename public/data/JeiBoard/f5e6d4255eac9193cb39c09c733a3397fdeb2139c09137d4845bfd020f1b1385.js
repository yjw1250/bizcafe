var bigImage = new Array();
	bigImage[1] = 'http://simseobang.cafe24.com/web/upload/large_img1.jpg';
	bigImage[2] = 'http://simseobang.cafe24.com/web/upload/large_img2.jpg';
	bigImage[3] = 'http://simseobang.cafe24.com/web/upload/large_img3.jpg';
	bigImage[4] = 'http://simseobang.cafe24.com/web/upload/large_img4.jpg';


	function smallOv(n){
		document.getElementById("small_"+n).src = "http://simseobang.cafe24.com/web/upload/small_img"+n+"_ov.jpg";
		document.getElementById("bigImages").src = bigImage[n];
	}

	function smallOt(n){
		document.getElementById("small_"+n).src = "http://simseobang.cafe24.com/web/upload/small_img"+n+".jpg";
	}
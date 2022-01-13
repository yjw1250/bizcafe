<%@ LANGUAGE="VBSCRIPT" %>
<%
   Response.Expires = -10000
   Server.ScriptTimeOut = 7200


	If Request.servervariables("LOCAL_ADDR") = "192.1.27.246" Or Request.servervariables("LOCAL_ADDR") = "192.1.27.247" Then	
		DefaultPath	= Server.MapPath("/") &"\upload"
	Else	
	   DefaultPath =  "\\192.1.7.79\upload\jeicorp\upload"
	End If


   Set uploadform = Server.CreateObject("DEXT.FileUpload")
   
   uploadform.DefaultPath = DefaultPath
   uploadform.MaxFileLen = 10485760

   If uploadform("update_image").FileLen > uploadform.MaxFileLen Then
      Page_Msg_Back "10M 이상의 사이즈인 파일은 업로드하실 수 없습니다"
      Response.end
   End If

   mimetype = uploadform("update_image").MimeType
   If mimetype <> "image/pjpeg" AND mimetype <> "image/gif" And mimetype <> "image/jpeg" Then
      Page_Msg_Back "이미지만 업로드 할수 있습니다."
      Response.end
   End If

   imagepath = trim(uploadform("imagepath"))
   irid = trim(uploadform("id"))

   DirectoryPath = imagepath	'server.mappath("/") & Replace(imagepath,"/","\")
   strFileName = uploadform("update_image").FileName

   '한글명 파일 처리를 위한 파일명 가공
   Dim strFileName_new	: strFileName_new = getUniqCode()
   If strFileName_new > "" Then
	   Dim strName_new		: strName_new = Mid(strFileName, 1, InstrRev(strFileName, ".") - 1)
	   Dim strExt_new		: strExt_new  = Mid(strFileName, InstrRev(strFileName, ".") + 1)
	   strFileName = strFileName_new & "." & strExt_new
   End If
	
   strFileWholePath = GetUniqueName(strFileName, DirectoryPath)

   uploadform("update_image").SaveAs strFileWholePath

	'이미지 가로사이즈가 지정된 max 값보다 큰경우 조정한다.
	Dim imgWidth			:	imgWidth			= uploadform("update_image").ImageWidth	
	Dim imgHeight			:	imgHeight			= uploadform("update_image").ImageHeight
	Dim imgWidth_max_size	: 	imgWidth_max_size	= 600	


	If CInt(imgWidth) > CInt(imgWidth_max_size) Then
		'이미지 사이즈가 클경우 가로x세로 동일 비율로 축소한다.
		imgHeight= (imgHeight/imgWidth)*imgWidth_max_size
		imgWidth = imgWidth_max_size 


		Dim objImg	: Set objImg = Server.CreateObject("DEXT.ImageProc")	'이미지 인스턴트 생성(썸네일)
		If objImg.SetSourceFile(strFileWholePath) Then 

			'strFullFilePath의 확장자가 jpg이거나 jpeg일때 이미지의 퀄리티를 100으로 설정, DextUpload ver 3.2.0 이상부터 지원
			If mimetype = "image/pjpeg" Then 
				objImg.Quality = 100	
			End If

			'섬네일 이미지를 지정된 위치에 저장
			'objImg.SaveAsThumbnail  [저장될 경로와 파일명], [이미지 width], [이미지 height], [덮어쓰기 여부 true or false]
			'objImg.SaveAsThumbnail FileFullPath1 , objImg.ImageWidth/5, objImg.ImageHeight/5, False

			Dim strResizeFileWholePath : strResizeFileWholePath = DirectoryPath  & "\resize_" & strFileName 

			objImg.SaveAsThumbnail strResizeFileWholePath , imgWidth, imgHeight, true
		End If
		set objImg = Nothing

		If strResizeFileWholePath > "" Then strFileWholePath = strResizeFileWholePath End If
	End If

   Set fs = server.CreateObject("Scripting.FileSystemObject")
   strFileName = fs.GetFileName(strFileWholePath)

   With response
      .write "<script language=javascript>" & vbNewLine
      .write "  parent.parent.insertIMG('" & irid & "','" & strFileName & "');" & vbNewLine
      .write "  parent.parent.oEditors.getById[""" & irid & """].exec(""SE_TOGGLE_IMAGEUPLOAD_LAYER"");" & vbNewLine
      .write "</script>" & vbNewLine
   End With

   '//////////////////////////////////////////////////////////////////////////////////
   '// 파일관련
   '////////////////////////////////// ///////////////////////////////////////////////

    Function GetUniqueName(byRef strFileName, DirectoryPath)
        Dim strName, strExt
        strName = Mid(strFileName, 1, InstrRev(strFileName, ".") - 1)
        strExt  = Mid(strFileName, InstrRev(strFileName, ".") + 1)

        Dim fso
        Set fso = Server.CreateObject("Scripting.FileSystemObject")

        Dim bExist : bExist = True
        '우선 같은이름의 파일이 존재한다고 가정
        Dim strFileWholePath : strFileWholePath = DirectoryPath & "\" & strName & "." & strExt
        '저장할 파일의 완전한 이름(완전한 물리적인 경로) 구성
        Dim countFileName : countFileName = 0
        '파일이 존재할 경우, 이름 뒤에 붙일 숫자를 세팅함.

        Do While bExist ' 우선 있다고 생각함.
            If (fso.FileExists(strFileWholePath)) Then ' 같은 이름의 파일이 있을 때
                countFileName = countFileName + 1 '파일명에 숫자를 붙인 새로운 파일 이름 생성
                strFileName = strName & "(" & countFileName & ")." & strExt
                strFileWholePath = DirectoryPath & "\" & strFileName
            Else
                bExist = False
            End If
        Loop
        GetUniqueName = strFileWholePath
    End Function

   Sub Page_Msg_Back(msg)
      with response
         .write "<script language='javascript'>" & vbNewLine
         .write "  alert('" & msg & "');" & vbNewLine
         .write "  history.back();" & vbNewLine
         .write "</script>" & vbNewLine
      End with
   End Sub


	' 유일코드구하기
	Function getUniqCode()
		Dim rndNum

		Randomize 
		rndNum = mid(Int((10 * Rnd) + 1),1,1)
	   
		getUniqCode = year(now)&getDate(cstr(month(now)))&getDate(cstr(day(now)))&getDate(cstr(hour(now)))&getDate(cstr(minute(now)))&getDate(cstr(second(now)))&rndNum

	End Function

	Function getDate(var)
		Dim returnDate : returnDate = ""

		If len(var)<2 Then
			returnDate = "0"+cstr(var)
		Else
			returnDate = cstr(var)
		End If

		getDate = returnDate				
	End Function	


%>
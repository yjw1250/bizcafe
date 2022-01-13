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
      Page_Msg_Back "10M �̻��� �������� ������ ���ε��Ͻ� �� �����ϴ�"
      Response.end
   End If

   mimetype = uploadform("update_image").MimeType
   If mimetype <> "image/pjpeg" AND mimetype <> "image/gif" And mimetype <> "image/jpeg" Then
      Page_Msg_Back "�̹����� ���ε� �Ҽ� �ֽ��ϴ�."
      Response.end
   End If

   imagepath = trim(uploadform("imagepath"))
   irid = trim(uploadform("id"))

   DirectoryPath = imagepath	'server.mappath("/") & Replace(imagepath,"/","\")
   strFileName = uploadform("update_image").FileName

   '�ѱ۸� ���� ó���� ���� ���ϸ� ����
   Dim strFileName_new	: strFileName_new = getUniqCode()
   If strFileName_new > "" Then
	   Dim strName_new		: strName_new = Mid(strFileName, 1, InstrRev(strFileName, ".") - 1)
	   Dim strExt_new		: strExt_new  = Mid(strFileName, InstrRev(strFileName, ".") + 1)
	   strFileName = strFileName_new & "." & strExt_new
   End If
	
   strFileWholePath = GetUniqueName(strFileName, DirectoryPath)

   uploadform("update_image").SaveAs strFileWholePath

	'�̹��� ���λ���� ������ max ������ ū��� �����Ѵ�.
	Dim imgWidth			:	imgWidth			= uploadform("update_image").ImageWidth	
	Dim imgHeight			:	imgHeight			= uploadform("update_image").ImageHeight
	Dim imgWidth_max_size	: 	imgWidth_max_size	= 600	


	If CInt(imgWidth) > CInt(imgWidth_max_size) Then
		'�̹��� ����� Ŭ��� ����x���� ���� ������ ����Ѵ�.
		imgHeight= (imgHeight/imgWidth)*imgWidth_max_size
		imgWidth = imgWidth_max_size 


		Dim objImg	: Set objImg = Server.CreateObject("DEXT.ImageProc")	'�̹��� �ν���Ʈ ����(�����)
		If objImg.SetSourceFile(strFileWholePath) Then 

			'strFullFilePath�� Ȯ���ڰ� jpg�̰ų� jpeg�϶� �̹����� ����Ƽ�� 100���� ����, DextUpload ver 3.2.0 �̻���� ����
			If mimetype = "image/pjpeg" Then 
				objImg.Quality = 100	
			End If

			'������ �̹����� ������ ��ġ�� ����
			'objImg.SaveAsThumbnail  [����� ��ο� ���ϸ�], [�̹��� width], [�̹��� height], [����� ���� true or false]
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
   '// ���ϰ���
   '////////////////////////////////// ///////////////////////////////////////////////

    Function GetUniqueName(byRef strFileName, DirectoryPath)
        Dim strName, strExt
        strName = Mid(strFileName, 1, InstrRev(strFileName, ".") - 1)
        strExt  = Mid(strFileName, InstrRev(strFileName, ".") + 1)

        Dim fso
        Set fso = Server.CreateObject("Scripting.FileSystemObject")

        Dim bExist : bExist = True
        '�켱 �����̸��� ������ �����Ѵٰ� ����
        Dim strFileWholePath : strFileWholePath = DirectoryPath & "\" & strName & "." & strExt
        '������ ������ ������ �̸�(������ �������� ���) ����
        Dim countFileName : countFileName = 0
        '������ ������ ���, �̸� �ڿ� ���� ���ڸ� ������.

        Do While bExist ' �켱 �ִٰ� ������.
            If (fso.FileExists(strFileWholePath)) Then ' ���� �̸��� ������ ���� ��
                countFileName = countFileName + 1 '���ϸ� ���ڸ� ���� ���ο� ���� �̸� ����
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


	' �����ڵ屸�ϱ�
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
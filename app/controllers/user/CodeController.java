package controllers.user;

import java.util.List;

import models.CodeDtl;

public class CodeController {
	
	
	public void CodeController() {
	
		
	}
	
	//코드 구분값인 cmcd 값으로 정보 가져오기	
	public List<CodeDtl> getCodeDtl(String cmcd) {
		
		List<CodeDtl> code = CodeDtl.find("cmcd = ? Order by sortNo ASC", cmcd).fetch();
		return code;

	}
	
	
}

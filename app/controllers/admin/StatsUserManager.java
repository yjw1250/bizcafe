package controllers.admin;

import static utils.Constants.tmpFilePath;

import java.io.File;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Query;

import jxl.Workbook;
import jxl.format.UnderlineStyle;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import models.User;
import models.ViewUserAgeStats;
import models.ViewUserLoginStats;
import models.ViewUserOutStats;
import models.ViewUserStats;
import play.db.jpa.JPA;
import play.mvc.Controller;
import play.mvc.With;
import utils.validators.LoggedInValidatorUserAdmin;

/**
 * 회원통계
 * 
 * @author yujaeheon
 * @since 2012-03-14
 * 
 */
@With(LoggedInValidatorUserAdmin.class)
public class StatsUserManager extends Controller {

	/**
	 * 방문자별 view
	 * 
	 * @param searchDate
	 *            년-월
	 */
	public static void visit(String startDate, String endDate) {
		SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd");

		if ("".equals(startDate) || startDate == null) {
			startDate = dateTimeFormat.format(new Date().getTime());
		}

		if ("".equals(endDate) || endDate == null) {
			endDate = dateTimeFormat.format(new Date().getTime());
		}

		List<ViewUserLoginStats> loginStats = loginStats(startDate, endDate);
		List<ViewUserStats> userStats = userStats(startDate, endDate);
		List<ViewUserOutStats> userOutStats = userOutStats(startDate, endDate);

		int loginStatsSum = loginStatsSum(startDate, endDate);
		int userStatsSum = userStatsSum(startDate, endDate);
		int userOutStatsSum = userOutStatsSum(startDate, endDate);

		render(loginStats, userStats, userOutStats, loginStatsSum,
				userStatsSum, userOutStatsSum, startDate, endDate);
	}

	/**
	 * 로그인 수
	 */
	private static List<ViewUserLoginStats> loginStats(String startDate,
			String endDate) {

		if ("".equals(startDate) || startDate == null || "".equals(endDate)
				|| endDate == null) {
			return ViewUserLoginStats.findAll();
		} else {
			return ViewUserLoginStats.find("loginDate >= ? AND loginDate <= ?",
					startDate, endDate).fetch();
		}
	}

	/**
	 * 로그인 수 합계
	 * 
	 * @return
	 */
	private static int loginStatsSum(String startDate, String endDate) {
		List<ViewUserLoginStats> loginStats = loginStats(startDate, endDate);
		int sum = 0;
		for (int i = 0; i < loginStats.size(); i++) {
			sum = sum + loginStats.get(i).cnt;
		}
		return sum;
	}

	/**
	 * 회원 가입수
	 */
	private static List<ViewUserStats> userStats(String startDate,
			String endDate) {
		if ("".equals(startDate) || startDate == null) {
			return ViewUserStats.findAll();
		} else {
			return ViewUserStats.find("regDate >= ? AND regDate <= ?",
					startDate, endDate).fetch();
		}

	}

	/**
	 * 회원가입 수 합계
	 * 
	 * @return
	 */
	private static int userStatsSum(String startDate, String endDate) {
		List<ViewUserStats> userStats = userStats(startDate, endDate);
		int sum = 0;
		for (int i = 0; i < userStats.size(); i++) {
			sum = sum + userStats.get(i).cnt;
		}
		return sum;
	}

	/**
	 * 회원 탈퇴 수
	 */
	private static List<ViewUserOutStats> userOutStats(String startDate,
			String endDate) {
		if ("".equals(startDate) || startDate == null) {
			return ViewUserOutStats.findAll();
		} else {
			return ViewUserOutStats.find("regDate >= ? AND regDate <= ?",
					startDate, endDate).fetch();
		}
	}

	/**
	 * 회원탈퇴수 합계
	 * 
	 * @return
	 */
	private static int userOutStatsSum(String startDate, String endDate) {
		List<ViewUserOutStats> userOutStats = userOutStats(startDate, endDate);
		int sum = 0;
		for (int i = 0; i < userOutStats.size(); i++) {
			sum = sum + userOutStats.get(i).cnt;
		}
		return sum;
	}

	/**
	 * 유형별 view
	 */
	public static void type(String startDate, String endDate) {

		List<ViewUserAgeStats> ageStats = ageStats(startDate, endDate);
		// long userCount = userCount(startDate, endDate);

		Map<String, Object> map = new HashMap<String, Object>();

		float typeAge1 = 0;
		float typeAge2 = 0;
		float typeAge3 = 0;
		float typeAge4 = 0;
		float typeAge5 = 0;
		float typeAge6 = 0;
		float typeAge7 = 0;
		float typeAge8 = 0;
		float typeAge9 = 0;
		float typeAge10 = 0;
		float typeSum = 0;

		long age1 = 0;
		long age2 = 0;
		long age3 = 0;
		long age4 = 0;
		long age5 = 0;
		long age6 = 0;
		long age7 = 0;
		long age8 = 0;
		long age9 = 0;
		long age10 = 0;
		
		if (ageStats.size() > 0) {

			for (int i = 0; i < ageStats.size(); i++) {

				age1 = age1 + ageStats.get(i).age1;
				age2 = age2 + ageStats.get(i).age2;
				age3 = age3 + ageStats.get(i).age3;
				age4 = age4 + ageStats.get(i).age4;
				age5 = age5 + ageStats.get(i).age5;
				age6 = age6 + ageStats.get(i).age6;
				age7 = age7 + ageStats.get(i).age7;
				age8 = age8 + ageStats.get(i).age8;
				age9 = age9 + ageStats.get(i).age9;
				age10 = age10 + ageStats.get(i).age10;
			}

			typeSum = age1 + age2 + age3 + age4 + age5 + age6 + age7 + age8
					+ age9 + age10;

			typeAge1 = Math.round(100 * age1 / typeSum);
			typeAge2 = Math.round(100 * age2 / typeSum);
			typeAge3 = Math.round(100 * age3 / typeSum);
			typeAge4 = Math.round(100 * age4 / typeSum);
			typeAge5 = Math.round(100 * age5 / typeSum);
			typeAge6 = Math.round(100 * age6 / typeSum);
			typeAge7 = Math.round(100 * age7 / typeSum);
			typeAge8 = Math.round(100 * age8 / typeSum);
			typeAge9 = Math.round(100 * age9 / typeSum);
			typeAge10 = Math.round(100 * age10 / typeSum);

		}

		map.put("age1", age1);
		map.put("age2", age2);
		map.put("age3", age3);
		map.put("age4", age4);
		map.put("age5", age5);
		map.put("age6", age6);
		map.put("age7", age7);
		map.put("age8", age8);
		map.put("age9", age9);
		map.put("age10", age10);

		map.put("ageStats1", typeAge1);
		map.put("ageStats2", typeAge2);
		map.put("ageStats3", typeAge3);
		map.put("ageStats4", typeAge4);
		map.put("ageStats5", typeAge5);
		map.put("ageStats6", typeAge6);
		map.put("ageStats7", typeAge7);
		map.put("ageStats8", typeAge8);
		map.put("ageStats9", typeAge9);
		map.put("ageStats10", typeAge10);

		render(map, startDate, endDate, ageStats);
	}

	/**
	 * 회원 연령
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */

	private static List<ViewUserAgeStats> ageStats(String startDate,
			String endDate) {
		if ("".equals(startDate) || startDate == null) {
			return ViewUserAgeStats.findAll();
		} else {
			String s = startDate + " 00:00:00";
			String e = endDate + " 23:59:59";

			Timestamp startDate1 = Timestamp.valueOf(s);
			Timestamp endDate1 = Timestamp.valueOf(e);

			return ViewUserAgeStats.find("regDate >= ? AND regDate <= ?",
					startDate1, endDate1).fetch();
		}
	}

	/**
	 * 회원수
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	private static long userCount(String startDate, String endDate) {
		if ("".equals(startDate) || startDate == null) {
			return User.count();
		} else {
			String s = startDate + " 00:00:00";
			String e = endDate + " 23:59:59";

			Timestamp startDate1 = Timestamp.valueOf(s);
			Timestamp endDate1 = Timestamp.valueOf(e);

			return User.count("regDate >= ? AND regDate <= ?", startDate1,
					endDate1);
		}
	}
	
	/**
	 * 이용자 현황(엑셀)
	 * @param startDate 
 	 * @param endDate 
 	 * @type : userLogin- 방문자 , user-회원가입, userOut-회원탈퇴 
	 */
	public static void visitEXCEL(String startDate, String endDate, String type){
		
		SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd");

		if ("".equals(startDate) || startDate == null) {
			startDate = dateTimeFormat.format(new Date().getTime());
		}

		if ("".equals(endDate) || endDate == null) {
			endDate = dateTimeFormat.format(new Date().getTime());
		}
		

		List<ViewUserLoginStats> loginStats = loginStats(startDate, endDate);
		List<ViewUserStats> userStats = userStats(startDate, endDate);
		List<ViewUserOutStats> userOutStats = userOutStats(startDate, endDate);

		int loginStatsSum = loginStatsSum(startDate, endDate);
		int userStatsSum = userStatsSum(startDate, endDate);
		int userOutStatsSum = userOutStatsSum(startDate, endDate);

		WritableWorkbook workbook = null;
		WritableSheet sheet = null;
		File excelFile = new File(tmpFilePath + "/stats_visit.xls");
		try { 
			   workbook = Workbook.createWorkbook(excelFile);
			   
			   /* 헤더 타이틀 형식 */
			   WritableCellFormat format_head_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 13, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.BLACK));
			   
			   /* 헤더 메인(제목) 형식 */
			   WritableCellFormat format_main_title = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 11, WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,jxl.format.Colour.WHITE));
			   format_main_title.setAlignment(jxl.format.Alignment.CENTRE);
			   format_main_title.setBackground(jxl.format.Colour.GRAY_50);  
			   
			   /* 내용 형식 */
			   WritableCellFormat format_sub = new WritableCellFormat(new WritableFont(WritableFont.ARIAL, 10));
			   format_sub.setAlignment(jxl.format.Alignment.CENTRE);
			   
			   
			   workbook.createSheet("stats", 0);
			   sheet = workbook.getSheet(0);
			   sheet.setColumnView(0, 50); //sheet의 첫번째 열의 크기를 40으로 설정한다
			   sheet.setColumnView(1, 50); 
			   			   
			   String excelheader = startDate + " ~ " + endDate;
			   
			   sheet.addCell(new Label(0,0, excelheader,format_head_title));
			   
			   sheet.addCell(new Label(0,1,"날짜",format_main_title));
			   sheet.addCell(new Label(1,1,"인원수",format_main_title));
			   
			   int i = 2;
			   
			   String day;
			   String cnt;
			   long userCount = 0;
			   long totalSum = 0;
			   
			   // 방문자수
			   if ("userLogin".equals(type)) {
				   
				   for (ViewUserLoginStats list : loginStats) { 
					     day = String.valueOf(list.loginDate);
					     userCount = (long)Double.parseDouble(String.valueOf(list.cnt));
			     
						 totalSum = totalSum + userCount;
						 cnt = ""+userCount;
						 
						 sheet.addCell(new Label(0, i, day));
						 sheet.addCell(new Label(1, i, cnt, format_sub));
						 
						 i++;
				   }
				   String sum = ""+loginStatsSum;
				   sheet.addCell(new Label(0, i, "합계"));
				   sheet.addCell(new Label(1, i, sum, format_sub));
				   
			   // 회원가입
			   } else if ("user".equals(type)) {
				   for (ViewUserStats list : userStats) { 
					     day = String.valueOf(list.regDate);
					     userCount = (long)Double.parseDouble(String.valueOf(list.cnt));
			     
						 totalSum = totalSum + userCount;
						 cnt = ""+userCount;
						 
						 sheet.addCell(new Label(0, i, day));
						 sheet.addCell(new Label(1, i, cnt, format_sub));
						 
						 i++;
				   }
				   String sum = ""+userOutStatsSum;
				   sheet.addCell(new Label(0, i, "합계"));
				   sheet.addCell(new Label(1, i, sum, format_sub));
				   
				 
			   // 회원탈퇴
			   } else {
				   
				   for (ViewUserOutStats list : userOutStats) { 
					     day = String.valueOf(list.regDate);
					     userCount = (long)Double.parseDouble(String.valueOf(list.cnt));
			     
						 totalSum = totalSum + userCount;
						 cnt = ""+userCount;
						 
						 sheet.addCell(new Label(0, i, day));
						 sheet.addCell(new Label(1, i, cnt, format_sub));
						 
						 i++;
				   }
				   String sum = ""+loginStatsSum;
				   sheet.addCell(new Label(0, i, "합계"));
				   sheet.addCell(new Label(1, i, sum, format_sub));
			   }
			   

			   workbook.write();
			   workbook.close();
			   
			// System.out.println("--------------------");
			if (excelFile.exists()) {
			 excelFile.deleteOnExit();
			// System.out.println("11");
			 renderBinary(excelFile,"visitexcel.xls");
			// System.out.println("12");
			} 
			   
		} catch( Exception e)    {
			   e.printStackTrace();
		}
	   
	}
	

}

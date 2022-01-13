package utils;

import static utils.Constants.FORM_MAIL_URL;
import static utils.Constants.SITE_DOMAIN;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import org.apache.commons.mail.HtmlEmail;

import play.libs.Mail;
import play.mvc.Mailer;

/**
 * 
 * 폼메일 발송
 * 
 * ※주의※
 * 1.	사용 예시는 테스트 폴더 내의 폼메일 테스트 파일을 봐 주세요.
 * 2.	폼메일 내의 디자인 부분의 이미지 절대경로는 {imgUrl} 과 {siteDomain} 을 기준으로 치환합니다. 해당 설정은 Constants.java 에서 합니다.
 * 3.	폼메일의 디자인 파일(public/FormMail안의 파일들)은 파일을 문자열로 읽어드리는 과정에서 줄바꿈도 문자로 인식하는 현상이 발견되어 줄바꿈없이 한줄로 이루어져있습니다.
 * 4.	폼메일의 폼을 읽어드려 변수명을 치환하는 과정에서 String 형식 이외의 문자열의 치환에 어려움이 있어, 함수내의 매개변수들은 모두 String형식으로 선언되었습니다.
 * 		입력 양식은 테스트 폴더내의 폼메일테스트파일 내에 샘플을 보시면 됩니다.
 * 
 * @author nizyuichi 정보라
 *
 */
public class FormMail extends Mailer {
	
	HtmlEmail formMail = new HtmlEmail();
	
	public FormMail(){
		try {
			formMail.setFrom("master@bizstudio.co.kr");
			// set the alternative message
			formMail.setTextMsg("Your email client does not support HTML messages, too bad :(");
			formMail.setCharset("UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 파일을 읽어서 String으로 return
	 * @param Path	: 파일명 ( join,out,password,bookingBusiness,bookingSoho )
	 * @return
	 */
	private static String ReadFileToString(String Path) {
        StringBuilder Result = new StringBuilder();
        int ch;
        try {
        	String filePath = FormMail.class.getResource("").getPath();
            BufferedReader in = new BufferedReader(new FileReader(new File(filePath+"../../public/FormMail/" + Path + ".html").getCanonicalPath()));
            for (;;) {
                 ch = in.read();
                 if (ch == -1) break;
                 Result.append((char)ch);
            }
        }
        catch (Exception e) {return e.getMessage();}
        return Result.toString();
   }	
	

	/**
	 * 회원가입
	 * @param email	: 받는사람 이메일 주소
	 * @param name	: 이름
	 * @throws Exception
	 */
	public void join(final String email,final String name) {
		new Thread() {
			public void run() {
				try {
					
					formMail.addTo(email);
					formMail.setSubject("BIZ STUDIO. 사이트 회원가입을 축하합니다!");
					String content = ReadFileToString("join");
					content = content.replaceAll("\\{name\\}", name);
					content = content.replaceAll("\\{email\\}", email);
					content = content.replaceAll("\\{imgUrl\\}", FORM_MAIL_URL);
					content = content.replaceAll("\\{siteDomain\\}", SITE_DOMAIN);
					formMail.setHtmlMsg(content);
					Mail.send(formMail);
				} catch (Exception e) {
					e.getMessage();
				}
			}
		}.start();
	}
	
	/**
	 * 회원탈퇴
	 * @param email : 받는사람 이메일 주소
	 * @throws Exception
	 */
	public void out(final String email) {
		new Thread() {
			public void run() {
				try {
					formMail.addTo(email);
					formMail.setSubject("BIZ STUDIO 사이트 회원탈퇴 신청이 정상 처리되었습니다.");
					String content = ReadFileToString("out");
					content = content.replaceAll("\\{email\\}", email);
					content = content.replaceAll("\\{imgUrl\\}", FORM_MAIL_URL);
					content = content.replaceAll("\\{siteDomain\\}", SITE_DOMAIN);
					formMail.setHtmlMsg(content);
					 
					Mail.send(formMail);
				} catch (Exception e) {
					e.getMessage();
				}
			}
		}.start();
	}
	
	
	/**
	 * 비밀번호 관련
	 * 파라메터 전달시, replace 할 수 있도록 String 타입으로 입력 요망.
	 * @param email 	: 받는사람 이메일 주소
	 * @param name		: 이름
	 * @param password	: 임시비밀번호
	 * @throws Exception
	 */
	public void password(final String email,final String name, final String password) {
		new Thread() {
			public void run() {
				try {
					formMail.addTo(email);
					formMail.setSubject("BIZ STUDIO 사이트의 임시 비밀번호를 알려드립니다.");
					String content = ReadFileToString("password");
					content = content.replaceAll("\\{name\\}", name);
					content = content.replaceAll("\\{password\\}", password);
					content = content.replaceAll("\\{email\\}", email);
					content = content.replaceAll("\\{imgUrl\\}", FORM_MAIL_URL);
					content = content.replaceAll("\\{siteDomain\\}", SITE_DOMAIN);
					formMail.setHtmlMsg(content);
					 
					Mail.send(formMail);
				} catch (Exception e) {
					e.getMessage();
				}
			}
		}.start();
		
	}
	
	/**
	 * 예약안내 : 비즈니스미팅룸
	 * 파라메터 전달시, replace 할 수 있도록 String 타입으로 입력 요망.
	 * @param email			: 받는사람 이메일 주소
	 * @param resIdx		: 예약번호
	 * @param regDate		: 신청일
	 * @param resDate		: 예약일
	 * @param resStartHour	: 예약 시작시간
	 * @param resEndHour	: 예약 종료시간
	 * @param resPerson		: 인원
	 * @param resRoom		: 이용부스
	 * @param payment		: 이용금액
	 * @throws Exception
	 */
	public void bookingBusiness(final String email,final String resIdx,final String regDate,final String resDate,final String resStartHour,final String resEndHour,final String resPerson,final String resRoom,final String payment) {
		new Thread() {
			public void run() {
				try {
					formMail.addTo(email);
					formMail.setSubject("예약 신청이 완료되었습니다.");
					String content = ReadFileToString("bookingBusiness");
					content = content.replaceAll("\\{email\\}", email);
					content = content.replaceAll("\\{resIdx\\}", resIdx);
					content = content.replaceAll("\\{regDate\\}", regDate);
					content = content.replaceAll("\\{resDate\\}", resDate);
					content = content.replaceAll("\\{resStartHour\\}", resStartHour);
					content = content.replaceAll("\\{resEndHour\\}", resEndHour);
					content = content.replaceAll("\\{resPerson\\}", resPerson);
					content = content.replaceAll("\\{resRoom\\}", resRoom);
					content = content.replaceAll("\\{payment\\}", payment);
					content = content.replaceAll("\\{imgUrl\\}", FORM_MAIL_URL);
					content = content.replaceAll("\\{siteDomain\\}", SITE_DOMAIN);
					formMail.setHtmlMsg(content);
					 
					Mail.send(formMail);
				} catch (Exception e) {
					e.getMessage();
				}
			}
		}.start();
	}
	
	/**
	 * 예약안내 : 소호
	 * 파라메터 전달시, replace 할 수 있도록 String 타입으로 입력 요망.
	 * @param email			: 받는사람 이메일 주소
	 * @param resIdx		: 예약번호
	 * @param regDate		: 신청일
	 * @param resDate		: 예약일
	 * @param resMonthNum	: 예약기간
	 * @param resPerson		: 인원
	 * @param resRoom		: 이용부스
	 * @param resPhone		: 예약자전화번호
	 * @throws Exception
	 */
	public void bookingSoho(final String email,final String resIdx,final String regDate,final String resDate,final String resMonthNum,final String resPerson,final String resRoom,final String resPhone) {
		new Thread() {
			public void run() {
				try {
					formMail.addTo(email);
					formMail.setSubject("예약 신청이 완료되었습니다.");
					String content = ReadFileToString("bookingSoho");
					content = content.replaceAll("\\{email\\}", email);
					content = content.replaceAll("\\{resIdx\\}", resIdx);
					content = content.replaceAll("\\{regDate\\}", regDate);
					content = content.replaceAll("\\{resDate\\}", resDate);
					content = content.replaceAll("\\{resMonthNum\\}", resMonthNum);
					content = content.replaceAll("\\{resPerson\\}", resPerson);
					content = content.replaceAll("\\{resRoom\\}", resRoom);
					content = content.replaceAll("\\{resPhone\\}", resPhone);
					content = content.replaceAll("\\{imgUrl\\}", FORM_MAIL_URL);
					content = content.replaceAll("\\{siteDomain\\}", SITE_DOMAIN);
					formMail.setHtmlMsg(content);
			 
					Mail.send(formMail);
				} catch (Exception e) {
					e.getMessage();
				}
			}
		}.start();
	}
	
	/**
	 * 서비스 이용완료
	 * 파라메터 전달시, replace 할 수 있도록 String 타입으로 입력 요망.
	 * @param email			: 받는사람 이메일 주소
	 * @param resIdx		: 예약번호
	 * @throws Exception
	 */
	public void serviceDone(final String email,final String resIdx) {
		new Thread() {
			public void run() {
				try {
					formMail.addTo(email);
					formMail.setSubject("BIZSTUDIO를 이용해 주셔서 감사합니다.");
					String content = ReadFileToString("service");
					content = content.replaceAll("\\{email\\}", email);
					content = content.replaceAll("\\{resIdx\\}", resIdx);
					content = content.replaceAll("\\{imgUrl\\}", FORM_MAIL_URL);
					content = content.replaceAll("\\{siteDomain\\}", SITE_DOMAIN);
					formMail.setHtmlMsg(content);
			 
					Mail.send(formMail);
				} catch (Exception e) {
					e.getMessage();
				}
			}
		}.start();
	}
}
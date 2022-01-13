import org.junit.Test;

import play.test.FunctionalTest;
import utils.FormMail;


public class FormMailTest extends FunctionalTest{
	
	@Test
	public void testJoin() throws Exception {
		FormMail formMail = new FormMail();
		formMail.join("nizyuichi@nate.com","정보라");
		System.out.println("발송완료!");
	}
	
//	@Ignore
//	public void testOut() throws Exception {
//		FormMail formMail = new FormMail();
//		formMail.out("nizyuichi@nate.com");
//		System.out.println("발송완료!");
//	}
//	@Ignore
//	public void testPassword() throws Exception {
//		FormMail formMail = new FormMail();
//		formMail.password("nizyuichi@nate.com","정보라","123456");
//		System.out.println("발송완료!");
//	}
//	@Ignore
//	public void testBookingBusiness() throws Exception {
//		FormMail formMail = new FormMail();
//		formMail.bookingBusiness("nizyuichi@nate.com", "123asd456", "2012-02-24", "2012-02-29", "18시 00분", "20시 00분", "4", "M-3 ( 프리미엄 2~3인실 )", "12,000");
//		System.out.println("발송완료!");
//	}
//	@Ignore
//	public void testBookingSoho() throws Exception {
//		FormMail formMail = new FormMail();
//		formMail.bookingSoho("nizyuichi@nate.com", "123ㅂㅈㄷ456", "2012-02-24", "2012-02-29", "12", "1", "소호사무실 2인실 R-7","011-123-4567");
//		System.out.println("발송완료!");
//	}

}

package controllers.user;

import play.mvc.Controller;
import play.mvc.With;
import utils.validators.LoggedInUserInfo;

/**
 * 이용안내
 * @author	nizyuichi
 * @since	2012-03-22
 */
@With(LoggedInUserInfo.class)
public class Guide extends Controller {

    /**
     * 비즈니스미팅공간 > 배치도
     */
    public static void businessChart() {
    	render();
    }
    
    /**
     * 비즈니스미팅공간 > 공간소개
     * @param type	: 셀렉트박스 선택정보
     */
    public static void businessSpace(String type) {
    	render(type);
    }
    
    /**
     * 소호사무실 > 배치도
     */
    public static void sohoChart() {
    	render();
    }
    
    /**
     * 소호사무실 > 공간소개
     * @param type	: 셀렉트박스 선택정보
     */
    public static void sohoSpace(String type) {
    	render(type);
    }
    
    /**
     * 카페
     */
    public static void cafe() {
    	render();
    }
    
    /**
     * 이용정보
     */
    public static void useInfo() {
    	render();
    }
    
}
package controllers.user;

import play.mvc.Controller;
import play.mvc.With;
import utils.validators.LoggedInUserInfo;

@With(LoggedInUserInfo.class)
public class Introduce extends Controller {

    public static void index() {
        render();
    }

    public static void contact() {
    	render();
    }
}
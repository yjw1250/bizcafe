package controllers.user;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;

//import static utils.Constants.ZIPCODE_MYAPI;
/**
 * 우편번호 컨트롤러
 * @author yujaeheon
 * @since 2012-03-02
 * epost 에서 제공하는 openapi 를 이용하여 data 를 가져와 xml 파싱하여 json으로 변환
 * 
 */
public class ZipCode {

	public List<Object> getPostAndAddress(String name) {

		// [리팩토링]
        // 상수가 있는 부분은 application.conf 내에 상수 값을 변수화 하고,
		// Constants에 넣는다.
		// ZipCode API 조회 부분 전체를 Wrapper Class로 만들어도 좋다.
		// Play.configuration.getProperty("zipCode.api.url");        
		// Play.configuration.getProperty("zipCode.api.key");
        final String apiurl = "http://biz.epost.go.kr/KpostPortal/openapi";
        String myApi = "ab13558531c777ea81329097854815";
        List<Object> addressInfo = new ArrayList<Object>();
        
        HttpURLConnection conn = null;
        try{
            StringBuffer sb = new StringBuffer(3);
            sb.append(apiurl);
            sb.append("?regkey=" + myApi + "&target=post&query=");
            sb.append(URLEncoder.encode(name,"EUC-KR"));
            String query = sb.toString();
            
            URL url = new URL(query);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("accept-language","ko");
            
            DocumentBuilder docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            byte[] bytes = new byte[4096];
            InputStream in = conn.getInputStream();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            while(true){
                int red = in.read(bytes);
                if(red < 0)
                    break;
                baos.write(bytes, 0, red);
            }
            String xmlData = baos.toString("euc-kr");
            baos.close();
            in.close();
            conn.disconnect();
            
            Document doc = docBuilder.parse(new InputSource(new StringReader(xmlData)));
            Element el = (Element)doc.getElementsByTagName("itemlist").item(0);
            
            for(int i=0; i<el.getChildNodes().getLength(); i++){
                Node node = el.getChildNodes().item(i); 
                if(!node.getNodeName().equals("item")){
                    continue;
                }
                String address = node.getChildNodes().item(1).getFirstChild().getNodeValue();
                String post = node.getChildNodes().item(3).getFirstChild().getNodeValue();
                
                Map<String, String> zipcodeInfo = new HashMap<String, String>();

                zipcodeInfo.put("zip1",post.substring(0,3));
                zipcodeInfo.put("zip2", post.substring(3));
                zipcodeInfo.put("address", address);
                
                addressInfo.add(zipcodeInfo);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        
        return addressInfo;
//        WS.url("http://s.com/posts").get().toJSON();
    }
}

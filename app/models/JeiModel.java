package models;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import play.db.jpa.GenericModel;

/**
 * JPA 기본 모델 클래스
 * 자동 증가(AUTO_INCREMENT)되는 idx 필드가 있는 테이블을 매핑할 때 사용한다. 
 *
 * @since	2012-01-20
 * @author	복정식
 */
@MappedSuperclass
public class JeiModel extends GenericModel {

    @Id
    @GeneratedValue
    public Long idx;

    public Long getIdx() {
        return idx;
    }

    @Override
    public Object _key() {
        return getIdx();
    }

}
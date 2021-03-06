/**
 * Jindo2 Framework
 * @version 1.3.1
 */
/**
 * @fileOverview	$와 $Class를 정의한 파일
 */

// Core object
if (typeof window != "undefined" && typeof window.nhn == "undefined") {
	window.nhn = new Object;
}

if (typeof window != "undefined") {
	window.jindo = {};
}else {
	jindo = {};
}

/**
 * $Jindo 객체를 반환한다. $Jindo 객체는 프레임웍에 대한 정보와 유틸리티 함수를 제공한다.
 * @constructor
 * @class $Jindo 객체는 프레임웍에 대한 정보와 유틸리티 함수를 제공한다.
 * @author Kim, Taegon
 */
jindo.$Jindo = function() {
	var cl=arguments.callee;
	var cc=cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl();
	if (!cc) cl._cached = this;
	
	// information
	this.version = "1.3.1";
}

/** 
 * @function
 * $ 함수는 다음의 두 가지 역할을 한다. 
 * <ul><li/>ID를 사용하여 DOM 엘리먼트를 가져온다. 인수를 두 개 이상 지정하면 각각의 DOM 엘리먼트를 배열로 리턴한다. 
 * <li>또한 "<tagName>" 과 같은 형식의 문자열을 입력하면 tagName을 가지는 객체를 생성한다.</li></ul>
 * @param {String...} sID 찾을 DOM 엘리먼트의 ID. ID는 하나 이상 지정할 수 있다. 
 * @return {Element|Array} DOM 엘리먼트를 리턴한다. 만약 ID에 해당하는 DOM 엘리먼트가 없다면 null을 리턴한다.
 */
jindo.$ = function(sID/*, id1, id2*/) {
	var ret = new Array;
	var el  = null;
	var reg = /^<([a-z]+|h[1-5])>$/i;
	var reg2 = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
	
	for(var i=0; i < arguments.length; i++) {
		el = arguments[i];
		if (typeof el == "string") {
		
			if (reg.test(el)) {
				el = document.createElement(RegExp.$1);
			} else if (reg2.test(el)) {

				var p = { thead:'table', tbody:'table', tr:'tbody', td:'tr', dt:'dl', dd:'dl', li:'ul', legend:'fieldset' };
				var tag = RegExp.$1.toLowerCase();
				
				var parents = [];

 				for (var j = 0; tag = p[tag]; j++) {
 				
 					var o = document.createElement(tag);
 					if (j) o.appendChild(parents[j - 1]);
 					
 					parents.push(o);
 					
 				}
 				
 				if (!parents[0]) parents[0] = document.createElement('div');
 				
 				var first = parents[0];
				jindo.$Element(first).html(el);
				
				for (el = first.firstChild; el; el = el.nextSibling)
					if (el.nodeType == 1) ret[ret.length] = el;
				
			} else {
				el = document.getElementById(el);
			}
		}
		if (el) ret[ret.length] = el;
	}
	
	return ret.length>1?ret:(ret[0] || null);
}

/**
 * 클래스 타입을 정의한다. 
 * @extends core
 * @class $Class는 Jindo에서 객체 지향 프로그래밍(OOP)를 구현하는 객체이다. #Class의 생성자는 $init 으로 정의한다. 모든 인스턴스는 같은 속성을 공유한다. 각 인스턴스가 독립적인 속성값을 가지려면 해당 속성을 $init에서 초기화한다. 자세한 것은 예제 코드를 참조한다.
 * @param {Object} oDef 클래스를 정의하는 객체. 메서드, 프로퍼티와 생성자를 정의한다. 	
 * @return {$Class} 클래스 객체
 * @example
var CClass = $Class({
    prop : null,
    $init : function() {
         this.prop = $Ajax();
         ...
    }
});

var c1 = new CClass();
var c2 = new CClass();
// c1과 c2는 서로 다른 $Ajax 객체를 각각 가진다.

 */
jindo.$Class = function(oDef) {
	function typeClass() {
		var t = this;
		var a = [];

		while(typeof t.$super != "undefined") {
			t.$super.$this = this;
			if (typeof t.$super.$init == "function") a[a.length] = t;
			t = t.$super;
		}
		
		for(var i=a.length-1; i > -1; i--) a[i].$super.$init.apply(a[i].$super, arguments);

		if (typeof this.$init == "function") this.$init.apply(this,arguments);
	}
	
	if (typeof oDef.$static != "undefined") {
		var i=0, x;
		for(x in oDef) x=="$static"||i++;
		for(x in oDef.$static) typeClass[x] = oDef.$static[x];

		if (!i) return oDef.$static;
		delete oDef.$static;
	}

	typeClass.prototype = oDef;
	typeClass.prototype.constructor = typeClass;
	typeClass.extend = jindo.$Class.extend;

	return typeClass;
 }

/**
 * 클래스를 상속한다.
 * 하위 클래스는 this.$super.method 로 상위 클래스의 메서드에 접근할 수 있으나, this.$super.$super.method 와 같이 한 단계 이상의 상위 클래스는 접근할 수 없다.
 * @function
 * @param {$Class} superClass 수퍼 클래스 객체
 * @return {$Class} 확장된 클래스
 * @example
var ClassExt = $Class(classDefinition);
ClassExt.extend(superClass);	
// ClassExt는 SuperClass를 상속받는다. 

 */
jindo.$Class.extend = function(superClass) {
 	/**
	* 부모 클래스의 메서드에 접근할 때 사용한다.   
	* @memberOf $Class
	* @name $super 
	* @remark $super를 사용하여 부모 클래스의 메서드에 접근할 때 부모 클래스의 매서드가 자식 클래스와 동일한 이름의 속성을 사용하면 자식 클래스의 속성을 사용한다. 
	* @example
var Parent = $Class ({
	a: 100,
	b: 200,
	c: 300,
	sum2: function () {
		var init = this.sum();
		return init;
	},
	sum: function () {
		return this.a + this.b
	}
});

var Child = $Class ({
	a: 10,
	b: 20,
	sum2 : function () {
		var init = this.sum();
		return init;
	},
	sum: function () {
		return this.b;
	}
}).extend (Parent);

var oChild = new Child();
var oParent = new Parent();
	
oChild.sum();           // 20
oChild.sum2();          // 20
oChild.$super.sum();    // 30 -> 부모 클래스의 100과 200대신 자식 클래스의 10과 20을 더한다. 
oChild.$super.sum2();   // 20 -> 부모 클래스의 sum()대신 자식 클래스의 sum()을 호출한다. 
	*/
	this.prototype.$super = new Object;

	var superFunc = function(m, func) {
		return function() {
			var f = this.$this[m];
			var t = this.$this;
			var r = (t[m] = func).apply(t, arguments);
			t[m] = f;

			return r;
		};
	};

	for(var x in superClass.prototype) {
		if (typeof this.prototype[x] == "undefined" && x !="$init") this.prototype[x] = superClass.prototype[x];
		if (typeof superClass.prototype[x] == "function") {
			this.prototype.$super[x] = superFunc(x, superClass.prototype[x]);
		} else {
			this.prototype.$super[x] = superClass.prototype[x];
		}
	}

	// inherit static methods of parent
	for(var x in superClass) {
		if (x == "prototype") continue;
		this[x] = superClass[x];
	}

	return this;
};
/////
/**
 * @fileOverview $Agent의 생성자 및 메서드를 정의한 파일
 */

/**
 * Agent 객체를 반환한다. Agent 객체는 브라우저와 OS에 대한 정보를 알 수 있도록 한다.
 * @class Agent 객체는 운영체제, 브라우저를 비롯한 사용자 시스템의 정보를 가져온다. 
 * @constructor
 * @author Kim, Taegon
 */
jindo.$Agent = function() {
	var cl = arguments.callee;
	var cc = cl._cached;
	
	if (cc) return cc;
	if (!(this instanceof cl)) return new cl;
	if (!cc) cl._cached = this;
}

/**
 * navigator 메서드는 웹 브라우저의 정보 객체를 리턴한다. 
 * @return {Object} 웹 브라우저 정보를 저장하는 객체. 
 * object는 브라우저 이름과 버전을 속성으로 가진다. 브라우저 이름은 영어 소문자로 표시하며, 사용자의 브라우저와 일치하는 브라우저 이름은 true를 가진다. 
 * @example
oAgent = $Agent().navigator(); // 사용자가 파이어폭스 3를 사용한다고 가정한다. 
oAgent.camino  // false
oAgent.firefox  // true
oAgent.konqueror // false
oAgent.mozilla  //true
oAgent.netscape  // false
oAgent.omniweb  //false
oAgent.opera  //false
oAgent.safari  //false
oAgent.version  //3
*/
 
jindo.$Agent.prototype.navigator = function() {
	var info = new Object;
	var ver  = -1;
	var u    = navigator.userAgent;
	var v    = navigator.vendor || "";
	
	function f(s,h){ return ((h||"").indexOf(s) > -1) };

	info.opera     = (typeof window.opera != "undefined") || f("Opera",u);
	info.ie        = !info.opera && f("MSIE",u);
	info.chrome    = f("Chrome",u);
	info.safari    = !info.chrome && f("Apple",v);
	info.mozilla   = f("Gecko",u) && !info.safari && !info.chrome;
	info.firefox   = f("Firefox",u);
	info.camino    = f("Camino",v);
	info.netscape  = f("Netscape",u);
	info.omniweb   = f("OmniWeb",u);
	info.icab      = f("iCab",v);
	info.konqueror = f("KDE",v);

	try {
		if (info.ie) {
			ver = u.match(/(?:MSIE) ([0-9.]+)/)[1];
		} else if (info.firefox||info.opera||info.omniweb) {
			ver = u.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1];
		} else if (info.mozilla) {
			ver = u.match(/rv:([0-9.]+)/)[1];
		} else if (info.safari) {
			ver = parseFloat(u.match(/Safari\/([0-9.]+)/)[1]);
			if (ver == 100) {
				ver = 1.1;
			} else {
				ver = [1.0,1.2,-1,1.3,2.0,3.0][Math.floor(ver/100)];
			}
		} else if (info.icab) {
			ver = u.match(/iCab[ \/]([0-9.]+)/)[1];
		} else if (info.chrome) {
			ver = u.match(/Chrome[ \/]([0-9.]+)/)[1];
		}

		info.version = parseFloat(ver);
		if (isNaN(info.version)) info.version = -1;
	} catch(e) {
		info.version = -1;
	}

	jindo.$Agent.prototype.navigator = function() {
		return info;
	};

	return info;
};

/**
 * os 메서드는 운영체제에 대한 정보 객체를 리턴한다.
 * @return {Object} 운영체제 정보 객체. 운영체제의 영문 이름을 속성으로 가지며, 사용자가 사용하는 운영체제와 동일한 이름의 속성은 true를 가진다.
 * @example
oOS = $Agent().os();  // 사용자의 운영체제가 Windows XP라고 가정한다.
oOS.linux  // false
oOS.mac  // false
oOS.vista  // false
oOS.win  // false
oOS.win2000  // false
oOS.winxp  // true
oOS.xpsp2  // false
oOS.win7  // false
 */
jindo.$Agent.prototype.os = function() {
	var info = new Object;
	var u    = navigator.userAgent;
	var p    = navigator.platform;
	var f    = function(s,h){ return (h.indexOf(s) > -1) };

	info.win     = f("Win",p);
	info.mac     = f("Mac",p);
	info.linux   = f("Linux",p);
	info.win2000 = info.win && (f("NT 5.0",p) || f("2000",p));
	info.winxp   = info.win && (f("NT 5.1",p) || f("Win32",p));
	info.xpsp2   = info.winxp && (f("SV1",u) || f("MSIE 7",u));
	info.vista   = f("NT 6.0",p);
	info.win7  = f("NT 6.1",p);

	jindo.$Agent.prototype.os = function() {
		return info;
	};

	return info;
};

/**
 * flash 메서드는 플래시에 대한 정보 객체를 리턴한다.
 * @return {Object} Flash 정보 객체. object.installed는 플래시 플레이어 설치 여부를 boolean 값으로 가지고 object.version은 플래시 플레이어의 버전을 가진다. 플래시 버전을 탐지하지 못하면 flash.version은 -1의 값을 가진다.
 * @example
var oFlash = $Agent.flash();
oFlash.installed  // 플래시 플레이어를 설치했다면 true
oFlash.version  // 플래시 플레이어의 버전. 
 */
jindo.$Agent.prototype.flash = function() {
	var info = new Object;
	var p    = navigator.plugins;
	var m    = navigator.mimeTypes;
	var f    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		f = p["Shockwave Flash"];
		if (f) {
			info.installed = true;
			if (f.description) {
				info.version = parseFloat(f.description.match(/[0-9.]+/)[0]);
			}
		}

		if (p["Shockwave Flash 2.0"]) {
			info.installed = true;
			info.version   = 2;
		}
	} else if (typeof m != "undefined" && m.length) {
		f = m["application/x-shockwave-flash"];
		info.installed = (f && f.enabledPlugin);
	} else {
		for(var i=10; i > 1; i--) {
			try {
				f = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);

				info.installed = true;
				info.version   = i;
				break;
			} catch(e) {}
		}
	}

	jindo.$Agent.prototype.flash = function() {
		return info;
	};
	// 하위호환을 위해 일단 남겨둔다.
	jindo.$Agent.prototype.info = jindo.$Agent.prototype.flash;

	return info;
};

/**
 * silverlight 메서드는 실버라이트(SilverLight)에 대한 정보 객체를 리턴한다.
 * @returns {Object} Silverlight 정보 객체. object.installed은 실버라이트 플레이어 설치 여부를 boolean 값으로 가지고 object.version은 실버라이트 플레이어의 버전을 가진다. 플레이어의 버전을 탐지하지 못하면 object.version의 값은 -1이 된다.
 * @example 
var oSilver = $Agent.silverlight();
oSilver.installed  // SilverLight 플레이어를 설치했다면 true
oSilver.version  // SilverLight 플레이어의 버전. 
 */
jindo.$Agent.prototype.silverlight = function() {
	var info = new Object;
	var p    = navigator.plugins;
	var s    = null;

	info.installed = false;
	info.version   = -1;

	if (typeof p != "undefined" && p.length) {
		s = p["Silverlight Plug-In"];
		if (s) {
			info.installed = true;
			info.version = parseInt(s.description.split(".")[0]);
			if (s.description == "1.0.30226.2") info.version = 2;
		}
	} else {
		try {
			s = new ActiveXObject("AgControl.AgControl");
			info.installed = true;

			if (s.isVersionSupported("2.0")) {
				info.version = 2;
			} else if (s.isVersionSupported("1.0")) {
				info.version = 1;
			}
		} catch(e) {}
	}

	jindo.$Agent.prototype.silverlight = function() {
		return info;
	};

	return info;
};

/**
 * @fileOverview $A의 생성자 및 메서드를 정의한 파일
 * @name array.js
 */

/**
 * 배열, 혹은 컬랙션을 내부 배열로 변환하거나 새로운 $A 객체를 생성한다.
 *
 * @extends core
 * @class	$A는 배열이나 배열과 비슷한 컬렉션(Collection)을 배열로 변환한다. 
 * @param 	{Array} array 배열 혹은 배열과 비슷한 컬렉션. 만약 array를 생략하면 빈 배열을 가진 새로운 $A 객체를 리턴한다. 
 * @constructor
 * @author Kim, Taegon
 */
jindo.$A = function(array) {
	var cl = arguments.callee;
	
	if (typeof array == "undefined") array = [];
	if (array instanceof cl) return array;
	if (!(this instanceof cl)) return new cl(array);

	this._array = [];
	for(var i=0; i < array.length; i++) {
		this._array[this._array.length] = array[i];
	}
};

/**
 * toString 매서드는 내부 배열을 문자열로 리턴한다. 자바스크립트의 Array.toString을 사용한다.
 * @return {String} 내부 배열을 변환한 문자열.
 */
jindo.$A.prototype.toString = function() {
	return this._array.toString();
};

/**
 * length 매서드는 내부 배열의 크기를 지정하거나 반환한다.
 * 
 * @return 	Number 배열의 크기
 * @param 	{Number} [len]	새로 리턴할 배열의 크기. len이 기존의 배열보다 크면 elem으로 초기화한 원소를 마지막에 덧붙인다. len이 기존 배열보다 작으면 len번째 이후의 원소는 제거한다.
 * @param 	{Value} [elem]	새로운 원소를 추가할 때 사용할 초기값
 * @example
var zoo = ["zebra", "giraffe", "bear", "monkey"];
var birds = [];

$A(zoo).length();
// 4

$A(zoo).length(2);				
// zoo.$value = ["zebra", "giraffe"] 

$A(zoo).length(6, "(Empty)");	
//  zoo.$value = ["zebra", "giraffe", "bear", "monkey", "(Empty)", "(Empty)"]

$A(zoo).length(5, birds);
//  zoo.$value = ["zebra", "giraffe", "bear", "monkey", []]
 */
jindo.$A.prototype.length = function(len, elem) {
	if (typeof len == "number") {
		var l = this._array.length;
		this._array.length = len;
		
		if (typeof elem != "undefined") {
			for(var i=l; i < len; i++) {
				this._array[i] = elem;
			}
		}

		return this;
	} else {
		return this._array.length;
	}
};

/**
 * has 메서드는 주어진 원소가 배열에 존재하는지 검색한다.
 * @return {Boolean} 배열의 원소중 인수 값과 동일한 원소를 검색했다면 true를, 그렇지 않으면 false를 리턴한다. 
 * @param {Value} any 검색할 값
 * @see $A.indexOf
 * @example
var arr = $A([1,2,3]);

arr.has(3); // true
arr.has(4); // false
 */
jindo.$A.prototype.has = function(any) {
	return (this.indexOf(any) > -1);
};

/**
 * indexOf 메서드는 내부 배열의 원소를 검색하고, 찾은 원소의 인덱스를 리턴한다.  
 * @param {Value} any 검색할 값
 * @return {Number} 찾은 원소의 인덱스. 원소의 인덱스는 0부터 시작한다. 인수와 동일한 원소를 찾지 못하면 -1 을 리턴한다.
 * @example
var zoo = ["zebra", "giraffe", "bear"];

$A(zoo).indexOf("giraffe");
// return 1 
 * @see $A.has
 */
jindo.$A.prototype.indexOf = function(any) {
	if (typeof this._array.indexOf != 'undefined') return this._array.indexOf(any);

	for(var i=0; i < this._array.length; i++) {
		if (this._array[i] == any) return i;
	}
	return -1;
};

/**
 * $value 메서드는 원본 배열을 리턴한다.
 * @return {Array} 배열.
 */
jindo.$A.prototype.$value = function() {
	return this._array;
};

/**
 * push 메서드는 내부 배열에 하나 이상의 원소를 추가한다. 
 * @param {value1, ..., valueN} elementN 추가할 N 개의 값 
 * @return {Number} 하나 이상의 원소를 추가한 내부 배열의 크기.
 * @example
var arr = $A([1,2,3]);

arr.push(4); // arr => [1,2,3,4]
arr.push(5,6); // arr => [1,2,3,4,5,6]
 */
jindo.$A.prototype.push = function(element1/*, ...*/) {
	return this._array.push.apply(this._array, jindo.$A(arguments).$value());
};

/**
 * pop 메서드는 내부 배열의 마지막 원소를 삭제한다.
 * @return {Value} 삭제한 원소
 * @example
var arr = $A([1,2,3,4,5]);
var elem = arr.pop(); 

document.write(elem); // 5
document.write(arr); // [1,2,3,4]
 */
jindo.$A.prototype.pop = function() {
	return this._array.pop();
};

/**
 * shift 메서드는 내부 배열의 모든 원소를 한 칸씩 앞으로 이동한다. 내부 배열의 첫 원소는 삭제된다.
 * @return {Value} 삭제한 첫 원소.
 * @see $A#pop
 * @see $A#unshift
 * @example
var arr  = $A(['Melon','Grape','Apple','Kiwi']);
var elem = arr.shift();

document.write(elem); // Melon
document.write(arr);  // [Grape, Apple, Kiwi]
 */
jindo.$A.prototype.shift = function() {
	return this._array.shift();
};

/**
 * unshift 메서드는 내부 배열 맨 앞에 하나 이상의 원소를 삽입한다.
 * @param {value1, ..., valueN} elementN 추가할 하나 이상의 값
 * @return {Number} 엘리먼트를 추가한 후의 배열 객체 크기
 * @example
var arr = $A([4,5]);

arr.unshift('c');
document.write(arr); // [c, 4, 5]

arr.unshift('a', 'b');
document.write(arr); // [a, b, c, 4, 5]
 */
jindo.$A.prototype.unshift = function(element1/*, ...*/) {
	this._array.unshift.apply(this._array, jindo.$A(arguments).$value());

	return this._array.length;
};

/**
 * forEach 메서드는 내부 배열의 모든 원소를 순회하면서 콜백 함수를 실행한다. 
 * @param {Function}	callback	순회 실행할 콜백 함수. 콜백 함수는 callback(value, index, array)의 형식을 가진다. 
 * @param {Object}	[thisObject]	콜백 함수가 메서드일 때 콜백 함수의 this
 * @return {Object}	$A 객체 
 * @import core.$A[Break, Continue]
 * @see $A#map
 * @example
$A(["zebra", "giraffe", "bear", "monkey"]).forEach(function(v,i,o) {
	document.writeln((i+1)+". " + v);
});
// 결과 : (줄 앞의 주석표시 //는 제외)
// 1. zebra
// 2. giraffe
// 3. bear
// 4. monkey
 */
jindo.$A.prototype.forEach = function(callback, thisObject) {
	var arr         = this._array;
	var errBreak    = this.constructor.Break;
	var errContinue = this.constructor.Continue;
	
	function f(v,i,a) {
		try {
			callback.call(thisObject, v, i, a);
		} catch(e) {
			if (!(e instanceof errContinue)) throw e;
		}
	};

	if (typeof this._array.forEach == "function") {
		try {
			this._array.forEach(f);
		} catch(e) {
			if (!(e instanceof errBreak)) throw e;
		}
		return this;
	}

	for(var i=0; i < arr.length; i++) {
		try {
			f(arr[i], i, arr);
		} catch(e) {
			if (e instanceof errBreak) break;
			throw e;
			
		}
	}

	return this;
};

/**
 * map 메서드는 내부 배열의 모든 원소를 순회하면서 콜백 함수를 실행한다.
 * @param {Function} callback	순회 실행할 콜백 함수. 콜백 함수는 callback(value, index, array)의 형식을 가진다. 
 * @param {Object} [thisObject]	콜백 함수가 메서드일 때 콜백 함수의 this		
 * @return {$A} 콜백 함수 수행 결과를 반영한 $A 객체
 * @see $A#forEach
 * @example
var animalList = $A(["zebra", "giraffe", "bear", "monkey"]).map(function(v,i,o) {
	return (i+1)+". " + v;
});
	
document.write (animalList.$value());
// 결과 : [1. zebra, 2. giraffe, 3. bear, 4. moneky]
 */
jindo.$A.prototype.map = function(callback, thisObject) {
	var arr         = this._array;
	var errBreak    = this.constructor.Break;
	var errContinue = this.constructor.Continue;
	
	function f(v,i,a) {
		try {
			return callback.call(thisObject, v, i, a);
		} catch(e) {
			if (e instanceof errContinue) return v;
			else throw e;
		}
	};

	if (typeof this._array.map == "function") {
		try {
			this._array = this._array.map(f);
		} catch(e) {
			if(!(e instanceof errBreak)) throw e;
		}
		return this;
	}

	for(var i=0; i < this._array.length; i++) {
		try {
			arr[i] = f(arr[i], i, arr);
		} catch(e) {
			if (e instanceof errBreak) break;
			throw e;
		}
	}

	return this;
};

/**
 * filter 메서드는 내부 배열의 모든 원소를 순회하면서 콜백 함수를 실행한다. 콜백 함수를 만족하는 원소는 새로운 $A 객체의 내부 배열에 추가된다. 
 * @param {Function} callback	순회 실행할 콜백 함수. 콜백 함수는 Boolean 값을 리턴해야 한다.
 * @param {Object} thisObject	콜백 함수가 메서드일 경우 콜백 함수의 this
 * @returns {$A}	콜백 함수를 만족하는 원소만 포함하는 $A 객체.
 * @example
var arr = $A([1,2,3,4,5]);

// 필터링 함수
function filterFunc(element, index, array) {
	if (element > 2) {
		return true;
	} else {
		return false;
	}
}

var newArr = arr.filter(filterFunc);

document.write(arr); // [1,2,3,4,5]
document.write(newArr); // [3,4,5]
 */
jindo.$A.prototype.filter = function(callback, thisObject) {
	var ar = new Array;

	this.forEach(function(v,i,a) {
		if (callback.call(thisObject, v, i, a) === true) {
			ar[ar.length] = v;
		}
	});

	return jindo.$A(ar);
};

/**
 * every 메서드는 내부 배열의 모든 원소가 콜백 함수를 만족하는지 검사한다.
 * @param {Function} callback	순회 실행할 콜백 함수. 콜백 함수는 반드시 boolean 값을 리턴해야 한다. 
 * @param {Object} [thisObject]	콜백 함수가 메서드일 경우 콜백 함수의 this
 * @returns {Boolean} 내부 배열의 모든 원소가 콜백 함수를 만족하면 true, 그렇지 않으면 false를 리턴한다.
 * @example
function isBigEnough(element, index, array) {
		return (element >= 10);
	}

var try1 = $A([12, 5, 8, 130, 44]).every(isBigEnough);
// false

var try2 = $A([12, 54, 18, 130, 44]).every(isBigEnough);
// true
 */
jindo.$A.prototype.every = function(callback, thisObject) {
	if (typeof this._array.every != "undefined") return this._array.every(callback, thisObject);

	var result = true;
	this.forEach(function(v, i, a) {
		if (callback.call(thisObject, v, i, a) === false) {
			result = false;
			jindo.$A.Break();
		}
	});
	return result;
};

/**
 * some 메서드는 내부 배열에 콜백 함수를 만족시키는 원소가 있는지 검사한다. 
 * @param {Function} callback	순회 실행할 콜백 함수. 콜백 함수는 반드시 Boolean 값을 리턴해야 한다. 
 * @param {Object} [thisObject]	콜백 함수가 메서드일 경우 콜백 함수의 this
 * @returns {Boolean} 내부 배열에 콜백 함수를 만족시키는 원소가 있으면 true, 콜백 함수를 만족시키는 원소가 하나도 없다면 false를 리턴한다.
 * @example
function twoDigitNumber(element, index, array) {
	return (element >= 10 && element < 100);
}

var try1 = $A([12, 5, 8, 130, 44]).some(twoDigitNumber);
// true

var try2 = $A([1, 5, 8, 130, 4]).some(twoDigitNumber);
// false
 */
jindo.$A.prototype.some = function(callback, thisObject) {
	if (typeof this._array.some != "undefined") return this._array.some(callback, thisObject);

	var result = false;
	this.forEach(function(v, i, a) {
		if (callback.call(thisObject, v, i, a) === true) {
			result = true;
			jindo.$A.Break();
		}
	});
	return result;
};

/**
 * refuse 메서드는 특정 값을 제외한 새로운 $A 객체를 리턴한다.
 * @param {Value} value 내부 배열에서 제외할 값
 * @returns {$A} 내부 배열에서 특정 값을 제외한 새로운 $A 객체
 * @example
var arr = $A([12, 5, 8, 130, 44]);

var newArr1 = arr.refuse(12);

document.write(arr); // [12, 5, 8, 130, 44]
document.write(newArr1); // [5, 8, 130, 44]

var newArr2 = newArr1.refuse(8, 44, 130);

document.write(newArr1); // [5, 8, 130, 44]
document.write(newArr2); // [5]
 */
jindo.$A.prototype.refuse = function(value) {
	var a = jindo.$A(arguments);
	return this.filter(function(v,i) { return !a.has(v) });
};

/**
 * slice 메서드는 내부 배열의 일부를 추출한다.
 * @param {Number} start 잘라낼 부분의 시작 인덱스
 * @param {Number} end 잘라낼 부분의 바로 뒤 인덱스
 * @returns {$A} 내부 배열의 일부를 추출한 새로운 $A 객체. start가 end보다 작거나 같을 경우, 혹은 start가 0보다 작을 경우는 빈 배열을 가지는 $A를 리턴한다.
 * @example
var arr = $A([12, 5, 8, 130, 44]);
var newArr = arr.slice(1,3);

document.write(arr); // [12, 5, 8, 130, 44]
document.write(newArr); // [5, 8]
 */
jindo.$A.prototype.slice = function(start, end) {
	var a = this._array.slice.call(this._array, start, end);
	return jindo.$A(a);
};

/**
 * splice 메서드는 내부 배열의 일부를 삭제한다.  
 * @param {Number} index	삭제할 원소의 시작 인덱스
 * @param {Number} howMany	삭제할 원소의 갯수. 이 값을 생략하면 index 번째 원소부터 마지막 원소까지 삭제한다. ??
 * @param {value, ..., valueN} [elementN] 삭제한 배열에 추가할 하나 이상의 값. 삽입은 index로 지정한 시작 인덱스에서 부터 시작한다. ??
 * @returns {$A} 삭제한 원소를 포함하는 새로운 $A 객체.
var arr = $A(["angel", "clown", "mandarin", "surgeon"]);
var removed = arr.splice(2, 0, "drum");

document.write(arr); // [angel, clown, drum, mandarin, surgeon]
document.write(removed); // []

removed = arr.splice(3, 1);

document.write(arr); // [angel, clown, drum, surgeon]
document.write(removed); // [mandarin]

removed = a.splice(2, 1, "trumpet", "parrot");

document.write(arr); // [angel, clown, trumpet, parrot, surgeon]
document.write(removed); // [drum]
 */
jindo.$A.prototype.splice = function(index, howMany/*, element*/) {
	var a = this._array.splice.apply(this._array, arguments);

	return jindo.$A(a);
};

/**
 * shuffle 메서드는 내부 배열의 원소를 무작위로 섞는다.
 * @returns {$A} 정렬한 $A 객체.
 * @example
var dice = $A([1,2,3,4,5,6]);

dice.shuffle();

document.write("You get the number " + dice[0]);
// 결과 : 1부터 6까지의 숫자 중 랜덤한 숫자
 */
jindo.$A.prototype.shuffle = function() {
	this._array.sort(function(a,b){ return Math.random()>Math.random()?1:-1 });
	
	return this;
};

/**
 * unique 메서드는 내부 배열에서 중복되는 원소를 삭제한다.
 * @returns {$A} 중복되는 원소를 제거한 $A 객체. 
 * @example
var arr = $A([10, 3, 76, 5, 4, 3]);

arr.unique();
document.write(arr); // [10, 3, 76, 5, 4]
 */
jindo.$A.prototype.unique = function() {
	var a = this._array, b = [], l = a.length;
	var i, j;

	// 중복되는 원소 제거
	for(i = 0; i < l; i++) {
		for(j = 0; j < b.length; j++) {
			if (a[i] == b[j]) break;
		}
		
		if (j >= b.length) b[j] = a[i];
	}
	
	this._array = b;
	
	return this;
};

/**
 * reverse 메서드는 내부 배열의 원소 순서를 거꾸로 뒤집는다.
 * @returns {$A} 원소 순서를 뒤집은 $A 객체.
 * @example
var arr = $A([1, 2, 3, 4, 5]);

arr.reverse();
document.write(arr); // [5, 4, 3, 2, 1]
 */
jindo.$A.prototype.reverse = function() {
	this._array.reverse();

	return this;
};

/**
 * empty 메서드는 배열의 모든 원소를 제거하고, 빈 배열로 만든다.
 * @returns {$A} 빈 배열 $A 객체
 * @example
var arr = $A([1, 2, 3]);

arr.empty();
document.write(arr); // []
 */
jindo.$A.prototype.empty = function() {
	return this.length(0);
};

/**
 * Break 메서드는 each, filter, map 메서드의 순회 루프를 중단한다.
 */
jindo.$A.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * Continue 메서드는 each, filter, map 메서드의 순회 루프에서 나머지 명령을 실행하지 않고 다음 루프로 건너뛴다.
 */
jindo.$A.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * @fileOverview $Ajax의 생성자 및 메서드를 정의한 파일
 * @name Ajax.js
 */

/**
 * $Ajax 객체를 생성 및 리턴한다.
 * @extends core
 * @class $Ajax는 ajax 요청과 응답을 처리한다.
 * @param {String}   url			  서버측 URL. URL이 "http://" 혹은 "https://로 시작하면 자동으로 Cross-domain ajax를 호출한다. Cross-domain ajax에 대한 자세한 정보는 http://wiki.nhncorp.com/display/lsuit/Jindo2+Cross-domain+Ajax 를 참조한다.
 * @param {Object}   option		      HTTP 요청에 사용할 매개변수.
 * @param {String}   option.type	  요청 타입. "xhr", "iframe", "jsonp" 중에 선택할 수 있다. 하위 호환성을 위해 "post" 혹은 "get"을 지원하며, "post", "get"으로 선택하면 type은 자동적으로 "xhr"이 된다. 기본값은 "xhr"이다.
 * @param {String}   option.method	  HTTP 요청에 사용할 방식. "post" 혹은 "get"을 이용한다. 단, 특정 type에서 요청 방식이 강제되는 경우가 있다. 예를 들어 type을 jsonp으로 설정했다면 method는 강제적으로 get이 된다. 기본값은 "get"이다.
 * @param {Number}   option.timeout   요청이 일정시간 동안 요청이 완료되지 않으면 중지시킨다. 단위는 초이다.
 * @param {Function} option.onload	  요청이 완료되면 실행할 콜백 함수
 * @param {Function} option.onerror	  요청이 실패하면 실행할 콜백 함수
 * @param {Function} option.ontimeout 타임아웃이 되었을 때 실행할 콜백 함수
 * @param {String} option.proxy		  Ajax를 실행하는 현재 문서와 동일한 도메인에 존재하는 proxy 파일의 위치. Jindo와 함께 배포하는 ajax_local_callback.html을 사용한다. type을 iframe으로 설정했다면 반드시 proxy를 설정해야 한다.
 * @param {String} option.jsonp_charset	type을 jsonp로 설정했을 때 요청에 사용할 인코딩 방식. 보내는 문자셋은 항상 UTF-8이다(0.4.2 부터 지원).
 * @param {String} option.callbackid	type을 jsonp로 설정했을 때, callback함수 이름에 사용할 id를 직접 지정.(1.3.0 부터 지원).
 * @constructor
 * @author Kim, Taegon
 */
jindo.$Ajax = function (url, option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)) return new cl(url, option);

	function _getXHR() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (ActiveXObject) {
			try { return new ActiveXObject('MSXML2.XMLHTTP'); }
			catch(e) { return new ActiveXObject('Microsoft.XMLHTTP'); }
			return null;
		}
	}

	var loc    = location.toString();
	var domain = '';
	try { domain = loc.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]; } catch(e) {}

	this._url = url;
	this._options  = new Object;
	this._headers  = new Object;
	this._options = {
		type   :"xhr",
		method :"post",
		proxy  :"",
		timeout:0,
		onload :function(req){},
		onerror :null,
		ontimeout:function(req){},
		jsonp_charset : "utf-8",
		callbackid : ""
	};

	this.option(option);

	var _opt = this._options;

	_opt.type   = _opt.type.toLowerCase();
	_opt.method = _opt.method.toLowerCase();

	if (typeof window.__jindo2_callback == "undefined") {
		window.__jindo2_callback = new Array();
	}

	switch (_opt.type) {
		case "get":
		case "post":
			_opt.method = _opt.type;
			_opt.type   = "xhr";
		case "xhr":
			this._request = _getXHR();
			break;
		case "flash":
			this._request = new jindo.$Ajax.SWFRequest();
			break;
		case "jsonp":
			_opt.method = "get";
			this._request = new jindo.$Ajax.JSONPRequest();
			this._request.charset = _opt.jsonp_charset;
			this._request.callbackid = _opt.callbackid;
			break;
		case "iframe":
			this._request = new jindo.$Ajax.FrameRequest();
			this._request._proxy = _opt.proxy;
			break;
	}
};

/**
 * @ignore
 */
jindo.$Ajax.prototype._onload = function() {
	if (this._request.readyState == 4) {
		if ( this._request.status!=200 && typeof this._options.onerror == 'function')
			this._options.onerror(jindo.$Ajax.Response(this._request));
		else
			this._options.onload(jindo.$Ajax.Response(this._request));
	}
};

/**
 * request 메서드는 ajax 요청을 전송한다. ajax 요청에 사용할 매개변수는 생성자에서 설정하거나 option 메서드에서 변경할 수 있다.  요청 타입이 'flash'이면 이 메소드를 실행하기 전에 body 태그 내부에서 $Ajax.SWFRequest.write() 명령어를 반드시 실행해야 한다.
 * @param {Object} oData 서버로 전송할 데이터.
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload 핸들러
   }
});

ajax.request( {key1:"value1", key2:"value2"} );
 */
jindo.$Ajax.prototype.request = function(oData) {
	var t   = this;
	var req = this._request;
	var opt = this._options;
	var data, v,a = [], data = "";
	var _timer = null;

	if (typeof oData == "undefined" || !oData) {
		data = null;
	} else {
		for(var k in oData) {
			v = oData[k];
			if (typeof v == "function") v = v();
			a[a.length] = k+"="+encodeURIComponent(v);
		}
		data = a.join("&");
	}

	req.open(opt.method.toUpperCase(), this._url, true);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
	req.setRequestHeader("charset", "utf-8");
	for(var x in this._headers) {
		if (typeof this._headers[x] == "function") continue;
		req.setRequestHeader(x, String(this._headers[x]));
	}

	if (typeof req.onload != "undefined") {
		req.onload = function(rq){ clearTimeout(_timer); t._onload(rq) };
	} else {
		req.onreadystatechange = function(rq){ clearTimeout(_timer); t._onload(rq) };
	}

	if (opt.timeout > 0) {
		_timer = setTimeout(function(){ try{ req.abort(); }catch(e){}; opt.ontimeout(req); }, opt.timeout * 1000);
	}

	req.send(data);

	return this;
};

/**
 * abort 메서드는 서버로 전송한 ajax 요청을 취소한다. abort 메서드를 사용하면 네트워크 연결을 닫으며 대기중이던 요청은 취소된다. ajax 요청의 응답이 너무 오래 걸려서 취소하고 싶을 경우 abort 메서드를 사용할 수 있다.
 * @return 전송을 취소한 $Ajax 객체
 * @example
var ajax = $Ajax("http://www.remote.com", {
   onload : function(res) {
      // onload 핸들러
   }
}).request( {key1:"value1", key2:"value2"} );

function stopRequest() {
    ajax.abort();
}
 */
jindo.$Ajax.prototype.abort = function() {
	this._request.abort();

	return this;
};

/**
 * option 메서드는 ajax 요청에서 사용할 매개변수를 가져오거나 설정한다.
 * 매개변수를 설정하려면 매개 변수의 이름과 값, 혹은 매개변수의 이름과 값을 원소로 가지는 하나의 객체를 인수로 사용한다.
 * 만약 여러 개의 원소를 가진 객체를 사용하면 두 개 이상의 매개변수를 한 번에 설정할 수 있다.
 * @param {string|object} name 매개변수로 설정할 객체, 혹은 가지고 올 매개변수의 이름
 * @param {String}  [value] 새로 설정할 매개변수의 값
 * @return {String|$Ajax}  매개변수 값을 가져올 때는 문자열을, 매개변수 값을 설정할 때는 $Ajax 객체를 리턴한다.
 * @example
var request_type = ajax.option("type");
// ajax의 type 매개변수 값을 리턴한다.

ajax.option("method", "post");
// ajax의 method 매개변수를 post로 초기화한다.

ajax.option( { timeout : 0, onload : handler_func } );
// ajax의 timeout, onload 매개변수를 각각 0와 handler_func로 초기화한다.
 */
jindo.$Ajax.prototype.option = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._options[name];
		this._options[name] = value;
		return this;
	}

	try { for(var x in name) this._options[x] = name[x] } catch(e) {};

	return this;
};

/**
 * header 메서드는 ajax 요청에서 사용할 HTTP 요청 헤더를 가져오거나 설정한다.
 * 헤더를 설정하려면 헤더의 이름과 값, 혹은 헤더의 이름과 값을 원소로 가지는 하나의 객체를 인수로 사용한다.
 * 만약 여러 개의 원소를 가진 객체를 사용하면 두 개 이상의 헤더를 한 번에 설정할 수 있다.
 * 매개 변수의 값을 가져오려면 단순히 가지고 올 매개변수의 이름을 지정한다.
 * @param {String} name 가지고 오거나 설정할 헤더 이름
 * @param {Value} [value] 값을 설정할 헤더 값
 * @return {String|$Ajax} 설정된 헤더값 혹은 $Ajax 객체
 * @example
var customheader = ajax.header("myHeader");
// HTTP 요청 헤더에서 myHeader의 값

ajax.header( "myHeader", "someValue" );
// HTTP 요청 헤더의 myHeader = someValue

ajax.header( { anotherHeader : "someValue2" } );
// HTTP 요청 헤더의 anotherHeader = someValue2
 */
jindo.$Ajax.prototype.header = function(name, value) {
	if (typeof name == "undefined") return "";
	if (typeof name == "string") {
		if (typeof value == "undefined") return this._headers[name];
		this._headers[name] = value;
		return this;
	}

	try { for(var x in name) this._headers[x] = name[x] } catch(e) {};

	return this;
};

/**
 * Ajax 응답 객체
 * @class
 * @constructor
 * @param {Object} req 요청 객체
 */
jindo.$Ajax.Response  = function(req) {
	if (this === jindo.$Ajax) return new jindo.$Ajax.Response(req);
	this._response = req;
};

/**
 * 응답을 XML 객체로 반환한다.
 * @return {Object} 응답 XML 객체. XHR의 responseXML과 유사하다.
 */
jindo.$Ajax.Response.prototype.xml = function() {
	return this._response.responseXML;
};

/**
 * 응답을 문자열로 반환한다.
 * @return {String} 응답 문자열. XHR의 responseText와 유사하다.
 */
jindo.$Ajax.Response.prototype.text = function() {
	return this._response.responseText;
};

/**
 * 응답코드를 반환한다.
 * @return {int} 응답 코드. http응답코드표 참고.
 */
jindo.$Ajax.Response.prototype.status = function() {
	return this._response.status;
};

/**
 * readyState를 반환한다.
 * @return {int}  readyState. 
 */
jindo.$Ajax.Response.prototype.readyState = function() {
	return this._response.readyState;
};

/**
 * 응답을 Json객체로 반환한다.
 * @return {Object} 응답 JSON 객체. 응답 문자열을 자동으로 JSON 객체로 변환 후 반환한다. 변환 과정에서 오류가 발생하면 빈 객체를 반환한다.
 */
jindo.$Ajax.Response.prototype.json = function() {
	if (this._response.responseJSON) {
		return this._response.responseJSON;
	} else if (this._response.responseText) {
		try {
			return eval("("+this._response.responseText+")");
		} catch(e) {
			return {};
		}
	}

	return {};
};

/**
 * 응답헤더를 가져온다. 인자를 전달하지 않으면 모든 헤더를 반환한다.
 * @param {String} name 가져올 응답헤더의 이름
 * @return {String|Object} 인자가 있을 때는 해당하는 헤더 값을, 그렇지 않으면 전체 헤더를 반환한다.
 */
jindo.$Ajax.Response.prototype.header = function(name) {
	if (typeof name == "string") return this._response.getResponseHeader(name);
	return this._response.getAllResponseHeaders();
};

/**
 * @class
 */
jindo.$Ajax.RequestBase = jindo.$Class({
	_headers : {},
	_respHeaders : {},
	_respHeaderString : "",
	callbackid:"",
	responseXML  : null,
	responseJSON : null,
	responseText : "",
	status : 404,
	readyState : 0,
	$init  : function(){},
	onload : function(){},
	abort  : function(){},
	open   : function(){},
	send   : function(){},
	setRequestHeader  : function(sName, sValue) {
		this._headers[sName] = sValue;
	},
	getResponseHeader : function(sName) {
		return this._respHeaders[sName] || "";
	},
	getAllResponseHeaders : function() {
		return this._respHeaderString;
	},
	_getCallbackInfo : function() {
		var id = "";

		if(this.callbackid!="") {
			var idx = 0;
			do {
				id = "$" + this.callbackid + "_"+idx;
				idx++;
			}
			while (window.__jindo2_callback[id]);	
		}
		else{
			do {
				id = "$" + Math.floor(Math.random() * 10000);
			}
			while (window.__jindo2_callback[id]);
		}

		return {id:id,name:"window.__jindo2_callback."+id};
	}
});

/**
 * @class
 */
jindo.$Ajax.JSONPRequest = jindo.$Class({
	charset : "utf-8",
	_script : null,
	_callback : function(data) {
		var self = this;

		this.readyState = 4;
		this.status = 200;
		this.responseJSON = data;
		this.onload(this);

		setTimeout(function(){ self.abort() }, 10);
	},
	abort : function() {
		if (this._script) {
			try { this._script.parentNode.removeChild(this._script) }catch(e){};
		}
	},
	open  : function(method, url) {
		this.responseJSON = null;

		this._url = url;
	},
	send  : function(data) {
		var t    = this;
		var info = this._getCallbackInfo();
		var head = document.getElementsByTagName("head")[0];

		this._script = jindo.$("<script>");
		this._script.type    = "text/javascript";
		this._script.charset = this.charset;

		if (head) {
			head.appendChild(this._script);
		} else if (document.body) {
			document.body.appendChild(this._script);
		}

		window.__jindo2_callback[info.id] = function(data){
			try {
				t._callback(data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};

		this._script.src = this._url+"?_callback="+info.name+"&"+data;
		
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 * @class
 */
jindo.$Ajax.SWFRequest = jindo.$Class({
	_callback : function(success, data){
		this.readyState = 4;
		if (success) {
			if (typeof data == "string") {
				try {
					this.responseText = decodeURIComponent(data);
					this.status = 200;
				} catch(e) {}
			}
			this.onload(this);
		}
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;

		this._url    = url;
		this._method = method;
	},
	send : function(data) {
		this.responseXML  = false;
		this.responseText = "";

		var t    = this;
		var dat  = {};
		var info = this._getCallbackInfo();
		var swf  = window.document[jindo.$Ajax.SWFRequest._tmpId];
		var header = [];

		function f(arg) {
			switch(typeof arg){
				case "string":
					return '"'+arg.replace(/\"/g, '\\"')+'"';
					break;
				case "number":
					return arg;
					break;
				case "object":
					var ret = "", arr = [];
					if (arg instanceof Array) {
						for(var i=0; i < arg.length; i++) {
							arr[i] = f(arg[i]);
						}
						ret = "["+arr.join(",")+"]";
					} else {
						for(var x in arg) {
							arr[arr.length] = f(x)+":"+f(arg[x]);
						}
						ret = "{"+arr.join(",")+"}";
					}
					return ret;
				default:
					return '""';
			}
		}

		data = (data || "").split("&");

		for(var i=0; i < data.length; i++) {
			pos = data[i].indexOf("=");
			key = data[i].substring(0,pos);
			val = data[i].substring(pos+1);

			dat[key] = decodeURIComponent(val);
		}

		window.__jindo2_callback[info.id] = function(success, data){
			try {
				t._callback(success, data);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};

		swf.requestViaFlash(f({
			url  : this._url,
			type : this._method,
			data : dat,
			charset  : "UTF-8",
			callback : info.name,
			headers_json : this._headers
		}));
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 * $Ajax.SWFRequest.write는 요청 타입이 flash일 때, request 메소드가 호출되기 전 반드시 한 번 실행해야 한다(두 번 이상 실행해도 문제가 발생한다). 이 명령어가 호출되면 통신을 위한 swf 객체를 문서 내에 추가된다.
 * @param {String} [swf_path] 통신을 담당할 swf 파일의 경로. 기본값은 "./ajax.swf" 이다.
 */
jindo.$Ajax.SWFRequest.write = function(swf_path) {
	if(typeof swf_path == "undefined") swf_path = "./ajax.swf";
	jindo.$Ajax.SWFRequest._tmpId = 'tmpSwf'+(new Date).getMilliseconds()+Math.floor(Math.random()*100000);

	document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object id="'+jindo.$Ajax.SWFRequest._tmpId+'" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="'+swf_path+'"><param name = "allowScriptAccess" value = "always" /><embed name="'+jindo.$Ajax.SWFRequest._tmpId+'" src="'+swf_path+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true"></embed></object></div>');
};

/**
 * @class
 */
jindo.$Ajax.FrameRequest = jindo.$Class({
	_frame  : null,
	_proxy  : "",
	_domain : "",
	_callback : function(id, data, header) {
		var self = this;

		this.readyState   = 4;
		this.status = 200;
		this.responseText = data;

		this._respHeaderString = header;
		header.replace(/^([\w\-]+)\s*:\s*(.+)$/m, function($0,$1,$2) {
			self._respHeaders[$1] = $2;
		});

		this.onload(this);

		setTimeout(function(){ self.abort() }, 10);
	},
	abort : function() {
		if (this._frame) {
			try {
				this._frame.parentNode.removeChild(this._frame);
			} catch(e) {}
		}
	},
	open : function(method, url) {
		var re  = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var dom = document.location.toString().match(re);

		this._method = method;
		this._url    = url;
		this._remote = String(url).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
		this._frame = null;
		this._domain = (dom[1] != document.domain)?document.domain:"";
	},
	send : function(data) {
		this.responseXML  = "";
		this.responseText = "";

		var t      = this;
		var re     = /https?:\/\/([a-z0-9_\-\.]+)/i;
		var info   = this._getCallbackInfo();
		var url    = this._remote+"/ajax_remote_callback.html?method="+this._method;
		var header = new Array;

		window.__jindo2_callback[info.id] = function(id, data, header){
			try {
				t._callback(id, data, header);
			} finally {
				delete window.__jindo2_callback[info.id];
			}
		};

		for(var x in this._headers) {
			header[header.length] = "'"+x+"':'"+this._headers[x]+"'";
		}

		header = "{"+header.join(",")+"}";

		url += "&id="+info.id;
		url += "&header="+encodeURIComponent(header);
		url += "&proxy="+encodeURIComponent(this._proxy);
		url += "&domain="+this._domain;
		url += "&url="+encodeURIComponent(this._url.replace(re, ""));
		url += "#"+encodeURIComponent(data);

		var fr = this._frame = jindo.$("<iframe>");
		fr.style.position = "absolute";
		fr.style.visibility = "hidden";
		fr.style.width = "1px";
		fr.style.height = "1px";

		var body = document.body || document.documentElement;
		if (body.firstChild) body.insertBefore(fr, body.firstChild);
		else body.appendChild(fr);

		fr.src = url;
	}
}).extend(jindo.$Ajax.RequestBase);

/**
 * @fileOverview $H의 생성자 및 메서드를 정의한 파일
 * @name hash.js
 */
 
/**
 * $H 해시 객체를 리턴한다
 * @class $H 클래스는 키와 값을 원소로 가지는 열거형 배열인 해시를 구현하고, 해시를 다루기 위한 여러 가지 위한 메서드를 제공한다.  
 * @param {Object} hashObject 해시로 만들 객체.
 * @return {$H} 해시 객체
 * @constructor
 * @example
var h = $H({one:"first", two:"second", three:"third"})
 * @author Kim, Taegon
 */
jindo.$H = function(hashObject) {
	var cl = arguments.callee;
	if (typeof hashObject == "undefined") hashObject = new Object;
	if (hashObject instanceof cl) return hashObject;
	if (!(this instanceof cl)) return new cl(hashObject);

	this._table = {};
	for(var k in hashObject) {
		if (this._table[k] == hashObject[k]) continue;
		this._table[k] = hashObject[k];
	}
};

/**
 * $value 메서드는 해싱 대상인 객체를 반환한다.
 * @return {Object} 해싱 대상 객체
 */
jindo.$H.prototype.$value = function() {
	return this._table;
};

/**
 * $ 메서드는 키와 값을 설정하거나 키에 해당하는 값을 반환한다.
 * @param {String} key 키
 * @param {void} [value] 값
 * @return {void|$H} 키에 해당하는 값 혹은 $H 객체
 * @example
 * var hash = $H({one:"first", two:"second"});
 *
 * // 값을 설정할 때
 * hash.$("three", "third");
 * 
 * // hash => {one:"first", two:"second", three:"third"}
 *
 * // 값을 반환할 때
 * var three = hash.$("three");
 *
 * // three => "third"
 */
jindo.$H.prototype.$ = function(key, value) {
	if (typeof value == "undefined") {
		return this._table[key];
	} 

	this._table[key] = value;
	return this;
};

/**
 * length 메서드는 해시 객체의 크기를 반환한다.
 * @return {Number} 해시의 크기
 */
jindo.$H.prototype.length = function() {
	var i = 0;
	for(var k in this._table) {
		if (typeof Object.prototype[k] != "undeifned" && Object.prototype[k] === this._table[k]) continue;
		i++;
	}

	return i;
};

/**
 * forEach 메서드는 해시 객체의 키와 값을 인수로 지정한 콜백 함수를 실행한다.
 * @param {Function} callback 실행할 콜백 함수 
 * @param {Object} thisObject 콜백 함수의 this
 * @example
function printIt(value, key) {
   document.write(key+" => "+value+" <br>");
}
$H({one:"first", two:"second", three:"third"}).forEach(printIt);
 */
jindo.$H.prototype.forEach = function(callback, thisObject) {
	var t = this._table;
	var h = this.constructor;
	
	for(var k in t) {
		if (!t.propertyIsEnumerable(k)) continue;
		try {
			callback.call(thisObject, t[k], k, t);
		} catch(e) {
			if (e instanceof h.Break) break;
			if (e instanceof h.Continue) continue;
		}
	}
	return this;
};

/**
 * filter 메서드는 해시 객체에서 필터 콜백 함수를 만족하는 원소를 수집한다. 수집한 원소는 새로운 $H 객체의 원소가 된다.
 * 콜백함수는 Boolean 값을 반환해야 한다.
 * @param {Function} callback 필터 콜백 함수 
 * @param {Object} thisObject 콜백 함수의 this
 * @return {$H} 수집한 원소로 새로 만든 해시 객체
 * @remark 필터 콜백 함수의 결과가 true인 원소만 수집한다. 콜백 함수는 형식은 예제를 참고한다.
 * @example
function callback(value, key, object) {
   // value    해시의 값 
   // key      해시의 고유한 키 혹은 이름
   // object   JavaScript Core Object 객체
}
 */
jindo.$H.prototype.filter = function(callback, thisObject) {
	var h = $H();
	this.forEach(function(v,k,o) {
		if(callback.call(thisObject, v, k, o) === true) {
			h.add(k,v);
		}
	});
	return h;
};

/**
 * map 메서드는 해시 객체의 원소를 인수로 콜백 함수를 실행하고, 함수의 리턴 값을 해당 원소의 값으로 지정한다.
 * @param {Function} callback 콜백 함수
 * @param {Object} thisObject 콜백 함수의 this
 * @return {$H} 값을 변경한 해시 객체
 * @remark 콜백 함수는 형식은 예제를 참고한다.
 * @example
function callback(value, key, object ) {
   // value    해시의 값 
   // key      해시의 고유한 키 혹은 이름
   // object   JavaScript Core Object 객체
 
   var r = key+"_"+value;
   document.writeln (r + "<br />"); 
   return r;
}
$H({one:"first", two:"second", three:"third"}).map(callback);
 */
jindo.$H.prototype.map = function(callback, thisObject) {
	var t = this._table;
	this.forEach(function(v,k,o) {
		t[k] = callback.call(thisObject, v, k, o);
	});
	return this;
};

/**
 * 해시 테이블에 값을 추가한다.
 * @param {String} key 추가한 값을 위한 키 
 * @param {String} value 해시 테이블에 추가할 값
 * @return {$H} 값을 추가한 해시 객체
 */
jindo.$H.prototype.add = function(key, value) {
	if (this.hasKey(key)) return null;
	this._table[key] = value;

	return this;
};

/**
 * remove 메서드는 해시 테이블의 원소를 제거한다.
 * @param {String} key 제거할 원소의 키
 * @return {void} 제거한 키 값
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.remove ("two");
// h의 해시 테이블은 {one:"first", three:"third"}
 */
jindo.$H.prototype.remove = function(key) {
	if (typeof this._table[key] == "undefined") return null;
	var val = this._table[key];
	delete this._table[key];
	
	return val;
};

/**
 * search 메서드는 해시 테이블에서 인수로 지정한 값을 찾는다.
 * @param {String} value 검색할 값
 * @returns {String | Boolean} 값을 찾았다면 값에 대한 키. 값을 찾지 못했다면 false. 
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.search ("second");
// two

h.search ("fist");
// false
 */
jindo.$H.prototype.search = function(value) {
	var result = false;
	this.forEach(function(v,k,o) {
		if (v === value) {
			result = k;
			jindo.$H.Break();
		}
	});
	return result;
};

/**
 * hasKey 메서드는 해시 테이블에 인수로 지정한 키가 있는지 찾는다.
 * @param {String} key 해시 테이블에서 검색할 키
 * @return {Boolean} 키의 존재 여부
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.hasKey("four"); // false
h.hasKey("one"); // true
 */
jindo.$H.prototype.hasKey = function(key) {
	var result = false;
	
	return (typeof this._table[key] != "undefined");
};

/**
 * hasValue 메서드는 해시 테이블에 인수로 지정한 값이 있는지 확인한다.
 * @param {String} value 해시 테이블에서 검색할 값
 * @return {Boolean} 값의 존재 여부
 */
jindo.$H.prototype.hasValue = function(value) {
	return (this.search(value) !== false);
};

/**
 * sort 메서드는 값을 기준으로 원소를 오름차순 정렬한다.
 * @return {$H} 원소를 정렬한 해시 객체.
 * @see $H#ksort
 * @example
var h = $H({one:"하나", two:"둘", three:"셋"});
h.sort ();
// {two:"둘", three:"셋", one:"하나"}
 */
jindo.$H.prototype.sort = function() {
	var o = new Object;
	var a = this.values();
	var k = false;

	a.sort();

	for(var i=0; i < a.length; i++) {
		k = this.search(a[i]);

		o[k] = a[i];
		delete this._table[k];
	}
	
	this._table = o;
	
	return this;
};

/**
 * ksort 메서드는 키를 기준으로 원소를 오름차순 정렬한다. 
 * @return {$H} 원소를 정렬한 해시 객체
 * @see $H#sort
 * @example
var h = $H({one:"하나", two:"둘", three:"셋"});
h.sort ();
// h => {one:"하나", three:"셋", two:"둘"}
 */
jindo.$H.prototype.ksort = function() {
	var o = new Object;
	var a = this.keys();

	a.sort();

	for(var i=0; i < a.length; i++) {
		o[a[i]] = this._table[a[i]];
	}

	this._table = o;

	return this;
};

/**
 * keys 메서드는 해시 키의 배열을 반환한다.
 * @return {Array} 해시 키의 배열
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.keys ();
// ["one", "two", "three"]
 * @see $H#values
 */
jindo.$H.prototype.keys = function() {
	var keys = new Array;
	for(var k in this._table) {
		keys.push(k);
	}

	return keys;
};

/**
 * values 메서드는 해시 값의 배열을 반환한다.
 * @return {Array} 해시 값의 배열
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.values();
// ["first", "second", "third"]
 * @see $H#keys
 */
jindo.$H.prototype.values = function() {
	var values = [];
	for(var k in this._table) {
		values[values.length] = this._table[k];
	}

	return values;
};

/**
 * toQueryString은 해시 객체를 쿼리 스트링 형태로 만든다.
 * @return {String} 
 * @example
var h = $H({one:"first", two:"second", three:"third"});
h.toQueryString();
// "one=first&two=second&three=third"
 */
jindo.$H.prototype.toQueryString = function() {
	var buf = [], val = null, idx = 0;
	for(var k in this._table) {
		if (typeof(val = this._table[k]) == "object" && val.constructor == Array) {
			for(i=0; i < val.length; i++) {
				buf[buf.length] = encodeURIComponent(k)+"[]="+encodeURIComponent(val[i]+"");
			}
		} else {
			buf[buf.length] = encodeURIComponent(k)+"="+encodeURIComponent(this._table[k]+"");
		}
	}
	
	return buf.join("&");
};

/**
 * empty는 해시 객체를 빈 객체로 만든다.
 * @return {$H} 비워진 해시 객체
 * @example
var hash = $H({a:1, b:2, c:3});
// hash => {a:1, b:2, c:3}

hash.empty();
// hash => {}
 */
jindo.$H.prototype.empty = function() {
	var keys = this.keys();

	for(var i=0; i < keys.length; i++) {
		delete this._table[keys[i]];
	}

	return this;
};

/**
 * Break 메서드는 반복문의 실행을 중단할 때 사용한다.
 * @remark forEach, filter, map와 같은 루프를 중단한다. 강제로 exception을 발생시키므로 try ~ catch 영역에서 이 메소드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (k == "b") $H.Break();
   ...
});
 * @see $H.Continue
 */
jindo.$H.Break = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * Continue 메서드는 루프를 실행하다 다음 단계로 넘어갈 때 사용한다. 
 * @remark forEach, filter, map와 같은 루프 실행 도중에 현재 루프를 중단하고 다음으로 넘어간다. 강제로 exception을 발생시키므로 try ~ catch 영역에서 이 메소드를 실행하면 정상적으로 동작하지 않을 수 있다.
 * @example
$H({a:1, b:2, c:3}).forEach(function(v,k,o) {
   ...
   if (v % 2 == 0) $H.Continue();
   ...
});
 * @see $H.Break
 */
jindo.$H.Continue = function() {
	if (!(this instanceof arguments.callee)) throw new arguments.callee;
};

/**
 * @fileOverview $Json의 생성자 및 메서드를 정의한 파일
 * @name json.js
 */

/**
 * $Json 객체를 반환한다.
 * @class $Json 객체는 Javascipt에서 JSON(JavaScript Object Notation)을 다루기 위한 다양한 메서드를 제공한다.
 * @param {Object | String} sObject 객체, 혹은 JSON으로 인코딩 가능한 문자열.
 * @return {$Json} 인수를 인코딩한 $Json 객체.
 * @remark XML 문자를 사용하여 $Json 객체를 생성하려면 $Json#fromXML 메서드를 사용한다.
 * @example 
var oStr = $Json ('{ zoo: "myFirstZoo", tiger: 3, zebra: 2}');

var d = {name : 'nhn', location: 'Bundang-gu'}
var oObj = $Json (d);

 * @constructor
 * @author Kim, Taegon
 */
jindo.$Json = function (sObject) {
	var cl = arguments.callee;
	if (typeof sObject == "undefined") sObject = new Object;
	if (sObject instanceof cl) return sObject;
	if (!(this instanceof cl)) return new cl(sObject);
	
	if (typeof sObject == "string") {
		try {
			sObject = eval("("+sObject+")");
		} catch(e) {
			sObject = new Object;
		}
	}

	this._object = sObject;
}

/**
 * fromXML 메서드는 XML 문자열을 $Json 객체로 인코딩한다.
 * @param {String} sXML $Json  객체로 인코딩할 XML 문자열 
 * @returns {Object} $Json 객체
 * @remark 속성과 CDATA를 가지는 태그는 CDATA를 '$cdata' 속성과 값으로 인코딩한다.  
 * @example
var j1 = $Json.fromXML('<data>only string</data>');
// {"data":"only string"}

var j2 = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
{"data":{"id":"Faqh%$","str":{"attr":"123","$cdata":"string value"}}} 
  */
jindo.$Json.fromXML = function(sXML) {
	var o  = new Object;
	var re = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*(?:>(?:(<\/\1>)|\s*)|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*([^<]*))|(?:\/>)\s*/ig;
	var re2= /^[0-9]+(?:\.[0-9]+)?$/;
	var ec = {"&amp;":"&","&nbsp;":" ","&quot;":"\"","&lt;":"<","&gt;":">"};
	var fg = {tags:["/"],stack:[o]};
	var es = function(s){return s.replace(/&[a-z]+;/g, function(m){ return (typeof ec[m] == "string")?ec[m]:m; })};
	var at = function(s,c){s.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function($0,$1,$2,$3){c[$1] = es(($2?$2.replace(/\\"/g,'"'):undefined)||($3?$3.replace(/\\'/g,"'"):undefined));}) };
	var em = function(o){for(var x in o){if(Object.prototype[x])continue;return false;};return true};
	var cb = function($0,$1,$2,$3,$4,$5) {
		var cur, cdata = "";
		var idx = fg.stack.length - 1;
		
		if (typeof $1 == "string" && $1) {
			if ($1.substr(0,1) != "/") {
				var has_attr = (typeof $2 == "string" && $2);
				var closed   = (typeof $3 == "string" && $3);
				var newobj   = (!has_attr && closed)?"":{};

				cur = fg.stack[idx];
				
				if (typeof cur[$1] == "undefined") {
					cur[$1] = newobj; 
					cur = fg.stack[idx+1] = cur[$1];
				} else if (cur[$1] instanceof Array) {
					var len = cur[$1].length;
					cur[$1][len] = newobj;
					cur = fg.stack[idx+1] = cur[$1][len];  
				} else {
					cur[$1] = [cur[$1], newobj];
					cur = fg.stack[idx+1] = cur[$1][1];
				}
				
				if (has_attr) at($2,cur);

				fg.tags[idx+1] = $1;

				if (closed) {
					fg.tags.length--;
					fg.stack.length--;
				}
			} else {
				fg.tags.length--;
				fg.stack.length--;
			}
		} else if (typeof $4 == "string" && $4) {
			cdata = $4;
		} else if (typeof $5 == "string" && $5) {
			cdata = es($5);
		}
		
		if (cdata.length > 0) {
			var par = fg.stack[idx-1];
			var tag = fg.tags[idx];

			if (re2.test(cdata)) cdata = parseFloat(cdata);
			else if (cdata == "true" || cdata == "false") cdata = new Boolean(cdata);

			if (par[tag] instanceof Array) {
				var o = par[tag];
				if (typeof o[o.length-1] == "object" && !em(o[o.length-1])) {
					o[o.length-1].$cdata = cdata;
					o[o.length-1].toString = function(){ return cdata; }
				} else {
					o[o.length-1] = cdata;
				}
			} else {
				if (typeof par[tag] == "object" && !em(par[tag])) {
					par[tag].$cdata = cdata;
					par[tag].toString = function(){ return cdata; }
				} else {
					par[tag] = cdata;
				}
			}
		}
	};
	
	sXML = sXML.replace(/<(\?|\!-)[^>]*>/g, "");
	sXML.replace(re, cb);
	
	return jindo.$Json(o);
};

/**
 * get 메서드는 $Json 객체의 값을 path 형태로 리턴한다.
 * @param {String} sPath path 문자열
 * @return {Array} 객체의 배열
 * @example
var j = $Json.fromXML('<data><id>Faqh%$</id><str attr="123">string value</str></data>');
var r = j.get ("/data/id");
// Faqh%$

 */
jindo.$Json.prototype.get = function(sPath) {
	var o = this._object;
	var p = sPath.split("/");
	var re = /^([\w:\-]+)\[([0-9]+)\]$/;
	var stack = [[o]], cur = stack[0];
	var len = p.length, c_len, idx, buf, j, e;
	
	for(var i=0; i < len; i++) {
		if (p[i] == "." || p[i] == "") continue;
		if (p[i] == "..") {
			stack.length--;
		} else {
			buf = [];
			idx = -1;
			c_len = cur.length;
			
			if (c_len == 0) return [];
			if (re.test(p[i])) idx = +RegExp.$2;
			
			for(j=0; j < c_len; j++) {
				e = cur[j][p[i]];
				if (typeof e == "undefined") continue;
				if (e instanceof Array) {
					if (idx > -1) {
						if (idx < e.length) buf[buf.length] = e[idx];
					} else {
						buf = buf.concat(e);
					}
				} else if (idx == -1) {
					buf[buf.length] = e;
				}
			}
			
			stack[stack.length] = buf;
		}
		
		cur = stack[stack.length-1];
	}

	return cur;
};

/**
 * toString 메서드는 $Json 객체를 JSON 문자열로 변환한다.
 * @return {String} JSON 문자열
 * @example
var j = $Json({foo:1, bar: 31});
document.write (j.toString());
document.write (j);

 */
jindo.$Json.prototype.toString = function() {
	var func = {
		$ : function($) {
			if (typeof $ == "undefined") return '""';
			if (typeof $ == "boolean") return $?"true":"false";
			if (typeof $ == "string") return this.s($);
			if (typeof $ == "number") return $;
			if ($ instanceof Array) return this.a($);
			if ($ instanceof Object) return this.o($);
		},
		s : function(s) {
			var e = {'"':'\\"',"\\":"\\\\","\n":"\\n","\r":"\\r","\t":"\\t"};
			var c = function(m){ return (typeof e[m] != "undefined")?e[m]:m };
			return '"'+s.replace(/[\\"'\n\r\t]/g, c)+'"';
		},
		a : function(a) {
			var s = "[",c = "",n=a.length;
			for(var i=0; i < n; i++) {
				if (typeof a[i] == "function") continue;
				s += c+this.$(a[i]);
				if (!c) c = ",";
			}
			return s+"]";
		},
		o : function(o) {
			var s = "{",c = "";
			for(var x in o) {
				if (typeof o[x] == "function") continue;
				s += c+this.s(x)+":"+this.$(o[x]);
				if (!c) c = ",";
			}
			return s+"}";
		}
	}

	return func.$(this._object);
};

/**
 * toXML 메서드는 $Json 객체를 XML 문자열로 변환한다.
 * @return {String} XML 문자열
 * @example
var json = $Json({foo:1, bar: 31});
json.toXML();
// <foo>1</foo><bar>31</bar>
 */
jindo.$Json.prototype.toXML = function() {
	var f = function($,tag) {
		var t = function(s,at) { return "<"+tag+(at||"")+">"+s+"</"+tag+">" };
		
		switch (typeof $) {
			case "undefined":
			case "null":
				return t("");
			case "number":
				return t($);
			case "string":
				if ($.indexOf("<") < 0) return t($.replace(/&/g,"&amp;"));
				else return t("<![CDATA["+$+"]]>");
			case "boolean":
				return t(String($));
			case "object":
				var ret = "";
				if ($ instanceof Array) {
					var len = $.length;
					for(var i=0; i < len; i++) { ret += f($[i],tag); };
				} else {
					var at = "";

					for(var x in $) {
						if (x == "$cdata" || typeof $[x] == "function") continue;
						ret += f($[x], x);
					}

					if (tag) ret = t(ret, at);
				}
				return ret;
		}
	};
	
	return f(this._object, "");
};

/**
 * toObject 메서드는 $Json 객체 내부의 JSON 데이터 객체를 반환한다.
 * @return {Object} 데이터 객체
 * @example
var json = $Json({foo:1, bar: 31});
json.toObject();
// {foo: 1, bar: 31}
 */
jindo.$Json.prototype.toObject = function() {
	return this._object;
};

/**
 * $value 메서드는 $Json.toObject의 별칭(Alias)이다. 
 * @return {Object} 데이터 객체
 */
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;
/**
 * @fileOverview $Cookie의 생성자 및 메서드를 정의한 파일
 * @name cookie.js
 */

/**
 * $Cookie 객체를 생성한다.
 * @class $Cookie 클래스는 쿠키(Cookie)를 추가, 수정, 혹은 삭제하거나 쿠키의 값을 가져온다.
 * @constructor
 * @author Kim, Taegon
 * @example 
var cookie = $Cookie();
cookie.set("session_id", "eac312d1d51ab", 1);

document.write (cookie.keys());
 */
jindo.$Cookie = function() {
	var cl = arguments.callee;
	var cached = cl._cached;
	
	if (cl._cached) return cl._cached;
	if (!(this instanceof cl)) return new cl;
	if (typeof cl._cached == "undefined") cl._cached = this;
};

/**
 * 쿠키 이름의 배열을 반환한다.
 * @return {Array} 쿠키 이름의 배열
 */
jindo.$Cookie.prototype.keys = function() {
	var ca = document.cookie.split(";");
	var re = /^\s+|\s+$/g;
	var a  = new Array;
	
	for(var i=0; i < ca.length; i++) {
		a[a.length] = ca[i].substr(0,ca[i].indexOf("=")).replace(re, "");
	}
	
	return a;
};

/**
 * 이름에 해당하는 쿠키 값을 가져온다. 값이 존재하지 않는다면 null을 반환한다.
 * @param {String} sName 쿠키 이름
 * @return {String} 쿠키 값
 * @example 
var cookie = $Cookie();
cookie.set("session_id", "eac312d1d51ab", 1);

// ...

document.write (cookie.get ("session_id"));
 */
jindo.$Cookie.prototype.get = function(sName) {
	var ca = document.cookie.split(/\s*;\s*/);
	var re = new RegExp("^(\\s*"+sName+"\\s*=)");
	
	for(var i=0; i < ca.length; i++) {
		if (re.test(ca[i])) return unescape(ca[i].substr(RegExp.$1.length));
	}
	
	return null;
};

/**
 * 이름에 해당하는 쿠키 값을 설정한다.
 * @param {String} sName 쿠키 이름.
 * @param {String} sV체lue 쿠키 값.
 * @param {Number} [nDays] 쿠키 유효 시간. 유효 시간은 일단위로 설정한다. 유효시간을 생략했다면 쿠키는 웹 브라우저가 종료되면서 없어진다.
 * @param {String} [sDomain] 쿠키 도메인.
 * @return {$Cookie} $Cookie 객체
 */
jindo.$Cookie.prototype.set = function(sName, sValue, nDays, sDomain) {
	var sExpire = "";
	
	if (typeof nDays == "number") {
		sExpire = ";expires="+(new Date((new Date()).getTime()+nDays*1000*60*60*24)).toGMTString();
	}
	if (typeof sDomain == "undefined") sDomain = "";
	
	document.cookie = sName+"="+escape(sValue)+sExpire+"; path=/"+(sDomain?"; domain="+sDomain:"");
	
	return this;
};

/**
 * 이름에 해당하는 쿠키 값을 제거한다.
 * @param {String} sName 쿠키 이름
 * @return {$Cookie} $Cookie 객체
 */
jindo.$Cookie.prototype.remove = function(sName) {
	if (this.get(sName) != null) this.set(sName, "", -1);
	
	return this;
};

/**
 * @fileOverview $Element의 생성자 및 메서드를 정의한 파일
 * @name element.js
 */

/**
 * $Element 객체를 생성 및 리턴한다.
 * @class $Element 클래스는 DOM 엘리먼트를 다루기 위한 여러 가지 메서드를 제공한다.
 * @param {Element | String} el	$Element를 사용할 DOM 엘리먼트, 혹은 DOM 엘리먼트의 고유한 id. 만약 고유하지 않은 id를 지정하면 가장 먼저 나오는 엘리먼트를 반환한다.
 * @constructor
 * @author Kim, Taegon
 */
jindo.$Element = function(el) {
	var cl = arguments.callee;
	if (el && el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._element = jindo.$(el);
	
	// tagname
	this.tag = (this._element&&this._element.tagName)?this._element.tagName.toLowerCase():''; 

	this._queue = new Array;
}

/**
 * $value 메서드는 래핑된 원래의 DOM 엘리먼트를 리턴한다.
 * @return {HTMLElement} DOM 엘리먼트
 */
jindo.$Element.prototype.$value = function() {
	return this._element;
};

/**
 * visible 메서드는 DOM 엘리먼트의 CSS의 display 속성을 조사해서 엘리먼트가 보이는 상태인지 확인한다.
 * @param {Boolean} bVisible 엘리먼트를 보이거나 안 보이게 설정한다. true면 show() 메서드를, false면 hide() 메서드를 실행하는 것과 동일한 결과를 얻는다.
 * @return {Boolean|$Element} display 속성이 none이면 false 를, 그 외의 값이면 true를 리턴한다. 설정하게 되면 현재의 this 객체를 반환한다.
 * @since 설정 기능은 1.1.2부터
 */
jindo.$Element.prototype.visible = function(bVisible) {
	if (typeof bVisible != "undefined") {
		this[bVisible?"show":"hide"]();
		return this;
	}

	return (this.css("display") != "none");
};

/**
 * show 메서드는 DOM 엘리먼트가 화면에 보이도록 CSS의 display 속성을 변경한다.
 * @return {$Element} display 속성을 변경한 $Element 객체.
 * @see $Element#hide
 */
jindo.$Element.prototype.show = function() {
	var s = this._element.style;
	var b = "block";
	var c = {p:b,div:b,form:b,h1:b,h2:b,h3:b,h4:b,ol:b,ul:b,fieldset:b,td:"table-cell",th:"table-cell",li:"list-item",table:"table",thead:"table-header-group",tbody:"table-row-group",tfoot:"table-footer-group",tr:"table-row",col:"table-column",colgroup:"table-column-group",caption:"table-caption",dl:b,dt:b,dd:b};

	try {
		if(typeof c[this.tag] == "string") {
			s.display = c[this.tag];
		} else {
			s.display = "inline";
		}
	} catch(e) {
		s.display = "block";
	}

	return this;
};

/**
 * hide 메서드는 DOM 엘리먼트가 화면에 보이지 않도록 CSS의 display 속성을 none으로 변경한다.
 * @returns {Object} this	display 속성을 변경한 $Element 객체.
 * @see $Element#show
 */
jindo.$Element.prototype.hide = function() {
	this._element.style.display = "none";

	return this;
};

/**
 * toggle 메서드는 CSS의 Display 속성을 변경하여 DOM 엘리먼트를 화면에 보이거나 보이지 않게 한다.
 * @returns {Object} this display 속성을 변경한 $Element 객체.
 * @see $Element#show
 * @see $Element#hide
 * @example

var isOpen 	= e.toggle().visible();
var bullet	= (isOpen) ? '-' : '+';

 */
jindo.$Element.prototype.toggle = function() {
	this[this.visible()?"hide":"show"]();

	return this;
};

/**
 * opacity 메서드는 DOM 엘리먼트의 투명도 값을 리턴하거나 설정한다.
 * @param {Number} value	설정할 투명도 값. 투명도 값은 0 ~ 1 사이의 실수값으로 정한다. 값이 0보다 작으면 0을, 1보다 크면 1을 설정한다.
 * @return {Number} DOM 엘리먼트의 투명도 값.
 */
jindo.$Element.prototype.opacity = function(value) {
	var v,e = this._element,b=this.visible();
	
	value = parseFloat(value);
	
	if (!isNaN(value)) {
		value = Math.max(Math.min(value,1),0);

		if (typeof e.filters != "undefined") {
			value = Math.ceil(value*100);
			if (typeof e.filters.alpha != "undefined") {
				e.filters.alpha.opacity = value;
			} else {
				e.style.filter = (e.style.filter + " alpha(opacity=" + value + ")");
			}
		} else {
			e.style.opacity = value;
		}

		return value;
	}

	if (typeof e.filters != "undefined") {
		v = (typeof e.filters.alpha == "undefined")?(b?100:0):e.filters.alpha.opacity;
		v = v / 100;
	} else {
		v = parseFloat(e.style.opacity);
		if (isNaN(v)) v = b?1:0;
	}

	return v;
};

/**
 * appear 메서드는 DOM 엘리먼트를 서서히 나타나게 한다. (Fade-in 효과)
 * @param {Number} duration DOM 엘리먼트의 투명도가 현재의 값에서 시작해서 1이 될때 까지 걸리는 시간. 단위는 초를 사용한다.
 * @param {Function} callback DOM 엘리먼트가 완전히 나타난 후, 즉 투명도가 1이 된 후에 실행할 콜백 함수.
 * @returns {Object} $Element 객체
 * @see $Element#show
 * @see $Element#disappear
 */
jindo.$Element.prototype.appear = function(duration, callback) {
	var self = this;
	var op   = this.opacity();

	if (op == 1) return this;
	try { clearTimeout(this._fade_timer); } catch(e){};

	callback = callback || new Function;

	var step = (1-op) / ((duration||0.3)*100);
	var func = function(){
		op += step;
		self.opacity(op);

		if (op >= 1) {
			callback(self);
		} else {
			self._fade_timer = setTimeout(func, 10);
		}
	};

	this.show();
	func();

	return this;
};

/**
 * disappear 메서드는 DOM 엘리먼트를 서서히 사라지게 한다. (Fade-out 효과) DOM 엘리먼트가 완전히 사라지면 엘리먼트의 CSS 중 display 속성은 none으로 변한다.
 * @param {Number} duration DOM 엘리먼트의 투명도가 현재의 값에서 0이 될 때까지 걸리는 시간. 단위는 초를 사용한다.
 * @param {Function} callback DOM 엘리먼트가 완전히 사라지고 난 후, 즉 투명도가 0이 된 후에 실행할 콜백 함수
 * @returns {Object} $Element 객체
 * @see $Element#hide
 * @see $Element#appear
 */
jindo.$Element.prototype.disappear = function(duration, callback) {
	var self = this;
	var op   = this.opacity();

	if (op == 0) return this;
	try { clearTimeout(this._fade_timer); } catch(e){};

	callback = callback || new Function;

	var step = op / ((duration||0.3)*100);
	var func = function(){
		op -= step;
		self.opacity(op);

		if (op <= 0) {
			self.hide();
			callback(self);
		} else {
			self._fade_timer = setTimeout(func, 10);
		}
	};

	func();

	return this;
};

/**
 * css 메서드는 DOM 엘리먼트의 CSS 속성값을 가져오거나 설정한다. 속성값의
 * 인수 하나를 사용하면 CSSS에서 String에 해당하는 CSS 속성의 값을 가져온다.
 * 인수 두 개를 사용하면 첫번째 인수에 해당하는 CSS 속성을 두번째 인수의 값으로 설정한다.
 * Object 혹은 $Hash 타입의 객체를 사용하면 두 개 이상의 CSS 속성을 한꺼번에 정의할 수 있다.
 * @remark CSS 속성은 Camel 표기법을 사용한다. 따라서 border-width-bottom은 borderWidthBottom으로 정의한다.
 * @remark float 속성은 Javascript의 예약어로 사용하므로 css 메서드에서는 float 대신 cssFloat를 사용한다. (Internet Explorer에서는 styleFloat를, 그 외의 브라우저에서는 cssFloat를 사용한다.)
 * @param {String | Object | $H} sName CSS 속성 | 하나 이상의 CSS 속성과 값을 가지는 객체.
 * @param {String | Number} [sValue] CSS 속성에 설정할 값. 단위가 필요한 값은 Number, 혹은 단위를 포함하는 String으로 정의한다.
 * @return {String | $Element} 값을 가져올 때는 String 설정값을, 값을 설정할 때는 값을 설정한 현재의 $Element를 리턴한다. 값을 설정할 때 CSS 속성이 존제하지 않으면 null을 리턴한다.
 * @example

<style>
	#btn {
		width: 120px;
		height: 30px;
		background-color: blue;
	}
</style>

...

<script type="text/javascript" charset="utf-8">
	window.onload = function () {
		$Element('btn').css('backgroundColor');
		// rgb (0, 0, 256)

		$Element('btn').css('backgroundColor', 'red');
		// $Element('btn').css('backgroundColor') -> reb (255, 0, 0)

		$Element('btn').css({
			width: "200px",
			height: "80px"
		});
		// $Element('btn').css('width') -> "200px"
		// $Element('btn').css('height') -> "80px"
 	}
</script>
 */
jindo.$Element.prototype.css = function(sName, sValue) {
	var e = this._element;

	if (sName == 'opacity') return typeof sValue == 'undefined' ? this.opacity() : this.opacity(sValue);

	if (typeof sName == "string") {
		var view;

		if (typeof sValue == "string" || typeof sValue == "number") {
			var obj = new Object;
			obj[sName] = sValue;
			sName = obj;
		} else {
			if (e.currentStyle) {
				if (sName == "cssFloat") sName = "styleFloat";
				return e.currentStyle[sName]||e.style[sName];
			} else if (window.getComputedStyle) {
				if (sName == "cssFloat") sName = "float";
				var d = e.ownerDocument || e.document || document;
				return d.defaultView.getComputedStyle(e,null).getPropertyValue(sName.replace(/([A-Z])/g,"-$1").toLowerCase())||e.style[sName];
			} else {
				if (sName == "cssFloat" && /MSIE/.test(window.navigator.userAgent)) sName = "styleFloat";
				return e.style[sName];
			}

			return null;
		}
	}

	if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
		sName = sName.$value();
	}

	if (typeof sName == "object") {
		var v, type;

		for(var k in sName) {
			v    = sName[k];
			type = (typeof v);
			if (type != "string" && type != "number") continue;
			if (k == "cssFloat" && navigator.userAgent.indexOf("MSIE") > -1) k = "styleFloat";
			try {
				e.style[k] = v;
			} catch(err) {
				if (k == "cursor" && v == "pointer") {
					e.style.cursor = "hand";
				} else if (("#top#left#right#bottom#").indexOf(k+"#") > 0 && (type == "number" || !isNaN(parseInt(v)))) {
					e.style[k] = parseInt(v)+"px";
				}
			}
		}
	}

	return this;
};

/**
 * attr 메서드는 DOM 엘리먼트의 HTML 속성을 가져오거나 설정한다.
 * 하나의 인수만 사용하면 해당 HTML 속성의 속성값을 가져온다.
 * 두 개의 인수를 사용하면 첫번째 인수에 해당하는 HTML 속성의 속성값을 설정한다.
 * Object 혹은 $Hash 타입의 객체를 사용하면 두 개 이상의 HTML 속성을 한꺼번에 정의할 수 있다.
 * @param {String | Object | $H} sName HTML 속성 이름 혹은 설정값 객체
 * @param {String | Number} [sValue] 설정값. 설정값을 null로 지정하면 HTML 속성을 지운다.
 * @return {String | $Element} 값을 가져올 때는 String 설정값을, 값을 설정할 때는 값을 설정한 현재의 $Element를 리턴한다.
 */
jindo.$Element.prototype.attr = function(sName, sValue) {
	var e = this._element;

	if (typeof sName == "string") {
		if (typeof sValue != "undefined") {
			var obj = new Object;
			obj[sName] = sValue;
			sName = obj;
		} else {
			if (sName == "class" || sName == "className") return e.className;
			return e.getAttribute(sName);
		}
	}

	if (typeof jindo.$H != "undefined" && sName instanceof jindo.$H) {
		sName = sName.$value();
	}

	if (typeof sName == "object") {
		for(var k in sName) {
			if (typeof(sValue) != "undefined" && sValue === null) e.removeAttribute(k);
			else e.setAttribute(k, sName[k]);
		}
	}

	return this;
};

/**
 * offset 메서드는 DOM 엘리먼트의 위치를 가져오거나 설정한다. 기준점은 브라우저 문서의 왼쪽 상단이다. offset 메서드의 인수로 top, left 값을 지정하면 DOM 엘리먼트의 위치를 설정한다.
 * @remark 일부 브라우저와 일부 상황에서 inline 엘리먼트에 대한 위치가 올바르게 얻어지지 않는 문제가 있으며 이 경우 해당 엘리먼트를 position:relative; 로 바꿔주는 식으로 해결할 수 있다.
 * @author Hooriza
 * @param {Number} [nTop] 문서의 맨 위에서 부터 엘리먼트 맨 위까지의 거리. 단위는 px.
 * @param {Number} [nLeft] 문서의 왼쪽 가장자리에서 엘리먼트의 왼쪽 가장자리까지의 거리. 단위는 px.
 * @return {$Element | Object} 엘리먼트의 위치를 설정하면 기존 엘리먼트를, 엘리먼트의 위치를 가져오면 엘리먼트의 x, y 좌표를 속성으로 가지는 객체.
 */
jindo.$Element.prototype.offset = function(nTop, nLeft) {

	var oEl = this._element;
	var oPhantom = null;

	// setter
	if (typeof nTop == 'number' && typeof nLeft == 'number') {

		if (isNaN(parseInt(this.css('top')))) this.css('top', 0);
		if (isNaN(parseInt(this.css('left')))) this.css('left', 0);

		var oPos = this.offset();
		var oGap = { top : nTop - oPos.top, left : nLeft - oPos.left };

		oEl.style.top = parseInt(this.css('top')) + oGap.top + 'px';
		oEl.style.left = parseInt(this.css('left')) + oGap.left + 'px';

		return this;

	}

	// getter
	var bSafari = /Safari/.test(navigator.userAgent);
	var bIE = /MSIE/.test(navigator.userAgent);

	var fpSafari = function(oEl) {

		var oPos = { left : 0, top : 0 };

		for (var oParent = oEl, oOffsetParent = oParent.offsetParent; oParent = oParent.parentNode; ) {

			if (oParent.offsetParent) {

				oPos.left -= oParent.scrollLeft;
				oPos.top -= oParent.scrollTop;

			}

			if (oParent == oOffsetParent) {

				oPos.left += oEl.offsetLeft + oParent.clientLeft;
				oPos.top += oEl.offsetTop + oParent.clientTop ;

				if (!oParent.offsetParent) {

					oPos.left += oParent.offsetLeft;
					oPos.top += oParent.offsetTop;

				}

				oOffsetParent = oParent.offsetParent;
				oEl = oParent;
			}
		}

		return oPos;

	};

	var fpOthers = function(oEl) {

		var oPos = { left : 0, top : 0 };

		var oDoc = oEl.ownerDocument || oEl.document || document;
		var oHtml = oDoc.documentElement;
		var oBody = oDoc.body;

		if (oEl.getBoundingClientRect) { // has getBoundingClientRect

			if (!oPhantom) {

				if (bIE && window.external) {

					oPhantom = { left : 2, top : 2 };

					/*
					var oBase = oDoc.createElement('div');
					oBase.style.cssText = 'position:absolute !important; left:0 !important; top:0 !important; margin:0 !important; padding:0 !important;';
					oDoc.body.insertBefore(oBase, oDoc.body.firstChild);

					oPhantom = oBase.getBoundingClientRect();
					oPhantom.left += oHtml.scrollLeft || oBody.scrollLeft;
					oPhantom.top += oHtml.scrollTop || oBody.scrollTop;

					oDoc.body.removeChild(oBase);
					*/

					oBase = null;

				} else {

					oPhantom = { left : 0, top : 0 };

				}

			}

			var box = oEl.getBoundingClientRect();
			if (oEl !== oHtml && oEl !== oBody) {

				oPos.left = box.left - oPhantom.left;
				oPos.top = box.top - oPhantom.top;

				oPos.left += oHtml.scrollLeft || oBody.scrollLeft;
				oPos.top += oHtml.scrollTop || oBody.scrollTop;

			}

		} else if (oDoc.getBoxObjectFor) { // has getBoxObjectFor

			var box = oDoc.getBoxObjectFor(oEl);
			var vpBox = oDoc.getBoxObjectFor(oHtml || oBody);

			oPos.left = box.screenX - vpBox.screenX;
			oPos.top = box.screenY - vpBox.screenY;

		} else {

			for (var o = oEl; o; o = o.offsetParent) {

				oPos.left += o.offsetLeft;
				oPos.top += o.offsetTop;

			}

			for (var o = oEl.parentNode; o; o = o.parentNode) {

				if (o.tagName == 'BODY') break;
				if (o.tagName == 'TR') oPos.top += 2;

				oPos.left -= o.scrollLeft;
				oPos.top -= o.scrollTop;

			}

		}

		return oPos;

	};

	return (bSafari ? fpSafari : fpOthers)(oEl);
};

/**
 * width 메서드는 DOM 엘리먼트의 너비를 가져오거나 설정한다.
 * @remark width 메서드는 엘리먼트의 실제 너비를 가져온다. 브라우저마다 Box 모델의 크기 계산 방법이 다르므로 CSS의 width 속성값과 width 메서드의 리턴 값은 서로 다를 수 있다.
 * @param {Number} [width]	설정할 너비. 단위는 px.
 * @return {Number|$Element} DOM 엘리먼트의 실제 너비. 너비를 설정하면 this를 반환한다.
 */
jindo.$Element.prototype.width = function(width) {
	if (typeof width == "number") {
		var e = this._element;

		e.style.width = width+"px";
		if (e.offsetWidth != width) {
			e.style.width = (width*2 - e.offsetWidth) + "px";
		}

		return this;
	}

	return this._element.offsetWidth;
};

/**
 * height 메서드는 DOM 엘리먼트의 높이를 가져오거나 설정한다.
 * @remark height 메서드는 엘리먼트의 실제 높이를 가져온다. 브라우저마다 Box 모델의 크기 계산 방법이 다르므로 CSS의 height 속성값과 height 메서드의 리턴 값은 서로 다를 수 있다.
 * @param {Number} height	설정할 높이. 단위는 px.
 * @return {Number|$Element} DOM 엘리먼트의 실제 높이. 높이를 설정하면 this를 반환한다.
 */
jindo.$Element.prototype.height = function(height) {
	if (typeof height == "number") {
		var e = this._element;

		e.style.height = height+"px";
		if (e.offsetHeight != height) {
			e.style.height = (height*2 - e.offsetHeight) + "px";
		}

		return this;
	}

	return this._element.offsetHeight;
};

/**
 * className 메서드는 DOM 엘리먼트에 클래스 이름을 설정하거나 반환한다.
 * @param {String} sClass 	클래스 이름. 두 개 이상의 클래스를 설정했다면 공백을 포함한 문자열을 반환한다.
 * @example

<div id="zoo" class="animal rest">

..

<script type="text/javascript">

var el = $Element("zoo");
el.className();
// "animal rest"

el.className("entertainment");
el.className();
// "entertainment"

</script>
 */
jindo.$Element.prototype.className = function(sClass) {
	var e = this._element;

	if (typeof sClass == "undefined") return e.className;
	e.className = sClass;

	return this;
};

/**
 * hasClass 메서드는 DOM 엘리먼트에서 특정한 클래스를 사용하고 있는지 확인한다.
 * @param {String} sClass 확인할 클래스 셀랙터
 * @return {Boolean} 클래스의 사용 여부.
 */
jindo.$Element.prototype.hasClass = function(sClass) {
	return (" "+this._element.className+" ").indexOf(" "+sClass+" ") > -1;
};

/**
 * addClass 메서드는 DOM 엘리먼트에 클래스를 추가한다.
 * @param {String} sClass 추가할 클래스 셀랙터
 * @return {$Element} 현재의 DOM 엘리먼트
 */
jindo.$Element.prototype.addClass = function(sClass) {
	var e = this._element;
	if (this.hasClass(sClass)) return this;
	e.className = (e.className+" "+sClass).replace(/^\s+/, "");
	return this;
};

/**
 * removeClass 메서드는 DOM 엘리먼트에서 특정 클래스를 제거한다.
 * @param {String} sClass 제거할 클래스 이름
 * @return {$Element} 현재의 DOM 엘리먼트
 */
jindo.$Element.prototype.removeClass = function(sClass) {
	var e = this._element;
	e.className = (e.className+" ").replace(sClass+" ", "").replace(/\s+$/, "");

	return this;
};

/**
 * toggle 메서드는 클래스 셀렉터을 토글한다. 하나의 클래스 셀렉터를 인수로 사용하면 해당 클래스만 토글하고, 두 개의 셀렉터를 인수로 사용하면 사용하고 있는 셀렉터는 지우고, 나머지 셀렉터를 추가한다.
 * @param {Object} sClass	클래스 셀렉터 이름. 하나의 클래스 셀렉터만 인수로 사용하면, DOM 엘리먼트에서 해당 클래스 셀렉터를 사용하는지 확인한다. 만약 셀렉터를 사용하고 있다면 해당 셀렉터를 지운다. 사용하고 있지 않다면 해당 셀렉터를 추가한다.
 * @param {Object} [sClass2]	클래스 셀렉터 이름.  두 개의 클래스 셀렉터를 인수로 사용하면, 두 셀렉터 중 사용하고 있는 셀랙터를 지우고 나머지 셀렉터를 추가한다.
 * @import core.$Element[hasClass,addClass,removeClass]
 * @example

<div id="naver" class="search highlight active">Naver</div>

<script>
var r = $Element("naver")
r.toggleClass("highlight");
// <div id="naver" class="search active">Naver</div>

r.toggleClass("highlight");
// <div id="naver" class="search highlight active">Naver</div>

r.toggleClass("active", "deactive");
// <div id="naver" class="search highlight deactive">Naver</div>

r.toggleClass("active", "deactive");
// <div id="naver" class="search highlight active">Naver</div>
</script>

 */
jindo.$Element.prototype.toggleClass = function(sClass, sClass2) {
	sClass2 = sClass2 || "";
	if (this.hasClass(sClass)) {
		this.removeClass(sClass);
		if (sClass2) this.addClass(sClass2);
	} else {
		this.addClass(sClass);
		if (sClass2) this.removeClass(sClass2);
	}

	return this;
};

/**
 * text 메서드는 DOM 엘리먼트의 텍스트 노드값을 가져오거나 설정한다. String 타입의 인수를 지정하면 인수의 값으로 텍스트 노드를 변경하고 변경한 결과를 리턴한다.
 * @param {String} sText 설정할 텍스트
 * @returns {String} 설정한 텍스트 값
 */
jindo.$Element.prototype.text = function(sText) {
	var prop = (typeof this._element.innerText != "undefined")?"innerText":"textContent";

	if (this.tag == "textarea" || this.tag == "input") prop = "value";

	if (typeof sText == "string") {
		try { this._element[prop] = sText; } catch(e) {
			return this.html(sText.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
		}
		return this;
	}

	return this._element[prop];
};

/**
 * html 메서드는 DOM 엘리먼트의 내부 HTML(innerHTML)을 가져오거나 설정한다. String 타입의 인수를 지정하면 인수의 값으로 내부 HTML을 변경하고 변경한 결과를 리턴한다.
 * @param {String} sHTML 설정할 HTML 문자열
 * @return {String} 내부 HTML
 */
jindo.$Element.prototype.html = function(sHTML) {
	if (typeof sHTML == "string") {

		var oEl = this._element;
		var bBugAgent = jindo.$Agent().navigator().ie || (jindo.$Agent().navigator().firefox && !oEl.parentNode);
		
		if (bBugAgent) {

			/*
				IE 나 FireFox 의 일부 상황에서 SELECT 태그나 TABLE, TR, THEAD, TBODY 태그에 innerHTML 을 셋팅해도
				문제가 생기지 않도록 보완 - hooriza
			*/
			var sId = 'R' + new Date().getTime() + parseInt(Math.random() * 100000);
			var oDoc = oEl.ownerDocument || oEl.document || document;

			var oDummy;
			var sTag = oEl.tagName.toLowerCase();

			switch (sTag) {
			case 'select':
			case 'table':
				oDummy = jindo.$('<div>');
				oDummy.innerHTML = '<' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '>';
				break;

			case 'tr':
			case 'thead':
			case 'tbody':
				oDummy = jindo.$('<div>');
				oDummy.innerHTML = '<table><' + sTag + ' class="' + sId + '">' + sHTML + '</' + sTag + '></table>';
				break;

			default:
				oEl.innerHTML = sHTML;
				break;
			}

			if (oDummy) {

				var oFound;
				for (oFound = oDummy.firstChild; oFound; oFound = oFound.firstChild)
					if (oFound.className == sId) break;

				if (oFound) {

					for (var oChild; oChild = oEl.firstChild;) oChild.removeNode(true); // innerHTML = '';

					for (var oChild = oFound.firstChild; oChild; oChild = oFound.firstChild)
						oEl.appendChild(oChild);

					oDummy.removeNode && oDummy.removeNode(true);

				}

				oDummy = null;

			}

		} else {

			oEl.innerHTML = sHTML;

		}
		
		return this;

	}

	return this._element.innerHTML;
};

/**
 * evalScripts 메서드는 인자로 들어온 문자열 중에서 &lt;script&gt; 태그 안에 있는 내용을 파싱해서 eval 로 수행한다.
 * @param {String} sHTML &lt;script&gt; 태그가 포함된 HTML 문자열
 * @return {$Element} 현재의 DOM 엘리먼트
 */
jindo.$Element.prototype.evalScripts = function(sHTML) {
	
	var aJS = [];
    sHTML = sHTML.replace(new RegExp('<script(\\s[^>]+)*>(.*?)</'+'script>', 'gi'), function(_, _, sPart) { aJS.push(sPart); return ''; });
    eval(aJS.join('\n'));
    
    return this;

};

/**
 * outerHTML 메서드는 DOM 엘리먼트의 외부 HTML(outerHTML)을 반환한다.
 * @return {String} 외부 HTML
 */
jindo.$Element.prototype.outerHTML = function() {
	var e = this._element;
	if (typeof e.outerHTML != "undefined") return e.outerHTML;

	var div = jindo.$("<div>");
	var par = e.parentNode;

	par.insertBefore(div, e);
	div.style.display = "none";
	div.appendChild(e);

	var s = div.innerHTML;
	par.insertBefore(e, div);
	par.removeChild(div);

	return s;
};

/**
 * toString 메서드는 DOM 엘리먼트를 HTML 문자열로 변환하여 리턴한다. 리턴값은 outerHTML과 동일하다.
 * @return {String} 외부 HTML
 */
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;

/**
 * append 메서드는 인수로 지정한 DOM 엘리먼트를 복사하여 $Element 객체의 마지막 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement	추가할 DOM 엘리먼트
 * @returns {Object} 새로운 자식노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.append = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	this._element.appendChild(o);

	return jindo.$Element(o);
};

/**
 * prepend 메서드는 인수로 지정한 DOM 엘리먼트를 복사하여 $Element 객체의 첫번째 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement	추가할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} 새로운 자식 노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.prepend = function(oElement) {
	var e = this._element;
	var o = jindo.$Element(oElement).$value();

	if (e.childNodes.length > 0) {
		e.insertBefore(o, e.childNodes[0]);
	} else {
		e.appendChild(o);
	}

	return jindo.$Element(o);
};

/**
 * replace 메서드는 $Element 객체의 노드를 인수로 지정한 DOM 엘리먼트로 대체한다.
 * @param {$Element | HTMLElement | String} oElement	대체할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} DOM 엘리먼트가 대체된 $Element 객체
 */
jindo.$Element.prototype.replace = function(oElement) {
	var e = this._element;
	var o = jindo.$Element(oElement).$value();

	e.parentNode.insertBefore(o, e);
	e.parentNode.removeChild(e);

	return jindo.$Element(o);
};

/**
 * appendTo 메서드는 인수로 지정한 엘리먼트를 $Element 객체의 마지막 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement 추가할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} 자식 노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.appendTo = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	o.appendChild(this._element);

	return this;
};

/**
 * prependTo 메서드는 인수로 지정한 엘리먼트를 $Element 객체의 첫번째 자식 노드로 추가한다.
 * @param {$Element | HTMLElement | String} oElement 추가할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {$Element} 자식 노드를 추가한 $Element 객체
 */
jindo.$Element.prototype.prependTo = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	if (o.childNodes.length > 0) {
		o.insertBefore(this._element, o.childNodes[0]);
	} else {
		o.appendChild(this._element);
	}

	return this;
};

/**
 * before 메서드는 인수로 지정한 엘리먼트를 $Element 객체 바로 앞에 삽입한다.
 * @param {$Element | HTMLElement | String} oElement 삽입할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {Object} 삽입한 DOM 엘리먼트
 */
jindo.$Element.prototype.before = function(oElement) {
	var o = jindo.$Element(oElement).$value();

	this._element.parentNode.insertBefore(o, this._element);

	return jindo.$Element(o);
};

/**
 * after 메서드는 인수로 지정한 엘리먼트를 $Element 객체의 바로 뒤에 지정한 DOM 엘리먼트를 삽입한다.
 * @param {$Element | HTMLElement | String} oElement 삽입할 DOM 엘리먼트, 혹은 엘리먼트의 id
 * @returns {Object} 삽입한 DOM 엘리먼트
 */
jindo.$Element.prototype.after = function(oElement) {
	var o = this.before(oElement);
	o.before(this);

	return o;
};

/**
 * parent 메서드는 특정 노드의 부모 노드 (컨테이너 노드)를 검색한다.
 * @param {String} [pFunc] 상위 노드의 검색 조건을 지정한 콜백 함수. 여러 상위 노드를 조건 없이 검색하려면 pFunc를 null로 설정하고 limit에 상위 노드의 개수를 설정한다.
 * @param {Number} [limit] 탐색할 상위 노드의 개수.
 * @returns {$Element | Array} 부모 노드, 혹은 상위 노드의 배열. 부모 노드만 리턴할 경우 $Element 타입을, 상위 노드의 배열을 리턴할 경우 $Element의 배열을 리턴한다.
 */
jindo.$Element.prototype.parent = function(pFunc, limit) {
	var e = this._element;
	var a = [], p = null;

	if (typeof pFunc == "undefined") return jindo.$Element(e.parentNode);
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	while (e.parentNode && limit-- != 0) {
		p = jindo.$Element(e.parentNode);
		if (e.parentNode == document.documentElement) break;
		if (!pFunc || (pFunc && pFunc(p))) a[a.length] = p;

		e = e.parentNode;
	}

	return a;
};

/**
 * child 메서드는 자식 노드를 검색한다.
 * @param {Function} [pFunc]  자식 노드의 검색 조건을 지정한 콜백 함수. 여러 하위 노드를 조건 없이 검색하려면 pFunc를 null로 설정하고 limit에 하위 노드의 개수를 설정한다.
 * @param {Number} [limit] 탐색할 하위 노드 개수
 * @returns {$Element | Array} 자식 노드, 혹은 조건에 맞는 자식 노드의 배열. 자식 노드 하나만 리턴할 경우 $Element 타입을, 자식 노드의 배열을 리턴할 경우 $Element의 배열을 리턴한다.
 */
jindo.$Element.prototype.child = function(pFunc, limit) {
	var e = this._element;
	var a = [], c = null, f = null;

	if (typeof pFunc == "undefined") return jindo.$A(e.childNodes).filter(function(v){ return v.nodeType == 1}).map(function(v){ return jindo.$Element(v) }).$value();
	if (typeof limit == "undefined" || limit == 0) limit = -1;

	(f = function(el, lim){
		var ch = null, o = null;

		for(var i=0; i < el.childNodes.length; i++) {
			ch = el.childNodes[i];
			if (ch.nodeType != 1) continue;

			o = jindo.$Element(el.childNodes[i]);
			if (!pFunc || (pFunc && pFunc(o))) a[a.length] = o;
			if (lim != 0) f(el.childNodes[i], lim-1);
		}
	})(e, limit-1);

	return a;
};

/**
 * prev 메서드는 특정 노드의 이전에 나오는 형제 노드를 검색한다.
 * @param {String} [pFunc] 이전 형제 노드의 검색 조건을 지정한 콜백 함수. pFunc를 생략하면 바로 전의 형제 노드를 리턴한다.
 * @returns {$Element | Array} pFunc의 조건에 맞는 형제 $Element의 배열, 혹은 바로 전의 형제 노드를 가리키는 $Element.
 */
jindo.$Element.prototype.prev = function(pFunc) {
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.previousSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};

/**
 * next 메서드는 특정 노드의 다음에 나오는 형제 노드를 검색한다.
 * @param {String} pFunc 다음 형제 노드의 검색 조건을 지정한 콜백 함수. pFunc를 생략하면 바로 다음의 형제 노드를 가리키는 $Element를 리턴한다.
 * @returns {$Element | Array} pFunc의 조건에 맞는 형제 $Element의 배열, 혹은 바로 다음의 형제 노드를 가리키는 $Element.
 */
jindo.$Element.prototype.next = function(pFunc) {
	var e = this._element;
	var a = [];
	var b = (typeof pFunc == "undefined");

	if (!e) return b?jindo.$Element(null):a;
	
	do {
		e = e.nextSibling;
		
		if (!e || e.nodeType != 1) continue;
		if (b) return jindo.$Element(e);
		if (!pFunc || pFunc(e)) a[a.length] = jindo.$Element(e);
	} while(e);

	return b?jindo.$Element(e):a;
};

/**
 * first 메소드는 현재 노드의 처음 자식 노드를 반환한다. 엘리먼트 노드에 대해서만 적용된다.
 * @since 1.2.0
 * @returns {$Element} 마지막 자식 노드
 */
jindo.$Element.prototype.first = function() {
	var el = this._element.firstElementChild||this._element.firstChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.nextSibling;

	return el?jindo.$Element(el):null;
}

/**
 * last 메소드는 현재 노드의 처음 자식 노드를 반환한다. 엘리먼트 노드에 대해서만 적용된다.
 * @since 1.2.0
 * @returns {$Element} 마지막 자식 노드
 */
jindo.$Element.prototype.last = function() {
	var el = this._element.lastElementChild||this._element.lastChild;
	if (!el) return null;
	while(el && el.nodeType != 1) el = el.previousSibling;

	return el?jindo.$Element(el):null;
}

/**
 * isChildOf 메서드는 현재 노드가 지정한 노드의 자식 노드인지 확인한다.
 * @param {HTMLElement | String | $Element} element 부모 노드인지 확인할 DOM 엘리먼트, 혹은 DOM 엘리먼트의 고유한 id
 * @returns {Boolean} 현재 노드가 인수로 지정한 노드의 자식 노드이면 true, 그렇지 않으면 false를 리턴한다.
 */
jindo.$Element.prototype.isChildOf = function(element) {
	var e  = this._element;
	var el = jindo.$Element(element).$value();

	while(e && e.parentNode) {
		e = e.parentNode;
		if (e == el) return true;
	}
	return false;
};

/**
 * isParentOf 메서드는 현재 노드가 지정한 노드의 부모인지 확인한다.
 * @param {HTMLElement,$Element} element	자식 노드인지 확인할 DOM 엘리먼트, 혹은 DOM 엘리먼트의 고유한 id.
 * @returns {Boolean} 현재 노드가 인수로 지정한 노드의 부모이면 true, 그렇지 않으면 false
 */
jindo.$Element.prototype.isParentOf = function(element) {
	var el = jindo.$Element(element).$value();

	while(el && el.parentNode) {
		el = el.parentNode;
		if (this._element == el) return true;
	}
	return false;
};

/**
 * isEqual 메서드는 현재 객체와 인자로 주어진 객체가 같은 엘리먼트인지 확인한다.
 * @param {HTMLElement, $Element} element 비교할 엘리먼트 객체
 * @returns {Boolean} 같은 노드이면 true, 그렇지 않으면 false
 */
jindo.$Element.prototype.isEqual = function(element) {
	try {
		return (this._element === jindo.$Element(element).$value());
	} catch(e) {
		return false;
	}
};

/**
 * fireEvent 메서드는 DOM 엘리먼트에 이벤트를 발생시킨다.
 * @param {String} sEvent 실행할 이벤트 이름. on 접두사는 생략한다.
 * @return {$Element} 이벤트를 발생시킨 DOM 엘리먼트
 */
jindo.$Element.prototype.fireEvent = function(sEvent) {
	function IE(sEvent) {
		sEvent = (sEvent+"").toLowerCase();
		this._element.fireEvent("on"+sEvent);
		return this;
	};

	function DOM2(sEvent) {
		var sType = "HTMLEvents";
		sEvent = (sEvent+"").toLowerCase();

		if (sEvent == "click" || sEvent.indexOf("mouse") == 0) {
			sType = "MouseEvents";
			if (sEvent == "mousewheel") sEvent = "dommousescroll";
		} else if (sEvent.indexOf("key") == 0) {
			sType = "KeyEvents";
		}

		var evt   = document.createEvent(sType);

		evt.initEvent(sEvent, true, true);

		this._element.dispatchEvent(evt);
		return this;
	};

	jindo.$Element.prototype.fireEvent = (typeof this._element.dispatchEvent != "undefined")?DOM2:IE;

	return this.fireEvent(sEvent);
};

/**
 * empty 메서드는 현재 노드의 자식 노드를 모두 제거한다.
 * @return {$Element} 자식 노드를 모두 제거한 현재 노드
 */
jindo.$Element.prototype.empty = function() {
	this.html("");
	return this;
};

/**
 * leave 메서드는 현재 노드를 부모 노드에서 제거한다.
 * @return {$Element} 부모 노드에서 제거한 $Element 개체
 */
jindo.$Element.prototype.leave = function() {
	var e = this._element;

	if (e.parentNode) {
		e.parentNode.removeChild(e);
	}

	return this;
};

/**
 * wrap 메서드는 인수로 지정한 노드로 현재 노드를 감싼다.
 * @param {String | HTMLElement} wrapper 감쌀 노드 혹은 노드의 고유한 id 값
 * @return {$Element} 새로운 노드로 감싸진 $Element 개체
 */
jindo.$Element.prototype.wrap = function(wrapper) {
	var e = this._element;

	wrapper = jindo.$(wrapper);
	if (e.parentNode) {
		e.parentNode.insertBefore(wrapper, e);
	}
	wrapper.appendChild(e);

	return this;
};

/**
 * ellipsis 메서드는 DOM 엘리먼트의 텍스트 노드가 브라우저에 한 줄로 보이도록 길이를 조절한다. 길이를 조절한다면 stringTail에서 지정한 문자열을 텍스트 노드의 맨 끝에 붙인다.
 * @remark 이 메서드는 엘리먼트가 텍스트 노드만 포함한다고 가정한다. 따라서, 이외의 상황에서의 동작은 보장하지 않는다.
 * @remark 브라우저에서의 엘리먼트 너비를 측정하고 그 너비를 기준으로 텍스트 노드의 길이를 정하므로 엘리먼트는 반드시 보이는 상태이어야 한다.
 * @remark 화면에 전체 텍스트 노드가 보였다가 줄어드는 경우가 있다. 따라서, 엘리먼트에서 overflow:hidden 속성을 활용하면 이런 현상을 줄일 수 있다. ??
 * @param {String} stringTail 말줄임 표시자. 생락하면 말줄임표('...')를 사용한다.
 */
jindo.$Element.prototype.ellipsis = function(stringTail) {
	stringTail = stringTail || "...";

	var txt   = this.text();
	var len   = txt.length;
	var cur_h = this.height();
	var i     = 0;
	var h     = this.text('A').height();

	if (cur_h < h * 1.5) return this.text(txt);

	cur_h = h;
	while(cur_h < h * 1.5) {
		i += Math.max(Math.ceil((len - i)/2), 1);
		cur_h = this.text(txt.substring(0,i)+stringTail).height();
	}

	while(cur_h > h * 1.5) {
		i--;
		cur_h = this.text(txt.substring(0,i)+stringTail).height();
	}
};

/**
 * indexOf 메소드는 주어진 엘리먼트가 이 객체의 몇 번째 자식노드인지 반환한다. 인덱스는 0부터 시작하므로 첫번째 자식 노드를 인자로 전달하면 0을 반환한다. 주어진 엘리먼트가 이 객체의 자식이 아니라면, 다시 말해, 주어진 엘리먼트를 자식 노드에서 찾지 못했다면 -1을 반환한다.
 * @param {HTMLElement, $Element} element 검색할 엘리먼트
 * @since 1.2.0
 * @return {Number} 검색 결과
 */
jindo.$Element.prototype.indexOf = function(element) {
	try {
		var e = jindo.$Element(element).$value();
		var n = this._element.childNodes;
		var c = 0;
		var l = n.length;

		for (var i=0; i < l; i++) {
			if (n[i].nodeType != 1) continue;

			if (n[i] === e) return c;
			c++;
		}
	}catch(e){}

	return -1;
};
/**
 * @fileOverview $Fn의 생성자 및 메서드를 정의한 파일
 * @name function.js
 */

/**
 * 함수 객체를 리턴한다.
 * @name $Fn
 * @extends core
 * @class $Fn 클래스는 Javascript 함수의 레퍼 클래스이다.  ??
 * @constructor
 * @param {Function | String} func 함수 객체 혹은 함수의 인자를 지정한 문자열
 * @param {Object | String} thisObject 함수 객체가 다른 객체의 메서드일 때, 해당 객체도 같이 전달한다. 혹은 함수 몸체를 지정하는 문자열.
 * @return {$Fn} $Fn 객체
 * @see $Fn#toFunction
 * @example
var someObject = {
    func : function() {
       // code here
   }
}

var fn = $Fn(someObject.func, someObject);
 * @author Kim, Taegon
 */
jindo.$Fn = function(func, thisObject) {
	var cl = arguments.callee;
	if (func instanceof cl) return func;
	if (!(this instanceof cl)) return new cl(func, thisObject);

	this._events = [];
	this._tmpElm = null;
	this._key    = null;

	if (typeof func == "function") {
		this._func = func;
		this._this = thisObject;
	} else if (typeof func == "string" && typeof thisObject == "string") {
		this._func = new Function(func, thisObject);
	}
}

/**
 * $value 메서드는 원래의 Function 객체를 반환한다.
 * @return {Function} 함수 객체
 */
jindo.$Fn.prototype.$value = function() {
	return this._func;
};

/**
 * bind 메서드는 객체와 메서드를 묶어 하나의 Function으로 반환한다.
 * @return {Function} 메소드로 묶인 Funciton 객체
 * @see $Fn#bindForEvent
 */
jindo.$Fn.prototype.bind = function() {
	var a = jindo.$A(arguments).$value();
	var f = this._func;
	var t = this._this;

	var b = function() {
		var args = jindo.$A(arguments).$value();

		// fix opera concat bug
		if (a.length) args = a.concat(args);

		return f.apply(t, args);
	};

	return b;
};

/**
 * bingForEvent는 객체와 메서드를 묶어 하나의 이벤트 핸들러 Function으로 반환한다.
 * @param {Element, ...} [elementN] 이벤트 객체와 함께 전달할 값
 * @see $Fn#bind
 * @see $Event
 */
jindo.$Fn.prototype.bindForEvent = function() {
	var a = arguments;
	var f = this._func;
	var t = this._this;
	var m = this._tmpElm || null;

	var b = function(e) {
		var args = jindo.$A(a);
		if (typeof e == "undefined") e = window.event;

		if (typeof e.currentTarget == "undefined") {
			e.currentTarget = m;
		}

		args.unshift(jindo.$Event(e));

		return f.apply(t, args.$value());
	};

	return b;
};

/**
 * attach 메서드는 함수를 특정 엘리먼트의 이벤트 헨들러로 등록한다.
 * @remark 이벤트 이름은 on 접두어를 사용하지 않는다.
 * @remark 마우스 휠 스크롤 이벤트는 mousewheel 로 사용한다.
 * @param {Element} oElement 이벤트를 추가할 엘리먼트
 * @param {String} sEvent 추가할 이벤트의 종류
 * @see $Fn#detach
 */
jindo.$Fn.prototype.attach = function(oElement, sEvent) {
	var fn = null, l, ev = sEvent, el = oElement, ua = navigator.userAgent;

	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.attach(el[i], ev);
		return this;
	}

	if (!el || !ev) return this;
	if (typeof el.$value == "function") el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();
	
	this._tmpElm = el;
	fn = this.bindForEvent();
	this._tmpElm = null;

	if (typeof el.addEventListener != "undefined") {
		if (ev == "domready") ev = "DOMContentLoaded";
		else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0) ev = "DOMMouseScroll";
		el.addEventListener(ev, fn, false);
	} else if (typeof el.attachEvent != "undefined") {
		if (ev == "domready") {
			jindo.$Fn._domready(el, fn);
			return this;
		} else {
			el.attachEvent("on"+ev, fn);
		}
	}
	
	if (!this._key) {
		this._key = "$"+jindo.$Fn.gc.count++;
		jindo.$Fn.gc.pool[this._key] = this;
	}

	this._events[this._events.length] = {element:el, event:sEvent.toLowerCase(), func:fn};

	return this;
};

/**
 * detach 메서드는 함수를 특정 엘리먼트의 이벤트에서 제거한다.
 * @remark 이벤트 이름은 on 접두어를 사용하지 않는다.
 * @remark 마우스 휠 스크롤 이벤트는 mousewheel 로 사용한다.
 * @param {Element} oElement 이벤트를 제거할 엘리먼트
 * @param {String} sEvent 제거할 이벤트의 이름
 * @see $Fn#attach
 */
jindo.$Fn.prototype.detach = function(oElement, sEvent) {
	var fn = null, l, el = oElement, ev = sEvent, ua = navigator.userAgent;
	
	if ((el instanceof Array) || (jindo.$A && (el instanceof jindo.$A) && (el=el.$value()))) {
		for(var i=0; i < el.length; i++) this.detach(el[i], ev);
		return this;
	}

	if (!el || !ev) return this;
	if (jindo.$Element && el instanceof jindo.$Element) el = el.$value();

	el = jindo.$(el);
	ev = ev.toLowerCase();

	var e = this._events;
	for(var i=0; i < e.length; i++) {
		if (e[i].element !== el || e[i].event !== ev) continue;
		
		fn = e[i].func;
		this._events = jindo.$A(this._events).refuse(e[i]).$value();
		break;
	}

	if (typeof el.removeEventListener != "undefined") {
		if (ev == "domready") ev = "DOMContentLoaded";
		else if (ev == "mousewheel" && ua.indexOf("WebKit") < 0) ev = "DOMMouseScroll";
		el.removeEventListener(ev, fn, false);
	} else if (typeof el.detachEvent != "undefined") {
		if (ev == "domready") {
			jindo.$Fn._domready.list = jindo.$Fn._domready.list.refuse(fn);
			return this;
		} else {
			el.detachEvent("on"+ev, fn);
		}
	}

	return this;
};

/**
 * delay 메서드는 지정한 시간 이후에 지정한 인수로 함수를 호출한다.
 * @param {Number} nSec 함수를 호출할 때까지 기다릴 시간.
 * @param {Array} args 함수를 호출할 때 사용할 인수. 여러 개의 인수를 전달해기 위해 배열을 사용한다.
 * @see $Fn#bind
 * @example
function popup_sum(a, b) {
    alert(a + b);
}

$Fn(popup_sum).delay(5, [3, 5]);
 */
jindo.$Fn.prototype.delay = function(nSec, args) {
	if (typeof args == "undefined") args = [];
	setTimeout(this.bind.apply(this, args), nSec*1000);

	return this;
};

/**
 * 메모리에서 이 객체를 사용한 참조를 모두 해제한다(직접 호출 금지).
 * @ignore
 */
jindo.$Fn.prototype.free = function() {
	var len = this._events.length;
	while(len > 0) {
		this.detach(this._events[--len].element, this._events[len].event);
	}
	try { delete jindo.$Fn.gc.pool[this._key]; }catch(e){};
};

/**
 * IE에서 domready(=DOMContentLoaded) 이벤트를 에뮬레이션한다.
 * @ignore
 */
jindo.$Fn._domready = function(doc, func) {
	if (typeof jindo.$Fn._domready.list == "undefined") {
		var f = null, l  = jindo.$Fn._domready.list = $A([func]);
		
		(function (){
			// use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			try {
				doc.documentElement.doScroll("left");
			} catch(e) {
				setTimeout(arguments.callee, 0);
				return;
			}

			var evt = {
				type : "domready",
				target : doc,
				currentTarget : doc
			};

			while(f = l.shift()) f(evt);
		})();
	} else {
		jindo.$Fn._domready.list.push(func);
	}
};

/**
 * gc 메서드는 Window에서 벗어날 때, DOM Element에 할당된 이벤트 핸들러를 제거한다. ??
 * @see $Fn#gcinit
 */
jindo.$Fn.gc = function() {
	var p = jindo.$Fn.gc.pool;

	for(var key in p) {
		try { p[key].free(); }catch(e){ };
	}

	// delete all missing references
	jindo.$Fn.gc.pool = p = {};
};

jindo.$Fn.gc.count = 0;

jindo.$Fn.gc.pool = {};
if (typeof window != "undefined") {
	jindo.$Fn(jindo.$Fn.gc).attach(window, "unload");
}
/**
 * @fileOverview $Event의 생성자 및 메서드를 정의한 파일
 * @name event.js
 */

/**
 * $Event 클래스는 Event 객체의 레퍼(Wrapper) 클래스이다.
 * 사용자는 $Event.element 메서드를 사용하여 이벤트가 실행된 객체를 알 수 있다.
 * @class JavaScript Core 이벤트 객체로부터 $Event 객체를 생성한다.
 * @param {Event} e	DOM Event 객체
 * @constructor
 * @author Kim, Taegon
 */
jindo.$Event = function(e) {
	var cl = arguments.callee;
	if (e instanceof cl) return e;
	if (!(this instanceof cl)) return new cl(e);

	if (typeof e == "undefined") e = window.event;
	if (e === window.event && document.createEventObject) e = document.createEventObject(e);

	this._event = e;
	this._globalEvent = window.event;

	/** 이벤트의 종류 */
	this.type = e.type.toLowerCase();
	if (this.type == "dommousescroll") {
		this.type = "mousewheel";
	} else if (this.type == "DOMContentLoaded") {
		this.type = "domready";
	}

	this.canceled = false;

	/** 이벤트가 발생한 엘리먼트 */
	this.element = e.target || e.srcElement;
	/** 이벤트가 정의된 엘리먼트 */
	this.currentElement = e.currentTarget;
	/** 이벤트의 연관 엘리먼트 */
	this.relatedElement = null;

	if (typeof e.relatedTarget != "undefined") {
		this.relatedElement = e.relatedTarget;
	} else if(e.fromElement && e.toElement) {
		this.relatedElement = e[(this.type=="mouseout")?"toElement":"fromElement"];
	}
}

/**
 * 마우스 이벤트의 버튼, 휠 정보를 리턴한다.
 * @example
function eventHandler(evt) {
   var mouse = evt.mouse();

   mouse.delta;   // Number. 휠이 움직인 정도. 휠을 위로 굴리면 양수, 아래로 굴리면 음수.
   mouse.left;    // Boolean. 마우스 왼쪽 버튼을 눌렸으면 true, 아니면 false
   mouse.middle;  // Boolean. 마우스 중간 버튼을 눌렸으면 true, 아니면 false
   mouse.right;   // Boolean. 마우스 오른쪽 버튼을 눌렸으면 true, 아니면 false
}
 * @return {Object} 마우스 정보를 가지는 객체. 리턴한 객체의 속성은 예제를 참조한다.
 */
jindo.$Event.prototype.mouse = function() {
	var e    = this._event;
	var delta = 0;
	var left  = (e.which&&e.button==0)||!!(e.button&1);
	var mid   = (e.which&&e.button==1)||!!(e.button&4);
	var right = (e.which&&e.button==2)||!!(e.button&2);
	var ret   = {};

	if (e.wheelDelta) {
		delta = e.wheelDelta / 120;
	} else if (e.detail) {
		delta = -e.detail / 3;
	}

	ret = {
		delta  : delta,
		left   : left,
		middle : mid,
		right  : right
	};

	// replace method
	this.mouse = function(){ return ret };

	return ret;
};

/**
 * 키보드 이벤트 정보를 리턴한다.
 * @example
function eventHandler(evt) {
   var key = evt.key();

   key.keyCode; // Number. 눌린 키보드의 키코드
   key.alt;     // Boolean. Alt 키를 눌렸으면 true.
   key.ctrl;    // Boolean. Ctrl 키를 눌렸으면 true.
   key.meta;    // Boolean. Meta 키를 눌렸으면 true. Meta키는 맥의 커맨드키를 검출할 때 사용합니다.
   key.shift;   // Boolean. Shift 키를 눌렸으면 true.
   key.up;      // Boolean. 위쪽 화살표 키를 눌렸으면 true.
   key.down;    // Boolean. 아래쪽 화살표 키를 눌렸으면 true.
   key.left;    // Boolean. 왼쪽 화살표 키를 눌렸으면 true.
   key.right;   // Boolean. 오른쪽 화살표 키를 눌렸으면 true.
   key.enter;   // Boolean. 리턴키를 눌렀으면 true
   key.esc;   // Boolean. ESC키를 눌렀으면 true
   }
}
 * @return {Object} 키보드 이벤트의 눌린 키값. 객체의 속성은 예제를 참조한다.
 */
jindo.$Event.prototype.key = function() {
	var e     = this._event;
	var k     = e.keyCode || e.charCode;
	var ret   = {
		keyCode : k,
		alt     : e.altKey,
		ctrl    : e.ctrlKey,
		meta    : e.metaKey,
		shift   : e.shiftKey,
		up      : (k == 38),
		down    : (k == 40),
		left    : (k == 37),
		right   : (k == 39),
		enter   : (k == 13),		
		esc   : (k == 27)
	};

	this.key = function(){ return ret };

	return ret;
};

/**
 * 마우스 커서의 위치 정보를 리턴한다.
 * @param {Boolean} bGetOffset 현재 엘리먼트에 대한 마우스 커서의 상대위치인 offsetX, offsetY를 구할 것인지의 여부. true면 값을 구한다(offsetX, offsetY는 1.2.0버전부터 추가).
 * @example
function eventHandler(evt) {
   var pos = evt.pos();

   pos.clientX;  // Number. 현재 화면에 대한 X 좌표
   pos.clientY;  // Number. 현재 화면에 대한 Y 좌표
   pos.pageX;    // Number. 문서 전체에 대한 X 좌표
   pos.pageY;    // Number. 문서 전체에 대한 Y 좌표
   pos.layerX;   // Number. <b>deprecated.</b> 이벤트가 발생한 객체로부터의 상대적인 X 좌표
   pos.layerY;   // Number. <b>deprecated.</b> 이벤트가 발생한 객체로부터의 상대적인 Y 좌표
   pos.offsetX;  // Number. 현재 엘리먼트에 대한 마우스 커서의 상대적인 X좌표 (1.2.0 이상)
   pos.offsetY;  // Number. 현재 엘리먼트에 대한 마우스 커서의 상대적인 Y좌표 (1.2.0 이상)

}
 * @return {Object} 마우스 커서의 위치 정보. 객체의 속성은 예제를 참조한다.
 * @remark layerX, layerY는 차후 지원하지 않을(deprecated) 예정입니다.
 */
jindo.$Event.prototype.pos = function(bGetOffset) {
	var e   = this._event;
	var b   = (this.element.ownerDocument||document).body;
	var de  = (this.element.ownerDocument||document).documentElement;
	var pos = [b.scrollLeft || de.scrollLeft, b.scrollTop || de.scrollTop];
	var ret = {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX   : 'pageX' in e ? e.pageX : e.clientX+pos[0]-b.clientLeft,
		pageY   : 'pageY' in e ? e.pageY : e.clientY+pos[1]-b.clientTop,
		layerX  : 'offsetX' in e ? e.offsetX : e.layerX - 1,
		layerY  : 'offsetY' in e ? e.offsetY : e.layerY - 1
	};

	// 오프셋을 구하는 메소드의 비용이 크므로, 요청시에만 구하도록 한다.
	if (bGetOffset) {
		var offset = jindo.$Element(this.element).offset();
		ret.offsetX = ret.pageX - offset.left;
		ret.offsetY = ret.pageY - offset.top;
	}

	return ret;
};

/**
 * 이벤트를 종료한다.
 * @remark 버블링은 특정 DOM 엘리먼트에서 이벤트가 발생했을 때 이벤트가 상위 노드로 전파되는 현상이다. 예를 들어, div 객체를 클릭할 때 div와 함께 상위 엘리먼트인 document에도 onclick 이벤트가 발생한다. stop() 메소드는 지정한 객체에서만 이벤트가 발생하도록 버블링을 차단한다.
 * @example
function eventHandler(evt) {
   someCode();
   evt.stop();
}
 * @example
// 디폴트 이벤트만 중지시키고 싶을 때 (1.1.3버전 이상)
function stopDefaultOnly(evt) {
	// Here is some code to execute

	// Stop default event only
	evt.stop($Event.CANCEL_DEFAULT);
}
 * @return {$Event} 이벤트 객체.
 * @param {Number} nCancel 이벤트를 정지할 때 버블링, 디폴트 액션 중 정지시킬 값을 지정한다. 기본값은 $Event.CANCEL_ALL 이다(1.1.3 버전 이상).
 */
jindo.$Event.prototype.stop = function(nCancel) {
	nCancel = nCancel || jindo.$Event.CANCEL_ALL;

	var e = (window.event && window.event == this._globalEvent)?this._globalEvent:this._event;
	var b = !!(nCancel & jindo.$Event.CANCEL_BUBBLE); // stop bubbling
	var d = !!(nCancel & jindo.$Event.CANCEL_DEFAULT); // stop default event

	this.canceled = true;

	if (typeof e.preventDefault != "undefined" && d) e.preventDefault();
	if (typeof e.stopPropagation != "undefined" && b) e.stopPropagation();

	if(d) e.returnValue = false;
	if(b) e.cancelBubble = true;

	return this;
};

/**
 * $Event#stop 메서드에서 버블링을 중지시킨다.
 * @final
 */
jindo.$Event.CANCEL_BUBBLE = 1;

/**
 * $Event#stop 메서드에서 디폴트 액션을 중지시킨다.
 * @final
 */
jindo.$Event.CANCEL_DEFAULT = 2;

/**
 * $Event#stop 메서드에서 버블리과 디폴트 액션 모두 중지시킨다.
 * @final
 */
jindo.$Event.CANCEL_ALL = 3;

/**
 * @fileOverview $ElementList의 생성자 및 메서드를 정의한 파일
 * @name elementlist.js
 */

/**
 * $ElementList 객체를 생성 및 리턴한다.
 * @class $ElementList 클래스는 id 배열, 혹은 CSS 쿼리 등을 사용하여 DOM 엘리먼트의 배열을 만든다. 
 * @param {String | Array} els 문서에서 DOM 엘리먼트를 찾기 위한 CSS 선택자 혹은 id, HTMLElement, $Element의 배열
 * @constructor
 * @borrows $Element#show as this.show
 * @borrows $Element#hide as this.hide
 * @borrows $Element#toggle as this.toggle
 * @borrows $Element#addClass as this.addClass
 * @borrows $Element#removeClass as this.removeClass
 * @borrows $Element#toggleClass as this.toggleClass
 * @borrows $Element#fireEvent as this.fireEvent
 * @borrows $Element#leave as this.leave
 * @borrows $Element#empty as this.empty
 * @borrows $Element#appear as this.appear
 * @borrows $Element#disappear as this.disappear
 * @borrows $Element#className as this.className
 * @borrows $Element#width as this.width
 * @borrows $Element#height as this.height
 * @borrows $Element#text as this.text
 * @borrows $Element#html as this.html
 * @borrows $Element#css as this.css
 * @borrows $Element#attr as this.attr
 * @author Kim, Taegon
 */
jindo.$ElementList = function (els) {
	var cl = arguments.callee;
	if (els instanceof cl) return els;
	if (!(this instanceof cl)) return new cl(els);
	
	if (els instanceof Array || (jindo.$A && els instanceof jindo.$A)) {
		els = jindo.$A(els);
	} else if (typeof els == "string" && cssquery) {
		els = jindo.$A(cssquery(els));
	} else {
		els = jindo.$A();
	}

	this._elements = els.map(function(v,i,a){ return jindo.$Element(v) });
}

/**
 * get 메서드는 $ElementList에서 인덱스에 해당하는 엘리먼트를 가져온다. 
 * @param {Number} idx 가져올 엘리먼트의 인덱스. 인덱스는 0에서 부터 시작한다.
 * @return {$Element} 인덱스에 해당하는 엘리먼트
*/
jindo.$ElementList.prototype.get = function(idx) {
	return this._elements.$value()[idx];
};

/**
 * getFirst 메서드는 $ElementList의 첫번째 엘리먼트를 가져온다.
 * @remark getFirst 메서드의 리턴값은 $ElementList.get(0)의 리턴값과 동일하다.
 * @return {$Element} 첫번째 엘리먼트
*/
jindo.$ElementList.prototype.getFirst = function() {
	return this.get(0);
};

/**
 * getLast 메서드는 $ElementList의 마지막 엘리먼트를 가져온다.
 * @return {$Element} 마지막 엘리먼트
*/
jindo.$ElementList.prototype.getLast = function() {
	return this.get(Math.Max(this._elements.length-1,0));
};

(function(proto){
	var setters = 'show,hide,toggle,addClass,removeClass,toggleClass,fireEvent,leave,';
	setters += 'empty,appear,disappear,className,width,height,text,html,css,attr';
	
	jindo.$A(setters.split(',')).forEach(function(name){
		proto[name] = function() {
			var args = jindo.$A(arguments).$value();
			this._elements.forEach(function(el){
				el[name].apply(el, args);
			});
			
			return this;
		}
	});
	
	jindo.$A(['appear','disappear']).forEach(function(name){
		proto[name] = function(duration, callback) {
			var len  = this._elements.length;
			var self = this;
			this._elements.forEach(function(el,idx){
				if(idx == len-1) el[name](duration, function(){callback(self)});
				else el[name](duration);
			});
		}
	});
})(jindo.$ElementList.prototype);
/**
 * @fileOverview $Json의 생성자 및 메서드를 정의한 파일
 * @name json.js
 */

/**
 * 인수로 지정한 문자열을 사용하여 $S 클래스를 생성한다.
 * @class $S 클래스는문자열을 처리하기 위한 레퍼(Wrapper) 클래스이다.
 * @constructor
 * @author Kim, Taegon
 */
jindo.$S = function(str) {
	var cl = arguments.callee;

	if (typeof str == "undefined") str = "";
	if (str instanceof cl) return str;
	if (!(this instanceof cl)) return new cl(str);

	this._str = str+"";
}

/**
 * $value 메서드는 문자열을 리턴한다.
 * @return {String} $S의 내부 문자열
 * @see $S#toString
 */
jindo.$S.prototype.$value = function() {
	return this._str;
};

/**
 * toString 메서드는 문자열을 리턴한다.
 * @return {String} $S의 내부 문자열
 * @remark 내부적으로 $value를 사용한다.
 */
jindo.$S.prototype.toString = jindo.$S.prototype.$value;

/**
 * trim 메서드는 문자열의 양 끝 공백을 제거한다.
 * @return {$S} 문자열의 양 끝을 제거한 새로운 $S 객체
 * @example
 * var str = "   I have many spaces.   ";
 * document.write ( $S(str).trim() );
 *
 * // 결과 :
 * // I have many spaces.
 */
jindo.$S.prototype.trim = function() {
	return jindo.$S(this._str.replace(/^\s+|\s+$/g, ""));
};

/**
 * escapeHTML 메서드는 HTML 특수 문자를 HTML 엔티티 형식으로 변환한다.
 * @return {$S} HTML 특수 문자를 엔티티 형식으로 변환한 새로운 $S 객체
 * @see $S#unescapeHTML
 * @remark  ", &, <, > 를 각각 &quot;, &amp;, &lt;, &gt; 로 변경한다.
 * @example
 * var str = ">_<;;";
 * document.write( $S(str).escapeHTML() );
 *
 * // 결과 :
 * // &gt;_&lt;;;
 */
jindo.$S.prototype.escapeHTML = function() {
	var entities = {'"':'quot','&':'amp','<':'lt','>':'gt'};
	var s = this._str.replace(/[<>&"]/g, function(m0){
		return entities[m0]?'&'+entities[m0]+';':m0;
	});
	return jindo.$S(s);
};

/**
 * stripTags 메서드는 문자열에서 XML 혹은 HTML 태그를 제거한다.
 * @return {$S} XML 혹은 HTML 태그를 제거한 새로운 $S 객체
 * @example
 * var str = "Meeting <b>people</b> is easy.";
 * document.write( $S(str).stripTags() );
 *
 * // 결과 :
 * // Meeting people is easy.
 */
jindo.$S.prototype.stripTags = function() {
	return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ''));
};

/**
 * times 메서드는 문자열을 인수로 지정한 숫자만큼 반복한다.
 * @param {Number} nTimes 반복할 횟수
 * @return {$S} 문자열을 지정한 숫자만큼 반복한 새로운 $S 객체
 * @example
 * document.write ( $S("Abc").times(3) );
 *
 * // 결과 : AbcAbcAbc
 */
jindo.$S.prototype.times = function(nTimes) {
	var buf = [];
	for(var i=0; i < nTimes; i++) {
		buf[buf.length] = this._str;
	}

	return jindo.$S(buf.join(''));
};

/**
 * unescapeHTML 메서드는 이스케이프된 HTML을 원래의 HTML로 변환한다.
 * @return {$S} 이스케이프된 HTML을 원래의 HTML로 변환한 새로운 $S 객체
 * @remark  &quot;, &amp;, &lt;, &gt;를 각각 ", &, <, > 으로 변경한다.
 * @see $S#escapeHTML
 * @example
 * var str = "&lt;a href=&quot;http://naver.com&quot;&gt;Naver&lt;/a&gt;";
 * document.write( $S(str).unescapeHTML() );
 *
 * // 결과 :
 * // <a href="http://naver.com">Naver</a>
 */
jindo.$S.prototype.unescapeHTML = function() {
	var entities = {'quot':'"','amp':'&','lt':'<','gt':'>'};
	var s = this._str.replace(/&([a-z]+);/g, function(m0,m1){
		return entities[m1]?entities[m1]:m0;
	});
	return jindo.$S(s);
};

/**
 * escape 메서드는 문자열을 겹따옴표에 포함될 수 있는 ASCI 문자열로 이스케이프 처리한다.
 * @remark \r, \n, \t, ', ", non-ASCII 문자를 이스케이프 처리한다.
 * @return {$S} 문자열을 이스케이프 처리한 새로운 $S 객체
 * @see $S#escapeHTML
 * @example
 * var str = '가"\'나\\';
 * document.write( $S(str).escape() );
 *
 * // 결과 :
 * \uAC00\"\'\uB098\\
 */
jindo.$S.prototype.escape = function() {
	var s = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function(m0,m1,_){
		if(m1) return escape(m1).replace(/%/g,'\\');
		return (_={"\n":"\\n","\r":"\\r","\t":"\\t"})[m0]?_[m0]:"\\"+m0;
	});

	return jindo.$S(s);
};

/**
 * bytes 메서드는 문자열의 실제 바이트(byte) 수를 반환한다.
 * @return 문자열의 바이트 수. 단, 첫번째 파라미터를 설정하면 자기 객체를 반환한다.
 * @param {Number} nBytes 맞출 글자 수
 * @remark 문서의 charset을 해석해서 인코딩 방식에 따라 한글을 비롯한 유니코드 문자열의 바이트 수를 가변적으로 계산한다. 유니코드 문서가 아니라면, 유니코드 문자열은 항상 2byte로 계산한다.
 * @example
 * // 문서가 euc-kr 환경임을 가정합니다.
 * var str = "한글과 English가 섞인 문장...";
 * document.write( $S(str).bytes() );
 *
 * // 결과 : 29
 */
jindo.$S.prototype.bytes = function(nBytes) {
	var code = 0, bytes = 0, i = 0, len = this._str.length;
	var charset = ((document.charset || document.characterSet || document.defaultCharset)+"").toLowerCase();
	var cut = (typeof nBytes == "number");

	if (charset == "utf-8") {
		// 유니코드 문자열의 바이트 수는 위키피디아를 참고했다(http://ko.wikipedia.org/wiki/UTF-8).
		for(i=0; i < len; i++) {
			code = this._str.charCodeAt(i);
			if (code < 128) bytes += 1;
			else if (code < 2048) bytes += 2;
			else if (code < 65536) bytes += 3;
			else bytes += 4;
			
			if (cut && bytes > nBytes) {
				this._str = this._str.substr(0,i);
				break;
			}
		}
	} else {
		for(i=0; i < len; i++) {
			bytes += (this._str.charCodeAt(i) > 128)?2:1;
			
			if (cut && bytes > nBytes) {
				this._str = this._str.substr(0,i);
				break;
			}
		}
	}

	return cut?this:bytes;
};

/**
 * parseString 메서드는 URL 쿼리 스트링을 객체로 파싱한다.
 * @return {Object} 문자열을 파싱한 객체
 * @example
 * var str = "aa=first&bb=second";
 * var obj = $S(str).parseString();
 *
 * // obj => { aa : "first", bb : "second" }
 */
jindo.$S.prototype.parseString = function() {
	var str = this._str.split(/&/g), pos, key, val, buf = {};

	for(var i=0; i < str.length; i++) {
		key = str[i].substring(0, pos=str[i].indexOf("="));
		val = decodeURIComponent(str[i].substring(pos+1));

		if (key.substr(key.length-2,2) == "[]") {
			key = key.substring(0, key.length-2);
			if (typeof buf[key] == "undefined") buf[key] = [];
			buf[key][buf[key].length] = val;
		} else {
			buf[key] = val;
		}
	}

	return buf;
};

/**
 * 정규식에 사용할 수 있도록 문자열을 이스케이프 한다.
 * @since 1.2.0
 * @return {String} 이스케이프된 문자열
 * @example
 * var str = "Slash / is very important. Backslash \ is more important. +_+";
 * document.write( $S(str).escapeRegex() );
 * 
 * // 결과 :
 * // Slash \/ is very important\. Backslash \\ is more important\. \+_\+
 */
jindo.$S.prototype.escapeRegex = function() {
	var s = this._str;
	var r = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;

	return jindo.$S(s.replace(r, "\\$1"));
};

/**
 * format 메서드는 문자열을 형식 문자열에 대입한 새로운 문자열을 만든다. 형식 문자열은 %로 시작하며, 형식 문자열의 종류는 <a href="http://www.php.net/manual/en/function.sprintf.php">PHP</a>와 동일하다.
 * @param {String} formatString 형식 문자열
 * @return {String} 문자열을 형식 문자열에 대입하여 만든 새로운 문자열.
 * @example
var str = $S("%4d년 %02d월 %02d일").format(2008, 2, 13);
// str == "2008년 02월 13일"

var str = $S("패딩 %5s 빈공백").format("값");
// str == "패딩     값 빈공백"

var str = $S("%b").format(10);
// str == "1010"

var str = $S("%x").format(10);
// str == "a"

var str = $S("%X").format(10);
// str == "A"
 * @see $S#times
 */
jindo.$S.prototype.format = function() {
	var args = arguments;
	var idx  = 0;
	var s = this._str.replace(/%([ 0])?(-)?([1-9][0-9]*)?([bcdsoxX])/g, function(m0,m1,m2,m3,m4){
		var a = args[idx++];
		var ret = "", pad = "";

		m3 = m3?+m3:0;

		if (m4 == "s") {
			ret = a+"";
		} else if (" bcdoxX".indexOf(m4) > 0) {
			if (typeof a != "number") return "";
			ret = (m4 == "c")?String.fromCharCode(a):a.toString(({b:2,d:10,o:8,x:16,X:16})[m4]);
			if (" X".indexOf(m4) > 0) ret = ret.toUpperCase();
		}

		if (ret.length < m3) pad = $S(m1||" ").times(m3 - ret.length).toString();
		(m2 == '-')?(ret+=pad):(ret=pad+ret);

		return ret;
	});

	return jindo.$S(s);
};

/**
 * @fileOverview $Document 생성자 및 메서드를 정의한 파일
 * @name document.js
 */

/**
 * $Document 객체를 생성 및 리턴한다.
 * @class $Document 클래스는 문서와 관련된 여러가지 기능의 메서드를 제공한다 
 * @param {Document} doc	기능에 사용된 document 객체, 지정하지 않으면 기본적으로 현재 문서의 document 가 지정된다.
 * @constructor
 * @author Hooriza
 */
jindo.$Document = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	this._doc = el || document;
	this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';
};

/**
 * $value 메서드는 래핑된 원래의 document 객체를 리턴한다.
 * @return {HTMLDocument} document 객체
 */
jindo.$Document.prototype.$value = function() {
	return this._doc;
};

/**
 * scrollSize 메서드는 문서의 실제 가로, 세로 크기를 구한다
 * @return {Object} 가로크기는 width, 세로크기는 height 라는 키값으로 리턴된다.
 * @example
var size = $Document().scrollSize();
alert('가로 : ' + size.width + ' / 세로 : ' + size.height); 
 */
jindo.$Document.prototype.scrollSize = function() {

	var oDoc = this._doc[this._docKey];
	
	return {
		width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
		height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
	};

};

/**
 * clientSize 메서드는 스크롤바로 인해 가려진 부분을 제외한 문서 중 보이는 부분의 가로, 세로 크기를 구한다
 * @return {Object} 가로크기는 width, 세로크기는 height 라는 키값으로 리턴된다
 * @example
var size = $Document(document).clientSize();
alert('가로 : ' + size.width + ' / 세로 : ' + size.height); 
 */
jindo.$Document.prototype.clientSize = function() {
	
	var oDoc = this._doc[this._docKey];

	return {
		width : oDoc.clientWidth,
		height : oDoc.clientHeight
	};

};

/**
 * renderingMode 메서드는 문서의 렌더링 방식을 얻는다
 * @return {String} 렌더링 모드
 * <dl>
 *	<dt>Standards</dt>
 *	<dd>표준 렌더링 모드</dd>
 *	<dt>Almost</dt>
 *	<dd>유사 표준 렌더링 모드 (IE 외의 브라우저에서 DTD 을 올바르게 지정하지 않았을때 리턴)</dd>
 *	<dt>Quirks</dt>
 *	<dd>비표준 렌더링 모드</dd>
 * </dl>
 * @example
var mode = $Document().renderingMode();
alert('렌더링 방식 : ' + mode);
 */
jindo.$Document.prototype.renderingMode = function() {

	var oBrowser = jindo.$Agent().navigator();
	var sRet;

	if ('compatMode' in this._doc)
		sRet = this._doc.compatMode == 'CSS1Compat' ? 'Standards' : (oBrowser.ie ? 'Quirks' : 'Almost');
	else
		sRet = oBrowser.safari ? 'Standards' : 'Quirks';

	return sRet;

};

/**
 * @fileOverview $Form 생성자 및 메서드를 정의한 파일
 * @name form.js
 */

/**
 * $Form 객체를 생성 및 리턴한다.
 * @class $Form 클래스는 <form> 엘리먼트와 하위 입력요소들을 다루기 위한 여러 가지 메서드를 제공한다. 
 * @param {Element | String} el	$Form를 사용할 <form> 엘리먼트, 혹은 <form> 엘리먼트의 고유한 id. 만약 고유하지 않은 id를 지정하면 가장 먼저 나오는 엘리먼트를 반환한다.
 * @constructor
 * @author Hooriza
 */
jindo.$Form = function (el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);
	
	el = jindo.$(el);
	
	if (!el.tagName || el.tagName.toUpperCase() != 'FORM') throw new Error('The element should be a FORM element');
	this._form = el;
}

/**
 * $value 메서드는 랩핑된 원래 <form> 엘리먼트를 리턴한다
 * @return {HTMLElement} <form> 엘리먼트
 * @example

var el = $('<form>');
var form = $Form(el);

alert(form.$value() === el); // true
 
 */
jindo.$Form.prototype.$value = function() {
	return this._form;
};

/**
 * serialize 메서드는 특정 또는 전체 엘리멘트  입력요소를 문자열 형태로 리턴한다.
 * @param {Mixed} Mixed 인수를 지정하지 않거나 인수를 하나 이상 설정할 수 있다. 
 * <dl>
 *	<dt>인수를 지정하지 않을 경우</dt>
 *	<dd>인수를 지정하지 않으면 쿼리 형태의 문자열을 리턴한다.</dd>
 *	<dt>{String} one_element_name</dt>
 *	<dd>인수로 하나의 문자열만 지정하면 문자열과 동일한 name 속성을 가지는 엘리먼트와 그 값을 리턴한다.</dd>
 *	<dt>{String, String... } element_names</dt>
 *	<dd>두 개 이상의 엘리먼트와 그 값을 리턴한다. </dd>
 * </dl>
 * @return {String} 쿼리 문자열 형태로 변환한 엘리먼트와 그 값.
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" value="2" checked="checked" type="checkbox" />
	<input name="THREE" value="3_1" type="radio" />
	<input name="THREE" value="3_2" checked="checked" type="radio" />
	<input name="THREE" value="3_3" type="radio" />
	<select name="FOUR">
		<option value="4_1">..</option>
		<option value="4_2">..</option>
		<option value="4_3" selected="selected">..</option>
	</select>
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var allstr = form.serialize();
	alert(allstr == 'ONE=1&TWO=2&THREE=3_2&FOUR=4_3'); // true

	var str = form.serialize('ONE', 'THREE');
	alert(str == 'ONE=1&THREE=3_2'); // true
</script>

 */
jindo.$Form.prototype.serialize = function() {

 	var self = this;
 	var oRet = {};
 	
 	var nLen = arguments.length;
 	var fpInsert = function(sKey) {
 		var sVal = self.value(sKey);
 		if (typeof sVal != 'undefined') oRet[sKey] = sVal;
 	};
 	
 	if (nLen == 0) 
	 	jindo.$A(this.element()).forEach(function(o) { if (o.name) fpInsert(o.name); });
 	else
 		for (var i = 0; i < nLen; i++) fpInsert(arguments[i]);
 	
	return jindo.$H(oRet).toQueryString();
	
};

/**
 * element 메서드는 특정 또는 전체 입력요소를 리턴한다.
 * @param {String} sKey 얻고자 하는 입력요소 엘리먼트의 name 문자열, 생략시에는 모든 입력요소들을 배열로 리턴한다.
 * @return {HTMLElement | Array} 입력 요소 엘리먼트
 */
jindo.$Form.prototype.element = function(sKey) {

	if (arguments.length > 0)
		return this._form[sKey];
	
	return this._form.elements;
	
};

/**
 * enable 메서드는 입력 요소의 활성화 여부를 얻거나 설정한다.
 * @param {Mixed} mixed 정확한 인수는 다음과 같다. 
 * <dl>
 *	<dt>{String}fieldName</dt>
 *	<dd>인수로 입력요소의 이름만 넣어주면 해당 입력요소의 활성화 여부를 true, false 로 반환한다</dd>
 *	<dt>{String}fieldName, {Boolean}flag</dt>
 *	<dd>입력요소와 Boolean 형의 상태값을 함께 넣어주면 해당 입력요소를 지정한 상태로 활성화 여부를 변경한다</dd>
 *	<dt>{Object}objectProperties</dt>
 *	<dd>동시에 여러개의 입력요소에 대해 활성화 여부를 지정하고 싶을때 사용한다</dd>
 * </dl>
 * @return {Boolean|$Form} 엘리먼트의 활성화 여부를 가져오거나 엘리먼트의 활성화 여부를 설정한 $Form 객체. 
 * @example

<form id="TEST">
	<input name="ONE" disabled="disabled" type="text" />
	<input name="TWO" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_enabled = form.enable('ONE');
	alert(one_enabled === false); // true

	form.enable('TWO', false);

	form.enable({
		'ONE' : true,
		'TWO' : false
	});
</script>

 */
jindo.$Form.prototype.enable = function() {
	
	var sKey = arguments[0];

	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.enable(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) return this;
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length < 2) {
		
		var bEnabled = true;
		jindo.$A(aEls).forEach(function(o) { if (o.disabled) {
			bEnabled = false;
			jindo.$A.Break();
		}});
		return bEnabled;
		
	} else { // setter
		
		var sFlag = arguments[1];
		jindo.$A(aEls).forEach(function(o) { o.disabled = !sFlag; });
		
		return this;
		
	}
	
};

/**
 * value 메서드는 폼 엘리먼트의 값을 얻거나 설정한다.
 * @param {Mixed} Mixed 정확안 인수 정보는 다음과 같다. 
 * <dl>
 *	<dt>{String}fieldName</dt>
 *	<dd>인수로 엘리먼트의 이름만 지정하면 엘리먼트의 값을 리턴한다</dd>
 *	<dt>{String}fieldName, {String}value</dt>
 *	<dd>엘리먼트의 이름과 엘리먼트에 설정할 값을 함께 지정하면 엘리먼트의 값을 지정한 값으로 바꾼다.</dd>
 *	<dt>{Object}objectProperties</dt>
 *	<dd>두 개 이상의 엘리먼트 값을 동시에 지정하고 싶으면 '엘리먼트 이름 : 엘리먼트 값'을 원소로 가지는 객체를 지정한다. </dd>
 * </dl>
 * @return {String|$Form} 인수로 엘리먼트만 지정했다면 지정한 엘리먼트의 값을, 인수로 폼 엘리먼와 엘리먼트의 값을 지정했다면 $Form 객체를 리턴한다.    
 * @example

<form id="TEST">
	<input name="ONE" value="1" type="text" />
	<input name="TWO" value="2" type="checkbox" />
</form>
<script type="text/javascript">
	var form = $Form('TEST');

	var one_value = form.value('ONE');
	alert(one_value === '1'); // true

	var two_value = form.value('TWO');
	alert(two_value === undefined); // true

	form.value('TWO', 2);
	alert(two_value === '2'); // true

	form.value({
		'ONE' : '1111',
		'TWO' : '2'
	});	
	// form.value('ONE') -> 1111
	// form.value('ONE') -> 2
</script>

 */
jindo.$Form.prototype.value = function(sKey) {
	
	if (typeof sKey == 'object') {
		
		var self = this;
		jindo.$H(sKey).forEach(function(bFlag, sKey) { self.value(sKey, bFlag); });
		return this;
		
	}
	
	var aEls = this.element(sKey);
	if (!aEls) throw new Error('The element is not exist');
	aEls = aEls.nodeType == 1 ? [ aEls ] : aEls;
	
	if (arguments.length > 1) { // setter
		
		var sVal = arguments[1];
		
		jindo.$A(aEls).forEach(function(o) {
			
			switch (o.type) {
			case 'radio':
			case 'checkbox':
				o.checked = (o.value == sVal);
				break;
				
			case 'select-one':
				var nIndex = -1;
				for (var i = 0, len = o.options.length; i < len; i++)
					if (o.options[i].value == sVal) nIndex = i;
				o.selectedIndex = nIndex;

				break;
				
			default:
				o.value = sVal;
				break;
			}
			
		});
		
		return this;
	}

	// getter
	
	var aRet = [];
	
	jindo.$A(aEls).forEach(function(o) {
		
		switch (o.type) {
		case 'radio':
		case 'checkbox':
			if (o.checked) aRet.push(o.value);
			break;
		
		case 'select-one':
			if (o.selectedIndex != -1) aRet.push(o.options[o.selectedIndex].value);
			break;
			
		default:
			aRet.push(o.value);
			break;
		}
		
	});
	
	return aRet.length > 1 ? aRet : aRet[0];
	
};

/**
 * submit 메서드는 폼의 데이터를 웹으로 제출(submit) 한다.
 * @param {String} sTargetName 제출할 폼이 있는 윈도우의 이름. sTargetName을 생략하면 기본 타겟
 * @return {$Form} 데이터를 제출한 $Form 객체. 
 * @example
var form = $Form(el);
form.submit();
form.submit('foo');
 */
jindo.$Form.prototype.submit = function(sTargetName) {
	
	var sOrgTarget = null;
	
	if (typeof sTargetName != 'undefined') {
		sOrgTarget = this._form.target;
		this._form.target = sTargetName;
	}
	
	this._form.submit();
	
	if (sOrgTarget !== null)
		this._form.target = sOrgTarget;
	
	return this;
	
};

/**
 * submit 메서드는 폼을 초기화(reset)한다.
 * @return {$Form} 초기화한 $Form 객체.
 * @example
var form = $Form(el);
form.reset(); 
 */
jindo.$Form.prototype.reset = function() {
	
	this._form.reset();
	return this;
	
};

/**
 * @fileOverview $Template의 생성자 및 메서드를 정의한 파일
 * @name template.js
 */

/**
 * 템플릿을 실행한다. 첫번째 인수로 템플릿 문자열 또는 문자열을 포함한 HTML 엘리먼트 혹은 엘리먼트의 아이디를 전달할 수 있다.
 * 엘리먼트는 <textarea> 또는 <script type="text/template"> 이 가능하다(<script> 태그를 사용하려면 반드시 type 속성을 지정해주어야 한다).
 * @class $Template 클래스는 템플릿 문자열에 동적으로 문자열을 삽입한다.
 * @constructor
 * @author Kim, Taegon
 * @example
 * <script type="text/javascript">
 * // Template 문자열을 전달하는 경우
 * var tpl = $Template("Value : {=test}");
 * </script>
 * @example
 * <textarea id="tpl1">
 * Value : {=test}
 * </textarea>
 *
 * <script type="text/template" id="tpl2">
 Value : {=test}
 * </script>
 *
 * <script type="text/javascript">
 * // Textarea 엘리먼트를 사용하는 경우
 * var template1 = $Template("tpl1");
 *
 * // Script 엘리먼트를 사용하는 경우
 * var template2 = $Template("tpl2");
 * </script>
 */
jindo.$Template = function(str) {
    var obj = null, tag = "";
    var cl  = arguments.callee;

    if (str instanceof cl) return str;
    if (!(this instanceof cl)) return new cl(str);

    if(typeof str == "undefined") str = "";
    else if( (obj=jindo.$(str)).tagName && (tag=obj.tagName.toUpperCase()) && (tag == "TEXTAREA" || (tag == "SCRIPT" && obj.getAttribute("type") == "text/template")) ) {
        str = (obj.value||obj.innerHTML).replace(/^\s+|\s+$/g,"");
    }

    this._str = str+"";
}
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern  = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+))$/;

 /**
 * process 메서드는 템플릿을 해석하고 해석된 결과 문자열을 반환한다.
 * @param {Object} data 변수 및 함수 데이터
 * @return {String} 해석을 마친 새로운 문자열
 * @example
 * // 단순 문자열 치환
 * var tpl  = $Template("Value1 : {=val1}, Value2 : {=val2}")
 * var data = {val1:"first value", val2:"second value"};
 * document.write( tpl.parse(data) );
 *
 * // 결과 :
 * // Value1 : first value, Value2 : second value
 *
 * @example
 * // 조건문
 * var tpl= $Template("{{if num >= 7}7보다 크거나 같다.{elseif num =< 5}5보다 작거나 같다.{else}아마 6?{/if}");
 * var data = { num:5 };
 * document.write( tpl.parse(data) );
 *
 * // 결과 :
 * 5보다 작거나 같다.
 *
 * @example
 * // 반복문 - 인덱스 사용안함
 * var tpl  = $Template("<h1>포탈 사이트</h1>\n<ul> {for site in potals}\n<li><a href="{=site.url}">{=site.name}</a></li>{/for} \n</ul>");
 * var data = {potals:[
 *		{ name : "네이버", url : "http://www.naver.com"  },
 *		{ name : "다음",  url : "http://www.daum.net"  },
 *		{ name : "야후",  url : "http://www.yahoo.co.kr"  }
 * ]};
 *
 * // 결과:
 * <h1>포탈 사이트 목록</h1> <ul> <li>네이버</li><li>다음</li><li>야후</li>
 * <ul>
 * <li><a href="http://www.naver.com">네이버</a></li>
 * <li><a href="http://www.daum.net">다음</a></li>
 * <li><a href="http://www.yahoo.co.kr">야후</a></li>
 * </ul>
 * 
 * @example
 * // 반복문 - 인덱스 사용
 * var tpl  = $Template("{for num:word in numbers}{=word}({=num}) {/for}");
 * var data = { numbers : ["zero", "one", "two", "three"] };
 * document.write( tpl.parse(data) );
 *
 * // 결과
 * zero(0) one(1) two(2) three(3) 
 */
jindo.$Template.prototype.process = function(data) {
	var key = "\x01";
    var tpl = (" "+this._str+" ").replace(/(?!\\)\}\{/g, "}"+key+"{").split(jindo.$Template.splitter), i = tpl.length;
    var map = {'"':'\\"','\\':'\\\\','\n':'\\n','\r':'\\r','\t':'\\t','\f':'\\f'};
    var reg = [/("(?:(?:\\.)+|[^\\"]+)*"|[a-zA-Z_][\w\.]*)/g, /[\n\r\t\f"\\]/g, /^\s+/, /\s+$/, /#/g];
    var cb  = [function(m){ return (m.substring(0,1)=='"')?m:"d."+m; }, function(m){return map[m]||m}, "", ""];
    var stm = [];
	var lev = 0;

	// remove " "
	tpl[0] = tpl[0].substr(1);
	tpl[i-1] = tpl[i-1].substr(0, tpl[i-1].length-1);

    // no pattern
    if(i<2) return tpl;

    while(i--) {
        if(i%2) {
            tpl[i] = tpl[i].replace(jindo.$Template.pattern, function(){
                var m = arguments;

                // variables
                if(m[8]) return 's[i++]=d.'+m[8]+';';

                // if
                if(m[1]) {
                    return 'if('+m[1].replace(reg[0],cb[0])+'){';
                }

                // else if
                if(m[2]) return '}else if('+m[2].replace(reg[0],cb[0])+'){';

                // for loop
                if(m[5]) {
					return ('var t#=d.'+m[5]+'||{},p#=isArray(t#),i#=0;'+
							'for(var x# in t#){'+
							'	if( (p# && isNaN(i#=parseInt(x#))) || (!p# && !t#.propertyIsEnumerable(x#)) ) continue;'+
							'	d.'+m[4]+'=t#[x#];'+
							(m[3]?'d.'+m[3]+'=p#?i#:x#;':'')
						).replace(reg[4], lev++ );
                }

                // else
                if(m[6]) return '}else{';

                // end if, end for
                if(m[7]) {
                    return '};';
                }

                return m[0];
            });
        }else if(tpl[i] == key) {
			tpl[i] = "";
        }else if(tpl[i]){
            tpl[i] = 's[i++]="'+tpl[i].replace(reg[1],cb[1])+'";';
        }
    }

    tpl = (new Function("d",''+
		'var s=[],i=0;'+
		'function isArray(o){ return Object.prototype.toString.call(o) == "[object Array]" };'+
		tpl.join('')+
		'return s.join("");'
	))(data);

    return tpl;
};
/**
 * @fileOverview $Date의 생성자 및 메서드를 정의한 파일
 * @name date.js
 */

/**
 * $Date 객체를 생성하고 리턴한다.
 * @extends core
 * @class $Date 클래스는 날짜를 처리하기 위한 Date 타입의 레퍼(Wrapper) 클래스이다. 
 * @constructor
 * @author Kim, Taegon
 * @example
$Date();
$Date(milliseconds);
$Date(dateString);
$Date(year, month, date[, hours, minitues, seconds, milliseconds]);
 */
jindo.$Date = function(src) {
	var a=arguments,t="";
	var cl=arguments.callee;

	if (src && src instanceof cl) return src;
	if (!(this instanceof cl)) return new cl(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);

	if ((t=typeof src) == "string") {
		this._date = cl.parse(src).$value();
	} else if (t == "number") {
		if (typeof a[1] == "undefined") this._date = new Date(src);
		else this._date = new Date(a[0],a[1],a[2],a[3],a[4],a[5],a[6]);
	} else if (t == "object" && src.constructor == Date) {
		(this._date = new Date).setTime(src.getTime());
		this._date.setMilliseconds(src.getMilliseconds());
	} else {
		this._date = new Date;
	}
}

/**
 * names 속성은 $Date에서 사용할 달, 요일, 오전/오후의 이름을 저장한 문자열이다. s_ 를 접두어로 가지는 이름들은 약어(abbreviation)이다.
 */
jindo.$Date.names = {
	month   : ["January","Febrary","March","April","May","June","July","August","September","October","Novermber","December"],
	s_month : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	day     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	s_day   : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
	ampm    : ["AM", "PM"]
};

/**
 * now 메서드는 현재 시간을 밀리초 단위의 정수로 리턴한다.
 * @return {Number} 밀리초 단위의 정수인 현재 시간
 */
jindo.$Date.now = function() {
	return Date.now();
};

/**
 * parse 메서드는 인수로 지정한 문자열을 파싱하여 문자열의 형식에 맞는 Date 객체를 생성한다. 
 * @param {String} strDate 날짜, 혹은 시간 형식을 지정한 파싱 대상 문자열
 * @return {Object} Date 객체. 
 * @remark parse 메서드는 Javascript Core의 Date.parse와 같은 결과값을 리턴한다.
 */
jindo.$Date.parse = function(strDate) {
	return Date.parse(strDate);
};

/**
 * $value 메서드는 $Date가 감싸고 있던 원본 Date 객체를 반환한다.
 * @returns {Object} Date 객체
 */
jindo.$Date.prototype.$value = function(){
	return this._date;
};

/**
 * format 메서드는 $Date 객체가 저장하고 있는 시간을 인수로 지정한 형식 문자열에 맞추어 변환한다. 형식 문자열은 PHP의 date 함수와 동일하게 사용한다. ??
 * @param {Date} strFormat  형식 문자열
 * @returns {String} 시간을 형식 문자열에 맞추어 변환한 문자열.
 */
jindo.$Date.prototype.format = function(strFormat){
	var o = {};
	var d = this._date;
	
	return (strFormat||"").replace(/[a-z]/ig, function callback(m){
		if (typeof o[m] != "undefined") return o[m];

		switch(m) {
			case"d":
			case"j":
				o.j = d.getDate();
				o.d = (o.j>9?"":"0")+o.j;
				return o[m];
			case"l":
			case"D":
			case"w":
			case"N":
				o.w = d.getDay();
				o.N = o.w?o.w:7;
				o.D = $Date.names.s_day[o.w];
				o.j = $Date.names.day[o.w];
				return o[m];
			case"S":
				return (!!(o.S=["st","nd","rd"][d.getDate()]))?o.S:(o.S="th");
			case"z":
				o.z = Math.floor((d.getTime() - (new Date(d.getFullYear(),0,1)).getTime())/(3600*24*1000));
				return o.z;
			case"m":
			case"n":
				o.n = d.getMonth()+1;
				o.m = (o.n>9?"":"0")+o.n;
				return o[m];
			case"L":
				o.L = this.isLeapYear();
				return o.L;
			case"o":
			case"Y":
			case"y":
				o.o = o.Y = d.getFullYear();
				o.y = (o.o+"").substr(2);
				return o[m];
			case"a":
			case"A":
			case"g":
			case"G":
			case"h":
			case"H":
				o.G = d.getHours();
				o.g = (o.g=o.G%12)?o.g:12;
				o.A = o.G<12?$Date.names.ampm[0]:$Date.names.ampm[1];
				o.a = o.A.toLowerCase();
				o.H = (o.G>9?"":"0")+o.G;
				o.h = (o.g>9?"":"0")+o.g;
				return o[m];
			case"i":
				o.i = (((o.i=d.getMinutes())>9)?"":"0")+o.i;
				return o.i;
			case"s":
				o.s = (((o.s=d.getSeconds())>9)?"":"0")+o.s;
				return o.s;
			case"u":
				o.u = d.getMilliseconds();
				return o.u;
			case"U":
				o.U = this.time();
				return o.U;
			default:
				return m;
		}
	});
};

/**
 * time 메서드는 GMT 1970/01/01 00:00:00을 기준으로 경과한 시간을 설정하거나 가져온다.
 * @param {Number} nTime 밀리 초 단위의 시간 값. 
 * @return {$Date | Number} 인수를 지정했다면 GMT 1970/01/01 00:00:00 에서 부터 인수만큼 지난 시간을 설정한 $DAte 객체. 인수를 지정하지 않았다면 GMT 1970/01/01 00:00:00에서 부터 $Date 객체에 지정된 시각까지 경과한 시간(밀리 초).
 */
jindo.$Date.prototype.time = function(nTime) {
	if (typeof nTime == "number") {
		this._date.setTime(nTime);
		return this;
	}

	return this._date.getTime();
};

/**
 * year 메서드는 년도를 설정하거나 가져온다.
 * @param {Number} nYear 설정할 년도값
 * @return {$Date | Number} 인수를 지정하였다면 새로 년도 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 년도를 리턴한다.
 */
jindo.$Date.prototype.year = function(nYear) {
	if (typeof nYear == "number") {
		this._date.setFullYear(nYear);
		return this;
	}

	return this._date.getFullYear();
};

/**
 * month 메서드는 달을 설정하거나 가져온다.
 * @param {Number} nMon 설정할 달의 값
 * @return {$Date | Number} 인수를 지정하였다면 새로 달을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 달을 리턴한다.
 * @remark 리턴 값의 범위는 0(1월)에서 11(12월)이다.
 */
jindo.$Date.prototype.month = function(nMon) {
	if (typeof nMon == "number") {
		this._date.setMonth(nMon);
		return this;
	}

	return this._date.getMonth();
};

/**
 * date 메서드는 날짜를 설정하거나 가져온다.
 * @param {nDate} nDate	설정할 날짜 값
 * @return {$Date | Number} 인수를 지정하였다면 새로 날짜를 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 날짜를 리턴한다.
 */
jindo.$Date.prototype.date = function(nDate) {
	if (typeof nDate == "number") {
		this._date.setDate(nDate);
		return this;
	}

	return this._date.getDate();
};

/**
 * day 메서드는 요일을 가져온다. 
 * @return {Number} 요일 값. 0(일요일)에서 6(토요일)을 리턴한다. 
 */
jindo.$Date.prototype.day = function() {
	return this._date.getDay();
};

/**
 * hours 메서드는 시(時)를 설정하거나 가져온다.
 * @param {Number} nHour 설정할 시 값
 * @return {$Date | Number} 인수를 지정하였다면 새로 시 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 시 값.
 */
jindo.$Date.prototype.hours = function(nHour) {
	if (typeof nHour == "number") {
		this._date.setHours(nHour);
		return this;
	}

	return this._date.getHours();
};

/**
 * seconds 메서드는 초을 설정하거나 가져온다.
 * @param {Number} nSec 설정할 초 값
 * @return {Number} 인수를 지정하였다면 새로 초 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 초 값.
 */
jindo.$Date.prototype.seconds = function(nSec) {
	if (typeof nSec == "number") {
		this._date.setSeconds(nSec);
		return this;
	}

	return this._date.getSeconds();
};

/**
 * minutes 메서드는 분을 설정하거나 가져온다.
 * @param {Number} nMin 설정할 분 값
 * @return {Number} 인수를 지정하였다면 새로 분 값을 설정한 $Date 객체. 인수를 지정하지 않았다면 $Date 객체가 지정하고 있는 시각의 분 값.
 */
jindo.$Date.prototype.minutes = function(nMin) {
	if (typeof nMin == "number") {
		this._date.setMinutes(nMin);
		return this;
	}

	return this._date.getMinutes();
};

/**
 * isLeapYear 메서드는 시각의 윤년 여부를 확인한다.
 * @returns {Boolean} $Date가 가리키고 있는 시각이 윤년이면 True, 그렇지 않다면 False
 */
jindo.$Date.prototype.isLeapYear = function() {
	var y = this._date.getFullYear();

	return !(y%4)&&!!(y%100)||!(y%400);
};
/**
 * @fileOverView $Window의 생성자 및 메서드를 정의한 파일
 * @name window.js
 */

/**
 * $Window 객체를 생성하고 생성한 객체를 반환한다.
 * @class $Window 객체는 자바스크립트 네이티브 객체인 window 객체를 래핑하고, 이를 다루기 위한 여러가지 메서드를 제공한다.
 * @param {HTMLWidnow} el $Window로 감쌀 window 엘리먼트.
 * @author gony
 */
jindo.$Window = function(el) {
	var cl = arguments.callee;
	if (el instanceof cl) return el;
	if (!(this instanceof cl)) return new cl(el);

	this._win = el || window;
}

/**
 * $value 메서드는 $Window 객체로 감싼 원래의 window 객체를 반환한다.
 * @return {HTMLWindow} window 엘리먼트
 */
jindo.$Window.prototype.$value = function() {
	return this._win;
};

/**
 * resizeTo 메서드는 window 객체의 크기를 주어진 크기로 변경한다.
 * 이 크기는 프레임을 포함한 창 전체의 크기를 나타내므로 실제로 표현하는 컨텐트 사이즈는
 * 브라우저 종류와 설정에 따라 달라질 수 있다.
 * @remark 브라우저에 따라 보안 문제 때문에, 창 크기가 화면의 가시 영역을 벗어나서 커지지 못하도록 막는 경우도 있다. 이 경우에는 지정한 크기보다 작게 창이 커진다.
 * @param {Number} nWidth 창의 너비
 * @param {Number} nHeight 창의 높이
 * @return {$Window} 창 크기가 변경된 $Window 객체 this
 * @see $Window#resizeBy
 * @example
 * 	// 현재 창의 너비를 400, 높이를 300으로 변경한다.
 *  $Window.resizeTo(400, 300);
 */
jindo.$Window.prototype.resizeTo = function(nWidth, nHeight) {
	this._win.resizeTo(nWidth, nHeight);
	return this;
};

/**
 * resizeBy 메서드는 window 객체의 크기를 주어진 크기만큼 변경한다.
 * @param {Number} nWidth 늘어날 창의 너비
 * @param {Number} nHeight 늘어날 창의 높이
 * @see $Window#resizeTo
 * @example
 *   // 현재 창의 너비를 100, 높이를 50 만큼 늘린다.
 *   $Window().resize(100, 50);
 */
jindo.$Window.prototype.resizeBy = function(nWidth, nHeight) {
	this._win.resizeBy(nWidth, nHeight);
	return this;
};

/**
 * moveTo 메서드는 창을 주어진 위치로 이동시킨다. 좌표는 프레임을 포함 윈도우의 좌측 상단을 기준으로 한다.
 * @param {Number} nLeft 이동할 x좌표 (pixel 단위)
 * @param {Number} nTop 이동할 y좌표 (pixel 단위)
 * @see $Window#moveBy
 * @example
 *  // 현재 창을 (15, 10) 으로 이동시킨다.
 *  $Window().moveTo(15, 10);
 */
jindo.$Window.prototype.moveTo = function(nLeft, nTop) {
	this._win.moveTo(nLeft, nTop);
	return this;
};

/**
 * moveTo 메서드는 창을 주어진 위치만큼 이동시킨다.
 * @param {Number} nLeft x좌표로 이동할 양 (pixel 단위)
 * @param {Number} nTop y좌표 이동할 양 (pixel 단위)
 * @see $Window#moveTo
 * @example
 *  // 현재 창을 좌측으로 15px, 아래로 10px만큼 이동시킨다.
 *  $Window().moveBy(15, 10);
 */
 jindo.$Window.prototype.moveBy = function(nLeft, nTop) {
	this._win.moveBy(nLeft, nTop);
	return this;
};

/**
 * sizeToContent 메서드는 내부 문서 크기에 맞추어 객체의 크기를 변경한다.
 * @remark 메서드의 특성상 내부 문서가 완전히 로딩된 다음에 실행되어야 한다. 또한, 창이 내부 문서보다 큰 경우에는 내부 문서를 구할 수 없으므로, 반드시 창 크기를 내부 문서보다 작게 만든다.
 * @example
 * // 새 창을 띄우고 자동으로 창 크기를 컨텐트에 맞게 변경하는 함수
 * function winopen(url) {	
 *		try {
 *			win = window.open(url, "", "toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=250,height=300");
 *			win.moveTo(200, 100);
 *			win.focus();
 *		} catch(e){}
 *
 *		setTimeout(function() {
 *			$Window(win).sizeToContent();
 *		}, 1000);
 *		
 *	}
 *
 * winopen('/samples/popup.html');
 */
jindo.$Window.prototype.sizeToContent = function() {
	if (typeof this._win.sizeToContent == "function") {
		this._win.sizeToContent();
	} else {
		var doc = $Document(this._win.document);
		var clientSize = doc.clientSize();
		var scrollSize = doc.scrollSize();

		this.resizeBy(scrollSize.width - clientSize.width, scrollSize.height - clientSize.height);
	}

	return this;
};
/**
 * @fileOverview	다른 프레임웍 없이 jindo만 사용할 경우 편의성을 위해 jindo 객체를 window에 붙임
 */
// copy jindo objects to window
if (typeof window != "undefined") {
	for (prop in jindo) window[prop] = jindo[prop];
}

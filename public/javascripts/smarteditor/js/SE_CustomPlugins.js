//   ���Ͼ��ε� Ŭ���� �߰�
nhn.husky.SE_ImageUpload = $Class({
    name : "SE_ImageUpload",

    $init : function(oAppContainer){
       this._assignHTMLObjects(oAppContainer);
    },

    _assignHTMLObjects : function(oAppContainer){
       this.oImageUploadLayer = cssquery.getSingle("DIV.husky_seditor_imgupload_layer", oAppContainer);
    },

    $ON_MSG_APP_READY : function(){
       this.oApp.exec("REGISTER_UI_EVENT", ["imgupload", "click", "SE_TOGGLE_IMAGEUPLOAD_LAYER"]);
    },

    $ON_SE_TOGGLE_IMAGEUPLOAD_LAYER : function(){
       this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.oImageUploadLayer]);
       //imgUploadFrame.location = "imgupload.html?id=" + this.oApp.sAppId;
       imgUploadFrame.location = "/admin/ui/smarteditimgupload/" + this.oApp.sAppId;       
    }
});

//   �̸�Ƽ�� Ŭ���� �߰�
nhn.husky.SE_Emoticon = $Class({
    name : "SE_Emoticon",

    $init : function(oAppContainer){
       this._assignHTMLObjects(oAppContainer);
    },

    _assignHTMLObjects : function(oAppContainer){
       this.oEmoticonLayer = cssquery.getSingle("DIV.husky_seditor_emoticon_layer", oAppContainer);
    },

    $ON_MSG_APP_READY : function(){
       this.oApp.exec("REGISTER_UI_EVENT", ["emoticon", "click", "SE_TOGGLE_EMOTICON_LAYER"]);
    },

    $ON_SE_TOGGLE_EMOTICON_LAYER : function(){
       this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER", [this.oEmoticonLayer]);
       //emoticonFrame.location = "/starteditor/emoticon?id=" + this.oApp.sAppId; 
       emoticonFrame.location = "/admin/ui/smarteditemoticon/" + this.oApp.sAppId;
       
    }
});

function SE_RegisterCustomPlugins(oEditor, elAppContainer){
    oEditor.registerPlugin(new nhn.husky.SE_ImageUpload(elAppContainer));
    oEditor.registerPlugin(new nhn.husky.SE_Emoticon(elAppContainer));
}



//
// StarWebPrintTrader API
//
// Version 1.1.0
//
// Copyright 2012 STAR MICRONICS CO., LTD. All Rights Reserved.
//

var StarWebPrintTrader=function(a){this.papertype=this.checkedblock=this.url=null;this.timeout=9E4;this.onTimeout=this.onError=this.onReceive=null;this.holdprint_timeout=void 0;this._json=this._url=null;void 0!=a&&(void 0!=a.url&&(this.url=a.url),void 0!=a.checkedblock&&(this.checkedblock=a.checkedblock),void 0!=a.papertype&&(this.papertype=a.papertype),void 0!=a.timeout&&(this.timeout=a.timeout),void 0!=a.holdprint_timeout&&(this.holdprint_timeout=a.holdprint_timeout))},_handlerCallback={};
function _onFinish(a){var b=_handlerCallback[a.url],c=a.response;_handlerCallback[a.url]=null;if(200==a.htmlCode)b.onReceive({traderSuccess:c.slice(c.indexOf("&lt;success&gt;")+15,c.indexOf("&lt;/success&gt;")),traderCode:c.slice(c.indexOf("&lt;code&gt;")+12,c.indexOf("&lt;/code&gt;")),traderStatus:c.slice(c.indexOf("&lt;status&gt;")+14,c.indexOf("&lt;/status&gt;")),status:a.htmlCode,responseText:c});else b.onError({status:a.htmlCode,responseText:c})}
StarWebPrintTrader.prototype._callMessageHandler=function(){var a=this;null==_handlerCallback[a._url]?(_handlerCallback[a._url]=a,webkit.messageHandlers.sendMessageHandler.postMessage(a._json)):setTimeout(function(){a._callMessageHandler()},500)};
StarWebPrintTrader.prototype.sendMessage=function(a){var b="<root";void 0!=a.checkedblock?!1==a.checkedblock&&(b+=' checkedblock="false"'):!1==this.checkedblock&&(b+=' checkedblock="false"');void 0!=a.papertype?"normal"==a.papertype?b+=' papertype="normal"':"black_mark"==a.papertype?b+=' papertype="black_mark"':"black_mark_and_detect_at_power_on"==a.papertype&&(b+=' papertype="black_mark_and_detect_at_power_on"'):"normal"==this.papertype?b+=' papertype="normal"':"black_mark"==this.papertype?b+=' papertype="black_mark"':
"black_mark_and_detect_at_power_on"==this.papertype&&(b+=' papertype="black_mark_and_detect_at_power_on"');void 0!=a.holdprint_timeout?b+=' holdprint_timeout="'+a.holdprint_timeout+'"':void 0!=this.holdprint_timeout&&(b+=' holdprint_timeout="'+this.holdprint_timeout+'"');var b=b+(">"+a.request+"</root>"),c;c='<StarWebPrint xmlns="http://www.star-m.jp" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Request>';c+=this._encodeEscapeSequence(b);c+="</Request>";c+="</StarWebPrint>";b="";b=void 0!=
a.url?a.url:this.url;if(/^https?:\/\/(localhost|127\.0\.0\.1):8001\//.test(b.toLowerCase())&&-1!=navigator.userAgent.indexOf("webPRNTSupportMessageHandler"))this._json=JSON.stringify({url:b,body:c}),this._url=b,this._callMessageHandler();else{var d=null;if(window.XMLHttpRequest)d=new XMLHttpRequest;else if(window.ActiveXObject)d=new ActiveXObject("Microsoft.XMLHTTP");else{if(this.onError)this.onError({status:10001,responseText:"XMLHttpRequest is not supported."});return}if(-1!=navigator.userAgent.indexOf("iPad;")||
-1!=navigator.userAgent.indexOf("iPhone;")||-1!=navigator.userAgent.indexOf("iPod touch;")||-1!=navigator.userAgent.indexOf("Android"))if(-1==navigator.userAgent.indexOf("WebPRNTSupportHTTPS")&&(0==b.toLowerCase().indexOf("https://localhost")||0==b.toLowerCase().indexOf("https://127.0.0.1")))b="http://"+b.substring(8);try{d.open("POST",b,!0)}catch(f){if(this.onError)this.onError({status:10002,responseText:f.message});return}try{void 0!=a.timeout?d.timeout=a.timeout:this.timeout&&(d.timeout=this.timeout)}catch(h){}d.setRequestHeader("Content-Type",
"text/xml; charset=UTF-8");var e=this;d.onreadystatechange=function(){if(4==d.readyState)try{if(200==d.status){var a=d.responseXML.getElementsByTagName("Response");if(0<a.length){if(e.onReceive){var b=a[0].childNodes[0].nodeValue;e.onReceive({traderSuccess:b.slice(b.indexOf("<success>")+9,b.indexOf("</success>")),traderCode:b.slice(b.indexOf("<code>")+6,b.indexOf("</code>")),traderStatus:b.slice(b.indexOf("<status>")+8,b.indexOf("</status>")),status:d.status,responseText:d.responseText})}}else if(e.onError)e.onError({status:d.status,
responseText:d.responseText})}else if(e.onError)e.onError({status:d.status,responseText:d.responseText})}catch(c){if(e.onError)e.onError({status:0,responseText:"Connection timeout occurred."})}};try{d.ontimeout=function(){if(e.onTimeout)e.onTimeout()}}catch(k){}try{d.send(c)}catch(g){if(this.onError)this.onError({status:10003,responseText:g.message})}}};StarWebPrintTrader.prototype._onHandlerSuccess=function(a){if(trader.onReceive)trader.onReceive(a)};
StarWebPrintTrader.prototype._onHandlerError=function(a){if(trader.onError)trader.onError(a)};StarWebPrintTrader.prototype.isCoverOpen=function(a){return parseInt(a.traderStatus.substr(4,2),16)&32?!0:!1};StarWebPrintTrader.prototype.isOffLine=function(a){return parseInt(a.traderStatus.substr(4,2),16)&8?!0:!1};StarWebPrintTrader.prototype.isCompulsionSwitchClose=function(a){return parseInt(a.traderStatus.substr(4,2),16)&4?!0:!1};
StarWebPrintTrader.prototype.isEtbCommandExecute=function(a){return parseInt(a.traderStatus.substr(4,2),16)&2?!0:!1};StarWebPrintTrader.prototype.isHighTemperatureStop=function(a){return parseInt(a.traderStatus.substr(6,2),16)&64?!0:!1};StarWebPrintTrader.prototype.isNonRecoverableError=function(a){return parseInt(a.traderStatus.substr(6,2),16)&32?!0:!1};StarWebPrintTrader.prototype.isAutoCutterError=function(a){return parseInt(a.traderStatus.substr(6,2),16)&8?!0:!1};
StarWebPrintTrader.prototype.isBlackMarkError=function(a){return parseInt(a.traderStatus.substr(8,2),16)&8?!0:!1};StarWebPrintTrader.prototype.isPaperEnd=function(a){return parseInt(a.traderStatus.substr(10,2),16)&8?!0:!1};StarWebPrintTrader.prototype.isPaperNearEnd=function(a){return parseInt(a.traderStatus.substr(10,2),16)&4?!0:!1};StarWebPrintTrader.prototype.isPaperPresent=function(a){return parseInt(a.traderStatus.substr(12,2),16)&2?!0:!1};
StarWebPrintTrader.prototype.extractionEtbCounter=function(a){var b=0;parseInt(a.traderStatus.substr(14,2),16)&64&&(b|=16);parseInt(a.traderStatus.substr(14,2),16)&32&&(b|=8);parseInt(a.traderStatus.substr(14,2),16)&8&&(b|=4);parseInt(a.traderStatus.substr(14,2),16)&4&&(b|=2);parseInt(a.traderStatus.substr(14,2),16)&2&&(b|=1);return b};
StarWebPrintTrader.prototype._encodeEscapeSequence=function(a){var b=/[<>&]/g;b.test(a)&&(a=a.replace(b,function(a){switch(a){case "<":return"&lt;";case ">":return"&gt;"}return"&amp;"}));return a};

export default StarWebPrintTrader;
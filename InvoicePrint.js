import StarWebPrintTrader from './Plugns/StarWebPrintTrader';

function onSendMessage(printerType, url, base64_xml, success, reject) {
  let obj = {
    1: mcPrint,
  }

  if(obj[printerType]){
    return obj[printerType](url, base64_xml);
  }else{
    return;
  }
}


function mcPrint(url, base64_xml, success, reject) {
	var papertype = '';
	var timeout = 90000;
	var holdprint_timeout = 10000;

	var trader = new StarWebPrintTrader({
		url: url,
		papertype: papertype,
		timeout: timeout,
		holdprint_timeout: holdprint_timeout
	});

	trader.onReceive = function (response) {
		var msg = '- onReceive -\n\n';

		msg += 'TraderSuccess : [ ' + response.traderSuccess + ' ]\n';
		msg += 'TraderCode : [ ' + response.traderCode + ' ]\n';
		msg += 'TraderStatus : [ ' + response.traderStatus + ',\n';

		if (trader.isCoverOpen({ traderStatus: response.traderStatus })) { msg += '\tCoverOpen,\n'; }
		if (trader.isOffLine({ traderStatus: response.traderStatus })) { msg += '\tOffLine,\n'; }
		if (trader.isCompulsionSwitchClose({ traderStatus: response.traderStatus })) { msg += '\tCompulsionSwitchClose,\n'; }
		if (trader.isEtbCommandExecute({ traderStatus: response.traderStatus })) { msg += '\tEtbCommandExecute,\n'; }
		if (trader.isHighTemperatureStop({ traderStatus: response.traderStatus })) { msg += '\tHighTemperatureStop,\n'; }
		if (trader.isNonRecoverableError({ traderStatus: response.traderStatus })) { msg += '\tNonRecoverableError,\n'; }
		if (trader.isAutoCutterError({ traderStatus: response.traderStatus })) { msg += '\tAutoCutterError,\n'; }
		if (trader.isBlackMarkError({ traderStatus: response.traderStatus })) { msg += '\tBlackMarkError,\n'; }
		if (trader.isPaperEnd({ traderStatus: response.traderStatus })) { msg += '\tPaperEnd,\n'; }
		if (trader.isPaperNearEnd({ traderStatus: response.traderStatus })) { msg += '\tPaperNearEnd,\n'; }
		if (trader.isPaperPresent({ traderStatus: response.traderStatus })) { msg += '\tPaperPresent,\n'; }

		msg += '\tEtbCounter = ' + trader.extractionEtbCounter({ traderStatus: response.traderStatus }).toString() + ' ]\n';

		success(msg); // 成功时返回 response
	}

	trader.onError = function (response) {
		var msg = '- onError -\n\n';
		msg += '\tStatus:' + response.status + '\n';
		msg += '\tResponseText:' + response.responseText + '\n\n';

		var answer = confirm('列印失敗 要重試嗎？\n');
		if (answer) {
			// 重试
			mcPrint(url, base64_xml, success, reject); // 递归调用时也需要返回 Promise
		} else {
			reject(new Error(msg)); // 失败时返回错误
		}
	}

	// 发送解码后的 XML 请求
	trader.sendMessage({ request: decodeURIComponent(escape(atob(base64_xml))) });
}


export {
  onSendMessage
}
import { usePage } from '@inertiajs/vue3'
import StarWebPrintTrader from './Plugns/StarWebPrintTrader';
import { confirmCustom } from '@/Services/confirmCustom'
const page = usePage();

function onSendMessage(printerType, url, base64_xml) {
  let obj = {
    1: mcPrint,
  }

  if(obj[printerType]){
    return obj[printerType](url, base64_xml);
  }else{
    return;
  }
}


function mcPrint(url, base64_xml) {
	// //開錢箱
	// starWeb(url, '\x1B\x70\x00\x19\xFA');
	//列印
	starWeb(url, decodeURIComponent(escape(atob(base64_xml))));
}


function starWeb(url, request) {
	return new Promise((resolve, reject) => {
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

			resolve(msg); // 成功时返回 response
		}

		trader.onError = async (response) => {
			var msg = '- onError -\n\n';
			msg += '\tStatus:' + response.status + '\n';
			msg += '\tResponseText:' + response.responseText + '\n\n';

			if(await confirmCustom(page.props.langs, '列印失敗 要重試嗎？\n')){
				// 重试
				mcPrint(url, base64_xml).then(resolve).catch(reject); // 递归调用时也需要返回 Promise
			} else {
				reject(new Error(msg)); // 失败时返回错误
			}
		}

		// 发送解码后的 XML 请求
		trader.sendMessage({ request: request });
	});
}


export {
  onSendMessage
}
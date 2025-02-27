import { usePage } from '@inertiajs/vue3'
import axios from 'axios'
import StarWebPrintTrader from './Plugns/StarWebPrintTrader';
import { confirmCustom } from '@/Services/confirmCustom'
import ConfirmsPassword from './ConfirmsPassword.vue';
const page = usePage();

const objType = {
	1: {
			'print': mcPrint,
			// 'cash': mcmCash,
			// 'status': mcStatus,
	},
	7: {
			'print': gmPrint,
			'cash': gmCash,
			'status': gmStatus,
	},
};

function checkType(type, printerType, printData) {
	if(objType[printerType] && objType[printerType][type]){
		return objType[printerType][type](printData);
	}else{
		return  new Promise((resolve, reject) => { reject('error') });
	}
}

function onSendMessage(printerType, printData) {
	return checkType('print', printerType, printData);
}

function onOpenCash(printerType, printData) {
	return checkType('cash', printerType, printData);
}

function onStatus(printerType, printData) {
	return checkType('status', printerType, printData);
}


function gmPrint(printData) {
	gmCash(printData);
	return gmWeb(printData, printData.invoice?.response_data?.base64_data);
}

function gmCash(printData) {
	return gmWeb(printData, 'G0AbcDA8eA==');
}

function gmStatus(printData) {
	return new Promise((resolve, reject) => {
		let url = `//${printData.store?.e_invoice_serve_ip}.grandmall.me:9119/status`;

		let obj = {
			method: 'GET',
			headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

		fetch(url, obj)
		.then(function (response) {
			resolve('success');
		})
		.catch(function (error) {
			reject(`error`);
		});
	});
}

function gmWeb(printData, baseData, path = 'print', method = 'post') {
	return new Promise((resolve, reject) => {
		let url = `//${printData.store?.e_invoice_serve_ip}.grandmall.me:9119/${ path }`;
		let printer_url = printData.store?.e_invoice_machine_ip;

		let obj = {
			method: method,
			headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
					ip: printer_url,
					port: 9100,
					s: baseData
			})
		};

		console.log(url, obj);

		fetch(url, obj)
		.then(response => response.json()) // 這裡只解析為 JSON
		.then(data => {
				console.log(data);
				if ( data?.code == 0 ) {
					// console.log(data.code);
					resolve('列印成功');
				}
				else {
					reject('');
				}
		})
		.catch(function (error) {
			reject(`\n無法與印表機建立連線\n
				檢查印表機是否有啟動\n
				檢查印表機的應用程式是否有啟動`);
		});
	});
}


function mcPrint(printData) {
	//開錢箱
	// console.log('開錢箱');
	// starWeb(url, '\x1B\x07\x00\x00');
	// console.log('列印');
	//列印
	let url = `//${printData.store?.e_invoice_machine_ip}/StarWebPRNT/SendMessage`;
	let base64_xml = printData.invoice?.response_data?.base64_data;
	return starWeb(url, decodeURIComponent(escape(atob(base64_xml))));
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
  onSendMessage,
	onOpenCash,
	onStatus
}

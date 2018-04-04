console.log('speedRuler：insert script => ruler.js');

const sendMessage = chrome.runtime.sendMessage;
const onMessage = chrome.runtime.onMessage;


const Page = {

	data: {
		timingArr: [],
		resourceArr: []
	},

	getTiming(_this) {

		let time = performance.timing;
		let timingObj = {};

		let loadTime = (time.loadEventEnd - time.loadEventStart) / 1000;

		if (loadTime < 0) {
			setTimeout(function() {
				_this.getTiming();
			}, 200);
			return;
		}

		timingObj['重定向时间'] = (time.redirectEnd - time.redirectStart) / 1000;
		timingObj['DNS解析时间'] = (time.domainLookupEnd - time.domainLookupStart) / 1000;
		timingObj['TCP完成握手时间'] = (time.connectEnd - time.connectStart) / 1000;
		timingObj['HTTP请求响应完成时间'] = (time.responseEnd - time.requestStart) / 1000;
		timingObj['DOM开始加载前所花费时间'] = (time.responseEnd - time.navigationStart) / 1000;
		timingObj['DOM加载完成时间'] = (time.domComplete - time.domLoading) / 1000;
		timingObj['DOM结构解析完成时间'] = (time.domInteractive - time.domLoading) / 1000;
		timingObj['脚本加载时间'] = (time.domContentLoadedEventEnd - time.domContentLoadedEventStart) / 1000;
		timingObj['onload事件时间'] = (time.loadEventEnd - time.loadEventStart) / 1000;
		timingObj['页面完全加载时间'] = (timingObj['重定向时间'] + timingObj['DNS解析时间'] + timingObj['TCP完成握手时间'] + timingObj['HTTP请求响应完成时间'] + timingObj['DOM结构解析完成时间'] + timingObj['DOM加载完成时间']);


		let timingArr = [];

		for (let key in timingObj) {
			timingArr.push({
				'name': key,
				'durations(s)': timingObj[key]
			});
		}

		this.data.timingArr = timingArr;

	},


	getResourceTiming() {

		if (!window.performance && !window.performance.getEntries) {
			return false;
		}

		var resourceArr = [];
		window.performance.getEntries().forEach(function(perf) {
			resourceArr.push({
				'url': perf.name,
				'entryType': perf.entryType,
				'type': perf.initiatorType,
				'duration(ms)': perf.duration
			});
		});

		this.data.resourceArr = resourceArr;
	},

	initData() {
		this.getTiming(this);
		this.getResourceTiming();
	},

	bindEvent() {
		let that = this;
		onMessage.addListener(function(req, sender, sendResponse) {

			if (req.action === 'MEASURE') {
				console.table(that.data.timingArr);
				sendResponse('Success');
			} else if (req.action == 'RESOURCE') {
				console.table(that.data.resourceArr);
				sendResponse('Success');
			} else {
				console.error('undefined action');
				sendResponse('Error');
			}
		});

		window.addEventListener('load', function() {
			that.initData();
		}, false);
	},

	init() {
		this.bindEvent();
	}
};

Page.init();
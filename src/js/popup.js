const find = function(selector) {
	return document.querySelector(selector);
}

const sendMessage = chrome.tabs.sendMessage;
const onMessage = chrome.runtime.onMessage;
const query = chrome.tabs.query;

const measureBtn = find('#measureBtn');
const resourceBtn = find('#resourceBtn');


const Plugin = {

	bindEvent() {

		let that = this;

		measureBtn.addEventListener('click', function(){
			that.queryPerformance('MEASURE');
		}, false);

		resourceBtn.addEventListener('click', function(){
			that.queryPerformance('RESOURCE');
		}, false);

	},

	queryPerformance(action) {
		query({
				active: true,
				currentWindow: true
		}, function(tabs){
				sendMessage(tabs[0].id, {
						action: action
				}, function(res){
						console.log(res);
				})
		})
	},

	init() {
		this.bindEvent();
	}

};

Plugin.init();

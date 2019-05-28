if (typeof window == "undefined") {
	window = global;
}

var getMappedAddr = function (url) {
	var addrMap = {
		"http://ss.raiyku.com": ["http://localhost:3001", "127.0.0.1:3001", "http://192.168.0.188:3000"]
	};
	var _getMappedAddr = function (originalUrl) {
		var key = null, i = null, searchFlag = true, result = null;
		for (key in addrMap) {
			if (addrMap.hasOwnProperty(key) && searchFlag) {
				value = addrMap[key];
				if (Object.prototype.toString.call(value) == '[object Array]') {
					for (i = 0; i < value.length; i++) {
						if (originalUrl.indexOf(value[i]) > -1) {
							result = key, searchFlag = false;
							break;
						}
					}
				}
			}
		}
		return result;
	};
	return _getMappedAddr(url || window.location.href);
}

window.getMappedAddr = getMappedAddr;
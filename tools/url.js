if (typeof window == "undefined") {
	window = global;
}

var getMappedAddr = function (arg2, url) {
	var addrMap = {
		hostLvl: {
			0: ["localhost"]
		},
		ipKeys: [
			{
				keyName: 'dev',
				ip: "http://ss.raiyku.com",
				level: 0
			}
		]
	};
	var _searchArr = function (arr, keyName, targetValue, cb) {
		var i = null, itItem = null, searchNext = true;
		for (i = 0; i < arr.length; i++) {
			itItem = arr[i];
			if (!(keyName in itItem)) {
				continue;
			}
			if (itItem[keyName] == targetValue) {
				cb && cb(itItem, i, searchNext);
			}
			if (!searchNext) {
				break;
			}
		}
	}
	var _getCurHostLvl = function (hostList, targetUrl) {
		var key = null, i = null, value = null,
			searchFlag = true, result = null;
		for (key in hostList) {
			if (hostList.hasOwnProperty(key) && searchFlag) {
				value = hostList[key];
				if (Object.prototype.toString.call(value) == '[object Array]') {
					for (i = 0; i < value.length; i++) {
						if (targetUrl.indexOf(value[i]) > -1) {
							result = key, searchFlag = false;
							break;
						}
					}
				}
			}
		}
		return result;
	}
	var _getHostLvl2IP = function (lvl, targetKey, ipKeyList) {
		var i = null, result = null, filteredKeyList = [],
			itItem = null;
		_searchArr(ipKeyList, 'keyName', targetKey, function (itItem) {
			filteredKeyList.push(itItem);
		});
		if (filteredKeyList.length == 0) {
			return null;
		}
		_searchArr(filteredKeyList, 'level', lvl, function (itItem, index, searchNext) {
			result = itItem['ip'];
			searchNext = false;
		});
		return result;
	}
	var _getMappedAddr = function (originalUrl, ipKey) {
		var key = null, { hostLvl, ipKeys } = addrMap,
			result = null, curHostLvl = null;
		// get host level key
		curHostLvl = _getCurHostLvl.call(this, hostLvl, originalUrl);
		if (!curHostLvl) {
			return null;
		}
		// search keys
		result = _getHostLvl2IP.call(this, curHostLvl, ipKey, ipKeys);
		return result;
	};
	return _getMappedAddr(url || window.location.href, arg2);
}

window.getMappedAddr = getMappedAddr;

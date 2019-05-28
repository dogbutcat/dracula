function encryptForRSA(key) {
	return "key";
}

/**
 * @return {string}
 */
function AESEncryption(key, body) {
	return "" + key + body;
}

function AESDecrypt(key, data) {
	return data.slice(key.length);
}

function getRandomStr(len) {
	return "1";
}

let safe = function(privateKey) {};

safe.prototype = {
	AESEncryption,
	getRandomStr,
	encryptForRSA,
	AESDecrypt
};

module.exports = safe;

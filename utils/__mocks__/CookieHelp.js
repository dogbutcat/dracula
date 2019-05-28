let cookieHelp = {};
let cookieName = "_at";
let savedCookie = null;
let firstVisit = false;

function getCookieInfo(cn) {
	if (cookieName === cn) {
		return JSON.stringify(savedCookie);
	} else if (firstVisit === true) {
		return JSON.stringify({ Authorization: "babara" });
	} else {
		return null;
	}
}

function saveCookieInfo(cn, value) {
	firstVisit = true;
	cookieName = cn;
	savedCookie = value;
}

cookieHelp = {
	getCookieInfo,
	saveCookieInfo
};

module.exports = cookieHelp;

/**
 * Created by lixifeng on 16/11/4.
 * Updated by oliver on Oct.18/17.
 */
let CookieHelp = {
	clearFlag: 'none',
	userCookieKey: "DEMON_USER",
	//获取用户信息
	//获取用户信息
	getUserInfo(keyName) {
		if (!this.first) {
			this.getUserInfoMERO(this.getUserKey(keyName));
		}
		this.first = true;
		return this.userinfo;
	},
	/**
	 * Save User Info to Memo
	 * @param {* User keyname} keyName 
	 * @param {* User object} userinfo 
	 */
	getUserInfoMERO(keyName, userinfo) {
		if (!userinfo) {
			let value = this.getCookieInfo(keyName);
			if (this.clearFlag === value || !value) {
				this.userinfo = null;
			} else {
				try {
					this.userinfo = JSON.parse(value);
				} catch (e) {
					this.userinfo = JSON.parse(decodeURIComponent(value));
				}
			}
		} else {
			this.userinfo = userinfo !== this.clearFlag ? userinfo : null;
		}
	},
	/**
	 * Save User Info Cookie
	 * @param {* user info object} userinfo 
	 * @param {* day to keep cookie} save 
	 * @param {* user key name} keyName 
	 */
	saveUserInfo(userinfo, save, keyName) {
		this.saveCookieInfo(this.getUserKey(keyName), userinfo, save)
		this.getUserInfoMERO(this.getUserKey(keyName), userinfo);
	},
	clearUserInfo() {
		this.saveUserInfo(this.clearFlag);
	},
	//设置

	//获取某个cookie的值
	getCookieInfo(cookiename) {
		// alert(cookiename);
		if (document.cookie.length > 0) {
			let c_start = document.cookie.indexOf(cookiename + "=");
			if (c_start != -1) {
				let cookieStr = document.cookie;
				cookieStr = cookieStr.substring(c_start, cookieStr.length);
				let c_end = cookieStr.indexOf(';');
				c_start = cookiename.length + 1;
				if (c_end == -1) {
					c_end = cookieStr.length;
				}
				let uinfo = cookieStr.substring(c_start, c_end);
				return decodeURI(uinfo);
			}
		}
		return null;
	},
	getUserKey(keyName) {
		this.userCookieKey = keyName || this.userCookieKey;
		return this.userCookieKey;
	},
	saveCookieInfo(key, value, time) {
		let v = '';
		if (typeof value == "string") {
			v = value;
		} else {
			v = JSON.stringify(value)
		}

		if(process.env.NODE_ENV != "production"){
			console.group ? (console.group('Saved Cookie Item'),
			console.log('key: ',key),
			console.log('value: ',value),console.groupEnd()) : void 0;
		}
		let Days = typeof(time) ==='number' ? time : 365;
		let exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = key + "=" + encodeURI(v) + ";expires=" + exp.toUTCString() + ";path=/";
	},

	//退出登录，清楚cookie
	clearCookie() {
		let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
		if (keys) {
			for (let i = keys.length; i--;) {
				document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
			}
		}
	}
}
module.exports = CookieHelp;
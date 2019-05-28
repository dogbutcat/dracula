class IPCData {
    constructor(obj) {
		if(typeof obj == 'string'){
			this.format(obj);
		}else{
			this.initData(obj);
		}
    }

    initData(obj) {
        if (obj) {
            this._type = obj.type;
            this._data = obj.data || {};
        }
    }

    toString() {
        return JSON.stringify({ type: this._type, data: this._data });
    }

    format(str) {
        try {
            let data = JSON.parse(str);
            this.initData(data);
        } catch (error) {
            throw new Error("Data format error!");
        }
	}
	
	get type(){
		return this._type;
	}

	get data(){
		return this._data;
	}
}

module.exports = IPCData;
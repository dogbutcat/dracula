/**
 * This is Main for console.log coloring, only support
 */
let colorObj = {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",
        //FG
        FgBlack: "\x1b[30m",
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgBlue: "\x1b[34m",
        FgMagenta: "\x1b[35m",
        FgCyan: "\x1b[36m",
        FgWhite: "\x1b[37m",
        //BG
        BgBlack: "\x1b[40m",
        BgRed: "\x1b[41m",
        BgGreen: "\x1b[42m",
        BgYellow: "\x1b[43m",
        BgBlue: "\x1b[44m",
        BgMagenta: "\x1b[45m",
        BgCyan: "\x1b[46m",
        BgWhite: "\x1b[47m"
    },
    unitArr = [" bytes", " kB", " MB", " GB"],
    LOG_LVL = {E:"error",I:"info",D:"debug",V: "verbose"};

module.exports = {
    FgRed: function() {
        let args = [].slice.call(arguments);
        [].splice.call(args, 0, 0, colorObj.FgRed);
        args.push("\x1b[0m");
        return args.join("");
    },
    FgGreen: function() {
        let args = [].slice.call(arguments);
        [].splice.call(args, 0, 0, colorObj.FgGreen);
        args.push("\x1b[0m");
        return args.join("");
    },
    FgYellow: function() {
        let args = [].slice.call(arguments);
        [].splice.call(args, 0, 0, colorObj.FgYellow);
        args.push("\x1b[0m");
        return args.join("");
    },
    transferSize: function(val) {
        let i = 0,
            ret = val;
        while (ret > 1024) {
            (ret = (ret / 1024).toFixed(2)), i++;
        }
        ret += unitArr[i];
        return ret;
    },
    __isDEV: false,
    __logLvl: LOG_LVL.E,
    setDEV: function(devSetting) {
        this.__isDEV = devSetting || this.__isDEV;
    },
    setLogLevel: function(lvl) {
        this.__logLvl = lvl || this.__logLvl;
    },
    log: function() {
        if (this.__isDEV) {
            console.log(...arguments);
        }
    },
    info: function () {
        switch (this.__logLvl) {
            case LOG_LVL.V:
                console.log(...arguments);
                break;
        }
    },
    debug: function(){
        switch (this.__logLvl) {
            case LOG_LVL.V:
            case LOG_LVL.D:
                console.log(this.FgYellow(...arguments));
                break;
        }
    },
    error: function() {
        switch (this.__logLvl) {
            case LOG_LVL.V:
            case LOG_LVL.D:
            case LOG_LVL.E:
                console.log(this.FgRed(...arguments));
                break;
            default:
                break;
        }
    },
    clear: function() {
        console.clear();
    }
};

// var exeBGAnim=null, ndiframe=null;
//下载JS
function loadScript(url, callback) {
    var d = document, script = d.createElement("script");
    script.type = "application/javascript";
    if (typeof (callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
    }
    script.src = url;
    d.body.appendChild(script);
}
// if(window.checkIE.isIE()&&!window.checkIE.isIE10()&&!window.checkIE.isIE11()){
//     ndiframe = document.createElement('iframe');
//     ndiframe.className='full';
//     ndiframe.frameBorder=0;
//     ndiframe.src='/hintPage.html';
//     document.body.appendChild(ndiframe);
// }else{
//     exeBGAnim = function () {
//         window.pointLineInit(document.getElementById("_canvas"));
//     }
//     window.onresize = function () {
//         //exeBGAnim();
//     }
//     window.log = function (e) {
//         console.log(e);
//     }
//     exeBGAnim();
//     loadScript('/project/spa.js')
// }
let path = require('path');

let projectDir = process.cwd();
let configFilePath = "";

const getlibRootPath = function () {
	return path.resolve(__dirname, '../');
}

const setProjectDir = function (path) {
	projectDir = path;
}

const setConfigFilePath = function(fullFileName){
	configFilePath = fullFileName;
}

const getProjectDir = function () {
	return projectDir
}

const getConfigFilePath = function(){
	return configFilePath;
}

module.exports = {
	getlibRootPath,
	setProjectDir,
	getProjectDir,
	setConfigFilePath,
	getConfigFilePath
}
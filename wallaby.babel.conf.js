module.exports = function(wallaby) {
	return {
		files: ["utils/**/*.js",'__mocks__/*.*', "!utils/**/__test__/*.js"],

		tests: ["utils/**/__test__/*.js"],

		env: {
			type: "node",
			runner: "node"
		},

		testFramework: "jest",

		compilers: {
			'utils/**/*.js': wallaby.compilers.babel({
				presets: ["@babel/preset-react", "@babel/preset-env"],
				plugins: [
					"@babel/plugin-proposal-class-properties", // for static property transform
					"@babel/plugin-syntax-dynamic-import",
					"@babel/plugin-syntax-import-meta",
					"@babel/plugin-proposal-json-strings",
					[
						"import",
						{
							libraryName: "antd",
							style: true
						}
					]
				]
			})
		},

		filesWithNoCoverageCalculated: ['**/__mocks__/**/*.js']
	};
};

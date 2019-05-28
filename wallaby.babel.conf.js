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
				"presets": [
					"react",
					["es2015", { loose: true }],
					"stage-3"
				],
				"plugins": [
					"transform-class-properties", // for static property transform
					[
						"import",
						{
							"libraryName": "antd",
							"style": true
						},
						{
							"libraryName": "antd-mobile",
							"style": true
						}
					]
					// `style: true` 会加载 less 文件
				]
			})
		},

		filesWithNoCoverageCalculated: ['**/__mocks__/**/*.js']
	};
};

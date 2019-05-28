let webpack = jest.genMockFromModule('webpack');
class HotModuleReplacementPlugin{ }
class NoErrorsPlugin { }
class DefinePlugin { }
class UglifyJsPlugin { }
webpack.HotModuleReplacementPlugin = HotModuleReplacementPlugin
webpack.NoErrorsPlugin = NoErrorsPlugin
webpack.DefinePlugin = DefinePlugin
webpack.optimize = {}
webpack.optimize.UglifyJsPlugin = UglifyJsPlugin

module.exports = webpack;
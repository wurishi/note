const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;

module.exports = {
  entry: {
    // "1.1": "./guide/1.1.js",
    // "1.2": "./guide/1.2.js",
    // "1.3": "./guide/1.3.js",
    // "2.1.1": "./guide/2.1.1.js",
    // "3.1": "./guide/3.1.js",
    // "3.5": "./guide/3.5.js",
    // "3.6": "./guide/3.6.js",
    "4.2": "./guide/4.2.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "TensorFlow.js Guide",
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
};

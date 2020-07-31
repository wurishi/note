const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    "1.1": "./guide/1.1.js",
    "1.2": "./guide/1.2.js",
    "1.3": "./guide/1.3.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "TensorFlow.js Guide",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
};

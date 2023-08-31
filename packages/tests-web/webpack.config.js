const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval",
  devServer: {
    static: {
      directory: path.join(__dirname, "./web"),
    },
    compress: true,
    port: process.env.WEBPACK_DEV_SERVER_PORT || 4000,
    historyApiFallback: true,
  },
  entry: path.join(__dirname, "./index.js"),
  output: {
    path: path.join(__dirname, "./web"),
    publicPath: "/",
    filename: "[name].bundle.js",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./node_modules/@eversurf/dengine-web/dengineweb.wasm" },
        { from: "./node_modules/@eversdk/lib-web/eversdk.wasm" },
      ],
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve("index.js"),
          path.resolve(__dirname, "./node_modules/webpack-dev-server"),
          path.resolve(__dirname, "./node_modules/@eversurf/dengine"),
          path.resolve(__dirname, "./node_modules/@eversurf/tests"),
          path.resolve(__dirname, "./node_modules/@eversurf/dengine-web"),
          path.resolve(__dirname, "./node_modules/@eversdk/core"),
          path.resolve(__dirname, "./node_modules/@eversdk/lib-web"),
          path.resolve(__dirname, "./node_modules/assert"),
          path.resolve(__dirname, "./node_modules/buffer"),
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
    ],
  },
  resolve: {
    alias: {
      util: false,
      fs: false,
      stream: false,
      module: false,
      path: false,
      constants: false,
    },
    fallback: {
      assert: require.resolve("assert/"),
    },
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ".json5",
      ".node",
      ".wasm",
    ],
  },
};

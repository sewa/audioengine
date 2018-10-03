var webpack = require("webpack");
var path = require("path");

// We'll be using the ExtractTextPlugin to extract any required CSS into a
// // single CSS file
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// // We'll use CopyWebpackPlugin to copy over static assets like images and
// fonts
const CopyWebpackPlugin = require("copy-webpack-plugin");

var env = process.env.MIX_ENV || "dev";
var isProduction = env === "prod";

// We'll set up some paths for our generated files and our development server
const staticDir = path.join(__dirname, ".");
const destDir = path.join(__dirname, "../priv/static");
const publicPath = "/";

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  devtool: 'inline-source-map',
  mode: 'development',
  entry: [staticDir + "/js/app.ts", staticDir + "/css/app.scss"],
  output: {
    path: destDir,
    filename: "js/app.js",
    publicPath
  },
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader:  'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js']
  },
  plugins: [
    new ExtractTextPlugin("css/app.css"),
    new webpack.ProvidePlugin({
      Nexus: 'nexusui'
    }),
    new CopyWebpackPlugin([ { from: staticDir + "/samples", to: destDir + "/samples" } ])
    //   // We copy our images and fonts to the output folder
    //   new CopyWebpackPlugin([{ from: "./assets/images", to: "images" }])
  ]
};

var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    app: './src/main.js',
    vendors: ['vue', 'vue-router']
  },
  output: {
    path: path.join(__dirname, '/build/static/'),
    filename: '[name].js',
    publicPath: '/static/'
  },
  module: {
    rules: [
      /*{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },*/
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
      },
      {
          test: /\.less$/,
          loader: "vue-style-loader!css-loader!less-loader"
      },
      {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader?limit=25000'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      }
    ]
  },
  node: {
    fs: "empty"
  },
  plugins: [
    new HtmlWebpackPlugin({
        filename: __dirname+'/build/index.html',
        template: './index.html'
    })
  ]
}


const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'

const optimization = () => {

    const conf = {
        splitChunks: {
            chunks: "all"
        }
    }

    if (!isDev){
        conf.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

   return  conf
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            alwaysWriteToDisk: true,
            template:  path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: !isDev, // минишицируем html
            }
        }), new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery/dist/jquery.min.js",
            jQuery: "jquery/dist/jquery.min.js",
            "window.jQuery": "jquery/dist/jquery.min.js",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        })
    ]
    if (!isDev) base.push(new BundleAnalyzerPlugin())

    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'), //корневая дериктория с источниками
    mode: 'development', // 'production': 'none' | 'development' | 'production'
    //   entry: './src/index.js', путь до главного файла
    entry: {
        app: './index.js',
        analytics: './analytics.js'
    }, // для несколький имен
    output: {
        // filename: "app.js",
        filename: "[name].[contenthash].js",   //передаем имя и уникальный хещ
        path: path.resolve(__dirname, 'dist/') // получаем путь к текущей папке
    }, // куда осуществлять сборку
    resolve: {
        extensions: ['.js', '.json'], // расширения по умолчанию
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets')
        }
    },
    devtool: isDev ? 'source-map' : '', // исходные карты в режиме разаработки
    optimization: optimization(),
    plugins: plugins(), // добавление плагинов
    module: {
        rules: [
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'] style-loader запись стилей в тег style
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'css-loader', 'less-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            // место для плагинов bable
                        ]
                    }
                },
            }
        ]
    },
    devServer: {
        port: 4200,
        hot: isDev  // изменение стилей без перезагрузки страницы
    }
}
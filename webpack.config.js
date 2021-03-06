const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const optimization = () => {
    const conf = {
        splitChunks: {
            // chunks: "all"
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
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery/dist/jquery.min.js",
            jQuery: "jquery/dist/jquery.min.js",
            "window.jQuery": "jquery/dist/jquery.min.js",
        }),
        new MiniCssExtractPlugin({
            filename: "./css/[name].css"
        })
    ]
    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development', // 'production': 'none' | 'development' | 'production'
    entry: {
        app: './index.js',
        analytics: './analytics.js'
    }, // для несколький имен
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, 'public/assets/')
    }, // куда осуществлять сборку
    resolve: {
        extensions: ['.js', '.json'], // расширения по умолчанию
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets')
        }
    },
    optimization: optimization(),
    plugins: plugins(), // добавление плагинов
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../',
                    }
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
                loader: {
                    loader: 'file-loader',
                    options: {
                        name: "./img/[name].[ext]"
                    }
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: {
                    loader: 'file-loader',
                    options: {
                        name: "./fonts/[name].[ext]"
                    }
                }
            }
        ]
    },
}
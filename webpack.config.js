const webpack = require('webpack');
const path = require('path');
const isDev = process.env.NODE.ENV === 'development';
const HTMLPlugin = require('webpack-html-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');

const config = {
    target: 'web',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: '[name].[hash:7].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin({
            title: 'use plugin',
            filename: 'index.html'
        })
    ]
}

if (isDev) {
    config.module.rules({
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'sass-loader'
        ]
    })
    config.devtool = '#cheap-modul-eval-source-map'
    config.devServer = {
        port: '8080',
        host: 'localhost',
        overlay: {
            errors: true
        },
        // historyFallback
        hot: true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new bpack.NoEmitOnErrorsPlugin()
    );
} else {
    config.entry={
        app:path.join(__dirname, 'src/index.js'),
        vendor:['vue']
    }
    config.output.filename='[name].[chunkhash:8].js'
    config.module.rules.push({
        test: /\.scss$/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'sass-loader'
            ]
        })
    })
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'runtime'
        })
    )
}

module.exports = config;
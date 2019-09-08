'use strict';
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

//设置多页面打包
const setMPA = () =>{
    const entry = {}
    const HtmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
    // console.log( 'entryfiles---',entryFiles)   
    Object.keys(entryFiles)
        .map( index => {
            const entryFile = entryFiles[index]
            const match  = entryFile.match(/src\/(.*)\/index.js/);
            const pageName = match && match[1];
            entry[pageName] = entryFile
           //console.log( '----',pageName)
           HtmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                 inject: true,
                 minify: {
                    html5: true, 
                    collapseWhitespace: true, 
                    preserveLineBreaks: false, 
                    minifyCSS: true,
                    minifyJS: true, 
                    removeComments: false
              } 
            })

           )
            
        })

    return {
        entry,
        HtmlWebpackPlugins
    }
}
 const {entry, HtmlWebpackPlugins } = setMPA()


module.exports = {
    // entry: {
    //     index: './src/index.js',
    //     search:'./src/search.js'
    // }, 
    entry:entry,    
    output: {
        path: path.join(__dirname, 'dist'),//必须为绝对路径
        filename: '[name].js'
    },
    mode: 'production' ,
    module:{
        rules:[
            {
                test:/.js$/,
                use:'babel-loader'
            },
            {
                test:/.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/.less$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/.(png|jpg|gif|jpeg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10240 
                        }
                    }
                    
                ]
            },
            {
                test:/.(woff|woff2|eot|ttf|otf)$/,
                use:'file-loader',               
                
            }
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin()
    ].concat(HtmlWebpackPlugins),
    devServer:{
        contentBase:'./dist',
        hot:true
    },
    devtool:'source-map'

}
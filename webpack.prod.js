'use strict';
const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin= require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')//每次构建自动清空dist目录
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')



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
                chunks: ['vendors',pageName,],
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
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'none' ,
    module:{
        rules:[
            {
                test:/.js$/,
                use:'babel-loader'
            },
            {
                test:/.css$/,
                use:[
                    // 'style-loader',//把样式插入header（与minicssextractplugin功能冲突）
                    MiniCssExtractPlugin.loader,//把样式单独提取出一个文件
                    'css-loader'
                ]
            },
            {
                test:/.less$/,
                use:[
                    // 'style-loader',//把样式插入header
                    MiniCssExtractPlugin.loader,//把样式单独提取出一个文件
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',// 自动补齐前缀
                        options: {
                            plugins: () => [
                                require('autoprefixer') ({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75 ,// 1rem = 75px
                            remPrecesion: 8 //转成rem保留的小数位数
                        }
                    }
                ]
            },
            {
                test:/.(png|jpg|gif|jpeg)$/,
                use:[
                    {
                        loader:'file-loader',
                        options:{
                            name:'[name]_[hash:8].[ext]'
                        }
                    }
                    
                ]
            },
            {
                test:/.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    {
                        loader:'file-loader',
                        options:{
                            name:'[name]_[hash:8]'
                        }
                    }                
                ]              
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp:/\.css$/g,
            cssProcessor:require('cssnano')
        }),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, 'src/index.html'),
        //     filename: 'index.html',
        //     chunks: ['index'],
        //      inject: true,
        //      minify: {
        //         html5: true, 
        //         collapseWhitespace: true, 
        //         preserveLineBreaks: false, 
        //         minifyCSS: true,
        //         minifyJS: true, 
        //         removeComments: false
        //   } 
        // }),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, 'src/search.html'),
        //     filename: 'search.html',
        //     chunks: ['search'],
        //      inject: true,
        //      minify: {
        //         html5: true, 
        //         collapseWhitespace: true, 
        //         preserveLineBreaks: false, 
        //         minifyCSS: true,
        //         minifyJS: true, 
        //         removeComments: false
        //   } 
        // }),
        new CleanWebpackPlugin(),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //       {
        //         module: 'react',
        //         entry: 'https://unpkg.com/react@16/umd/react.production.min.js',
        //         global: 'React',
        //       },
        //       {
        //         module: 'react-dom',
        //         entry: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
        //         global: 'ReactDOM',
        //       },
        //     ],
        //   })

    ].concat(HtmlWebpackPlugins),
    devtool:'source-map',
    optimization: {
        splitChunks: { 
            minSize: 0, 
            cacheGroups: {
            commons: {
                name: 'commons', 
                chunks: 'all', 
                minChunks: 3
            } 
            }
            
        }                   
    } 
}
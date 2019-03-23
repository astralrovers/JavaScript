const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development', // 模式 默认两种production 和 development
    devServer: { // 开发服务器配置
        port: 3000, // 端口
        progress: true,
        contentBase:'./dist', // 默认执行目录
        open: true // 自动打开浏览器
    },
    entry: './src/index.js', // 入口
    output: { // 出口
        //filename: 'bundle.[hash:8].js', // 生成的文件名 [hash]表示加hash值(只要8位)，配合后面的plugin使用
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist') // 路径，必须是一个局对路径
    },
    plugins:[ // 数组，放着所有插件，每个都是一个插件实例
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板文件
            filename: 'index.html', // 输出文件名，会放在前面配置的出口路径下
            minify: { // 压缩html文件
                removeAttributeQuotes: true, // 删除html里面属性的双引号
                collapseWhitespace: true, // 合并成一行
                hash: true // 增加hash戳
            }
        }),
        new MiniCssExtractPlugin({
            filename:'main.css' // 输出的css文件名
        }),
    ],
    module: { // 模块
        rules: [ // 模块解析规则
            // loader的特点是功能单一，所以一般需要好几个，可以是数组，可以是对象，对象可以有更多参数
            // loader是有顺序的，默认从右向左执行(所以需要注意)
            // css-loader是用来处理@import这种语法的
            // style-loader是用来把css插入到head标签里面的，但是我们看打包好的`index.html`里面并没有引入css，因为css被放到
            // bundle.js里面了，不过浏览器样式里面是有的。
            { 
                test: /\.css$/,
                use: [
                    /*
                    {
                        loader: 'style-loader',
                        options: {
                            inserttAt: 'top' // 因为我们在html里面有可能定义style，这里的话是把模块里的样式放到html的样式前面，这样一来
                        }
                    },
                    */
                   MiniCssExtractPlugin.loader, // 这里的话就不要插入到style标签离了，而是使用MiniCssExtractPlugin的loader规则，也就是使用link
                    'css-loader']
            },
            {
                test: /\.less$/, // less sass 等等都一样
                use: [
                    /*
                    {
                        loader: 'style-loader',
                        options: {
                            inserttAt: 'top' // 因为我们在html里面有可能定义style，这里的话是把模块里的样式放到html的样式前面，这样一来
                        }
                    },
                    */
                    MiniCssExtractPlugin.loader, // 这里的话就不要插入到style标签离了，而是使用MiniCssExtractPlugin的loader规则，也就是使用link                   
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    }
};
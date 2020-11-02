var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 *将公共模块提取，生成名为`commons`的chunk
 */
var CommonsChunkPlugin = webpack.optimize.splitChunks;

//压缩
var UglifyJsPlugin = webpack.optimize.minimize;


var getEntry = function(globPath, pathDir,preName="") {
	var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;
	console.log(pathDir);
    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);   //文件目录
        extname = path.extname(entry);   //后缀名
        basename = path.basename(entry, extname);  //文件名
		pathname = path.join(dirname, basename);
		console.log(pathname)
		pathname = pathDir ? pathname.replace(new RegExp('^'+pathDir.replace(/\//ig,"\\\\")), '') : pathname;
		console.log(pathname)
        entries[preName+pathname] = ['./' + entry]; //这是在osx系统下这样写  win7  entries[basename]
    }
    console.log(entries);
    return entries;
}


//入口(通过getEntry方法得到所有的页面入口文件)
var entries = getEntry('src/manage/**/*.js', 'src/manage/',"bundle-");
entries["bundle"] = ["./src/main.js"];
entries["bundle-datashow"] = ["./src/charts/datashow.js"];
entries["vendor"] = ["jquery","bootstrap"];
entries["vendor-echart"] = ['echarts', "./src/macarons.js"];
entries["vendor-bmap"] = ['./src/bmap.min.js'];

module.exports = {
    mode:"production",
    entry: entries,
    output: {
        path: path.join(__dirname, './dist/'),//输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '/dist/',               //模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].js',           //每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js?[chunkhash]' ,  //chunk生成的配置
        //libraryTarget: 'umd', // 这里一定要写成umd，不然打出来的包system.js无法读取
        //library: ["jquery","echarts"], //模块的名称
    },
    externals: {
        //jquery: 'jQuery',
        //map: 'echarts-map',
        BMap:'BMap'
    },
    resolve:{
        alias:{
            'echarts-bmap':path.resolve(__dirname,'src/bmap.min.js')
        }
    },
  
    // module: {
    //     rules: [
    //       {
    //         test: require.resolve('jquery'),
    //         use: 'expose-loader?$'
    //       },
    //     ]
    // },

    plugins: [

        new webpack.ProvidePlugin({
           $: "jquery",
           echarts:"echarts",
           //echartsBmap:"echarts-bmap"
        }),
        new CopyWebpackPlugin({
            patterns:[
                {
                    context: 'node_modules/layui-src/dist/lay/modules/',
                    from: '**.js',
                    to:path.join(__dirname, 'dist/jlib/lay/lay/modules') 
                },
                {
                    context: 'node_modules/layui-src/dist/',
                    from: 'layui.js',
                    to:path.join(__dirname, 'dist/jlib/lay') 
                },
                {
                    context: 'node_modules/layui-src/dist/css/',
                    from: 'layui.css',
                    to:path.join(__dirname, 'dist/jlib/lay') 
                },
                {
                    context: 'node_modules/layui-src/dist/font/',
                    from: '**/*',
                    to:path.join(__dirname, 'dist/jlib/font') 
                },
                {
                    context: 'src/lib/layui/',
                    from: '*.js',
                    to:path.join(__dirname, 'dist/js/layui') 
                },
                {
                    from: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    to: 'css/vendor.css'
                },
                {
                    context: 'src/lib/layui/',
                    from:'*.css',
                    to: 'css/layui'
                },
                {
                    context: 'src/jlib/layui/',
                    from:'**/*',
                    to: path.join(__dirname, 'dist/jlib/layui') 
                },
                
  
                {
                    context: 'src/lib/layui/',
                    from:'*.css',
                    to: 'css/layui'
                },
            
                {
                    context: 'src/images/',
                    from: '**/*',
                    to: 'images'
                },
            
                {
                    from: path.join(__dirname, './src/css/style.css'),
                    to: path.join(__dirname, './dist/css')
                },

                {
                    context: 'src/charts/',
                    from: '*.html',
                    to: 'charts'
                },

                {
                    context: 'src/manage/',
                    from: '*.html',
                    to: 'manage'
                },

                {
                    context:path.join(__dirname, './src/'),
                    from: '*.html',
                    to:  path.join(__dirname, './dist/')
                },
        ]})
    ]
};

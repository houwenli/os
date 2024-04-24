const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
    return path.join(__dirname, dir);
}

const name = 'OA管理系统'; // 标题

/**
 * 静态CDN文件
 */
const assetsCDN = {
    externals: {
        // 左侧key为项目中引入的名称，右侧value为包对外提供的名称
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        'element-ui': 'ELEMENT'
    },
    css: [
        '//cdn.jsdelivr.net/npm/element-ui@2.15.0/lib/theme-chalk/index.css'
    ],
    js: [
        '//cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js',
        '//cdn.jsdelivr.net/npm/vue-router@3.4.9/dist/vue-router.min.js',
        '//cdn.jsdelivr.net/npm/vuex@3.6.0/dist/vuex.min.js',
        '//cdn.jsdelivr.net/npm/echarts@5.3.0/dist/echarts.min.js',
        '//cdn.jsdelivr.net/npm/element-ui@2.15.0/lib/index.js'
    ]
}

// eslint-disable-next-line no-unused-vars
function injectCDN(config) {
    // 非生产环境，不启用CDN
    if(process.env.NODE_ENV !== 'production') return

    let e = Object.assign({
        AMap: 'AMap',
        AMapUI: 'AMapUI',
    }, assetsCDN.externals)

    config.set('externals', e)

    config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
    })
}


// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
    outputDir: 'dist',
    // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: 'static',
    // 是否开启eslint保存检测，有效值：ture | false | 'error'
    lintOnSave: process.env.NODE_ENV === 'development',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    // 支持vue文件内部组件模板编译注册
    runtimeCompiler: true,
    // webpack-dev-server 相关配置
    devServer: {
        host: '0.0.0.0',
        port: 1024,
        proxy: {
            '/api': {
                //要访问的跨域的域名
                target: `https://os-${process.env.VUE_APP_ENV}.wsecar.com`,
                ws: true, // 是否启用websockets
                //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
                changOrigin: true,
                pathRewrite: {
                }
            }
        }
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src'),
            },
        },
    },
    chainWebpack(config) {
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');

        // set svg-sprite-loader
        config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end();

        // injectCDN(config)

        config.when(process.env.NODE_ENV !== 'development', config => {
            // 配置使用CDN
            config.set('externals', {
                AMap: 'AMap',
                AMapUI: 'AMapUI'
            });

            // npm run analyzer 打包模块大小视图
            if (process.env.NODE_ENV === 'analyzer') {
                let BundleAnalyzerPluginInstance =  new BundleAnalyzerPlugin({
                    analyzerMode: 'server',
                    analyzerHost: '127.0.0.1',
                    analyzerPort: 8889,
                    reportFilename: 'report.html',
                    defaultSizes: 'parsed',
                    openAnalyzer: true,
                    generateStatsFile: false,
                    statsFilename: 'stats.json',
                    statsOptions: null,
                    logLevel: 'info'
                })
                config.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPluginInstance)
            }

            config.plugin('CompressionWebpackPlugin').use(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                })
            );

            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [
                    {
                        // `runtime` must same as runtimeChunk name. default is `runtime`
                        inline: /runtime\..*\.js$/,
                    },
                ])
                .end();
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial', // only package third parties that are initially dependent
                    },
                    elementUI: {
                        name: 'chunk-elementUI', // split elementUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            });

            config.optimization.minimizer('terser').tap(args => {
                // 去掉注释 如果需要看chunk-vendors公共部分插件，可以注释掉就可以看到注释了
                args[0].terserOptions.output = {
                    comments: false,
                };
                return args;
            });

            config.optimization.runtimeChunk('single'),
                {
                    from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
                    to: './', //到根目录下
                };
        });

        if (process.env.NODE_ENV === 'development') {
            config.devtool('cheap-eval-source-map')
        }
    },
};

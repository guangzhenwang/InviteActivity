const path = require('path')
const webpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const uglifyjsWebpackPlugin = require('uglify-webpack-plugin')
const resolvePath = url => path.join(__dirname, url)
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
    style: {
        postcss: {
            mode: "extends",
            loaderOptions: {
                postcssOptions: {
                    ident: 'postcss',
                    plugins: [
                        require('postcss-pxtorem')({
                            rootValue: 75, // 换算的基数
                            // selectorBlackList: ['van-'], // 忽略转换正则匹配项
                            propList: ['*'],
                            unitPrecision: 4,
                            minPixelValue: 2
                        })
                    ]
                }

            }

        }
    },

    // 扩展babel
    babel: {
        plugins: [
            // antd 的按需加载
            [
                'import',
                {
                    libraryName: 'antd',
                    libraryDirectory: 'lib',
                    style: true,
                },
            ],
        ]
    },
    webpack: {
        // 配置路径别名
        alias: {
            '@': resolvePath('src')
        },
        // 对webpack配置重写，必须将最终webpack配置导出
        configure(webpackConfig, { env, paths }) {
            if (isProd) {
                // 生产环境下、不生成sourcemap
                webpackConfig.devtool = false
                // 安装bundle分析插件
                webpackConfig.plugins.push( new webpackBundleAnalyzer())
            }
            webpackConfig.optimization= {
                splitChunks: {
                    chunks: 'async',
                    minSize:  40000,
                    maxAsyncRequests: 5, // 最大异步请求数
                    maxInitialRequests: 4, // 页面初始化最大异步请求数
                    automaticNameDelimiter: '~', // 解决命名冲突
                    // name: true值将会自动根据切割之前的代码块和缓存组键值(key)自动分配命名,否则就需要传入一个String或者function.
                    name: false,
                    cacheGroups: {
                        base: {
                            // 基本框架
                            chunks: 'all',
                            test: /(react|react-dom|react-dom-router)/,
                            name: 'base',
                            priority: 100,
                        }
                    }
                }
  
            }
            return webpackConfig
        },
        // 通过CDN方式引入
        externals: {
            'vue': 'Vue',
            'axios': 'axios'
        }
    },
    // 配置跨域
    devServer: {
        host: '127.0.0.1',
        proxy: {
            '/api': {
                target: 'https://m.sd.10086.cn',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }

}
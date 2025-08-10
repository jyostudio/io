// 引入一个包
import path from "path";
// 引入clean插件
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// webpack中的所有配置信息，都应该写在这里
export default {
    // 指定入口文件
    entry: "./src/index.ts",
    // 设置打包模式
    mode: "production",
    // 指定打包文件所在目录
    output: {
        // 指定打包文件的目录
        path: path.resolve(__dirname, "dist"),
        // 打包后文件的文件名
        filename: "index.js",
        // 告诉webpack不适用箭头
        environment: {
            arrowFunction: false
        },
        libraryTarget: "module"
    },
    experiments: {
        outputModule: true // 启用ES Modules输出
    },
    //指定webpack打包时要是用的模块
    module: {
        // 指定要加载的规则
        "rules": [
            {
                // test指定的是规则生效的文件
                test: /\.ts$/,
                //要使用的loader
                use: [
                    // 配置babel
                    {
                        // 指定加載器
                        loader: "babel-loader",
                        // 设置babel
                        options: {
                            plugins: [
                                ["@babel/plugin-transform-runtime", { corejs: 3 }],
                                ["@babel/plugin-proposal-decorators", { version: "2023-11" }]
                            ],
                            // 设置预定义的环境
                            presets: [
                                [
                                    // 指定环境的插件
                                    "@babel/preset-env",
                                    // 配置信息
                                    {
                                        // 要兼容的目标浏览器
                                        targets: {
                                            "ios": "8",
                                            "android": "4.4"
                                        },
                                        // 指定corejs版本
                                        "corejs": "3",
                                        // 使用corejs的方式
                                        "useBuiltIns": "usage"
                                    }
                                ]
                            ]
                        }
                    },
                    "ts-loader"
                ],
                // 要排除的文件
                exclude: /node_modules/
            }
        ]
    },
    // 配置webpack插件
    plugins: [
        new CleanWebpackPlugin()
    ],
    // 用来设置那些后缀名可以设置引用模块
    resolve: {
        extensions: [".ts", ".js"]
    }
}
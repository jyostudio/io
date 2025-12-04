import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: "./test/index.ts",
    mode: "development", // 测试使用开发模式，方便调试
    output: {
        path: path.resolve(__dirname, "test"),
        filename: "test.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                ["@babel/plugin-transform-runtime", { corejs: 3 }],
                                ["@babel/plugin-proposal-decorators", { version: "2023-11" }]
                            ],
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: {
                                            "chrome": "80" // 测试环境通常较新
                                        },
                                        "corejs": "3",
                                        "useBuiltIns": "usage"
                                    }
                                ]
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    allowTsInNodeModules: true,
                    configFile: "tsconfig.test.json"
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devtool: 'inline-source-map' // 方便调试
}

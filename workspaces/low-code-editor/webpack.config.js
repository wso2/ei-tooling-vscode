const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
    mode: 'none',
    entry: {
        SLCEditor: path.join(__dirname, 'src', 'index.tsx')
    },
    target: 'web',
    devtool: argv.mode === "production" ? undefined : "source-map",
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".mjs"]
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.ts(x?)$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {

                    }
                }
            },
        ],
    },
    ignoreWarnings: [/Failed to parse source map/],
    output: {
        filename: 'SLCEditor.js',
        path: path.resolve(__dirname, 'build', 'umd'),
        library: {
            name: "SLCEditor",
            type: "umd"
        }
    },
    devServer: {
        allowedHosts: 'all',
        port: 9000,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        devMiddleware: {
            mimeTypes: { 'text/css': ['css'] },
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(argv.mode)
        })
    ]
});


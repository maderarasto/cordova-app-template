const path = require('path')
const {EnvironmentPlugin} = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'www/js'),
        filename: '[name].bundle.js',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@public': path.resolve(__dirname, 'www'),
        }
    },
    plugins: [
        // Defined environment variables
        new EnvironmentPlugin({

        }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            }
        ]
    },
    devtool: 'inline-source-map'
}
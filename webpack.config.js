const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const project = `${__dirname}/spa`;

module.exports = {
    entry: { 
        index: [ `${project}/src/js/index.js`]
    },
    output: {
        path: project,
        filename: 'dist/js/[name].min.js',
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          },
          { 
            test: /\.css$/,
            use: [ 
                isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader'
            ],
          }
        ]
    },
    plugins: isProduction ? [
        new webpack.DefinePlugin({
            'process.env.SCALE_MEDIUM': 'true',
            'process.env.SCALE_LARGE': 'false',
            'process.env.THEME_LIGHT': 'true',
            'process.env.THEME_LIGHTEST': 'false',
            'process.env.THEME_DARK': 'true',
            'process.env.THEME_DARKEST': 'false'
        }),
        new MiniCssExtractPlugin({
            path: project,
            filename: 'dist/css/index.css'
        })
    ] : [],
};
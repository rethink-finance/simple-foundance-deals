module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/simple-foundance-deals/'
    : '/',
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /react\/*.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                            plugins: ['transform-react-jsx']
                        }
                    }
                },
                {
                    test: /chart.js/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                            plugins: ['transform-react-jsx']
                        }
                    }
                },
            ]
        }
    },
}

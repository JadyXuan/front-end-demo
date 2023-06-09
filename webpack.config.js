var svgoConfig = JSON.stringify({
    plugins: [
      { removeTitle: true },
      { convertColors: { shorthex: true } },
      { convertPathData: true },
      { cleanupAttrs: true },
      { removeComments: true },
      { removeDesc: true },
      { removeUselessDefs: true },
      { removeEmptyAttrs: true },
      { removeHiddenElems: true },
      { removeEmptyText: true }
    ]
  })
  
  module: {
    rules: [
      {
        test: /.*\.svg$/,
        loaders: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]'
            }
          },
          'svgo-loader?' + svgoConfig
        ],
        include: [
          // 处理不了 iview 的字体，所以只处理本地svg
          resolve('/src/assets/icons')
        ]
      },
  
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          publicPath: '../../',
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]?[hash:7]')
        },
        exclude: [resolve('/src/assets/icons')] // 已经交由 svg-sprite-loader 处理，就排除指定文件夹
      }
    ]
  }
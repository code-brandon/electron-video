const { defineConfig } = require('@vue/cli-service')
const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  chainWebpack: config => {

    // const svgRule = config.module.rule('svg');
    // 清空默认svg规则
    // svgRule.uses.clear();
    //针对svg文件添加svg-sprite-loader规则
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    
    config.resolve.alias
    //set第一个参数：设置的别名，第二个参数：设置的路径
    .set('@', resolve('./src'))
    .set('~components', resolve('./src/components'))
    .set('~assets', resolve('./src/assets'))
    .set('~views', resolve('./src/views'))
    .set('@Api', resolve('./src/api'))
}
})

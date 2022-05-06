// import svgIcon from '@/components/svgIcon'// svg component

// // register globally
// const  app = createApp(App)
// app.component('svg-icon', svgIcon)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

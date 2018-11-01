// 导入axios
import axios from 'axios'
const HttpTool = {}
HttpTool.install = (Vue) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
  Vue.prototype.$http = axios
}
export default HttpTool

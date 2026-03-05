import { App } from "vue";
import TextEllipsisCenter from "../src/components/text-ellipsis-center.vue";

function install(appOrVue: App): any {
  (appOrVue as App).component("TextEllipsisCenter", TextEllipsisCenter);
  return appOrVue;
}

// 支持 Vue.use() 安装插件
export default install;

// 可选：也允许用户按需导入
export { TextEllipsisCenter };

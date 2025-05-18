import { isVue2, isVue3, Vue2, App } from "vue-demi";
import TextEllipsisCenter from "./components/text-ellipsis-center.vue";

function install(appOrVue: App | typeof Vue2): void {
  if (isVue2) {
    // Vue 2 全局注册
    appOrVue.component("TextEllipsisCenter", TextEllipsisCenter);
  } else if (isVue3) {
    // Vue 3 全局注册
    (appOrVue as App).component("TextEllipsisCenter", TextEllipsisCenter);
  }
}

// 支持 Vue.use() 安装插件
export default {
  install,
};

// 可选：也允许用户按需导入
export { TextEllipsisCenter };

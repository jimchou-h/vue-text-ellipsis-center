import type { App } from "./runtime/vue-bridge";
import TextEllipsisCenter from "./components/text-ellipsis-center";

type AppLike = App & {
  component?: (name: string, component: unknown) => unknown;
};

function install(appOrVue: AppLike): AppLike {
  appOrVue.component?.("TextEllipsisCenter", TextEllipsisCenter);
  appOrVue.component?.("text-ellipsis-center", TextEllipsisCenter);
  return appOrVue;
}

// 支持 Vue.use() 安装插件
export default install;

// 导出组件
export { TextEllipsisCenter };

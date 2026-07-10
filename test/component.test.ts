import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, ref } from "vue";
import TextEllipsisCenter from "../src/components/text-ellipsis-center";

Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
  configurable: true,
  get() {
    const measureType = this.getAttribute("data-measure");
    const contentLength = this.textContent?.length ?? 0;

    if (measureType === "single-row") return 20;
    if (measureType === "full") return contentLength > 8 ? 40 : 20;
    if (measureType === "mid") return contentLength > 8 ? 40 : 20;

    return 20;
  },
});

async function waitForMeasure(): Promise<void> {
  for (let index = 0; index < 12; index += 1) {
    await nextTick();
    await Promise.resolve();
  }
}

describe("TextEllipsisCenter", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("组件正常挂载并渲染文本", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "Hello",
        rows: 1,
      },
    });

    await waitForMeasure();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-container="text-ellipsis"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Hello");
  });

  it('direction = "end" 模式通过公开渲染结果展示前缀、省略符和插槽', async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "1234567890",
        direction: "end",
      },
      slots: {
        expandNode: '<span data-test="slot">[more]</span>',
      },
    });

    await waitForMeasure();

    const html = wrapper.html();
    expect(html).toContain("...");
    expect(wrapper.find('[data-test="slot"]').exists()).toBe(true);
    expect(html.indexOf("...")).toBeLessThan(html.indexOf("[more]"));
  });

  it('direction = "middle" 时插槽位于前后文本之间', async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "abcdefghij",
        direction: "middle",
      },
      slots: {
        expandNode: '<b data-test="mid">##</b>',
      },
    });

    await waitForMeasure();

    const html = wrapper.html();
    expect(html).toContain("...");
    expect(html.indexOf("...")).toBeLessThan(html.indexOf("##"));
    expect(wrapper.find('[data-test="mid"]').exists()).toBe(true);
  });

  it('direction = "start" 模式通过公开渲染结果展示插槽、省略符和后缀', async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "abcdefghij",
        direction: "start",
      },
      slots: {
        expandNode: '<span data-test="start">[+]</span>',
      },
    });

    await waitForMeasure();

    const html = wrapper.html();
    expect(html).toContain("[+]");
    expect(html).toContain("...");
    expect(html.indexOf("[+]")).toBeLessThan(html.indexOf("..."));
  });

  it("expanded = true 显示完整文本", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "longlongtext",
        expanded: true,
      },
    });

    await waitForMeasure();

    expect(wrapper.text()).toContain("longlongtext");
  });

  it("支持 collapseNode 插槽", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "这是一段需要触发省略的测试文本",
        expanded: true,
      },
      slots: {
        collapseNode: '<button data-test="collapse">收起</button>',
      },
    });

    await waitForMeasure();

    expect(wrapper.find('[data-test="collapse"]').exists()).toBe(true);
  });

  it("不同行数配置正常工作", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "多行文本测试",
        rows: 3,
      },
    });

    await waitForMeasure();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("多行文本测试");
  });

  it("useObserver = true 时组件正常挂载", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "延迟加载文本",
        useObserver: true,
      },
    });

    await waitForMeasure();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-container="text-ellipsis"]').exists()).toBe(true);
  });

  it("正确处理 Unicode 字符", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "👋🌍你好世界🚀",
        rows: 1,
      },
    });

    await waitForMeasure();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("👋");
    expect(wrapper.text()).toContain("🚀");
  });

  it("长文本应进入省略态并输出省略号", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "abcdefghijklmnop",
        direction: "middle",
        rows: 1,
      },
    });

    await waitForMeasure();

    expect(wrapper.text()).toContain("...");
    expect(wrapper.find('[data-measure]').exists()).toBe(false);
  });

  it("未提供 expandNode 时不应渲染展开控件", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "abcdefghijklmnop",
        direction: "middle",
        rows: 1,
      },
    });

    await waitForMeasure();

    expect(wrapper.text()).toContain("...");
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("v-show 隐藏时应延后测量，显示后完成省略", async () => {
    const visible = ref(false);
    const Host = defineComponent({
      components: { TextEllipsisCenter },
      setup() {
        return { visible };
      },
      template: `
        <div v-show="visible" style="width: 200px">
          <TextEllipsisCenter
            text="abcdefghijklmnop"
            direction="middle"
          />
        </div>
      `,
    });

    const wrapper = mount(Host);
    const inner = wrapper.findComponent(TextEllipsisCenter);

    await nextTick();
    expect(inner.text()).not.toContain("...");

    visible.value = true;
    await nextTick();
    window.dispatchEvent(new Event("resize"));
    await waitForMeasure();

    expect(inner.text()).toContain("...");
    expect(inner.find('[data-measure]').exists()).toBe(false);
  });
});

import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TextEllipsisCenter from "../src/components/text-ellipsis-center.vue";

// 伪造 offsetHeight，用于控制“是否超出一行”
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
  configurable: true,
  value: 20, // 默认每行 20px
});

describe("TextEllipsisCenter.vue", () => {
  it("正常挂载并渲染文本", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "Hello Vue Ellipsis",
        rows: 1,
      },
    });
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    // 初始应进入 PREPARE 状态
    expect((wrapper.vm as any).state.status).toBe(1); // MEASURE_STATUS.PREPARE
  });

  it("当文本未超出行高时应为 STABLE_NO_ELLIPSIS", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: { text: "short", rows: 2 },
    });
    const vm = wrapper.vm as any;
    vm.fullMeasureRef = { value: { offsetHeight: 10 } };
    vm.singleRowMeasureRef = { value: { offsetHeight: 20 } };
    await (wrapper.vm as any).measureHeights();
    expect((wrapper.vm as any).state.status).toBe(100); // STABLE_NO_ELLIPSIS
  });

  it('direction = "end" 正确渲染省略符和插槽', async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "1234567890",
        direction: "end",
      },
      slots: {
        expandNode: '<span data-test="slot">[more]</span>',
      },
    });

    // 强行进入最终省略状态
    (wrapper.vm as any).state.status = 99; // STABLE_ELLIPSIS
    (wrapper.vm as any).state.contentChars = [..."1234567890"];
    await nextTick();

    expect(wrapper.html()).toContain("123"); // 前缀
    expect(wrapper.html()).toContain("..."); // 省略符
    expect(wrapper.find('[data-test="slot"]').exists()).toBe(true);
  });

  it('direction = "middle" 时插槽在中间', async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "abcdefghij",
        direction: "middle",
      },
      slots: {
        expandNode: '<b data-test="mid">##</b>',
      },
    });
    (wrapper.vm as any).state.status = 99; // STABLE_ELLIPSIS
    (wrapper.vm as any).state.contentChars = [..."abcdefghij"];
    await nextTick();
    const html = wrapper.html();
    expect(html.indexOf("abc")).toBeLessThan(html.indexOf("##"));
    expect(html.indexOf("##")).toBeLessThan(html.indexOf("hij"));
  });

  it("expanded = true 显示完整文本", async () => {
    const wrapper = mount(TextEllipsisCenter, {
      props: {
        text: "longlongtext",
        expanded: true,
      },
    });
    (wrapper.vm as any).state.status = 99;
    await nextTick();
    expect(wrapper.text()).toContain("longlongtext");
  });
});

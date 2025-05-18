import { shallowMount } from '@vue/test-utils';
import TextEllipsisCenter from '../src/components/text-ellipsis-center.vue';
import { describe, it } from 'vitest';

// describe 用于分组测试用例
// it 用于定义单个测试用例
describe('TextEllipsisCenter.vue', () => {
    const longText = '这是一段很长很长很长很长的文本，需要被省略显示';
  
    it('应在 expanded 为 true 时显示完整文本', async () => {
      // 浅渲染 Vue 组件，即只渲染当前组件，不渲染子组件
      // propsData 用于传递组件的 props
      const wrapper = shallowMount(TextEllipsisCenter, {
        propsData: {
          text: longText,
          rows: 1,
          expanded: true,
        },
      });
  
      // 模拟状态为不需要省略
      await wrapper.setData({ status: 100 }); // STABLE_NO_ELLIPSIS
  
      // 断言组件的文本内容应包含完整的长文本
      expect(wrapper.text()).toContain(longText);
    });
  
    it('应在 expanded 为 false 且需要省略时显示省略内容', async () => {
      const wrapper = shallowMount(TextEllipsisCenter, {
        propsData: {
          text: longText,
          rows: 1,
          expanded: false,
        },
      });
  
      // 模拟状态为需要省略
      await wrapper.setData({
        status: 99, // STABLE_ELLIPSIS
        walkingIndexes: [0, longText.length],
        contentChars: longText.split(''),
      });
  
      // 调用组件的 renderContent 方法，获取渲染结果
      const renderResult = wrapper.vm.renderContent(wrapper.vm.midIndex);
  
      // 渲染结果应包含省略号
      expect(renderResult).toContain('...');
      expect(wrapper.text()).toContain('...');
    });
  });
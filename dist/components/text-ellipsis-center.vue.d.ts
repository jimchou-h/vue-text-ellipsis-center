interface Props {
    /** 需要显示的文本内容 */
    text: string;
    /** 显示的行数 */
    rows?: number;
    /** 省略号位置：start(开头)、middle(中间)、end(结尾) */
    direction?: "start" | "middle" | "end";
    /** 是否展开显示完整内容 */
    expanded?: boolean;
    /** 是否使用 IntersectionObserver 进行懒加载 */
    useObserver?: boolean;
    /** 是否监听容器尺寸变化并自动重新计算 */
    autoResize?: boolean;
}
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        expandNode?(_: {}): any;
        expandNode?(_: {}): any;
        expandNode?(_: {}): any;
        expandNode?(_: {}): any;
        expandNode?(_: {}): any;
        expandNode?(_: {}): any;
        expandNode?(_: {}): any;
        expandNode?(_: {}): any;
        collapseNode?(_: {}): any;
    };
    refs: {
        containerRef: HTMLDivElement;
        fullMeasureRef: HTMLDivElement;
        singleRowMeasureRef: HTMLDivElement;
        midMeasureRef: HTMLDivElement;
        displayRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    "update:expanded": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:expanded"?: ((value: boolean) => any) | undefined;
}>, {
    rows: number;
    direction: "start" | "middle" | "end";
    expanded: boolean;
    useObserver: boolean;
    autoResize: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    containerRef: HTMLDivElement;
    fullMeasureRef: HTMLDivElement;
    singleRowMeasureRef: HTMLDivElement;
    midMeasureRef: HTMLDivElement;
    displayRef: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

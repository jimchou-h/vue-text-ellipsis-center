import { App } from 'vue';

declare const TextEllipsisCenter: import('vue').DefineComponent<
  {
    text: {
      type: import('vue').PropType<string>;
      required: true;
    };
    rows?: {
      type: import('vue').PropType<number>;
      default: number;
    };
    direction?: {
      type: import('vue').PropType<'start' | 'middle' | 'end'>;
      default: string;
    };
    expanded?: {
      type: import('vue').PropType<boolean>;
      default: boolean;
    };
    useObserver?: {
      type: import('vue').PropType<boolean>;
      default: boolean;
    };
    autoResize?: {
      type: import('vue').PropType<boolean>;
      default: boolean;
    };
  },
  {
    $props: import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & Readonly<import('vue').ExtractPropTypes<{
      text: {
        type: import('vue').PropType<string>;
        required: true;
      };
      rows?: {
        type: import('vue').PropType<number>;
        default: number;
      };
      direction?: {
        type: import('vue').PropType<'start' | 'middle' | 'end'>;
        default: string;
      };
      expanded?: {
        type: import('vue').PropType<boolean>;
        default: boolean;
      };
      useObserver?: {
        type: import('vue').PropType<boolean>;
        default: boolean;
      };
      autoResize?: {
        type: import('vue').PropType<boolean>;
        default: boolean;
      };
    }>>;
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {
    'update:expanded': (value: boolean) => void;
  }
>;

declare function install(app: App): void;

declare const _default: {
  install: typeof install;
};

export default _default;
export { TextEllipsisCenter };

export type DomProps = Record<string, unknown>;

export function toVue2VnodeData(props: DomProps): DomProps {
  const { style, class: className, ref, key, ...rest } = props;
  const normalized: DomProps = {};

  if (style !== undefined) normalized.style = style;
  if (className !== undefined) normalized.class = className;
  if (ref !== undefined) normalized.ref = ref;
  if (key !== undefined) normalized.key = key;

  if (Object.keys(rest).length > 0) {
    normalized.attrs = rest;
  }

  return normalized;
}

export function createVue2RefCallback<T extends Element>(elementRef: {
  value: T | null;
}): (element: T | null) => void {
  return (element) => {
    elementRef.value = element;
  };
}

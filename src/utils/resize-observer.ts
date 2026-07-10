import { onBeforeUnmount, onMounted, watch } from "../runtime/vue-bridge";

interface ElementRef<T extends Element> {
  value: T | null;
}

type StopHandle = () => void;

function createResizeListener(
  element: Element,
  callback: ResizeObserverCallback,
): StopHandle {
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(callback);
    observer.observe(element);
    return () => observer.disconnect();
  }

  const handleResize = () => {
    callback([], undefined as unknown as ResizeObserver);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}

export function useElementResizeObserver<T extends Element>(
  target: ElementRef<T>,
  callback: ResizeObserverCallback,
): StopHandle {
  let stopListening: StopHandle = () => {};

  const observe = (element: T | null) => {
    stopListening();
    if (element) {
      stopListening = createResizeListener(element, callback);
    }
  };

  onMounted(() => {
    observe(target.value);
  });

  const stopWatching = watch(() => target.value, observe);

  const stop = () => {
    stopWatching();
    stopListening();
    stopListening = () => {};
  };

  onBeforeUnmount(stop);

  return stop;
}

type Fn = (...args: any[]) => any;

export function debounce<T>(fn: Fn, delay: number) {
  let timer: number | null = null;
  return function (this: T, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

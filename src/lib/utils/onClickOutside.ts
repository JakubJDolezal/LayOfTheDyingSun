export function onClickOutside(node: HTMLElement, handler: () => void) {
  const listener = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) handler();
  };
  document.addEventListener('mousedown', listener);
  return {
    destroy() {
      document.removeEventListener('mousedown', listener);
    }
  };
}
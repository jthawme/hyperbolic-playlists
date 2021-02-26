export const tickUpdate = (cb) => {
  let ticking = false;

  const update = (e) => {
    cb(e);
    ticking = false;
  };

  const requestTick = (e) => {
    if (!ticking) {
      requestAnimationFrame(() => update(e));
      ticking = true;
    }
  };

  return requestTick;
};

export const onWindowResize = (cb) => {
  window.addEventListener("resize", cb, {
    passive: true,
  });

  window.addEventListener("orientationchange", cb, {
    passive: true,
  });

  return () => {
    window.removeEventListener("resize", cb);
    window.removeEventListener("orientationchange", cb);
  };
};

export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

export const mapRange = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const KEYS = {
  ESCAPE: 27,
};

export const registerExits = (onEscape) => {
  const cb = (e) => {
    if ([KEYS.ESCAPE].includes(e.keyCode)) {
      onEscape();
    }
  };

  document.addEventListener("keyup", cb);
  return () => document.removeEventListener("keyup", cb);
};

export const clickOutside = (
  el: HTMLElement,
  onClickOutside: () => void,
  validator?: (el: HTMLElement, e: MouseEvent) => boolean
) => {
  const cb = (e) => {
    if (validator) {
      if (validator(el, e)) {
        onClickOutside();
      }
    } else if (e.target !== el && !el.contains(e.target)) {
      onClickOutside();
    }
  };

  document.addEventListener("click", cb);
  const unregisterExits = registerExits(onClickOutside);

  return () => {
    unregisterExits();
    document.removeEventListener("click", cb);
  };
};

export const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};

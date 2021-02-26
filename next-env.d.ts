/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg" {
  const ReactComponent: SvgrComponent;

  export { ReactComponent };
}

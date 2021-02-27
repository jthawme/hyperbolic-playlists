export const fireEvent = (label: string, props?: Object) => {
  (window as any).plausible(label, { props });
};

export const timeOut = (ms: number = 100) =>
  new Promise((res) => setTimeout(() => res, ms));

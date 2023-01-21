export const range = (start: any, end: any) => {
  const ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }
  return ans;
};

export const currentYearNum = new Date().getFullYear().toString().substr(-2);

export const isValueTrue = (value: string | undefined | null) => {
  return value && (value.toLowerCase() === "true" || value === "1");
};

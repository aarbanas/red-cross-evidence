export const prepareOrderBy = (
  sort?: string,
  dir?: string,
): Record<string, string> | null => {
  if (!sort || !(dir === "asc" || dir === "desc")) return null;

  if (!sort.includes(".")) return { [sort]: dir };

  const keys = sort.split(".");
  return keys.reduceRight((acc, current, currentIndex) => {
    if (currentIndex + 1 < keys.length) return { [current]: acc };
    return { [current]: dir };
  }, {});
};

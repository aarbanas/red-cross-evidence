type Where<T> = <K extends keyof T>(
  key: K,
  operator: "==" | "!=",
  value: T[K], // Value type inferred based on selected key
) => Builder<T>;

interface Builder<T> {
  build(): string;
  where: Where<T>;
}

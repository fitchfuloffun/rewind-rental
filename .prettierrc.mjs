export default {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^react", "<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  endOfLine: "auto",
};

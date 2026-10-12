export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["fe", "be", "common", "contract", "root", "deps", "ci", "docs", "release"],
    ],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [0],
  },
};

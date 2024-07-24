module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: { "^.+\\.ts?$": ["ts-jest", "tsconfig.json"] },
  testRegex: ".*\\.(test|spec)?\\.(ts|tsx)$",
};

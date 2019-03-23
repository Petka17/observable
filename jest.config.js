module.exports = {
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  collectCoverageFrom: ["**/src/**/*.{js,jsx,ts,tsx}"]
};

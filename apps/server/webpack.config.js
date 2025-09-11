console.log("[Webpack] bundling...");

const fs = require("fs");
const path = require("path");

const {
  swcDefaultsFactory,
} = require("@nestjs/cli/lib/compiler/defaults/swc-defaults");

const nestDefault = swcDefaultsFactory().swcOptions;

const swcrcPath = path.resolve(__dirname, ".swcrc");
const userSwcConfig = fs.existsSync(swcrcPath)
  ? JSON.parse(fs.readFileSync(swcrcPath, "utf-8"))
  : {};

const swcOptions = {
  ...nestDefault,
  ...userSwcConfig,
};

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: swcOptions,
        },
      },
    ],
  },
};

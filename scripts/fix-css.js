const fs = require("fs");
const path = require("path");

const cssFile = path.resolve("node_modules/@bosch/frontend.kit-npm/dist/frontend-kit.complete.css");

if (!fs.existsSync(cssFile)) {
  console.error("❌ CSS file not found:", cssFile);
  process.exit(1);
}

let css = fs.readFileSync(cssFile, "utf-8");

// Replace invalid `::before.className` or `:before.className` with just `::before`
css = css.replace(/::?before\.[\w-]+/g, "::before");
css = css.replace(/::?after\.[\w-]+/g, "::after");

fs.writeFileSync(cssFile, css);
console.log("✅ Fixed ::before.className syntax in frontend-kit CSS");

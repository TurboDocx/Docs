const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const oramaIndexPath = ".docusaurus/orama-search-index-current.json.gz";
const outputPath = path.join(__dirname, "../static/orama-index.json");

(async () => {
    try {
        const compressed = fs.readFileSync(oramaIndexPath);
        const decompressed = zlib.gunzipSync(compressed).toString("utf-8");
        fs.writeFileSync(outputPath, decompressed);
        console.log(`✅ Orama index exported to ${outputPath}`);
    } catch (error) {
        console.error("❌ Failed to export Orama index:", error);
    }
})();

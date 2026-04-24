import fetch from "node-fetch";

async function testDownload() {
    const res = await fetch('http://localhost:3000/api/proxy-drive?id=1c7BcTSsoD0R7_weDxqxCWJ1BP0XuPrRp');
    console.log("Status:", res.status);
    
    if (res.body) {
        let size = 0;
        let start = Date.now();
        res.body.on('data', (chunk) => {
            size += chunk.length;
            if (size > 10000000 && size < 11000000) {
               console.log("Downloaded", size, "in", Date.now() - start, "ms");
            }
        });
        res.body.on('end', () => {
            console.log("Finished:", size);
        });
        res.body.on('error', (err) => {
            console.log("Stream err:", err);
        });
    }
}
testDownload();

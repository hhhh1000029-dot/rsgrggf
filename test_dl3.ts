import https from "https";

const driveId = "1c7BcTSsoD0R7_weDxqxCWJ1BP0XuPrRp"; // Large file
const url = `https://drive.google.com/uc?export=download&id=${driveId}`;

fetch(url).then(async res => {
  const text = await res.text();
  const cookies = res.headers.get("set-cookie") || "";
  console.log("Cookies:", cookies);
  
  if (text.includes('action=')) {
    const actionMatch = text.match(/action="([^"]+)"/);
    const params = [...text.matchAll(/name="([^"]+)" value="([^"]*)"/g)];
    
    if (actionMatch && params.length) {
      let finalUrl = actionMatch[1] + "?" + params.map(p => `${p[1]}=${p[2]}`).join("&");
      console.log("Final URL:", finalUrl);
      
      const fileRes = await fetch(finalUrl, {
        headers: {
            "Origin": "https://ais-dev-2d37hp3ych63kqj3ndwvlc-606266627247.asia-east1.run.app"
        }
      });
      console.log("File status with Origin:", fileRes.status);
    }
  }
});

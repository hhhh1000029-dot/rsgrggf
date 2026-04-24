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
      
      const fileRes = await fetch(finalUrl); // NO COOKIES
      console.log("File status WITHOUT cookies:", fileRes.status);
    }
  }
});

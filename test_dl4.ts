import https from "https";

const driveId = "1c7BcTSsoD0R7_weDxqxCWJ1BP0XuPrRp"; // Large file
const url = `https://drive.google.com/uc?export=download&id=${driveId}`;

fetch(url).then(async res => {
  const text = await res.text();
  const cookies = res.headers.get("set-cookie") || "";
  
  if (text.includes('action=')) {
    const actionMatch = text.match(/action="([^"]+)"/);
    const params = [...text.matchAll(/name="([^"]+)" value="([^"]*)"/g)];
    
    if (actionMatch && params.length) {
      let finalUrl = actionMatch[1] + "?" + params.map(p => `${p[1]}=${p[2]}`).join("&");
      
      const fileRes = await fetch(finalUrl); // NO COOKIES
      console.log("File status WITHOUT cookies:", fileRes.status);
      console.log("Headers:", fileRes.headers);
      
      const bodyText = await fileRes.text();
      console.log("Body length:", bodyText.length);
      console.log("Body start:", bodyText.substring(0, 200));
    }
  }
});

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
          'Cookie': cookies
        }
      });
      console.log("File status:", fileRes.status);
      console.log("File headers:", fileRes.headers);
      
      const reader = fileRes.body!.getReader();
      let size = 0;
      let count = 0;
      while (count < 10) { // read 10 chunks to verify it's working
      	const { done, value } = await reader.read();
      	if (done) break;
      	size += value.length;
      	count++;
      }
      console.log(`Read ${size} bytes from ${count} chunks`);
    }

  } else {
    console.log("No action form found");
  }
});

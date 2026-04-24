import https from "https";

const driveId = "1c7BcTSsoD0R7_weDxqxCWJ1BP0XuPrRp";
const url = `https://drive.google.com/uc?export=download&id=${driveId}`;

fetch(url).then(async res => {
  const text = await res.text();
  if (text.includes('action=')) {
    const actionMatch = text.match(/action="([^"]+)"/);
    console.log("ACTION:", actionMatch ? actionMatch[1] : "not found");
    const params = [...text.matchAll(/name="([^"]+)" value="([^"]*)"/g)];
    console.log("PARAMS:", params.map(p => [p[1], p[2]]));
  }
});

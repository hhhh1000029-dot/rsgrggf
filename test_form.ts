import https from "https";

const driveId = "1c7BcTSsoD0R7_weDxqxCWJ1BP0XuPrRp";
const url = `https://drive.google.com/uc?export=download&id=${driveId}`;

fetch(url).then(async res => {
  const text = await res.text();
  console.log("Form:", text.match(/<form[^>]+>/)?.[0]);
});

fetch('http://localhost:3000/api/proxy-drive?id=1c7BcTSsoD0R7_weDxqxCWJ1BP0XuPrRp').then(async res => {
  console.log("Status:", res.status);
  console.log("Headers:", res.headers);
  if (!res.ok) {
    console.log("Body:", await res.text());
  } else {
    console.log("OK, Content-Length:", res.headers.get("content-length"));
  }
}).catch(console.error);

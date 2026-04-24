import fetch from "node-fetch";

async function run() {
    const res = await fetch("http://localhost:3000/api/proxy-drive?id=1c7BcTSsoD0R7_weDxqxCWJ1BP0XuPrRp");
    console.log(res.status);
    console.log(await res.text());
}
run();

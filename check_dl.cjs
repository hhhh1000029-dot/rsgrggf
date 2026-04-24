const fs = require('fs');

async function testDownload() {
    try {
        const res = await fetch('https://drive.google.com/uc?export=download&id=1uNuayd-wgzqyqeWfFsTEsIVY6pWttbf2');
        let text = await res.text();
        const actionMatch = text.match(/action="([^"]+)"/);
        const uuidMatch = text.match(/name="uuid" value="([^"]+)"/);
        if (actionMatch && uuidMatch) {
            const finalUrl = `${actionMatch[1]}?id=1uNuayd-wgzqyqeWfFsTEsIVY6pWttbf2&export=download&confirm=t&uuid=${uuidMatch[1]}`;
            const res2 = await fetch(finalUrl);
            const text2 = await res2.text();
            
            const parsed = JSON.parse(text2);
            console.log("Keys:", Object.keys(parsed));
            if (parsed.week) console.log("Week name:", parsed.week.name);
            if (parsed.stages) console.log("Stages count:", parsed.stages.length);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
testDownload();

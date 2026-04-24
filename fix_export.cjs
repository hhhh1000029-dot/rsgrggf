const fs = require('fs');
let code = fs.readFileSync('src/editor/EditorMain.tsx', 'utf8');

const exportOptimization = `        // --- Clean up VN Assets Deduplication ---
        let optimizedWeekObj = JSON.parse(JSON.stringify(week));
        
        if (optimizedWeekObj.vnData && optimizedWeekObj.vnData.assets) {
           const uniqueAssets = new Map();
           const oldIdToNewIdMap = new Map();
           optimizedWeekObj.vnData.assets.forEach(asset => {
              const matchingAsset = Array.from(uniqueAssets.values()).find(a => a.url === asset.url);
              if (matchingAsset) {
                 oldIdToNewIdMap.set(asset.id, matchingAsset.id);
              } else {
                 uniqueAssets.set(asset.id, asset);
              }
           });
           
           if (oldIdToNewIdMap.size > 0) {
             const deepReplaceId = (obj) => {
                if (!obj) return obj;
                if (typeof obj === 'string' && oldIdToNewIdMap.has(obj)) {
                   return oldIdToNewIdMap.get(obj);
                }
                if (Array.isArray(obj)) {
                   return obj.map(deepReplaceId);
                }
                if (typeof obj === 'object') {
                   const newObj = {...obj};
                   for (const key in newObj) {
                      newObj[key] = deepReplaceId(newObj[key]);
                   }
                   return newObj;
                }
                return obj;
             };
             
             optimizedWeekObj.vnData = deepReplaceId(optimizedWeekObj.vnData);
             optimizedWeekObj.vnData.assets = Array.from(uniqueAssets.values());
           }
        }
        
        // --- Deduplication Logic ---`;

code = code.replace('// --- Deduplication Logic ---', exportOptimization);
code = code.replace('countStrings(week);', 'countStrings(optimizedWeekObj);');
code = code.replace('const optimizedWeek = replaceStrings(week);', 'const optimizedWeek = replaceStrings(optimizedWeekObj);');

fs.writeFileSync('src/editor/EditorMain.tsx', code);

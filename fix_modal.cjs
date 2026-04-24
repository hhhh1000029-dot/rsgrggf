const fs = require('fs');
let code = fs.readFileSync('src/editor/VNEditor.tsx', 'utf8');

const buttonStr = `                        <button 
                          onClick={() => { setAssignAssetModal(asset.id); setAssignAssetSelections({}); }}
                          className="p-3 bg-blue-500 text-white rounded-full hover:scale-110 transition-transform"
                          title="Assign to Expressions"
                        >
                          <UserPlus strokeWidth={3} className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}`;

code = code.replace(/<button \s*onClick=\{\(\) => handleDeleteAsset\(asset\.id\)\}/, buttonStr);

const modalStr = `        {/* Asset Picker Modal */}
        <AnimatePresence>
          {assignAssetModal && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-12">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setAssignAssetModal(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl max-h-[85vh] bg-white cartoon-panel border border-4 border-black rounded-[40px] overflow-hidden flex flex-col shadow-[8px_8px_0_rgba(0,0,0,1)]"
              >
                <div className="p-8 border-b border-4 border-black flex items-center justify-between bg-white cartoon-border/50">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Assign Asset</h2>
                    <p className="text-zinc-800 text-[10px] font-black uppercase tracking-widest">Select expressions to apply this image</p>
                  </div>
                  <button onClick={() => setAssignAssetModal(null)} className="p-3 hover:bg-pink-400 cartoon-border-sm rounded-2xl transition-all">
                    <X strokeWidth={3} className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                  {week.vnData?.characters.map(char => (
                    <div key={char.id} className="space-y-4">
                      <h3 className="font-black text-xl uppercase tracking-tighter">{char.name}</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {char.expressions.map(exp => (
                          <label key={exp.id} className={\`flex items-center gap-3 p-4 border-4 border-black rounded-2xl cursor-pointer transition-all \${assignAssetSelections[exp.id] ? 'bg-candy-pink' : 'bg-white hover:bg-zinc-100'}\`}>
                            <input 
                              type="checkbox" 
                              checked={!!assignAssetSelections[exp.id]}
                              onChange={(e) => setAssignAssetSelections(prev => ({...prev, [exp.id]: e.target.checked}))}
                              className="hidden"
                            />
                            <div className={\`w-6 h-6 rounded border-2 border-black flex items-center justify-center \${assignAssetSelections[exp.id] ? 'bg-black text-white' : 'bg-white'}\`}>
                              {assignAssetSelections[exp.id] && <Check strokeWidth={4} className="w-4 h-4" />}
                            </div>
                            <span className="font-bold text-sm truncate">{exp.name}</span>
                          </label>
                        ))}
                        {char.expressions.length === 0 && <span className="text-sm font-bold text-zinc-400 uppercase">No expressions</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-4 border-black bg-white flex justify-end">
                  <button
                    onClick={() => {
                      updateVN(vn => {
                        vn.characters.forEach(char => {
                          char.expressions.forEach(exp => {
                            if (assignAssetSelections[exp.id]) {
                              exp.assetId = assignAssetModal;
                            }
                          });
                        });
                        return vn;
                      });
                      setAssignAssetModal(null);
                    }}
                    className="px-8 py-3 bg-candy-pink hover:bg-candy-pink/80 text-black border-4 border-black rounded-2xl font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    Apply Asset
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
`;

code = code.replace('{/* Asset Picker Modal */}', modalStr);

fs.writeFileSync('src/editor/VNEditor.tsx', code);

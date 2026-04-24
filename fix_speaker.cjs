const fs = require('fs');
let code = fs.readFileSync('src/editor/VNEditor.tsx', 'utf8');

code = code.replace(
  /<input\s+type="text"\s+value=\{diag\.speaker\}\s+onChange=\{\(e\) => handleUpdateDialogue\(selectedScene\.id, diag\.id, \{ speaker: e\.target\.value \}\)\}\s+className="bg-white border-4 border-black rounded-lg px-3 py-1\.5 text-\[10px\] font-black tracking-widest uppercase outline-none focus:ring-0 transition-all w-32 shadow-\[2px_2px_0_rgba\(0,0,0,1\)\]"\s+placeholder="SPEAKER"\s+\/>/g,
  `<DebouncedInput \n` +
  `                                          value={diag.speaker}\n` +
  `                                          onChange={(val: string) => handleUpdateDialogue(selectedScene.id, diag.id, { speaker: val })}\n` +
  `                                          className="bg-white border-4 border-black rounded-lg px-3 py-1.5 text-[10px] font-black tracking-widest uppercase outline-none focus:ring-0 transition-all w-32 shadow-[2px_2px_0_rgba(0,0,0,1)]"\n` +
  `                                          placeholder="SPEAKER"\n` +
  `                                        />`
);

fs.writeFileSync('src/editor/VNEditor.tsx', code);

const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/src=\{recentlyEditedStage\.characterOpponent\.healthIcons\?\.normal \|\| recentlyEditedStage\.characterOpponent\.image\}/g, 'src={recentlyEditedStage.characterOpponent.healthIcons?.normal || recentlyEditedStage.characterOpponent.image || undefined}');
  content = content.replace(/src=\{stage\.characterOpponent\.healthIcons\?\.normal \|\| stage\.characterOpponent\.image\}/g, 'src={stage.characterOpponent.healthIcons?.normal || stage.characterOpponent.image || undefined}');
  content = content.replace(/src=\{selectedStage\.stage\.layers\.find\(l => l\.id === 'bg'\)\?\.image\}/g, 'src={selectedStage.stage.layers.find(l => l.id === \'bg\')?.image || undefined}');
  content = content.replace(/src=\{selectedStage\.characterOpponent\.animations\.find\(a => a\.name === 'idle'\)\?\.image \|\| selectedStage\.characterOpponent\.image\}/g, 'src={selectedStage.characterOpponent.animations.find(a => a.name === \'idle\')?.image || selectedStage.characterOpponent.image || undefined}');
  content = content.replace(/src=\{selectedStage\.characterPlayer\.animations\.find\(a => a\.name === 'idle'\)\?\.image \|\| selectedStage\.characterPlayer\.image\}/g, 'src={selectedStage.characterPlayer.animations.find(a => a.name === \'idle\')?.image || selectedStage.characterPlayer.image || undefined}');
  content = content.replace(/src=\{customThumbnail \|\| showUploadModal\.thumbnail\}/g, 'src={customThumbnail || showUploadModal.thumbnail || undefined}');
  content = content.replace(/src=\{week\.vnData\?\.assets\.find\(a => a\.id === scene\.backgroundId\)\?\.url\}/g, 'src={week.vnData?.assets.find(a => a.id === scene.backgroundId)?.url || undefined}');
  content = content.replace(/src=\{currentImage\}/g, 'src={currentImage || undefined}');
  content = content.replace(/src=\{p\.url\}/g, 'src={p.url || undefined}');
  content = content.replace(/src=\{layer\.image\}/g, 'src={layer.image || undefined}');
  
  // VNEditor
  content = content.replace(/src=\{week\.vnData\?\.assets\.find\(a => a\.id === selectedScene\.backgroundId\)\?\.url\}/g, 'src={week.vnData?.assets.find(a => a.id === selectedScene.backgroundId)?.url || undefined}');
  content = content.replace(/src=\{asset\.url\}/g, 'src={asset.url || undefined}');
  content = content.replace(/src=\{bg\.url\}/g, 'src={bg.url || undefined}');
  content = content.replace(/src=\{week\.vnData\?\.assets\.find\(a => a\.id === char\.stickerAssetId\)\?\.url\}/g, 'src={week.vnData?.assets.find(a => a.id === char.stickerAssetId)?.url || undefined}');
  content = content.replace(/src=\{week\.vnData\?\.assets\.find\(a => a\.id === selectedCharacter\.stickerAssetId\)\?\.url\}/g, 'src={week.vnData?.assets.find(a => a.id === selectedCharacter.stickerAssetId)?.url || undefined}');
  
  // App.tsx
  content = content.replace(/src=\{getDynamicBg\(\)\}/g, 'src={getDynamicBg() || undefined}');
  content = content.replace(/src=\{outfit\.image\}/g, 'src={outfit.image || undefined}');
  content = content.replace(/src=\{tempPoses\[pose\.toLowerCase\(\)\]\}/g, 'src={tempPoses[pose.toLowerCase()] || undefined}');
  
  // ArchiveMenu.tsx
  content = content.replace(/src=\{char\.data\.animations\.find\(a => a\.name === 'idle'\)\?\.image \|\| char\.data\.image\}/g, 'src={char.data.animations.find(a => a.name === \'idle\')?.image || char.data.image || undefined}');
  content = content.replace(/src=\{char\.data\.healthIcons\.normal\}/g, 'src={char.data.healthIcons.normal || undefined}');
  content = content.replace(/src=\{data\.healthIcons\[type\]\}/g, 'src={data.healthIcons[type] || undefined}');
  content = content.replace(/src=\{data\.animations\.find\(a => a\.name === activePose\)\!\.image\}/g, 'src={data.animations.find(a => a.name === activePose)?.image || undefined}');
  content = content.replace(/src=\{anim\.image\}/g, 'src={anim.image || undefined}');
  
  // ArchiveModals.tsx
  content = content.replace(/src=\{char\.data\.image\}/g, 'src={char.data.image || undefined}');

  fs.writeFileSync(file, content);
}

['src/editor/EditorMain.tsx', 'src/editor/VNEditor.tsx', 'src/App.tsx', 'src/components/ArchiveMenu.tsx', 'src/editor/ArchiveModals.tsx'].forEach(fixFile);

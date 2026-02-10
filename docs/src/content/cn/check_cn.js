const fs = require('fs');
const path = require('path');

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllFiles('.');
const hasCn = [];
const noCn = [];

const cnRegex = /[\u4e00-\u9fff]/;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relativePath = file.replace(/^\.[\\/]/, '').replace(/\\/g, '/');
  if (cnRegex.test(content)) {
    hasCn.push(relativePath);
  } else {
    noCn.push(relativePath);
  }
}

console.log('=== 已翻译（包含中文）- ' + hasCn.length + ' 个文件 ===\n');
hasCn.forEach(f => console.log('✓ ' + f));

console.log('\n=== 未翻译（无中文）- ' + noCn.length + ' 个文件 ===\n');
noCn.forEach(f => console.log('✗ ' + f));

import { cpSync,mkdirSync,existsSync,rmSync,writeFileSync,readFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
const root=process.cwd(),dist=join(root,'dist');
if(existsSync(dist)) rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});
cpSync(join(root,'public'),dist,{recursive:true,filter:(source)=> !source.includes('/public/vendor') && !/\/public\/icon-(192|512)\.png$/.test(source)});
cpSync(join(root,'src'),join(dist,'src'),{recursive:true});
cpSync(join(root,'index.html'),join(dist,'index.html'));
const find = paths => paths.map(p=>join(root,p)).find(p=>existsSync(p));
const zipSource=find(['node_modules/jszip/dist/jszip.min.js','public/vendor/jszip.min.js']);
const mathSource=find(['node_modules/mathjax/unpacked','node_modules/mathjax','public/vendor/MathJax']);
if(!zipSource||!mathSource||!existsSync(join(mathSource,'MathJax.js'))) throw Error('Build requires jszip@3.10.1 and mathjax@2.7.9. Run npm install.');
mkdirSync(join(dist,'vendor','MathJax'),{recursive:true});
cpSync(zipSource,join(dist,'vendor','jszip.min.js'));
cpSync(mathSource,join(dist,'vendor','MathJax'),{recursive:true});
// Bundle PDF.js locally. PDFs are decrypted and rendered exclusively in the browser.
const pdfRoot=join(root,'node_modules','pdfjs-dist');
if(!existsSync(join(pdfRoot,'build','pdf.mjs'))||!existsSync(join(pdfRoot,'build','pdf.worker.mjs')))throw Error('Build requires pdfjs-dist@5.4.296. Run npm install.');
const pdfOut=join(dist,'vendor','pdfjs');mkdirSync(pdfOut,{recursive:true});
for(const name of ['pdf.mjs','pdf.worker.mjs'])cpSync(join(pdfRoot,'build',name),join(pdfOut,name));
for(const name of ['cmaps','standard_fonts','wasm'])if(existsSync(join(pdfRoot,name)))cpSync(join(pdfRoot,name),join(pdfOut,name),{recursive:true});
writeFileSync(join(dist,'_redirects'),'/*    /index.html   200\n');
// Generate compliant PNG icons without checking binary assets or font files into Git.
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return(crc^0xffffffff)>>>0}
function chunk(type,data){const name=Buffer.from(type),len=Buffer.alloc(4),sum=Buffer.alloc(4);len.writeUInt32BE(data.length);sum.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([len,name,data,sum])}
function icon(size){const rows=[];const glyph=['11111','10000','10000','11110','10000','10000','11111'];const margin=Math.floor(size*.20), cw=(size-2*margin)/5,ch=(size-2*margin)/7;
 for(let y=0;y<size;y++){const r=Buffer.alloc(size*4+1);for(let x=0;x<size;x++){let rgb=[24,36,49];const gx=Math.floor((x-margin)/cw),gy=Math.floor((y-margin)/ch);if(x>=margin&&x<size-margin&&y>=margin&&y<size-margin&&glyph[gy]?.[gx]==='1')rgb=[245,249,252];let i=1+x*4;r[i]=rgb[0];r[i+1]=rgb[1];r[i+2]=rgb[2];r[i+3]=255}rows.push(r)}
 const head=Buffer.alloc(13);head.writeUInt32BE(size,0);head.writeUInt32BE(size,4);head[8]=8;head[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',head),chunk('IDAT',deflateSync(Buffer.concat(rows))),chunk('IEND',Buffer.alloc(0))]);}
for(const size of [192,512])writeFileSync(join(dist,`icon-${size}.png`),icon(size));
console.log('ExamOS static production build complete — dist/');
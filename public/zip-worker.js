/* ZIP decoding happens in this dedicated worker, never on the UI thread. */
importScripts('/vendor/jszip.min.js');
let wake=null;
self.addEventListener('message',async e=>{
 if(e.data?.cmd==='next'){if(wake){wake();wake=null}return}
 if(e.data?.cmd!=='start')return;
 try{
  const file=e.data.file,maxPdf=125*1024*1024;
  if(file.size>200*1024*1024)throw Error('ZIP exceeds 200 MB limit');
  const zip=await JSZip.loadAsync(file,{checkCRC32:true});
  const entries=[];let total=0;
  for(const [path,item] of Object.entries(zip.files)){
   if(item.dir)continue;
   const safe=path.replaceAll('\\','/');
   if(safe.startsWith('/')||safe.split('/').includes('..')||/^[A-Za-z]:/.test(safe))throw Error('ZIP path traversal detected');
   if(!safe.toLowerCase().endsWith('.pdf'))continue;
   const uncompressed=item._data?.uncompressedSize??0;
   total+=uncompressed;
   entries.push({path,item});
   if(entries.length>250||total>450*1024*1024||uncompressed>maxPdf)throw Error('ZIP decompression safety limit exceeded');
  }
  for(let i=0;i<entries.length;i++){
   const {path,item}=entries[i],bytes=await item.async('arraybuffer');
   if(bytes.byteLength>maxPdf)throw Error('PDF exceeds 125 MB limit');
   self.postMessage({kind:'file',name:path,bytes,progress:i+1,total:entries.length,archive:file.name},[bytes]);
   await new Promise(resolve=>wake=resolve);
  }
  self.postMessage({kind:'done',total:entries.length});
 }catch(err){self.postMessage({kind:'error',error:err?.message||String(err)})}
});
/** Browser-only encrypted PDF vault. No passwords, keys or PDFs are transmitted to ExamOS servers. */
export const VAULT_ITERATIONS = 310000;
const TOKEN='ExamOS private PDF vault v1';
const enc = new TextEncoder();
function bytes(size, crypt){const arr=new Uint8Array(size);crypt.getRandomValues(arr);return arr}
function assertPassphrase(pass){if(typeof pass!=='string'||pass.length<12||pass.length>1024)throw Error('Use a passphrase of at least 12 characters.');}
async function derive(password,salt,iterations,crypt){
 const secret=await crypt.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
 return crypt.subtle.deriveKey({name:'PBKDF2',salt:new Uint8Array(salt),iterations,hash:'SHA-256'},secret,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function createVault(password,crypt=globalThis.crypto){
 assertPassphrase(password);
 if(!crypt?.subtle)throw Error('Secure browser encryption is unavailable. Use HTTPS and an updated browser.');
 const salt=bytes(16,crypt),iv=bytes(12,crypt);
 const key=await derive(password,salt,VAULT_ITERATIONS,crypt);
 const cipher=await crypt.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(TOKEN));
 return {key,config:{id:'pdf-vault',format:'ExamOSPDFVault',version:1,iterations:VAULT_ITERATIONS,salt:[...salt],checkIv:[...iv],check:[...new Uint8Array(cipher)]}};
}
export async function unlockVault(password,config,crypt=globalThis.crypto){
 if(!config||config.format!=='ExamOSPDFVault'||config.version!==1||config.iterations<200000||config.iterations>1000000||config.salt?.length!==16||config.checkIv?.length!==12||!Array.isArray(config.check))throw Error('Vault configuration is missing or invalid.');
 const key=await derive(password,config.salt,config.iterations,crypt);
 try{
  const clear=await crypt.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(config.checkIv)},key,new Uint8Array(config.check));
  if(new TextDecoder().decode(clear)!==TOKEN)throw Error();
 }catch{throw Error('Incorrect passphrase or damaged vault configuration.');}
 return key;
}
export async function sealPDF(blob,key,id,crypt=globalThis.crypto){
 if(!key||!blob||typeof id!=='string'||!id)throw Error('Unlock the private vault before importing PDF documents.');
 const iv=bytes(12,crypt);
 const ciphertext=await crypt.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(id)},key,await blob.arrayBuffer());
 return {blob:new Blob([ciphertext],{type:'application/octet-stream'}),encrypted:true,vaultIv:[...iv]};
}
export async function unsealPDF(doc,key,crypt=globalThis.crypto){
 if(!key)throw Error('Unlock your private PDF vault first.');
 if(!doc?.encrypted||doc.vaultIv?.length!==12||!(doc.blob instanceof Blob))throw Error('The PDF is not encrypted in the supported vault format.');
 try{
  const buf=await crypt.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(doc.vaultIv),additionalData:enc.encode(doc.id)},key,await doc.blob.arrayBuffer());
  return new Blob([buf],{type:'application/pdf'});
 }catch{throw Error('Could not unlock the document. The file may be damaged or belong to another vault.');}
}
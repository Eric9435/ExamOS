export const STORES=['subjects','chapters','documents','questions','attempts','exams','flashcards','reviews','formulas','notes','bookmarks','plans','sessions','oral','settings','books','mistakes','annotations','drafts'];
const dbName='examos-user-data';
let dbPromise;
export const uid=()=>crypto.randomUUID();
export const now=()=>new Date().toISOString();
export function openDB(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const request=indexedDB.open(dbName,4);request.onupgradeneeded=()=>{const db=request.result;for(const name of STORES)if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{keyPath:'id'});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});return dbPromise}
export async function all(store){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
export async function get(store,id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store).objectStore(store).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
export async function put(store,item){const db=await openDB();return new Promise((res,rej)=>{const t=db.transaction(store,'readwrite');t.objectStore(store).put(item);t.oncomplete=()=>res(item);t.onerror=()=>rej(t.error)})}
export async function del(store,id){const db=await openDB();return new Promise((res,rej)=>{const t=db.transaction(store,'readwrite');t.objectStore(store).delete(id);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
export async function bulk(store,items){const db=await openDB();return new Promise((res,rej)=>{const t=db.transaction(store,'readwrite');for(const x of items)t.objectStore(store).put(x);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
export const SEED_SUBJECTS=[
{id:'digital',name:'Digital Communications',code:'DC',instructor:'Prof. Gerhard Bauch',color:'#a3b7ea',credits:6,examMin:90,examType:'written',verified:false,source:'Uploaded 505-page WiSe 2026/27 lecture index; exam timing provisional'},
{id:'power',name:'Electrical Power Systems II',code:'EPS',instructor:'Prof. Christian Becker',color:'#f5cba7',credits:6,examMin:30,examType:'oral',verified:false,source:'Uploaded lecture slides (2025/26 identified); exam information historical'},
{id:'control',name:'Control Systems Theory and Design',code:'CST',instructor:'Prof. Timm Faulwasser',color:'#c8b6f0',credits:6,examMin:120,examType:'written',verified:false,source:'Uploaded Introduction slides; exam format provisional'},
{id:'microwave',name:'Microwave Engineering',code:'MW',instructor:'Prof. Kölpin',color:'#b2dfd2',credits:6,examMin:90,examType:'written',verified:false,source:'Uploaded Hochfrequenztechnik archive; 90-minute 2021–24 historic exams'},
{id:'micro',name:'Microsystem Engineering',code:'MSE',instructor:'Dr. Timo Lipka',color:'#f6d49b',credits:6,examMin:0,examType:'configurable',verified:false,source:'Uploaded introductory lecture'}];
const digital=[['Introduction and Course Information',1,9],['Baseband Transmission and Pulse Shaping',10,23],['AWGN Channels and Matched Filters',24,40],['Equivalent Baseband and Channel Models',41,93],['Carrier Modulation and Signal Constellations',94,126],['Signal Energy, Spectrum and Correlation',127,144],['Error Probabilities and Modulation Performance',145,181],['Hierarchical Modulation and Carrier Phase Offset',182,187],['Differential Phase and Amplitude Modulation',188,215],['Nonlinear Modulation: FSK, MSK, GMSK, CPM',216,271],['Frequency-Selective Channels and Receiver Models',272,297],['Linear Equalization',298,332],['Nonlinear Equalization and Precoding',333,357],['MAP/ML Sequence Estimation and Viterbi Equalization',358,390],['Multicarrier Transmission and OFDM',391,407],['Multiple Access and Spread-Spectrum Foundations',408,422],['RAKE Receivers and CDMA',423,445],['Spreading Sequences and Code Families',446,486],['Multiple-Access Interference and Multiuser Detection',487,505]];
// Subtopics reproduce terms documented in the user's 2026/27 505-page lecture title index.
// This is an optional study checklist, not an instructor-verified course requirement.
const digitalSubtopics=[
 ['Course references','Digital communication system'],
 ['NRZ pulse','Square-root raised-cosine pulse','Power spectral density','Intersymbol interference','Nyquist criterion'],
 ['White Gaussian noise','AWGN channel','Matched filtering','Receive filter design','Colored noise'],
 ['Quadrature modulation','Equivalent baseband signals','Rayleigh fading','Rician fading','Discrete-time channel models'],
 ['On-off keying','Amplitude shift keying','BPSK','QPSK','QAM','Offset QPSK'],
 ['Signal energy','Power spectral density','Bandwidth efficiency','Correlation coefficient'],
 ['Bit error probability','Symbol error probability','Maximum-likelihood detection','Gray mapping','M-PSK','M-ASK','M-QAM'],
 ['Hierarchical modulation','Carrier phase offsets'],
 ['Differential PSK','DBPSK','M-DPSK','DAPSK','Coherent and noncoherent detection'],
 ['Frequency shift keying','Modulation index','MSK','GMSK','Continuous-phase modulation','Spectral performance'],
 ['Intersymbol interference','Delay spread','Frequency selectivity','Fractionally spaced equalization'],
 ['Inverse filtering','Zero-forcing equalizer','MMSE equalizer','Pseudoinverse','Wirtinger calculus'],
 ['Decision-feedback equalizer','Tomlinson-Harashima precoding'],
 ['MAP and ML estimation','Trellis representation','Viterbi algorithm','Complexity'],
 ['OFDM and FFT','Guard interval','Spectral density','Peak-to-average power ratio'],
 ['TDMA','FDMA','Direct-sequence spread spectrum','Frequency hopping'],
 ['Multipath reception','RAKE receiver','CDMA channel models'],
 ['PN and m-sequences','Gold sequences','Walsh-Hadamard sequences','OVSF','UMTS scrambling'],
 ['Multiple-access interference','Near–far effect','Single-user detection','Multiuser detection','Successive interference cancellation']
];
const microwave=[['Welcome and administration',1,8,'IHF_TUHH_Microwave-Engineering_Lecture_V5-1_Welcome.pdf'],['Introduction',1,9,'IHF_TUHH_Microwave-Engineering_Lecture_V5-2_Introduction.pdf'],['Scattering Parameters',1,47,'IHF_TUHH_Microwave-Engineering_Lecture_V5-3_Scattering-Parameters.pdf'],['Noise',1,46,'IHF_TUHH_Microwave-Engineering_Lecture_V5-4_Noise.pdf'],['Directional Couplers, Hybrids and RF Components',1,50,'IHF_TUHH_Microwave-Engineering_Lecture_V5-5_Directional-Couplers.pdf'],['Waveguides',1,76,'IHF_TUHH_Microwave-Engineering_Lecture_V5-6_Waveguides.pdf'],['Antennas',1,80,'IHF_TUHH_Microwave-Engineering_Lecture_V5-7_Antennas.pdf'],['Resonators',1,37,'IHF_TUHH_Microwave-Engineering_Lecture_V5-8_Resonators.pdf'],['High-Frequency Filters',1,44,'IHF_TUHH_Microwave-Engineering_Lecture_V5-9_Filters.pdf']];
export async function seed(){if((await all('subjects')).length) return;await bulk('subjects',SEED_SUBJECTS);const c=[];digital.forEach(([title,from,to],i)=>c.push({id:`digital-${i+1}`,subjectId:'digital',title,from,to,documentName:'lecture-DigitalCommunicationsWS2026.pdf',subtopics:digitalSubtopics[i],objectives:'',formulas:'',tutorials:'',note:'',completed:[],lastReviewed:null,source:'Uploaded 2026/27 lecture topic index (study grouping; not official chapter boundaries)'}));microwave.forEach(([title,from,to,documentName],i)=>c.push({id:`microwave-${i+1}`,subjectId:'microwave',title,from,to,documentName,subtopics:[],objectives:'',formulas:'',tutorials:'',note:'',completed:[],lastReviewed:null,source:'Uploaded high-frequency archive index; verify academic year'}));[['power','Chapter 1 — Introduction',1,58,'EES_II_Ch_1_Introduction_121025.pdf'],['power','Chapter 2 — Components and Grid Models, Part 1',null,null,'EES_II_Ch_2_Components_and_Grid_Models_Part_1_131025.pdf'],['control','Introduction',null,null,'Introduction.pdf'],['micro','Introduction',null,null,'MSE_-_01_-_Introduction.pdf']].forEach(([subjectId,title,from,to,documentName])=>c.push({id:uid(),subjectId,title,from,to,documentName,subtopics:subjectId==='power'?(title.startsWith('Chapter 1')?['Organizational matters','Structure of electrical power systems','Electrical power supply as a process','Lecture context and structure']:['Fundamentals review','Sign conventions','Impedance and admittance','Complex power']):[],objectives:'',formulas:'',tutorials:'',note:'',completed:[],lastReviewed:null,source:'Previously uploaded lecture document'}));await bulk('chapters',c);
await bulk('books',[
{id:'ref-pozar-microwave',subjectId:'microwave',title:'Microwave Engineering',author:'David M. Pozar',edition:'4th edition',publisher:'Wiley',status:'Reference only',source:'Microwave Engineering welcome slide, p. 7 (background literature, not mandatory)',chapters:'',notes:''},
{id:'ref-steer-rf',subjectId:'microwave',title:'Microwave and RF Design Fundamentals',author:'Michael Steer',edition:'2019',publisher:'NC State University',status:'Reference only',source:'Microwave Engineering welcome slide, p. 7 (background literature, not mandatory)',chapters:'',notes:'Open-access volumes listed by lecturer.'},
{id:'ref-proakis-digital',subjectId:'digital',title:'Digital Communications',author:'John G. Proakis and Masoud Salehi',edition:'Unspecified in imported metadata',publisher:'',status:'Reference only',source:'Digital Communications lecture, recommended literature slides 4–7',chapters:'',notes:''},
{id:'ref-astrom-control',subjectId:'control',title:'Feedback Systems: An Introduction for Scientists and Engineers',author:'Karl J. Åström and Richard M. Murray',edition:'Unspecified in imported metadata',publisher:'',status:'Reference only',source:'Control Systems introduction, cited reading list',chapters:'',notes:''}
]);await put('settings',{id:'profile',semester:'Winter 2026/27',degree:'M.Sc. Electrical Engineering and Information Technology',university:'Hamburg University of Technology',specialization:'Control and Power Systems Engineering',dailyTarget:90,theme:'light',lastBackup:null});}
export async function exportFull(){const obj={format:'ExamOSBackup',version:4,exportedAt:now(),stores:{}};for(const s of STORES){obj.stores[s]=await all(s);if(s==='documents')for(const d of obj.stores[s]){if(d.blob instanceof Blob){d.base64=await blobToBase64(d.blob);delete d.blob}}if(s==='oral')for(const o of obj.stores[s]){if(o.audio instanceof Blob){o.audioBase64=await blobToBase64(o.audio);delete o.audio}}}return obj}
function blobToBase64(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=()=>rej(r.error);r.readAsDataURL(blob)})}
function base64ToBlob(str,type='application/pdf'){const bin=atob(str);const chunks=[];for(let i=0;i<bin.length;i+=65536){const v=bin.slice(i,i+65536);const a=new Uint8Array(v.length);for(let j=0;j<v.length;j++)a[j]=v.charCodeAt(j);chunks.push(a)}return new Blob(chunks,{type})}
/** Validate every record and decode binary attachments before starting a single atomic IDB transaction. */
export async function restore(json){
 if(json?.format!=='ExamOSBackup'||![3,4].includes(json.version)||!json.stores||!Array.isArray(json.stores.subjects))throw Error('Unsupported or corrupted ExamOS backup');
 if((json.stores.documents||[]).some(d=>d?.encrypted)&&!(json.stores.settings||[]).some(s=>s?.id==='pdf-vault'&&s?.format==='ExamOSPDFVault'))throw Error('Encrypted backup is missing its PDF vault configuration.');
 const decoded={};
 for(const s of STORES){
  const rows=json.stores[s]??[];
  if(!Array.isArray(rows)||rows.length>100000)throw Error(`Invalid backup store: ${s}`);
  const seen=new Set();
  decoded[s]=rows.map(original=>{
   if(!original||typeof original!=='object'||Array.isArray(original)||typeof original.id!=='string'||!original.id||seen.has(original.id))throw Error(`Invalid or duplicate record in ${s}`);
   seen.add(original.id);
   const item={...original};
   if(s==='documents'&&item.base64){item.blob=base64ToBlob(item.base64,'application/pdf');delete item.base64}
   if(s==='oral'&&item.audioBase64){item.audio=base64ToBlob(item.audioBase64,'audio/webm');delete item.audioBase64}
   return item;
  });
 }
 const db=await openDB();
 await new Promise((res,rej)=>{
  const transaction=db.transaction(STORES,'readwrite');
  for(const s of STORES)for(const row of decoded[s])transaction.objectStore(s).put(row);
  transaction.oncomplete=()=>res();transaction.onerror=()=>rej(transaction.error);
  transaction.onabort=()=>rej(transaction.error||Error('Database restore rolled back'));
 });
 return true;
}
export const percent=(a,b)=>b>0?Math.round(100*a/b):0;
export const chapterPercent=c=>percent((c.completed||[]).length,(c.subtopics||[]).length);
export const clean=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export const humanSec=n=>`${Math.floor(Math.max(n,0)/60).toString().padStart(2,'0')}:${Math.floor(Math.max(n,0)%60).toString().padStart(2,'0')}`;
export const localDate=(d=new Date())=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)};
export const grade=(q,answer)=>{const type=q.type,expected=q.answer;
 if(['mcq','tf','fill'].includes(type))return String(answer??'').trim().toLocaleLowerCase()===String(expected??'').trim().toLocaleLowerCase();
 if(type==='multiselect')return String(answer??'').split('|').map(s=>s.trim()).filter(Boolean).sort().join('|')===String(expected??'').split('|').map(s=>s.trim()).filter(Boolean).sort().join('|');
 if(type==='numeric'){const n=Number(String(answer).trim().replace(',','.')),target=Number(expected),tolerance=Number(q.tolerance||0);return String(answer).trim()!==''&&Number.isFinite(n)&&Number.isFinite(target)&&Math.abs(n-target)<=tolerance}
 return null;
};
export function nextCard(card,rating,date=new Date()){const p={...card};const old=Math.max(1,p.interval||1);const ease=p.ease||2.5;let days=1;
if(rating==='Again'){days=1;p.ease=Math.max(1.3,ease-.2);p.reps=0}
else if(rating==='Hard'){days=Math.max(2,Math.round(old*1.2));p.ease=Math.max(1.3,ease-.15);p.reps=(p.reps||0)+1}
else if(rating==='Good'){days=p.reps?Math.max(2,Math.round(old*ease)):1;p.ease=ease;p.reps=(p.reps||0)+1}
else if(rating==='Easy'){days=Math.max(4,Math.round(old*ease*1.3));p.ease=ease+.15;p.reps=(p.reps||0)+1}
else throw Error('Invalid rating');p.interval=days;const due=new Date(date.getTime());due.setDate(due.getDate()+days);p.due=due.toISOString().slice(0,10);p.lastRating=rating;p.lastReview=date.toISOString();return p}
export const mistakeTypes=['Conceptual error','Formula error','Mathematical error','Unit conversion error','Incorrect assumption','Incomplete explanation','Time management'];
export const taskStatuses=['Not Started','Learning','Practising','Review Needed','Mastered'];
export const examTemplate={digital:{duration:90,type:'written'},power:{duration:30,type:'oral'},control:{duration:120,type:'written'},microwave:{duration:90,type:'written'},micro:{duration:0,type:'configurable'}};
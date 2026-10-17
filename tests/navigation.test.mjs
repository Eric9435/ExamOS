import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
test('subjects use iOS-style drill-down screens instead of inline expanded lists',()=>{
 assert.match(app,/function subjectDetailPage\(id\)/);
 assert.match(app,/function chapterDetailPage\(id\)/);
 assert.match(app,/pushView\('subject',id,'courses'\)/);
 assert.match(app,/pushView\('chapter',id,'courses'\)/);
 const courses=app.slice(app.indexOf('function coursesPage(){'),app.indexOf('function subjectDetailPage(id)'));
 assert.doesNotMatch(courses,/<details|chapter-details|chapter-content/);
 assert.match(courses,/type="button" class="ios-list-row"/);
});
test('practice question, formula, and flashcard selections open standalone workspaces',()=>{
 for(const kind of ['question','flashcard','formula'])assert.match(app,new RegExp('function '+kind+'DetailPage\\(id\\)'));
 assert.match(app,/case 'practice-question':pushView\('question',id,'practice'\)/);
 assert.match(app,/case 'recall-formula':pushView\('formula',id,'formulas'\)/);
 assert.match(app,/case 'begin-review':case 'show-card':pushView\('flashcard',id,'flashcards'\)/);
});
test('native Back navigation restores the prior view and scroll position',()=>{
 assert.match(app,/function navigateBack\(\)/);
 assert.match(app,/history\.back\(\)/);
 assert.match(app,/window\.addEventListener\('popstate'/);
 assert.match(app,/saveRouteToHistory\(false\)/);
 assert.match(app,/scroll:r\.scrollY\|\|0/);
 assert.match(app,/saveRouteToHistory\(true\);render\(\{scroll:0,motion:'push'\}\)/);
 assert.match(css,/\.ios-motion-push/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
test('touch grouped rows and Back control are accessible',()=>{
 assert.match(app,/aria-label="Go back to previous screen"/);
 assert.match(app,/data-action="navigate-back"/);
 assert.match(css,/\.ios-list-row/);
 assert.match(css,/\.ios-check-row/);
 assert.match(css,/\.ios-home-course/);
});
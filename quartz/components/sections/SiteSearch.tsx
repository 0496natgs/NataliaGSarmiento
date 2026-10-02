import { Lang, t } from "./i18n"

const BASES = "work writing photo-video visual-notes about consulting contact ai"

// A small search over everything on both sides of the site (writing and consulting), from the
// content index the build already makes. No library, nothing leaves the browser.
const SEARCH_JS = `if(!window.__ss){window.__ss=1;var idx=null,sel=0;
var bases=${JSON.stringify(BASES)}.split(" ");
function box(){return document.getElementById("ss")}
function open(){var b=box();if(!b)return;b.hidden=false;document.documentElement.classList.add("ss-open");var i=document.getElementById("ss-input");i.value="";render("");i.focus();
if(!idx)fetch("/static/contentIndex.json").then(function(r){return r.json()}).then(function(d){idx=Object.keys(d).filter(function(k){return bases.indexOf(k.split("/")[0])>-1}).map(function(k){var e=d[k];return{slug:k,title:e.title||k,text:(e.content||"").toLowerCase(),tags:(e.tags||[]).join(" ").toLowerCase(),raw:e.content||""}});render(i.value)})}
function close(){var b=box();if(b){b.hidden=true;document.documentElement.classList.remove("ss-open")}}
function render(q){var ul=document.getElementById("ss-results");if(!ul)return;ul.innerHTML="";q=q.trim().toLowerCase();if(!q||!idx)return;
var words=q.split(/\\s+/),hits=[];
idx.forEach(function(e){var t=e.title.toLowerCase(),score=0,ok=words.every(function(w){var inT=t.indexOf(w)>-1,inX=e.text.indexOf(w)>-1||e.tags.indexOf(w)>-1;if(inT)score+=3;if(inX)score+=1;return inT||inX});if(ok)hits.push({e:e,s:score})});
hits.sort(function(a,b){return b.s-a.s});sel=0;
if(!hits.length){var li=document.createElement("li");li.className="ss-empty";li.textContent=document.getElementById("ss").getAttribute("data-empty");ul.appendChild(li);return}
hits.slice(0,12).forEach(function(h,i){var e=h.e,li=document.createElement("li"),a=document.createElement("a"),lang=e.slug.indexOf("es/")===0;a.href="/"+e.slug;if(i===0)a.className="is-sel";
var t=document.createElement("span");t.className="ss-title";t.textContent=e.title;var m=e.text.indexOf(words[0]),sn=document.createElement("span");sn.className="ss-snip";
if(m>-1){var st=Math.max(0,m-50);sn.textContent=(st>0?"…":"")+e.raw.slice(st,m+110).replace(/\\s+/g," ")+"…"}else{sn.textContent=e.raw.slice(0,110)+"…"}
var w=document.createElement("span");w.className="ss-where";w.textContent=e.slug.split("/")[0].replace("-"," ");a.appendChild(w);a.appendChild(t);a.appendChild(sn);li.appendChild(a);ul.appendChild(li)})}
document.addEventListener("click",function(e){var t=e.target;if(t.closest&&t.closest("[data-ss-open]")){e.preventDefault();open()}else if(t.closest&&(t.closest("[data-ss-close]")||t.id==="ss")){close()}else if(t.closest&&t.closest("#ss-results a")){close()}});
document.addEventListener("input",function(e){if(e.target.id==="ss-input")render(e.target.value)});
document.addEventListener("keydown",function(e){var b=box();var isOpen=b&&!b.hidden;
if((e.key==="k"&&(e.metaKey||e.ctrlKey))||(e.key==="/"&&!isOpen&&!/INPUT|TEXTAREA/.test((e.target.tagName||"")))){e.preventDefault();open();return}
if(!isOpen)return;if(e.key==="Escape")close();
var links=[].slice.call(document.querySelectorAll("#ss-results a"));if(!links.length)return;
if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();links[sel]&&links[sel].classList.remove("is-sel");sel=(sel+(e.key==="ArrowDown"?1:-1)+links.length)%links.length;links[sel].classList.add("is-sel");links[sel].scrollIntoView({block:"nearest"})}
if(e.key==="Enter"){e.preventDefault();links[sel].click()}});
document.addEventListener("nav",close)}`

// The email address is stored encoded in the page and only put together when the button is used.
const MAIL_JS = `if(!window.__mail){window.__mail=1;document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("[data-mail]");if(!a)return;e.preventDefault();window.location.href="mailto:"+atob(a.getAttribute("data-mail"))})}`

/** The search button for the menu and its overlay (opens with the button, Ctrl/Cmd+K or "/"). */
export function SiteSearch({ lang }: { lang: Lang }) {
  const tt = t(lang)
  return (
    <>
      <button type="button" class="nav-search" data-ss-open aria-label={tt.search}>
        <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6" />
          <path
            d="M13 13l4.5 4.5"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
        <span>{tt.search}</span>
      </button>
      <script dangerouslySetInnerHTML={{ __html: MAIL_JS }} />
      <div id="ss" class="ss" hidden data-empty={tt.searchEmpty}>
        <script dangerouslySetInnerHTML={{ __html: SEARCH_JS }} />
        <div class="ss-box" role="dialog" aria-label={tt.search}>
          <div class="ss-bar">
            <input
              id="ss-input"
              type="search"
              placeholder={tt.searchPlaceholder}
              autocomplete="off"
              aria-label={tt.search}
            />
            <button type="button" class="ss-x" data-ss-close aria-label="Close">
              Esc
            </button>
          </div>
          <p class="ss-hint">{tt.searchHint}</p>
          <ul id="ss-results" class="ss-results" />
        </div>
      </div>
    </>
  )
}

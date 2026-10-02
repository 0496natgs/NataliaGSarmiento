import { Lang, t } from "./i18n"

// One click handler for every share button on every page (the page changes without a reload).
// The share links are plain https links: nothing is loaded from the networks and nothing is tracked.
export const SHARE_JS = `if(!window.__share){window.__share=1;
function show(){document.querySelectorAll(".share-native").forEach(function(b){if(navigator.share)b.hidden=false})}
show();document.addEventListener("nav",show);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-share]");if(!b)return;var box=b.closest(".share"),url=box.getAttribute("data-url"),title=box.getAttribute("data-title");
if(b.getAttribute("data-share")==="native"){navigator.share({title:title,url:url}).catch(function(){})}
else if(b.getAttribute("data-share")==="copy"||b.getAttribute("data-share")==="instagram"){var ig=b.getAttribute("data-share")==="instagram";var done=function(){var o=b.getAttribute("title")||b.textContent;b.setAttribute("title",b.getAttribute("data-done"));if(!ig){var t0=b.textContent;b.textContent=b.getAttribute("data-done");setTimeout(function(){b.textContent=t0},1600)}else{var lb=box.querySelector(".share-label"),old=lb.textContent;lb.textContent=b.getAttribute("data-done");setTimeout(function(){lb.textContent=old},4000);window.open("https://www.instagram.com/","_blank","noopener")}};
if(navigator.clipboard)navigator.clipboard.writeText(url).then(done);else{var t=document.createElement("textarea");t.value=url;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();done()}}})}`

// Simple one-colour icons (24x24), so the bar stays small.
const ICONS: Record<string, string> = {
  LinkedIn:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.75 9.75h3.8v1.6h.06c.53-1 1.82-2 3.75-2 4 0 4.74 2.6 4.74 6V21h-4v-5c0-1.2 0-2.75-1.7-2.75s-1.95 1.3-1.95 2.65V21h-4z",
  X: "M17.75 3h3.1l-6.77 7.74L22 21h-6.2l-4.87-6.37L5.35 21H2.25l7.24-8.28L1.9 3h6.36l4.4 5.82zm-1.09 16.15h1.72L7.4 4.76H5.55z",
  Facebook:
    "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.25-1.5 1.55-1.5h1.65V3.45A22 22 0 0 0 14.3 3.3c-2.4 0-4.05 1.45-4.05 4.15v2.35H7.5V13h2.75v8z",
  WhatsApp:
    "M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.2 15.03l-.3-.18-3.1.82.83-3.03-.2-.31A8.1 8.1 0 0 1 12.04 3.8zm-3 3.6c-.2 0-.5.07-.77.37s-1 .98-1 2.4 1.03 2.8 1.17 3c.15.2 2 3.2 4.95 4.4 2.45.97 2.95.78 3.48.73.53-.05 1.7-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35s-1.7-.84-1.97-.93c-.27-.1-.47-.15-.66.15s-.76.93-.93 1.12-.34.22-.63.07c-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5z",
  Instagram:
    "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
  Email:
    "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2v.4l8 5.2 8-5.2V7zm16 2.8-7.45 4.85a1 1 0 0 1-1.1 0L4 9.8V17h16z",
  Share:
    "M18 2a3.5 3.5 0 1 1-2.3 6.14L9.4 11.3a3.5 3.5 0 0 1 0 1.4l6.3 3.16A3.5 3.5 0 1 1 14.9 17.5l-6.3-3.15a3.5 3.5 0 1 1 0-4.7l6.3-3.15A3.5 3.5 0 0 1 18 2z",
}

const Icon = ({ name }: { name: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
    <path d={ICONS[name]} />
  </svg>
)

/**
 * Share this page: small network icons (and the phone's share sheet where there is one) plus a
 * copy-link button. Instagram has no share link on the web, so its icon copies the link and opens
 * Instagram to paste it.
 */
export function ShareBar({ url, title, lang = "en" }: { url: string; title: string; lang?: Lang }) {
  const tt = t(lang)
  const u = encodeURIComponent(url)
  const ti = encodeURIComponent(title)
  const links = [
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ["X", `https://twitter.com/intent/tweet?url=${u}&text=${ti}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ["WhatsApp", `https://wa.me/?text=${ti}%20${u}`],
    ["Email", `mailto:?subject=${ti}&body=${u}`],
  ]
  return (
    <div class="share" data-url={url} data-title={title}>
      <span class="share-label">{tt.share}</span>
      <button
        type="button"
        class="share-btn share-icon share-native"
        data-share="native"
        aria-label={tt.shareNative}
        title={tt.shareNative}
        hidden
      >
        <Icon name="Share" />
      </button>
      {links.map(([label, href]) => (
        <a
          class="share-btn share-icon"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-router-ignore
          aria-label={label}
          title={label}
        >
          <Icon name={label} />
        </a>
      ))}
      <button
        type="button"
        class="share-btn share-icon"
        data-share="instagram"
        data-done={tt.copiedInstagram}
        aria-label="Instagram"
        title="Instagram"
      >
        <Icon name="Instagram" />
      </button>
      <button type="button" class="share-btn" data-share="copy" data-done={tt.copied}>
        {tt.copyLink}
      </button>
    </div>
  )
}

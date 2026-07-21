const SERIES_BOOKS = [
  { n: 1,   code: "1",   label: "Before the Winds Carried Us",  sub: "Ancient Formosa · Out-of-Taiwan Migration", href: "before-the-winds-carried-us.html" },
  { n: 2,   code: "2",   label: "Age of the Southern Wind",     sub: "Maritime Jade Road · Lapita Exodus", href: null },
  { n: 3.1, code: "3.1", label: "Rise of the Sealords",          sub: "Funan · Champa · Srivijaya, to 900 CE", href: null },
  { n: 3.2, code: "3.2", label: "Empires of Salt and Spice",     sub: "Srivijaya · Majapahit", href: null },
  { n: 3.3, code: "3.3", label: "Crescent and Crossroads",       sub: "Rise of the Sultanates — this book", href: null },
  { n: 6,   code: "6",   label: "The Sands Remember Us",         sub: "Precolonial Philippines, 1350–1571 CE", href: null },
  { n: 7,   code: "7",   label: "After the Winds Took Us",       sub: "Precolonial Madagascar, 1500 CE", href: null },
  { n: 8,   code: "8",   label: "The Stars Watch Over Us",       sub: "Precolonial Micronesia, 1000 CE", href: null },
  { n: 9,   code: "9",   label: "The Earth Still Holds Us",      sub: "Precolonial Melanesia, ~1400–1600 CE", href: null },
  { n: 10,  code: "10",  label: "The Horizons Call Us",          sub: "Precolonial Polynesia, 300 CE", href: null },
];

let selectedBook = CURRENT_BOOK;

const menuOverlay = document.getElementById('main-menu-overlay');
const menuBooksEl = document.getElementById('main-menu-books');
const enterBtn = document.getElementById('main-menu-enter-btn');
const enterSubEl = document.getElementById('main-menu-enter-sub');
const menuReturnBtn = document.getElementById('menu-return-btn');
const loreBtn = document.getElementById('main-menu-lore-btn');
const loreOverlay = document.getElementById('lore-overlay');
const loreBackBtn = document.getElementById('lore-back-btn');

function openLoreOverlay(){
  menuOverlay.style.display = 'none';
  loreOverlay.style.display = 'flex';
  loreOverlay.classList.remove('is-closing');
}

function closeLoreOverlay(){
  loreOverlay.classList.add('is-closing');
  setTimeout(() => {
    loreOverlay.style.display = 'none';
    openMainMenu();
  }, 380);
}

loreBtn.addEventListener('click', openLoreOverlay);
loreBackBtn.addEventListener('click', closeLoreOverlay);

function updateEnterButton(){
  const book = SERIES_BOOKS.find(b => b.n === selectedBook);
  enterBtn.textContent = selectedBook === CURRENT_BOOK ? `Enter Book ${CURRENT_BOOK}` : `Go to Book ${book.code}`;
  enterSubEl.textContent = (!book.href && selectedBook !== CURRENT_BOOK)
    ? "Not linked yet — add its file to SERIES_BOOKS to enable"
    : "";
}

function renderMainMenuBooks(){
  menuBooksEl.innerHTML = SERIES_BOOKS.map(b => {
    const cls = ['main-menu-book-btn'];
    if (b.n === selectedBook) cls.push('is-current');
    else if (!b.href) cls.push('is-unavailable');
    // Only the selected book sits in the tab order (roving tabindex); arrow
    // keys move selection between the rest, same pattern as a native radio
    // group, so Tab doesn't have to step through all book buttons.
    const tabindex = b.n === selectedBook ? '0' : '-1';
    return `<button class="${cls.join(' ')}" data-book="${b.n}" tabindex="${tabindex}" aria-pressed="${b.n === selectedBook}" title="${b.label} — ${b.sub}">
      <span class="bk-num">${b.code}</span>
      <span class="bk-label">${b.label}</span>
    </button>`;
  }).join('');

  const bookBtns = Array.from(menuBooksEl.querySelectorAll('.main-menu-book-btn'));
  bookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedBook = parseFloat(btn.dataset.book);
      renderMainMenuBooks();
      updateEnterButton();
      menuBooksEl.querySelector('.main-menu-book-btn.is-current')?.focus();
    });
  });

  // Grid is 5 columns wide (3 on narrow viewports per the media query), so
  // left/right step by one and up/down step by the current column count;
  // Enter activates the Enter button directly from the grid.
  const columns = window.innerWidth <= 640 ? 3 : 5;
  menuBooksEl.addEventListener('keydown', (e) => {
    const currentIdx = bookBtns.findIndex(b => b === document.activeElement);
    if (currentIdx === -1) return;
    let nextIdx = null;
    if (e.key === 'ArrowRight') nextIdx = currentIdx + 1;
    else if (e.key === 'ArrowLeft') nextIdx = currentIdx - 1;
    else if (e.key === 'ArrowDown') nextIdx = currentIdx + columns;
    else if (e.key === 'ArrowUp') nextIdx = currentIdx - columns;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      bookBtns[currentIdx].click();
      return;
    }
    if (nextIdx !== null && bookBtns[nextIdx]) {
      e.preventDefault();
      bookBtns[nextIdx].focus();
    }
  });
}

function closeMainMenu(){
  menuOverlay.classList.add('is-closing');
  setTimeout(() => { menuOverlay.style.display = 'none'; }, 380);
}

function openMainMenu(){
  menuOverlay.style.display = 'flex';
  menuOverlay.classList.remove('is-closing');
}

enterBtn.addEventListener('click', () => {
  if (selectedBook === CURRENT_BOOK){
    closeMainMenu();
    return;
  }
  const book = SERIES_BOOKS.find(b => b.n === selectedBook);
  if (book.href){
    window.location.href = book.href;
  } else {
    alert(`Book ${selectedBook} isn't linked yet. Add its filename to SERIES_BOOKS in the script to enable this link.`);
  }
});

menuReturnBtn.addEventListener('click', () => {
  selectedBook = CURRENT_BOOK;
  renderMainMenuBooks();
  updateEnterButton();
  openMainMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loreOverlay.style.display !== 'none') {
    closeLoreOverlay();
    return;
  }
  if (menuOverlay.style.display === 'none') return;
  if (e.key === 'Escape') {
    selectedBook = CURRENT_BOOK;
    renderMainMenuBooks();
    updateEnterButton();
    closeMainMenu();
  }
});

renderMainMenuBooks();
updateEnterButton();
menuBooksEl.querySelector('.main-menu-book-btn.is-current')?.focus({ preventScroll: true });

// ============ TAB SWITCHING ============
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetPanel = document.getElementById(btn.dataset.tab);
    targetPanel.classList.add('active');
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    // Leaflet needs a size recalculation whenever its container
    // transitions from display:none back to visible.
    if (btn.dataset.tab === 'map-panel') {
      setTimeout(() => { map.invalidateSize(); }, 50);
    }
  });
});


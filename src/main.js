import { aiTools } from './data.js'

const app = document.getElementById('app')

let currentCategory = 'Wszystkie'
let currentPricing = 'Wszystkie'
let currentSort = 'popularnosc'

function getUniqueCategories() {
  const cats = new Set()
  aiTools.forEach(t => t.kategorie.forEach(c => cats.add(c)))
  return ['Wszystkie', ...Array.from(cats)]
}

function filterAndSort() {
  let filtered = aiTools

  if (currentCategory !== 'Wszystkie') {
    filtered = filtered.filter(t => t.kategorie.includes(currentCategory))
  }
  if (currentPricing !== 'Wszystkie') {
    filtered = filtered.filter(t => t.pricing === currentPricing)
  }

  if (currentSort === 'popularnosc') {
    filtered.sort((a, b) => b.popularnosc - a.popularnosc)
  } else if (currentSort === 'nazwa') {
    filtered.sort((a, b) => a.nazwa.localeCompare(b.nazwa))
  }
  return filtered
}

function render() {
  const filtered = filterAndSort()
  const categories = getUniqueCategories()

  const pricingColor = p => p === 'Darmowe' ? 'bg-emerald-500' : p === 'Freemium' ? 'bg-amber-500' : 'bg-red-500'

  let html = `
    <div class="flex h-screen">
      <!-- Sidebar -->
      <div class="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
          <div>
            <h1 class="title-font text-3xl font-semibold tracking-tight">AI Hub</h1>
            <p class="text-xs text-slate-500">2026 edition</p>
          </div>
        </div>

        <div class="space-y-1 mb-8">
          ${categories.map(cat => `
            <button onclick="window.setCategory('${cat}')" 
              class="w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all ${cat === currentCategory ? 'bg-slate-800 text-white' : 'text-slate-400'}">
              <i data-lucide="${cat === 'Wszystkie' ? 'grid' : 'tag'}"></i>
              <span class="font-medium">${cat}</span>
            </button>
          `).join('')}
        </div>

        <div class="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Aktualizowane na żywo
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 flex flex-col">
        <!-- Top bar -->
        <div class="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center px-8 justify-between">
          <div class="flex items-center gap-6">
            <input id="searchInput" 
                   onkeyup="if(event.key === 'Enter') window.openPalette()"
                   placeholder="Wciśnij / aby szukać..." 
                   class="bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-3xl px-6 py-3 w-96 outline-none text-sm">
            <button onclick="window.openPalette()" 
                    class="px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-3xl text-sm flex items-center gap-2 transition-colors">
              <i data-lucide="search"></i>
              Szukaj (/)
            </button>
          </div>

          <div class="flex items-center gap-4">
            <!-- Pricing filter -->
            <select onchange="window.setPricing(this.value)" class="bg-slate-800 border border-slate-700 rounded-3xl px-5 py-3 text-sm">
              <option value="Wszystkie">Wszystkie ceny</option>
              <option value="Darmowe">Tylko darmowe</option>
              <option value="Freemium">Freemium</option>
              <option value="Płatne">Płatne</option>
            </select>

            <!-- Sort -->
            <select onchange="window.setSort(this.value)" class="bg-slate-800 border border-slate-700 rounded-3xl px-5 py-3 text-sm">
              <option value="popularnosc">Najpopularniejsze</option>
              <option value="nazwa">A → Z</option>
            </select>
          </div>
        </div>

        <!-- Grid -->
        <div class="flex-1 p-8 overflow-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(tool => `
              <a href="${tool.link}" target="_blank" 
                 class="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-violet-500 transition-all hover:-translate-y-1">
                <div class="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                <div class="p-6">
                  <div class="flex items-center gap-4 mb-4">
                    <img src="${tool.ikona}" class="w-10 h-10 rounded-2xl object-contain bg-slate-800 p-1" alt="">
                    <div>
                      <div class="font-semibold text-xl">${tool.nazwa}</div>
                      <div class="text-xs ${pricingColor(tool.pricing)} text-white inline-block px-3 py-0.5 rounded-full mt-1">${tool.pricing}</div>
                    </div>
                  </div>
                  <p class="text-slate-400 text-sm line-clamp-3 mb-6">${tool.opis}</p>
                  <div class="flex flex-wrap gap-2">
                    ${tool.kategorie.map(k => `<span class="text-xs bg-slate-800 px-3 py-1 rounded-2xl">${k}</span>`).join('')}
                  </div>
                </div>
                <div class="border-t border-slate-800 px-6 py-4 flex justify-between items-center text-xs text-slate-500">
                  <div>Najlepsze do: <span class="text-slate-400">${tool.najlepsze_do}</span></div>
                  <div class="flex items-center gap-1">
                    <i data-lucide="star" class="w-3 h-3"></i> ${tool.popularnosc}
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Command Palette -->
    <div id="palette" onclick="if(event.target.id==='palette') this.classList.add('hidden')" 
         class="hidden fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex items-start justify-center pt-32">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl">
        <div class="p-6 border-b border-slate-700">
          <input id="paletteInput" placeholder="Szukaj AI..." 
                 class="w-full bg-transparent text-2xl outline-none placeholder:text-slate-500">
        </div>
        <div id="paletteResults" class="max-h-[60vh] overflow-auto p-3"></div>
      </div>
    </div>
  `

  app.innerHTML = html
  lucide.createIcons()

  // Command palette live search
  const paletteInput = document.getElementById('paletteInput')
  if (paletteInput) {
    paletteInput.addEventListener('input', () => {
      const term = paletteInput.value.toLowerCase()
      const resultsDiv = document.getElementById('paletteResults')
      const matches = aiTools.filter(t => 
        t.nazwa.toLowerCase().includes(term) || 
        t.opis.toLowerCase().includes(term)
      )

      resultsDiv.innerHTML = matches.length ? matches.map(t => `
        <a href="${t.link}" target="_blank" onclick="document.getElementById('palette').classList.add('hidden')" 
           class="flex items-center gap-4 px-6 py-4 hover:bg-slate-800 rounded-2xl group">
          <img src="${t.ikona}" class="w-8 h-8 rounded-2xl">
          <div class="flex-1">
            <div class="font-medium group-hover:text-violet-400">${t.nazwa}</div>
            <div class="text-xs text-slate-500 line-clamp-1">${t.opis}</div>
          </div>
          <div class="text-xs px-3 py-1 bg-slate-800 rounded-2xl">${t.pricing}</div>
        </a>
      `).join('') : '<div class="p-8 text-center text-slate-500">Nic nie znaleziono...</div>'
    })
  }
}

// Global functions for onclick
window.setCategory = (cat) => { currentCategory = cat; render() }
window.setPricing = (p) => { currentPricing = p; render() }
window.setSort = (s) => { currentSort = s; render() }
window.openPalette = () => {
  const palette = document.getElementById('palette')
  palette.classList.toggle('hidden')
  setTimeout(() => document.getElementById('paletteInput').focus(), 100)
}

// Keyboard shortcut "/"
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault()
    window.openPalette()
  }
  if (e.key === 'Escape') {
    const palette = document.getElementById('palette')
    if (palette) palette.classList.add('hidden')
  }
})

// Tailwind script + initial render
function initTailwind() {
  render()
}

initTailwind()

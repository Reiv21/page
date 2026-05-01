// Lista projektów — edytuj tutaj, aby dodać nowe projekty (bez backendu)
const projects = [
    {
        title: 'Looping Cards',
        type: 'Game Dev',
        desc: 'Karcianka w której musisz kolejkować swoje karty i tworzyć kombosy',
        tech: ['Unity', 'C#']
    },
    {
        title: 'Beekeeper Simulator',
        type: 'Game Dev',
        desc: 'Symulator pszczelarza.',
        tech: ['Unity', 'C#']
    },
    
];

const projectsContainer = document.getElementById('projects-list');

function renderProjects() {
    if(!projectsContainer) return; // safe-guard: some pages don't have projects list
    projectsContainer.innerHTML = projects.map(p => `\n        <div class="project">\n            <h3>${p.title}</h3>\n            <span class="project-type">${p.type}</span>\n            <p class="project-desc">${p.desc}</p>\n            <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>\n        </div>\n    `).join('');
}

// render projects only if container exists on the page
if(projectsContainer) renderProjects();

// Umożliwia szybkie dodanie projektu z konsoli devtools: addProject({title:'X',type:'',desc:'',tech:[]})
function addProject(p) {
    projects.unshift(p);
    renderProjects();
}

// Expose for quick edits in console
window.addProject = addProject;

// -- Theme toggle (ciemny/jasny) --
const themeToggle = document.getElementById('theme-toggle');

function getPreferredTheme(){
    const stored = localStorage.getItem('theme');
    if(stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(t){
    if(t === 'dark'){
        document.documentElement.classList.add('dark');
        if(themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.documentElement.classList.remove('dark');
        if(themeToggle) themeToggle.textContent = '🌙';
    }
    localStorage.setItem('theme', t);
}

// Initialize theme only on pages where the toggle exists
if(themeToggle){
    applyTheme(getPreferredTheme());
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// -- Gallery rendering and lightbox --
const galleryGrid = document.getElementById('gallery-grid');
const mediaCount = 14; // number of images to include (Media/1.png ... Media/14.png)
const mediaFolder = 'Media';

function renderGallery(){
    if(!galleryGrid) return;
    const items = [];
    for(let i=1;i<=mediaCount;i++){
        const src = `${mediaFolder}/${i}.png`;
        items.push(`<div class="gallery-item"><img src="${src}" alt="Zdjęcie ${i}" data-index="${i-1}"></div>`);
    }
    galleryGrid.innerHTML = items.join('');

    // attach click handlers
    galleryGrid.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', (e)=>{
            openLightbox(parseInt(e.currentTarget.getAttribute('data-index'),10));
        });
    });
}

// Lightbox controls
const lightbox = document.getElementById('lightbox');
const lbImage = lightbox && lightbox.querySelector('.lb-image');
const lbCaption = lightbox && lightbox.querySelector('.lb-caption');
const lbClose = lightbox && lightbox.querySelector('.lb-close');
const lbPrev = lightbox && lightbox.querySelector('.lb-prev');
const lbNext = lightbox && lightbox.querySelector('.lb-next');

let currentIndex = 0;

function openLightbox(index){
    currentIndex = index;
    const src = `${mediaFolder}/${index+1}.png`;
    if(lbImage) lbImage.src = src;
    if(lightbox) lightbox.classList.add('active');
    if(lightbox) lightbox.setAttribute('aria-hidden','false');
}

function closeLightbox(){
    if(lightbox) lightbox.classList.remove('active');
    if(lightbox) lightbox.setAttribute('aria-hidden','true');
}

function showPrev(){
    currentIndex = (currentIndex - 1 + mediaCount) % mediaCount;
    openLightbox(currentIndex);
}

function showNext(){
    currentIndex = (currentIndex + 1) % mediaCount;
    openLightbox(currentIndex);
}

if(lbClose) lbClose.addEventListener('click', closeLightbox);
if(lbPrev) lbPrev.addEventListener('click', showPrev);
if(lbNext) lbNext.addEventListener('click', showNext);

// close on overlay click
if(lightbox) lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });

// keyboard
document.addEventListener('keydown', (e)=>{
    if(!lightbox || !lightbox.classList.contains('active')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showPrev();
    if(e.key === 'ArrowRight') showNext();
});

// render gallery on load
renderGallery();

// -- Mobile nav toggle & dropdown touch behavior --
const navToggle = document.getElementById('nav-toggle');
if(navToggle){
    navToggle.addEventListener('click', (e)=>{
        e.stopPropagation();
        document.documentElement.classList.toggle('nav-open');
    });

    // close nav when clicking outside
    document.addEventListener('click', (ev)=>{
        if(document.documentElement.classList.contains('nav-open')){
            const nav = document.querySelector('.nav-inner');
            if(nav && !nav.contains(ev.target)){
                document.documentElement.classList.remove('nav-open');
            }
        }
    });
}

// dropdown toggles on touch devices
document.querySelectorAll('.nav-item > .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e)=>{
        const parent = toggle.parentElement;
        if(!parent) return;
        // on small screens, toggle open class; on large screens hover still works
        if(window.matchMedia && window.matchMedia('(max-width: 720px)').matches){
            e.stopPropagation();
            parent.classList.toggle('open');
        }
    });
});

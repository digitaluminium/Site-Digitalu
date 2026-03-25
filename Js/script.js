// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== BURGER MOBILE =====
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

if (navBurger && navMobile) {
    navBurger.addEventListener('click', () => {
        navBurger.classList.toggle('open');
        navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => {
            navBurger.classList.remove('open');
            navMobile.classList.remove('open');
        });
    });
}

// ===== FORMULAIRE CONTACT =====
const textarea = document.getElementById('message');
const btnEnvoyer = document.getElementById('btnEnvoyer');
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enveloppe = document.createElement('span');
        enveloppe.textContent = '✉️';
        const rect = btnEnvoyer.getBoundingClientRect();
        enveloppe.style.cssText = `
            position: fixed;
            font-size: 4rem;
            top: ${rect.top + rect.height/2}px;
            left: ${rect.left + rect.width/2}px;
            transform: translate(-50%, -50%);
            z-index: 9999;
            transition: all 1.5s ease-in;
        `;
        document.body.appendChild(enveloppe);
        btnEnvoyer.classList.add('sending');
        btnEnvoyer.querySelector('.btn-text').style.opacity = '0';
        setTimeout(() => {
            enveloppe.style.transform = 'translate(100vw, -100vh) scale(2)';
            enveloppe.style.opacity = '0';
        }, 100);
        setTimeout(() => {
            enveloppe.remove();
            btnEnvoyer.querySelector('.btn-text').textContent = 'Envoyé !';
            btnEnvoyer.querySelector('.btn-text').style.opacity = '1';
            btnEnvoyer.classList.add('sent');
            contactForm.submit();
            localStorage.clear();
            contactForm.reset();      
        }, 2000);
    });
}

if (textarea) {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}
// ===== GALERIE - FILTRES =====
const filtresBtns = document.querySelectorAll('.filtre-btn');
if (filtresBtns.length > 0) {
    const galerieItems = document.querySelectorAll('.galerie-item');
    const galerieVide = document.getElementById('galerieVide');

    filtresBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtresBtns.forEach(b => b.classList.remove('actif'));
            btn.classList.add('actif');
            const filtre = btn.dataset.filtre;
            let visibles = 0;
            galerieItems.forEach(item => {
                if (filtre === 'tous' || item.dataset.categorie === filtre) {
                    item.classList.remove('hidden');
                    visibles++;
                } else {
                    item.classList.add('hidden');
                }
            });
            if (galerieVide) galerieVide.style.display = visibles === 0 ? 'block' : 'none';
        });
    });

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitre = document.getElementById('lightboxTitre');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxCompteur = document.getElementById('lightboxCompteur');

    let indexCourant = 0;
    let itemsVisibles = [];

    function afficherLightbox() {
        const item = itemsVisibles[indexCourant];
        lightboxImg.src = item.querySelector('img').src;
        lightboxImg.alt = item.querySelector('img').alt;
        lightboxTitre.textContent = item.dataset.titre;
        lightboxTag.textContent = item.dataset.tag;
        lightboxCompteur.textContent = (indexCourant + 1) + ' / ' + itemsVisibles.length;
    }

    function fermerLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    galerieItems.forEach(item => {
        item.addEventListener('click', () => {
            itemsVisibles = [...galerieItems].filter(i => !i.classList.contains('hidden'));
            indexCourant = itemsVisibles.indexOf(item);
            afficherLightbox();
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    document.getElementById('lightboxClose').addEventListener('click', fermerLightbox);

    document.getElementById('lightboxPrev').addEventListener('click', () => {
        indexCourant = (indexCourant - 1 + itemsVisibles.length) % itemsVisibles.length;
        afficherLightbox();
    });

    document.getElementById('lightboxNext').addEventListener('click', () => {
        indexCourant = (indexCourant + 1) % itemsVisibles.length;
        afficherLightbox();
    });

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) fermerLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') fermerLightbox();
        if (e.key === 'ArrowLeft') { indexCourant = (indexCourant - 1 + itemsVisibles.length) % itemsVisibles.length; afficherLightbox(); }
        if (e.key === 'ArrowRight') { indexCourant = (indexCourant + 1) % itemsVisibles.length; afficherLightbox(); }
    });
}

// ===== SLIDER PROJETS =====
document.querySelectorAll('[data-slider]').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const images = slider.querySelectorAll('img');
    const dots = slider.querySelectorAll('.dot');
    const prev = slider.querySelector('.slider-prev');
    const next = slider.querySelector('.slider-next');
    let index = 0;

    function aller(n) {
        index = (n + images.length) % images.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(d => d.classList.remove('actif'));
        dots[index].classList.add('actif');
    }

    prev.addEventListener('click', () => aller(index - 1));
    next.addEventListener('click', () => aller(index + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => aller(i)));
});

// ===== PERSISTANCE DU FORMULAIRE (LocalStorage) =====
if (contactForm) {
    const champs = contactForm.querySelectorAll('input, textarea, select');

    // On remet les infos si elles existent en mémoire
    window.addEventListener('load', () => {
        champs.forEach(champ => {
            const sauvegarde = localStorage.getItem(champ.id);
            if (sauvegarde && champ.type !== 'checkbox') {
                champ.value = sauvegarde;
            }
        });
    });

    // On enregistre à chaque fois que l'utilisateur écrit
    champs.forEach(champ => {
        champ.addEventListener('input', () => {
            if (champ.type !== 'checkbox') {
                localStorage.setItem(champ.id, champ.value);
            }
        });
    });
}

const fichierInput = document.getElementById('fichier');
const fileNom = document.getElementById('fileNom');

if (fichierInput) {
    fichierInput.addEventListener('change', () => {
        fileNom.textContent = fichierInput.files[0] 
            ? fichierInput.files[0].name 
            : 'Choisir un fichier (PDF, JPG, DWG, DXF)';
    });
}
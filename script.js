/* =========================================
   STYLE MEN - SCRIPT COMPLETO
   ========================================= */

// --- 1. LOADER ---
window.addEventListener('load', function() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 800);
});

// --- 2. ANIMAÇÕES FADE-IN NO SCROLL ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fade-in-element').forEach(el => {
        observer.observe(el);
    });
});

// --- 3. EFEITO PARALLAX SUAVE ---
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const banner = document.querySelector('.hero-banner');
    if (banner) {
        const rate = scrolled * -0.3;
        banner.style.transform = `translateY(${rate}px)`;
    }
});

// --- 4. ABRIR CHATBOT ---
function openChatbot() {
    // Usa a API do Chatling para abrir o chatbot
    if (window.Chatling && typeof window.Chatling.open === 'function') {
        window.Chatling.open();
    } else {
        // Se o Chatling ainda não estiver carregado, aguarda e tenta novamente
        const checkChatling = setInterval(() => {
            if (window.Chatling && typeof window.Chatling.open === 'function') {
                window.Chatling.open();
                clearInterval(checkChatling);
            }
        }, 100);
        
        // Para de tentar após 5 segundos
        setTimeout(() => {
            clearInterval(checkChatling);
        }, 5000);
    }
}

// --- 7. CARROSSEL (CORRIGIDO) ---
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('servicesCarousel');
    
    // Se não houver carrossel na página, encerra a função
    if (!carousel) return;

    let currentIndex = 0;
    const cards = carousel.querySelectorAll('.service-card');
    const totalCards = cards.length;
    
    // Centralizar o primeiro card ao carregar
    function centerFirstCard() {
        if (cards.length > 0) {
            // Em desktop, garantir que o primeiro card apareça completamente
            if (window.innerWidth >= 768) {
                const firstCard = cards[0];
                if (firstCard) {
                    // Scroll para mostrar o primeiro card completamente
                    carousel.scrollLeft = 0;
                }
            } else {
                // Em mobile, apenas resetar o scroll
                carousel.scrollLeft = 0;
            }
        }
    }
    
    // Aguardar o carregamento completo antes de centralizar
    setTimeout(() => {
        centerFirstCard();
    }, 100);
    let isScrolling = false;
    let autoScrollInterval;
    
    // Variáveis para Drag (Arrastar)
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let startScrollLeft = 0;
    
    // Função para mover o scroll até um card específico
    function scrollToCard(index) {
        if (isScrolling || isDragging) return;
        
        // Proteção: verifica se o card existe
        if (!cards[index]) return;

        isScrolling = true;
        
        const card = cards[index];
        const cardWidth = card.offsetWidth;
        const carouselWidth = carousel.offsetWidth;
        
        // Cálculo para centralizar o card considerando o espaçador
        const scrollPosition = card.offsetLeft - (carouselWidth - cardWidth) / 2;
        
        carousel.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }
    
    // Função para ir ao próximo card
    function nextCard() {
        if (isDragging) return;
        currentIndex = (currentIndex + 1) % totalCards;
        scrollToCard(currentIndex);
    }
    
    // Iniciar rolagem automática
    function startAutoScroll() {
        if (isDragging) return;
        clearInterval(autoScrollInterval); // Limpa para evitar duplicidade
        autoScrollInterval = setInterval(nextCard, 4000); // 4 segundos
    }
    
    // Parar rolagem automática
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Resetar timer de inatividade (volta a rolar se o usuário parar de mexer)
    let inactivityTimer;
    function resetAutoScroll() {
        stopAutoScroll();
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (!isDragging) {
                startAutoScroll();
            }
        }, 5000);
    }
    
    // --- Eventos de Mouse (Desktop) ---
    carousel.addEventListener('mousedown', function(e) {
        isDragging = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        startScrollLeft = carousel.scrollLeft;
        resetAutoScroll();
        e.preventDefault();
    });
    
    carousel.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
        }
    });
    
    carousel.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
            resetAutoScroll();
        }
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Velocidade do arrasto
        carousel.scrollLeft = startScrollLeft - walk;
    });
    
    // --- Eventos de Touch (Celular) ---
    let touchStartX = 0;
    let touchStartScrollLeft = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        isDragging = true;
        touchStartX = e.touches[0].pageX - carousel.offsetLeft;
        touchStartScrollLeft = carousel.scrollLeft;
        resetAutoScroll();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - touchStartX) * 2;
        carousel.scrollLeft = touchStartScrollLeft - walk;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function() {
        if (isDragging) {
            isDragging = false;
            resetAutoScroll();
        }
    });
    
    // Detectar scroll manual para atualizar o índice atual
    let scrollTimeout;
    carousel.addEventListener('scroll', function() {
        // Pausa o automático se o usuário scrollar
        resetAutoScroll();
        
        // Atualiza qual é o card "ativo" (o mais centralizado)
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const carouselCenter = carousel.scrollLeft + carousel.offsetWidth / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(carouselCenter - cardCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            currentIndex = closestIndex;
        }, 100);
    });
    
    // Inicialização final do carrossel
    setTimeout(() => {
        centerFirstCard(); // Centraliza o primeiro card
        startAutoScroll();
    }, 1000);
    
    // --- 8. BOTÕES DE NAVEGAÇÃO ---
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    // Função para ir ao próximo card (usando a função existente)
    function goToNextCard() {
        if (isDragging || isScrolling) return;
        
        stopAutoScroll();
        nextCard(); // Usa a função existente que já faz o loop
        resetAutoScroll();
    }
    
    // Função para ir ao card anterior
    function goToPrevCard() {
        if (isDragging || isScrolling) return;
        
        stopAutoScroll();
        
        // Se estiver no primeiro card, vai para o último (loop infinito)
        if (currentIndex === 0) {
            currentIndex = totalCards - 1;
        } else {
            currentIndex = currentIndex - 1;
        }
        
        scrollToCard(currentIndex);
        resetAutoScroll();
    }
    
    // Event listeners para os botões
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToNextCard();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToPrevCard();
        });
    }
});

// Smooth scroll para links internos (caso adicione menu no futuro)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Detecção de Touch Device
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}
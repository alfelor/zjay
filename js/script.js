// Handle navbar active states for all pages and sections
const navLinks = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Set active state based on current page
function setActiveNavLink() {
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Remove active class first
        link.classList.remove('active');
        
        // Handle both page links and section links
        if (href.includes('#') && currentPage === 'index.html') {
            // For homepage section links, will be handled by scroll event
            return;
        } else if (href.includes(currentPage) || 
                  (currentPage === 'index.html' && href === '#home')) {
            link.classList.add('active');
        }
    });
}

// Initial active state
setActiveNavLink();

// Handle smooth scroll for section links on homepage
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Collapse navbar on mobile
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    new bootstrap.Collapse(navbarCollapse).hide();
                }
            }
        }
    });
});

// Highlight active nav link on scroll (only for homepage sections)
window.addEventListener('scroll', () => {
    // Only run this for the homepage
    if (currentPage !== 'index.html') return;

    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollOffset = 100; // Adjusted for better response
    
    // Calculate the document height and viewport position
    const docHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollPos + viewportHeight) / docHeight;
    const isNearBottom = scrollPercentage > 0.95; // 95% of the way down

    // Get the section that takes up most of the viewport
    let currentSection = null;
    let maxVisibleHeight = 0;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Calculate how much of the section is visible in the viewport
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        
        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentSection = section;
        }
    });

    // Special handling for the contact section at the bottom
    if (isNearBottom) {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            currentSection = contactSection;
        }
    }

    // Update active states
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        
        if (currentSection && href === `#${currentSection.id}`) {
            link.classList.add('active');
        }
    });
});

// Debounce function to limit how often the layout updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to handle responsive layout
function handleResponsiveLayout() {
    // Get all cards and their containers
    const cards = document.querySelectorAll('.music-card, .movie-card');
    const containers = document.querySelectorAll('.music-section, .movies-section');
    
    // Reset container heights
    containers.forEach(container => {
        container.style.height = 'auto';
    });

    // Handle cards
    cards.forEach(card => {
        // Reset card styles
        card.style.height = 'auto';
        card.style.display = 'flex';
        card.style.opacity = '0';
        
        // Force a reflow
        void card.offsetHeight;
        
        // Fade in the card
        card.style.opacity = '1';
        card.style.transition = 'opacity 0.3s ease';
    });

    // Handle videos with proper aspect ratio
    const videos = document.querySelectorAll('.video-wrapper');
    videos.forEach(wrapper => {
        const ratio = 0.5625; // 16:9 aspect ratio
        const width = wrapper.offsetWidth;
        wrapper.style.height = (width * ratio) + 'px';
        
        // Ensure video fills wrapper properly
        const video = wrapper.querySelector('video');
        if (video) {
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
        }
    });

    // Handle music cards image alignment
    const musicImages = document.querySelectorAll('.music-card .img-wrapper');
    musicImages.forEach(img => {
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
    });

    // Equalize card heights in each row
    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        const rowCards = row.querySelectorAll('.music-card, .movie-card');
        let maxHeight = 0;
        
        // First pass: find max height
        rowCards.forEach(card => {
            card.style.height = 'auto';
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });
        
        // Second pass: apply max height
        rowCards.forEach(card => {
            card.style.height = maxHeight + 'px';
        });
    });
}

// Optimized event handlers
const debouncedLayout = debounce(handleResponsiveLayout, 250);

// Run on page load
document.addEventListener('DOMContentLoaded', handleResponsiveLayout);

// Run on window resize with debounce
window.addEventListener('resize', debouncedLayout);

// Run when tab becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        handleResponsiveLayout();
    }
});

// Run after content loads with progressive enhancement
window.addEventListener('load', () => {
    handleResponsiveLayout();
    // Additional check after images and videos load
    const media = document.querySelectorAll('img, video');
    media.forEach(item => {
        if (item.complete) {
            handleResponsiveLayout();
        } else {
            item.addEventListener('load', handleResponsiveLayout);
        }
    });
});
// Chart initialization
function initChart() {
    const ctx = document.getElementById('occupancyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
            datasets: [{
                label: 'Occupied Rooms',
                data: [1, 2, 1, 2, 1, 1, 1],
                borderColor: '#6c63ff',
                backgroundColor: 'rgba(108,99,255,0.10)',
                tension: 0.4,
                pointBackgroundColor: '#ff6584',
                pointRadius: 5,
                fill: true
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#6c63ff', font: { family: 'Montserrat', weight: 'bold' } },
                    grid: { color: '#232a47' }
                },
                x: {
                    ticks: { color: '#6c63ff', font: { family: 'Montserrat', weight: 'bold' } },
                    grid: { color: '#232a47' }
                }
            }
        }
    });
}

// Navigation handling
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('#mobileSidebar .nav-link');
    const desktopNavLinks = document.querySelectorAll('.sidebar .nav-link');

    function handleNavClick(e, link, isMobile = false) {
        e.preventDefault();
        const href = link.getAttribute('href');
        const targetId = href.substring(1);

        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`[href="${href}"]`).forEach(l => l.classList.add('active'));

        // Handle scrolling
        if (targetId === 'dashboard') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.getElementById(targetId);
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }

        // Show all cards
        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.style.display = '';
        });

        // Handle mobile sidebar
        if (isMobile) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileSidebar'));
            if (bsOffcanvas) bsOffcanvas.hide();
        }
    }

    // Attach click handlers
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, link, true));
    });

    desktopNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, link, false));
    });
}

// Date handling
function initDateHandling() {
    const todayStr = '2025-05-22';
    const calendarInput = document.getElementById('calendarInput');
    const todayBtn = document.getElementById('todayBtn');

    calendarInput.value = todayStr;
    todayBtn.addEventListener('click', () => {
        calendarInput.value = todayStr;
    });
}

// Revenue calculations
function initRevenueHandling() {
    function updateTodaysRevenue() {
                const todayStr = '2025-05-22';
                let revenue = 0;

                // Calculate from transactions only (already includes occupied room revenue)
                document.querySelectorAll('#txnTable tbody tr').forEach(row => {
                    if (row.children[2].textContent === todayStr) {
                        revenue += parseInt(row.children[3].textContent.replace('₱','').replace(/,/g, ''));
                    }
                });

        document.getElementById('todaysRevenue').textContent = `₱${revenue.toLocaleString()}`;
    }

    updateTodaysRevenue();

    // Update on new booking
    document.getElementById('bookRoomForm').addEventListener('submit', () => {
        setTimeout(updateTodaysRevenue, 100);
    });
}

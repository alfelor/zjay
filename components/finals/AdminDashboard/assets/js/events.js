// Room search filter
document.getElementById('roomSearch').addEventListener('input', function() {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll('#roomTable tbody tr');
    let occupied = 0;
    rows.forEach(row => {
        const type = row.children[1].textContent.toLowerCase();
        const no = row.children[0].textContent.toLowerCase();
        const status = row.children[2].textContent.trim();
        const match = type.includes(value) || no.includes(value);
        row.style.display = match ? '' : 'none';
        if (status === 'Occupied' && match) occupied++;
    });
    document.getElementById('occupiedCount').textContent = occupied;
});

// Transaction date filter
document.getElementById('txnDateFilter').addEventListener('change', function() {
    const value = this.value;
    const rows = document.querySelectorAll('#txnTable tbody tr');
    let total = 0;
    rows.forEach(row => {
        const date = row.children[2].textContent;
        const amount = parseInt(row.children[3].textContent.replace('₱','').replace(/,/g, ''));
        if (!value || date === value) {
            row.style.display = '';
            total += amount;
        } else {
            row.style.display = 'none';
        }
    });
    document.getElementById('totalRevenue').textContent = total.toLocaleString();
});

// Book Room modal functionality
document.getElementById('bookRoomForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const roomNo = document.getElementById('roomNo').value;
    const guestName = document.getElementById('guestName').value;
    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;
    
    // Add to transaction table
    const tbody = document.querySelector('#txnTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td>TXN${Math.floor(Math.random()*900+100)}</td><td>${guestName}</td><td>${date}</td><td>₱${parseInt(amount).toLocaleString()}</td>`;
    tbody.appendChild(newRow);
    
    // Update total revenue
    let total = 0;
    document.querySelectorAll('#txnTable tbody tr').forEach(row => {
        total += parseInt(row.children[3].textContent.replace('₱','').replace(/,/g, ''));
    });
    document.getElementById('totalRevenue').textContent = total.toLocaleString();
    
    // Close modal
    var modal = bootstrap.Modal.getInstance(document.getElementById('bookRoomModal'));
    modal.hide();
    this.reset();
});

// Initialize responsive handling
function initResponsiveHandling() {
    function handleResize() {
        if (window.innerWidth >= 768) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileSidebar'));
            if (bsOffcanvas) bsOffcanvas.hide();
        }
    }

    window.addEventListener('resize', handleResize);
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initDateHandling();
    initRevenueHandling();
    initResponsiveHandling();
    initChart();
});

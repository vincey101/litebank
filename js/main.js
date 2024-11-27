const transactions = [
    {
        id: 1,
        type: 'credit',
        amount: 1000,
        description: 'Salary deposit',
        date: '2024-03-15'
    },
    {
        id: 2,
        type: 'debit',
        amount: 50,
        description: 'Restaurant payment',
        date: '2024-03-14'
    },
    {
        id: 3,
        type: 'debit',
        amount: 200,
        description: 'Online shopping',
        date: '2024-03-13'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    displayTransactions();
    initializeCharts();
    showSection('main-section');
});

function displayTransactions() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        transactionList.appendChild(transactionElement);
    });
}

function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';

    const info = document.createElement('div');
    info.className = 'transaction-info';
    
    const description = document.createElement('div');
    description.className = 'transaction-description';
    description.textContent = transaction.description;

    const date = document.createElement('div');
    date.className = 'transaction-date';
    date.textContent = new Date(transaction.date).toLocaleDateString();

    info.appendChild(description);
    info.appendChild(date);

    const amount = document.createElement('div');
    amount.className = `transaction-amount ${transaction.type === 'credit' ? 'positive' : 'negative'}`;
    amount.textContent = `${transaction.type === 'credit' ? '+' : '-'}$${transaction.amount.toFixed(2)}`;

    div.appendChild(info);
    div.appendChild(amount);

    return div;
}

function showTransferModal() {
    const modal = document.getElementById('transferModal');
    modal.style.display = 'flex';
}

function closeTransferModal() {
    const modal = document.getElementById('transferModal');
    modal.style.display = 'none';
}

document.getElementById('transferForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const recipient = document.getElementById('recipient').value;
    const amount = parseFloat(document.getElementById('amount').value);

    const newTransaction = {
        id: transactions.length + 1,
        type: 'debit',
        amount: amount,
        description: `Transfer to ${recipient}`,
        date: new Date().toISOString().split('T')[0]
    };

    transactions.unshift(newTransaction);
    displayTransactions();

    const currentBalance = parseFloat(document.getElementById('balance').textContent.replace(',', ''));
    document.getElementById('balance').textContent = (currentBalance - amount).toLocaleString();

    closeTransferModal();
    this.reset();
});

window.onclick = function(event) {
    const modal = document.getElementById('transferModal');
    if (event.target === modal) {
        closeTransferModal();
    }
}

function initializeCharts() {
    const balanceChart = new TikzChart(document.getElementById('balanceChart'));
    balanceChart.drawBalanceChart([
        { value: 5000, date: 'Jan' },
        { value: 5500, date: 'Feb' },
        { value: 4800, date: 'Mar' },
        { value: 5234.56, date: 'Apr' }
    ]);

    const transactionPie = new TikzChart(document.getElementById('transactionPie'));
    transactionPie.drawTransactionPie([
        { percentage: 40, color: '#2563eb', label: 'Income' },
        { percentage: 35, color: '#ef4444', label: 'Expenses' },
        { percentage: 25, color: '#10b981', label: 'Savings' }
    ]);

    const riskMatrix = new TikzChart(document.getElementById('riskMatrix'));
    riskMatrix.drawRiskMatrix([
        { label: 'High', color: '#ef4444' },
        { label: 'Med', color: '#f59e0b' },
        { label: 'Low', color: '#10b981' },
        { label: 'High', color: '#2563eb' },
        { label: 'Med', color: '#6366f1' },
        { label: 'Low', color: '#8b5cf6' },
        { label: 'P1', color: '#ec4899' },
        { label: 'P2', color: '#14b8a6' },
        { label: 'P3', color: '#84cc16' }
    ]);
}

function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    } else {
        document.getElementById('main-section').style.display = 'block';
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });
}

function showHistory() {
    const historyModal = document.getElementById('historyModal');
    historyModal.style.display = 'flex';
    
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    transactions.forEach(transaction => {
        const historyItem = createTransactionElement(transaction);
        historyList.appendChild(historyItem);
    });
}

function showAccountDetails() {
    const accountDetails = {
        accountNumber: '1234-5678-9012-3456',
        accountType: 'Savings Account',
        interestRate: '2.5%',
        openDate: '2023-01-01'
    };
    
    document.getElementById('accountNumber').textContent = accountDetails.accountNumber;
    document.getElementById('accountType').textContent = accountDetails.accountType;
    document.getElementById('interestRate').textContent = accountDetails.interestRate;
    document.getElementById('openDate').textContent = accountDetails.openDate;
}

function updateProfile(e) {
    e.preventDefault();
    const form = e.target;
    alert('Profile updated successfully!');
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!navbar.contains(e.target) || e.target.closest('.nav-links a')) {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active');
    }
}); 
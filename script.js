// Data for the Wallet
let walletData = {
    currencies: [
        { code: 'USD', name: 'US Dollar', amount: 5247.32, icon: '$', color: '#4caf50' },
        { code: 'EUR', name: 'Euro', amount: 3200.00, icon: '€', color: '#2196f3' },
        { code: 'GBP', name: 'British Pound', amount: 1500.00, icon: '£', color: '#9c27b0' },
        { code: 'BTC', name: 'Bitcoin', amount: 0.15, icon: '₿', color: '#ff9800' },
        { code: 'ETH', name: 'Ethereum', amount: 10.25, icon: 'Ξ', color: '#607d8b' },
        { code: 'ADA', name: 'Cardano', amount: 5000, icon: 'A', color: '#00bcd4' }
    ],

    transactions: [
        { type: 'received', currency: 'BTC', amount: 0.05, from: 'john@email.com', date: '2024-01-15', icon: '₿', color: '#ff9800' },
        { type: 'sent', currency: 'USD', amount: 300, to: 'henry@email.com', date: '2024-01-14', icon: '$', color: '#4caf50' },
        { type: 'exchange', fromCurrency: 'EUR', toCurrency: 'USD', amount: 700, date: '2024-01-13', icon: '⇄', color: '#2196f3' },
        { type: 'received', currency: 'ETH', amount: 1.2, from: 'anselm@email.com', date: '2024-01-12', icon: 'Ξ', color: '#607d8b' },
    ]
};

// Mock data of exchange rates
const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    BTC: 100000,
    ETH: 2500,
    ADA: 0.5
};

// Render currencies
function renderCurrencies() {
    const grid = document.getElementById('currenciesGrid');
    grid.innerHTML = '';

    walletData.currencies.forEach(currency => {
        const usdValue = currency.amount * exchangeRates[currency.code];
        const card = document.createElement('div');
        card.className = 'currency-card';
        card.innerHTML = `
             <div class="currency-header">
                  <div class="currency-icon" style="background-color: ${currency.color}20; color: ${currency.color};">
                     ${currency.icon}
                   </div>
                   <div class="currency-name">${currency.name}</div>
             </div>
             <div class="currency-amount">${currency.amount.toFixed(currency.code === 'BTC' || currency.code === 'ETH' ? 4 : 2)} ${currency.code}</div>
             <div class="currency-usd">≈ ${usdValue.toFixed(2)} USD</div>
        `;
        grid.appendChild(card);
    });
}

// Render transactions
function renderTransactions() {
    const list = document.getElementById('transactionsList');
    list.innerHTML = '';

    walletData.transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';

        let title, subtitle, amountClass, amountText;

        if (transaction.type === 'received') {
            title = `Received ${transaction.currency}`;
            subtitle = `From ${transaction.from}`;
            amountClass = 'positive';
            amountText = `+${transaction.amount} ${transaction.currency}`;
        } else if (transaction.type === 'sent') {
            title = `Sent ${transaction.currency}`;
            subtitle = `To ${transaction.to}`;
            amountClass = 'negative';
            amountText = `-${transaction.amount} ${transaction.currency}`;
        } else if (transaction.type === 'exchange') {
            title = `Exchange`;
            subtitle = `${transaction.fromCurrency} → ${transaction.toCurrency}`;
            amountClass = 'positive';
            amountText = `${transaction.amount} ${transaction.fromCurrency}`;
        }

        item.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-icon" style="background-color: ${transaction.color}20; color: ${transaction.color};">
                     ${transaction.icon}
                </div>
                <div class="transaction-details">
                   <h4>${title}</h4>
                   <p>${subtitle}. ${transaction.date}</p>
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountText}
            </div>
        `;

        list.appendChild(item);
    });
}

// Populate dropdowns
function populateDropdowns() {
    const selects = ['sendCurrency', 'receiveCurrency', 'fromCurrency', 'toCurrency'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '<option value="">Select Currency</option>';
        walletData.currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.name} (${currency.code})`;
            select.appendChild(option);
        });
    });
}

// Calculate total balance
function calculateBalance() {
    let total = 0;
    walletData.currencies.forEach(currency => {
        total += currency.amount * exchangeRates[currency.code];
    });
    document.getElementById('totalBalance').textContent = `$${total.toFixed(2)}`;
}

// Open modal
function openModal(type) {
    document.getElementById(type + 'Modal').style.display = 'block';
}

// Close modal
function closeModal(type) {
    document.getElementById(type + 'Modal').style.display = 'none';
}

// Copy wallet address
function copyAddress() {
    const addressInput = document.getElementById('walletAddress');
    addressInput.select();
    document.execCommand('copy');
    alert('Wallet address copied to clipboard');
}

// Send form handler
document.getElementById('sendForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const currency = document.getElementById('sendCurrency').value;
    const amount = parseFloat(document.getElementById('sendAmount').value);
    const to = document.getElementById('sendTo').value;

    const currencyData = walletData.currencies.find(c => c.code === currency);
    if (currencyData && currencyData.amount >= amount) {
        currencyData.amount -= amount;

        walletData.transactions.unshift({
            type: 'sent',
            currency: currency,
            amount: amount,
            to: to,
            date: new Date().toISOString().split('T')[0],
            icon: currencyData.icon,
            color: currencyData.color
        });

        renderCurrencies();
        renderTransactions();
        calculateBalance();
        closeModal('send');
        this.reset();
        alert('Money successfully sent!');
    } else {
        alert('Insufficient Balance');
    }
});

// Exchange form handler
document.getElementById('exchangeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amount = parseFloat(document.getElementById('exchangeAmount').value);

    const fromCurrencyData = walletData.currencies.find(c => c.code === fromCurrency);
    const toCurrencyData = walletData.currencies.find(c => c.code === toCurrency);

    if (fromCurrencyData && toCurrencyData && fromCurrencyData.amount >= amount) {
        const exchangeAmount = (amount * exchangeRates[fromCurrency]) / exchangeRates[toCurrency];

        fromCurrencyData.amount -= amount;
        toCurrencyData.amount += exchangeAmount;

        walletData.transactions.unshift({
            type: 'exchange',
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            icon: '⇄',
            color: '#2196f3'
        });

        renderCurrencies();
        renderTransactions();
        calculateBalance();
        closeModal('exchange');
        this.reset();
        alert(`Successfully exchanged ${amount} ${fromCurrency} to ${exchangeAmount.toFixed(4)} ${toCurrency}`);
    } else {
        alert('Insufficient balance');
    }
});

// Close modals when clicking outside
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Initializing
renderCurrencies();
renderTransactions();
populateDropdowns();
calculateBalance();

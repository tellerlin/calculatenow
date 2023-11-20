document.addEventListener('DOMContentLoaded', function () {
    const loanAmountInput = document.getElementById('principal');
    const interestRateInput = document.getElementById('rate');
    const loanTermInput = document.getElementById('years');
    const calculateBtn = document.getElementById('calculateButton');
    const paymentResult = document.getElementById('monthlyPayment');
  
    loanAmountInput.focus();
  
    calculateBtn.addEventListener('click', function () {
        calculateAndDisplayPayment();
    });
  
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            calculateAndDisplayPayment();
        }
    });
  
    function getAndValidateInput() {
        const principal = parseFloat(loanAmountInput.value);
        const rate = parseFloat(interestRateInput.value) / 100 / 12;
        const term = parseFloat(loanTermInput.value);
  
        if (isNaN(principal) || isNaN(rate) || isNaN(term) || principal <= 0 || rate <= 0 || term <= 0) {
            return { valid: false, message: 'Please enter valid positive values for loan amount, interest rate, and loan term.' };
        }
        return { valid: true, values: { principal, rate, term } };
    }
  
    function calculatePayment(principal, rate, term) {
        const numPayments = term * 12;
        if (rate === 0) {
            return principal / numPayments;
        } else {
            return (principal * rate) / (1 - Math.pow(1 + rate, -numPayments));
        }
    }
  
    function displayResult(monthlyPayment) {
        paymentResult.innerText = 'Monthly Payment: $' + monthlyPayment.toFixed(2);
    }
  
    function clearResult() {
        paymentResult.innerText = 'Your monthly payment will be displayed here.';
    }
  
    function calculateAndDisplayPayment() {
        clearResult();
        const { valid, values } = getAndValidateInput();
        if (!valid) {
            paymentResult.innerText = 'Error: ' + values.message;
        } else {
            const monthlyPayment = calculatePayment(values.principal, values.rate, values.term);
            displayResult(monthlyPayment);
        }
    }
  });
  
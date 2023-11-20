document.addEventListener('DOMContentLoaded', function () {
    const billAmountInput = document.getElementById('billAmount');
    const tipPercentageInput = document.getElementById('tipPercentage');
    const peopleCountInput = document.getElementById('peopleCount');
    const tipResult = document.getElementById('tipResult');
    const calculateBtn = document.getElementById('calculateButton');

    // 动态生成下拉列表选项
    for (let i = 1; i <= 50; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = `${i}%`;
        if (i === 15) option.selected = true;
        tipPercentageInput.appendChild(option);
    }

    for (let i = 1; i <= 100; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        if (i === 1) option.selected = true;
        peopleCountInput.appendChild(option);
    }

    billAmountInput.addEventListener('input', autoCalculateTip);
    billAmountInput.addEventListener('change', autoCalculateTip);
    billAmountInput.addEventListener('touchend', autoCalculateTip);
    tipPercentageInput.addEventListener('input', autoCalculateTip);
    tipPercentageInput.addEventListener('change', autoCalculateTip);
    tipPercentageInput.addEventListener('touchend', autoCalculateTip);
    peopleCountInput.addEventListener('input', autoCalculateTip);
    peopleCountInput.addEventListener('change', autoCalculateTip);
    peopleCountInput.addEventListener('touchend', autoCalculateTip);

    calculateBtn.addEventListener('click', autoCalculateTip);

    function calculateTip(billAmount, tipPercentage) {
        return billAmount * (tipPercentage / 100);
    }

    function displayResult(tipAmount, totalAmount, tipPerPerson, totalPerPerson) {
        const decimals = 2;
        let resultHTML = `
            <p>Total Tip: $${tipAmount.toFixed(decimals)}</p>
            <p>Total Amount: $${totalAmount.toFixed(decimals)}</p>
        `;

        if (peopleCountInput.value > 1) {
            resultHTML += `
                <p>Tip Per Person: $${tipPerPerson.toFixed(decimals)}</p>
                <p>Total Per Person: $${totalPerPerson.toFixed(decimals)}</p>
            `;
        }

        tipResult.innerHTML = resultHTML;
    }

    function autoCalculateTip() {
        clearResult();
        const { valid, values } = getAndValidateInput();
        if (valid) {
            const { billAmount, tipPercentage, peopleCount } = values;
            const tipAmount = calculateTip(billAmount, tipPercentage);
            const totalAmount = billAmount + tipAmount;
            const tipPerPerson = tipAmount / peopleCount;
            const totalPerPerson = totalAmount / peopleCount;
            displayResult(tipAmount, totalAmount, tipPerPerson, totalPerPerson);
        }
    }

    function getAndValidateInput() {
        const billAmount = parseFloat(billAmountInput.value);
        const tipPercentage = tipPercentageInput.value;
        const peopleCount = peopleCountInput.value;

        if (isNaN(billAmount) || billAmount <= 0 || isNaN(tipPercentage) || tipPercentage < 1 || isNaN(peopleCount) || peopleCount < 1) {
            return { valid: false, message: 'Please enter valid positive values for bill amount, tip percentage, and people count.' };
        }
        return { valid: true, values: { billAmount, tipPercentage, peopleCount } };
    }

    function clearResult() {
        tipResult.innerHTML = '';
    }
});

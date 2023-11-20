let bmiPercentiles = {};

function loadBMIPercentiles() {
    fetch('bmiPercentiles.json')
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            bmiPercentiles = data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function handleFormSubmit() {
    const unit = document.querySelector('input[name="unit"]:checked').value;
    const ageYears = parseInt(document.getElementById('ageYears').value);
    const ageMonths = parseInt(document.getElementById('ageMonths').value);
    const totalMonths = ageYears * 12 + ageMonths;
    const isChild = totalMonths < 240; // 20年 * 12个月

    let height, weight, bmi;

    if (unit === 'metric') {
        height = document.getElementById('heightMetric').value / 100; // 米
        weight = document.getElementById('weightMetric').value; // 公斤
    } else {
        const heightFeet = parseInt(document.getElementById('heightImperialFeet').value);
        const heightInches = parseInt(document.getElementById('heightImperialInches').value);
        height = (heightFeet * 12) + heightInches; // 英寸
        weight = parseInt(document.getElementById('weightImperial').value); // 磅
    }

    bmi = calculateBMI(weight, height, unit);
    let healthAdvice = isChild ? getChildBMIAdvice(bmi, totalMonths) : getAdultBMIAdvice(bmi);

    document.getElementById('result').innerText = `Your BMI is: ${bmi}`;
    document.getElementById('health-advice').innerText = healthAdvice;

    const progressBar = document.getElementById('bmi-progress-bar');
    const color = getBMIProgressColor(bmi, isChild, totalMonths);
    updateProgressBar(progressBar, bmi, color);
}

function calculateBMI(weight, height, unit) {
    if (unit === 'metric') {
        return (weight / (height * height)).toFixed(2);
    } else {
        return (weight / (height * height) * 703).toFixed(2);
    }
}

function getChildBMIAdvice(bmi, age, unit) {
    const ageInMonths = age * 12;

    let closestAgeData = bmiPercentiles.reduce((prev, curr) => {
        return (Math.abs(curr.Age - ageInMonths) < Math.abs(prev.Age - ageInMonths) ? curr : prev);
    });

    if (bmi < closestAgeData['25%']) {
        return 'Underweight';
    } else if (bmi >= closestAgeData['20%'] && bmi <= closestAgeData['75%']) {
        return 'Healthy Weight';
    } else if (bmi > closestAgeData['75%'] && bmi <= closestAgeData['97%']) {
        return 'Overweight';
    } else {
        return 'Obesity';
    }
}

function getAdultBMIAdvice(bmi) {
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        return 'Healthy Weight';
    } else if (bmi >= 25 && bmi <= 29.9) {
        return 'Overweight';
    } else {
        return 'Obesity';
    }
}

function getBMIProgressColor(bmi, isChild, age) {
    if (isChild) {
        const ageInMonths = age * 12;

        let closestAgeData = bmiPercentiles.reduce((prev, curr) => {
            return (Math.abs(curr.Age - ageInMonths) < Math.abs(prev.Age - ageInMonths) ? curr : prev);
        });

        if (bmi < closestAgeData['25%']) {
            return 'blue';
        } else if (bmi >= closestAgeData['20%'] && bmi <= closestAgeData['75%']) {
            return 'green';
        } else if (bmi > closestAgeData['75%'] && bmi <= closestAgeData['97%']) {
            return 'orange';
        } else {
            return 'red';
        }
    } else {
        return bmi < 18.5 ? 'blue' : bmi <= 24.9 ? 'green' : bmi <= 29.9 ? 'orange' : 'red';
    }
}

function updateProgressBar(progressBar, bmi, color) {
    progressBar.style.width = `${Math.min(bmi, 100)}%`;
    progressBar.style.backgroundColor = color;
}

document.querySelectorAll('input[name="unit"]').forEach(function(radio) {
    radio.addEventListener('change', function(e) {
        updateUnitDisplay(e.target.value);
        fillSelectOptions(e.target.value);
    });
});

function updateUnitDisplay(selectedUnit) {
    const metricInputs = document.getElementById('metricInputs');
    const imperialInputs = document.getElementById('imperialInputs');

    metricInputs.style.display = selectedUnit === 'metric' ? 'block' : 'none';
    imperialInputs.style.display = selectedUnit === 'imperial' ? 'block' : 'none';
}

function fillSelectOptions(unit) {
    if (unit === 'metric') {
        fillHeightOptions('heightMetric', 91, 245, 165);
        fillWeightOptions('weightMetric', 36, 200, 65);
    } else {
        fillHeightOptions('heightImperialFeet', 3, 8, 5);
        fillHeightOptions('heightImperialInches', 0, 11, 5);
        fillWeightOptions('weightImperial', 80, 440, 143);
    }
}

function fillHeightOptions(elementId, min, max, defaultValue) {
    const select = document.getElementById(elementId);
    select.innerHTML = '';
    for (let i = min; i <= max; i++) {
        select.options.add(new Option(i, i, i === defaultValue, i === defaultValue));
    }
}

function fillWeightOptions(elementId, min, max, defaultValue) {
    const select = document.getElementById(elementId);
    select.innerHTML = '';
    for (let i = min; i <= max; i++) {
        select.options.add(new Option(i, i, i === defaultValue, i === defaultValue));
    }
}

window.onload = function() {
    loadBMIPercentiles();
    updateUnitDisplay('imperial');
    fillSelectOptions('imperial');
    document.getElementById('bmiForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit();
    });
};

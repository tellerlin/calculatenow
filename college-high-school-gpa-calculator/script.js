document.addEventListener('DOMContentLoaded', function () {
    // 初始化三门课程
    for (let i = 0; i < 3; i++) {
        addCourse();
    }
    document.getElementById('add-course-btn').addEventListener('click', addCourse);

    // GPA 系统选择器变更时更新课程
    var gpaSelector = document.getElementById('gpa-system-selector');
    gpaSelector.addEventListener('change', updateCourses);
});

var gpaSystems = {
    '4.0': { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
    '4.3': { 'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
    '5.0': { 'A': 5.0, 'A-': 4.7, 'B+': 4.3, 'B': 4.0, 'B-': 3.7, 'C+': 3.3, 'C': 3.0, 'C-': 2.7, 'D+': 2.3, 'D': 2.0, 'F': 0.0 }
};

function addCourse() {
    var container = document.getElementById('courses-container');
    var gradesOptions = getGradeOptions();

    var courseHTML = `
        <div class="course">
            <div class="course-row">
                <select class="grade">
                    <option value="">Select Grade</option>
                    ${gradesOptions}
                </select>
                <input type="number" placeholder="Credits" class="credits">
                <button class="delete-course-btn">Delete</button>
            </div>
        </div>`;
    container.insertAdjacentHTML('beforeend', courseHTML);
    setupCourseListeners(container.lastElementChild);
}

function setupCourseListeners(courseElement) {
    var gradeSelect = courseElement.querySelector('.grade');
    var creditsInput = courseElement.querySelector('.credits');
    var deleteButton = courseElement.querySelector('.delete-course-btn');

    gradeSelect.addEventListener('change', function() {
        calculateGPA();
    });
    creditsInput.addEventListener('input', function() {
        calculateGPA();
    });
    deleteButton.addEventListener('click', function() {
        courseElement.remove();
        calculateGPA();
    });
}

function getGradeOptions() {
    var selectedSystem = document.getElementById('gpa-system-selector').value;
    return Object.keys(gpaSystems[selectedSystem]).map(function (grade) {
        return '<option value="' + grade + '">' + grade + '</option>';
    }).join('');
}

function calculateGPA() {
    var selectedSystem = document.getElementById('gpa-system-selector').value;
    var gradePointsMap = gpaSystems[selectedSystem];
    var courses = document.querySelectorAll('.course');
    var totalGradePoints = 0;
    var totalCredits = 0;

    courses.forEach(function (course) {
        var gradeSelect = course.querySelector('.grade');
        var creditsInput = course.querySelector('.credits');
        var grade = gradeSelect.value;
        var credits = parseFloat(creditsInput.value);

        if (grade && credits > 0) {
            totalGradePoints += gradePointsMap[grade] * credits;
            totalCredits += credits;
        }
    });

    var gpaResult = document.getElementById('gpa-result');
    if (totalCredits > 0) {
        var gpa = totalGradePoints / totalCredits;
        gpaResult.textContent = 'Calculated GPA: ' + gpa.toFixed(2);
    } else {
        gpaResult.textContent = '';
    }
}

function updateCourses() {
    var coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        addCourse();
    }
}

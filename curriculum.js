const totalCourses = 74;
let completedCourses = 0;

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('mathProgress');
    if (saved) {
        const completed = JSON.parse(saved);
        completed.forEach(index => {
            const buttons = document.querySelectorAll('.btn-complete');
            if (buttons[index]) {
                buttons[index].classList.add('completed');
                buttons[index].textContent = '✓ completed';
            }
        });
        completedCourses = completed.length;
        updateProgress();
    }
}

// Toggle complete status
function toggleComplete(button) {
    button.classList.toggle('completed');
    if (button.classList.contains('completed')) {
        button.textContent = '✓ completed';
        completedCourses++;
    } else {
        button.textContent = 'mark complete';
        completedCourses--;
    }
    updateProgress();
    saveProgress();
}

// Update progress display
function updateProgress() {
    const percent = Math.round((completedCourses / totalCourses) * 100);
    document.getElementById('progressCount').textContent = `${completedCourses}/${totalCourses}`;
    document.getElementById('progressPercent').textContent = percent;
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('footerProgress').textContent = `${completedCourses}/${totalCourses} courses (${percent}%)`;
}

// Save progress to localStorage
function saveProgress() {
    const completed = [];
    document.querySelectorAll('.btn-complete').forEach((btn, index) => {
        if (btn.classList.contains('completed')) {
            completed.push(index);
        }
    });
    localStorage.setItem('mathProgress', JSON.stringify(completed));
}

// Search functionality
document.getElementById('searchBox').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const courses = document.querySelectorAll('.course-item');
    const sections = document.querySelectorAll('.level-section');

    sections.forEach(section => {
        let hasVisibleCourse = false;
        const coursesInSection = section.querySelectorAll('.course-item');

        coursesInSection.forEach(course => {
            const title = course.querySelector('.course-title').textContent.toLowerCase();
            const description = course.querySelector('.course-description').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                course.style.display = 'block';
                hasVisibleCourse = true;
            } else {
                course.style.display = 'none';
            }
        });

        section.style.display = hasVisibleCourse ? 'block' : 'none';
    });
});

// Load progress on page load
loadProgress();
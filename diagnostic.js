let currentQuestion = 1;
const totalQuestions = 10;
let answers = [];
let selectedOption = null;

// Level descriptions
const levelInfo = {
    1: {
        title: "early counting & numbers",
        description: "Perfect! We recommend starting with the fundamentals of counting and number recognition.",
        topics: "counting 1-100, number recognition, comparing quantities, basic shapes",
        link: "#elementary"
    },
    2: {
        title: "addition & subtraction basics",
        description: "Great! You're ready to work on addition and subtraction within 20.",
        topics: "addition within 20, subtraction within 20, word problems, place value",
        link: "#elementary"
    },
    3: {
        title: "multiplication & division intro",
        description: "Excellent! You're ready to explore multiplication and division concepts.",
        topics: "skip counting, intro to multiplication, place value to 1000, money and graphs",
        link: "#elementary"
    },
    4: {
        title: "mastering operations",
        description: "Well done! You're ready to master all four operations and fractions.",
        topics: "multiplication tables, division basics, fractions introduction, area & perimeter",
        link: "#middle"
    },
    5: {
        title: "fractions & decimals",
        description: "Impressive! You're ready to dive deep into fractions and decimals.",
        topics: "equivalent fractions, decimals basics, multi-digit operations, geometry",
        link: "#middle"
    },
    6: {
        title: "advanced fractions & volume",
        description: "Outstanding! You're ready for operations with fractions and spatial concepts.",
        topics: "adding/subtracting fractions, multiplying fractions, volume, coordinate plane",
        link: "#middle"
    },
    7: {
        title: "ratios, rates & negative numbers",
        description: "Fantastic! You're ready to work with ratios, rates, and negative numbers.",
        topics: "ratios & proportions, percentages, negative numbers, expressions & equations",
        link: "#high"
    },
    8: {
        title: "pre-algebra",
        description: "Excellent work! You're ready to tackle pre-algebra concepts.",
        topics: "linear equations, inequalities, proportional relationships, probability",
        link: "#high"
    },
    9: {
        title: "algebra 1",
        description: "Great job! You're ready for algebra 1 and linear functions.",
        topics: "linear functions, systems of equations, exponents & radicals, quadratics",
        link: "#high"
    },
    10: {
        title: "geometry & trigonometry",
        description: "Impressive! You're ready for geometry and trigonometry.",
        topics: "congruence & similarity, circles, right triangle trig, proofs",
        link: "#college"
    },
    11: {
        title: "algebra 2 & statistics",
        description: "Outstanding! You're ready for advanced algebra and statistics.",
        topics: "quadratic functions, polynomials, exponential & logarithmic functions",
        link: "#college"
    },
    12: {
        title: "pre-calculus & calculus",
        description: "Excellent! You're ready to begin calculus.",
        topics: "limits & continuity, derivatives, integrals, differential equations",
        link: "#college"
    }
};

// Handle option selection
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
        const questionSection = this.closest('.question-section');
        questionSection.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
        selectedOption = this;
        document.getElementById('nextBtn').disabled = false;
    });
});

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function nextQuestion() {
    if (!selectedOption) return;

    // Store answer
    const level = parseInt(selectedOption.getAttribute('data-level'));
    const isCorrect = selectedOption.getAttribute('data-answer') === 'correct';
    answers.push({ level: level, correct: isCorrect });

    if (currentQuestion < totalQuestions) {
        // Hide current question
        document.querySelector(`.question-section[data-question="${currentQuestion}"]`).classList.remove('active');

        // Show next question
        currentQuestion++;
        document.querySelector(`.question-section[data-question="${currentQuestion}"]`).classList.add('active');

        // Update progress
        updateProgress();

        // Reset selection
        selectedOption = null;
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('prevBtn').disabled = false;
    } else {
        // Show results
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        document.querySelector(`.question-section[data-question="${currentQuestion}"]`).classList.remove('active');
        currentQuestion--;
        document.querySelector(`.question-section[data-question="${currentQuestion}"]`).classList.add('active');
        updateProgress();

        // Remove last answer
        answers.pop();
        selectedOption = null;
        document.getElementById('nextBtn').disabled = true;

        if (currentQuestion === 1) {
            document.getElementById('prevBtn').disabled = true;
        }
    }
}

function showResults() {
    // Hide navigation buttons
    document.getElementById('navButtons').style.display = 'none';

    // Calculate recommended level
    let recommendedLevel = 1;
    let correctCount = 0;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].correct) {
            correctCount++;
            recommendedLevel = Math.max(recommendedLevel, answers[i].level);
        } else {
            // If they got a question wrong, recommend starting from that level
            break;
        }
    }

    // If they got less than 5 correct, recommend starting lower
    if (correctCount < 5) {
        recommendedLevel = Math.max(1, Math.floor(recommendedLevel / 2));
    }

    // Display results
    const info = levelInfo[recommendedLevel];
    document.getElementById('levelBadge').textContent = `level ${recommendedLevel}`;
    document.getElementById('recommendationTitle').textContent = info.title;
    document.getElementById('recommendationText').textContent = info.description;
    document.getElementById('topicsText').textContent = info.topics;
    document.getElementById('curriculumLink').href = `curriculum.html${info.link}`;

    document.getElementById('results').classList.add('active');
}

// Initialize progress bar
updateProgress();

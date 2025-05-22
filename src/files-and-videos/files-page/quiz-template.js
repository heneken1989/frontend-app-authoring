// Quiz template for fill-in-the-blank questions
export const getQuizTemplate = (paragraphText, correctAnswers) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fill in the Blank Quiz</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
        }
        .quiz-container {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .blank-input {
            width: 150px;
            padding: 5px;
            margin: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            display: inline-block;
        }
        button {
            background-color: #0075b4;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }
        button:hover {
            background-color: #005587;
        }
        .feedback {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
            display: none;
        }
        .correct {
            background-color: #dff0d8;
            color: #3c763d;
            border: 1px solid #3c763d;
        }
        .incorrect {
            background-color: #f2dede;
            color: #a94442;
            border: 1px solid #a94442;
        }
    </style>
</head>
<body>
    <div class="quiz-container">
        <div id="quiz-text"></div>
        <button onclick="checkAnswers()">Submit</button>
        <div id="feedback" class="feedback"></div>
    </div>

    <script>
        // Store quiz data
        const quizText = "${paragraphText}";
        const correctAnswers = ${correctAnswers};
        
        // Initialize state
        let state = {
            answer: '',
            score: 0,
            attempts: 0,
            showAnswer: false
        };

        // Initialize the quiz
        function initializeQuiz() {
            const quizTextDiv = document.getElementById('quiz-text');
            let blankCount = 0;
            
            // Replace {{blank}} with input fields
            const formattedText = quizText.replace(/\\{\\{blank\\}\\}/g, () => {
                blankCount++;
                return '<input type="text" id="blank' + blankCount + '" class="blank-input" placeholder="Enter answer">';
            });
            
            quizTextDiv.innerHTML = formattedText;
        }

        // Check answers and update state
        function checkAnswers() {
            const inputs = document.querySelectorAll('.blank-input');
            const feedback = document.getElementById('feedback');
            let answers = {};
            let correctCount = 0;
            const totalQuestions = inputs.length;

            inputs.forEach((input, index) => {
                const blankId = 'blank' + (index + 1);
                const userAnswer = input.value.trim().toLowerCase();
                const correctAnswer = correctAnswers[blankId].toLowerCase();
                answers[blankId] = userAnswer;

                if (userAnswer === correctAnswer) {
                    input.style.borderColor = '#3c763d';
                    input.style.backgroundColor = '#dff0d8';
                    correctCount++;
                } else {
                    input.style.borderColor = '#a94442';
                    input.style.backgroundColor = '#f2dede';
                }
            });

            // Update state
            state.score = correctCount / totalQuestions;
            state.answer = JSON.stringify(answers);
            state.attempts += 1;

            // Show feedback
            feedback.className = 'feedback ' + (correctCount === totalQuestions ? 'correct' : 'incorrect');
            feedback.textContent = \`Score: \${correctCount} out of \${totalQuestions}\`;
            feedback.style.display = 'block';
        }

        // EdX integration functions
        window.QuizApp = {
            getGrade: function() {
                return JSON.stringify({
                    score: state.score,
                    correct: state.score >= 0.99
                });
            },
            getState: function() {
                return JSON.stringify(state);
            },
            setState: function(stateStr) {
                try {
                    const newState = JSON.parse(stateStr);
                    state = {
                        answer: newState.answer || '',
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
                    };

                    // Restore answers if they exist
                    if (state.answer) {
                        const answers = JSON.parse(state.answer);
                        Object.entries(answers).forEach(([id, value]) => {
                            const input = document.getElementById(id);
                            if (input) {
                                input.value = value;
                            }
                        });
                    }
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }
        };

        // Initialize when page loads
        window.onload = initializeQuiz;
    </script>
</body>
</html>`; 
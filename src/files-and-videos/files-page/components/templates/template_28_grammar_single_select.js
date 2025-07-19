export const grammarSingleSelectTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Grammar Single Select Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #414141;
            height: auto;
            position: relative;
            overflow-y: hidden;
        }
        .container {
            position: relative;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 1rem;
        }
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .instructions {
            font-size: 1.1rem;
            line-height: 1.5;
            color: #333;
            font-weight: bold;
            font-style: italic;
            margin: 0;
        }
        .question-text {
            font-size: 1.2rem;
            padding: 5px;
            color: #333;
            font-weight: bold;
            margin: 0;
        }
        .options-container {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            background: transparent;
            max-width: 600px;
        }
        .option-button {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            max-width: 100%;
            padding: 8px 8px 8px 32px;
            border: none;
            outline: none;
            background: transparent;
            font-size: 1.1rem;
            cursor: pointer;
            text-align: left;
            line-height: 1.4;
            min-height: 24px;
            display: flex;
            align-items: flex-start;
            position: relative;
            color: #333;
            font-weight: normal;
        }
        .option-button::before {
            content: '';
            position: absolute;
            left: 4px;
            top: 8px;
            width: 16px;
            height: 16px;
            border: 1px solid #666;
            background: white;
            border-radius: 2px;
        }
        .option-button:hover {
            background-color: #f8f9fa;
        }
        .option-button.selected::before {
            background: #0075b4;
            border-color: #0075b4;
        }
        .option-button.selected::after {
            content: '✓';
            position: absolute;
            left: 7px;
            top: 8px;
            font-size: 12px;
            color: white;
        }
        .option-button.correct::before {
            background: #2e7d32;
            border-color: #2e7d32;
        }
        .option-button.correct::after {
            content: '✓';
            position: absolute;
            left: 7px;
            top: 8px;
            font-size: 12px;
            color: white;
        }
        .option-button.incorrect::before {
            background: #b40000;
            border-color: #b40000;
        }
        .option-button.incorrect::after {
            content: '✗';
            position: absolute;
            left: 7px;
            top: 8px;
            font-size: 12px;
            color: white;
        }
        #feedback {
            margin: 1rem 0;
            padding: 1rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1.2rem;
        }
        .success {
            color: #2e7d32;
        }
        .error {
            color: #b40000;
        }
        .answer-feedback {
            margin-top: 0.5rem;
            font-size: 1.0rem;
        }
        .answer-feedback span {
            display: block;
            margin: 0.25rem 0;
            padding: 0.25rem;
            border-radius: 3px;
        }
        .correct {
            color: #2e7d32;
        }
        .incorrect {
            color: #b40000;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
        }
        .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
        }
        .answer-paragraph-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0;
            background-color: rgba(99, 97, 97, 0.95);
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
            display: none;
            z-index: 2;
            transition: transform 0.3s ease;
            max-height: 460px;
            overflow-y: auto;
        }
        .answer-paragraph-inner {
            max-width: 90%;
            margin: 0 auto;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            max-height: 400px;
            overflow-y: auto;
            padding: 1.5rem;
        }
        .explanation-section {
            margin-bottom: 1.5rem;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            overflow-y: auto;
            padding: 1rem;
        }
        .explanation-title {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
            text-align: center;
        }
        .explanation-text {
            line-height: 1.5;
            margin-bottom: 1rem;
            white-space: pre-wrap;
        }
        .score-display {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
        }
        .answer-paragraph {
            margin: 0;
            background-color: white;
            line-height: 1.5;
            display: block;
            box-shadow: none;
            border-radius: 3px;
            font-size: 1rem;
            border: 1px solid #e0e0e0;
            overflow-y: auto;
            max-height: 200px;
            padding: 1rem;
        }
        .explanation-highlight {
            color: #b40000;
            font-weight: normal;
        }
        .no-answer {
            color: #666;
            padding: 0 4px;
            margin: 0 2px;
        }
        .select-answer-header {
            font-size: 1rem;
            color: #333;
            margin: 0;
            padding: 5px 0;
            font-weight: bold;
        }
        @media (max-width: 768px) {
            .container {
                padding: 15px;
                gap: 15px;
            }
            .content-wrapper {
                gap: 15px;
            }
            .options-container {
                width: 100%;
            }
            .option-button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content-wrapper">
            <div class="instructions" id="quiz-instructions">
                {{INSTRUCTIONS}}
            </div>
            <div class="question-text">{{QUESTION_TEXT}}</div>
            
            <form id="quizForm" onsubmit="return false;">
                <div class="options-container" id="options-container">
                    <div class="select-answer-header">Please Select Answer</div>
                    {{OPTIONS}}
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
            </form>
        </div>
        
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div class="explanation-section">
                    <div class="explanation-title">解説</div>
                    <div id="explanation-paragraph" class="explanation-text">{{EXPLANATION_TEXT}}</div>
                </div>
                <div class="your-answer-section">
                    <div class="score-display" id="score-display"></div>
                    <div id="answer-paragraph" class="answer-paragraph"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        (function() {
            var state = {
                answer: '',
                score: 0,
                attempts: 0,
                showAnswer: false
            };

            const correctAnswer = '{{CORRECT_ANSWER}}';
            let selectedOption = null;
            
            function calculateResults() {
                const isCorrect = selectedOption === correctAnswer;
                const answers = { answer: selectedOption || '' };
                
                const rawScore = isCorrect ? 1 : 0;
                const message = selectedOption ? (isCorrect ? '正解です！' : '不正解です。') : '選択してください。';

                state.answer = JSON.stringify(answers);
                state.score = rawScore;
                state.attempts += 1;

                return {
                    rawScore,
                    message,
                    answers,
                    isCorrect
                };
            }

            function updateDisplay(result) {
                const answerParagraph = document.getElementById('answer-paragraph');
                const answerContainer = document.getElementById('answer-paragraph-container');
                const scoreDisplay = document.getElementById('score-display');
                const options = document.querySelectorAll('.option-button');
                
                scoreDisplay.textContent = result.message;
                
                // Update option buttons
                options.forEach(button => {
                    const isSelected = button.dataset.value === selectedOption;
                    const isCorrect = button.dataset.value === correctAnswer;
                    
                    button.classList.remove('selected', 'correct', 'incorrect');
                    
                    if (state.showAnswer) {
                        if (isSelected && !isCorrect) {
                            button.classList.add('incorrect');
                        }
                        if (isCorrect) {
                            button.classList.add('correct');
                        }
                        button.disabled = true;
                    } else {
                        if (isSelected) {
                            button.classList.add('selected');
                        }
                        button.disabled = false;
                    }
                });
                
                // Update answer paragraph
                let answerHtml = '';
                if (selectedOption) {
                    if (result.isCorrect) {
                        answerHtml = '<span class="correct-answer">' + selectedOption + '</span>';
                    } else {
                        answerHtml = '<span class="wrong-answer">' + selectedOption + '</span> ' +
                                   '<span class="correct-answer">' + correctAnswer + '</span>';
                    }
                } else {
                    answerHtml = '<span class="no-answer">選択してください</span>';
                }
                
                answerParagraph.innerHTML = answerHtml;
                
                if (state.showAnswer) {
                    answerContainer.style.display = 'block';
                } else {
                    answerContainer.style.display = 'none';
                }
            }

            function getGrade() {
                const answerContainer = document.getElementById('answer-paragraph-container');
                const showFlag = document.getElementById('showAnswerFlag');
                const isVisible = answerContainer.style.display === 'block';

                if (isVisible) {
                    answerContainer.style.display = 'none';
                    showFlag.value = 'false';
                    state.showAnswer = false;
                } else {
                    const result = calculateResults();
                    updateDisplay(result);
                    answerContainer.style.display = 'block';
                    showFlag.value = 'true';
                    state.showAnswer = true;
                }

                const result = calculateResults();
                return JSON.stringify({
                    edxResult: None,
                    edxScore: result.rawScore,
                    edxMessage: result.message
                });
            }

            function getState() {
                return JSON.stringify(state);
            }

            function setState(stateStr) {
                try {
                    const newState = JSON.parse(stateStr);
                    state = {
                        answer: newState.answer || '',
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
                    };
                    
                    if (state.answer) {
                        try {
                            const answers = JSON.parse(state.answer);
                            selectedOption = answers.answer || '';
                            
                            if (selectedOption) {
                                const button = document.querySelector('.option-button[data-value="' + selectedOption + '"]');
                                if (button) {
                                    button.classList.add('selected');
                                }
                            }

                            const result = calculateResults();
                            updateDisplay(result);
                            
                            document.getElementById('answer-paragraph-container').style.display = 
                                state.showAnswer ? 'block' : 'none';
                            document.getElementById('showAnswerFlag').value = 
                                state.showAnswer ? 'true' : 'false';
                        } catch (e) {
                            console.error('Error parsing answers:', e);
                        }
                    }
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }

            // Set up option button click handlers
            document.querySelectorAll('.option-button').forEach(button => {
                button.addEventListener('click', function() {
                    if (state.showAnswer) return;
                    
                    document.querySelectorAll('.option-button').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    
                    this.classList.add('selected');
                    selectedOption = this.dataset.value;
                });
            });

            // Set up EdX bindings
            if (window.parent !== window) {
                var channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });

                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
            }
        })();
    </script>
</body>
</html>`;

export const getGrammarSingleSelectTemplate = (questionText, optionsString, instructions = '正しい文を選んでください。', explanationText = '') => {
  // Process questionText to underline text in quotes
  const processedQuestionText = questionText.replace(/"([^"]+)"/g, '<span style="text-decoration: underline;">$1</span>');

  // Split options string into array and trim each option
  const options = optionsString.split(',').map(option => option.trim());
  const correctAnswer = options[0]; // First option is the correct answer

  // Create HTML for options
  const optionsHtml = options
    .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
    .map(option => {
      // Process each option to underline text in quotes
      const processedOption = option.replace(/"([^"]+)"/g, '<span style="text-decoration: underline;">$1</span>');
      return `<button type="button" class="option-button" data-value="${option}">${processedOption}</button>`;
    })
    .join('');

  return grammarSingleSelectTemplate
    .replace('{{INSTRUCTIONS}}', instructions)
    .replace('{{QUESTION_TEXT}}', processedQuestionText)
    .replace('{{OPTIONS}}', optionsHtml)
    .replace('{{EXPLANATION_TEXT}}', explanationText)
    .replace('{{CORRECT_ANSWER}}', correctAnswer); // Add this line
}; 
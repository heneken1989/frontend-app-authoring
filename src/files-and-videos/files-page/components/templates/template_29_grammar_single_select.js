export const grammarSingleSelectTemplate29 = `<!DOCTYPE html>
<html>
<head>
    <title>Grammar Single Select Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
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
            padding: 1.5rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .instructions {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            line-height: 1.5;
            color: #333;
            font-weight: bold;
            font-style: italic;
            margin: 0 0 20px 0;
            letter-spacing: 0.3px;
        }
        .question-text {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            padding: 15px 0;
            color: #333;
            font-weight: normal;
            margin: 0;
            line-height: 1.6;
            letter-spacing: 0.4px;
        }
        .answer-section {
            background: transparent;
            border: none;
            border-radius: 8px;
            padding: 15px 0;
            margin: 5px 0;
            box-shadow: none;
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
            padding: 12px 16px;
            border: none;
            outline: none;
            background: transparent;
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            cursor: pointer;
            text-align: left;
            line-height: 1.4;
            min-height: 20px;
            display: flex;
            align-items: baseline;
            justify-content: flex-start;
            position: relative;
            color: #333;
            font-weight: normal;
            border-radius: 4px;
            transition: all 0.3s ease;
            gap: 12px;
        }
        .option-button::before {
            content: '';
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 3px;
            background: white;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }
        .option-button:hover:not(.selected):not(.correct):not(.incorrect) {
            background-color: #f8f9fa;
        }
        .option-button:hover:not(.selected):not(.correct):not(.incorrect)::before {
            border-color: #999;
        }
        .option-button.selected {
            background: transparent;
            border: none;
            color: #333;
        }
        .option-button.selected::before {
            background: #f44336;
            border-color: #f44336;
            content: '✓';
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .option-button.correct {
            background: transparent;
            border: none;
            color: #333;
        }
        .option-button.correct::before {
            background: #4caf50;
            border-color: #4caf50;
            content: '✓';
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .option-button.incorrect {
            background: transparent;
            border: none;
            color: #333;
        }
        .option-button.incorrect::before {
            background: #f44336;
            border-color: #f44336;
            content: '✓';
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
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
        .select-answer-header {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            color: #333;
            margin: 0 0 10px 0;
            padding: 5px 0;
            font-weight: bold;
            text-align: left;
        }
        
        /* Furigana styling */
        ruby {
            font-size: 1em;
        }
        
        rt {
            font-size: 0.6em;
            color: #666;
        }
        @media (max-width: 1024px) {
            .options-container {
                max-width: 500px;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
                gap: 10px;
            }
            .content-wrapper {
                gap: 8px;
            }
            .answer-section {
                padding: 10px 0;
                margin: 3px 0;
            }
            .options-container {
                width: 100%;
                max-width: 100%;
            }
            .option-button {
                width: 100%;
                padding: 12px 16px;
            }
        }
        
        @media (max-width: 480px) {
            .options-container {
                gap: 6px;
            }
            .option-button {
                padding: 10px 12px;
                font-size: 1.2rem;
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
            
            <div class="answer-section">
                <form id="quizForm" onsubmit="return false;">
                    <div class="options-container" id="options-container">
                        {{OPTIONS}}
                    </div>
                    <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
                </form>
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
            
            // Helper function to get cookies
            function getCookie(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            const correctAnswer = '{{CORRECT_ANSWER}}';
            let selectedOption = null;
            
            // Initialize global variables
            let options = [];
            let questionText = '';
            
            // Function to update global variables
            function updateGlobalVariables() {
                options = Array.from(document.querySelectorAll('.option-button')).map(button => ({
                    id: button.dataset.value,
                    text: button.textContent.trim()
                }));
                questionText = document.querySelector('.question-text')?.textContent?.trim() || '';
                
            }
            
            // Initialize options and question text when DOM is loaded
            document.addEventListener('DOMContentLoaded', function() {
                updateGlobalVariables();
            });
            
            // Listen for messages from parent (Check button)
            window.addEventListener('message', function(event) {
                console.log('🔄 Received message:', event.data);
                
                if (event.data && event.data.type === 'problem.check') {
                    console.log('🔄 Processing problem.check - resetting quiz');
                    // Reset quiz state
                    resetQuiz();
                }
                
                if (event.data && event.data.type === 'problem.submit') {
                    console.log('🔄 Processing problem.submit - action:', event.data.action);
                    
                    if (event.data.action === 'check') {
                        console.log('🔄 Processing problem.submit with action=check - showing answers');
                        // Trigger quiz submission when Check button is clicked
                        getGrade();
                    } else if (event.data.action === 'reset') {
                        console.log('🔄 Processing problem.submit with action=reset - resetting quiz');
                        // Reset quiz when reset action is received
                        resetQuiz();
                    }
                }
            });
            
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
                const options = document.querySelectorAll('.option-button');
                
                // Update option buttons with correct/incorrect colors
                options.forEach(button => {
                    const isSelected = button.dataset.value === selectedOption;
                    const isCorrect = button.dataset.value === correctAnswer;
                    
                    button.classList.remove('selected', 'correct', 'incorrect');
                    
                    if (state.showAnswer) {
                        // When showing answer, show correct/incorrect colors
                        if (isCorrect) {
                            button.classList.add('correct');
                        } else if (isSelected) {
                            button.classList.add('incorrect');
                        }
                        button.disabled = true;
                    } else {
                        if (isSelected) {
                            button.classList.add('selected');
                        }
                        button.disabled = false;
                    }
                });
                
            }
            

            // Function to toggle answer window
            function toggleAnswerWindow() {
                const showFlag = document.getElementById('showAnswerFlag');
                const isVisible = state.showAnswer;

                if (isVisible) {
                    // Hide answer window and reset for new selection
                    showFlag.value = 'false';
                    state.showAnswer = false;
                    
                    // Reset all option buttons to normal state
                    const options = document.querySelectorAll('.option-button');
                    options.forEach(button => {
                        button.classList.remove('selected', 'correct', 'incorrect');
                        button.disabled = false;
                    });
                    
                    // Clear selected option
                    selectedOption = null;
                    
                    // Reset state completely
                    state.answer = '';
                    state.score = 0;
                } else {
                    // Show answer window
                    // Capture selected option
                    const selectedButton = document.querySelector('.option-button.selected');
                    if (selectedButton) {
                        selectedOption = selectedButton.dataset.value;
                    }
                    
                    // Set showAnswer to true BEFORE calling updateDisplay
                    state.showAnswer = true;
                    
                    // Calculate and display results
                    const result = calculateResults();
                    updateDisplay(result);
                    
                    showFlag.value = 'true';
                }
            }

            function getGrade() {
                // Update global variables before processing
                updateGlobalVariables();
                
                try {
                    // Always show answer when submitted
                    state.showAnswer = true;
                    
                    // Capture selected option
                    const selectedButton = document.querySelector('.option-button.selected');
                    if (selectedButton) {
                        selectedOption = selectedButton.dataset.value;
                    }
                    
                    // Update display with answer
                    const result = calculateResults();
                    updateDisplay(result);
                } catch (error) {
                    console.error('Error in getGrade:', error);
                }
                
                // Call completion API (non-blocking)
                setTimeout(() => {
                    try {
                        const result = calculateResults();
                        updateCompletionStatus(result);
                    } catch (error) {
                        console.error('Error in updateCompletionStatus:', error);
                    }
                }, 100);
                
                // Return data to EdX (prevent reload)
                try {
                    const result = calculateResults();
                    const returnValue = {
                        edxResult: None,
                        edxScore: result.rawScore,
                        edxMessage: result.message
                    };
                    
                    return JSON.stringify(returnValue);
                } catch (error) {
                    console.error('Error in return value:', error);
                    return JSON.stringify({
                        edxResult: None,
                        edxScore: 0,
                        edxMessage: 'Error occurred'
                    });
                }
            }
            
            function resetQuiz() {
                // Reset all option buttons
                const options = document.querySelectorAll('.option-button');
                options.forEach(button => {
                    button.classList.remove('selected', 'correct', 'incorrect');
                    button.disabled = false;
                });
                
                // Clear selected option
                selectedOption = null;
                
                // Reset state completely
                state.answer = '';
                state.score = 0;
                state.showAnswer = false;
                
                // Reset show flag
                const showFlag = document.getElementById('showAnswerFlag');
                if (showFlag) {
                    showFlag.value = 'false';
                }
                
                console.log('🔄 Quiz reset completed via problem.check message');
            }
            
            

            function updateCompletionStatus(result) {
                // Get CSRF token
                let csrfToken = '';
                try {
                    const tokenSources = [
                        () => document.querySelector('[name=csrfmiddlewaretoken]')?.value,
                        () => window.parent?.document?.querySelector('[name=csrfmiddlewaretoken]')?.value,
                        () => getCookie('csrftoken'),
                        () => document.querySelector('meta[name=csrf-token]')?.getAttribute('content'),
                        () => window.parent?.document?.querySelector('meta[name=csrf-token]')?.getAttribute('content')
                    ];
                    
                    for (let getToken of tokenSources) {
                        try {
                            const token = getToken();
                            if (token) {
                                csrfToken = token;
                                break;
                            }
                        } catch (e) {}
                    }
                    
                    if (!csrfToken) {
                        csrfToken = 'rN400a1rY6H0c7Ex86YaiA9ibJbFmEDf';
                    }
                } catch (e) {
                    csrfToken = 'rN400a1rY6H0c7Ex86YaiA9ibJbFmEDf';
                }
                
                // Get block ID from parent URL
                let blockId = 'block-v1:Manabi+N51+2026+type@vertical+block@aea91ffdf79346a2b9d03f6c570ad186';
                try {
                    if (window.parent && window.parent.location) {
                        const parentUrl = window.parent.location.href;
                        const blockMatch = parentUrl.match(/block-v1:([^\/\?\&]+)/);
                        if (blockMatch) {
                            blockId = blockMatch[0];
                        }
                    }
                } catch (e) {
                    // Use fallback block ID
                }
                
                // Always mark as complete when user submits
                const completionStatus = 1.0;
                
                // ✅ CALL COMPLETION API
                fetch('/courseware/mark_block_completion/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify({
                        'block_key': blockId,
                        'completion': completionStatus
                    })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('HTTP ' + response.status);
                    }
                })
                .then(data => {
                    // Success
                })
                .catch(error => {
                    // Error handling
                });
                
                // Send script text to parent for popup display
                try {
                    // Get script text from the template or form data
                    const scriptText = '{{SCRIPT_TEXT}}' || '';
                    
                    const quizData = {
                        templateId: 29,
                        scriptText: scriptText
                    };
                    
                    // Store in localStorage for popup
                    localStorage.setItem('quizGradeSubmitted', JSON.stringify(quizData));
                    localStorage.setItem('quizGradeSubmittedTimestamp', Date.now().toString());
                    
                    // Send message to parent
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'quiz.data.ready',
                            quizData: quizData
                        }, '*');
                    }
                } catch (error) {
                    console.error('Error sending script text to parent:', error);
                }
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
                            
                            document.getElementById('showAnswerFlag').value = 
                                state.showAnswer ? 'true' : 'false';
                        } catch (e) {
                            // Error parsing answers
                        }
                    }
                } catch (e) {
                    // Error setting state
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

                channel.bind('getGrade', function() {
                    return getGrade();
                });
                channel.bind('getState', function() {
                    return getState();
                });
                channel.bind('setState', function(stateStr) {
                    return setState(stateStr);
                });
            }
        })();
    </script>
</body>
</html>`;

// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    // First convert Japanese parentheses: 毎日（まいにち） -> <ruby>毎日<rt>まいにち</rt></ruby>
    text = text.replace(/([一-龯ひらがなカタカナ0-9]+)（([^）]+)）/g, function(match, p1, p2) {
        return '<ruby>' + p1 + '<rt>' + p2 + '</rt></ruby>';
    });
    // Then convert regular parentheses: 車(くるま) -> <ruby>車<rt>くるま</rt></ruby>
    text = text.replace(/([一-龯ひらがなカタカナ0-9]+)\(([^)]+)\)/g, function(match, p1, p2) {
        return '<ruby>' + p1 + '<rt>' + p2 + '</rt></ruby>';
    });
    return text;
}

export const getGrammarSingleSelectTemplate29 = (questionText, optionsString, instructions = '正しい文を選んでください。', scriptText = '') => {
  // optionsString format: "Câu đúng，câu sai 1，câu sai 2，câu sai 3"
  // Supports both Japanese comma (，) and English comma (,)
  // First option is always the correct answer
  // Process questionText to underline text in quotes and convert furigana
  const processedQuestionText = questionText
    .replace(/"([^"]+)"/g, '<span style="text-decoration: underline;">$1</span>');
  const finalQuestionText = convertFurigana(processedQuestionText);

  // Process scriptText to underline text in quotes and convert furigana
  const processedScriptText = scriptText
    .replace(/"([^"]+)"/g, '<span style="text-decoration: underline;">$1</span>');
  const finalScriptText = convertFurigana(processedScriptText);

  // Split options string into array using both English comma (,) and Japanese comma (，)
  // First try Japanese comma, then fallback to English comma
  let options;
  if (optionsString.includes('，')) {
    options = optionsString.split('，').map(option => option.trim());
  } else {
    options = optionsString.split(',').map(option => option.trim());
  }
  const correctAnswer = options[0]; // First option is the correct answer

  // Create HTML for options
  const optionsHtml = options
    .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
    .map(option => {
      // Process each option to underline text in quotes and convert furigana
      const processedOption = option
        .replace(/"([^"]+)"/g, '<span style="text-decoration: underline;">$1</span>');
      const finalOption = convertFurigana(processedOption);
      return `<button type="button" class="option-button" data-value="${option}">${finalOption}</button>`;
    })
    .join('');

  return grammarSingleSelectTemplate29
    .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
    .replace('{{QUESTION_TEXT}}', finalQuestionText)
    .replace('{{OPTIONS}}', optionsHtml)
    .replace('{{SCRIPT_TEXT}}', finalScriptText)
    .replace('{{CORRECT_ANSWER}}', correctAnswer);
};

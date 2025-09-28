export const grammarSingleSelectTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Grammar Single Select Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        /* Force Japanese font loading and application */
        * {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }
        
        body {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-weight: 400 !important;
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
            font-weight: bold !important;
            line-height: 1.5;
            text-align: left;
            background-color: white;
            color: #333;
            font-style: italic;
            margin: 0 0 20px 0;
            letter-spacing: 0.3px;
        }
        .question-text {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal !important;
            line-height: 1.6;
            text-align: left;
            color: #333;
            margin: 0;
            padding: 15px 0;
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
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            padding: 0;
            background: transparent;
            max-width: 600px;
        }
        .option-button {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal !important;
            line-height: 1.6;
            text-align: center;
            color: #333;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            max-width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            outline: none;
            background: #f5f5f5;
            cursor: pointer;
            min-height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border-radius: 4px;
            transition: all 0.3s ease;
            letter-spacing: 0.4px;
        }
        .option-button::before {
            display: none;
        }
        .option-button:hover:not(.selected):not(.correct):not(.incorrect) {
            background-color: #e8e8e8;
            border-color: #ccc;
        }
        .option-button.selected {
            background: linear-gradient(90deg, #4A90E2 0%, #7ED321 100%);
            border: 1px solid #4A90E2;
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .option-button.selected::after {
            display: none;
        }
        .option-button.correct {
            background: #4caf50;
            border: 1px solid #2e7d32;
            color: white;
        }
        .option-button.incorrect {
            background: #f44336;
            border: 1px solid #d32f2f;
            color: white;
        }
        .answer-feedback {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal !important;
            line-height: 1.6;
            text-align: left;
            color: #333;
            margin-top: 0.5rem;
            letter-spacing: 0.4px;
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
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: bold !important;
            line-height: 1.6;
            text-align: left;
            color: #2e7d32;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
            letter-spacing: 0.4px;
        }
        .wrong-answer {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal !important;
            line-height: 1.6;
            text-align: left;
            color: #b40000;
            text-decoration: line-through;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
            letter-spacing: 0.4px;
        }
        .select-answer-header {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: bold !important;
            line-height: 1.5;
            text-align: left;
            color: #333;
            margin: 0 0 10px 0;
            padding: 5px 0;
            letter-spacing: 0.3px;
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
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
                grid-template-columns: 1fr;
            }
            .option-button {
                width: 100%;
                padding: 12px 16px;
            }
        }
        
        @media (max-width: 480px) {
            .options-container {
                grid-template-columns: 1fr;
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
                    
                    // Trigger external popup
                    triggerExternalToggle(result, options, questionText, correctAnswer);
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
            
            // Function to trigger external iframe toggle
            function triggerExternalToggle(result, options, questionText, correctAnswer) {
                try {
                    // Check if popup is already open
                    const existingPopup = document.getElementById('quiz-test-popup');
                    const isPopupOpen = !!existingPopup;
                    
                    if (isPopupOpen) {
                        // Close existing popup
                        existingPopup.remove();
                        
                        // Send close message to parent
                        if (window.parent && window.parent !== window) {
                            window.parent.postMessage({
                                type: 'QUIZ_POPUP_CLOSE',
                                data: { action: 'close' }
                            }, '*');
                        }
                        
                        // Call parent close function if available
                        if (window.parent && window.parent.closeQuizPopup) {
                            window.parent.closeQuizPopup();
                        }
                        
                        return;
                    }
                    
                    // Send data to problem.html, let it forward to parent
                    try {
                        const messageData = {
                            selectedOption: selectedOption,
                            isCorrect: result.isCorrect,
                            score: result.rawScore,
                            message: result.message,
                            timestamp: new Date().toISOString(),
                            options: options ? options.map(opt => ({
                                id: opt.id,
                                text: opt.text,
                                isSelected: opt.id === selectedOption,
                                isCorrect: opt.id === correctAnswer
                            })) : [],
                            correctAnswer: correctAnswer,
                            questionText: questionText
                        };
                        
                        // Send to problem.html (parent iframe)
                        window.parent.postMessage({
                            type: 'quiz.data.ready',
                            quizData: messageData,
                            templateConfig: {
                                showPopup: false, // This template doesn't need external popup
                                templateType: 'grammar_single_select'
                            }
                        }, '*');

                    } catch (error) {
                        console.error('Error sending to problem.html:', error);
                    }
                    
                } catch (error) {
                    console.error('Error triggering external toggle:', error);
                }
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

export const getGrammarSingleSelectTemplate = (questionText, optionsString, instructions = '正しい文を選んでください。', explanationText = '') => {
  // Process questionText to underline text in quotes and convert furigana
  const processedQuestionText = questionText
    .replace(/"([^"]+)"/g, '<span style="text-decoration: underline; text-underline-offset: 3px;">$1</span>');
  const finalQuestionText = convertFurigana(processedQuestionText);

  // Split options string into array and trim each option
  const options = optionsString.split(',').map(option => option.trim());
  const correctAnswer = options[0]; // First option is the correct answer

  // Create HTML for options
  const optionsHtml = options
    .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
    .map(option => {
      // Process each option to underline text in quotes and convert furigana
      const processedOption = option
        .replace(/"([^"]+)"/g, '<span style="text-decoration: underline; text-underline-offset: 3px;">$1</span>');
      const finalOption = convertFurigana(processedOption);
      return `<button type="button" class="option-button" data-value="${option}">${finalOption}</button>`;
    })
    .join('');

  return grammarSingleSelectTemplate
    .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
    .replace('{{QUESTION_TEXT}}', finalQuestionText)
    .replace('{{OPTIONS}}', optionsHtml)
    .replace('{{EXPLANATION_TEXT}}', explanationText)
    .replace('{{CORRECT_ANSWER}}', correctAnswer);
}; 
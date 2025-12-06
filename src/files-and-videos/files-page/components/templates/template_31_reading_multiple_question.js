export const readingMultipleQuestionTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Reading Multiple Question Quiz</title>
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
            height: 100vh;
            overflow-y: hidden;
            overflow-x: hidden;
            background-color: #fff;
            width: 100%;
        }
        .container {
            display: grid;
            grid-template-columns: 45% 55%;
            height: 100%;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            background-color: #fff;
            max-width: 100%;
            overflow-x: hidden;
            gap: 20px;
        }
        .left-container {
            display: flex;
            flex-direction: column;
            overflow-y: hidden;
            overflow-x: hidden;
            padding: 0;
            margin: 0;
            background-color: #fff;
            width: 100%;
            height: 100%;
        }
        .right-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            padding-left: 5px;
            padding-top: 20px;
            background-color: #fff;
            width: 100%;
        }
        .images-container-right {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin: 0;
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            border: none;
            padding: 0;
            background-color: #fff;
            max-height: 45vh;
            flex-shrink: 0;
        }
        .instructions {
            font-size: 1.2rem;
            line-height: 1.5;
            color: #333;
            font-weight: bold;
            font-style: italic;
            margin: 0;
            padding: 5px 10px;
            background-color: #fff;
            word-wrap: break-word;
            overflow-wrap: break-word;
            flex-shrink: 0;
        }
        .content-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            flex-grow: 1;
            padding: 0;
            margin: 0;
            background-color: #fff;
        }
        .images-container {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin: 0;
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            border: none;
            padding: 0;
            background-color: #fff;
            flex: 1;
            max-height: 100%;
            height: 100%;
        }
        .image-item {
            width: 100%;
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            max-height: 90vh;
            flex: 1;
        }
        .images-container-right .image-item {
            max-height: 45vh !important;
            flex: 0 0 auto;
            width: 100%;
            max-width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
        }
        .image-item img {
            max-width: 100%;
            max-height: 90vh;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        /* Override for images in right container - must be after .image-item img */
        .images-container-right .image-item img {
            max-width: 100% !important;
            max-height: 45vh !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .reading-text {
            font-size: 1.2rem;
            line-height: 2.0;
            padding: 0;
            margin: 0;
            color: #333;
            background-color: #fff;
            border: none;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: normal;
            width: 100%;
            max-width: 100%;
        }
        .questions-container {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            width: 100%;
            overflow-x: hidden;
        }
        .question-block {
            background: #fff;
            padding: 8px;
            width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .question-text {
            font-size: 1.2rem;
            color: #333;
            font-weight: bold;
            margin-bottom: 8px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            width: 100%;
        }
        .options-container {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            gap: 6px;
            margin-top: 6px;
            width: 100%;
        }
        .option-button {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            flex: 0 0 auto;
            width: 100%;
            min-width: 120px;
            max-width: 100%;
            padding: 12px 16px;
            border: none;
            outline: none;
            background: transparent;
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.4;
            color: #333;
            text-align: left;
            position: relative;
            transition: all 0.3s ease;
            white-space: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
        }
        .option-button:hover:not(.selected):not(.correct):not(.incorrect) {
            background-color: #f8f9fa;
        }
        .option-button:hover:not(.selected):not(.correct):not(.incorrect)::before {
            border-color: #999;
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
        .option-button.selected {
            background: transparent;
            border: none;
            color: #333;
        }
        .option-button.selected::before {
            background: #000;
            border-color: #000;
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
            content: '✗';
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .answer-feedback {
            margin-top: 6px;
            font-size: 1.2rem;
            padding: 6px;
            border-radius: 3px;
            display: none;
        }
        .answer-feedback.correct {
            background-color: #e8f5e9;
            color: #2e7d32;
            display: block;
        }
        .answer-feedback.incorrect {
            background-color: #ffebee;
            color: #b40000;
            display: block;
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
        .answer-paragraph {
            margin: 0;
            background-color: white;
            line-height: 1.5;
            display: block;
            max-height: 200px;
            overflow-y: auto;
            padding: 1rem;
        }
        .explanation-highlight {
            color: #b40000;
            font-weight: normal;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            display: inline-block;
            margin: 0;
        }
        .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            display: inline-block;
            margin: 0;
        }
        .no-answer {
            color: #666;
            padding: 0 4px;
            margin: 0 2px;
        }
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                height: auto;
            }
            .left-container, .right-container {
                padding: 10px;
                overflow-y: visible;
            }
            .right-container {
                border-left: none;
            }
            .option-button {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-container">
            <div class="instructions" id="quiz-instructions">
                {{INSTRUCTIONS}}
            </div>
            <div class="content-container">
                <div class="images-container">
                    <!-- Images with .1. in filename will be inserted here -->
                    {{IMAGES_LEFT}}
                </div>
            </div>
        </div>
        
        <div class="right-container">
            <form id="quizForm" onsubmit="return false;">
                <div class="images-container-right">
                    <!-- Images with .2. in filename will be inserted here -->
                    {{IMAGES_RIGHT}}
                </div>
                {{READING_TEXT_CONTAINER}}
                <div class="questions-container" id="questions-container">
                    {{QUESTIONS}}
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
                <div style="display: none;">
                    <span id="script-text-hidden">{{EXPLANATION_TEXT}}</span>
                </div>
            </form>
        </div>
        
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div class="your-answer-section">
                    <div id="answer-paragraph" class="answer-paragraph"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Initialize global state
        window.quizState = {
            answers: {},
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
        window.selectedAnswers = {};

        (function() {
            const questions = {{QUESTIONS_DATA}};

            function calculateResults() {
                let correctCount = 0;
                const totalQuestions = Object.keys(questions).length;
                
                for (let questionId in questions) {
                    const isCorrect = window.selectedAnswers[questionId] === questions[questionId].correctAnswer;
                    if (isCorrect) correctCount++;
                }
                
                const rawScore = correctCount / totalQuestions;
                const message = 'Score: ' + correctCount + '/' + totalQuestions;

                window.quizState.answers = JSON.stringify(window.selectedAnswers);
                window.quizState.score = rawScore;
                window.quizState.attempts += 1;

                return {
                    rawScore,
                    message,
                    correctCount,
                    totalQuestions
                };
            }

            function updateDisplay(result) {
                // Update option buttons with correct/incorrect colors (like template 7)
                // Only update if result is provided (after check), otherwise just update based on current state
                const shouldShowAnswer = window.quizState.showAnswer;
                
                for (let questionId in questions) {
                    const questionBlock = document.getElementById(questionId);
                    if (!questionBlock) continue;
                    
                    const selectedAnswer = window.selectedAnswers[questionId];
                    const correctAnswer = questions[questionId].correctAnswer;
                    const options = questionBlock.querySelectorAll('.option-button');
                    
                    options.forEach(button => {
                        const isSelected = button.dataset.value === selectedAnswer;
                        const isCorrect = button.dataset.value === correctAnswer;
                        
                        button.classList.remove('selected', 'correct', 'incorrect');
                        
                        if (shouldShowAnswer) {
                            // When showing answer, show correct/incorrect colors
                            if (isCorrect) {
                                button.classList.add('correct'); // Xanh cho đáp án đúng
                            } else if (isSelected) {
                                button.classList.add('incorrect'); // Đỏ cho lựa chọn sai
                            }
                            button.disabled = true;
                        } else {
                            // When not showing answer, just show selected state (màu đen)
                            if (isSelected) {
                                button.classList.add('selected');
                            }
                            button.disabled = false;
                        }
                    });
                }
                
                const answerContainer = document.getElementById('answer-paragraph-container');
                
                // Update answer paragraph with results
                let answerHtml = '';
                for (let questionId in questions) {
                    const selectedAnswer = window.selectedAnswers[questionId];
                    const correctAnswer = questions[questionId].correctAnswer;
                    const questionBlock = document.getElementById(questionId);
                    const questionText = questionBlock.querySelector('.question-text').textContent;
                    
                    answerHtml += '<div class="answer-summary-item">';
                    answerHtml += '<div class="question-text">' + questionText + '</div>';
                    
                    if (selectedAnswer) {
                        const isCorrect = selectedAnswer === correctAnswer;
                        if (isCorrect) {
                            answerHtml += '<div>あなたの答え: <span class="correct-answer">' + selectedAnswer + '</span></div>';
                        } else {
                            answerHtml += '<div>あなたの答え: <span class="wrong-answer">' + selectedAnswer + '</span></div>';
                            answerHtml += '<div>正解: <span class="correct-answer">' + correctAnswer + '</span></div>';
                        }
                    } else {
                        answerHtml += '<div class="no-answer">未回答</div>';
                    }
                    answerHtml += '</div>';
                }
                
                const answerParagraph = document.getElementById('answer-paragraph');
                answerParagraph.innerHTML = answerHtml;
                
                // Always hide answer container - no toggle needed
                answerContainer.style.display = 'none';
            }

            // Function to encode script text for safe transmission (like template 67)
            function encodeScriptText(text) {
                if (!text) return '';
                
                // Script text already has underline styling from template processing
                // Just encode special characters for safe transmission
                return text
                    .replace(/\\\\/g, '\\\\\\\\')  // Escape backslashes first
                    .replace(/"/g, '\\\\"')    // Escape double quotes
                    .replace(/'/g, "\\\\'")    // Escape single quotes
                    .replace(/\\n/g, '\\\\n')   // Escape newlines
                    .replace(/\\r/g, '\\\\r')   // Escape carriage returns
                    .replace(/\\t/g, '\\\\t')   // Escape tabs
                    .replace(/「/g, '\\\\u300c') // Escape Japanese opening bracket
                    .replace(/」/g, '\\\\u300d') // Escape Japanese closing bracket
                    .replace(/（/g, '\\\\u3008') // Escape Japanese opening parenthesis
                    .replace(/）/g, '\\\\u3009'); // Escape Japanese closing parenthesis
            }

            function getGrade() {
                console.log('🎯 getGrade() called - Processing quiz submission');
                
                const result = calculateResults();
                
                // Always show answers (no toggle) - but don't show answer container
                window.quizState.showAnswer = true;
                document.getElementById('showAnswerFlag').value = 'true';
                
                updateDisplay(result);
                console.log('📊 Quiz results:', result);
                
                // Send quiz data to parent for ShowScript button (like template 67)
                try {
                    // Get script text from the template - use innerHTML to preserve HTML tags
                    const scriptTextElement = document.getElementById('script-text-hidden');
                    const scriptText = scriptTextElement ? scriptTextElement.innerHTML : '';
                    
                    // Encode script text to handle special characters (like template 67)
                    const encodedScriptText = encodeScriptText(scriptText);
                    
                    const quizData = {
                        templateId: 31,
                        scriptText: encodedScriptText
                    };
                    
                    // Send message to parent to show ShowScript button (like template 67)
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'quiz.data.ready',
                            quizData: quizData
                        }, '*');
                    }
                } catch (error) {
                    console.error('Error sending quiz data to parent:', error);
                }
                
                // ✅ CALL COMPLETION API (NON-BLOCKING)
                setTimeout(() => {
                    updateCompletionStatus(result);
                }, 100);
                
                // ✅ RETURN DATA TO EDX (PREVENT RELOAD)
                const returnValue = {
                    edxResult: None,
                    edxScore: result.rawScore,
                    edxMessage: result.message
                };
                console.log('🔄 Returning to EdX:', returnValue);

                return JSON.stringify(returnValue);
            }
            
            function updateCompletionStatus(result) {
                console.log('🚀 Starting completion API call...');
                
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
                                console.log('🔑 Found CSRF token:', token.substring(0, 8) + '...');
                                break;
                            }
                        } catch (e) {}
                    }
                    
                    if (!csrfToken) {
                        console.log('⚠️ No CSRF token found - using fallback');
                        csrfToken = 'rN400a1rY6H0c7Ex86YaiA9ibJbFmEDf';
                    }
                } catch (e) {
                    console.log('❌ CSRF token search failed:', e.message);
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
                            console.log('🎯 Found block ID from parent:', blockId);
                        }
                    }
                } catch (e) {
                    console.log('⚠️ Cannot access parent URL, using fallback block ID');
                }
                
                // Always mark as complete when user submits
                const completionStatus = 1.0;
                
                console.log('📡 Calling completion API with:', {
                    block_key: blockId,
                    completion: completionStatus,
                    score: result.rawScore,
                    note: 'COMPLETE'
                });
                
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
                    console.log('📈 API Response status:', response.status);
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('HTTP ' + response.status);
                    }
                })
                .then(data => {
                    console.log('✅ COMPLETION API SUCCESS:', data);
                    if (data.saved_to_blockcompletion) {
                        console.log('🎉 Progress page will update with new completion!');
                    }
                })
                .catch(error => {
                    console.log('❌ Completion API Error:', error.message);
                });
            }

            function getState() {
                return JSON.stringify(window.quizState);
            }

            function setState(stateStr) {
                try {
                    const newState = JSON.parse(stateStr);
                    window.quizState = {
                        answers: newState.answers || '{}',
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
                    };
                    
                    if (window.quizState.answers && typeof window.quizState.answers === 'string') {
                        try {
                            window.selectedAnswers = JSON.parse(window.quizState.answers);
                            
                            // Restore selected state for buttons
                            for (let questionId in window.selectedAnswers) {
                                const answer = window.selectedAnswers[questionId];
                                const selector = '#' + questionId + ' .option-button[data-value="' + answer + '"]';
                                const button = document.querySelector(selector);
                                if (button) {
                                    button.classList.add('selected');
                                }
                            }

                            const result = calculateResults();
                            updateDisplay(result);
                        } catch (e) {
                            console.error('Error parsing answers:', e);
                        }
                    }
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }

            // Listen for messages from parent (reset functionality like template 7)
            window.addEventListener('message', function(event) {
                // Handle JSChannel messages (from EdX)
                if (event.data && event.data.method === 'JSInput::getGrade') {
                    getGrade();
                    return;
                }
                
                // Process postMessage from parent window
                if (event.source !== window.parent && event.source !== window) {
                    return;
                }
                
                if (event.data && event.data.type === 'problem.check') {
                    // Reset quiz state
                    resetQuiz();
                }
                
                if (event.data && event.data.type === 'problem.submit') {
                    if (event.data.action === 'check') {
                        // Trigger quiz submission when Check button is clicked
                        getGrade();
                    } else if (event.data.action === 'reset') {
                        // Reset quiz when reset action is received
                        resetQuiz();
                    }
                }
                
                // Parent (TestNavigationBar) requests answers for saving (like template 18 and 37)
                if (event.data && event.data.type === 'quiz.get_answers') {
                    try {
                        // Build answers payload: one item per question (like template 37)
                        var payload = [];
                        for (let questionId in questions) {
                            var userAnswer = window.selectedAnswers[questionId] || '';
                            var correctAnswer = questions[questionId].correctAnswer || '';
                            payload.push({
                                questionId: questionId,
                                userAnswer: userAnswer,
                                correctAnswer: correctAnswer,
                                isCorrect: userAnswer === correctAnswer
                            });
                        }

                        // Respond to parent with answers array (include template_id for TestNavigationBar)
                        window.parent.postMessage({
                            type: 'quiz.answers',
                            templateId: 31,
                            answers: payload
                        }, '*');
                        console.log('📤 Sent quiz.answers to parent:', payload);
                    } catch (e) {
                        console.error('❌ Failed to assemble quiz.answers payload:', e);
                    }
                }
            });
            
            // Reset quiz function (like template 7)
            function resetQuiz() {
                // Reset all option buttons
                document.querySelectorAll('.option-button').forEach(button => {
                    button.classList.remove('selected', 'correct', 'incorrect');
                    button.disabled = false;
                });
                
                // Clear selected answers
                window.selectedAnswers = {};
                
                // Reset state
                window.quizState.answer = '';
                window.quizState.score = 0;
                window.quizState.showAnswer = false;
                
                // Reset show flag
                const showFlag = document.getElementById('showAnswerFlag');
                if (showFlag) {
                    showFlag.value = 'false';
                }
                
                // Hide answer container
                const answerContainer = document.getElementById('answer-paragraph-container');
                if (answerContainer) {
                    answerContainer.style.display = 'none';
                }
                
                console.log('🔄 Quiz reset completed');
            }

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

// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    if (!text || typeof text !== "string") return text;
    // Chỉ Kanji (và vài ký tự đặc biệt)
    const kanjiWord = "[\u4E00-\u9FFF々〆〤ヶ]+";
    // Dấu ngoặc Nhật (全角) - xử lý cả có và không có khoảng trắng: 上（うえ）hoặc 上 （うえ）
    const reJaParens = new RegExp("(" + kanjiWord + ")\\s*（([^）]+)）", "g");
    text = text.replace(reJaParens, (match, p1, p2) => {
        return `<ruby>${p1}<rt>${p2}</rt></ruby>`;
    });
    
    // Dấu ngoặc ASCII (半角) - xử lý cả có và không có khoảng trắng: 上(うえ) hoặc 上 (うえ)
    const reAsciiParens = new RegExp("(" + kanjiWord + ")\\s*\\(([^)]+)\\)", "g");
    text = text.replace(reAsciiParens, (match, p1, p2) => {
        return `<ruby>${p1}<rt>${p2}</rt></ruby>`;
    });
    
    return text;
}

export const getReadingMultipleQuestionTemplate = (readingText, questionText, blankOptions, instructions = '以下の文章を読んで、質問に答えてください。', explanationText = '', images = []) => {
    // Helper function to split by both English and Japanese commas
    function splitByComma(text) {
        if (!text) return [];
        // Replace Japanese comma with English comma for consistent splitting
        const normalized = text.replace(/，/g, ',');
        return normalized.split(',').map(item => item.trim()).filter(item => item);
    }
    
    // Split questions, options and explanations by semicolons
    const questions = questionText.split(';').map(q => q.trim()).filter(q => q);
    const optionsList = blankOptions.split(';').map(o => o.trim()).filter(o => o);
    const explanations = explanationText.split(';').map(e => e.trim()).filter(e => e);

    // Process images - separate images with .1 and .2 in filename
    let imagesLeftHtml = '';
    let imagesRightHtml = '';
    let hasImagesLeft = false;
    let hasImagesRight = false;
    
    if (images) {
        // If images is a string, split by comma or semicolon
        const imageArray = Array.isArray(images) ? images : images.split(/[,;]/).map(img => img.trim()).filter(img => img);
        
        console.log('🔍 Template 31 - Images parameter:', {
            images: images,
            imageArray: imageArray,
            type: typeof images,
            isArray: Array.isArray(images)
        });
        
        // Separate images based on .1. or .2. in filename
        const leftImages = [];
        const rightImages = [];
        
        imageArray.forEach((imagePath) => {
            // Check if filename contains .1./_1. or .2./_2. pattern 
            // (e.g., 1.1.png, ID31_1.1.png, 20251103_ID31_1.1.png, 20251113_ID38_1.jpeg)
            const filename = imagePath.split('/').pop() || imagePath;
            
            console.log('🔍 Template 31 - Processing image:', {
                imagePath: imagePath,
                filename: filename,
                hasPattern1: /[._]1[._]/.test(filename),
                hasPattern2: /[._]2[._]/.test(filename)
            });
            
            // Pattern logic: 
            // Image 2 (RIGHT): File có pattern _<số>.2 (ví dụ: _1.2, _27.2, _999.2)
            // Image 1 (LEFT): Tất cả các file còn lại (default)
            if (/_\d+\.2/.test(filename)) {
                // File có _số.2 (gạch dưới + số bất kỳ + .2) → hiển thị bên phải (image 2)
                console.log('✅ Template 31 - Image goes to RIGHT (pattern _số.2):', filename);
                rightImages.push(imagePath);
            } else {
                // Default: Tất cả file không match image 2 đều vào left (image 1)
                console.log('✅ Template 31 - Image goes to LEFT (default - không match _số.2):', filename);
                leftImages.push(imagePath);
            }
        });
        
        // Generate HTML for left images (container bên trái)
        if (leftImages.length > 0) {
            imagesLeftHtml = leftImages.map((imagePath) => {
                return '<div class="image-item"><img src="' + imagePath + '" alt="Reading Image" /></div>';
            }).join('');
            hasImagesLeft = true;
        }
        
        // Generate HTML for right images (container bên phải)
        if (rightImages.length > 0) {
            imagesRightHtml = rightImages.map((imagePath) => {
                return '<div class="image-item"><img src="' + imagePath + '" alt="Reading Image" /></div>';
            }).join('');
            hasImagesRight = true;
        }
    }

    // Generate questions HTML and data
    const questionsHtml = questions.map((questionText, index) => {
        const questionId = 'question_' + (index + 1);
        // Use helper function to split by both English and Japanese commas
        const options = splitByComma(optionsList[index] || '');
        const correctAnswer = options[0];
        const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'ja'));
        
        // If only 1 question, show "問" without number; if multiple, show "問1", "問2", etc.
        const questionNumber = questions.length === 1 ? '問' : '問' + (index + 1);
        
        return '<div class="question-block" id="' + questionId + '">' +
               '<div class="question-text">' + questionNumber + '　' + questionText + '</div>' +
               '<div class="options-container">' + 
               sortedOptions.map((option, optIndex) => {
                   // Convert furigana for display (like template 7)
                   // data-value keeps original value for comparison, innerHTML shows converted value
                   const optionDisplay = convertFurigana(option);
                   const escapedOption = option.replace(/"/g, '&quot;');
                   return '<button type="button" class="option-button" data-value="' + escapedOption + '" data-question-id="' + questionId + '" onclick="' +
                   'if(this.disabled) return false;' +
                   'const questionBlock=this.closest(\'.question-block\');' +
                   'if(!questionBlock) return false;' +
                   'questionBlock.querySelectorAll(\'.option-button\').forEach(function(btn){btn.classList.remove(\'selected\');});' +
                   'this.classList.add(\'selected\');' +
                   'window.selectedAnswers=window.selectedAnswers||{};' +
                   'window.selectedAnswers[questionBlock.id]=this.dataset.value;' +
                   'console.log(\'Selected:\', questionBlock.id, this.dataset.value);' +
                   'return false;' +
                   '">' + optionDisplay + '</button>';
               }).join('') +
               '</div>' +
               '</div>';
    }).join('');
    
    // Create questions data object for JavaScript
    const questionsData = {};
    questions.forEach((questionText, index) => {
        const questionId = 'question_' + (index + 1);
        // Use helper function to split by both English and Japanese commas
        const options = splitByComma(optionsList[index] || '');
        questionsData[questionId] = {
            correctAnswer: options[0],
            options: options
        };
    });
    
    // Process explanations with numbering
    const processedExplanationText = explanations.map((explanation, index) => {
        const processedText = explanation.replace(/"([^"]+)"/g, '<span class="explanation-highlight">$1</span>');
        return '<div class="explanation-block">' +
               '<div class="explanation-text">' + (index + 1) + '. ' + processedText + '</div>' +
               '</div>';
    }).join('');
    
    // Ensure readingText is empty if not provided, don't use questionText as fallback
    // Only trim trailing whitespace, preserve leading whitespace (for indentation)
    const finalReadingText = readingText ? readingText.replace(/\s+$/, '') : '';
    
    // Only show reading-text container if readingText is not empty
    const readingTextContainer = finalReadingText 
        ? `<div class="reading-text">${finalReadingText}</div>`
        : '';
    
    let template = readingMultipleQuestionTemplate
        .replace('{{READING_TEXT_CONTAINER}}', readingTextContainer)
        .replace('{{QUESTIONS}}', questionsHtml)
        .replace('{{QUESTIONS_DATA}}', JSON.stringify(questionsData))
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{EXPLANATION_TEXT}}', processedExplanationText || '');

    // Handle left images conditionally - hide container if no images
    if (hasImagesLeft) {
        template = template.replace('{{IMAGES_LEFT}}', imagesLeftHtml);
    } else {
        // Remove the entire images-container when no images
        template = template.replace(/<div class="images-container">[\s\S]*?{{IMAGES_LEFT}}[\s\S]*?<\/div>/g, '');
    }
    
    // Handle right images conditionally - hide container if no images
    if (hasImagesRight) {
        template = template.replace('{{IMAGES_RIGHT}}', imagesRightHtml);
    } else {
        // Remove the entire images-container-right when no images
        template = template.replace(/<div class="images-container-right">[\s\S]*?{{IMAGES_RIGHT}}[\s\S]*?<\/div>/g, '');
    }

    return template;
}; 
import { TEMPLATE_IDS } from './templateUtils';

// Template ID: TEMPLATE_IDS.DRAG_DROP
export const dragDropQuizTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Drag and Drop Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"></script>
    <style>
        body {
            font-family: 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.8;
            color: #414141;
            height: 100%;
            position: relative;
            font-size: 0.8rem;
        }
        .container {
            padding: 1rem;
            position: relative;
            height: 100%;
        }
        .paragraph {
            background-color: #f8f8f8;
            padding: 1.5rem;
            margin-bottom: 1rem;
            font-size: 0.8rem;
            line-height: 2;
            position: relative;
            z-index: 1;
            border-radius: 4px;
        }
        .word-bank {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin: 1.5rem 0;
            padding: 1.2rem;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
        .draggable-word {
            padding: 0.6rem 1.2rem;
            background-color: #0075b4;
            color: white;
            border-radius: 4px;
            cursor: move;
            user-select: none;
            transition: background-color 0.2s;
            font-size: 0.8rem;
            min-width: 80px;
            text-align: center;
        }
        .draggable-word:hover {
            background-color: #005a8c;
        }
        .draggable-word.dragging {
            opacity: 0.5;
        }
        .blank {
            display: inline-block;
            min-width: 120px;
            height: 45px;
            border: 2px dashed #0075b4;
            border-radius: 4px;
            margin: 0 0.5rem;
            vertical-align: middle;
            background-color: white;
            text-align: center;
            line-height: 45px;
            font-size: 0.8rem;
        }
        .blank.dragover {
            background-color: #e6f3f8;
            border-style: solid;
        }
        .blank.filled {
            border-style: solid;
            border-color: #2e7d32;
            background-color: #ecf3ec;
        }
        .blank.incorrect {
            border-color: #b40000;
            background-color: #f9ecec;
        }
        .blank.show-feedback {
            position: relative;
            display: inline-block;
            margin: 0 0.3rem;
            vertical-align: middle;
        }
        .blank.show-feedback .answer-container {
            display: flex;
            gap: 0.3rem;
            align-items: center;
            min-width: 120px;
        }
        .blank.show-feedback .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.3rem 0.6rem;
            border-radius: 3px;
            font-weight: bold;
            font-size: 0.75rem;
            text-align: center;
            min-width: 60px;
        }
        .blank.show-feedback .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .blank.show-feedback .quiz-word.incorrect {
            background: #b40000;
            color: #fff;
        }
        .feedback-replacement {
            display: inline-block;
            margin: 0 0.3rem;
            vertical-align: middle;
        }
        .feedback-replacement .answer-container {
            display: flex;
            gap: 0.3rem;
            align-items: center;
            min-width: 120px;
        }
        .feedback-replacement .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.3rem 0.6rem;
            border-radius: 3px;
            font-weight: bold;
            font-size: 0.75rem;
            text-align: center;
            min-width: 60px;
        }
        .feedback-replacement .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .feedback-replacement .quiz-word.incorrect {
            background: #b40000;
            color: #fff;
        }
        .buttons {
            margin: 1rem 0;
        }
        #feedback {
            margin: 1rem 0;
            padding: 1rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.8rem;
        }
        .success {
            background-color: #ecf3ec;
            color: #2e7d32;
            border: 1px solid #c5e0c5;
        }
        .error {
            background-color: #f9ecec;
            color: #b40000;
            border: 1px solid #ebccd1;
        }
        .answer-feedback {
            margin-top: 1rem;
            font-size: 0.8rem;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            padding: 0.2rem 0.4rem;
            background-color: #ecf3ec;
            border-radius: 3px;
        }
        .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            padding: 0.2rem 0.4rem;
            background-color: #f9ecec;
            border-radius: 3px;
            margin-right: 0.3rem;
        }
        .answer-paragraph-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0;
            padding: 0.3rem 4rem;
            background-color: rgba(99, 97, 97, 0.95);
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
            display: none;
            z-index: 2;
            transition: transform 0.3s ease;
        }
        .answer-paragraph-inner {
            max-width: 90%;
            margin: 0 auto;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.15);
            padding: 1.5rem 1.2rem 1.2rem 1.2rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        .answer-feedback {
            margin-bottom: 1rem;
            padding: 0.8rem 1rem;
            border-radius: 3px;
            font-weight: bold;
            font-size: 0.8rem;
            background: #f9ecec;
            color: #b40000;
            border: 1px solid #ebccd1;
        }
        .answer-feedback.success {
            background: #ecf3ec;
            color: #2e7d32;
            border: 1px solid #c5e0c5;
        }
        .answer-paragraph {
            margin: 0;
            background-color: #ffffff;
            line-height: 1.6;
            box-shadow: none;
            border-radius: 3px;
            padding: 0;
            font-size: 0.8rem;
            display: block;
        }
        .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.02em 0.1em;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            box-sizing: border-box;
            font-size: 0.8rem;
        }
        .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .quiz-word.incorrect {
            background: #b40000;
            color: #fff;
            text-decoration: line-through;
        }
        .answer-blank {
            display: inline-block;
            margin: 0 0.5rem;
            vertical-align: middle;
            min-width: 120px;
            text-align: center;
            font-size: 0.8rem;
        }
        .answer-blank .quiz-word {
            margin: 0 0.2rem;
            padding: 0.5rem 0.8rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.8rem;
        }
        #answer-paragraph form {
            padding: 0;
            margin: 0;
            background: transparent;
        }
        .instructor-section {
            background-color: #f0f8ff;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
            border-left: 4px solid #0075b4;
        }
        .instructor-title {
            font-weight: bold;
            color: #0075b4;
            margin-bottom: 0.5rem;
            font-size: 0.8rem;
        }
        .instructor-content {
            font-size: 0.8rem;
            line-height: 1.6;
            color: #333;
        }
        .instructor-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 3px;
            padding: 0.5rem;
            margin-top: 0.5rem;
            font-size: 1rem;
            color: #856404;
        }
        .instructions {
            font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            background-color: white;
            color: #333;
            font-style: italic;
            margin: 0;
            position: relative;
            padding-left: 20px;
        }
        .instructions:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: #0075b4;
        }
        #answer-paragraph form > div {
            margin-bottom: 1rem;
            line-height: 1.8;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions" id="quiz-instructions">
            {{INSTRUCTIONS}}
        </div>
        <div class="paragraph">
            <form id="quizForm" onsubmit="return false;">
                {{PARAGRAPH_TEXT}}
                <div class="word-bank">
                    {{WORD_BANK}}
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
            </form>
        </div>
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div id="feedback" class="answer-feedback"></div>
                <div id="answer-paragraph" class="answer-paragraph"></div>
            </div>
        </div>
 
    </div>

    <script>
        (function() {
            var state = {
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

            const correctAnswers = {{CORRECT_ANSWERS}};

            // Initialize EdX integration
            var channel;
            if (window.parent !== window) {
                channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });
            }

            // Drag and Drop functionality
            function initializeDragAndDrop() {
                const draggableWords = document.querySelectorAll('.draggable-word');
                const blanks = document.querySelectorAll('.blank');
                const wordBank = document.querySelector('.word-bank');

                draggableWords.forEach(word => {
                    word.setAttribute('draggable', 'true');
                    word.addEventListener('dragstart', handleDragStart);
                    word.addEventListener('dragend', handleDragEnd);
                });

                blanks.forEach(blank => {
                    blank.addEventListener('dragover', handleDragOver);
                    blank.addEventListener('dragleave', handleDragLeave);
                    blank.addEventListener('drop', handleDrop);
                    blank.addEventListener('dragstart', handleBlankDragStart);
                    blank.addEventListener('dragend', handleBlankDragEnd);
                    blank.setAttribute('draggable', 'true');
                });

                // Allow dropping back to word bank
                wordBank.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    wordBank.classList.add('dragover');
                });
                wordBank.addEventListener('dragleave', function(e) {
                    wordBank.classList.remove('dragover');
                });
                wordBank.addEventListener('drop', handleDropToWordBank);
            }

            function handleDragStart(e) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.textContent);
                e.dataTransfer.setData('source', 'word-bank');
            }

            function handleDragEnd(e) {
                e.target.classList.remove('dragging');
            }

            function handleBlankDragStart(e) {
                if (!e.currentTarget.textContent.trim()) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData('text/plain', e.currentTarget.textContent);
                e.dataTransfer.setData('source', 'blank');
                e.dataTransfer.setData('blankId', e.currentTarget.id);
                e.currentTarget.classList.add('dragging');
            }

            function handleBlankDragEnd(e) {
                e.currentTarget.classList.remove('dragging');
            }

            function handleDragOver(e) {
                e.preventDefault();
                e.currentTarget.classList.add('dragover');
            }

            function handleDragLeave(e) {
                e.currentTarget.classList.remove('dragover');
            }

            function handleDrop(e) {
                e.preventDefault();
                const blank = e.currentTarget;
                blank.classList.remove('dragover');

                const word = e.dataTransfer.getData('text/plain');
                const source = e.dataTransfer.getData('source');
                const fromBlankId = e.dataTransfer.getData('blankId');
                const blankId = blank.id;

                // If this blank already has a word, return it to the word bank (replace logic)
                if (blank.textContent.trim()) {
                    // Only return if the word is different
                    if (blank.textContent.trim() !== word) {
                        restoreWordToBank(blank.textContent.trim());
                    }
                }

                // If moving from another blank, clear that blank
                if (source === 'blank' && fromBlankId && fromBlankId !== blankId) {
                    const fromBlank = document.getElementById(fromBlankId);
                    if (fromBlank) {
                        fromBlank.textContent = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }

                // Store the answer
                state.answers[blankId] = word;

                // Update the blank's appearance
                blank.textContent = word;
                blank.classList.add('filled');

                // Hide the dragged word from the word bank if it exists there
                const draggedWord = Array.from(document.querySelectorAll('.draggable-word')).find(w => w.textContent === word);
                if (draggedWord) {
                    draggedWord.style.display = 'none';
                }
            }

            function handleDropToWordBank(e) {
                e.preventDefault();
                const word = e.dataTransfer.getData('text/plain');
                const source = e.dataTransfer.getData('source');
                const fromBlankId = e.dataTransfer.getData('blankId');
                if (source === 'blank' && fromBlankId) {
                    // Remove word from blank
                    const fromBlank = document.getElementById(fromBlankId);
                    if (fromBlank) {
                        fromBlank.textContent = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }
                restoreWordToBank(word);
            }

            function restoreWordToBank(word) {
                const wordElement = Array.from(document.querySelectorAll('.draggable-word')).find(w => w.textContent === word);
                if (wordElement) {
                    wordElement.style.display = '';
                }
            }

            function calculateResults() {
                let correctCount = 0;
                const totalQuestions = Object.keys(correctAnswers).length;
                
                // Check each answer
                for (let blankId in correctAnswers) {
                    const userAnswer = state.answers[blankId];
                    const correctAnswer = correctAnswers[blankId];
                    const blank = document.getElementById(blankId);
                    
                    if (userAnswer === correctAnswer) {
                        correctCount++;
                    }
                }

                const rawScore = correctCount / totalQuestions;
                const message = \`Your score: \${correctCount} out of \${totalQuestions}\`;

                return {
                    rawScore,
                    message,
                    correctCount,
                    totalQuestions
                };
            }

            function updateDisplay(result) {
                try {
                    console.log('Starting updateDisplay with result:', JSON.stringify(result));
                    
                    // Get the original quiz form
                    const quizForm = document.getElementById('quizForm');
                    console.log('Quiz form found:', quizForm ? 'yes' : 'no');
                    
                    // Get all blanks in the original form
                    const blanks = quizForm.querySelectorAll('.blank');
                    console.log('Total blanks found:', blanks.length);
                    
                    // Process each blank to show feedback directly
                    blanks.forEach((blank, index) => {
                        const blankId = blank.id;
                        console.log('Processing blank', index, 'with ID:', blankId);
                        
                        if (!blankId) {
                            console.log('Blank has no ID, skipping');
                            return;
                        }
                        
                        const userAnswer = state.answers[blankId];
                        const correctAnswer = correctAnswers[blankId];
                        
                        console.log('User answer:', userAnswer, 'Correct answer:', correctAnswer);
                        
                        // Create new replacement element
                        const replacement = document.createElement('span');
                        replacement.className = 'feedback-replacement';
                        replacement.setAttribute('data-blank-id', blankId);
                        
                        // Create answer container
                        const answerContainer = document.createElement('div');
                        answerContainer.className = 'answer-container';
                        
                        if (userAnswer) {
                            if (userAnswer === correctAnswer) {
                                // User answered correctly - only show user answer (green)
                                answerContainer.innerHTML = '<span class="quiz-word correct">' + userAnswer + '</span>';
                            } else {
                                // User answered incorrectly - show both answers
                                answerContainer.innerHTML = 
                                    '<span class="quiz-word incorrect">' + userAnswer + '</span>' + 
                                    ' <span class="quiz-word correct">' + correctAnswer + '</span>';
                            }
                        } else {
                            // User didn't answer - show only correct answer
                            answerContainer.innerHTML = '<span class="quiz-word correct">' + correctAnswer + '</span>';
                        }
                        
                        // Add answer container to replacement
                        replacement.appendChild(answerContainer);
                        
                        // Replace the entire blank element with the new replacement
                        blank.parentNode.replaceChild(replacement, blank);
                        
                        console.log('Replaced blank with feedback replacement');
                    });
                    
                    console.log('updateDisplay completed successfully');
                } catch (error) {
                    console.error('Error in updateDisplay:', error);
                }
            }

            function getGrade() {
                console.log('🎯 getGrade() called - Processing quiz submission');
                
                // Always show feedback when submitted
                const showFlag = document.getElementById('showAnswerFlag');
                
                // Calculate results
                const result = calculateResults();
                console.log('📊 Quiz results:', result);
                
                // Always show feedback when submitted
                state.showAnswer = true;
                updateDisplay(result);
                showFlag.value = 'true';
                console.log('📱 Showing feedback');
                
                // ✅ CALL COMPLETION API (NON-BLOCKING)
                setTimeout(() => {
                    updateCompletionStatus(result);
                }, 100);
                
                // ✅ RETURN DATA TO EDX (PREVENT RELOAD)
                const returnValue = {
                    edxResult: None,  // Keep it null to avoid EdX refresh
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
                return JSON.stringify({
                    answers: state.answers,
                    attempts: state.attempts,
                    score: state.score,
                    showAnswer: state.showAnswer
                });
            }

            function resetQuiz() {
                console.log('🔄 Resetting quiz to initial state');
                
                // Clear all answers
                state.answers = {};
                state.score = 0;
                state.attempts = 0;
                state.showAnswer = false;
                
                // Hide answer paragraph container if visible
                const answerContainer = document.getElementById('answer-paragraph-container');
                if (answerContainer) {
                    answerContainer.style.display = 'none';
                }
                
                // Reset show answer flag
                const showFlag = document.getElementById('showAnswerFlag');
                if (showFlag) {
                    showFlag.value = 'false';
                }
                
                // Get the quiz form
                const quizForm = document.getElementById('quizForm');
                if (!quizForm) {
                    console.error('Quiz form not found for reset');
                    return;
                }
                
                // Remove all feedback replacements
                const feedbackReplacements = document.querySelectorAll('.feedback-replacement');
                feedbackReplacements.forEach(replacement => {
                    const parent = replacement.parentNode;
                    const blankId = replacement.getAttribute('data-blank-id');
                    
                    // Create new blank element
                    const newBlank = document.createElement('span');
                    newBlank.className = 'blank';
                    newBlank.id = blankId;
                    newBlank.textContent = '';
                    
                    // Replace the feedback replacement with the original blank
                    parent.replaceChild(newBlank, replacement);
                });
                
                // Clear all existing blanks
                const existingBlanks = quizForm.querySelectorAll('.blank');
                existingBlanks.forEach(blank => {
                    blank.textContent = '';
                    blank.classList.remove('filled', 'incorrect', 'show-feedback', 'correct', 'wrong');
                });
                
                // Show all words in word bank
                const draggableWords = document.querySelectorAll('.draggable-word');
                draggableWords.forEach(word => {
                    word.style.display = '';
                });
                
                // Re-initialize drag and drop
                initializeDragAndDrop();
                
                console.log('✅ Quiz reset completed');
            }

            function setState(stateStr) {
                try {
                    let newState;
                    
                    // Check if stateStr is already an object or a string
                    if (typeof stateStr === 'string') {
                        newState = JSON.parse(stateStr);
                    } else if (typeof stateStr === 'object') {
                        newState = stateStr;
                    } else {
                        console.error('Invalid state format:', stateStr);
                        return;
                    }
                    
                    state = {
                        answers: newState.answers || {},
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
                    };
                    
                    // Restore answers if we have saved state
                    if (state.answers) {
                        for (let blankId in state.answers) {
                            const blank = document.getElementById(blankId);
                            const word = state.answers[blankId];
                            if (blank && word) {
                                blank.textContent = word;
                                blank.classList.add('filled');
                                
                                // Hide the corresponding word in the word bank
                                const wordElement = Array.from(document.querySelectorAll('.draggable-word'))
                                    .find(el => el.textContent === word);
                                if (wordElement) {
                                    wordElement.style.display = 'none';
                                }
                            }
                        }

                        // Calculate results
                        const result = calculateResults();
                        
                        // Update feedback display
                        if (state.showAnswer) {
                            updateDisplay(result);
                        } else {
                            // Hide feedback - restore original blanks
                            const feedbackReplacements = document.querySelectorAll('.feedback-replacement');
                            feedbackReplacements.forEach(replacement => {
                                const parent = replacement.parentNode;
                                const blankId = replacement.getAttribute('data-blank-id');
                                
                                // Create new blank element
                                const newBlank = document.createElement('span');
                                newBlank.className = 'blank';
                                newBlank.id = blankId;
                                
                                // Restore original blank appearance
                                const userAnswer = state.answers[blankId];
                                if (userAnswer) {
                                    newBlank.textContent = userAnswer;
                                    newBlank.classList.add('filled');
                                } else {
                                    newBlank.textContent = '';
                                    newBlank.classList.remove('filled');
                                }
                                
                                // Replace the feedback replacement with the original blank
                                parent.replaceChild(newBlank, replacement);
                            });
                            
                            // Re-initialize drag and drop for restored blanks
                            initializeDragAndDrop();
                        }
                        
                        document.getElementById('showAnswerFlag').value = state.showAnswer ? 'true' : 'false';
                    }
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }

            // Initialize drag and drop when the page loads
            document.addEventListener('DOMContentLoaded', function() {
                // Render each sentence in a <div> for line breaks and correct drag-drop
                var para = document.querySelector('.paragraph');
                if (para) {
                    console.log('Initializing paragraph structure');
                    
                    // Get the quiz form directly instead of manipulating the HTML string
                    var quizForm = para.querySelector('#quizForm');
                    
                    if (quizForm) {
                        console.log('Found quiz form directly');
                        
                        // Get the content of the form excluding the word bank
                        var wordBank = quizForm.querySelector('.word-bank');
                        var hiddenInput = quizForm.querySelector('input[type="hidden"]');
                        
                        // Store the word bank and hidden input for later
                        var wordBankHTML = wordBank ? wordBank.outerHTML : '';
                        var hiddenInputHTML = hiddenInput ? hiddenInput.outerHTML : '';
                        
                        // Temporarily remove word bank and hidden input to process only the sentences
                        if (wordBank) wordBank.remove();
                        if (hiddenInput) hiddenInput.remove();
                        
                        // Get the form content without word bank and hidden input
                        var formContent = quizForm.innerHTML;
                        console.log('Form content without word bank:', formContent);
                        
                        // Check if content contains numbered characters (①②③...)
                        var numberedPattern = /[①②③④⑤⑥⑦⑧⑨⑩]/;
                        var sentences = [];
                        
                        if (numberedPattern.test(formContent)) {
                            // Split by numbered characters
                            console.log('Found numbered characters, splitting by them');
                            sentences = formContent.split(/(?=[①②③④⑤⑥⑦⑧⑨⑩])/).filter(function(s) { 
                                return s.trim(); 
                            });
                        } else {
                            // Fall back to splitting by Japanese period
                            console.log('No numbered characters found, splitting by Japanese periods');
                            sentences = formContent.split('。').filter(function(s) { 
                                return s.trim(); 
                            });
                            // Add periods back for non-numbered splitting
                            sentences = sentences.map(function(s, index) {
                                return s + (index < sentences.length - 1 || s.trim() ? '。' : '');
                            });
                        }
                        
                        console.log('Split sentences:', sentences.length);
                        
                        // Wrap each sentence in a div
                        var wrappedContent = sentences.map(function(s) {
                            return '<div>' + s + '</div>';
                        }).join('');
                        
                        // Reconstruct the form with the wrapped sentences and the word bank
                        quizForm.innerHTML = wrappedContent + wordBankHTML + hiddenInputHTML;
                        
                        console.log('Updated form HTML:', quizForm.outerHTML);
                        
                        // Log the number of blanks after splitting
                        var updatedBlanks = quizForm.querySelectorAll('.blank');
                        console.log('Number of blanks after splitting:', updatedBlanks.length);
                    } else {
                        console.error('Could not find quiz form');
                        
                        // Fall back to the original method
                        var original = para.innerHTML;
                        console.log('Original paragraph HTML:', original);
                        
                        // Log the number of blanks in the original HTML
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = original;
                        var originalBlanks = tempDiv.querySelectorAll('.blank');
                        console.log('Number of blanks in original HTML:', originalBlanks.length);
                        
                        // Check if content contains numbered characters for fallback too
                        var numberedPattern = /[①②③④⑤⑥⑦⑧⑨⑩]/;
                        var sentences = [];
                        
                        if (numberedPattern.test(original)) {
                            // Split by numbered characters
                            console.log('Found numbered characters in fallback, splitting by them');
                            sentences = original.split(/(?=[①②③④⑤⑥⑦⑧⑨⑩])/).filter(function(s) { 
                                return s.trim(); 
                            });
                        } else {
                            // Fall back to splitting by Japanese period
                            console.log('No numbered characters found in fallback, splitting by Japanese periods');
                            sentences = original.split('。').filter(function(s) { 
                                return s; 
                            }).map(function(s) { 
                                return s + '。'; 
                            });
                        }
                        
                        console.log('Split sentences (fallback):', sentences.length);
                        
                        para.innerHTML = sentences.map(function(s) { return '<div>' + s + '</div>'; }).join('');
                        console.log('Updated paragraph HTML (fallback):', para.innerHTML);
                    }
                    
                    // Initialize the answer paragraph - but we'll create the content at display time
                    // to ensure we get the fully processed quiz structure
                }
                // Initialize drag-drop
                initializeDragAndDrop();
            });

            // Set up EdX bindings
            if (channel) {
                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
                channel.bind('reset', resetQuiz);
            }
            
            // Listen for messages from parent (Check button)
            window.addEventListener('message', function(event) {
                console.log('🔄 Received message:', event.data);
                
                // Handle JSChannel messages (from EdX)
                if (event.data && event.data.method === 'JSInput::getGrade') {
                    console.log('🔄 Processing JSChannel getGrade - showing answers');
                    getGrade();
                    return;
                }
                
                // Process postMessage from parent window or problem.html
                if (event.source !== window.parent && event.source !== window) {
                    return;
                }
                
                console.log('🔄 Received postMessage from parent:', event.data);
                console.log('🔄 Message type:', event.data?.type);
                
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
                
                // Legacy support for simple reset message
                if (event.data && event.data.type === 'reset') {
                    console.log('🔄 Received reset message from parent window');
                    resetQuiz();
                }
            });
        })();
    </script>
</body>
</html>`; 
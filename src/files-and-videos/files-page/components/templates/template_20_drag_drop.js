import { TEMPLATE_IDS } from './templateUtils';

// Function to generate drag drop quiz template
export const getDragDropQuizTemplate = function(paragraphText, wordBank, instructions = '単語を正しい場所にドラッグしてください。') {
    const result = dragDropQuizTemplateString
        .replace('{{PARAGRAPH_TEXT}}', paragraphText)
        .replace('{{WORD_BANK}}', wordBank)
        .replace('{{INSTRUCTIONS}}', instructions);
    
    return result;
};

// Template string with placeholders for furigana processing
const dragDropQuizTemplateString = `<!DOCTYPE html>
<html>
<head>
    <title>Drag and Drop Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"></script>
    <style>
        /* CSS Reset for cross-browser compatibility */
        * { 
            box-sizing: border-box; 
        }
        
        body {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            margin: 0;
            padding: 0;
            line-height: 1.8;
            color: #414141;
            height: 100%;
            position: relative;
            letter-spacing: 0.05em;
            width: 100%;
        }
        .container {
            padding: 0.1rem;
            position: relative;
            height: 100%;
            background-color: white;
            width: 100%;
            margin: 0;
            text-align: left;
        }
        .paragraph {
            background-color: white;
            padding: 0.5rem;
            margin-bottom: 1rem;
            font-size: 1.2rem;
            line-height: 1.6;
            position: relative;
            z-index: 1;
            border-radius: 4px;
            letter-spacing: 0.4px;
            text-align: left;
        }
        
        .word-bank {
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
            margin: 0.5rem 0;
            padding: 0.2rem;
            background-color: transparent;
            border-radius: 0;
            justify-content: flex-start;
            align-items: center;
        }
        .draggable-word {
            padding: 0.4rem 0.8rem;
            background-color: #0075b4;
            color: white;
            border-radius: 4px;
            cursor: move;
            user-select: none;
            transition: background-color 0.2s;
            font-size: 1.2rem;
            min-width: 60px;
            text-align: left;
            letter-spacing: 0.05em;
            margin: 0.2rem;
            width: auto;
            height: auto;
            display: inline-block;
            flex-shrink: 0;
            white-space: nowrap;
        }
        .draggable-word:hover {
            background-color: #005a8c;
        }
        .draggable-word.dragging {
            opacity: 0.5;
        }
        .blank {
            display: inline-block;
            min-width: 60px;
            min-height: 35px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin: 0 0.3rem;
            vertical-align: middle;
            background-color: white;
            text-align: left;
            line-height: 1.4;
            font-size: 1.2rem;
            position: relative;
            letter-spacing: 0.05em;
            padding: 8px 12px;
            width: auto;
            height: auto;
        }
        .blank.dragover {
            background-color: #f0f8ff;
            border-color: #0075b4;
            border-style: solid;
        }
        .blank.filled {
            border-style: solid;
            border-color: #ccc;
            background-color: white;
            color: #000;
        }
        .blank.incorrect {
            border-color: #b40000 !important;
            background-color: #f9ecec !important;
        }
        
        /* Universal incorrect styling for cross-browser compatibility */
        .incorrect, 
        .quiz-word.incorrect,
        .feedback-replacement .quiz-word.incorrect,
        .blank.show-feedback .quiz-word.incorrect {
            background: #b40000 !important;
            background-color: #b40000 !important;
            color: #fff !important;
            border: none !important;
            outline: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
        }
        .blank.show-feedback {
            position: relative;
            display: inline-block;
            margin: 0 0.3rem;
            vertical-align: middle;
        }
        .blank.show-feedback .answer-container {
            display: flex;
            gap: 0.2rem;
            align-items: center;
            min-width: 80px;
        }
        .blank.show-feedback .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-weight: bold;
            font-size: 1.2rem;
            text-align: left;
            min-width: 50px;
            letter-spacing: 0.05em;
        }
        .blank.show-feedback .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .blank.show-feedback .quiz-word.incorrect {
            background: #b40000 !important;
            background-color: #b40000 !important;
            color: #fff !important;
            border: none !important;
            outline: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
        }
        .feedback-replacement {
            display: inline-block;
            margin: 0 0.3rem;
            vertical-align: middle;
        }
        .feedback-replacement .answer-container {
            display: flex;
            gap: 0.2rem;
            align-items: center;
            min-width: 80px;
        }
        .feedback-replacement .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-weight: bold;
            font-size: 1.2rem;
            text-align: left;
            min-width: 50px;
            letter-spacing: 0.05em;
        }
        .feedback-replacement .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .feedback-replacement .quiz-word.incorrect {
            background: #b40000 !important;
            background-color: #b40000 !important;
            color: #fff !important;
            border: none !important;
            outline: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
        }
        .buttons {
            margin: 1rem 0;
        }
        #feedback {
            margin: 1rem 0;
            padding: 1rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1.2rem;
            letter-spacing: 0.05em;
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
            font-size: 1.2rem;
            letter-spacing: 0.05em;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            padding: 0.2rem 0.4rem;
            background-color: #ecf3ec;
            border-radius: 3px;
        }
        .wrong-answer {
            color: #b40000 !important;
            padding: 0.2rem 0.4rem;
            background-color: #f9ecec !important;
            border-radius: 3px;
            margin-right: 0.3rem;
            border: none !important;
            outline: none !important;
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
            font-size: 1.2rem;
            background: #f9ecec !important;
            background-color: #f9ecec !important;
            color: #b40000 !important;
            border: 1px solid #ebccd1 !important;
        }
        .answer-feedback.success {
            background: #ecf3ec;
            color: #2e7d32;
            border: 1px solid #c5e0c5;
        }
        .answer-paragraph {
            margin: 0;
            background-color: #ffffff;
            line-height: 2.16;
            box-shadow: none;
            border-radius: 3px;
            padding: 0;
            font-size: 1.2rem;
            display: block;
            letter-spacing: 0.05em;
        }
        .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.02em 0.1em;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            box-sizing: border-box;
            font-size: 1.2rem;
            letter-spacing: 0.05em;
        }
        .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .quiz-word.incorrect {
            background: #b40000 !important;
            background-color: #b40000 !important;
            color: #fff !important;
            border: none !important;
            outline: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
        }
        .answer-blank {
            display: inline-block;
            margin: 0 0.3rem;
            vertical-align: middle;
            min-width: 80px;
            text-align: left;
            font-size: 1.2rem;
            letter-spacing: 0.05em;
        }
        .answer-blank .quiz-word {
            margin: 0 0.1rem;
            padding: 0.3rem 0.5rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1.2rem;
            letter-spacing: 0.05em;
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
            font-size: 1.2rem;
            letter-spacing: 0.05em;
        }
        .instructor-content {
            font-size: 1.2rem;
            line-height: 1.6;
            color: #333;
            letter-spacing: 0.05em;
        }
        .instructor-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 3px;
            padding: 0.5rem;
            margin-top: 0.5rem;
            font-size: 1.2rem;
            color: #856404;
        }
        .instructions {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.5;
            text-align: left;
            background-color: white;
            color: #333;
            font-style: italic;
            margin: 0 0 20px 0;
            letter-spacing: 0.3px;
        }
        .instructions:before {
            display: none;
        }
        #answer-paragraph form > div {
            margin-bottom: 1rem;
            line-height: 2.16;
            font-size: 1.2rem;
            letter-spacing: 0.05em;
        }
        
        /* Furigana styling */
        ruby { 
            font-size: 1.2rem !important; 
        }
        rt { 
            font-size: 0.8rem !important; 
            color: #666; 
        }
        
        /* Furigana styling for draggable words */
        .draggable-word ruby { 
            font-size: 1.2rem !important; 
        }
        .draggable-word rt { 
            font-size: 0.8rem !important; 
            color: #fff !important; 
            opacity: 0.9;
        }
        
        /* Furigana styling for correct boxes (blue background) */
        .correct-box rt,
        .correct-box ruby rt,
        .quiz-word.correct rt,
        .quiz-word.correct ruby rt { 
            color: #fff !important; 
            font-size: 0.8rem !important;
        }
        
        /* Ensure furigana in draggable words is white */
        .draggable-word rt,
        .draggable-word ruby rt {
            color: #fff !important;
            opacity: 0.9 !important;
        }
        
        /* Furigana styling for blank content */
        .blank ruby { 
            font-size: 1.2rem !important; 
        }
        .blank rt { 
            font-size: 0.8rem !important; 
            color: #333 !important; 
            opacity: 0.8;
        }
        
        /* Furigana styling for incorrect answers (red boxes) */
        .blank.incorrect ruby { 
            font-size: 1.2rem !important; 
        }
        .blank.incorrect rt { 
            font-size: 0.8rem !important; 
            color: #fff !important; 
            opacity: 0.9;
        }
        
        /* Furigana styling for quiz words in feedback */
        .quiz-word.incorrect ruby { 
            font-size: 1.2rem !important; 
        }
        .quiz-word.incorrect rt { 
            font-size: 0.8rem !important; 
            color: #fff !important; 
            opacity: 0.9;
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
                // Store both textContent and innerHTML for proper handling
                e.dataTransfer.setData('text/plain', e.target.textContent);
                e.dataTransfer.setData('text/html', e.target.innerHTML);
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
                e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
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
                const wordHTML = e.dataTransfer.getData('text/html');
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
                        fromBlank.innerHTML = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }

                // Store the answer (use HTML version if available, otherwise text)
                const answerToStore = wordHTML || word;
                state.answers[blankId] = answerToStore;

                // Update the blank's appearance - use innerHTML to preserve furigana
                blank.innerHTML = answerToStore;
                blank.classList.add('filled');

                // Hide the dragged word from the word bank if it exists there
                // Compare using textContent to find the original word without furigana
                const draggedWord = Array.from(document.querySelectorAll('.draggable-word')).find(w => {
                    // Extract text content without HTML tags for comparison
                    const textContent = w.textContent || w.innerText;
                    return textContent === word || textContent === word.replace(/<[^>]*>/g, '');
                });
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
                        fromBlank.innerHTML = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }
                restoreWordToBank(word);
            }

            function restoreWordToBank(word) {
                // Compare using textContent to find the original word without furigana
                const wordElement = Array.from(document.querySelectorAll('.draggable-word')).find(w => {
                    const textContent = w.textContent || w.innerText;
                    return textContent === word || textContent === word.replace(/<[^>]*>/g, '');
                });
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
                    // Get the original quiz form
                    const quizForm = document.getElementById('quizForm');
                    
                    // Get all blanks in the original form
                    const blanks = quizForm.querySelectorAll('.blank');
                    
                    // Process each blank to show feedback directly
                    blanks.forEach((blank, index) => {
                        const blankId = blank.id;
                        
                        if (!blankId) {
                            return;
                        }
                        
                        const userAnswer = state.answers[blankId];
                        const correctAnswer = correctAnswers[blankId];
                        
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
                            // User didn't answer - show red box with 未回答 and correct answer
                            answerContainer.innerHTML = 
                                '<span class="quiz-word incorrect">未回答</span>' + 
                                ' <span class="quiz-word correct">' + correctAnswer + '</span>';
                        }
                        
                        // Add answer container to replacement
                        replacement.appendChild(answerContainer);
                        
                        // Replace the entire blank element with the new replacement
                        blank.parentNode.replaceChild(replacement, blank);
                    });
                } catch (error) {
                    console.error('Error in updateDisplay:', error);
                }
            }

            function getGrade() {
                // Always show feedback when submitted
                const showFlag = document.getElementById('showAnswerFlag');
                
                // Calculate results
                const result = calculateResults();
                
                // Always show feedback when submitted
                state.showAnswer = true;
                updateDisplay(result);
                showFlag.value = 'true';
                
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
                
                return JSON.stringify(returnValue);
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
                return JSON.stringify({
                    answers: state.answers,
                    attempts: state.attempts,
                    score: state.score,
                    showAnswer: state.showAnswer
                });
            }

            function resetQuiz() {
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
                    newBlank.innerHTML = '';
                    
                    // Replace the feedback replacement with the original blank
                    parent.replaceChild(newBlank, replacement);
                });
                
                // Clear all existing blanks
                const existingBlanks = quizForm.querySelectorAll('.blank');
                existingBlanks.forEach(blank => {
                    blank.innerHTML = '';
                    blank.classList.remove('filled', 'incorrect', 'show-feedback', 'correct', 'wrong');
                });
                
                // Show all words in word bank
                const draggableWords = document.querySelectorAll('.draggable-word');
                draggableWords.forEach(word => {
                    word.style.display = '';
                });
                
                // Re-initialize drag and drop
                initializeDragAndDrop();
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
                                    // Use innerHTML to preserve furigana
                                    blank.innerHTML = word;
                                    blank.classList.add('filled');
                                    
                                    // Hide the corresponding word in the word bank
                                    // Extract text content for comparison
                                    const textContent = word.replace(/<[^>]*>/g, '');
                                    const wordElement = Array.from(document.querySelectorAll('.draggable-word'))
                                        .find(el => {
                                            const elTextContent = el.textContent || el.innerText;
                                            return elTextContent === textContent;
                                        });
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
                                    newBlank.innerHTML = userAnswer;
                                    newBlank.classList.add('filled');
                                } else {
                                    newBlank.innerHTML = '';
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
                    // Get the quiz form directly instead of manipulating the HTML string
                    var quizForm = para.querySelector('#quizForm');
                    
                    if (quizForm) {
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
                        
                        // Check if content contains numbered characters (①②③...)
                        var numberedPattern = /[①②③④⑤⑥⑦⑧⑨⑩➂➃➄➅➆➇➈➉]/;
                        var sentences = [];
                        
                        if (numberedPattern.test(formContent)) {
                            // Split by numbered characters
                            sentences = formContent.split(/(?=[①②③④⑤⑥⑦⑧⑨⑩➂➃➄➅➆➇➈➉])/).filter(function(s) { 
                                return s.trim(); 
                            });
                        } else {
                            // Check if content contains dialogue pattern (period followed by any word and colon)
                            var dialoguePattern = /。[^：。]+：/;
                            if (dialoguePattern.test(formContent)) {
                                // Split by dialogue pattern (after period, before word and colon)
                                sentences = formContent.split(/(?<=。)(?=[^：。]+：)/).filter(function(s) { 
                                    return s.trim(); 
                                });
                            } else {
                                // For non-numbered content, don't split - keep as single sentence
                                sentences = [formContent];
                            }
                        }
                        
                        // Wrap each sentence in a div
                        var wrappedContent = sentences.map(function(s) {
                            return '<div>' + s + '</div>';
                        }).join('');
                        
                        // Reconstruct the form with the wrapped sentences and the word bank
                        quizForm.innerHTML = wrappedContent + wordBankHTML + hiddenInputHTML;
                        
                    } else {
                        // Fall back to the original method
                        var original = para.innerHTML;
                        
                        // Check if content contains numbered characters for fallback too
                        var numberedPattern = /[①②③④⑤⑥⑦⑧⑨⑩➂➃➄➅➆➇➈➉]/;
                        var sentences = [];
                        
                        if (numberedPattern.test(original)) {
                            // Split by numbered characters
                            sentences = original.split(/(?=[①②③④⑤⑥⑦⑧⑨⑩➂➃➄➅➆➇➈➉])/).filter(function(s) { 
                                return s.trim(); 
                            });
                        } else {
                            // Check if content contains dialogue pattern (period followed by any word and colon)
                            var dialoguePattern = /。[^：。]+：/;
                            if (dialoguePattern.test(original)) {
                                // Split by dialogue pattern (after period, before word and colon)
                                sentences = original.split(/(?<=。)(?=[^：。]+：)/).filter(function(s) { 
                                    return s.trim(); 
                                });
                            } else {
                                // For non-numbered content, don't split - keep as single sentence
                                sentences = [original];
                            }
                        }
                        
                        para.innerHTML = sentences.map(function(s) { return '<div>' + s + '</div>'; }).join('');
                    }
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
                // Handle JSChannel messages (from EdX)
                if (event.data && event.data.method === 'JSInput::getGrade') {
                    getGrade();
                    return;
                }
                
                // Process postMessage from parent window or problem.html
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
                
                // Legacy support for simple reset message
                if (event.data && event.data.type === 'reset') {
                    resetQuiz();
                }
            });
            
            // Send timer.start message after template loads (template 20 - no audio, start immediately)
            function sendTimerStart() {
                try {
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'timer.start',
                            templateId: 20,
                            unitId: window.location.href.match(/unit[\/=]([^\/\?&]+)/)?.[1] || ''
                        }, '*');
                        console.log('✅ Sent timer.start message to parent (template 20 - after load)');
                    }
                } catch (error) {
                    console.error('Error sending timer.start message:', error);
                }
            }
            
            // Send timer.start message when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', sendTimerStart);
            } else {
                // DOM already loaded, send immediately
                sendTimerStart();
            }
            
            // Also send on window load as fallback
            window.addEventListener('load', function() {
                setTimeout(sendTimerStart, 100);
            });
        })();
    </script>
</body>
</html>`; 

// Export the original template for backward compatibility
export const dragDropQuizTemplate = dragDropQuizTemplateString;
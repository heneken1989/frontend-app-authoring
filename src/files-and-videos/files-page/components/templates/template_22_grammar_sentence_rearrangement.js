import { TEMPLATE_IDS } from './templateUtils';

// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    return text.replace(/([一-龯]+)\(([^)]+)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
}

// Template ID: TEMPLATE_IDS.GRAMMAR_SENTENCE_REARRANGEMENT
export const getGrammarSentenceRearrangementTemplate = (words, instructions = '正しい順番に並び替えてください。') => {
    const blanks = words.map((_, index) => 
        `<div id="blank${index + 1}" class="blank" draggable="false"></div>`
    ).join(' ');

    // Shuffle words using the helper function
    const shuffledWords = [...words];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }

    const wordBankHTML = shuffledWords.map(word => 
        `<div class="draggable-word" draggable="true">${convertFurigana(word)}</div>`
    ).join('');

    return grammarSentenceRearrangementTemplate
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{PARAGRAPH_TEXT}}', blanks)
        .replace('{{WORD_BANK}}', wordBankHTML)
        .replace('{{CORRECT_SENTENCE}}', convertFurigana(words.join(' ')));
};

const processSentenceRearrangement = (words) => {
    // Create blanks based on number of words
    const blanks = words.map((_, index) => 
        `<div id="blank${index + 1}" class="blank" draggable="false"></div>`
    ).join(' ');

    // Shuffle words using the helper function
    const shuffledWords = shuffleArray(words);

    // Create word bank HTML with shuffled words
    const wordBankHTML = shuffledWords.map(word => 
        `<div class="draggable-word" draggable="true">${convertFurigana(word)}</div>`
    ).join('');

    return {
        processedParagraph: blanks,
        wordBankHTML
    };
};

export const grammarSentenceRearrangementTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Grammar Sentence Rearrangement Quiz</title>
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
            font-size: 1.3rem;
            line-height: 2;
            position: relative;
            z-index: 1;
            border-radius: 4px;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            align-items: center;
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
            font-size: 1.2rem;
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
            margin: 0 0.2rem;
            vertical-align: middle;
            background-color: white;
            text-align: center;
            line-height: 45px;
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
        .instructions {
            font-style: italic;
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 1rem;
            padding: 0.8rem;
            background-color: #f8f9fa;
            border-left: 4px solid #0075b4;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions">{{INSTRUCTIONS}}</div>
        <div class="paragraph">
            <form id="quizForm" onsubmit="return false;">
                {{PARAGRAPH_TEXT}}
                <div class="word-bank">
                    {{WORD_BANK}}
                </div>
            </form>
        </div>
    </div>

    <script>
        (function() {
            const correctSentence = "{{CORRECT_SENTENCE}}";
            const correctWords = correctSentence.split(' ');
            let state = {
                answers: {},
                score: 0,
                attempts: 0
            };
            
            // Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
            function convertFurigana(text) {
                return text.replace(/([一-龯]+)\(([^)]+)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
            }
            
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

            function shuffleArray(array) {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }

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

                if (blank.textContent.trim()) {
                    if (blank.textContent.trim() !== word) {
                        const wordBank = document.querySelector('.word-bank');
                        const wordElement = document.createElement('div');
                        wordElement.className = 'draggable-word';
                        wordElement.draggable = true;
                        wordElement.textContent = blank.textContent.trim();
                        wordElement.addEventListener('dragstart', handleDragStart);
                        wordElement.addEventListener('dragend', handleDragEnd);
                        wordBank.appendChild(wordElement);
                    }
                }

                if (source === 'blank' && fromBlankId && fromBlankId !== blankId) {
                    const fromBlank = document.getElementById(fromBlankId);
                    if (fromBlank) {
                        fromBlank.textContent = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }

                state.answers[blankId] = word;
                blank.textContent = word;
                blank.classList.add('filled');

                const draggedWord = Array.from(document.querySelectorAll('.draggable-word')).find(w => w.textContent === word);
                if (draggedWord) {
                    draggedWord.remove();
                }
            }

            function handleDropToWordBank(e) {
                e.preventDefault();
                const word = e.dataTransfer.getData('text/plain');
                const source = e.dataTransfer.getData('source');
                const fromBlankId = e.dataTransfer.getData('blankId');
                
                if (source === 'blank' && fromBlankId) {
                    const fromBlank = document.getElementById(fromBlankId);
                    if (fromBlank) {
                        fromBlank.textContent = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }
                
                // Get all visible words in the word bank
                const wordBank = document.querySelector('.word-bank');
                const visibleWords = Array.from(wordBank.querySelectorAll('.draggable-word'))
                    .filter(w => w.style.display !== 'none')
                    .map(w => w.textContent);
                
                // Add the returned word and shuffle all visible words
                visibleWords.push(word);
                const shuffledWords = shuffleArray(visibleWords);
                
                // Remove all existing visible words
                Array.from(wordBank.querySelectorAll('.draggable-word'))
                    .filter(w => w.style.display !== 'none')
                    .forEach(w => w.remove());
                
                // Add shuffled words back to word bank
                shuffledWords.forEach(w => {
                    const wordElement = document.createElement('div');
                    wordElement.className = 'draggable-word';
                    wordElement.draggable = true;
                    wordElement.textContent = w;
                    wordElement.addEventListener('dragstart', handleDragStart);
                    wordElement.addEventListener('dragend', handleDragEnd);
                    wordBank.appendChild(wordElement);
                });
            }

            function calculateResults() {
                const blanks = document.querySelectorAll('.blank');
                // Keep the exact positions, including empty ones
                const userWords = Array.from(blanks)
                    .map(blank => blank.textContent.trim());

                let correctCount = 0;
                const wordPositions = {};
                
                // First, record the correct position of each word
                correctWords.forEach((word, index) => {
                    wordPositions[word] = index;
                });

                // Check each word's absolute position
                for (let i = 0; i < userWords.length; i++) {
                    const currentWord = userWords[i];
                    const correctPosOfCurrentWord = wordPositions[currentWord];
                    
                    // If this word exists in correct words and is in the correct absolute position
                    if (correctPosOfCurrentWord !== undefined && correctPosOfCurrentWord === i) {
                        correctCount++;
                    }
                }

                // Count filled positions
                const filledWords = userWords.filter(text => text);
                const isCorrect = correctCount === correctWords.length && filledWords.length === correctWords.length;
                const message = isCorrect ? '正解です！' : '不正解です。';

                return {
                    rawScore: isCorrect ? 1 : 0,
                    message,
                    userWords, // Keep original positions including empty ones
                    isCorrect,
                    wordPositions
                };
            }

            function updateDisplay(result) {
                // ✅ SEND QUIZ DATA TO PARENT (PersistentNavigationBar)
                const quizData = {
                    templateId: 22,
                    templateName: 'Grammar Sentence Rearrangement',
                    score: result.rawScore,
                    message: result.message,
                    isCorrect: result.isCorrect,
                    correctWords: correctWords,
                    userWords: result.userWords,
                    wordPositions: result.wordPositions,
                    correctOrder: correctWords.join(' '),
                    userOrder: result.userWords.join(' ')
                };

                console.log('🔍 DEBUG - Template 22 sending quiz data:', quizData);
                
                // Send data to parent window (problem.html)
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'quiz.data.ready',
                        quizData: quizData,
                        templateConfig: {
                            showPopup: true,
                            templateId: 22
                        }
                    }, '*');
                }
            }

            function getGrade() {
                console.log('🎯 getGrade() called - Processing quiz submission');
                
                const result = calculateResults();
                console.log('📊 Quiz results:', result);
                
                // Update display and send data to PersistentNavigationBar
                updateDisplay(result);
                
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
                return JSON.stringify({
                    answers: state.answers,
                    attempts: state.attempts,
                    score: state.score
                });
            }

            function setState(stateStr) {
                try {
                    let newState = JSON.parse(stateStr);
                    state = {
                        answers: newState.answers || {},
                        attempts: newState.attempts || 0,
                        score: newState.score || 0
                    };

                    if (state.answers) {
                        for (let blankId in state.answers) {
                            const blank = document.getElementById(blankId);
                            const word = state.answers[blankId];
                            if (blank && word) {
                                blank.textContent = word;
                                blank.classList.add('filled');
                                
                                const wordElement = Array.from(document.querySelectorAll('.draggable-word'))
                                    .find(el => el.textContent === word);
                                if (wordElement) {
                                    wordElement.remove();
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }

            function resetQuiz() {
                console.log('🔄 Resetting quiz - clearing all answers');
                
                // Clear all answers from state
                state.answers = {};
                state.score = 0;
                state.attempts = 0;
                
                // Clear all blank boxes
                const blanks = document.querySelectorAll('.blank');
                blanks.forEach(blank => {
                    blank.textContent = '';
                    blank.classList.remove('filled', 'correct', 'incorrect');
                });
                
                // Get the word bank container
                const wordBank = document.querySelector('.word-bank');
                if (wordBank) {
                    // Clear existing words
                    wordBank.innerHTML = '';
                    
                    // Recreate word bank with original words (shuffled)
                    const originalWords = correctWords.slice(); // Copy the array
                    for (let i = originalWords.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [originalWords[i], originalWords[j]] = [originalWords[j], originalWords[i]];
                    }
                    
                    // Add words back to word bank
                    originalWords.forEach(word => {
                        const wordElement = document.createElement('div');
                        wordElement.className = 'draggable-word';
                        wordElement.draggable = true;
                        wordElement.innerHTML = convertFurigana(word);
                        wordElement.addEventListener('dragstart', handleDragStart);
                        wordElement.addEventListener('dragend', handleDragEnd);
                        wordBank.appendChild(wordElement);
                    });
                }
                
                // Re-initialize drag and drop
                initializeDragAndDrop();
                
                console.log('✅ Quiz reset completed');
            }

            document.addEventListener('DOMContentLoaded', function() {
                initializeDragAndDrop();
            });

            // Initialize EdX integration
            var channel;
            if (window.parent !== window) {
                channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });

                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
                channel.bind('reset', resetQuiz);
            }

            // Listen for messages from parent window
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
        })();
    </script>
</body>
</html>`; 
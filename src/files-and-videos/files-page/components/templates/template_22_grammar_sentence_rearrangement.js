import { TEMPLATE_IDS } from './templateUtils';

// Template ID: TEMPLATE_IDS.GRAMMAR_SENTENCE_REARRANGEMENT
export const getGrammarSentenceRearrangementTemplate = (words) => {
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
        `<div class="draggable-word" draggable="true">${word}</div>`
    ).join('');

    return grammarSentenceRearrangementTemplate
        .replace('{{PARAGRAPH_TEXT}}', blanks)
        .replace('{{WORD_BANK}}', wordBankHTML)
        .replace('{{CORRECT_SENTENCE}}', words.join(' '));
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
        `<div class="draggable-word" draggable="true">${word}</div>`
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
        #feedback {
            margin: 1rem 0;
            padding: 1rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1.2rem;
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
            font-size: 1.1rem;
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
            font-size: 1.1rem;
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
            font-size: 1.2rem;
            display: block;
        }
        .script-section {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f8f8;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .script-section h3 {
            margin-top: 0;
            color: #414141;
            font-size: 1.1rem;
        }
        .quiz-word {
            display: inline-block;
            margin: 0 0.2rem;
            padding: 0.5rem 0.8rem;
            border-radius: 4px;
            font-weight: bold;
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
        .quiz-word.empty {
            background: #f0f0f0;
            color: #666;
            border: 2px dashed #999;
            text-decoration: none;
            padding: 0.5rem 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
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
            const correctSentence = "{{CORRECT_SENTENCE}}";
            const correctWords = correctSentence.split(' ');
            let state = {
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
                const userWords = Array.from(blanks)
                    .map(blank => blank.textContent.trim())
                    .filter(text => text);

                let correctCount = 0;
                const wordPositions = {};
                
                // First, record the correct position of each word
                correctWords.forEach((word, index) => {
                    wordPositions[word] = index;
                });

                // Check each word's relative position
                for (let i = 0; i < userWords.length; i++) {
                    const currentWord = userWords[i];
                    const correctPosOfCurrentWord = wordPositions[currentWord];
                    
                    // If this word exists in correct words
                    if (correctPosOfCurrentWord !== undefined) {
                        // Check if all words before this one in user's answer are supposed to be before it
                        let isCorrectPosition = true;
                        for (let j = 0; j < i; j++) {
                            const previousWord = userWords[j];
                            const correctPosOfPreviousWord = wordPositions[previousWord];
                            
                            // If a previous word exists and should come after current word, position is wrong
                            if (correctPosOfPreviousWord !== undefined && 
                                correctPosOfPreviousWord > correctPosOfCurrentWord) {
                                isCorrectPosition = false;
                                break;
                            }
                        }
                        if (isCorrectPosition) correctCount++;
                    }
                }

                const isCorrect = correctCount === correctWords.length && userWords.length === correctWords.length;
                const message = isCorrect ? '正解です！' : '不正解です。';

                return {
                    rawScore: isCorrect ? 1 : 0,
                    message,
                    userWords,
                    isCorrect,
                    wordPositions
                };
            }

            function updateDisplay(result) {
                const answerParagraph = document.getElementById('answer-paragraph');
                const answerContainer = document.getElementById('answer-paragraph-container');
                const feedbackDiv = document.getElementById('feedback');
                
                feedbackDiv.textContent = result.message;
                feedbackDiv.className = result.isCorrect ? 'answer-feedback success' : 'answer-feedback';

                // Create answer display container
                const answerDisplay = document.createElement('div');
                
                // Show correct order first
                const correctOrderDiv = document.createElement('div');
                correctOrderDiv.style.marginBottom = '1.5rem';
                correctOrderDiv.innerHTML = '<strong>正しい順序:</strong><br>';
                correctWords.forEach(word => {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'quiz-word correct';
                    wordSpan.textContent = word;
                    correctOrderDiv.appendChild(wordSpan);
                });
                answerDisplay.appendChild(correctOrderDiv);

                // Show user's answer
                const userAnswerDiv = document.createElement('div');
                userAnswerDiv.innerHTML = '<strong>あなたの答え:</strong><br>';
                
                // Create a map of filled positions
                const filledPositions = new Set();
                result.userWords.forEach((word, index) => {
                    if (word.trim() !== '') {
                        filledPositions.add(index);
                    }
                });

                // Show all positions, including empty ones
                for (let i = 0; i < correctWords.length; i++) {
                    const wordSpan = document.createElement('span');
                    
                    if (filledPositions.has(i)) {
                        const word = result.userWords[i];
                        wordSpan.className = 'quiz-word';
                        
                        // Check if this word is in correct relative position
                        const correctPosOfCurrentWord = result.wordPositions[word];
                        let isCorrectPosition = false;
                        
                        if (correctPosOfCurrentWord !== undefined) {
                            isCorrectPosition = true;
                            // Check all previous words
                            for (let j = 0; j < i; j++) {
                                const previousWord = result.userWords[j];
                                const correctPosOfPreviousWord = result.wordPositions[previousWord];
                                
                                // If a previous word exists and should come after current word, position is wrong
                                if (correctPosOfPreviousWord !== undefined && 
                                    correctPosOfPreviousWord > correctPosOfCurrentWord) {
                                    isCorrectPosition = false;
                                    break;
                                }
                            }
                        }
                        
                        wordSpan.className += isCorrectPosition ? ' correct' : ' incorrect';
                        wordSpan.textContent = word;
                    } else {
                        // Show empty slot
                        wordSpan.className = 'quiz-word empty';
                        wordSpan.textContent = '＿＿＿';
                    }
                    userAnswerDiv.appendChild(wordSpan);
                    
                    // Add space between words
                    if (i < correctWords.length - 1) {
                        userAnswerDiv.appendChild(document.createTextNode(' '));
                    }
                }
                answerDisplay.appendChild(userAnswerDiv);

                // Clear and update answer paragraph
                answerParagraph.innerHTML = '';
                answerParagraph.appendChild(answerDisplay);

                // Show/hide the answer container
                answerContainer.style.display = state.showAnswer ? 'block' : 'none';
            }

            function getGrade() {
                console.log('🎯 getGrade() called - Processing quiz submission');
                
                const answerContainer = document.getElementById('answer-paragraph-container');
                const showFlag = document.getElementById('showAnswerFlag');
                const isVisible = answerContainer.style.display === 'block';

                if (isVisible) {
                    answerContainer.style.display = 'none';
                    showFlag.value = 'false';
                    state.showAnswer = false;
                    console.log('📱 Hiding answer container');
                } else {
                    const result = calculateResults();
                    updateDisplay(result);
                    answerContainer.style.display = 'block';
                    showFlag.value = 'true';
                    state.showAnswer = true;
                    console.log('📱 Showing answer container');
                }

                const result = calculateResults();
                console.log('📊 Quiz results:', result);
                
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
                return JSON.stringify(state);
            }

            function setState(stateStr) {
                try {
                    let newState = JSON.parse(stateStr);
                    state = {
                        answers: newState.answers || {},
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
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
            }
        })();
    </script>
</body>
</html>`; 
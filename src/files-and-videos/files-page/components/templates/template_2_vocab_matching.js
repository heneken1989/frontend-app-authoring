import { TEMPLATE_IDS } from './templateUtils';

export const getVocabMatchingTemplate = (imageFile, dropZones, words, instructions = '画像の正しい位置に単語をドラッグしてください。') => {
    const correctAnswers = {};
    dropZones.forEach((zone, index) => {
        correctAnswers[`zone${index}`] = zone.answer;
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Vocabulary Matching Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"></script>
    <style>
        body {
            font-family: 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.8;
            color: #414141;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .instructions {
            margin-bottom: 20px;
            padding: 10px;
            background: #f8f9fa;
            border-left: 4px solid #0075b4;
            font-style: italic;
        }
        .quiz-area {
            position: relative;
            margin-bottom: 20px;
        }
        .image-container {
            position: relative;
            display: inline-block;
            margin-bottom: 20px;
            overflow: hidden;
            background-color: #fff;
        }
        .quiz-image {
            max-width: 100%;
            display: block;
            background-color: #fff;
        }
        .drop-zone {
            position: absolute;
            width: 100px;
            height: 40px;
            border: 2px dashed #0075b4;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 4px;
        }
        .drop-zone.dragover {
            background: rgba(0, 117, 180, 0.1);
            border-style: solid;
        }
        .drop-zone.correct {
            border-color: #2e7d32;
            background: rgba(46, 125, 50, 0.1);
            border-style: solid;
        }
        .drop-zone.incorrect {
            border-color: #b40000;
            background: rgba(180, 0, 0, 0.1);
            border-style: solid;
        }
        .word-bank {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .draggable-word {
            padding: 8px 16px;
            background: #0075b4;
            color: white;
            border-radius: 4px;
            cursor: move;
            user-select: none;
            transition: all 0.3s ease;
        }
        .draggable-word:hover {
            background: #005a8c;
        }
        .draggable-word.dragging {
            opacity: 0.5;
        }
        .answer-container {
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
        .score {
            margin-bottom: 1rem;
            padding: 0.8rem 1rem;
            border-radius: 3px;
            font-weight: bold;
            font-size: 1.1rem;
            background: #f9ecec;
            color: #b40000;
            border: 1px solid #ebccd1;
        }
        .score.perfect {
            background: #ecf3ec;
            color: #2e7d32;
            border: 1px solid #c5e0c5;
        }
        .answer-image-container {
            margin-top: 0;
            background-color: #ffffff;
            line-height: 1.6;
            box-shadow: none;
            padding: 0;
            font-size: 1.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .answer-image-container img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }
        .answer-image-wrapper {
            position: relative;
            display: inline-block;
        }
        .answer-zone {
            position: absolute;
            width: 100px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            border-radius: 4px;
            margin: 0 0.2rem;
            padding: 0.5rem 0.8rem;
            font-weight: bold;
        }
        .answer-zone.correct {
            background: #ecf3ec;
            color: #2e7d32;
            border: 1px solid #c5e0c5;
        }
        .answer-zone.incorrect {
            background: #f9ecec;
            color: #b40000;
            border: 1px solid #ebccd1;
        }
        .answer-zone .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            margin-right: 0.5rem;
        }
        .answer-zone .correct-answer {
            color: #2e7d32;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions">${instructions}</div>
        <div class="quiz-area">
            <div class="image-container">
                <img src="${imageFile}" alt="Quiz" class="quiz-image">
                ${dropZones.map((zone, index) => `
                    <div class="drop-zone" 
                         id="zone${index}"
                         data-correct="${zone.answer}"
                         style="left: ${zone.x}px; top: ${zone.y}px;"
                         draggable="false"
                    ></div>
                `).join('')}
            </div>
            <div class="word-bank">
                ${words.map(word => `
                    <div class="draggable-word" draggable="true">${word}</div>
                `).join('')}
            </div>
        </div>
        <div class="answer-container">
            <div class="answer-paragraph-inner">
                <div class="score"></div>
                <div class="answer-image-container">
                    <div class="answer-image-wrapper">
                        <img src="${imageFile}" alt="Answer" class="quiz-image">
                        ${dropZones.map((zone, index) => `
                            <div class="answer-zone"
                                 style="left: ${zone.x}px; top: ${zone.y}px;">
                                ${zone.answer}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
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

        const correctAnswers = ${JSON.stringify(correctAnswers)};

        function initDragAndDrop() {
            const words = document.querySelectorAll('.draggable-word');
            const zones = document.querySelectorAll('.drop-zone');
            const wordBank = document.querySelector('.word-bank');

            words.forEach(word => {
                word.addEventListener('dragstart', handleDragStart);
                word.addEventListener('dragend', handleDragEnd);
            });

            zones.forEach(zone => {
                zone.addEventListener('dragstart', handleBlankDragStart);
                zone.addEventListener('dragend', handleBlankDragEnd);
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('dragleave', handleDragLeave);
                zone.addEventListener('drop', handleDrop);
                zone.setAttribute('draggable', 'true');
            });

            wordBank.addEventListener('dragover', handleDragOver);
            wordBank.addEventListener('dragleave', handleDragLeave);
            wordBank.addEventListener('drop', handleDropToBank);
        }

        function handleBlankDragStart(e) {
            if (!e.target.textContent.trim()) return;
            
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.dataTransfer.setData('source', 'blank');
            e.dataTransfer.setData('sourceId', e.target.id);
        }

        function handleBlankDragEnd(e) {
            e.target.classList.remove('dragging');
        }

        function handleDragStart(e) {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.dataTransfer.setData('source', 'word-bank');
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }

        function handleDragOver(e) {
            e.preventDefault();
            if (e.target.classList.contains('drop-zone') || e.target.classList.contains('word-bank')) {
                e.target.classList.add('dragover');
            }
        }

        function handleDragLeave(e) {
            if (e.target.classList.contains('drop-zone') || e.target.classList.contains('word-bank')) {
                e.target.classList.remove('dragover');
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            const zone = e.target;
            zone.classList.remove('dragover');

            const word = e.dataTransfer.getData('text/plain');
            const source = e.dataTransfer.getData('source');
            const sourceId = e.dataTransfer.getData('sourceId');

            // If the word is coming from another blank
            if (source === 'blank' && sourceId && sourceId !== zone.id) {
                const sourceZone = document.getElementById(sourceId);
                if (sourceZone) {
                    // If target zone already has a word, swap them
                    if (zone.textContent.trim()) {
                        const targetWord = zone.textContent;
                        sourceZone.textContent = targetWord;
                        state.answers[sourceId] = targetWord;
                    } else {
                        sourceZone.textContent = '';
                        delete state.answers[sourceId];
                    }
                }
            } else if (source === 'word-bank') {
                // If dropping from word bank and target has word, return it to bank
                if (zone.textContent.trim()) {
                    returnWordToBank(zone.textContent);
                }
                hideWordInBank(word);
            }

            // Update the target zone
            zone.textContent = word;
            state.answers[zone.id] = word;
            zone.classList.remove('correct', 'incorrect');
        }

        function handleDropToBank(e) {
            e.preventDefault();
            const word = e.dataTransfer.getData('text/plain');
            const source = e.dataTransfer.getData('source');
            const sourceId = e.dataTransfer.getData('sourceId');

            // If word comes from a blank, clear that blank
            if (source === 'blank' && sourceId) {
                const sourceZone = document.getElementById(sourceId);
                if (sourceZone) {
                    sourceZone.textContent = '';
                    sourceZone.classList.remove('correct', 'incorrect');
                    delete state.answers[sourceId];
                }
            }

            returnWordToBank(word);
            e.target.classList.remove('dragover');
        }

        function hideWordInBank(word) {
            const wordElements = document.querySelectorAll('.draggable-word');
            wordElements.forEach(element => {
                if (element.textContent === word) {
                    element.style.display = 'none';
                }
            });
        }

        function returnWordToBank(word) {
            const wordElements = document.querySelectorAll('.draggable-word');
            wordElements.forEach(element => {
                if (element.textContent === word) {
                    element.style.display = '';
                }
            });
        }

        function calculateResults() {
            const zones = document.querySelectorAll('.drop-zone');
            let correctCount = 0;
            let totalQuestions = zones.length;

            zones.forEach(zone => {
                const userAnswer = zone.textContent;
                const correctAnswer = zone.dataset.correct;
                
                if (userAnswer === correctAnswer) {
                    correctCount++;
                }
            });

            const rawScore = correctCount / totalQuestions;
            const message = \`スコア: \${correctCount} / \${totalQuestions}\`;

            state.score = rawScore;
            state.attempts += 1;
            state.showAnswer = true;

            return {
                rawScore,
                message,
                correctCount,
                totalQuestions
            };
        }

        function showResults(result) {
            const answerContainer = document.querySelector('.answer-container');
            const scoreElement = answerContainer.querySelector('.score');

            // Display score
            scoreElement.textContent = result.message;
            scoreElement.className = 'score ' + (result.rawScore === 1 ? 'perfect' : '');

            // Show answer container with slide up animation
            answerContainer.style.display = 'block';
            
            // Update answer zones in the answer container
            const answerZones = answerContainer.querySelectorAll('.answer-zone');
            answerZones.forEach((zone, index) => {
                const zoneId = \`zone\${index}\`;
                const userAnswer = state.answers[zoneId];
                const correctAnswer = correctAnswers[zoneId];
                
                zone.classList.remove('correct', 'incorrect');
                
                if (userAnswer === correctAnswer) {
                    zone.classList.add('correct');
                    zone.innerHTML = \`<span class="correct-answer">\${correctAnswer}</span>\`;
                } else {
                    zone.classList.add('incorrect');
                    if (userAnswer) {
                        // Show wrong answer and correct answer separately
                        zone.innerHTML = \`
                            <span class="wrong-answer">\${userAnswer}</span>
                            <span class="correct-answer">\${correctAnswer}</span>
                        \`;
                    } else {
                        zone.innerHTML = \`<span class="correct-answer">\${correctAnswer}</span>\`;
                    }
                }
            });
        }

        function resetQuiz() {
            const zones = document.querySelectorAll('.drop-zone');
            const words = document.querySelectorAll('.draggable-word');
            const answerContainer = document.querySelector('.answer-container');

            // Reset zones
            zones.forEach(zone => {
                if (zone.textContent) {
                    returnWordToBank(zone.textContent);
                }
                zone.textContent = '';
                zone.classList.remove('correct', 'incorrect');
            });

            // Reset word bank
            words.forEach(word => {
                word.style.display = '';
            });

            // Hide answer container
            answerContainer.style.display = 'none';

            // Reset state
            state.answers = {};
            state.showAnswer = false;
        }

        function getGrade() {
            console.log('🎯 getGrade() called - Processing quiz submission');
            
            const result = calculateResults();
            const answerContainer = document.querySelector('.answer-container');
            const isVisible = answerContainer.style.display === 'block';

            if (isVisible) {
                // Hide answer container
                answerContainer.style.display = 'none';
                state.showAnswer = false;
                console.log('📱 Hiding answer container');
            } else {
                // Show answer container with results
                showResults(result);
                state.showAnswer = true;
                console.log('📱 Showing answer container');
            }
            
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
                const newState = JSON.parse(stateStr);
                state = {
                    answers: newState.answers || {},
                    score: newState.score || 0,
                    attempts: newState.attempts || 0,
                    showAnswer: newState.showAnswer || false
                };

                if (state.showAnswer) {
                    const result = calculateResults();
                    showResults(result);
                }

                // Restore answers
                Object.entries(state.answers).forEach(([zoneId, word]) => {
                    const zone = document.getElementById(zoneId);
                    if (zone && word) {
                        zone.textContent = word;
                        hideWordInBank(word);
                    }
                });
            } catch (e) {
                console.error('Error setting state:', e);
            }
        }

        // Initialize drag and drop when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Initializing drag and drop...');
            initDragAndDrop();
            
            // Shuffle the words in the word bank
            const wordBank = document.querySelector('.word-bank');
            const words = Array.from(wordBank.children);
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                wordBank.appendChild(words[j]);
            }
        });

        // Set up EdX bindings
        if (window.parent !== window) {
            const channel = Channel.build({
                window: window.parent,
                origin: '*',
                scope: 'JSInput'
            });

            channel.bind('getGrade', getGrade);
            channel.bind('getState', getState);
            channel.bind('setState', setState);
        }
    </script>
</body>
</html>
`;
};

export const processVocabMatching = (dropZones, words) => {
    return {
        dropZones: dropZones.map(zone => ({
            x: zone.x,
            y: zone.y,
            answer: zone.answer
        })),
        words: words
    };
}; 
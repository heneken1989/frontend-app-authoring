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
            transform: translate(-50%, -50%);
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
        .feedback-zone {
            position: absolute;
            width: 100px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            border-radius: 4px;
            padding: 0.5rem 0.8rem;
            font-weight: bold;
            border: 2px solid;
            transform: translate(-50%, -50%);
        }
        .feedback-zone.correct {
            background: #ecf3ec;
            color: #2e7d32;
            border-color: #c5e0c5;
        }
        .feedback-zone.incorrect {
            background: #f9ecec;
            color: #b40000;
            border-color: #ebccd1;
        }
        .feedback-zone .wrong-answer {
            color: #b40000;
            margin-right: 0.5rem;
        }
        .feedback-zone .correct-answer {
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
            const imageContainer = document.querySelector('.image-container');
            
            // Create feedback zones on the original image
            const zones = document.querySelectorAll('.drop-zone');
            zones.forEach((zone, index) => {
                const zoneId = \`zone\${index}\`;
                const userAnswer = state.answers[zoneId];
                const correctAnswer = correctAnswers[zoneId];
                
                // Hide the original drop zone
                zone.style.display = 'none';
                
                // Create feedback zone
                const feedbackZone = document.createElement('div');
                feedbackZone.className = 'feedback-zone';
                feedbackZone.id = \`feedback-zone-\${index}\`;
                feedbackZone.style.left = zone.style.left;
                feedbackZone.style.top = zone.style.top;
                
                if (userAnswer === correctAnswer) {
                    feedbackZone.classList.add('correct');
                    feedbackZone.innerHTML = \`<span class="correct-answer">\${correctAnswer}</span>\`;
                } else {
                    feedbackZone.classList.add('incorrect');
                    if (userAnswer) {
                        // Show wrong answer and correct answer separately
                        feedbackZone.innerHTML = \`
                            <span class="wrong-answer">\${userAnswer}</span>
                            <span class="correct-answer">\${correctAnswer}</span>
                        \`;
                    } else {
                        feedbackZone.innerHTML = \`<span class="correct-answer">\${correctAnswer}</span>\`;
                    }
                }
                
                // Add feedback zone to image container
                imageContainer.appendChild(feedbackZone);
            });
        }

        function resetQuiz() {
            console.log('🔄 Resetting quiz to initial state');
            
            const zones = document.querySelectorAll('.drop-zone');
            const words = document.querySelectorAll('.draggable-word');
            const imageContainer = document.querySelector('.image-container');

            // Clear all answers
            state.answers = {};
            state.score = 0;
            state.attempts = 0;
            state.showAnswer = false;

            // Reset zones
            zones.forEach(zone => {
                if (zone.textContent) {
                    returnWordToBank(zone.textContent);
                }
                zone.textContent = '';
                zone.classList.remove('correct', 'incorrect', 'dragover');
                zone.style.display = ''; // Show original zones
            });

            // Remove all feedback zones
            const feedbackZones = document.querySelectorAll('.feedback-zone');
            feedbackZones.forEach(zone => {
                zone.remove(); 
            });

            // Reset word bank
            words.forEach(word => {
                word.style.display = '';
                word.classList.remove('dragging');
            });

            // Re-initialize drag and drop
            initDragAndDrop();
            
            console.log('✅ Quiz reset completed');
        }

        function getGrade() {
            console.log('🎯 getGrade() called - Processing quiz submission');
            
            // Always show feedback when submitted
            const result = calculateResults();
            console.log('📊 Quiz results:', result);
            
            // Always show feedback when submitted
            state.showAnswer = true;
            showResults(result);
            console.log('📱 Showing feedback on original image');
            
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
            return JSON.stringify(state);
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
                    score: newState.score || 0,
                    attempts: newState.attempts || 0,
                    showAnswer: newState.showAnswer || false
                };

                if (state.showAnswer) {
                    const result = calculateResults();
                    showResults(result);
                } else {
                    // Hide feedback if not showing
                    const feedbackZones = document.querySelectorAll('.feedback-zone');
                    const zones = document.querySelectorAll('.drop-zone');
                    
                    feedbackZones.forEach(zone => {
                        zone.remove();
                    });
                    
                    zones.forEach(zone => {
                        zone.style.display = '';
                    });
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
export const getGrammarDropdownTemplate = (questionText, optionsForBlanks, audioFile, startTime = 0, endTime = 0, instructions = '正しい答えを選んでください。', scriptText = '', imageFile = '', answerContent = '') => {
    // Parse the options for each blank
    let blanksOptionsArray = [];
    if (optionsForBlanks && optionsForBlanks.trim()) {
        // If there's no semicolon, use first N words as correct answers in order, rest as wrong options
        if (!optionsForBlanks.includes(';')) {
            const allOptions = optionsForBlanks.split(',').map(o => o.trim()).filter(Boolean);
            // Count number of blanks in answerContent
            const blankCount = (answerContent.match(/（ー）/g) || []).length;
            
            // Take first N words as correct answers (N = number of blanks)
            const correctAnswers = allOptions.slice(0, blankCount);
            // All words can be options (including correct answers)
            // For each blank, create options array with its correct answer first
            blanksOptionsArray = correctAnswers.map((correctAnswer, index) => {
                // Get all options except the current correct answer
                const otherOptions = allOptions.filter(opt => opt !== correctAnswer);
                // Put correct answer first, followed by all other options
                return [correctAnswer, ...otherOptions];
            });
        } else {
            // Original behavior: split by semicolon for different options per blank
            blanksOptionsArray = optionsForBlanks.split(';').map(opt =>
                opt.split(',').map(o => o.trim()).filter(Boolean)
            );
        }
    }

    // Process answer content to replace placeholders with dropdowns
    let answersList = '';
    let answerDropdownIndex = 0;
    
    if (answerContent && answerContent.trim()) {
        const answerLines = answerContent.split('\n').map(line => line.trim()).filter(line => line);
        const processedAnswerLines = answerLines.map((line, lineIndex) => {
            let processedLine = line;
            
            // Process all placeholders in this line
            processedLine = processedLine.replace(/（ー）/g, () => {
                // Get options for this blank
                const options = blanksOptionsArray[answerDropdownIndex] || [];
                const correctAnswer = options[0] || '';
                
                // Sort options alphabetically while keeping the correct answer reference
                const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'ja'));
                
                const optionsHtml = sortedOptions.map(option => `<option value="${option}">${option}</option>`).join('');
                const dropdown = `<select class="answer-select" data-blank-number="${answerDropdownIndex + 1}" data-correct="${correctAnswer}" style="width: auto; min-width: 60px;" required>
                        <option value="" selected disabled></option>
                        ${optionsHtml}
                    </select>`;
                answerDropdownIndex++;
                return dropdown;
            });
            
            return processedLine;
        });
        answersList = processedAnswerLines.map(line => `<div class="answer-item">${line}</div>`).join('\n');
    }

    // Process script text to highlight quoted text in red
    const processedScriptText = scriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    // Build correct answers array for grading
    const correctAnswersArray = blanksOptionsArray.map(opts => opts[0] || '');

    let template = grammarDropdownTemplate
        .replace(/{{ANSWERS_LIST}}/g, answersList)
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    return template;
};

export const grammarDropdownTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Grammar Dropdown Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin: 0; padding: 0; color: #414141; height: auto; position: relative; overflow-y: auto; background-color: white; max-height: 700px; }
        .container { position: relative; height: auto; display: flex; flex-direction: column; gap: 20px; background-color: white; max-height: 700px; overflow-y: auto; padding: 20px; }
        .content-wrapper { background: white; padding: 0; display: flex; flex-direction: column; gap: 20px; }
        .instructions { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; background-color: white; color: #333; font-style: italic; margin: 0; position: relative; padding-left: 20px; }
        .instructions:before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background-color: #0075b4; }
        .select-container { margin: 0; display: flex; flex-direction: column; gap: 8px; padding: 0; background: white; }
        .select-answer-header { font-size: 1rem; color: #333; margin: 0; font-weight: bold; }
        .answer-select { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 0.9rem; font-weight: 400; line-height: 1.3; text-align: left; width: auto; min-width: 60px; border: 1px solid #666; border-radius: 4px; background-color: white; color: #333; cursor: pointer; display: inline-block; padding: 2px 4px; }
        .answer-select:invalid { color: transparent; }
        .answer-select option:first-child { color: transparent; }
        .answer-select:focus { outline: none; border-color: #0075b4; }
        .answer-select option { padding: 4px; font-size: 0.85rem; }
        .answer-select.correct { border-color: #4caf50; background-color: #4caf50; color: #000; font-weight: bold; }
        .answer-select.incorrect { border-color: #f44336; background-color: #f44336; color: #fff; font-weight: bold; }
        .correct-answer { color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px; background-color: #4caf50; display: inline-block; margin: 2px; }
        .wrong-answer { color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px; background-color: #f44336; display: inline-block; margin: 2px; }
        .answer-comparison { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
        .answer-replacement { display: inline-block; }
        .script-highlight { color: #b40000; font-weight: normal; }
        .no-answer { color: #666; border-bottom: 2px solid #666; padding: 0 4px; margin: 0 2px; }
        .answer-item { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin-bottom: 10px; color: #333; }
        .answers-list { padding: 5px; background: white; border-radius: 2px; margin: 5px 0; }
        @media (max-width: 768px) { .container { padding: 15px; gap: 15px; } .content-wrapper { gap: 15px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions" id="quiz-instructions">
            {{INSTRUCTIONS}}
        </div>
        <div class="content-wrapper">
            <form id="quizForm" onsubmit="return false;">
                <div class="select-container">
                    <div class="answers-list">{{ANSWERS_LIST}}</div>
                </div>
            </form>
        </div>
    </div>
    <script>
    (function() {
        var state = { answer: '', score: 0, attempts: 0, showAnswer: false };
        const correctAnswers = JSON.parse('{{CORRECT_ANSWERS}}');
        let selectedAnswers = new Array(correctAnswers.length).fill('');
        let originalDropdowns = []; // Store original dropdowns for restoration
        
        // Configuration for this template
        const templateConfig = {
            showPopup: false,  // This template does not need external popup
            noToggle: true     // This template does not need toggle functionality
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
        function calculateResults() {
            const totalQuestions = document.querySelectorAll('.answer-select').length;
            let correctCount = 0;
            const answers = {};
            document.querySelectorAll('.answer-select').forEach((select, index) => {
                const userAnswer = select.value.trim();
                const correctAnswer = select.getAttribute('data-correct');
                selectedAnswers[index] = userAnswer;
                const isCorrect = correctAnswer === userAnswer;
                if (isCorrect) correctCount++;
                answers[index] = userAnswer;
            });
            const rawScore = totalQuestions > 0 ? correctCount / totalQuestions : 0;
            const message = correctCount === totalQuestions ? '正解です！' : '不正解です。';
            state.answer = JSON.stringify(answers);
            state.score = rawScore;
            state.attempts += 1;
            return { rawScore, message, answers, correctCount, totalQuestions };
        }
        function updateDisplay(result) {
            if (state.showAnswer) {
                // Replace dropdowns with text display in the answers list
                document.querySelectorAll('.answer-select').forEach((select, index) => {
                    const userAnswer = selectedAnswers[index];
                    const correctAnswer = select.getAttribute('data-correct');
                    const isCorrect = correctAnswer === userAnswer;
                    
                    const replacementSpan = document.createElement('span');
                    replacementSpan.className = 'answer-replacement';
                    
                    if (userAnswer) {
                        if (isCorrect) {
                            replacementSpan.innerHTML = '<span class="correct-answer">' + userAnswer + '</span>';
                        } else {
                            replacementSpan.innerHTML = '<span class="wrong-answer">' + userAnswer + '</span> <span class="correct-answer">' + correctAnswer + '</span>';
                        }
                    } else {
                        replacementSpan.innerHTML = '<span class="wrong-answer">未回答</span> <span class="correct-answer">' + correctAnswer + '</span>';
                    }
                    
                    // Replace the dropdown with the text display
                    select.parentNode.replaceChild(replacementSpan, select);
                });
            }
        }
        // Store original dropdowns immediately when page loads
        document.querySelectorAll('.answer-select').forEach(select => {
            originalDropdowns.push(select.cloneNode(true));
        });
        
        document.querySelectorAll('.answer-select').forEach((select, index) => {
            select.addEventListener('change', function() {
                selectedAnswers[index] = this.value;
                if (state.showAnswer) {
                    const result = calculateResults();
                    updateDisplay(result);
                }
            });
        });
        
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
        });
        
        function resetQuiz() {
            console.log('🔄 Starting reset process...');
            
            // Restore original dropdowns
            document.querySelectorAll('.answer-replacement').forEach((replacement, index) => {
                if (originalDropdowns[index]) {
                    const restoredDropdown = originalDropdowns[index].cloneNode(true);
                    restoredDropdown.value = '';
                    replacement.parentNode.replaceChild(restoredDropdown, replacement);
                }
            });
            
            // Clear selected answers
            selectedAnswers = new Array(correctAnswers.length).fill('');
            
            // Reset state completely
            state.answer = '';
            state.score = 0;
            state.showAnswer = false;
            
            // Re-attach event listeners
            document.querySelectorAll('.answer-select').forEach((select, index) => {
                select.addEventListener('change', function() {
                    selectedAnswers[index] = this.value;
                    if (state.showAnswer) {
                        const result = calculateResults();
                        updateDisplay(result);
                    }
                });
            });
            
            console.log('🔄 Quiz reset completed via problem.check message');
        }
        function getGrade() {
            console.log('🎯 getGrade() called - Processing quiz submission');
            
            const result = calculateResults();
            console.log('📊 Quiz results:', result);
            
            // Always show answer when submitted
            state.showAnswer = true;
            updateDisplay(result);
            
            // Call completion API (non-blocking)
            setTimeout(() => {
                try {
                    updateCompletionStatus(result);
                } catch (error) {
                    console.error('Error in updateCompletionStatus:', error);
                }
            }, 100);
            
            // Return data to EdX (prevent reload)
            try {
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
        
        function updateCompletionStatus(result) {
            console.log('🚀 Starting completion API call...');
            
            // Get CSRF token
            let csrfToken = '';
            try {
                // Try multiple sources for CSRF token
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
                    } catch (e) {
                        // Continue to next source
                    }
                }
                
                if (!csrfToken) {
                    console.log('⚠️ No CSRF token found - using fallback');
                    csrfToken = 'rN400a1rY6H0c7Ex86YaiA9ibJbFmEDf'; // Your working token
                }
            } catch (e) {
                console.log('❌ CSRF token search failed:', e.message);
                csrfToken = 'rN400a1rY6H0c7Ex86YaiA9ibJbFmEDf'; // Fallback
            }
            
            // Get block ID from parent URL
            let blockId = 'block-v1:Manabi+N51+2026+type@vertical+block@aea91ffdf79346a2b9d03f6c570ad186'; // Your working block
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
            
            // ✅ DETERMINE COMPLETION STATUS
            // Always mark as complete when user submits (regardless of score)
            const completionStatus = 1.0;  // Always complete when submitted
            
            console.log('📡 Calling completion API with:', {
                block_key: blockId,
                completion: completionStatus,
                score: result.rawScore,
                note: completionStatus === 1.0 ? 'COMPLETE' : 'INCOMPLETE'
            });
            
            // ✅ CALL YOUR WORKING COMPLETION API with dynamic LMS URL
            const lmsBaseUrl = (window.location.hostname === 'localhost' || window.location.hostname.includes('local.openedx.io')) 
                ? 'http://local.openedx.io:8000' 
                : 'https://lms.nihongodrill.com';
            const apiUrl = lmsBaseUrl + '/courseware/mark_block_completion/';
            console.log('🔗 Quiz API URL: ' + apiUrl);
            
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    'block_key': blockId,
                    'completion': completionStatus  // Always 0.0 or 1.0, not raw score
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
                } else {
                    console.log('⚠️ Completion saved but may not affect progress page');
                }
            })
            .catch(error => {
                console.log('❌ Completion API Error:', error.message);
            });
        }
        function getState() {
            return JSON.stringify({ answer: state.answer, attempts: state.attempts, score: state.score, showAnswer: state.showAnswer });
        }
        function setState(stateStr) {
            try {
                const newState = JSON.parse(stateStr);
                state = { answer: newState.answer || '', attempts: newState.attempts || 0, score: newState.score || 0, showAnswer: newState.showAnswer || false };
                if (state.answer) {
                    try {
                        const answers = JSON.parse(state.answer);
                        Object.entries(answers).forEach(([index, value]) => {
                            selectedAnswers[index] = value;
                            const select = document.querySelectorAll('.answer-select')[index];
                            if (select) {
                                select.value = value;
                            }
                        });
                        const result = calculateResults();
                        updateDisplay(result);
                    } catch (e) { console.error('Error parsing answers:', e); }
                }
            } catch (e) { console.error('Error setting state:', e); }
        }
        var channel;
        if (window.parent !== window) {
            channel = Channel.build({ window: window.parent, origin: '*', scope: 'JSInput' });
            channel.bind('getGrade', getGrade);
            channel.bind('getState', getState);
            channel.bind('setState', setState);
        }
    })();
    </script>
</body>
</html>`; 
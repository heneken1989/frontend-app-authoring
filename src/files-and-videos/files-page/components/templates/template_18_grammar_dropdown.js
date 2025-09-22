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

// Browser compatibility check function
function isBrowserSupported() {
    try {
        // Check for basic ES5 support
        if (typeof Array.prototype.map === 'undefined') return false;
        if (typeof Array.prototype.filter === 'undefined') return false;
        if (typeof Array.prototype.forEach === 'undefined') return false;
        
        // Check for DOM support
        if (!document.createElement) return false;
        if (!document.getElementById) return false;
        
        // Check for classList support (IE9+)
        var testDiv = document.createElement('div');
        if (!('classList' in testDiv)) return false;
        
        // Check for addEventListener support (IE9+)
        if (!testDiv.addEventListener) return false;
        
        // Check for querySelector support (IE8+)
        if (!document.querySelector) return false;
        
        return true;
    } catch (e) {
        return false;
    }
}

// HTML escape function for older browsers
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Polyfill for Array.filter for very old browsers
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
        var len = this.length;
        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i];
                if (fun.call(thisp, val, i, this)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}

// Polyfill for Array.map for very old browsers
if (!Array.prototype.map) {
    Array.prototype.map = function(fun) {
        var len = this.length;
        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }
        return res;
    };
}

export const getGrammarDropdownTemplate = function(questionText, optionsForBlanks, audioFile, startTime, endTime, instructions, scriptText, imageFile, answerContent) {
    // Set default values for older browsers
    startTime = startTime || 0;
    endTime = endTime || 0;
    instructions = instructions || '正しい答えを選んでください。';
    scriptText = scriptText || '';
    imageFile = imageFile || '';
    answerContent = answerContent || '';
    
    // Browser compatibility check
    if (!isBrowserSupported()) {
        console.error('Browser không được hỗ trợ. Vui lòng cập nhật trình duyệt.');
        return '<div style="color: red; padding: 20px; text-align: center;">Browser không được hỗ trợ. Vui lòng cập nhật trình duyệt lên phiên bản mới hơn.</div>';
    }
    
    // Parse the options for each blank
    var blanksOptionsArray = [];
    if (optionsForBlanks && optionsForBlanks.trim()) {
        // If there's no semicolon, use first N words as correct answers in order, rest as wrong options
        if (optionsForBlanks.indexOf(';') === -1) {
            var allOptions = optionsForBlanks.split(',');
            for (var i = 0; i < allOptions.length; i++) {
                allOptions[i] = allOptions[i].trim();
            }
            allOptions = allOptions.filter(function(opt) { return opt; });
            
            // Count number of blanks in answerContent
            var blankMatches = answerContent.match(/（ー）/g);
            var blankCount = blankMatches ? blankMatches.length : 0;
            
            // Take first N words as correct answers (N = number of blanks)
            var correctAnswers = allOptions.slice(0, blankCount);
            // All words can be options (including correct answers)
            // For each blank, create options array with its correct answer first
            blanksOptionsArray = [];
            for (var j = 0; j < correctAnswers.length; j++) {
                var correctAnswer = correctAnswers[j];
                // Get all options except the current correct answer
                var otherOptions = [];
                for (var k = 0; k < allOptions.length; k++) {
                    if (allOptions[k] !== correctAnswer) {
                        otherOptions.push(allOptions[k]);
                    }
                }
                // Put correct answer first, followed by all other options
                var optionsForThisBlank = [correctAnswer];
                for (var l = 0; l < otherOptions.length; l++) {
                    optionsForThisBlank.push(otherOptions[l]);
                }
                blanksOptionsArray.push(optionsForThisBlank);
            }
        } else {
            // Original behavior: split by semicolon for different options per blank
            var semicolonSplit = optionsForBlanks.split(';');
            blanksOptionsArray = [];
            for (var m = 0; m < semicolonSplit.length; m++) {
                var commaSplit = semicolonSplit[m].split(',');
                var trimmedOptions = [];
                for (var n = 0; n < commaSplit.length; n++) {
                    var trimmed = commaSplit[n].trim();
                    if (trimmed) {
                        trimmedOptions.push(trimmed);
                    }
                }
                blanksOptionsArray.push(trimmedOptions);
            }
        }
    }

    // Process answer content to replace placeholders with dropdowns
    var answersList = '';
    var answerDropdownIndex = 0;
    
    if (answerContent && answerContent.trim()) {
        var answerLines = answerContent.split('\n');
        for (var i = 0; i < answerLines.length; i++) {
            answerLines[i] = answerLines[i].trim();
        }
        answerLines = answerLines.filter(function(line) { return line; });
        
        var processedAnswerLines = [];
        for (var j = 0; j < answerLines.length; j++) {
            var line = answerLines[j];
            var processedLine = line;
            
            // Process all placeholders in this line
            processedLine = processedLine.replace(/（ー）/g, function() {
                // Get options for this blank
                var options = blanksOptionsArray[answerDropdownIndex] || [];
                var correctAnswer = options[0] || '';
                
                // Sort options alphabetically while keeping the correct answer reference
                var sortedOptions = [];
                for (var k = 0; k < options.length; k++) {
                    sortedOptions.push(options[k]);
                }
                sortedOptions.sort(function(a, b) {
                    try {
                        return a.localeCompare(b, 'ja');
                    } catch (e) {
                        return a.localeCompare(b);
                    }
                });
                
                var optionsHtml = '';
                for (var l = 0; l < sortedOptions.length; l++) {
                    var option = sortedOptions[l];
                    optionsHtml += '<option value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</option>';
                }
                var dropdown = '<select class="answer-select" data-blank-number="' + (answerDropdownIndex + 1) + '" data-correct="' + escapeHtml(correctAnswer) + '" style="width: auto; min-width: 60px;" required>' +
                        '<option value="" selected disabled></option>' +
                        optionsHtml +
                    '</select>';
                answerDropdownIndex++;
                return dropdown;
            });
            
            processedAnswerLines.push(processedLine);
        }
        
        var answerItems = [];
        for (var m = 0; m < processedAnswerLines.length; m++) {
            answerItems.push('<div class="answer-item">' + processedAnswerLines[m] + '</div>');
        }
        answersList = answerItems.join('\n');
    }

    // Process script text to highlight quoted text in red and convert furigana
    var processedScriptText = scriptText
        .replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    processedScriptText = convertFurigana(processedScriptText);
    
    // Process answers list to convert furigana
    var processedAnswersList = convertFurigana(answersList);
    
    // Build correct answers array for grading
    var correctAnswersArray = [];
    for (var n = 0; n < blanksOptionsArray.length; n++) {
        var opts = blanksOptionsArray[n];
        correctAnswersArray.push(opts[0] || '');
    }

    var template = grammarDropdownTemplate
        .replace(/{{ANSWERS_LIST}}/g, processedAnswersList)
        .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
        .replace('{{SCRIPT_TEXT}}', convertFurigana(processedScriptText || ''))
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
        .answer-select { 
            font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; 
            font-size: 0.9rem; 
            font-weight: 400; 
            line-height: 1.3; 
            text-align: left; 
            width: auto; 
            min-width: 60px; 
            border: 1px solid #666; 
            border-radius: 4px; 
            background-color: white; 
            color: #333; 
            cursor: pointer; 
            display: inline-block; 
            padding: 4px 8px; 
            transition: all 0.3s ease;
        }
        .answer-select:hover {
            background-color: #0075b4;
            border-color: #0075b4;
            color: white;
        }
        .answer-select:invalid { color: #999; }
        .answer-select option:first-child { color: #999; }
        .answer-select:focus { 
            outline: none; 
            border-color: #0075b4; 
            background-color: #0075b4;
            color: white;
        }
        .answer-select option { 
            padding: 4px; 
            font-size: 0.85rem; 
            color: #333 !important; 
            background-color: white !important;
        }
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
        /* Furigana (Ruby) styling */
        ruby { font-size: 0.8em; }
        rt { font-size: 0.7em; color: #666; }
        .instructions ruby { font-size: 0.85em; }
        .instructions rt { font-size: 0.7em; color: #666; }
        .answers-list ruby { font-size: 0.85em; }
        .answers-list rt { font-size: 0.7em; color: #666; }
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
        var correctAnswers = JSON.parse('{{CORRECT_ANSWERS}}');
        var selectedAnswers = [];
        for (var i = 0; i < correctAnswers.length; i++) {
            selectedAnswers.push('');
        }
        var originalDropdowns = []; // Store original dropdowns for restoration
        
        // Configuration for this template
        var templateConfig = {
            showPopup: false,  // This template does not need external popup
            noToggle: true     // This template does not need toggle functionality
        };
        
        // Helper function to get cookies
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        function calculateResults() {
            var totalQuestions = document.querySelectorAll('.answer-select').length;
            var correctCount = 0;
            var answers = {};
            var selects = document.querySelectorAll('.answer-select');
            for (var i = 0; i < selects.length; i++) {
                var select = selects[i];
                var userAnswer = select.value.trim();
                var correctAnswer = select.getAttribute('data-correct');
                selectedAnswers[i] = userAnswer;
                var isCorrect = correctAnswer === userAnswer;
                if (isCorrect) correctCount++;
                answers[i] = userAnswer;
            }
            var rawScore = totalQuestions > 0 ? correctCount / totalQuestions : 0;
            var message = correctCount === totalQuestions ? '正解です！' : '不正解です。';
            state.answer = JSON.stringify(answers);
            state.score = rawScore;
            state.attempts += 1;
            return { rawScore: rawScore, message: message, answers: answers, correctCount: correctCount, totalQuestions: totalQuestions };
        }
        function updateDisplay(result) {
            if (state.showAnswer) {
                // Replace dropdowns with text display in the answers list
                var selects = document.querySelectorAll('.answer-select');
                for (var i = 0; i < selects.length; i++) {
                    var select = selects[i];
                    var userAnswer = selectedAnswers[i];
                    var correctAnswer = select.getAttribute('data-correct');
                    var isCorrect = correctAnswer === userAnswer;
                    
                    var replacementSpan = document.createElement('span');
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
                }
            }
        }
        // Store original dropdowns immediately when page loads
        var initialSelects = document.querySelectorAll('.answer-select');
        for (var i = 0; i < initialSelects.length; i++) {
            originalDropdowns.push(initialSelects[i].cloneNode(true));
        }
        
        var selects = document.querySelectorAll('.answer-select');
        for (var j = 0; j < selects.length; j++) {
            var select = selects[j];
            select.addEventListener('change', function(index) {
                return function() {
                    selectedAnswers[index] = this.value;
                    if (state.showAnswer) {
                        var result = calculateResults();
                        updateDisplay(result);
                    }
                };
            }(j));
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
        });
        
        function resetQuiz() {
            console.log('🔄 Starting reset process...');
            
            // Restore original dropdowns
            var replacements = document.querySelectorAll('.answer-replacement');
            for (var i = 0; i < replacements.length; i++) {
                var replacement = replacements[i];
                if (originalDropdowns[i]) {
                    var restoredDropdown = originalDropdowns[i].cloneNode(true);
                    restoredDropdown.value = '';
                    replacement.parentNode.replaceChild(restoredDropdown, replacement);
                }
            }
            
            // Clear selected answers
            selectedAnswers = [];
            for (var j = 0; j < correctAnswers.length; j++) {
                selectedAnswers.push('');
            }
            
            // Reset state completely
            state.answer = '';
            state.score = 0;
            state.showAnswer = false;
            
            // Re-attach event listeners
            var newSelects = document.querySelectorAll('.answer-select');
            for (var k = 0; k < newSelects.length; k++) {
                var select = newSelects[k];
                select.addEventListener('change', function(index) {
                    return function() {
                        selectedAnswers[index] = this.value;
                        if (state.showAnswer) {
                            var result = calculateResults();
                            updateDisplay(result);
                        }
                    };
                }(k));
            }
            
            console.log('🔄 Quiz reset completed via problem.check message');
        }
        function getGrade() {
            console.log('🎯 getGrade() called - Processing quiz submission');
            
            var result = calculateResults();
            console.log('📊 Quiz results:', result);
            
            // Always show answer when submitted
            state.showAnswer = true;
            updateDisplay(result);
            
            // Call completion API (non-blocking)
            setTimeout(function() {
                try {
                    updateCompletionStatus(result);
                } catch (error) {
                    console.error('Error in updateCompletionStatus:', error);
                }
            }, 100);
            
            // Return data to EdX (prevent reload)
            try {
                var returnValue = {
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
            var csrfToken = '';
            try {
                // Try multiple sources for CSRF token
                var tokenSources = [
                    function() { 
                        var el = document.querySelector('[name=csrfmiddlewaretoken]');
                        return el ? el.value : null;
                    },
                    function() { 
                        try {
                            var el = window.parent.document.querySelector('[name=csrfmiddlewaretoken]');
                            return el ? el.value : null;
                        } catch (e) { return null; }
                    },
                    function() { return getCookie('csrftoken'); },
                    function() { 
                        var el = document.querySelector('meta[name=csrf-token]');
                        return el ? el.getAttribute('content') : null;
                    },
                    function() { 
                        try {
                            var el = window.parent.document.querySelector('meta[name=csrf-token]');
                            return el ? el.getAttribute('content') : null;
                        } catch (e) { return null; }
                    }
                ];
                
                for (var i = 0; i < tokenSources.length; i++) {
                    try {
                        var token = tokenSources[i]();
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
            var blockId = 'block-v1:Manabi+N51+2026+type@vertical+block@aea91ffdf79346a2b9d03f6c570ad186'; // Your working block
            try {
                if (window.parent && window.parent.location) {
                    var parentUrl = window.parent.location.href;
                    var blockMatch = parentUrl.match(/block-v1:([^\/\?\&]+)/);
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
            var completionStatus = 1.0;  // Always complete when submitted
            
            console.log('📡 Calling completion API with:', {
                block_key: blockId,
                completion: completionStatus,
                score: result.rawScore,
                note: completionStatus === 1.0 ? 'COMPLETE' : 'INCOMPLETE'
            });
            
            // ✅ CALL YOUR WORKING COMPLETION API with dynamic LMS URL
            var lmsBaseUrl = (window.location.hostname === 'localhost' || window.location.hostname.indexOf('local.openedx.io') !== -1) 
                ? 'http://local.openedx.io:8000' 
                : 'https://lms.nihongodrill.com';
            var apiUrl = lmsBaseUrl + '/courseware/mark_block_completion/';
            console.log('🔗 Quiz API URL: ' + apiUrl);
            
            // Use XMLHttpRequest for older browsers instead of fetch
            var xhr = new XMLHttpRequest();
            xhr.open('POST', apiUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-CSRFToken', csrfToken);
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    console.log('📈 API Response status:', xhr.status);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            var data = JSON.parse(xhr.responseText);
                            console.log('✅ COMPLETION API SUCCESS:', data);
                            if (data.saved_to_blockcompletion) {
                                console.log('🎉 Progress page will update with new completion!');
                            } else {
                                console.log('⚠️ Completion saved but may not affect progress page');
                            }
                        } catch (e) {
                            console.log('❌ Error parsing API response:', e.message);
                        }
                    } else {
                        console.log('❌ Completion API Error: HTTP ' + xhr.status);
                    }
                }
            };
            
            xhr.send(JSON.stringify({
                'block_key': blockId,
                'completion': completionStatus  // Always 0.0 or 1.0, not raw score
            }));
        }
        function getState() {
            return JSON.stringify({ answer: state.answer, attempts: state.attempts, score: state.score, showAnswer: state.showAnswer });
        }
        function setState(stateStr) {
            try {
                var newState = JSON.parse(stateStr);
                state = { answer: newState.answer || '', attempts: newState.attempts || 0, score: newState.score || 0, showAnswer: newState.showAnswer || false };
                if (state.answer) {
                    try {
                        var answers = JSON.parse(state.answer);
                        for (var key in answers) {
                            if (answers.hasOwnProperty(key)) {
                                var index = parseInt(key);
                                var value = answers[key];
                                selectedAnswers[index] = value;
                                var selects = document.querySelectorAll('.answer-select');
                                if (selects[index]) {
                                    selects[index].value = value;
                                }
                            }
                        }
                        var result = calculateResults();
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
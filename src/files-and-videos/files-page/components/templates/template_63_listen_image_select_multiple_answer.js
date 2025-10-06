// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    return text.replace(/([一-龯]+)\(([^)]+)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
}

export const getListenImageSelectMultipleAnswerTemplate = (questionText, correctAnswers, audioFile, timeSegmentsString = '0-0', instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', imageFile = '', answerContent = '', blankOptions = '') => {
    // Log the incoming parameters to help debug
    console.log('getListenImageSelectMultipleAnswerTemplate called with:', {
        questionText,
        correctAnswers,
        answerContent,
        blankOptions
    });
    
    // Parse the blank options for dropdowns - these are the options for all dropdowns
    let optionsArray = [];
    if (blankOptions && blankOptions.trim()) {
        // Preserve original order from input, do not sort/dedupe to keep per-index mapping
        optionsArray = blankOptions.split(',')
            .map(option => option.trim())
            .filter(option => option);
    } else {
        // Default options if none provided
        optionsArray = ['O', 'X'];
    }
    
    // Parse the correct answers - each position corresponds to a day of the week
    // If correctAnswers is a string like "O,O,X,O,X,X,X", parse it into an array
    let correctAnswersArray = [];
    if (correctAnswers && typeof correctAnswers === 'string') {
        correctAnswersArray = correctAnswers.split(',').map(answer => answer.trim());
    } else if (Array.isArray(correctAnswers)) {
        correctAnswersArray = correctAnswers;
    } else {
        // Leave empty so each blank falls back to its per-index option
        correctAnswersArray = [];
    }
    
    // Process the question text (only for display, not for answers)
    const processedLines = questionText.split('\n').map(line => line.trim()).filter(line => line);
    
    // Use answer content if provided, otherwise leave answers empty
    let answersList = '';
    if (answerContent && answerContent.trim()) {
        // Process each line of the answer content
        const answerLines = answerContent.split('\n').map(line => line.trim()).filter(line => line);
        
        // Process each line of answer content to replace placeholders with dropdowns
        let answerDropdownIndex = 0;
        const processedAnswerLines = answerLines.map((line, lineIndex) => {
            // Process each placeholder in the line
            let processedLine = line;
            let placeholderMatch;
            const placeholderRegex = /（ー）/g;
            
            // Replace each placeholder in the line with a dropdown
            while ((placeholderMatch = placeholderRegex.exec(line)) !== null) {
                // Determine correct answer purely from options order by index (cycle)
                const correctAnswer = optionsArray[(answerDropdownIndex) % Math.max(1, optionsArray.length)] || '';
                
                // Create dropdown options from the options array - remove duplicates and sort alphabetically
                const uniqueOptions = [...new Set(optionsArray)].sort((a, b) => {
                    try {
                        return a.localeCompare(b, 'ja');
                    } catch (e) {
                        return a.localeCompare(b);
                    }
                });
                
                const optionsHtml = uniqueOptions.map(option => {
                    return `<div class="dropdown-option" data-value="${option}">${option}</div>`;
                }).join('');
                
                const dropdown = `
                    <div class="custom-dropdown" data-blank-number="${answerDropdownIndex + 1}" data-correct="${correctAnswer}">
                        <div class="dropdown-button" data-value=""></div>
                        <div class="dropdown-options">${optionsHtml}</div>
                    </div>
                `;
                
                // Replace the placeholder with the dropdown
                const beforePlaceholder = processedLine.substring(0, placeholderMatch.index);
                const afterPlaceholder = processedLine.substring(placeholderMatch.index + 4); // 4 is the length of （ー）
                processedLine = beforePlaceholder + dropdown + afterPlaceholder;
                
                // Update the regex's lastIndex to account for the new dropdown
                placeholderRegex.lastIndex = beforePlaceholder.length + dropdown.length;
                
                answerDropdownIndex++;
            }
            
            return processedLine;
        });
        
        // Wrap each line in a div
        answersList = processedAnswerLines.map(line => 
            `<div class="answer-item">${line}</div>`
        ).join('\n');
    }

    // Process script text to highlight quoted text in red and convert furigana
    const processedScriptText = scriptText
        .replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>')
        .replace(/([一-龯]+)\(([^)]+)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
    
    // Extract the first line as the question text and apply furigana
    const firstLine = convertFurigana(processedLines[0] || questionText);
    
    let template = listenImageSelectMultipleAnswerTemplate
        .replace('{{QUESTION_TEXT}}', firstLine)
        .replace(/{{ANSWERS_LIST}}/g, answersList) // Replace all occurrences
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{TIME_SEGMENTS}}', timeSegmentsString || '0-0')
        .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    // Handle image file
    if (imageFile) {
        template = template
            .replace('{{#if IMAGE_FILE}}', '')
            .replace('{{/if}}', '')
            .replace('{{IMAGE_FILE}}', imageFile);
    } else {
        template = template
            .replace(/{{#if IMAGE_FILE}}[\s\S]*?{{\/if}}/g, '');
    }
    
    return template;
};

export const listenImageSelectMultipleAnswerTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Listen and Select Multiple Answer Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.6;
            text-align: left;
            margin: 0;
            padding: 0;
            color: #414141;
            height: auto;
            position: relative;
            overflow-y: auto;
            background-color: white;
            max-height: 620px;
        }
        .container {
            position: relative;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 0;
            background-color: white;
            max-height: 620px;
            overflow-y: auto;
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
        }
        .main-content {
            display: flex;
            gap: 0;
            height: auto;
            background-color: white;
            overflow-y: auto;
        }
        .left-section {
            flex: 6;
            background: white;
            overflow-y: auto;
            max-height: 620px;
        }
        .right-section {
            flex: 4;
            display: flex;
            flex-direction: column;
            background: white;
            padding-left: 0;
            overflow-y: auto;
            max-height: 620px;
        }
        .content-wrapper {
            background: white;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
        }
        .instructions {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.5;
            text-align: left;
            color: #333;
            font-style: italic;
            margin: 0 0 20px 0;
            letter-spacing: 0.3px;
        }
        .instructions:before {
            display: none;
        }
        .image-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            margin: 0;
            overflow: hidden;
            max-width: 100%;
        }
        .quiz-image {
            max-width: 100%;
            max-height: 450px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }
        .question-text {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.6;
            text-align: left;
            color: #333;
            margin: 0;
            position: relative;
            padding-left: 5px;
            letter-spacing: 0.4px;
        }
        .question-text:before {
            display: none;
        }
        .audio-container {
            margin-bottom: 10px;
            width:90%;
            background-color: white;
            display: flex;
            justify-content: flex-start;
        }
        .custom-audio-player {
            width: 100%;
            max-width: 350px;
            margin: 0;
            background-color: white;
            border-radius: 4px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border: 1px solid #e0e0e0;
        }
        .select-container {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
            padding: 0;
            background: white;
            max-width: 400px;
            align-items: flex-start;
        }
        .select-answer-header {
            font-size: 1.2rem;
            color: #333;
            margin: 0;
            font-weight: bold;
        }
        .custom-dropdown {
            position: relative;
            display: inline-block;
            min-width: 100px;
            width: auto;
            z-index: 1;
            margin: 0 2px;
            vertical-align: middle;
        }
        .custom-dropdown.open {
            z-index: 1000;
        }
        .dropdown-button {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; 
            font-size: 1.2rem !important; 
            font-weight: normal !important; 
            line-height: 1.2 !important; 
            text-align: left !important; 
            width: auto !important; 
            min-width: 120px !important; 
            height: 40px !important;
            min-height: 40px !important;
            border: 1px solid #666 !important; 
            border-radius: 4px !important; 
            background-color: white !important; 
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
            background-repeat: no-repeat !important;
            background-position: right 16px center !important;
            background-size: 18px !important;
            color: #333 !important; 
            cursor: pointer !important; 
            display: inline-flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding: 0 50px 0 16px !important; 
            transition: all 0.3s ease !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            outline: none !important;
            letter-spacing: 0.4px !important;
            white-space: nowrap !important;
        }
        .dropdown-button:hover {
            background-color: #0075b4;
            color: white;
        }
        .dropdown-options {
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 100%;
            width: auto;
            background: white;
            border: 1px solid #666;
            border-top: none;
            border-radius: 0 0 4px 4px;
            z-index: 1000;
            display: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .dropdown-options.dropup {
            top: auto;
            bottom: 100%;
            border-top: 1px solid #666;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        }
        .dropdown-options.show {
            display: block;
        }
        .custom-dropdown.open .dropdown-button {
            background-color: #0075b4;
            color: white;
        }
        .dropdown-option {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.6;
            text-align: center;
            color: #333;
            padding: 2px 2px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            min-height: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 0.4px;
            white-space: nowrap;
            min-width: max-content;
            transition: all 0.2s ease;
        }
        .dropdown-option:hover {
            background-color: #0075b4;
            color: white;
        }
        .dropdown-option:last-child {
            border-bottom: none;
        }
        /* Furigana styling for dropdown - Simple approach */
        .dropdown-button ruby, .dropdown-option ruby {
            font-size: 1em;
        }
        .dropdown-button rt, .dropdown-option rt {
            font-size: 0.6em;
            color: #666;
        }
        
        /* Furigana styling */
        ruby {
            font-size: 1.2rem;
        }
        
        rt {
            font-size: 0.6em;
            color: #666;
        }
        .answer-select {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            width: auto;
            min-width: 80px;
            border: 1px solid #666;
            border-radius: 4px;
            background-color: white;
            color: #333;
            cursor: pointer;
            display: inline-block;
        }
        .answer-select:focus {
            outline: none;
        }
        .answer-select option {
            padding: 8px;
            font-size: 1.2rem;
        }
        .answer-select.correct {
            border-color: #2e7d32;
            background-color: #ecf3ec;
        }
        .answer-select.incorrect {
            border-color: #b40000;
            background-color: #f9ecec;
        }
        /* Styling for answer results - copied from template 18 */
        .correct-answer { 
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.6;
            text-align: left;
            color: #fff; 
            padding: 4px 8px; 
            border-radius: 4px; 
            background-color: #4caf50; 
            display: inline-block; 
            margin: 2px;
            letter-spacing: 0.4px;
        }
        .correct-answer rt { color: #fff !important; }
        .wrong-answer { 
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.6;
            text-align: left;
            color: #fff; 
            padding: 4px 8px; 
            border-radius: 4px; 
            background-color: #f44336; 
            display: inline-block; 
            margin: 2px;
            letter-spacing: 0.4px;
        }
        .wrong-answer rt { color: #fff !important; }
        .answer-replacement { display: inline-block; }
        /* Keep rest of the existing styles */
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            text-align: left;
            font-size: 1.2rem;
            padding-bottom: 10px;
        }
        .divider {
            height: 1px;
            background-color: transparent;
            width: 100%;
            margin: 5px 0;
        }
        .controls-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 3px 0;
        }
        .progress-container {
            flex-grow: 1;
            height: 8px;
            background-color: #e0ffff;
            border-radius: 4px;
            position: relative;
            cursor: default;
            width: 100%;
            margin-right: 0;
            pointer-events: none; /* Disable all pointer interactions */
        }
        .progress-bar {
            height: 8px;
            background-color: #00a3a1;
            width: 0;
            border-radius: 4px;
        }
        .volume-container {
            display: flex;
            align-items: center;
            flex-grow: 1;
        }
        .volume-label {
            font-size: 1.2rem;
            color: #333;
            margin-right: 8px;
            font-weight: bold;
            padding: 0 5px;
        }
        .volume-control {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 3px;
        }
        .volume-icon {
            color: #333;
            font-size: 16px;
            cursor: pointer;
        }
        .volume-slider-container {
            width: 100%;
            flex-grow: 1;
            background-color: #e0e0e0;
            height: 4px;
            position: relative;
            border-radius: 2px;
        }
        .volume-level {
            background-color: #00a3a1;
            height: 100%;
            width: 70%;
            border-radius: 2px;
        }
        #volume-slider {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            opacity: 0;
            cursor: pointer;
        }
        .script-highlight {
            color: #b40000;
            font-weight: normal;
        }
        .no-answer {
            color: #666;
            border-bottom: 2px solid #666;
            padding: 0 4px;
            margin: 0 2px;
        }
        .answer-item {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.4;
            text-align: left;
            margin: 0;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            letter-spacing: 0.4px;
            padding: 4px 8px;
            width: 100%;
            max-width: 400px;
        }
        .answers-list {
            padding: 5px;
            background: white;
            border-radius: 2px;
            margin: 5px 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-items: flex-start;
        }
        @media (max-width: 768px) {
            .main-content {
                flex-direction: column;
                gap: 10px;
            }
            .left-section,
            .right-section {
                flex: none;
                width: 100%;
                padding: 0;
                margin: 0;
            }
            .content-wrapper {
                gap: 10px;
                padding: 0;
            }
            .image-container {
                padding: 0;
                margin: 0;
            }
            .select-container {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-content">
            <div class="left-section">
                <div class="content-wrapper">
                    <div class="instructions" id="quiz-instructions">
                        {{INSTRUCTIONS}}
                    </div>
                    {{#if IMAGE_FILE}}
                    <div class="image-container">
                        <img src="{{IMAGE_FILE}}" alt="Quiz illustration" class="quiz-image">
                    </div>
                    {{/if}}
                    <div class="question-text">{{QUESTION_TEXT}}</div>
                </div>
            </div>
            <div class="right-section">
                <form id="quizForm" onsubmit="return false;">
                    <div class="audio-container">
                        <audio id="audio-player" class="audio-player">
                            <source src="{{AUDIO_FILE}}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                        <div class="custom-audio-player">
                            <div id="player-status" class="player-status">Current Status: Playing</div>
                            <div class="controls-row">
                                <div id="progress-container" class="progress-container">
                                    <div id="progress-bar" class="progress-bar"></div>
                                </div>
                            </div>
                            <div class="divider"></div>
                            <div class="controls-row">
                                <div class="volume-control">
                                    <span class="volume-label">Volume</span>
                                    <div class="volume-slider-container">
                                        <div id="volume-level" class="volume-level"></div>
                                        <input type="range" id="volume-slider" class="volume-slider" min="0" max="100" value="100" step="1">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display: none;">
                            <span id="time-segments">{{TIME_SEGMENTS}}</span>
                        </div>
                    </div>
                    <div class="select-container">
                        <div class="answers-list">{{ANSWERS_LIST}}</div>
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

        const correctAnswers = JSON.parse('{{CORRECT_ANSWERS}}');
        let selectedAnswers = new Array(correctAnswers.length).fill('');
        let originalDropdowns = []; // Store original dropdowns for restoration
        
        function calculateResults() {
            const totalQuestions = document.querySelectorAll('.custom-dropdown').length;
            let correctCount = 0;
            const answers = {};
            
            document.querySelectorAll('.custom-dropdown').forEach((dropdown, index) => {
                const button = dropdown.querySelector('.dropdown-button');
                const userAnswer = button.getAttribute('data-value') || '';
                const correctAnswer = dropdown.getAttribute('data-correct');
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

            return {
                rawScore,
                message,
                answers,
                correctCount,
                totalQuestions
            };
        }

        function updateDisplay(result) {
            if (state.showAnswer) {
                // Replace dropdowns with text display in the answers list (like template 18)
                const dropdowns = document.querySelectorAll('.custom-dropdown');
                for (let i = 0; i < dropdowns.length; i++) {
                    const dropdown = dropdowns[i];
                    const userAnswer = selectedAnswers[i];
                    const correctAnswer = dropdown.getAttribute('data-correct');
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
                    dropdown.parentNode.replaceChild(replacementSpan, dropdown);
                }
            }
        }

        // Store original dropdowns immediately when page loads
        const initialDropdowns = document.querySelectorAll('.custom-dropdown');
        for (let i = 0; i < initialDropdowns.length; i++) {
            originalDropdowns.push(initialDropdowns[i].cloneNode(true));
        }

        // Add event listeners to each custom dropdown
        document.querySelectorAll('.custom-dropdown').forEach((dropdown, index) => {
            const button = dropdown.querySelector('.dropdown-button');
            const options = dropdown.querySelectorAll('.dropdown-option');
            
            // Toggle dropdown
            button.addEventListener('click', function() {
                const isOpen = this.parentNode.querySelector('.dropdown-options').classList.contains('show');
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-options').forEach(opt => {
                    opt.classList.remove('show', 'dropup');
                });
                document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
                // Toggle current dropdown
                if (!isOpen) {
                    const dropdownOptions = this.parentNode.querySelector('.dropdown-options');
                    
                    // First show dropdown to get accurate measurements
                    dropdownOptions.classList.add('show');
                    this.parentNode.classList.add('open');
                    
                    // Now check if dropdown will overflow and adjust direction
                    const buttonRect = this.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const dropdownRect = dropdownOptions.getBoundingClientRect();
                    const dropdownHeight = dropdownRect.height;
                    const spaceBelow = viewportHeight - buttonRect.bottom;
                    const spaceAbove = buttonRect.top;
                    
                    // If not enough space below, show dropdown upward regardless of space above
                    // Add 20px margin for better UX
                    if (spaceBelow < (dropdownHeight + 20)) {
                        dropdownOptions.classList.add('dropup');
                    } else {
                        dropdownOptions.classList.remove('dropup');
                    }
                }
            });
            
            // Handle option selection
            options.forEach(option => {
                option.addEventListener('click', function() {
                    const selectedValue = this.getAttribute('data-value');
                    const selectedText = this.innerHTML;
                    const dropdown = this.parentNode.parentNode;
                    const button = dropdown.querySelector('.dropdown-button');
                    
                    // Update button text
                    button.innerHTML = selectedText;
                    button.setAttribute('data-value', selectedValue);
                    
                    // Close dropdown
                    this.parentNode.classList.remove('show');
                    this.parentNode.parentNode.classList.remove('open');
                    
                    // Update selected answers
                    selectedAnswers[index] = selectedValue;
                    
                    if (state.showAnswer) {
                        const result = calculateResults();
                        updateDisplay(result);
                    }
                });
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.custom-dropdown')) {
                document.querySelectorAll('.dropdown-options').forEach(opt => {
                    opt.classList.remove('show', 'dropup');
                });
                document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
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
            const replacements = document.querySelectorAll('.answer-replacement');
            for (let i = 0; i < replacements.length; i++) {
                const replacement = replacements[i];
                if (originalDropdowns[i]) {
                    const restoredDropdown = originalDropdowns[i].cloneNode(true);
                    const button = restoredDropdown.querySelector('.dropdown-button');
                    if (button) {
                        button.setAttribute('data-value', '');
                        button.innerHTML = '';
                        // Reset width to min-width
                        button.style.width = '100px';
                        // Also reset the dropdown container width
                        restoredDropdown.style.width = '100px';
                    }
                    replacement.parentNode.replaceChild(restoredDropdown, replacement);
                }
            }
            
            // Clear selected answers
            selectedAnswers = [];
            for (let j = 0; j < correctAnswers.length; j++) {
                selectedAnswers.push('');
            }
            
            // Reset state completely
            state.answer = '';
            state.score = 0;
            state.showAnswer = false;
            
            // Reset audio player and start with delay (like initial load)
            if (audioPlayer) {
                audioPlayer.startWithDelay();
            }
            
            // Re-attach event listeners for custom dropdowns
            const newDropdowns = document.querySelectorAll('.custom-dropdown');
            for (let k = 0; k < newDropdowns.length; k++) {
                const dropdown = newDropdowns[k];
                const button = dropdown.querySelector('.dropdown-button');
                const options = dropdown.querySelectorAll('.dropdown-option');
                
                // Toggle dropdown
                button.addEventListener('click', function() {
                    const isOpen = this.parentNode.querySelector('.dropdown-options').classList.contains('show');
                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown-options').forEach(opt => {
                        opt.classList.remove('show', 'dropup');
                    });
                    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
                        dropdown.classList.remove('open');
                    });
                    // Toggle current dropdown
                    if (!isOpen) {
                        const dropdownOptions = this.parentNode.querySelector('.dropdown-options');
                        
                        // First show dropdown to get accurate measurements
                        dropdownOptions.classList.add('show');
                        this.parentNode.classList.add('open');
                        
                        // Now check if dropdown will overflow and adjust direction
                        const buttonRect = this.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const dropdownRect = dropdownOptions.getBoundingClientRect();
                        const dropdownHeight = dropdownRect.height;
                        const spaceBelow = viewportHeight - buttonRect.bottom;
                        const spaceAbove = buttonRect.top;
                        
                        // If not enough space below, show dropdown upward regardless of space above
                        // Add 20px margin for better UX
                        if (spaceBelow < (dropdownHeight + 20)) {
                            dropdownOptions.classList.add('dropup');
                        } else {
                            dropdownOptions.classList.remove('dropup');
                        }
                    }
                });
                
                // Handle option selection
                options.forEach(option => {
                    option.addEventListener('click', function() {
                        const selectedValue = this.getAttribute('data-value');
                        const selectedText = this.innerHTML;
                        const dropdown = this.parentNode.parentNode;
                        const button = dropdown.querySelector('.dropdown-button');
                        
                        // Update button text
                        button.innerHTML = selectedText;
                        button.setAttribute('data-value', selectedValue);
                        
                        // Close dropdown
                        this.parentNode.classList.remove('show');
                        this.parentNode.parentNode.classList.remove('open');
                        
                        // Update selected answers
                        const blankNumber = parseInt(dropdown.getAttribute('data-blank-number')) - 1;
                        selectedAnswers[blankNumber] = selectedValue;
                        
                        if (state.showAnswer) {
                            const result = calculateResults();
                            updateDisplay(result);
                        }
                    });
                });
            }
            
            console.log('🔄 Quiz reset completed via problem.check message');
        }

        function getGrade() {
            console.log('🎯 getGrade() called - Processing quiz submission');
            
            const result = calculateResults();
            console.log('📊 Quiz results:', result);
            
            // Always show answer when submitted (like template 18)
            state.showAnswer = true;
            updateDisplay(result);
            
            // Pause audio when showing answers
            const audioElement = document.getElementById('audio-player');
            audioElement.pause();
            
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

        function getState() {
            return JSON.stringify({
                answer: state.answer,
                attempts: state.attempts,
                score: state.score,
                showAnswer: state.showAnswer
            });
        }

        // Update setState to handle audio state properly
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
                        Object.entries(answers).forEach(([index, value]) => {
                            selectedAnswers[index] = value;
                            const dropdown = document.querySelectorAll('.custom-dropdown')[index];
                            if (dropdown && value) {
                                const button = dropdown.querySelector('.dropdown-button');
                                const options = dropdown.querySelectorAll('.dropdown-option');
                                
                                // Find the option text for this value
                                let selectedText = '';
                                for (let i = 0; i < options.length; i++) {
                                    if (options[i].getAttribute('data-value') === value) {
                                        selectedText = options[i].innerHTML;
                                        break;
                                    }
                                }
                                
                                if (selectedText && button) {
                                    button.innerHTML = selectedText;
                                    button.setAttribute('data-value', value);
                                }
                            }
                        });

                        const result = calculateResults();
                        updateDisplay(result);
                        
                        // If showing answers, just pause audio without resetting
                        if (state.showAnswer) {
                            const audioElement = document.getElementById('audio-player');
                            audioElement.pause();
                        }
                    } catch (e) {
                        console.error('Error parsing answers:', e);
                    }
                }
            } catch (e) {
                console.error('Error setting state:', e);
            }
        }

        // Set up EdX bindings
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
        

        // Audio player functionality
        function setupAudioPlayer() {
            const audioElement = document.getElementById('audio-player');
            const progressContainer = document.getElementById('progress-container');
            const progressBar = document.getElementById('progress-bar');
            const volumeSlider = document.getElementById('volume-slider');
            const volumeLevel = document.getElementById('volume-level');
            const timeSegmentsElement = document.getElementById('time-segments');
            const playerStatus = document.getElementById('player-status');
            
            // Parse time segments from input (format: "0.04-0.09;0.21-0.30")
            function parseTimeSegments(timeString) {
                if (!timeString || timeString.trim() === '') {
                    return [];
                }
                
                const segments = [];
                const segmentStrings = timeString.split(';');
                
                segmentStrings.forEach((segmentStr, index) => {
                    const parts = segmentStr.split('-');
                    
                    if (parts.length === 2) {
                        // Parse time format: 0.04 = 4 seconds, 1.21 = 1 minute 21 seconds
                        const parseTime = (timeStr) => {
                            const time = parseFloat(timeStr.trim());
                            if (isNaN(time)) return 0;
                            
                            if (timeStr.includes('.')) {
                                const [minutes, secondsPart] = timeStr.split('.');
                                const minutesNum = parseInt(minutes) || 0;
                                const secondsNum = parseInt(secondsPart.padEnd(2, '0').substring(0, 2)) || 0;
                                return minutesNum * 60 + secondsNum;
                            } else {
                                return time;
                            }
                        };
                        
                        const start = parseTime(parts[0]);
                        const end = parseTime(parts[1]);
                        
                        if (!isNaN(start) && !isNaN(end) && start >= 0 && end > start) {
                            segments.push({ start, end });
                        }
                    }
                });
                
                return segments;
            }
            
            const timeSegments = parseTimeSegments(timeSegmentsElement.textContent || '');
            let currentSegmentIndex = 0;
            let isPlaying = false;
            let totalDuration = 0;
            let isTransitioning = false; // Flag to prevent multiple transitions
            let countdownInterval = null; // Store countdown interval reference
            
            // Calculate total duration of all segments
            if (timeSegments.length > 0) {
                totalDuration = timeSegments.reduce((total, segment) => total + (segment.end - segment.start), 0);
            } else {
                // Fallback to single time range from timeSegmentsElement
                const timeString = timeSegmentsElement.textContent || '0-0';
                const parts = timeString.split('-');
                if (parts.length === 2) {
                    const startTime = parseFloat(parts[0]) || 0;
                    const endTime = parseFloat(parts[1]) || 0;
                    if (endTime > startTime) {
                        timeSegments.push({ start: startTime, end: endTime });
                        totalDuration = endTime - startTime;
                    }
                }
            }
            
            // Update volume level display based on slider value
            function updateVolumeDisplay() {
                const volume = volumeSlider.value;
                volumeLevel.style.width = volume + '%';
            }
            
            // Initialize volume display
            updateVolumeDisplay();
            
            // Format time in mm:ss
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return minutes + ':' + (secs < 10 ? '0' : '') + secs;
            }
            
            // Volume control
            volumeSlider.addEventListener('input', function() {
                const volume = this.value / 100;
                audioElement.volume = volume;
                updateVolumeDisplay();
            });
            
            // Initialize with 5-second delay
            function initializePlayer() {
                if (timeSegments.length === 0) return;
                
                // Clear any existing countdown interval
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                
                // Set to first segment start time
                currentSegmentIndex = 0;
                audioElement.currentTime = timeSegments[0].start;
                
                // Update status to show countdown
                playerStatus.textContent = 'Current Status: Starting in 10s...';
                
                // Countdown timer
                let countdown = 10;
                countdownInterval = setInterval(function() {
                    countdown--;
                    if (countdown > 0) {
                        playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                    } else {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        // Auto-play when countdown reaches 0
                        playNextSegment();
                    }
                }, 1000);
            }
            
            // Play the current segment
            function playNextSegment() {
                if (currentSegmentIndex >= timeSegments.length) {
                    // All segments played, stop and reset to first segment
                    currentSegmentIndex = 0;
                    audioElement.currentTime = timeSegments[0].start;
                    audioElement.pause();
                    isPlaying = false;
                    playerStatus.textContent = 'Current Status: Completed';
                    
                    // Force update status to ensure it's set correctly
                    setTimeout(() => {
                        if (playerStatus.textContent !== 'Current Status: Completed') {
                            playerStatus.textContent = 'Current Status: Completed';
                        }
                    }, 50);
                    return;
                }
                
                const currentSegment = timeSegments[currentSegmentIndex];
                audioElement.currentTime = currentSegment.start;
                
                audioElement.play()
                    .then(function() {
                        isPlaying = true;
                        playerStatus.textContent = 'Current Status: Playing';
                    })
                    .catch(function(error) {
                        console.error('Error playing audio:', error);
                        isPlaying = false;
                        playerStatus.textContent = 'Current Status: Error';
                    });
            }
            
            // Update progress bar
            function updateProgress() {
                if (audioElement.duration && timeSegments.length > 0) {
                    const currentTime = audioElement.currentTime;
                    const currentSegment = timeSegments[currentSegmentIndex];
                    
                    // Don't update if already completed
                    if (playerStatus.textContent === 'Current Status: Completed') {
                        return;
                    }
                    
                    // Calculate progress within current segment
                    if (currentTime >= currentSegment.start && currentTime <= currentSegment.end) {
                        const segmentProgress = (currentTime - currentSegment.start) / (currentSegment.end - currentSegment.start);
                        
                        // Calculate total progress across all segments
                        let totalElapsed = 0;
                        for (let i = 0; i < currentSegmentIndex; i++) {
                            totalElapsed += (timeSegments[i].end - timeSegments[i].start);
                        }
                        totalElapsed += (currentTime - currentSegment.start);
                        
                        const progressPercent = Math.min(100, Math.max(0, (totalElapsed / totalDuration) * 100));
                        progressBar.style.width = progressPercent + '%';
                    }
                    
                    // Check if we've reached the end of current segment
                    if (currentTime >= currentSegment.end && !isTransitioning) {
                        isTransitioning = true; // Prevent multiple transitions
                        audioElement.pause();
                        currentSegmentIndex++;
                        
                        if (currentSegmentIndex < timeSegments.length) {
                            // Move to next segment
                            setTimeout(() => {
                                isTransitioning = false; // Reset flag
                                playNextSegment();
                            }, 100); // Small delay for smooth transition
                        } else {
                            // All segments completed
                            isPlaying = false;
                            playerStatus.textContent = 'Current Status: Completed';
                            currentSegmentIndex = 0; // Reset for next play
                            isTransitioning = false; // Reset flag
                            
                            // Force update status to ensure it's set correctly
                            setTimeout(() => {
                                if (playerStatus.textContent !== 'Current Status: Completed') {
                                    playerStatus.textContent = 'Current Status: Completed';
                                }
                            }, 50);
                        }
                    }
                }
            }
            
            // Disable seeking by click; make progress bar non-interactive
            progressContainer.style.pointerEvents = 'none';
            
            // Update progress during playback
            audioElement.addEventListener('timeupdate', updateProgress);
            
            // When metadata is loaded, set up the player
            audioElement.addEventListener('loadedmetadata', () => {
                // Get actual duration of the audio file
                const actualDuration = audioElement.duration;
                
                // Validate and adjust time segments
                if (timeSegments.length > 0) {
                    timeSegments.forEach((segment, index) => {
                        if (segment.end > actualDuration) {
                            segment.end = actualDuration;
                        }
                        if (segment.start > actualDuration) {
                            segment.start = 0;
                            segment.end = 0;
                        }
                    });
                    
                    // Remove invalid segments
                    const validSegments = timeSegments.filter(segment => segment.end > segment.start);
                    timeSegments.length = 0;
                    timeSegments.push(...validSegments);
                    
                    // Recalculate total duration
                    totalDuration = timeSegments.reduce((total, segment) => total + (segment.end - segment.start), 0);
                    
                } else {
                    // Fallback to full audio
                    timeSegments.push({ start: 0, end: actualDuration });
                    totalDuration = actualDuration;
                }
                
                // Set to first segment start time
                if (timeSegments.length > 0) {
                    audioElement.currentTime = timeSegments[0].start;
                }
                
                // Initialize player with delay
                initializePlayer();
            });
            
            // Handle play event
            audioElement.addEventListener('play', () => {
                isPlaying = true;
                playerStatus.textContent = 'Current Status: Playing';
            });
            
            // Handle pause event
            audioElement.addEventListener('pause', () => {
                isPlaying = false;
                playerStatus.textContent = 'Current Status: Paused';
            });
            
            // Set initial volume
            audioElement.volume = volumeSlider.value / 100;
            updateVolumeDisplay();
            
            // Function to update player status with countdown
            function startWithDelay() {
                if (timeSegments.length === 0) return;
                
                // Clear any existing countdown interval
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                
                // Reset to first segment
                currentSegmentIndex = 0;
                isTransitioning = false; // Reset transition flag
                audioElement.currentTime = timeSegments[0].start;
                
                // Update status with countdown
                playerStatus.textContent = 'Current Status: Starting in 10s...';
                
                // Countdown timer
                let countdown = 10;
                countdownInterval = setInterval(function() {
                    countdown--;
                    if (countdown > 0) {
                        playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                    } else {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        // Auto-play when countdown reaches 0
                        playNextSegment();
                    }
                }, 1000);
            }
            
            // Expose the functions
            return {
                startWithDelay,
                resetToStart: () => {
                    // Clear any existing countdown interval
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                    
                    if (timeSegments.length > 0) {
                        currentSegmentIndex = 0;
                        audioElement.currentTime = timeSegments[0].start;
                    }
                    audioElement.pause();
                    playerStatus.textContent = 'Current Status: Paused';
                },
                getTimeRange: () => {
                    if (timeSegments.length === 1) {
                        return { startTime: timeSegments[0].start, endTime: timeSegments[0].end };
                    }
                    return { segments: timeSegments, totalDuration: totalDuration };
                }
            };
        }

        const audioPlayer = setupAudioPlayer();

        // Add event listener for when audio is ready to play
        const audioElement = document.getElementById('audio-player');
        audioElement.addEventListener('canplaythrough', () => {
            console.log('Audio is ready to play');
        });

        // Add event listener for when audio starts loading
        audioElement.addEventListener('loadstart', () => {
            console.log('Audio started loading');
        });

        // Add event listener for when audio finishes loading
        audioElement.addEventListener('loadeddata', () => {
            console.log('Audio data loaded');
        });
    })();
    </script>
</body>
</html>`; 
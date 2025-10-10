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

export const getListenImageSelectMultipleAnswerTemplate65 = (questionText, correctAnswers, audioFile, timeSegmentsString = '0-0', instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', imageFile = '', answerContent = '', blankOptions = '') => {
    // Log the incoming parameters to help debug
    console.log('getListenImageSelectMultipleAnswerTemplate65 called with:', {
        questionText,
        correctAnswers,
        answerContent,
        blankOptions
    });
    
    // Parse the blank options for dropdowns - each dropdown can have different options
    let optionsPerDropdown = [];
    if (blankOptions && blankOptions.trim()) {
        // Split by semicolon to get options for each dropdown
        const dropdownOptions = blankOptions.split(';');
        optionsPerDropdown = dropdownOptions.map(dropdownOption => {
            // For each dropdown, split by comma to get individual options
            return dropdownOption.split(',')
                .map(option => option.trim())
                .filter(option => option);
        });
    } else {
        // Default options if none provided - all dropdowns get same options
        optionsPerDropdown = [['O', 'X']];
    }
    
    // Debug logging for options per dropdown
    console.log('🔍 Options per dropdown:', optionsPerDropdown);
    
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
        console.log('🔍 Processing answerContent:', answerContent);
        // Process each line of the answer content
        const answerLines = answerContent.split('\n').map(line => line.trim()).filter(line => line);
        console.log('🔍 Answer lines:', answerLines);
        
        // Process each line of answer content to replace placeholders with dropdowns
        let answerDropdownIndex = 0;
        const processedAnswerLines = answerLines.map((line, lineIndex) => {
            console.log(`🔍 Processing line ${lineIndex + 1}: "${line}"`);
            
            // Process each placeholder in the line
            let processedLine = line;
            let placeholderMatch;
            const placeholderRegex = /（ー）/g;
            
            // Count total placeholders first
            const totalPlaceholders = (line.match(/（ー）/g) || []).length;
            console.log(`🔍 Line "${line}" has ${totalPlaceholders} placeholders`);
            console.log(`🔍 Line character codes:`, Array.from(line).map(c => c.charCodeAt(0)));
            
            // Reset regex lastIndex to ensure it starts from the beginning
            placeholderRegex.lastIndex = 0;
            
            // Replace each placeholder in the line with a dropdown
            let placeholderCount = 0;
            while ((placeholderMatch = placeholderRegex.exec(processedLine)) !== null) {
                placeholderCount++;
                console.log(`🔍 Found placeholder #${placeholderCount} at index ${placeholderMatch.index} in: "${processedLine}"`);
                console.log(`🔍 Placeholder match: "${placeholderMatch[0]}"`);
                console.log(`🔍 Before placeholder: "${processedLine.substring(0, placeholderMatch.index)}"`);
                console.log(`🔍 After placeholder: "${processedLine.substring(placeholderMatch.index + placeholderMatch[0].length)}"`);
                
                // Get options for this specific dropdown (by index)
                const currentDropdownOptions = optionsPerDropdown[answerDropdownIndex] || optionsPerDropdown[0] || ['O', 'X'];
                
                // Debug logging for current dropdown
                console.log(`🔍 Dropdown ${answerDropdownIndex + 1} options:`, currentDropdownOptions);
                
                // Determine correct answer - first option is always correct
                const correctAnswer = currentDropdownOptions[0] || '';
                
                // Create dropdown options from the current dropdown's options - remove duplicates and sort alphabetically
                const uniqueOptions = [...new Set(currentDropdownOptions)].sort((a, b) => {
                    try {
                        return a.localeCompare(b, 'ja');
                    } catch (e) {
                        return a.localeCompare(b);
                    }
                });
                
                const optionsHtml = uniqueOptions.map(option => {
                    // Apply furigana conversion to each option
                    const optionWithFurigana = convertFurigana(option);
                    return `<div class="dropdown-option" data-value="${option}">${optionWithFurigana}</div>`;
                }).join('');
                
                const dropdown = `
                    <div class="custom-dropdown" data-blank-number="${answerDropdownIndex + 1}" data-correct="${correctAnswer}">
                        <div class="dropdown-button" data-value=""></div>
                        <div class="dropdown-options">${optionsHtml}</div>
                    </div> `;
                
                // Replace the placeholder with the dropdown
                const placeholderLength = placeholderMatch[0].length;
                const beforePlaceholder = processedLine.substring(0, placeholderMatch.index);
                const afterPlaceholder = processedLine.substring(placeholderMatch.index + placeholderLength);
                processedLine = beforePlaceholder + dropdown + afterPlaceholder;
                
                console.log(`🔍 Placeholder length: ${placeholderLength}`);
                console.log(`🔍 Before: "${beforePlaceholder}"`);
                console.log(`🔍 After: "${afterPlaceholder}"`);
                
                console.log(`🔍 After replacement: "${processedLine}"`);
                console.log(`🔍 Remaining placeholders: ${(processedLine.match(/（ー）/g) || []).length}`);
                
                // Update the regex's lastIndex to account for the new dropdown
                // Reset to the position after the inserted dropdown
                placeholderRegex.lastIndex = beforePlaceholder.length + dropdown.length;
                
                answerDropdownIndex++;
            }
            
            console.log(`🔍 Final processed line: "${processedLine}"`);
            console.log(`🔍 Total dropdowns created: ${placeholderCount}`);
            
            return processedLine;
        });
        // Wrap each line in a div for separate lines
        answersList = processedAnswerLines.map(line => 
            `<div class="answer-item">${line}</div>`
        ).join('\n');
    }

    // Process script text to highlight quoted text in red and convert furigana (like template 29)
    console.log('🔍 Original scriptText:', scriptText);
    // First, handle newlines and normalize the text
    const normalizedScriptText = scriptText
        .replace(/\n/g, '<br>')  // Convert newlines to HTML breaks
        .replace(/\r/g, '');     // Remove carriage returns
    console.log('🔍 Normalized scriptText:', normalizedScriptText);
    
    // Then process quotes for highlighting
    const processedScriptText = normalizedScriptText
        .replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    console.log('🔍 Processed scriptText:', processedScriptText);
    // Convert furigana
    const finalScriptText = convertFurigana(processedScriptText);
    
    console.log('🔍 Final scriptText with furigana:', finalScriptText);
    
    // Extract the first line as the question text and apply furigana
    const firstLine = convertFurigana(processedLines[0] || questionText);
    
    let template = listenImageSelectMultipleAnswerTemplate65
        .replace('{{QUESTION_TEXT}}', firstLine)
        .replace(/{{ANSWERS_LIST}}/g, answersList) // Replace all occurrences
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{TIME_SEGMENTS}}', timeSegmentsString || '0-0')
        .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
        .replace('{{SCRIPT_TEXT}}', finalScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    // Image file handling removed - no longer needed
    
    return template;
};

export const listenImageSelectMultipleAnswerTemplate65 = `<!DOCTYPE html>
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
            height: 620px;
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
            gap: 20px;
            width: calc(100% - 100px);
            margin: 0 0 0 100px;
            box-sizing: border-box;
        }
        .top-section {
            display: flex;
            flex-direction: row;
            gap: 50px;
            align-items: flex-start;
        }
        .left-content {
            flex: 0 0 auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: calc(100% - 350px);
        }
        .right-content {
            flex: 0 0 300px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 300px;
        }
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .instructions {
            font-size: 1.2rem;
            line-height: 1.5;
            color: #333;
            font-weight: bold;
            font-style: italic;
            margin: 0 0 20px 0;
            letter-spacing: 0.3px;
        }
        .question-text {
            font-size: 1.2rem;
            padding: 15px 0;
            color: #333;
            font-weight: normal;
            margin: 0;
            line-height: 1.6;
            letter-spacing: 0.4px;
        }
        .audio-container {
            margin-bottom: 10px;
            width: 100%;
            height: auto;
        }
        .custom-audio-player {
            width: 300px;
            min-width: 300px;
            max-width: 300px;
            margin: 0;
            background-color: white;
            border-radius: 4px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border: 1px solid #e0e0e0;
        }
        .select-container {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            background: transparent;
            width: 100%;
            overflow: visible;
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
            line-height: 1.3 !important; 
            text-align: left !important; 
            width: auto !important; 
            min-width: 120px !important; 
            height: auto !important;
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
            padding: 6px 50px 6px 16px !important; 
            transition: all 0.3s ease !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            outline: none !important;
            letter-spacing: 0.4px !important;
            white-space: normal !important;
            word-wrap: break-word !important;
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
            border: 2px solid #0075b4;
            border-radius: 4px;
            z-index: 1000;
            display: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .dropdown-options.dropup {
            top: auto;
            bottom: 100%;
            border: 2px solid #0075b4;
            border-radius: 4px;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        }
        .dropdown-options.balanced {
            position: absolute;
            border: 2px solid #0075b4;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 300px;
            overflow-y: auto;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
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
        /* Furigana styling for dropdown - Simple approach like template 18 */
        .dropdown-button ruby, .dropdown-option ruby {
            font-size: 1.2rem;
        }
        .dropdown-button rt, .dropdown-option rt {
            font-size: 0.6em;
            color: #666;
        }
        .dropdown-button ruby {
            vertical-align: baseline;
        }
        .dropdown-button rt {
            vertical-align: baseline;
        }
        
        /* Furigana styling - Simple approach like template 18 */
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
            margin: 2px 4px 2px 0;
            letter-spacing: 0.4px;
            white-space: nowrap;
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
            margin: 2px 4px 2px 0;
            letter-spacing: 0.4px;
            white-space: nowrap;
        }
        .wrong-answer rt { color: #fff !important; }
        .answer-replacement { 
            display: inline-block; 
            vertical-align: middle;
        }
        /* Keep rest of the existing styles */
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 2px;
            text-align: left;
            font-size: 14px;
            padding-bottom: 5px;
        }
        .divider {
            height: 1px;
            background-color: transparent;
            width: 100%;
            margin: 5px 0;
        }
        #player-status {
            font-size: 14px;
            color: #555;
        }
        .audio-player {
            display: none; /* Hide the original audio player */
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
            line-height: 1.6;
            text-align: left;
            margin: 0 0 10px 0;
            color: #333;
            display: block;
            letter-spacing: 0.4px;
            white-space: nowrap;
            width: 100%;
            position: relative;
        }
        .answer-item .custom-dropdown {
            vertical-align: middle;
            display: inline-block;
        }
        .answers-list {
            padding: 5px;
            background: white;
            border-radius: 2px;
            margin: 5px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow: visible;
        }
        @media (max-width: 1024px) {
            .select-container {
                max-width: 500px;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                gap: 10px;
            }
            .top-section {
                flex-direction: column;
                gap: 15px;
            }
            .left-content, .right-content {
                width: 100%;
            }
            .content-wrapper {
                gap: 8px;
            }
            .select-container {
                width: 100%;
                max-width: 100%;
            }
            .custom-audio-player {
                max-width: 100%;
            }
            .answer-item {
                white-space: nowrap;
                width: 100%;
            }
        }
        
        @media (max-width: 480px) {
            .select-container {
                gap: 6px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="top-section">
            <div class="left-content">
                <div class="content-wrapper">
                    <div class="instructions" id="quiz-instructions">
                        {{INSTRUCTIONS}}
                    </div>
                    <div class="question-text">{{QUESTION_TEXT}}</div>
                </div>
            </div>
            <div class="right-content">
                <div class="audio-container">
                    <audio id="audio-player" class="audio-player">
                        <source src="{{AUDIO_FILE}}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <div class="custom-audio-player">
                        <div id="player-status" class="player-status">Current Status: Starting in 10s...</div>
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
                        <span id="script-text-hidden">{{SCRIPT_TEXT}}</span>
                    </div>
                </div>
            </div>
        </div>
        <form id="quizForm" onsubmit="return false;">
            <div class="select-container">
                <div class="answers-list">{{ANSWERS_LIST}}</div>
            </div>
            <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
        </form>
    </div>

    <script>
        // Function to encode script text for safe transmission (like template 29)
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
                    opt.classList.remove('show', 'dropup', 'balanced');
                    opt.style.top = '';
                    opt.style.height = '';
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
                    
                    // Check if we have more than 4 options - if so, balance the dropdown
                    const optionCount = dropdownOptions.querySelectorAll('.dropdown-option').length;
                    
                    if (optionCount > 4) {
                        // For more than 4 options, use balanced mode
                        dropdownOptions.classList.add('balanced');
                    } else {
                        // For 4 or fewer options, use normal dropdown behavior
                        dropdownOptions.classList.remove('balanced');
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
                    
                    // Update button text with furigana
                    button.innerHTML = selectedText;
                    button.setAttribute('data-value', selectedValue);
                    
                    // Close dropdown
                    this.parentNode.classList.remove('show', 'balanced');
                    this.parentNode.parentNode.classList.remove('open');
                    this.parentNode.style.top = '';
                    this.parentNode.style.height = '';
                    
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
                    opt.classList.remove('show', 'dropup', 'balanced');
                    opt.style.top = '';
                    opt.style.height = '';
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
                        opt.classList.remove('show', 'dropup', 'balanced');
                        opt.style.top = '';
                        opt.style.height = '';
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
                        
                        // Check if we have more than 4 options - if so, balance the dropdown
                        const optionCount = dropdownOptions.querySelectorAll('.dropdown-option').length;
                        
                        if (optionCount > 4) {
                            // For more than 4 options, use balanced mode
                            dropdownOptions.classList.add('balanced');
                        } else {
                            // For 4 or fewer options, use normal dropdown behavior
                            dropdownOptions.classList.remove('balanced');
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
                        
                        // Update button text with furigana
                        button.innerHTML = selectedText;
                        button.setAttribute('data-value', selectedValue);
                        
                        // Close dropdown
                        this.parentNode.classList.remove('show', 'balanced');
                        this.parentNode.parentNode.classList.remove('open');
                        this.parentNode.style.top = '';
                        this.parentNode.style.height = '';
                        
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
            
            // Also pause countdown if it's running
            if (audioPlayer && audioPlayer.pauseCountdown) {
                audioPlayer.pauseCountdown();
            }
            
            // Send script text to parent for popup display (like template 29)
            try {
                // Get script text from the template - use innerHTML to preserve HTML tags
                const scriptTextElement = document.getElementById('script-text-hidden');
                const scriptText = scriptTextElement ? scriptTextElement.innerHTML : '';
                
                console.log('🔍 Script text from hidden element:', scriptText);
                
                // Encode script text to handle special characters (like template 29)
                const encodedScriptText = encodeScriptText(scriptText);
                
                console.log('🔍 Encoded script text:', encodedScriptText);
                
                const quizData = {
                    templateId: 65,
                    scriptText: encodedScriptText
                };
                
                // Store in localStorage for popup
                localStorage.setItem('quizGradeSubmitted', JSON.stringify(quizData));
                localStorage.setItem('quizGradeSubmittedTimestamp', Date.now().toString());
                
                // Send message to parent
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'quiz.data.ready',
                        quizData: quizData
                    }, '*');
                }
            } catch (error) {
                console.error('Error sending script text to parent:', error);
            }
            
            // Call completion API (like template 28)
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
                        
                        // If showing answers, just pause audio
                        if (state.showAnswer) {
                            const audioElement = document.getElementById('audio-player');
                            audioElement.pause();
                            
                            // Also pause countdown if it's running
                            if (audioPlayer && audioPlayer.pauseCountdown) {
                                audioPlayer.pauseCountdown();
                            }
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
            
            // Set initial status to Starting countdown
            playerStatus.textContent = 'Current Status: Starting in 10s...';
            
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
                if (timeSegments.length === 0) {
                    playerStatus.textContent = 'Current Status: Ready';
                    return;
                }
                
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
            
            // Auto-start countdown when page loads (fallback if loadedmetadata doesn't fire)
            setTimeout(() => {
                if (timeSegments.length > 0 && !isPlaying) {
                    initializePlayer();
                }
            }, 500); // Delay to ensure audio metadata is loaded
            
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
                if (timeSegments.length === 0) {
                    playerStatus.textContent = 'Current Status: Ready';
                    return;
                }
                
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
            
            
            // Function to pause countdown
            function pauseCountdown() {
                // Clear any existing countdown interval
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                
                // Update status to paused
                playerStatus.textContent = 'Current Status: Paused';
            }
            
            
            // Expose the functions
            return {
                startWithDelay,
                pauseCountdown,
                resetToStart: () => {
                    // Clear any existing countdown interval
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                    
                    if (timeSegments.length > 0) {
                        currentSegmentIndex = 0;
                        audioElement.currentTime = timeSegments[0].start;
                        playerStatus.textContent = 'Current Status: Starting in 10s...';
                        // Restart countdown after reset
                        setTimeout(() => {
                            initializePlayer();
                        }, 100);
                    } else {
                        playerStatus.textContent = 'Current Status: Ready';
                    }
                    audioElement.pause();
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

        // Helper function to get cookies (from template 28)
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

        // Function to update completion status (from template 28)
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
                console.log('✅ Quiz completion marked successfully');
            })
            .catch(error => {
                // Error handling
                console.error('❌ Error marking quiz completion:', error);
            });
        }

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

        // Send quiz.meta message on load to inform parent of audio capability
        if (window.parent) {
            window.parent.postMessage({
                type: 'quiz.meta',
                templateId: 65,
                hasAudio: true
            }, '*');
        }

    })();
    </script>
</body>
</html>`; 
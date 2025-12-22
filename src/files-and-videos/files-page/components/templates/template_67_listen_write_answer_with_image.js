// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    // Chỉ Kanji (và vài ký tự đặc biệt)
    const kanjiWord = "[\u4E00-\u9FFF々〆〤ヶ]+";
    // Số (half-width và full-width)
    const numberPattern = "[\d０-９]*";
    
    // First convert Japanese parentheses: 毎日（まいにち） -> <ruby>毎日<rt>まいにち</rt></ruby>
    // Tách số ra khỏi kanji: 12月（がつ） -> 12<ruby>月<rt>がつ</rt></ruby>
    // Match pattern: (số*)(kanji)（furigana） - tách số ra khỏi kanji
    text = text.replace(new RegExp("(" + numberPattern + ")(" + kanjiWord + ")（([^）]+)）", "g"), function(match, p1, p2, p3) {
        // Ngoại lệ: nếu furigana là "ー" (placeholder dropdown), giữ nguyên để không phá "（ー）"
        // Ví dụ: "（ー）時（ー）分" phải sinh 2 dropdown
        if (p3.trim() === "ー") {
            return match;
        }
        // Trả về: số + <ruby>kanji<rt>furigana</rt></ruby>
        // Điều này đảm bảo furigana chỉ nằm trên kanji, không nằm trên số
        return p1 + '<ruby>' + p2 + '<rt>' + p3 + '</rt></ruby>';
    });
    
    // Then convert regular parentheses: 車(くるま) -> <ruby>車<rt>くるま</rt></ruby>
    // Tách số ra khỏi kanji: 12月(がつ) -> 12<ruby>月<rt>がつ</rt></ruby>
    // Match pattern: (số*)(kanji)(furigana) - tách số ra khỏi kanji
    text = text.replace(new RegExp("(" + numberPattern + ")(" + kanjiWord + ")\\(([^)]+)\\)", "g"), function(match, p1, p2, p3) {
        // Trả về: số + <ruby>kanji<rt>furigana</rt></ruby>
        return p1 + '<ruby>' + p2 + '<rt>' + p3 + '</rt></ruby>';
    });
    
    return text;
}

export const getListenWriteAnswerWithImageTemplate = (questionText, correctAnswers, audioFile, timeSegmentsString = '0-0', instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', answerContent = '', blankOptions = '') => {
    
    // Parse the correct answers from blankOptions
    // Format: "10:30〜5:00;月/げつ" - each blank separated by semicolon, multiple answers for one blank separated by /
    let correctAnswersArray = [];
    if (blankOptions && blankOptions.trim()) {
        correctAnswersArray = blankOptions.split(';').map(answerGroup => {
            const answers = answerGroup.trim().split('/').map(answer => answer.trim());
            return answers;
        });
    }
    
    // Process the question text (only for display, not for answers)
    const processedLines = questionText.split('\n').map(line => line.trim()).filter(line => line);
    
    // Use answer content if provided, otherwise leave answers empty
    let answersList = '';
    if (answerContent && answerContent.trim()) {
        // Process each line of the answer content
        const answerLines = answerContent.split('\n').map(line => line.trim()).filter(line => line);
        
        // Process each line of answer content to replace placeholders with text inputs
        let answerInputIndex = 0;
        const processedAnswerLines = answerLines.map((line, lineIndex) => {
            // Process each placeholder in the line
            let processedLine = line;
            const placeholderRegex = /（ー）/g;
            let match;
            let currentPosition = 0;
            let resultLine = '';

            // Process each placeholder match in sequence
            while ((match = placeholderRegex.exec(line)) !== null) {
                // Add text before the placeholder
                resultLine += line.substring(currentPosition, match.index);
                
                // Get the correct answers for this input
                const correctAnswersForBlank = correctAnswersArray[answerInputIndex] || [''];
                
                // Create the text input element
                const textInput = `
                    <input type="text" 
                           class="answer-input" 
                           data-blank-number="${answerInputIndex + 1}" 
                           data-correct='${JSON.stringify(correctAnswersForBlank)}'>
                `;
                
                // Add the text input
                resultLine += textInput;
                
                // Update position and index
                currentPosition = match.index + match[0].length;
                answerInputIndex++;
            }
            
            // Add any remaining text after the last placeholder
            resultLine += line.substring(currentPosition);
            
            return resultLine;
        });
        
        // Wrap each line in a div for separate lines
        answersList = processedAnswerLines.map(line => 
            `<div class="answer-item">${line}</div>`
        ).join('\n');
    }

    // Process script text to highlight quoted text in red and convert furigana (like template 29)
    
    // First, handle newlines and normalize the text
    const normalizedScriptText = scriptText
        .replace(/\n/g, '<br>')  // Convert newlines to HTML breaks
        .replace(/\r/g, '');     // Remove carriage returns
    
    // Then process quotes for highlighting
    const processedScriptText = normalizedScriptText
        .replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    // Convert furigana
    const finalScriptText = convertFurigana(processedScriptText);
    
    // Extract the first line as the question text and apply furigana
    const firstLine = convertFurigana(processedLines[0] || questionText);
    
    let template = listenWriteAnswerWithImageTemplate
        .replace('{{QUESTION_TEXT}}', firstLine)
        .replace(/{{ANSWERS_LIST}}/g, answersList) // Replace all occurrences
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{TIME_SEGMENTS}}', timeSegmentsString || '0-0')
        .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
        .replace('{{SCRIPT_TEXT}}', finalScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    return template;
};

export const listenWriteAnswerWithImageTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Listen Write Answer with Image Quiz</title>
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
            height: 620px;
            display: flex;
            flex-direction: column;
            gap: 0;
            background-color: white;
            max-height: 620px;
            overflow-y: auto;
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
        }
        .main-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
            height: 100%;
            background-color: white;
            overflow-y: auto;
            align-items: center;
        }
        .left-section {
            width: 100%;
            max-width: 800px;
            background: white;
            overflow-y: auto;
        }
        .right-section {
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            background: white;
            padding-left: 0;
            overflow-y: auto;
        }
        .content-wrapper {
            background: white;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
            height: 100%;
            align-items: center;
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
            padding: 5px 10px;
            background-color: #fff;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: keep-all;
            flex-shrink: 0;
            box-sizing: border-box;
            letter-spacing: 0.3px;
        }
        .instructions:before {
            display: none;
        }
        .question-text {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.6;
            text-align: center;
            color: #333;
            margin: 0;
            position: relative;
            padding: 10px;
            letter-spacing: 0.4px;
        }
        .question-text:before {
            display: none;
        }
        .audio-container {
            margin: 0 auto 10px auto;
            width: 100%;
            max-width: 600px;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .custom-audio-player {
            width: 100%;
            max-width: 450px;
            margin: 0;
            background-color: white;
            border-radius: 4px;
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border: 1px solid #e0e0e0;
        }
        .select-container {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            background: white;
            width: 100%;
            max-width: 600px;
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
            z-index: 1001;
            border: 2px solid #0075b4;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-height: 300px;
            overflow-y: auto;
            top: 50%;
            transform: translateY(-50%);
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
            font-size: 0.65rem;
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
            padding: 2px 6px; 
            border-radius: 4px; 
            background-color: #4caf50; 
            display: inline-block; 
            margin: 0 2px;
            letter-spacing: 0.4px;
            white-space: nowrap;
            vertical-align: baseline;
        }
        .correct-answer rt { color: #fff !important; }
        .wrong-answer { 
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.6;
            text-align: left;
            color: #fff; 
            padding: 2px 6px; 
            border-radius: 4px; 
            background-color: #f44336; 
            display: inline-block; 
            margin: 0 2px;
            letter-spacing: 0.4px;
            white-space: nowrap;
            vertical-align: baseline;
        }
        .wrong-answer rt { color: #fff !important; }
        .answer-replacement { 
            display: inline-block; 
            vertical-align: baseline;
        }
        /* Keep rest of the existing styles */
        .player-status {
            font-weight: bold;
            color: #333;
            margin: 0;
            text-align: left;
            font-size: 0.6rem;
            padding: 0;
        }
        .divider {
            height: 1px;
            background-color: transparent;
            width: 100%;
            margin: 3px 0;
        }
        .controls-row {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 2px 0;
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
            font-size: 0.6rem;
            color: #333;
            margin-right: 8px;
            font-weight: bold;
            padding: 0 5px;
        }
        .volume-control {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 2px;
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
            gap: 5px;
            width: 100%;
            align-items: flex-start;
        }
        .answer-paragraph-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0;
            background-color: rgba(99, 97, 97, 0.95);
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
            display: none;
            z-index: 2;
            transition: transform 0.3s ease;
            max-height: 700px;
            overflow-y: auto;
        }
        .answer-paragraph-inner {
            max-width: 90%;
            margin: 0 auto;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            max-height: 400px;
            overflow-y: auto;
        }
        .transcript-section {
            margin-bottom: 1.5rem;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            overflow-y: auto;
        }
        .transcript-title {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
            text-align: center;
        }
        .transcript-text {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            margin-bottom: 1rem;
            white-space: pre-wrap;
        }
        .score-display {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
        }
        .answer-paragraph {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            margin: 0;
            background-color: white;
            box-shadow: none;
            border-radius: 3px;
            display: block;
            border: 1px solid #e0e0e0;
            overflow-y: auto;
            max-height: 200px;
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
        .answer-input {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.3;
            text-align: left;
            width: 40px;
            min-width: 40px;
            max-width: 200px;
            padding: 2px 6px;
            border: 2px solid #0075b4;
            border-radius: 4px;
            background-color: white;
            color: #333;
            display: inline-block;
            transition: width 0.3s ease;
        }
        .answer-input:focus {
            outline: none;
            border-color: #0075b4;
        }
        .answer-input.correct {
            border-color: #2e7d32 !important;
            background-color: #ecf3ec !important;
            color: #2e7d32 !important;
        }
        .answer-input.incorrect {
            border-color: #b40000 !important;
            background-color: #f9ecec !important;
            color: #b40000 !important;
        }
        @media (max-width: 768px) {
            .main-content {
                flex-direction: column;
                gap: 15px;
            }
            .left-section,
            .right-section {
                width: 100%;
                max-width: 100%;
                padding: 0;
                margin: 0;
            }
            .content-wrapper {
                gap: 15px;
                padding: 0;
            }
            .select-container {
                width: 100%;
                max-width: 100%;
            }
            .audio-container {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-content">
            <div class="content-wrapper">
                <div class="instructions" id="quiz-instructions">
                    {{INSTRUCTIONS}}
                </div>
                
                <div class="audio-container">
                    <audio id="audio-player" class="audio-player">
                        <source src="{{AUDIO_FILE}}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <div class="custom-audio-player">
                        <div class="controls-row" style="justify-content: center; align-items: center;">
                            <div id="player-status" class="player-status" style="margin: 0;">Current Status: Starting in 10s...</div>
                        </div>
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
                
                <div class="question-text">{{QUESTION_TEXT}}</div>
                
                <form id="quizForm" onsubmit="return false;">
                    <div class="select-container">
                        <div class="answers-list">{{ANSWERS_LIST}}</div>
                    </div>
                    <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
                </form>
            </div>
        </div>
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div class="transcript-section">
                    <div class="transcript-title">スクリプト</div>
                    <div id="transcript-paragraph" class="transcript-text">{{SCRIPT_TEXT}}</div>
                </div>
                <div class="your-answer-section">
                    <div class="score-display" id="score-display"></div>
                    <div id="answer-paragraph" class="answer-paragraph"></div>
                </div>
            </div>
        </div>
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
        
        // Function to normalize text for flexible comparison (handles full-width/half-width)
    function normalizeText(text) {
        if (!text) return '';
        
        return text
            .trim() // Remove leading/trailing spaces
            .toLowerCase() // Convert to lowercase
            .replace(/[！]/g, '!') // Full-width exclamation to half-width
            .replace(/[？]/g, '?') // Full-width question to half-width
            .replace(/[，]/g, ',') // Full-width comma to half-width
            .replace(/[。]/g, '.') // Full-width period to half-width
            .replace(/[：]/g, ':') // Full-width colon to half-width
            .replace(/[；]/g, ';') // Full-width semicolon to half-width
            .replace(/[（]/g, '(') // Full-width parentheses to half-width
            .replace(/[）]/g, ')') // Full-width parentheses to half-width
            .replace(/[「]/g, '"') // Full-width quotes to half-width
            .replace(/[」]/g, '"') // Full-width quotes to half-width
            .replace(/[『]/g, "'") // Full-width single quotes to half-width
            .replace(/[』]/g, "'") // Full-width single quotes to half-width
            .replace(/[～]/g, '~') // Full-width tilde to half-width
            .replace(/[－]/g, '-') // Full-width dash to half-width
            .replace(/[０-９]/g, function(match) {
                return String.fromCharCode(match.charCodeAt(0) - 0xFF10 + 0x30);
            }) // Full-width numbers to half-width
            .replace(/[Ａ-Ｚ]/g, function(match) {
                return String.fromCharCode(match.charCodeAt(0) - 0xFF21 + 0x41);
            }) // Full-width uppercase letters to half-width
            .replace(/[ａ-ｚ]/g, function(match) {
                return String.fromCharCode(match.charCodeAt(0) - 0xFF41 + 0x61);
            }) // Full-width lowercase letters to half-width
            .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
            .replace(/[\u3000]/g, ' '); // Full-width space to half-width space
    }
        
        // Function to check if user answer matches any correct answer (flexible comparison)
        function isAnswerCorrect(userAnswer, correctAnswers) {
            if (!userAnswer || !correctAnswers || correctAnswers.length === 0) return false;
            
            const normalizedUserAnswer = normalizeText(userAnswer);
            
            return correctAnswers.some(correctAnswer => {
                const normalizedCorrectAnswer = normalizeText(correctAnswer);
                return normalizedCorrectAnswer === normalizedUserAnswer;
            });
        }
        
        // Store total questions from parent
        let actualTotalQuestions = 0; // Default value

        // Listen for quiz.config message from parent
        window.addEventListener('message', function(event) {
            try {
                if (event.data && event.data.type === 'quiz.config') {
                    if (event.data.data && typeof event.data.data.totalQuestions === 'number') {
                        actualTotalQuestions = event.data.data.totalQuestions;
                    }
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        function calculateResults() {
            try {
                
                const answeredQuestions = document.querySelectorAll('.answer-input').length;
                let correctCount = 0;
                const answers = {};
                
                document.querySelectorAll('.answer-input').forEach((input, index) => {
                    try {
                        const userAnswer = input.value.trim();
                        const correctAnswersForBlank = JSON.parse(input.getAttribute('data-correct') || '[]');
                        selectedAnswers[index] = userAnswer;
                        
                        // Check if user answer matches any of the correct answers (flexible comparison)
                        const isCorrect = isAnswerCorrect(userAnswer, correctAnswersForBlank);
                        
                        if (isCorrect) correctCount++;
                        answers[index] = userAnswer;
                    } catch (error) {
                        console.error('Error processing input:', error);
                    }
                });

                const rawScore = actualTotalQuestions > 0 ? correctCount / actualTotalQuestions : 0;
                const message = correctCount === actualTotalQuestions ? '正解です！' : '不正解です。';

                state.answer = JSON.stringify(answers);
                state.score = rawScore;
                state.attempts += 1;

                return {
                    rawScore,
                    message,
                    answers,
                    correctCount,
                    totalQuestions: actualTotalQuestions,
                    answeredQuestions: document.querySelectorAll('.answer-input').length
                };
            } catch (error) {
                console.error('Error calculating results:', error);
                return {
                    rawScore: 0,
                    message: 'エラーが発生しました。',
                    answers: {},
                    correctCount: 0,
                    totalQuestions: actualTotalQuestions,
                    answeredQuestions: 0
                };
            }
        }

        function updateDisplay(result) {
            const answerParagraph = document.getElementById('answer-paragraph');
            const answerContainer = document.getElementById('answer-paragraph-container');
            const scoreDisplay = document.getElementById('score-display');
            
            // Show score and answered questions count
            const answeredText = result.answeredQuestions === result.totalQuestions 
                ? '全問回答済み (' + result.answeredQuestions + '/' + result.totalQuestions + ')'
                : result.answeredQuestions + '/' + result.totalQuestions + ' 問回答済み';
            
            scoreDisplay.textContent = result.message + ' ' + answeredText;
            
            if (state.showAnswer) {
            try {
                // Replace text inputs with text display in the answers list
                const inputs = document.querySelectorAll('.answer-input');
                for (let i = 0; i < inputs.length; i++) {
                    try {
                        const input = inputs[i];
                        const userAnswer = selectedAnswers[i];
                        const correctAnswersForBlank = JSON.parse(input.getAttribute('data-correct') || '[]');
                        
                        // Check if user answer is correct (flexible comparison)
                        const isCorrect = isAnswerCorrect(userAnswer, correctAnswersForBlank);
                        
                        const replacementSpan = document.createElement('span');
                        replacementSpan.className = 'answer-replacement';
                        replacementSpan.setAttribute('data-correct', input.getAttribute('data-correct') || '[]');
                        
                        if (userAnswer) {
                            if (isCorrect) {
                                replacementSpan.innerHTML = '<span class="correct-answer">' + userAnswer + '</span>';
                            } else {
                                // Show all correct answers separated by /
                                const correctAnswersDisplay = correctAnswersForBlank.join(' / ');
                                replacementSpan.innerHTML = '<span class="wrong-answer">' + userAnswer + '</span> <span class="correct-answer">' + correctAnswersDisplay + '</span>';
                            }
                        } else {
                            // Show all correct answers separated by /
                            const correctAnswersDisplay = correctAnswersForBlank.join(' / ');
                            replacementSpan.innerHTML = '<span class="wrong-answer">未回答</span> <span class="correct-answer">' + correctAnswersDisplay + '</span>';
                        }
                        
                        // Replace the input with the text display
                        if (input.parentNode) {
                            input.parentNode.replaceChild(replacementSpan, input);
                        }
                    } catch (error) {
                        console.error('Error processing input:', error);
                    }
                }
            } catch (error) {
                console.error('Error replacing inputs:', error);
            }
            }
            
            try {
                // Also update the popup display
                let answerHtml = '';
                const numbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
                
                document.querySelectorAll('.answer-input, .answer-replacement').forEach((element, index) => {
                    try {
                        const number = numbers[index] || (index + 1).toString() + '.';
                        const userAnswer = selectedAnswers[index];
                        const correctAnswersForBlank = JSON.parse(element.getAttribute('data-correct') || '[]');
                        
                        // Check if user answer is correct (flexible comparison)
                        const isCorrect = isAnswerCorrect(userAnswer, correctAnswersForBlank);
                        
                        answerHtml += '<div class="answer-item-result">' + number + ' ';
                        
                        if (userAnswer) {
                            if (isCorrect) {
                                answerHtml += '<span class="correct-answer">' + userAnswer + '</span> ✓';
                            } else {
                                // Show all correct answers separated by /
                                const correctAnswersDisplay = correctAnswersForBlank.join(' / ');
                                answerHtml += '<span class="wrong-answer">' + userAnswer + '</span> → ' +
                                             '<span class="correct-answer">' + correctAnswersDisplay + '</span> ✗';
                            }
                        } else {
                            // Show all correct answers separated by /
                            const correctAnswersDisplay = correctAnswersForBlank.join(' / ');
                            answerHtml += '<span class="no-answer">未回答</span> → ' +
                                         '<span class="correct-answer">' + correctAnswersDisplay + '</span>';
                        }
                        
                        answerHtml += '</div>';
                    } catch (error) {
                        console.error('Error processing answer item:', error);
                    }
                });
            
                answerParagraph.innerHTML = answerHtml;
                
                // Don't show answer container automatically - only when ShowScript is clicked
                answerContainer.style.display = 'none';
            } catch (error) {
                console.error('Error updating popup display:', error);
            }
        }

        // Function to auto-resize input based on content
        function autoResizeInput(input) {
            // Create a temporary span to measure text width
            const tempSpan = document.createElement('span');
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'nowrap';
            tempSpan.style.font = window.getComputedStyle(input).font;
            tempSpan.textContent = input.value || 'M'; // Use 'M' as minimum width reference
            
            document.body.appendChild(tempSpan);
            const textWidth = tempSpan.offsetWidth;
            document.body.removeChild(tempSpan);
            
            // Calculate new width (text width + padding + border)
            const padding = 16; // 4px left + 4px right + 8px total
            const border = 4; // 2px left + 2px right
            const newWidth = Math.max(30, Math.min(150, textWidth + padding + border));
            
            input.style.width = newWidth + 'px';
        }

        // Add change event listener to each input
        document.querySelectorAll('.answer-input').forEach((input, index) => {
            input.addEventListener('input', function() {
                selectedAnswers[index] = this.value;
                autoResizeInput(this);
                if (state.showAnswer) {
                    const result = calculateResults();
                    updateDisplay(result);
                }
            });
            
            // Auto-resize on initial load
            autoResizeInput(input);
        });

        // Listen for messages from parent (Check button and ShowScript button)
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
            
            // Handle ShowScript button click (like template 63)
            if (event.data && event.data.type === 'show.script') {
                showScriptPopup();
            }
            
            // Handle get answers request
            if (event.data && event.data.type === 'quiz.get_answers') {
                saveQuizResults(); // This will collect and send answers
            } else if (event.data && event.data.type === 'ping') {
                // Respond with pong
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'pong',
                        data: { message: 'Template 67 is ready!', timestamp: new Date().toISOString() }
                    }, '*');
                }
            }
        });

        function showScriptPopup() {
            
            // Show the answer container with script (like template 63)
            const answerContainer = document.getElementById('answer-paragraph-container');
            if (answerContainer) {
                answerContainer.style.display = 'block';
            }
        }

        function saveQuizResults() {
            
            // Get all answers
            const answers = [];
            document.querySelectorAll('.answer-input').forEach((input, index) => {
                try {
                    const userAnswer = input.value.trim();
                    const correctAnswersForBlank = JSON.parse(input.getAttribute('data-correct') || '[]');
                    
                    answers.push({
                        userAnswer,
                        isCorrect: isAnswerCorrect(userAnswer, correctAnswersForBlank)
                    });
                } catch (error) {
                    console.error('Error processing input:', error);
                }
            });
            
            // Send only user answers to parent
            if (window.parent) {
                window.parent.postMessage({
                    type: 'quiz.answers',
                    answers: answers // Array of {userAnswer, isCorrect}
                }, '*');
            }
        }

        function resetQuiz() {
            
            // Restore text inputs from answer replacements (like template 63)
            const answerReplacements = document.querySelectorAll('.answer-replacement');
            answerReplacements.forEach((replacement, index) => {
                // Create new input element to replace the span
                const newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.className = 'answer-input';
                newInput.setAttribute('data-blank-number', index + 1);
                newInput.setAttribute('data-correct', replacement.getAttribute('data-correct') || '[]');
                
                // Add event listener
                newInput.addEventListener('input', function() {
                    selectedAnswers[index] = this.value;
                    autoResizeInput(this);
                    if (state.showAnswer) {
                        const result = calculateResults();
                        updateDisplay(result);
                    }
                });
                
                // Replace the span with the new input
                replacement.parentNode.replaceChild(newInput, replacement);
                
                // Auto-resize the new input
                autoResizeInput(newInput);
            });
            
            // Clear all text inputs
            document.querySelectorAll('.answer-input').forEach((input, index) => {
                input.value = '';
                input.classList.remove('correct', 'incorrect');
                input.disabled = false;
            });
            
            // Clear selected answers
            selectedAnswers = [];
            for (let j = 0; j < correctAnswers.length; j++) {
                selectedAnswers.push('');
            }
            
            // Reset state completely
            state.answer = '';
            state.score = 0;
            state.showAnswer = false;
            
            // Hide answer container
            const answerContainer = document.getElementById('answer-paragraph-container');
            if (answerContainer) {
                answerContainer.style.display = 'none';
            }
            
            // Reset audio player and start with delay (like initial load)
            if (audioPlayer) {
                audioPlayer.startWithDelay();
            }
        }

        function getGrade() {
            const result = calculateResults();
            
            // Show answers but not script (like template 63)
            state.showAnswer = true;
            updateDisplay(result);
            
            // Pause audio when showing answers
            const audioElement = document.getElementById('audio-player');
            audioElement.pause();
            
            // Also pause countdown if it's running
            if (audioPlayer && audioPlayer.pauseCountdown) {
                audioPlayer.pauseCountdown();
            }
            
            // Send quiz data to parent for ShowScript button (like template 63)
            try {
                // Get script text from the template - use innerHTML to preserve HTML tags
                const scriptTextElement = document.getElementById('script-text-hidden');
                const scriptText = scriptTextElement ? scriptTextElement.innerHTML : '';
                
                // Encode script text to handle special characters (like template 29)
                const encodedScriptText = encodeScriptText(scriptText);
                
                const quizData = {
                    templateId: 67,
                    scriptText: encodedScriptText
                };
                
                // Send message to parent to show ShowScript button (like template 63)
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'quiz.data.ready',
                        quizData: quizData
                    }, '*');
                }
            } catch (error) {
                console.error('Error sending quiz data to parent:', error);
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
                    edxResult: null,
                    edxScore: result.rawScore,
                    edxMessage: result.message
                };
                
                return JSON.stringify(returnValue);
            } catch (error) {
                console.error('Error in return value:', error);
                return JSON.stringify({
                    edxResult: null,
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
                            const input = document.querySelectorAll('.answer-input')[index];
                            if (input) {
                                input.value = value;
                            }
                        });

                        const result = calculateResults();
                        updateDisplay(result);
                        
                        // Don't show answer container automatically - only when ShowScript is clicked (like template 63)
                        document.getElementById('answer-paragraph-container').style.display = 'none';
                        document.getElementById('showAnswerFlag').value = 
                            state.showAnswer ? 'true' : 'false';
                            
                        if (state.showAnswer) {
                            // If showing answers, just pause audio without resetting
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
                    // If no audio segments, send timer.start message immediately so timer can start
                    try {
                        if (window.parent) {
                            window.parent.postMessage({
                                type: 'timer.start',
                                templateId: 67,
                                unitId: window.location.href.match(/unit[\/=]([^\/\?&]+)/)?.[1] || ''
                            }, '*');
                            console.log('✅ No audio segments - sent timer.start message immediately');
                        }
                    } catch (error) {
                        console.error('Error sending timer.start message:', error);
                    }
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
                            
                            // Send timer.start message to parent after audio completed (template 67)
                            try {
                                if (window.parent) {
                                    window.parent.postMessage({
                                        type: 'timer.start',
                                        templateId: 67,
                                        unitId: window.location.href.match(/unit[\/=]([^\/\?&]+)/)?.[1] || ''
                                    }, '*');
                                    console.log('✅ Sent timer.start message to parent (after audio completed)');
                                }
                            } catch (error) {
                                console.error('Error sending timer.start message:', error);
                            }
                            
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
            })
            .catch(error => {
                // Error handling
                console.error('❌ Error marking quiz completion:', error);
            });
        }

        // Add event listener for when audio is ready to play
        const audioElement = document.getElementById('audio-player');
        audioElement.addEventListener('canplaythrough', () => {
            // Audio is ready to play
        });

        // Add event listener for when audio starts loading
        audioElement.addEventListener('loadstart', () => {
            // Audio started loading
        });

        // Add event listener for when audio finishes loading
        audioElement.addEventListener('loadeddata', () => {
            // Audio data loaded
        });

    })();
    </script>
</body>
</html>`; 
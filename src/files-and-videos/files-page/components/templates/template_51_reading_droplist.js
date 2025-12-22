export const getReadingDroplistTemplate = (questionText, correctAnswers, instructions = '文章を読んで、正しい答えを選んでください。', scriptText = '', imageFile = '', answerContent = '', blankOptions = '') => {
    // Log the incoming parameters to help debug
    console.log('getReadingDroplistTemplate called with:', {
        questionText,
        correctAnswers,
        answerContent,
        blankOptions
    });
    
    // Parse the blank options for dropdowns - these are the options for all dropdowns
    let optionsArray = [];
    if (blankOptions && blankOptions.trim()) {
        // Remove duplicates by converting to Set and back to array
        optionsArray = [...new Set(blankOptions.split(',').map(option => option.trim()).filter(option => option))];
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
        // Default to the first option for all answers if no correct answers provided
        correctAnswersArray = new Array(7).fill(optionsArray[0]);
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
                // Get the correct answer for this dropdown (use the index if available, otherwise default to first option)
                const correctAnswer = correctAnswersArray[answerDropdownIndex] || optionsArray[0];
                
                // Create dropdown options from the options array
                const optionsHtml = optionsArray.map(option => {
                    // Remove the selected attribute to make "Select" the default
                    return `<option value="${option}">${option}</option>`;
                }).join('');
                
                const dropdown = `
                    <select class="answer-select" data-blank-number="${answerDropdownIndex + 1}" data-correct="${correctAnswer}" style="width: auto; min-width: 80px;">
                        <option value="" selected>Select</option>
                        ${optionsHtml}
                    </select>
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

    // Process script text to highlight quoted text in red
    const processedScriptText = scriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    // Extract the first line as the question text
    const firstLine = processedLines[0] || questionText;
    
    let template = readingDroplistTemplate
        .replace('{{QUESTION_TEXT}}', firstLine)
        .replace(/{{ANSWERS_LIST}}/g, answersList) // Replace all occurrences
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    // Process images - support both single image string and array of images
    let imagesHtml = '';
    
    if (imageFile) {
        // If imageFile is a string, split by comma or semicolon
        const imageArray = Array.isArray(imageFile) ? imageFile : imageFile.split(/[,;]/).map(img => img.trim()).filter(img => img);
        
        // Only generate HTML if we have valid image paths
        if (imageArray.length > 0) {
            imagesHtml = imageArray.map((imagePath) => {
                return '<div class="image-item"><img src="' + imagePath + '" alt="Quiz Image" /></div>';
            }).join('');
        } else {
            imagesHtml = '<div class="image-item" style="color: #999; font-style: italic;">No images provided (empty array)</div>';
        }
    } else {
        imagesHtml = '<div class="image-item" style="color: #999; font-style: italic;">No images provided</div>';
    }

    template = template.replace('{{IMAGES}}', imagesHtml);
    
    return template;
};

export const readingDroplistTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Reading Droplist Quiz</title>
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
            max-height: 700px;
        }
        .container {
            position: relative;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 0;
            background-color: white;
            max-height: 700px;
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
            max-height: 700px;
        }
        .right-section {
            flex: 4;
            display: flex;
            flex-direction: column;
            background: white;
            padding-left: 0;
            overflow-y: auto;
            max-height: 700px;
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
            background-color: white;
            color: #333;
            font-style: italic;
            margin: 0 0 20px 0;
            padding: 5px 10px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: keep-all;
            flex-shrink: 0;
            box-sizing: border-box;
            letter-spacing: 0.3px;
        }
        .instructions:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: #0075b4;
        }
        .images-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
            width: 100%;
            overflow-x: hidden;
            min-height: 300px;
            border: 1px dashed #ccc;
            padding: 10px;
            background-color: #f9f9f9;
        }
        .image-item {
            width: 100%;
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .image-item img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .quiz-image {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
        }
        .question-text {
            font-family: 'Kyokashotai', 'Kosugi Maru', 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.6;
            text-align: left;
            background: white;
            color: #333;
            margin: 0;
            position: relative;
            padding-left: 5px;
            letter-spacing: 0.4px;
        }
        .question-text:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: #0075b4;
        }
        .audio-container {
            margin-bottom: 10px;
            width: 90%;
            background-color: white;
        }
        .custom-audio-player {
            width: 90%;
            background-color: white;
            border-radius: 4px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            border: 1px solid #e8e8e8;
        }
        .select-container {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            background: white;
            max-width: 400px;
        }
        .select-answer-header {
            font-size: 1rem;
            color: #333;
            margin: 0;
            font-weight: bold;
        }
        .answer-select {
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
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
            border-color: #0075b4;
        }
        .answer-select option {
            padding: 8px;
            font-size: 0.95rem;
        }
        .answer-select.correct {
            border-color: #2e7d32;
            background-color: #ecf3ec;
        }
        .answer-select.incorrect {
            border-color: #b40000;
            background-color: #f9ecec;
        }
        /* Styling for answer results */
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 3px;
            background-color: #ecf3ec;
        }
        .wrong-answer {
            color: #b40000;
            font-weight: bold;
            text-decoration: line-through;
            padding: 2px 8px;
            border-radius: 3px;
            background-color: #f9ecec;
        }
        /* Keep rest of the existing styles */
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 2px;
        }
        .controls-row {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 3px 0;
        }
        .progress-container {
            flex-grow: 1;
            height: 6px;
            background-color: #e0f0ff;
            border-radius: 3px;
            position: relative;
            cursor: pointer;
            width: 100%;
            margin-right: 0;
        }
        .progress-bar {
            height: 6px;
            background-color: #0075b4;
            width: 0;
            border-radius: 3px;
        }
        .volume-container {
            display: flex;
            align-items: center;
            flex-grow: 1;
        }
        .volume-label {
            font-size: 12px;
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
            background-color: #e0f0ff;
            height: 4px;
            position: relative;
            border-radius: 2px;
        }
        .volume-level {
            background-color: #0075b4;
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
            max-height: 460px;
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
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
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
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
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
        .answer-item {
            font-family: 'Kyokashotai', 'Kosugi Maru', 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.6;
            text-align: left;
            margin: 0;
            color: #333;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
            letter-spacing: 0.4px;
        }
        .answers-list {
            padding: 5px;
            background: white;
            border-radius: 2px;
            margin: 5px 0;
        }
        @media (max-width: 768px) {
            .main-content {
                flex-direction: column;
                gap: 20px;
            }
            .left-section,
            .right-section {
                flex: none;
                width: 100%;
            }
            .content-wrapper {
                gap: 15px;
                padding: 0px;
            }

            .quiz-image {
                max-height: 200px;
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
                    <div class="images-container">
                        {{IMAGES}}
                    </div>
                    <div class="question-text">{{QUESTION_TEXT}}</div>
                </div>
            </div>
            <div class="right-section">
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
    (function() {
        var state = {
            answer: '',
            score: 0,
            attempts: 0,
            showAnswer: false
        };

        const correctAnswers = JSON.parse('{{CORRECT_ANSWERS}}');
        let selectedAnswers = new Array(correctAnswers.length).fill('');
        
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

            return {
                rawScore,
                message,
                answers,
                correctCount,
                totalQuestions
            };
        }

        function updateDisplay(result) {
            const answerParagraph = document.getElementById('answer-paragraph');
            const answerContainer = document.getElementById('answer-paragraph-container');
            const scoreDisplay = document.getElementById('score-display');
            
            scoreDisplay.textContent = result.message;
            
            let answerHtml = '';
            document.querySelectorAll('.answer-select').forEach((select, index) => {
                const number = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][index];
                const userAnswer = selectedAnswers[index];
                const correctAnswer = select.getAttribute('data-correct');
                const isCorrect = correctAnswer === userAnswer;
                
                select.classList.remove('correct', 'incorrect');
                if (state.showAnswer) {
                    select.classList.add(isCorrect ? 'correct' : 'incorrect');
                    select.disabled = true;
                } else {
                    select.disabled = false;
                }
                
                answerHtml += '<div class="answer-item-result">' + number + ' ';
                
                if (userAnswer) {
                    if (isCorrect) {
                        answerHtml += '<span class="correct-answer">' + userAnswer + '</span> ✓';
                    } else {
                        answerHtml += '<span class="wrong-answer">' + userAnswer + '</span> → ' +
                                     '<span class="correct-answer">' + correctAnswer + '</span> ✗';
                    }
                } else {
                    answerHtml += '<span class="no-answer">未回答</span> → ' +
                                 '<span class="correct-answer">' + correctAnswer + '</span>';
                }
                
                answerHtml += '</div>';
            });
            
            answerParagraph.innerHTML = answerHtml;
            
            if (state.showAnswer) {
                answerContainer.style.display = 'block';
            } else {
                answerContainer.style.display = 'none';
            }
        }

        // Add change event listener to each dropdown
        document.querySelectorAll('.answer-select').forEach((select, index) => {
            select.addEventListener('change', function() {
                selectedAnswers[index] = this.value;
                if (state.showAnswer) {
                    const result = calculateResults();
                    updateDisplay(result);
                }
            });
        });

        function getGrade() {
            const answerContainer = document.getElementById('answer-paragraph-container');
            const showFlag = document.getElementById('showAnswerFlag');
            
            const isVisible = answerContainer.style.display === 'block';

            if (isVisible) {
                // Hide answers
                answerContainer.style.display = 'none';
                showFlag.value = 'false';
                state.showAnswer = false;
                
            } else {
                // Show answers
                const result = calculateResults();
                updateDisplay(result);
                answerContainer.style.display = 'block';
                showFlag.value = 'true';
                state.showAnswer = true;
            }

            const result = calculateResults();
            return JSON.stringify({
                edxResult: None,
                edxScore: result.rawScore,
                edxMessage: result.message
            });
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
                            const select = document.querySelectorAll('.answer-select')[index];
                            if (select) {
                                select.value = value;
                            }
                        });

                        const result = calculateResults();
                        updateDisplay(result);
                        
                        document.getElementById('answer-paragraph-container').style.display = 
                            state.showAnswer ? 'block' : 'none';
                        document.getElementById('showAnswerFlag').value = 
                            state.showAnswer ? 'true' : 'false';
                            
                        if (state.showAnswer) {
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
        
        // Send timer.start message after template loads (template 51 - no audio, start immediately)
        function sendTimerStart() {
            try {
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'timer.start',
                        templateId: 51,
                        unitId: window.location.href.match(/unit[\/=]([^\/\?&]+)/)?.[1] || ''
                    }, '*');
                    console.log('✅ Sent timer.start message to parent (template 51 - after load)');
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
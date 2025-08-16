export const getListenWriteAnswerWithImageTemplate = (questionText, correctAnswers, audioFile, startTime = 0, endTime = 0, instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', imageFile = '', answerContent = '', blankOptions = '') => {
    // Log the incoming parameters to help debug
    console.log('getListenWriteAnswerWithImageTemplate called with:', {
        questionText,
        correctAnswers,
        answerContent,
        blankOptions
    });
    
    // Parse the correct answers from blankOptions
    // Format: "9:00〜12:00;4:30〜7:30;日/にち" - each blank separated by semicolon, multiple answers for one blank separated by /
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
                           data-correct='${JSON.stringify(correctAnswersForBlank)}' 
                           placeholder="答えを入力してください" 
                           style="width: auto; min-width: 120px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 1rem;">
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
        
        // Wrap each line in a div
        answersList = processedAnswerLines.map(line => 
            `<div class="answer-item">${line}</div>`
        ).join('\n');
    }

    // Process script text to highlight quoted text in red
    const processedScriptText = scriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    // Extract the first line as the question text
    const firstLine = processedLines[0] || questionText;
    
    let template = listenWriteAnswerWithImageTemplate
        .replace('{{QUESTION_TEXT}}', firstLine)
        .replace(/{{ANSWERS_LIST}}/g, answersList) // Replace all occurrences
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{START_TIME}}', startTime || 0)
        .replace('{{END_TIME}}', endTime || 0)
        .replace('{{INSTRUCTIONS}}', instructions)
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

export const listenWriteAnswerWithImageTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Listen Write Answer with Image Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
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
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            background-color: white;
            color: #333;
            font-style: italic;
            margin: 0;
            position: relative;
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
        .image-container {
            width: 100%;
            max-height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: white;
        }
        .quiz-image {
            max-width: 100%;
            max-height: 400px;
            object-fit: contain;
        }
        .question-text {
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            background: white;
            color: #333;
            margin: 0;
            position: relative;
            padding-left: 5px;
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
        .input-container {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            background: white;
            max-width: 400px;
        }
        .input-answer-header {
            font-size: 1rem;
            color: #333;
            margin: 0;
            font-weight: bold;
        }
        .answer-input {
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            width: auto;
            min-width: 120px;
            padding: 4px 8px;
            border: 1px solid #666;
            border-radius: 4px;
            background-color: white;
            color: #333;
            display: inline-block;
        }
        .answer-input:focus {
            outline: none;
            border-color: #0075b4;
        }
        .answer-input.correct {
            border-color: #2e7d32;
            background-color: #ecf3ec;
        }
        .answer-input.incorrect {
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
            cursor: default;
            width: 100%;
            margin-right: 0;
            pointer-events: none; /* Disable all pointer interactions */
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
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            text-align: left;
            margin-bottom: 10px;
            color: #333;
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
            .input-container {
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
                            <span id="start-time">{{START_TIME}}</span>
                            <span id="end-time">{{END_TIME}}</span>
                        </div>
                    </div>
                    <div class="input-container">
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
            const totalQuestions = document.querySelectorAll('.answer-input').length;
            let correctCount = 0;
            const answers = {};
            
            document.querySelectorAll('.answer-input').forEach((input, index) => {
                const userAnswer = input.value.trim();
                const correctAnswersForBlank = JSON.parse(input.getAttribute('data-correct'));
                selectedAnswers[index] = userAnswer;
                
                // Check if user answer matches any of the correct answers (case insensitive)
                const isCorrect = correctAnswersForBlank.some(correctAnswer => 
                    correctAnswer.toLowerCase() === userAnswer.toLowerCase()
                );
                
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
            document.querySelectorAll('.answer-input').forEach((input, index) => {
                const number = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][index];
                const userAnswer = selectedAnswers[index];
                const correctAnswersForBlank = JSON.parse(input.getAttribute('data-correct'));
                
                // Check if user answer is correct (case insensitive)
                const isCorrect = correctAnswersForBlank.some(correctAnswer => 
                    correctAnswer.toLowerCase() === userAnswer.toLowerCase()
                );
                
                input.classList.remove('correct', 'incorrect');
                if (state.showAnswer) {
                    input.classList.add(isCorrect ? 'correct' : 'incorrect');
                    input.disabled = true;
                } else {
                    input.disabled = false;
                }
                
                answerHtml += '<div class="answer-item-result">' + number + ' ';
                
                if (userAnswer) {
                    if (isCorrect) {
                        answerHtml += '<span class="correct-answer">' + userAnswer + '</span> ✓';
                    } else {
                        answerHtml += '<span class="wrong-answer">' + userAnswer + '</span> → ' +
                                     '<span class="correct-answer">' + correctAnswersForBlank.join(' / ') + '</span> ✗';
                    }
                } else {
                    answerHtml += '<span class="no-answer">未回答</span> → ' +
                                 '<span class="correct-answer">' + correctAnswersForBlank.join(' / ') + '</span>';
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

        // Add change event listener to each input
        document.querySelectorAll('.answer-input').forEach((input, index) => {
            input.addEventListener('input', function() {
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
            const audioElement = document.getElementById('audio-player');
            const startTimeElement = document.getElementById('start-time');
            
            const startTime = parseFloat(startTimeElement?.textContent) || 0;
            const isVisible = answerContainer.style.display === 'block';

            if (isVisible) {
                // Hide answers
                answerContainer.style.display = 'none';
                showFlag.value = 'false';
                state.showAnswer = false;
                
                // Reset to start time and play with delay
                audioElement.currentTime = startTime;
                audioPlayer.startWithDelay();
            } else {
                // Show answers
                const result = calculateResults();
                updateDisplay(result);
                answerContainer.style.display = 'block';
                showFlag.value = 'true';
                state.showAnswer = true;
                
                // Pause the audio
                audioElement.pause();
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
                            const input = document.querySelectorAll('.answer-input')[index];
                            if (input) {
                                input.value = value;
                            }
                        });

                        const result = calculateResults();
                        updateDisplay(result);
                        
                        document.getElementById('answer-paragraph-container').style.display = 
                            state.showAnswer ? 'block' : 'none';
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
            const startTimeElement = document.getElementById('start-time');
            const endTimeElement = document.getElementById('end-time');
            const playerStatus = document.getElementById('player-status');
            
            const startTime = parseFloat(startTimeElement?.textContent) || 0;
            const endTime = parseFloat(endTimeElement?.textContent) || 0;
            let isPlaying = false;
            let countdownInterval = null;
            let isFirstLoad = true;
            
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
            
            // Start countdown and auto-play
            function startCountdown() {
                // Only start countdown on first load or if explicitly requested
                if (!isFirstLoad) {
                    return;
                }
                
                // Clear any existing countdown
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }
                
                // Set to start time
                audioElement.currentTime = startTime;
                
                // Update status to show countdown
                playerStatus.textContent = 'Current Status: Starting in 3s...';
                
                // Countdown timer
                let countdown = 3;
                countdownInterval = setInterval(function() {
                    countdown--;
                    if (countdown > 0) {
                        playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                    } else {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        
                        // Function to try playing with multiple retries
                        let retryCount = 0;
                        const maxRetries = 3;
                        
                        const tryPlayWithRetry = () => {
                            audioElement.play()
                                .then(() => {
                                    isPlaying = true;
                                    playerStatus.textContent = 'Current Status: Playing';
                                    isFirstLoad = false; // Set flag to false after first successful play
                                })
                                .catch((error) => {
                                    console.error('Error playing audio (attempt ' + (retryCount + 1) + '):', error);
                                    retryCount++;
                                    
                                    if (retryCount < maxRetries) {
                                        setTimeout(() => {
                                            tryPlayWithRetry();
                                        }, retryCount * 500);
                                    } else {
                                        playerStatus.textContent = 'Current Status: Error playing audio';
                                        isFirstLoad = false; // Set flag to false even if play fails
                                    }
                                });
                        };
                        
                        tryPlayWithRetry();
                    }
                }, 1000);
            }
            
            // Update progress bar
            function updateProgress() {
                if (audioElement.duration) {
                    // Calculate relative to the start/end times
                    const currentRelative = audioElement.currentTime - startTime;
                    const durationRelative = (endTime > 0 ? endTime : audioElement.duration) - startTime;
                    
                    // Update progress bar width
                    const progressPercent = (currentRelative / durationRelative) * 100;
                    progressBar.style.width = Math.max(0, Math.min(100, progressPercent)) + '%';
                }
                
                // Check if we've reached the end time
                if (endTime > 0 && audioElement.currentTime >= endTime) {
                    audioElement.pause();
                    audioElement.currentTime = startTime;
                    isPlaying = false;
                    playerStatus.textContent = 'Current Status: Paused';
                }
            }
            
            // Remove click handler for progress bar
            progressContainer.style.pointerEvents = 'none';
            
            // Update progress during playback
            audioElement.addEventListener('timeupdate', updateProgress);
            
            // When metadata is loaded, set up the player
            audioElement.addEventListener('loadedmetadata', () => {
                // If endTime is not set or is greater than duration, use full duration
                if (endTime <= 0 || endTime > audioElement.duration) {
                    endTime = audioElement.duration;
                }
                
                // Set to start time
                audioElement.currentTime = startTime;
                
                // Start countdown after metadata is loaded
                startCountdown();
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
            
            // Handle error event
            audioElement.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                playerStatus.textContent = 'Current Status: Error loading audio';
            });
            
            // Set initial volume
            audioElement.volume = volumeSlider.value / 100;
            updateVolumeDisplay();
            
            // Modify visibility change handler
            document.addEventListener('visibilitychange', () => {
                // Don't do anything when switching tabs
                // This allows audio to continue playing in background
            });

            // Modify window focus handler
            window.addEventListener('focus', () => {
                // Don't auto-start when window gains focus
                // But if audio was playing, it will continue playing
            });

            // Handle page unload/close
            window.addEventListener('beforeunload', () => {
                if (audioElement) {
                    audioElement.pause();
                }
            });
            
            // Function to start with delay
            function startWithDelay() {
                // Clear any existing countdown
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }
                
                // Reset to start time
                audioElement.currentTime = startTime;
                
                // Update status with countdown
                playerStatus.textContent = 'Current Status: Starting in 3s...';
                
                // Countdown timer
                let countdown = 3;
                countdownInterval = setInterval(function() {
                    countdown--;
                    if (countdown > 0) {
                        playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                    } else {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        // Auto-play when countdown reaches 0
                        audioElement.play()
                            .then(function() {
                                isPlaying = true;
                                playerStatus.textContent = 'Current Status: Playing';
                            })
                            .catch(function(error) {
                                console.error('Error playing audio:', error);
                                playerStatus.textContent = 'Current Status: Error playing audio';
                            });
                    }
                }, 1000);
            }

            // Return functions for external use
            return {
                startCountdown,
                startWithDelay,
                resetToStart: () => {
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                    audioElement.currentTime = startTime;
                    audioElement.pause();
                    isPlaying = false;
                    playerStatus.textContent = 'Current Status: Paused';
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
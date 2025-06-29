export const getListenImageSelectMultipleAnswerTemplate = (questionText, correctAnswers, audioFile, startTime = 0, endTime = 0, instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', imageFile = '') => {
    const answers = correctAnswers.split(',').map(opt => opt.trim());
    const sortedOptions = [...answers].sort((a, b) => a.localeCompare(b, 'ja'));
    
    // Create dropdowns for each blank
    const answersList = answers.map((correctAnswer, index) => {
        const number = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][index];
        const optionsHtml = sortedOptions.map(option => 
            `<option value="${option}">${option}</option>`
        ).join('');
        
        return `
        <div class="answer-item">
            <span class="answer-number">${number}</span>
            <select class="answer-select" data-blank-number="${index + 1}" data-correct="${correctAnswer}">
                <option value="">選択してください</option>
                ${optionsHtml}
            </select>
        </div>`;
    }).join('\n');
    
    // Process script text to highlight quoted text in red
    const processedScriptText = scriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    let template = listenImageSelectMultipleAnswerTemplate
        .replace('{{QUESTION_TEXT}}', questionText)
        .replace('{{ANSWERS_LIST}}', answersList)
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{START_TIME}}', startTime || 0)
        .replace('{{END_TIME}}', endTime || 0)
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(answers));

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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #414141;
            height: auto;
            position: relative;
            overflow-y: hidden;
        }
        .container {
            position: relative;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 0;
        }
        .main-content {
            display: flex;
            gap: 0;
            height: auto;
        }
        .left-section {
            flex: 6;
            background: white;
        }
        .right-section {
            flex: 4;
            display: flex;
            flex-direction: column;
            background: white;
            padding: 10px;
            padding-left: 0;
        }
        .content-wrapper {
            background: white;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
        }
        .instructions {
            background-color: #f5f9fc;
            padding: 10px;
            font-size: 1.1rem;
            line-height: 1.5;
            color: #333;
            font-weight: bold;
            font-style: italic;
            margin: 0;
            position: relative;
            padding-left: 19px;
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
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            background: #f8f8f8;
        }
        .quiz-image {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
        }
        .question-text {
            font-size: 1.2rem;
            padding: 10px;
            background: #f5f9fc;
            color: #333;
            font-weight: bold;
            margin: 0;
            position: relative;
            padding-left: 19px;
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
        }
        .custom-audio-player {
            width: 90%;
            background-color: #f0f7ff;
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
            background: transparent;
            max-width: 400px;
        }
        .select-answer-header {
            font-size: 1rem;
            color: #333;
            margin: 0;
            padding: 5px 0;
            font-weight: bold;
        }
        .answer-select {
            width: 100%;
            padding: 8px;
            font-size: 0.95rem;
            border: 1px solid #666;
            border-radius: 4px;
            background-color: white;
            color: #333;
            cursor: pointer;
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
        /* Keep rest of the existing styles */
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 5px;
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
        .transcript-section {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .transcript-title {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
            text-align: center;
        }
        .transcript-text {
            line-height: 1.8;
            margin-bottom: 1rem;
            white-space: pre-wrap;
        }
        .score-display {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
        }
        .answer-paragraph {
            margin: 0;
            background-color: #ffffff;
            line-height: 1.6;
            box-shadow: none;
            border-radius: 3px;
            padding: 1rem;
            font-size: 1.2rem;
            display: block;
            border: 1px solid #e0e0e0;
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
                padding: 15px;
            }
            .image-container {
                padding: 10px;
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
                    </div>
                    <div class="select-container">
                        <div class="select-answer-header">Please Select Answer</div>
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
            const totalQuestions = correctAnswers.length;
            let correctCount = 0;
            const answers = {};
            
            document.querySelectorAll('.answer-select').forEach((select, index) => {
                const userAnswer = select.value.trim();
                const correctAnswer = correctAnswers[index];
                selectedAnswers[index] = userAnswer;
                
                const isCorrect = correctAnswer === userAnswer;
                if (isCorrect) correctCount++;
                answers[index] = userAnswer;
            });

            const rawScore = correctCount / totalQuestions;
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
                const correctAnswer = correctAnswers[index];
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
                        answerHtml += '<span class="correct-answer">' + userAnswer + '</span>';
                    } else {
                        answerHtml += '<span class="wrong-answer">' + userAnswer + '</span> → ' +
                                     '<span class="correct-answer">' + correctAnswer + '</span>';
                    }
                } else {
                    answerHtml += '<span class="no-answer">選択してください</span>';
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
                            audioPlayer.resetToStart();
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
            
            function updateVolumeDisplay() {
                const volume = volumeSlider.value;
                volumeLevel.style.width = volume + '%';
            }
            
            updateVolumeDisplay();
            
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return minutes + ':' + (secs < 10 ? '0' : '') + secs;
            }
            
            volumeSlider.addEventListener('input', function() {
                const volume = this.value / 100;
                audioElement.volume = volume;
                updateVolumeDisplay();
            });
            
            function initializePlayer() {
                audioElement.currentTime = startTime;
                playerStatus.textContent = 'Current Status: Starting in 3s...';
                
                let countdown = 3;
                const countdownInterval = setInterval(function() {
                    countdown--;
                    if (countdown > 0) {
                        playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                    } else {
                        clearInterval(countdownInterval);
                        audioElement.play()
                            .then(function() {
                                isPlaying = true;
                                playerStatus.textContent = 'Current Status: Playing';
                            });
                    }
                }, 1000);
            }
            
            function updateProgress() {
                if (audioElement.duration) {
                    const currentRelative = audioElement.currentTime - startTime;
                    const durationRelative = (endTime > 0 ? endTime : audioElement.duration) - startTime;
                    
                    const progressPercent = (currentRelative / durationRelative) * 100;
                    progressBar.style.width = progressPercent + '%';
                }
                
                if (endTime > 0 && audioElement.currentTime >= endTime) {
                    audioElement.pause();
                    audioElement.currentTime = startTime;
                    isPlaying = false;
                    playerStatus.textContent = 'Current Status: Paused';
                }
            }
            
            progressContainer.addEventListener('click', (e) => {
                const clickPosition = (e.offsetX / progressContainer.offsetWidth);
                const durationRelative = (endTime > 0 ? endTime : audioElement.duration) - startTime;
                const seekTime = startTime + (clickPosition * durationRelative);
                
                audioElement.currentTime = Math.min(
                    endTime > 0 ? endTime : audioElement.duration,
                    Math.max(startTime, seekTime)
                );
                
                updateProgress();
            });
            
            audioElement.addEventListener('timeupdate', updateProgress);
            
            audioElement.addEventListener('loadedmetadata', () => {
                if (endTime <= 0 || endTime > audioElement.duration) {
                    endTime = audioElement.duration;
                }
                
                audioElement.currentTime = startTime;
                initializePlayer();
            });
            
            audioElement.addEventListener('play', () => {
                isPlaying = true;
                playerStatus.textContent = 'Current Status: Playing';
            });
            
            audioElement.addEventListener('pause', () => {
                isPlaying = false;
                playerStatus.textContent = 'Current Status: Paused';
            });
            
            audioElement.volume = volumeSlider.value / 100;
            updateVolumeDisplay();
            
            function startWithDelay() {
                playerStatus.textContent = 'Current Status: Starting in 3s...';
                
                let countdown = 3;
                const countdownInterval = setInterval(function() {
                    countdown--;
                    if (countdown > 0) {
                        playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                    } else {
                        clearInterval(countdownInterval);
                        audioElement.play()
                            .then(function() {
                                playerStatus.textContent = 'Current Status: Playing';
                            });
                    }
                }, 1000);
            }
            
            return {
                startWithDelay,
                resetToStart: () => {
                    audioElement.currentTime = startTime;
                    audioElement.pause();
                    playerStatus.textContent = 'Current Status: Paused';
                }
            };
        }

        const audioPlayer = setupAudioPlayer();
    })();
    </script>
</body>
</html>`; 
export const listenFillInBlankTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Listen and Fill in the Blank Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #414141;
            height: 100%;
            position: relative;
        }
        .container {
            padding: 0;
            position: relative;
            height: 100%;
        }
        .paragraph {
            background-color: #f8f8f8;
            padding: 1.2rem;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
            line-height: 1.6;
            position: relative;
            z-index: 1;
        }
        .instructions {
            background-color: #f5f9fc;
            padding: 1rem;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            line-height: 1.5;
            border-left: 4px solid #0075b4;
            color: #333;
            font-weight: bold;
            font-style: italic;
        }
        .media-container {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .audio-container {
            flex: 1;
            padding: 0;
            margin: 0;
        }
        
        .image-container {
            flex: 1;
            text-align: center;
        }
        
        .quiz-image {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
            .media-container {
                flex-direction: column;
            }
            
            .image-container {
                margin-top: 1rem;
            }
        }
        .custom-audio-player {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            background-color: white;
            border-radius: 4px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border: 1px solid #e0e0e0;
        }
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .divider {
            height: 1px;
            background-color: #e0e0e0;
            width: 100%;
            margin: 5px 0;
        }
        .controls-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .progress-container {
            flex-grow: 1;
            height: 8px;
            background-color: #e0ffff;
            border-radius: 4px;
            position: relative;
            cursor: pointer;
            width: 100%;
            margin-right: 0;
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
            font-size: 12px;
            color: #333;
            margin-right: 8px;
            font-weight: bold;
        }
        .volume-control {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
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
        #player-status {
            font-size: 14px;
            color: #555;
        }
        .audio-player {
            display: none; /* Hide the original audio player */
        }
        input[type="text"] {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 1.2rem;
            line-height: 1.6;
            color: #414141;
            vertical-align: middle;
            border: 1px solid #d2d2d2;
            border-radius: 3px;
            margin: 0 0.25rem;
            min-width: 160px;
        }
        input[type="text"]:focus {
            border-color: #0075b4;
            outline: 0;
        }
        .buttons {
            margin: 0.5rem 0;
        }
        #feedback {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-radius: 3px;
            font-weight: bold;
        }
        .success {
            background-color: #ecf3ec;
            color: #2e7d32;
            border: 1px solid #c5e0c5;
        }
        .error {
            background-color: #f9ecec;
            color: #b40000;
            border: 1px solid #ebccd1;
        }
        .answer-feedback {
            margin-top: 0.5rem;
            font-size: 1.0rem;
        }
        .answer-feedback span {
            display: block;
            margin: 0.25rem 0;
            padding: 0.25rem;
            border-radius: 3px;
        }
        .correct {
            color: #2e7d32;
            background-color: #ecf3ec;
        }
        .incorrect {
            color: #b40000;
            background-color: #f9ecec;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            padding: 0.2rem 0.4rem;
            background-color: #ecf3ec;
            border-radius: 3px;
        }
        .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            padding: 0.2rem 0.4rem;
            background-color: #f9ecec;
            border-radius: 3px;
            margin-right: 0.3rem;
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
        select.blank-select {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 1.2rem;
            line-height: 1.6;
            color: #414141;
            vertical-align: middle;
            border: 1px solid #d2d2d2;
            border-radius: 3px;
            margin: 0 0.25rem;
            min-width: 160px;
            background-color: white;
        }
        select.blank-select:focus {
            border-color: #0075b4;
            outline: 0;
        }
        .answer-item {
            margin: 10px 0;
            padding: 5px;
            border-radius: 4px;
            background-color: #f8f8f8;
        }
        .answer-label {
            font-weight: bold;
            color: #333;
            margin-right: 10px;
        }
        .wrong-answer {
            color: #b40000;
            background-color: #f9ecec;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
            margin: 0 2px;
        }
        .correct-answer {
            color: #2e7d32;
            background-color: #ecf3ec;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
            margin: 0 2px;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions" id="quiz-instructions">
            {{INSTRUCTIONS}}
        </div>
        <div class="media-container">
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
                    <span id="current-time">0:00</span>
                    <span id="duration">0:00</span>
                    <span id="start-time">{{START_TIME}}</span>
                    <span id="end-time">{{END_TIME}}</span>
                </div>
            </div>
            {{#if IMAGE_FILE}}
            <div class="image-container">
                <img src="{{IMAGE_FILE}}" alt="Quiz illustration" class="quiz-image">
            </div>
            {{/if}}
        </div>
        <div class="paragraph">
            <form id="quizForm" onsubmit="return false;">
                {{PARAGRAPH_TEXT}}
                <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
                    <div class="answer-paragraph-inner">
                        <div class="transcript-section">
                            <div class="transcript-title">スクリプト</div>
                            <div id="transcript-paragraph" class="transcript-text">{{SCRIPT_TEXT}}</div>
                        </div>
                        <div class="your-answer-section">
                            <div class="score-display" id="score-display">Your answer: 0/4</div>
                            <div id="answer-paragraph" class="answer-paragraph"></div>
                        </div>
                    </div>
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
            </form>
        </div>
        <div id="answer-details" class="answer-feedback"></div>
    </div>

    <script>
        (function() {
            var state = {
                answer: '',
                score: 0,
                attempts: 0,
                showAnswer: false
            };

            const correctAnswers = {{CORRECT_ANSWERS}};
            const answerOptions = {{ANSWER_OPTIONS}};
            
            function calculateResults() {
                const totalQuestions = Object.keys(correctAnswers).length;
                let correctCount = 0;
                let answers = {};
                
                for (let id in correctAnswers) {
                    const select = document.getElementById(id);
                    const userAnswer = select.value.trim();
                    const correctAnswer = correctAnswers[id];
                    
                    const isCorrect = correctAnswer === userAnswer;
                    if (isCorrect) correctCount++;
                    answers[id] = userAnswer;
                }

                const rawScore = correctCount / totalQuestions;
                const message = 'Your score: ' + correctCount + ' out of ' + totalQuestions;

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
                
                // Get the original quiz paragraph
                const quizForm = document.getElementById('quizForm');
                let paragraphHtml = '';
                for (let i = 0; i < quizForm.childNodes.length; i++) {
                    const node = quizForm.childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE || 
                        (node.nodeType === Node.ELEMENT_NODE && 
                         node.className !== 'answer-paragraph-container')) {
                        if (node.tagName === 'SELECT') {
                            const id = node.id;
                            const userAnswer = result.answers[id];
                            const correctAnswer = correctAnswers[id];
                            const isCorrect = correctAnswer === userAnswer;
                            
                            if (userAnswer) {
                                if (isCorrect) {
                                    paragraphHtml += '<span class="correct-answer">' + userAnswer + '</span>';
                                } else {
                                    paragraphHtml += '<span class="wrong-answer">' + userAnswer + '</span>';
                                }
                            } else {
                                // If no answer selected, show empty space
                                paragraphHtml += '<span class="no-answer">___</span>';
                            }
                        } else {
                            paragraphHtml += node.outerHTML || node.textContent;
                        }
                    }
                }
                
                answerParagraph.innerHTML = paragraphHtml;
                
                if (state.showAnswer) {
                    answerContainer.style.display = 'block';
                } else {
                    answerContainer.style.display = 'none';
                }
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
                
                const startTime = parseFloat(startTimeElement.textContent) || 0;
                let endTime = parseFloat(endTimeElement.textContent) || 0;
                let isPlaying = false;
                
                // Update volume level display based on slider value
                function updateVolumeDisplay() {
                    const volume = volumeSlider.value;
                    volumeLevel.style.width = volume + '%';
                }
                
                // Initialize volume display
                updateVolumeDisplay();
                
                // Format time in mm:ss (still needed for internal calculations)
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
                
                // Initialize with 3-second delay
                function initializePlayer() {
                    // Set to start time
                    audioElement.currentTime = startTime;
                    
                    // Update status to show countdown
                    playerStatus.textContent = 'Current Status: Starting in 3s...';
                    
                    // Countdown timer
                    let countdown = 3;
                    const countdownInterval = setInterval(function() {
                        countdown--;
                        if (countdown > 0) {
                            playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                        } else {
                            clearInterval(countdownInterval);
                            // Auto-play when countdown reaches 0
                            audioElement.play()
                                .then(function() {
                                    isPlaying = true;
                                    playerStatus.textContent = 'Current Status: Playing';
                                });
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
                        progressBar.style.width = progressPercent + '%';
                    }
                    
                    // Check if we've reached the end time
                    if (endTime > 0 && audioElement.currentTime >= endTime) {
                        audioElement.pause();
                        audioElement.currentTime = startTime;
                        isPlaying = false;
                        playerStatus.textContent = 'Current Status: Paused';
                    }
                }
                
                // Click on progress bar to seek
                progressContainer.addEventListener('click', (e) => {
                    const clickPosition = (e.offsetX / progressContainer.offsetWidth);
                    const durationRelative = (endTime > 0 ? endTime : audioElement.duration) - startTime;
                    const seekTime = startTime + (clickPosition * durationRelative);
                    
                    // Ensure we stay within bounds
                    audioElement.currentTime = Math.min(
                        endTime > 0 ? endTime : audioElement.duration,
                        Math.max(startTime, seekTime)
                    );
                    
                    updateProgress();
                });
                
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
                    // Update status with countdown
                    playerStatus.textContent = 'Current Status: Starting in 3s...';
                    
                    // Countdown timer
                    let countdown = 3;
                    const countdownInterval = setInterval(function() {
                        countdown--;
                        if (countdown > 0) {
                            playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                        } else {
                            clearInterval(countdownInterval);
                            // Auto-play when countdown reaches 0
                            audioElement.play()
                                .then(function() {
                                    playerStatus.textContent = 'Current Status: Playing';
                                });
                        }
                    }, 1000);
                }
                
                // Expose the startWithDelay function
                return {
                    startWithDelay,
                    resetToStart: () => {
                        audioElement.currentTime = startTime;
                        audioElement.pause();
                        playerStatus.textContent = 'Current Status: Paused';
                    }
                };
            }

            // Initialize EdX integration
            var channel;
            if (window.parent !== window) {
                channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });
            }

            // Initialize audio player
            const audioPlayer = setupAudioPlayer();

            function getGrade() {
                // Toggle the answer display
                const answerContainer = document.getElementById('answer-paragraph-container');
                const showFlag = document.getElementById('showAnswerFlag');
                const audioElement = document.getElementById('audio-player');
                const startTimeElement = document.getElementById('start-time');
                
                const startTime = parseFloat(startTimeElement.textContent) || 0;
                const isVisible = answerContainer.style.display === 'block';

                if (isVisible) {
                    // Hide answers
                    answerContainer.style.display = 'none';
                    showFlag.value = 'false';
                    state.showAnswer = false;
                    
                    // Reset to start time and play with delay
                    audioElement.currentTime = startTime;
                    
                    // Start with delay
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

                // Still return grade info to EdX
                const result = calculateResults();
                return JSON.stringify({
                    edxResult: None,  // Keep it null to avoid EdX refresh
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
                    
                    // Restore selections if we have saved answers
                    if (state.answer) {
                        try {
                            const answers = JSON.parse(state.answer);
                            for (let id in answers) {
                                const element = document.getElementById(id);
                                if (element) {
                                    element.value = answers[id];
                                }
                            }

                            // Calculate results
                            const result = calculateResults();
                            
                            // Update answer paragraph content
                            updateDisplay(result);
                            
                            // Set visibility based on state
                            document.getElementById('answer-paragraph-container').style.display = 
                                state.showAnswer ? 'block' : 'none';
                            document.getElementById('showAnswerFlag').value = 
                                state.showAnswer ? 'true' : 'false';
                                
                            // Reset audio player if showing answers
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
            if (channel) {
                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
            }
        })();
    </script>
</body>
</html>`;

export const processListenFillInBlank = (paragraphText, correctAnswers) => {
    const blanks = {};
    const options = {};
    let currentId = 1;
    
    const processedParagraph = paragraphText.replace(/（ー）/g, (match) => {
        const blankId = 'blank' + currentId;
        const blankOptions = correctAnswers[currentId - 1] || [];
        const correctOption = blankOptions[0] || '';
        
        // Sort options alphabetically
        const sortedOptions = [...blankOptions].sort((a, b) => {
            // Convert to hiragana for proper Japanese sorting
            return a.localeCompare(b, 'ja');
        });
        
        const optionsHtml = sortedOptions.map(opt => 
            '<option value="' + opt + '">' + opt + '</option>'
        ).join('');
        
        const selectHtml = '<select id="' + blankId + '" class="blank-select">' +
            '<option value="">選んでください</option>' +
            optionsHtml +
            '</select>';
        
        blanks[blankId] = correctOption;
        options[blankId] = sortedOptions;
        
        currentId += 1;
        return selectHtml;
    });

    return {
        processedParagraph,
        blanks,
        options
    };
};

export const getListenFillInBlankTemplate = (paragraphText, audioFile, startTime = 0, endTime = 0, instructions = 'Listen to the audio and fill in the blanks.', correctAnswers = [], scriptText = '', imageFile = '') => {
    const { processedParagraph, blanks, options } = processListenFillInBlank(paragraphText, correctAnswers);
    
    // Process script text to color quoted text in red
    const processedScriptText = scriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    // Process image section
    const imageSection = imageFile ? imageFile.replace('{{#if IMAGE_FILE}}', '').replace('{{/if}}', '') : '';
    
    return listenFillInBlankTemplate
        .replace('{{PARAGRAPH_TEXT}}', processedParagraph)
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(blanks))
        .replace('{{ANSWER_OPTIONS}}', JSON.stringify(options))
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{START_TIME}}', startTime || 0)
        .replace('{{END_TIME}}', endTime || 0)
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{SCRIPT_TEXT}}', processedScriptText || paragraphText)
        .replace('{{#if IMAGE_FILE}}', imageFile ? '' : '<!--')
        .replace('{{/if}}', imageFile ? '' : '-->')
        .replace('{{IMAGE_FILE}}', imageFile || '');
}; 
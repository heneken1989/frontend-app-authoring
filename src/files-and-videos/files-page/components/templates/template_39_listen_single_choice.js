export const listenSingleChoiceTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Listen and Choose Quiz</title>
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
            padding: 5px;
        }
        .quiz-image {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
        }
        .question-text {
            font-size: 1.2rem;
            padding: 10px;
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
        .options-container {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 10px;
            background: transparent;
            max-width: 400px;
            max-height: 300px;
            overflow-y: auto;
        }
        .options-container::-webkit-scrollbar {
            width: 8px;
        }
        .options-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        .options-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        .options-container::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        .option-button {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            max-width: 100%;
            padding: 4px 4px 4px 28px;
            border: none;
            outline: none;
            background: transparent;
            font-size: 0.95rem;
            cursor: pointer;
            text-align: left;
            line-height: 1.4;
            min-height: 24px;
            display: flex;
            align-items: flex-start;
            position: relative;
            color: #333;
            font-weight: normal;
        }
        .option-button::before {
            content: '';
            position: absolute;
            left: 4px;
            top: 4px;
            width: 16px;
            height: 16px;
            border: 1px solid #666;
            background: white;
            border-radius: 2px;
        }
        .option-button:hover {
            background-color: #f8f9fa;
        }
        .option-button.selected::before {
            background: #0075b4;
            border-color: #0075b4;
        }
        .option-button.selected::after {
            content: '✓';
            position: absolute;
            left: 7px;
            top: 4px;
            font-size: 12px;
            color: white;
        }
        .option-button.correct::before {
            background: #2e7d32;
            border-color: #2e7d32;
        }
        .option-button.correct::after {
            content: '✓';
            position: absolute;
            left: 7px;
            top: 4px;
            font-size: 12px;
            color: white;
        }
        .option-button.incorrect::before {
            background: #b40000;
            border-color: #b40000;
        }
        .option-button.incorrect::after {
            content: '✗';
            position: absolute;
            left: 7px;
            top: 4px;
            font-size: 12px;
            color: white;
        }
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
            text-align: left;
            font-size: 14px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 5px;
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
            background-color: #ecf3ec;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
        }
        .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            background-color: #f9ecec;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
        }
        .answer-paragraph-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0;
            padding: 0;
            background-color: rgba(99, 97, 97, 0.95);
            border-top: 1px solid #e0e0e0;
            display: none;
            z-index: 2;
        }
        .answer-paragraph-inner {
            max-width: 90%;
            margin: 0 auto;
            background: #fff;
            border-radius: 4px 4px 0 0;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        .transcript-section {
            margin-bottom: 1rem;
            padding: 0.8rem;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .transcript-title {
            font-weight: bold;
            margin-bottom: 0.8rem;
            color: #333;
            font-size: 1.1rem;
            text-align: center;
        }
        .transcript-text {
            line-height: 1.6;
            margin: 0;
            white-space: pre-wrap;
        }
        .score-display {
            font-weight: bold;
            margin-bottom: 0.8rem;
            color: #333;
        }
        .answer-paragraph {
            margin: 0;
            padding: 0.8rem;
            background-color: #ffffff;
            line-height: 1.6;
            border-radius: 3px;
            font-size: 1rem;
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
        .select-answer-header {
            font-size: 1rem;
            color: #333;
            margin: 0;
            padding: 5px 0;
            font-weight: bold;
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
            border-bottom: 1px solid #e0e0e0;
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
                padding: 5px;
            }
            .quiz-image {
                max-height: 200px;
            }
            .options-container {
                width: 100%;
            }
            .option-button {
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
                            <span id="current-time">0:00</span>
                            <span id="duration">0:00</span>
                            <span id="start-time">{{START_TIME}}</span>
                            <span id="end-time">{{END_TIME}}</span>
                        </div>
                    </div>
                    <div class="options-container" id="options-container">
                        <div class="select-answer-header">回答を選択してください</div>
                        {{OPTIONS}}
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

            const correctAnswer = '{{CORRECT_ANSWER}}';
            let selectedOption = null;
            
            function calculateResults() {
                const isCorrect = selectedOption === correctAnswer;
                const answers = { answer: selectedOption || '' };
                
                const rawScore = isCorrect ? 1 : 0;
                const message = selectedOption ? (isCorrect ? '正解です！' : '不正解です。') : '選択してください。';

                state.answer = JSON.stringify(answers);
                state.score = rawScore;
                state.attempts += 1;

                return {
                    rawScore,
                    message,
                    answers,
                    isCorrect
                };
            }

            function updateDisplay(result) {
                const answerParagraph = document.getElementById('answer-paragraph');
                const answerContainer = document.getElementById('answer-paragraph-container');
                const scoreDisplay = document.getElementById('score-display');
                const options = document.querySelectorAll('.option-button');
                
                scoreDisplay.textContent = result.message;
                
                // Update option buttons
                options.forEach(button => {
                    const isSelected = button.dataset.value === selectedOption;
                    const isCorrect = button.dataset.value === correctAnswer;
                    
                    button.classList.remove('selected', 'correct', 'incorrect');
                    
                    if (state.showAnswer) {
                        if (isSelected && !isCorrect) {
                            button.classList.add('incorrect');
                        }
                        if (isCorrect) {
                            button.classList.add('correct');
                        }
                        button.disabled = true;
                    } else {
                        if (isSelected) {
                            button.classList.add('selected');
                        }
                        button.disabled = false;
                    }
                });
                
                // Update answer paragraph
                let answerHtml = '';
                if (selectedOption) {
                    if (result.isCorrect) {
                        answerHtml = '<span class="correct-answer">' + selectedOption + '</span>';
                    } else {
                        answerHtml = '<span class="wrong-answer">' + selectedOption + '</span> ' +
                                   '<span class="correct-answer">' + correctAnswer + '</span>';
                    }
                } else {
                    answerHtml = '<span class="no-answer">選択してください</span>';
                }
                
                answerParagraph.innerHTML = answerHtml;
                
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
                const endTime = parseFloat(endTimeElement.textContent) || 0;
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
                    if (isFirstLoad) {
                        startWithDelay();
                        isFirstLoad = false;
                    }
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
                
                // Add event listener for visibility change
                document.addEventListener('visibilitychange', () => {
                    // Don't do anything when switching tabs
                    // This allows audio to continue playing in background
                });

                // Add event listener for window focus
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

                // Return functions for external use
                return {
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

            function getGrade() {
                console.log('🎯 getGrade() called - Processing quiz submission');
                
                const answerContainer = document.getElementById('answer-paragraph-container');
                const showFlag = document.getElementById('showAnswerFlag');
                const audioElement = document.getElementById('audio-player');
                const startTimeElement = document.getElementById('start-time');
                
                const startTime = parseFloat(startTimeElement.textContent) || 0;
                const isVisible = answerContainer.style.display === 'block';

                if (isVisible) {
                    // Hide answers and reset audio
                    answerContainer.style.display = 'none';
                    showFlag.value = 'false';
                    state.showAnswer = false;
                    
                    // Reset to start time and play with delay
                    audioElement.currentTime = startTime;
                    audioPlayer.startWithDelay();
                    console.log('📱 Hiding answer container, resetting audio');
                } else {
                    // First submit - just show answers and pause audio
                    const result = calculateResults();
                    updateDisplay(result);
                    answerContainer.style.display = 'block';
                    showFlag.value = 'true';
                    state.showAnswer = true;
                    
                    // Just pause the audio without resetting
                    audioElement.pause();
                    console.log('📱 Showing answer container, pausing audio');
                }

                const result = calculateResults();
                console.log('📊 Quiz results:', result);
                
                // ✅ CALL COMPLETION API (NON-BLOCKING)
                setTimeout(() => {
                    updateCompletionStatus(result);
                }, 100);
                
                // ✅ RETURN DATA TO EDX (PREVENT RELOAD)
                const returnValue = {
                    edxResult: None,
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
                            selectedOption = answers.answer || '';
                            
                            if (selectedOption) {
                                const button = document.querySelector('.option-button[data-value="' + selectedOption + '"]');
                                if (button) {
                                    button.classList.add('selected');
                                }
                            }

                            const result = calculateResults();
                            updateDisplay(result);
                            
                            document.getElementById('answer-paragraph-container').style.display = 
                                state.showAnswer ? 'block' : 'none';
                            document.getElementById('showAnswerFlag').value = 
                                state.showAnswer ? 'true' : 'false';
                                
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

            // Set up option button click handlers
            document.querySelectorAll('.option-button').forEach(button => {
                button.addEventListener('click', function() {
                    if (state.showAnswer) return;
                    
                    document.querySelectorAll('.option-button').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    
                    this.classList.add('selected');
                    selectedOption = this.dataset.value;
                });
            });

            // Set up EdX bindings
            if (channel) {
                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
            }
            
            // Listen for problem.submit messages with action 'save'
            window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'problem.submit' && event.data.action === 'save') {
                    // Save current state when navigating away
                    const result = calculateResults();
                    console.log('Saving state before navigation:', result);
                }
            });
        })();
    </script>
</body>
</html>`;

export const getListenSingleChoiceTemplate = (questionText, optionsString, audioFile, startTime = 0, endTime = 0, instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', imageFile = '') => {
    // Split the options string and trim each option
    const options = optionsString.split(',').map(opt => opt.trim());
    
    // First option is correct, sort others alphabetically
    const correctAnswer = options[0];
    const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'ja'));
    
    // Generate options HTML - directly use the options without adding empty choice
    const optionsHtml = sortedOptions.map(option => 
        '<button type="button" class="option-button" data-value="' + option + '">' + option + '</button>'
    ).join('');
    
    // Process script text to highlight quoted text in red
    const processedScriptText = scriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    // Add time display to the audio player
    const timeDisplay = `
        <div class="time-display" style="text-align: center; margin-top: 5px; font-size: 12px; color: #666;">
            再生区間: ${formatTime(startTime)} - ${formatTime(endTime)}
        </div>
    `;
    
    // Helper function to format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return minutes + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    return listenSingleChoiceTemplate
        .replace('{{QUESTION_TEXT}}', questionText)
        .replace('{{OPTIONS}}', optionsHtml)
        .replace('{{CORRECT_ANSWER}}', correctAnswer)
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{START_TIME}}', startTime || 0)
        .replace('{{END_TIME}}', endTime || 0)
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '')
        .replace('{{#if IMAGE_FILE}}', imageFile ? '' : '<!--')
        .replace('{{/if}}', imageFile ? '' : '-->')
        .replace('{{IMAGE_FILE}}', imageFile || '');
}; 
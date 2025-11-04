// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    return text.replace(/([一-龯]+)\(([^)]+)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
}

export const listenSingleChoiceTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Listen and Choose Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
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
            gap: 20px;
            padding: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .main-content {
            display: flex;
            gap: 30px;
            align-items: flex-start;
        }
        .left-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .right-column {
            flex: 0 0 40%;
            display: flex;
            flex-direction: column;
            gap: 20px;
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
        .image-container {
            margin: 20px 0;
            text-align: center;
        }
        .question-image {
            max-width: 100%;
            max-height: 300px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            object-fit: contain;
            /* Image loading optimizations */
            loading: eager;
            decoding: async;
            fetchpriority: high;
            /* Smooth loading transition */
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .question-image.loaded {
            opacity: 1;
        }
        .image-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            color: #666;
            font-size: 1rem;
        }
        .audio-container {
            margin-bottom: 10px;
            width: 100%;
        }
        .custom-audio-player {
            width: 100%;
            max-width: 100%;
            margin: 0;
            background-color: white;
            border-radius: 4px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border: 1px solid #e0e0e0;
            transform: scale(0.7);
            transform-origin: top left;
        }
        .options-container {
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            background: transparent;
            width: 100%;
        }
        .option-button {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            max-width: 100%;
            padding: 12px 16px;
            border: none;
            outline: none;
            background: transparent;
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            cursor: pointer;
            text-align: left;
            line-height: 1.4;
            min-height: 20px;
            display: flex;
            align-items: baseline;
            justify-content: flex-start;
            position: relative;
            color: #333;
            font-weight: normal;
            border-radius: 4px;
            transition: all 0.3s ease;
            gap: 12px;
            word-wrap: break-word;
            word-break: keep-all;
        }
        .option-button::before {
            content: '';
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 3px;
            background: white;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }
        .option-button:hover:not(.selected):not(.correct):not(.incorrect) {
            background-color: #f8f9fa;
        }
        .option-button:hover:not(.selected):not(.correct):not(.incorrect)::before {
            border-color: #999;
        }
        .option-button.selected {
            background: transparent;
            border: none;
            color: #333;
        }
        .option-button.selected::before {
            background: #333;
            border-color: #333;
            content: '✓';
            color: white;
            display: flex;
            align-items: baseline;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .option-button.correct {
            background: transparent;
            border: none;
            color: #333;
        }
        .option-button.correct::before {
            background: #4caf50;
            border-color: #4caf50;
            content: '✓';
            color: white;
            display: flex;
            align-items: baseline;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .option-button.incorrect {
            background: transparent;
            border: none;
            color: #333;
        }
        .option-button.incorrect::before {
            background: #f44336;
            border-color: #f44336;
            content: '✓';
            color: white;
            display: flex;
            align-items: baseline;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .correct {
            color: #2e7d32;
        }
        .incorrect {
            color: #b40000;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
        }
        .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            border-radius: 3px;
            display: inline-block;
            margin: 0;
        }
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            text-align: left;
            font-size: 14px;
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
            font-size: 12px;
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
            color: #2e7d32;
        }
        .error {
            color: #b40000;
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
        
        /* Furigana styling */
        ruby {
            font-size: 1.2rem;
        }
        
        rt {
            font-size: 0.6em;
            color: #666;
        }
        @media (max-width: 1024px) {
            .options-container {
                max-width: 500px;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
                gap: 10px;
            }
            .content-wrapper {
                gap: 8px;
            }
            .main-content {
                flex-direction: column;
                gap: 20px;
            }
            .left-column, .right-column {
                width: 100%;
            }
            .options-container {
                width: 100%;
                max-width: 100%;
            }
            .option-button {
                width: 100%;
                padding: 12px 16px;
            }
            .question-image {
                max-height: 250px;
            }
        }
        
        @media (max-width: 480px) {
            .options-container {
                gap: 6px;
            }
            .option-button {
                padding: 10px 12px;
                font-size: 1.2rem;
            }
            .question-image {
                max-height: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-content">
            <div class="left-column">
                <div class="content-wrapper">
                    <div class="instructions" id="quiz-instructions">
                        {{INSTRUCTIONS}}
                    </div>
                    <div class="question-text">{{QUESTION_TEXT}}</div>
                    
                    {{IMAGE_HTML}}
                </div>
            </div>
            
            <div class="right-column">
                <form id="quizForm" onsubmit="return false;">
                    <div class="audio-container">
                        <audio id="audio-player" class="audio-player">
                            <source src="{{AUDIO_FILE}}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                        <div class="custom-audio-player">
                            <div id="player-status" class="player-status">Current Status: Starting in 5s...</div>
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
                        {{OPTIONS}}
                    </div>
                    <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
                    <!-- Hidden script text for popup display -->
                    <span id="script-text-hidden" style="display: none;">{{SCRIPT_TEXT}}</span>
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

            // Helper function to encode script text
            function encodeScriptText(text) {
                if (!text) return '';
                return btoa(unescape(encodeURIComponent(text)));
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
                const options = document.querySelectorAll('.option-button');
                
                // Update option buttons with correct/incorrect colors
                options.forEach(button => {
                    const isSelected = button.dataset.value === selectedOption;
                    const isCorrect = button.dataset.value === correctAnswer;
                    
                    button.classList.remove('selected', 'correct', 'incorrect');
                    
                    if (state.showAnswer) {
                        // When showing answer, show correct/incorrect colors
                        if (isCorrect) {
                            button.classList.add('correct');
                        } else if (isSelected) {
                            button.classList.add('incorrect');
                        }
                        button.disabled = true;
                    } else {
                        if (isSelected) {
                            button.classList.add('selected');
                        }
                        button.disabled = false;
                    }
                });
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
                
                
                const timeSegments = parseTimeSegments(startTimeElement.textContent || '');
                let currentSegmentIndex = 0;
                let isPlaying = false;
                let totalDuration = 0;
                let isTransitioning = false; // Flag to prevent multiple transitions
                let countdownInterval = null; // Store countdown interval reference
                
                // Calculate total duration of all segments
                if (timeSegments.length > 0) {
                    totalDuration = timeSegments.reduce((total, segment) => total + (segment.end - segment.start), 0);
                } else {
                    // Fallback to single time range from endTimeElement
                    const startTime = parseFloat(startTimeElement.textContent) || 0;
                    const endTime = parseFloat(endTimeElement.textContent) || 0;
                    if (endTime > startTime) {
                        timeSegments.push({ start: startTime, end: endTime });
                        totalDuration = endTime - startTime;
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
                
            // Initialize with 5-second delay (like template 63)
            function initializePlayer() {
                if (timeSegments.length === 0) {
                    playerStatus.textContent = 'Current Status: No audio segments';
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
                playerStatus.textContent = 'Current Status: Starting in 5s...';
                
                // Countdown timer
                let countdown = 5;
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
                    
                    // Ensure audio is paused before initializing (like template 63)
                    audioElement.pause();
                    playerStatus.textContent = 'Current Status: Ready';
                    
                    // Initialize player with delay
                    initializePlayer();
                });
                
            // Handle play event (like template 63)
            audioElement.addEventListener('play', () => {
                console.log('🔊 Audio play event fired');
                isPlaying = true;
                playerStatus.textContent = 'Current Status: Playing';
            });
            
            // Handle pause event (like template 63)
            audioElement.addEventListener('pause', () => {
                console.log('🔊 Audio pause event fired');
                isPlaying = false;
                playerStatus.textContent = 'Current Status: Paused';
            });
            
            // Prevent auto-play on page load (like template 63)
            audioElement.addEventListener('loadstart', () => {
                console.log('🔊 Audio loadstart - ensuring paused state');
                audioElement.pause();
                playerStatus.textContent = 'Current Status: Loading...';
            });
                
            // Set initial volume
            audioElement.volume = volumeSlider.value / 100;
            updateVolumeDisplay();
            
            // Ensure audio is paused on load (like template 63)
            audioElement.pause();
            playerStatus.textContent = 'Current Status: Starting in 5s...';
                
                // Function to update player status with countdown
                function startWithDelay() {
                    if (timeSegments.length === 0) {
                        playerStatus.textContent = 'Current Status: No audio segments';
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
                    playerStatus.textContent = 'Current Status: Starting in 5s...';
                    
                    // Countdown timer
                    let countdown = 5;
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
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                    if (audioElement) {
                        audioElement.pause();
                    }
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

            // Function to save quiz results (like template 67)
            function saveQuizResults() {
                const userAnswer = selectedOption || '';
                const isCorrect = userAnswer === correctAnswer;
                const answers = [{
                    userAnswer: userAnswer,
                    isCorrect: isCorrect
                }];
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'quiz.answers',
                        answers: answers
                    }, '*');
                }
            }

            // Listen for messages from parent (Check button)
            window.addEventListener('message', function(event) {
                console.log('🔄 Received message:', event.data);
                
                if (event.data && event.data.type === 'problem.check') {
                    console.log('🔄 Processing problem.check - resetting quiz');
                    // Reset quiz state
                    resetQuiz();
                }
                
                if (event.data && event.data.type === 'problem.submit') {
                    console.log('🔄 Processing problem.submit - action:', event.data.action);
                    
                    if (event.data.action === 'check') {
                        console.log('🔄 Processing problem.submit with action=check - showing answers');
                        // Pause audio when checking answers
                        const audioElement = document.getElementById('audio-player');
                        if (audioElement) {
                            audioElement.pause();
                        }
                        // Trigger quiz submission when Check button is clicked
                        getGrade();
                    } else if (event.data.action === 'reset') {
                        console.log('🔄 Processing problem.submit with action=reset - resetting quiz');
                        // Reset quiz when reset action is received
                        resetQuiz();
                    }
                }
                
                // Handle get answers request (like template 67)
                if (event.data && event.data.type === 'quiz.get_answers') {
                    saveQuizResults(); // This will collect and send answers
                } else if (event.data && event.data.type === 'ping') {
                    // Respond with pong
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'pong',
                            data: { message: 'Template 39 is ready!', timestamp: new Date().toISOString() }
                        }, '*');
                    }
                }
            });

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
            
            // Auto-start countdown when page loads (like template 63)
            setTimeout(() => {
                if (audioPlayer && audioPlayer.startWithDelay) {
                    audioPlayer.startWithDelay();
                }
            }, 500); // Delay to ensure audio metadata is loaded

            function getGrade() {
                // Always show answer when submitted
                state.showAnswer = true;
                
                // Capture selected option
                const selectedButton = document.querySelector('.option-button.selected');
                if (selectedButton) {
                    selectedOption = selectedButton.dataset.value;
                }
                
                // Update display with answer
                const result = calculateResults();
                updateDisplay(result);
                
                // Pause audio when checking answers
                const audioElement = document.getElementById('audio-player');
                if (audioElement) {
                    audioElement.pause();
                }
                
                // Pause countdown if active
                if (audioPlayer && audioPlayer.pauseCountdown) {
                    audioPlayer.pauseCountdown();
                }
                
                // Send script text to parent for popup display - use innerHTML to preserve <ruby> tags
                const scriptTextElement = document.getElementById('script-text-hidden');
                const scriptText = scriptTextElement ? scriptTextElement.innerHTML : '';
                const quizData = { templateId: 39, scriptText: scriptText };
                
                // Store in localStorage for persistence
                localStorage.setItem('quizGradeSubmitted', JSON.stringify(quizData));
                localStorage.setItem('quizGradeSubmittedTimestamp', Date.now().toString());
                
                // Send to parent
                if (window.parent) {
                    window.parent.postMessage({ type: 'quiz.data.ready', quizData: quizData }, '*');
                }
                
                // Call completion API (non-blocking)
                setTimeout(() => {
                    updateCompletionStatus(result);
                }, 100);
                
                // Return data to EdX (prevent reload)
                const returnValue = {
                    edxResult: None,
                    edxScore: result.rawScore,
                    edxMessage: result.message
                };
                
                return JSON.stringify(returnValue);
            }
            
            function resetQuiz() {
                // Reset all option buttons
                const options = document.querySelectorAll('.option-button');
                options.forEach(button => {
                    button.classList.remove('selected', 'correct', 'incorrect');
                    button.disabled = false;
                });
                
                // Clear selected option
                selectedOption = null;
                
                // Reset state completely
                state.answer = '';
                state.score = 0;
                state.showAnswer = false;
                
                // Reset show flag
                const showFlag = document.getElementById('showAnswerFlag');
                if (showFlag) {
                    showFlag.value = 'false';
                }
                
                // Reset audio player and start with delay (like initial load)
                if (audioPlayer) {
                    audioPlayer.startWithDelay();
                }
            }
            
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
                })
                .catch(error => {
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
                            
                            if (state.showAnswer) {
                                // Pause countdown when showing answer
                                if (audioPlayer && audioPlayer.pauseCountdown) {
                                    audioPlayer.pauseCountdown();
                                } else {
                                    audioPlayer.resetToStart();
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

            // Send quiz.meta message to parent on load
            if (window.parent) {
                window.parent.postMessage({ 
                    type: 'quiz.meta', 
                    hasAudio: true, 
                    templateId: 39 
                }, '*');
            }
            
            // Preload image for faster loading
            const imageElement = document.querySelector('.question-image');
            if (imageElement) {
                const imageUrl = imageElement.src;
                if (imageUrl) {
                    // Create a new Image object to preload
                    const preloadImage = new Image();
                    preloadImage.onload = function() {
                        console.log('🖼️ Image preloaded successfully');
                        // Image is ready, show it
                        imageElement.classList.add('loaded');
                        const loadingElement = document.getElementById('image-loading');
                        if (loadingElement) {
                            loadingElement.style.display = 'none';
                        }
                    };
                    preloadImage.onerror = function() {
                        console.error('🖼️ Failed to preload image');
                        const loadingElement = document.getElementById('image-loading');
                        if (loadingElement) {
                            loadingElement.textContent = 'Failed to load image';
                        }
                    };
                    preloadImage.src = imageUrl;
                }
            }
            
            // Listen for problem.submit messages with action 'save'
            window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'problem.submit' && event.data.action === 'save') {
                    // Save current state when navigating away
                    const result = calculateResults();
                }
            });
        })();
    </script>
</body>
</html>`;

export const getListenSingleChoiceTemplate = (questionText, optionsString, audioFile, timeSegments = '0-0', instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', imageFile = '') => {
    console.log('🔍 Template 39 Debug:', {
        questionText,
        optionsString,
        audioFile,
        timeSegments,
        instructions,
        scriptText,
        imageFile
    });
    
    // Split the options string and trim each option
    const options = optionsString.split(',').map(opt => opt.trim());
    console.log('🔍 Parsed options:', options);
    
    // First option is correct, sort others alphabetically
    const correctAnswer = options[0];
    const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'ja'));
    console.log('🔍 Sorted options:', sortedOptions);
    
    // Generate options HTML - directly use the options without adding empty choice
    const optionsHtml = sortedOptions.map(option => 
        '<button type="button" class="option-button" data-value="' + option + '">' + convertFurigana(option) + '</button>'
    ).join('');
    console.log('🔍 Generated options HTML:', optionsHtml);
    
    // Process script text to highlight quoted text in red and convert furigana (like template 63)
    console.log('🔍 Original scriptText:', scriptText);
    
    // First, handle newlines and normalize the text
    const normalizedScriptText = scriptText
        .replace(/\n/g, '<br>')  // Convert newlines to HTML breaks
        .replace(/\r/g, '');     // Remove carriage returns
    
    console.log('🔍 Normalized scriptText:', normalizedScriptText);
    
    // Then process quotes for highlighting
    const processedScriptText = normalizedScriptText
        .replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>')
        .replace(/([一-龯]+)\(([^)]+)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
    
    console.log('🔍 Processed scriptText:', processedScriptText);
    
    // Handle image display with preloading
    const imageHtml = imageFile ? 
        `<div class="image-container">
            <div class="image-loading" id="image-loading">Loading image...</div>
            <img src="${imageFile}" alt="Question Image" class="question-image" 
                 loading="eager" decoding="async" fetchpriority="high"
                 onload="this.classList.add('loaded'); document.getElementById('image-loading').style.display='none';"
                 onerror="document.getElementById('image-loading').textContent='Failed to load image';">
        </div>` : '';

    return listenSingleChoiceTemplate
        .replace('{{QUESTION_TEXT}}', convertFurigana(questionText))
        .replace('{{OPTIONS}}', optionsHtml)
        .replace('{{CORRECT_ANSWER}}', correctAnswer)
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{START_TIME}}', timeSegments || '0-0')
        .replace('{{END_TIME}}', '') // Not used anymore
        .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '')
        .replace('{{IMAGE_HTML}}', imageHtml);
}; 
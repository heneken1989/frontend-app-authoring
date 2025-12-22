// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    // First convert Japanese parentheses: 毎日（まいにち） -> <ruby>毎日<rt>まいにち</rt></ruby>
    text = text.replace(/([一-龯ひらがなカタカナ0-9]+)（([^）]+)）/g, function(match, p1, p2) {
        return '<ruby>' + p1 + '<rt>' + p2 + '</rt></ruby>';
    });
    // Then convert regular parentheses: 車(くるま) -> <ruby>車<rt>くるま</rt></ruby>
    text = text.replace(/([一-龯]+)\(([^)]+)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
    return text;
}

export const listenSingleChoiceNoImageTemplate = `<!DOCTYPE html>
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
            overflow-x: hidden;
            box-sizing: border-box;
        }
        .container {
            position: relative;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: calc(100% - 100px);
            max-width: 100%;
            margin: 0 0 0 100px;
            box-sizing: border-box;
            overflow-x: hidden;
        }
        .top-section {
            display: flex;
            flex-direction: row;
            gap: 30px;
            align-items: flex-start;
            flex-wrap: nowrap;
        }
        .left-content {
            flex: 0 0 65%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 65%;
        }
        .right-content {
            flex: 0 0 300px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 300px;
            flex-shrink: 0;
        }
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
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
            max-width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            overflow-x: hidden;
            box-sizing: border-box;
        }
        .instructions:before {
            display: none;
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
            .options-container {
                width: 100%;
                max-width: 100%;
            }
            .option-button {
                width: 100%;
                padding: 12px 16px;
            }
            .custom-audio-player {
                max-width: 100%;
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
                        <span id="current-time">0:00</span>
                        <span id="duration">0:00</span>
                        <span id="start-time">{{START_TIME}}</span>
                        <span id="end-time">{{END_TIME}}</span>
                        <span id="script-text-hidden">{{SCRIPT_TEXT}}</span>
                    </div>
                </div>
            </div>
        </div>
        <form id="quizForm" onsubmit="return false;">
            <div class="options-container" id="options-container">
                {{OPTIONS}}
            </div>
            <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
        </form>
    </div>

    <script>
        // Function to encode script text for safe transmission (like template 63)
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
                        // If no audio segments, send timer.start message immediately so timer can start
                        try {
                            if (window.parent) {
                                window.parent.postMessage({
                                    type: 'timer.start',
                                    templateId: 40,
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
                                
                                // Send timer.start message to parent after audio completed (template 40)
                                try {
                                    if (window.parent) {
                                        window.parent.postMessage({
                                            type: 'timer.start',
                                            templateId: 40,
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
                    
                    // Ensure audio is paused before initializing (like template 63)
                    audioElement.pause();
                    playerStatus.textContent = 'Current Status: Starting in 5s...';
                    
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
                        // If no audio segments, send timer.start message immediately so timer can start
                        try {
                            if (window.parent) {
                                window.parent.postMessage({
                                    type: 'timer.start',
                                    templateId: 40,
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
                            data: { message: 'Template 40 is ready!', timestamp: new Date().toISOString() }
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
            
            // Send quiz meta to parent (like template 63)
            if (window.parent) {
                window.parent.postMessage({ 
                    type: 'quiz.meta', 
                    hasAudio: true, 
                    templateId: 40 
                }, '*');
            }

            function getGrade() {
                // Always show answer when submitted
                state.showAnswer = true;
                
                // Capture selected option
                const selectedButton = document.querySelector('.option-button.selected');
                if (selectedButton) {
                    selectedOption = selectedButton.dataset.value;
                }
                
                // Pause audio when showing answers
                const audioElement = document.getElementById('audio-player');
                audioElement.pause();
                
                // Also pause countdown if it's running
                if (audioPlayer && audioPlayer.pauseCountdown) {
                    audioPlayer.pauseCountdown();
                }
                
                // Update display with answer
                const result = calculateResults();
                updateDisplay(result);
                
                // Send script text to parent for popup display (like template 63)
                try {
                    // Get script text from the template - use innerHTML to preserve <ruby> tags
                    const scriptTextElement = document.getElementById('script-text-hidden');
                    const scriptText = scriptTextElement ? scriptTextElement.innerHTML : '';
                    
                    console.log('🔍 DOM - Script text from hidden element:', scriptText);
                    console.log('🔍 DOM - Script text contains <ruby>:', scriptText.includes('<ruby>'));
                    console.log('🔍 DOM - Script text contains ():', scriptText.includes('('));
                    console.log('🔍 DOM - Script text contains （）:', scriptText.includes('（'));
                    console.log('🔍 DOM - Script text length:', scriptText.length);
                    
                    // Check if the hidden element contains the original text
                    const hiddenElement = document.getElementById('script-text-hidden');
                    if (hiddenElement) {
                        console.log('🔍 DOM - Hidden element innerHTML:', hiddenElement.innerHTML);
                        console.log('🔍 DOM - Hidden element textContent:', hiddenElement.textContent);
                    }
                    
                    // Encode script text to handle special characters (like template 63)
                    const encodedScriptText = encodeScriptText(scriptText);
                    
                    console.log('🔍 Encoded script text:', encodedScriptText);
                    
                    const quizData = {
                        templateId: 40,
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
                            
                            document.getElementById('answer-paragraph-container').style.display = 
                                state.showAnswer ? 'block' : 'none';
                            document.getElementById('showAnswerFlag').value = 
                                state.showAnswer ? 'true' : 'false';
                                
                            if (state.showAnswer) {
                                // Pause audio and countdown when showing answers
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
                }
            });
        })();
    </script>
</body>
</html>`;

export const getListenSingleChoiceNoImageTemplate = (questionText, optionsString, audioFile, timeSegments = '0-0', instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '') => {
    // Split the options string and trim each option
    const options = optionsString.split(',').map(opt => opt.trim());
    
    // First option is correct, sort others alphabetically
    const correctAnswer = options[0];
    const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'ja'));
    
    // Generate options HTML - directly use the options without adding empty choice
    const optionsHtml = sortedOptions.map(option => 
        '<button type="button" class="option-button" data-value="' + option + '">' + convertFurigana(option) + '</button>'
    ).join('');
    
    // Process script text to highlight quoted text in red and convert furigana
    console.log('🔍 STEP 1 - Original scriptText from CreateQuizButton:', scriptText);
    console.log('🔍 STEP 1 - ScriptText contains ():', scriptText.includes('('));
    console.log('🔍 STEP 1 - ScriptText contains （）:', scriptText.includes('（'));
    console.log('🔍 STEP 1 - ScriptText contains <ruby>:', scriptText.includes('<ruby>'));
    console.log('🔍 STEP 1 - ScriptText length:', scriptText.length);
    
    // Test with sample furigana text to verify conversion works
    const testFuriganaText = '皆(みな)さん、クイズをしましょう';
    console.log('🔍 Test furigana conversion:', convertFurigana(testFuriganaText));
    
    // Step 2: Handle newlines and normalize the text (like template 63)
    const normalizedScriptText = scriptText
        .replace(/\n/g, '<br>')  // Convert newlines to HTML breaks
        .replace(/\r/g, '');     // Remove carriage returns
    console.log('🔍 STEP 2 - Normalized scriptText:', normalizedScriptText);
    
    // Step 3: Highlight quoted text
    const highlightedScriptText = normalizedScriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    console.log('🔍 STEP 3 - After highlighting quoted text:', highlightedScriptText);
    console.log('🔍 STEP 3 - Contains ():', highlightedScriptText.includes('('));
    console.log('🔍 STEP 3 - Contains （）:', highlightedScriptText.includes('（'));
    
    // Step 4: Convert furigana
    const processedScriptText = convertFurigana(highlightedScriptText);
    console.log('🔍 STEP 4 - After furigana conversion:', processedScriptText);
    console.log('🔍 STEP 4 - Contains <ruby>:', processedScriptText.includes('<ruby>'));
    console.log('🔍 STEP 4 - Contains ():', processedScriptText.includes('('));
    console.log('🔍 STEP 4 - Contains （）:', processedScriptText.includes('（'));
    
    // Helper function to format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return minutes + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    
    
    return listenSingleChoiceNoImageTemplate
        .replace('{{QUESTION_TEXT}}', convertFurigana(questionText))
        .replace('{{OPTIONS}}', optionsHtml)
        .replace('{{CORRECT_ANSWER}}', correctAnswer)
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{START_TIME}}', timeSegments || '0-0')
        .replace('{{END_TIME}}', '') // Not used anymore
        .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '');
}; 
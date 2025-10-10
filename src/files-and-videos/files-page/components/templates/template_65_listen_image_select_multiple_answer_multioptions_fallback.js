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

export const getListenImageSelectMultipleAnswerMultiOptionsTemplate = (questionText, optionsForBlanks, audioFile, startTime = 0, endTime = 0, instructions = '音声を聞いて、正しい答えを選んでください。', scriptText = '', imageFile = '', answerContent = '') => {
    // Parse the options for each blank: semicolon-separated, each blank's options are comma-separated
    // Example: "a.韓国(かんこく),b.中国(ちゅうごく);a.コンピューター,b.自動車(じどうしゃ)"
    let blanksOptionsArray = [];
    if (optionsForBlanks && optionsForBlanks.trim()) {
        blanksOptionsArray = optionsForBlanks.split(';').map(opt =>
            opt.split(',').map(o => o.trim()).filter(Boolean)
        );
    }

    // Process answer content to replace placeholders with dropdowns
    let answersList = '';
    let answerDropdownIndex = 0;
    
    if (answerContent && answerContent.trim()) {
        const answerLines = answerContent.split('\n').map(line => line.trim()).filter(line => line);
        const processedAnswerLines = answerLines.map((line, lineIndex) => {
            let processedLine = line;
            
            // Process all placeholders in this line
            processedLine = processedLine.replace(/（ー）/g, () => {
                // Get options for this blank
                const options = blanksOptionsArray[answerDropdownIndex] || [];
                const correctAnswer = options[0] || '';
                
                // Sort options alphabetically while keeping the correct answer reference
                const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'ja'));
                
                const optionsHtml = sortedOptions.map(option => `<option value="${option}">${option}</option>`).join('');
                const dropdown = `<select class="answer-select" data-blank-number="${answerDropdownIndex + 1}" data-correct="${correctAnswer}" style="width: auto; min-width: 60px;">
                        <option value="" selected>Select</option>
                        ${optionsHtml}
                    </select>`;
                answerDropdownIndex++;
                return dropdown;
            });
            
            return processedLine;
        });
        answersList = processedAnswerLines.map(line => `<div class="answer-item">${line}</div>`).join('\n');
    }

    // Process script text to highlight quoted text in red and convert furigana (like template 63)
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
    
    // Build correct answers array for grading
    const correctAnswersArray = blanksOptionsArray.map(opts => opts[0] || '');

    let template = listenImageSelectMultipleAnswerMultiOptionsTemplate
        .replace(/{{ANSWERS_LIST}}/g, answersList)
        .replace('{{AUDIO_FILE}}', audioFile || '')
        .replace('{{START_TIME}}', startTime || 0)
        .replace('{{END_TIME}}', endTime || 0)
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{SCRIPT_TEXT}}', finalScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    return template;
};

export const listenImageSelectMultipleAnswerMultiOptionsTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Listen and Select Multiple Answer Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body { font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 1.2rem; font-weight: 400; line-height: 1.6; text-align: left; margin: 0; padding: 0; color: #414141; height: auto; position: relative; overflow-y: auto; background-color: white; max-height: 700px; }
        .container { position: relative; height: auto; display: flex; flex-direction: column; gap: 20px; background-color: white; max-height: 700px; overflow-y: auto; padding: 20px; }
        .content-wrapper { background: white; padding: 0; display: flex; flex-direction: column; gap: 20px; }
        .instructions { font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; font-size: 1.2rem; font-weight: bold; line-height: 1.5; text-align: left; background-color: white; color: #333; font-style: italic; margin: 0 0 20px 0; letter-spacing: 0.3px; }
        .instructions:before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background-color: #0075b4; }
        .audio-container { flex: 1; padding: 0; margin: 0; background-color: white; }
        .custom-audio-player { width: 100%; max-width: 500px; margin: 0 auto; background-color: white; border-radius: 4px; padding: 15px; display: flex; flex-direction: column; gap: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); border: 1px solid #e0e0e0; }
        .select-container { margin: 0; display: flex; flex-direction: column; gap: 8px; padding: 0; background: white; }
        .select-answer-header { font-size: 1rem; color: #333; margin: 0; font-weight: bold; }
        .answer-select { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 0.9rem; font-weight: 400; line-height: 1.3; text-align: left; width: auto; min-width: 60px; border: 1px solid #666; border-radius: 4px; background-color: white; color: #333; cursor: pointer; display: inline-block; padding: 2px 4px; }
        .answer-select:focus { outline: none; border-color: #0075b4; }
        .answer-select option { padding: 4px; font-size: 0.85rem; }
        .answer-select.correct { border-color: #2e7d32; background-color: #ecf3ec; }
        .answer-select.incorrect { border-color: #b40000; background-color: #f9ecec; }
        .correct-answer { color: #2e7d32; font-weight: bold; padding: 2px 8px; border-radius: 3px; background-color: #ecf3ec; }
        .wrong-answer { color: #b40000; font-weight: bold; text-decoration: line-through; padding: 2px 8px; border-radius: 3px; background-color: #f9ecec; }
        .player-status { font-weight: bold; color: #333; margin-bottom: 5px; text-align: left; font-size: 14px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; }
        .controls-row { display: flex; align-items: center; gap: 10px; }
        .progress-container { flex-grow: 1; height: 8px; background-color: #e0ffff; border-radius: 4px; position: relative; width: 100%; margin-right: 0; }
        .progress-bar { height: 8px; background-color: #00a3a1; width: 0; border-radius: 4px; }
        .divider { height: 1px; background-color: #e0e0e0; width: 100%; margin: 5px 0; }
        .volume-container { display: flex; align-items: center; flex-grow: 1; }
        .volume-label { font-size: 12px; color: #333; margin-right: 8px; font-weight: bold; }
        .volume-control { display: flex; align-items: center; gap: 10px; width: 100%; }
        .volume-icon { color: #333; font-size: 16px; cursor: pointer; }
        .volume-slider-container { width: 100%; flex-grow: 1; background-color: #e0e0e0; height: 4px; position: relative; border-radius: 2px; }
        .volume-level { background-color: #00a3a1; height: 100%; width: 70%; border-radius: 2px; }
        #volume-slider { position: absolute; top: 0; left: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
        .answer-paragraph-container { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; background-color: rgba(99, 97, 97, 0.95); border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; display: none; z-index: 2; transition: transform 0.3s ease; max-height: 460px; overflow-y: auto; }
        .answer-paragraph-inner { max-width: 90%; margin: 0 auto; background: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: stretch; max-height: 400px; overflow-y: auto; }
        .transcript-section { margin-bottom: 1.5rem; background-color: #fff; border-radius: 4px; border: 1px solid #e0e0e0; overflow-y: auto; }
        .transcript-title { font-weight: bold; margin-bottom: 1rem; color: #333; font-size: 1.2rem; text-align: center; }
        .transcript-text { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin-bottom: 1rem; white-space: pre-wrap; }
        .score-display { font-weight: bold; margin-bottom: 1rem; color: #333; }
        .answer-paragraph { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin: 0; background-color: white; box-shadow: none; border-radius: 3px; display: block; border: 1px solid #e0e0e0; overflow-y: auto; max-height: 200px; }
        .script-highlight { color: #b40000; font-weight: normal; }
        .script-highlight rt { color: #b40000 !important; }
        /* Furigana styling - Simple approach like template 18 */
        ruby { font-size: 1.2rem; }
        rt { font-size: 0.6em; color: #666; }
        .no-answer { color: #666; border-bottom: 2px solid #666; padding: 0 4px; margin: 0 2px; }
        .answer-item { font-family: 'Kyokashotai', 'Kosugi Maru', 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 1.2rem; font-weight: normal; line-height: 1.6; text-align: left; margin: 0; color: #333; display: flex; align-items: center; flex-wrap: wrap; gap: 5px; letter-spacing: 0.4px; }
        .answers-list { padding: 5px; background: white; border-radius: 2px; margin: 5px 0; }
        @media (max-width: 768px) { .container { padding: 15px; gap: 15px; } .content-wrapper { gap: 15px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="content-wrapper">
            <div class="instructions" id="quiz-instructions">
                {{INSTRUCTIONS}}
            </div>
            <form id="quizForm" onsubmit="return false;">
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
                        <span id="start-time">{{START_TIME}}</span>
                        <span id="end-time">{{END_TIME}}</span>
                        <span id="script-text-hidden">{{SCRIPT_TEXT}}</span>
                    </div>
                </div>
                <div class="select-container">
                    <div class="answers-list">{{ANSWERS_LIST}}</div>
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
            </form>
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
        var state = { answer: '', score: 0, attempts: 0, showAnswer: false };
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
            return { rawScore, message, answers, correctCount, totalQuestions };
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
                        answerHtml += '<span class="wrong-answer">' + userAnswer + '</span> → ' + '<span class="correct-answer">' + correctAnswer + '</span> ✗';
                    }
                } else {
                    answerHtml += '<span class="no-answer">未回答</span> → ' + '<span class="correct-answer">' + correctAnswer + '</span>';
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
                answerContainer.style.display = 'none';
                showFlag.value = 'false';
                state.showAnswer = false;
                audioElement.currentTime = startTime;
                audioPlayer.startWithDelay();
            } else {
                const result = calculateResults();
                updateDisplay(result);
                answerContainer.style.display = 'block';
                showFlag.value = 'true';
                state.showAnswer = true;
                audioElement.pause();
                
                // Also pause countdown if it's running
                if (audioPlayer && audioPlayer.pauseCountdown) {
                    audioPlayer.pauseCountdown();
                }
                
                // Send script text to parent for popup display (like template 63)
                try {
                    // Get script text from the template - use innerHTML to preserve HTML tags
                    const scriptTextElement = document.getElementById('script-text-hidden');
                    const scriptText = scriptTextElement ? scriptTextElement.innerHTML : '';
                    
                    console.log('🔍 Script text from hidden element:', scriptText);
                    
                    const quizData = {
                        templateId: 65,
                        scriptText: scriptText
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
            }
            const result = calculateResults();
            return JSON.stringify({ edxResult: None, edxScore: result.rawScore, edxMessage: result.message });
        }
        function getState() {
            return JSON.stringify({ answer: state.answer, attempts: state.attempts, score: state.score, showAnswer: state.showAnswer });
        }
        function setState(stateStr) {
            try {
                const newState = JSON.parse(stateStr);
                state = { answer: newState.answer || '', attempts: newState.attempts || 0, score: newState.score || 0, showAnswer: newState.showAnswer || false };
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
                        document.getElementById('answer-paragraph-container').style.display = state.showAnswer ? 'block' : 'none';
                        document.getElementById('showAnswerFlag').value = state.showAnswer ? 'true' : 'false';
                        if (state.showAnswer) {
                            // Pause audio and countdown when showing answers
                            const audioElement = document.getElementById('audio-player');
                            audioElement.pause();
                            
                            // Also pause countdown if it's running
                            if (audioPlayer && audioPlayer.pauseCountdown) {
                                audioPlayer.pauseCountdown();
                            }
                        }
                    } catch (e) { console.error('Error parsing answers:', e); }
                }
            } catch (e) { console.error('Error setting state:', e); }
        }
        var channel;
        if (window.parent !== window) {
            channel = Channel.build({ window: window.parent, origin: '*', scope: 'JSInput' });
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
            
            // For template 65, we'll use start/end time format like template 40
            const startTime = parseFloat(startTimeElement?.textContent) || 0;
            let endTime = parseFloat(endTimeElement?.textContent) || 0;
            
            // Convert to time segments format for consistency
            let timeSegments = [];
            if (endTime > startTime) {
                timeSegments = [{ start: startTime, end: endTime }];
            }
            
            let currentSegmentIndex = 0;
            let isPlaying = false;
            let totalDuration = 0;
            let isTransitioning = false; // Flag to prevent multiple transitions
            let countdownInterval = null; // Store countdown interval reference
            
            // Calculate total duration of all segments
            if (timeSegments.length > 0) {
                totalDuration = timeSegments.reduce((total, segment) => total + (segment.end - segment.start), 0);
            } else {
                // Fallback to single time range from start/end time
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
            
            // Initialize with 10-second delay
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
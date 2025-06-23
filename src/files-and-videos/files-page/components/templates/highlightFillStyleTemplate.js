export const highlightFillStyleTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Highlight Word Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"></script>
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
        .audio-container {
            padding: 1rem;
            margin-bottom: 1rem;
            text-align: center;
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
        .play-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            color: #333;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        .progress-container {
            flex-grow: 1;
            height: 8px; /* Thicker progress bar */
            background-color: #e0ffff; /* Light cyan background */
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
        .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.02em 0.1em;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            box-sizing: border-box;
        }
        .quiz-word.selected {
            background: #e0f0ff;
            color: #0075b4;
            border: 0.5px solid #0075b4;
        }
        .explanation {
            display: block;
            font-size: 0.9em;
            margin-top: 2px;
            color: #555;
            text-align: center;
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
            padding: 0;
            font-size: 1.2rem;
            display: block;
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
        }
        .wrong-word {
            display: inline-block;
            background-color: #00a3a1;
            color: white;
            padding: 0.1rem 0.3rem;
            border-radius: 2px;
            font-weight: normal;
            margin: 0 2px;
        }
        .wrong-word.class {
            background-color: #0075b4;
        }
        .wrong-word.part {
            background-color: #7d33ff;
        }
        .wrong-word.oversea {
            background-color: #008100;
        }
        .fixed-word-pair {
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 0.1rem 0.3rem;
            margin: 0 2px;
            background-color: #f8f8f8;
        }
        .fixed-word-pair .wrong {
            color: #b40000;
            font-weight: normal;
        }
        .fixed-word-pair .fixed {
            color: #008100;
            font-weight: normal;
        }
        .fixed-word-pair .separator {
            color: #666;
            margin: 0 2px;
        }
        .your-answer-section {
            margin-top: 2rem;
            padding: 0.5rem 1rem;
            background-color: #fff;
            border-radius: 4px;
        }
        .your-answer-title {
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #333;
            font-size: 1.1rem;
        }
        .your-answer-text {
            line-height: 1.8;
        }
        .student-correct {
            display: inline-block;
            background-color: #ecf3ec;
            color: #2e7d32;
            padding: 0.1rem 0.3rem;
            border-radius: 2px;
            font-weight: normal;
            margin: 0 2px;
            border: 1px solid #c5e0c5;
        }
        .student-incorrect {
            display: inline-block;
            background-color: #f9ecec;
            color: #b40000;
            padding: 0.1rem 0.3rem;
            border-radius: 2px;
            font-weight: normal;
            margin: 0 2px;
            border: 1px solid #ebccd1;
        }
        .student-missed {
            display: inline-block;
            color: #333;
            padding: 0.1rem 0;
            margin: 0;
        }
        .score-display {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions" id="quiz-instructions">
            {{INSTRUCTIONS}}
        </div>
        <div class="audio-container">
            <!-- Hidden original audio element for functionality -->
            <audio id="audio-player" class="audio-player">
                <source src="{{AUDIO_FILE}}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            
            <!-- Custom audio player UI -->
            <div class="custom-audio-player">
                <!-- Status display -->
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
            
            <!-- Hidden elements for time tracking -->
            <div style="display: none;">
                <span id="current-time">0:00</span>
                <span id="duration">0:00</span>
                <span id="start-time">{{START_TIME}}</span>
                <span id="end-time">{{END_TIME}}</span>
            </div>
        </div>
        <div class="paragraph" id="quiz-paragraph">
            <!-- Words will be injected here -->
        </div>
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <!-- Transcript section -->
                <div class="transcript-section">
                    <div class="transcript-title">スクリプト</div>
                    <div id="transcript-paragraph" class="transcript-text"></div>
                </div>
                
                <!-- Your answer section -->
                <div class="your-answer-section">
                    <div class="score-display" id="score-display">Your answer: 0/4</div>
                    <div id="answer-paragraph" class="your-answer-text"></div>
                </div>
            </div>
        </div>
        <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
        <input type="hidden" id="fixedWordsExplanation" name="fixedWordsExplanation" value="{{FIXED_WORDS_EXPLANATION}}">
    </div>
    <script>
        (function() {
            const paragraph = '{{PARAGRAPH}}';
            // We'll derive correctWords from fixedWordsExplanation instead of using a separate field
            let correctWords = [];
            
            // Parse the fixedWordsExplanation field to extract mappings
            const fixedWordsMap = {};
            const indexedFixedWordsMap = {};
            
            try {
                const fixedWordsInput = document.getElementById('fixedWordsExplanation');
                console.log('[DEBUG] fixedWordsExplanation element:', fixedWordsInput);
                
                // Check if the element exists and get its value
                const fixedWordsExplanation = fixedWordsInput ? fixedWordsInput.value : '{{FIXED_WORDS_EXPLANATION}}';
                console.log('[DEBUG] Raw fixedWordsExplanation value:', fixedWordsExplanation);
                console.log('[DEBUG] fixedWordsExplanation type:', typeof fixedWordsExplanation);
                
                // Log the template variable directly for comparison
                console.log('[DEBUG] Template variable: {{FIXED_WORDS_EXPLANATION}}');
                
                // Check if the value is empty or just whitespace
                if (!fixedWordsExplanation || fixedWordsExplanation.trim() === '') {
                    console.error('[DEBUG] fixedWordsExplanation is empty or only whitespace');
                }
                
                // Check if it's the default value
                if (fixedWordsExplanation === 'These are the words that should be selected.') {
                    console.warn('[DEBUG] fixedWordsExplanation is using the default value');
                }
                
                if (fixedWordsExplanation) {
                    // Split by comma and trim each part to handle extra spaces
                    const pairs = fixedWordsExplanation.split(',').map(p => p.trim());
                    console.log('[DEBUG] Split pairs:', pairs);
                    
                    if (pairs.length === 0 || (pairs.length === 1 && pairs[0] === '')) {
                        console.error('[DEBUG] No valid pairs found after splitting');
                    }
                    
                    pairs.forEach(pair => {
                        console.log('[DEBUG] Processing pair:', pair);
                        
                        // Replace full-width equals sign (＝) with standard equals sign (=)
                        const normalizedPair = pair.replace(/＝/g, '=');
                        console.log('[DEBUG] Normalized pair:', normalizedPair);
                        
                        // Check if this is an indexed format (word:index=fixed)
                        if (normalizedPair.includes(':') && normalizedPair.includes('=')) {
                            console.log('[DEBUG] Found indexed format');
                            const [wrongWithIndex, fixed] = normalizedPair.split('=').map(s => s.trim());
                            console.log('[DEBUG] wrongWithIndex:', wrongWithIndex, 'fixed:', fixed);
                            if (wrongWithIndex && fixed) {
                                const [wrong, indexStr] = wrongWithIndex.split(':').map(s => s.trim());
                                console.log('[DEBUG] wrong:', wrong, 'indexStr:', indexStr);
                                const normWrong = normalize(wrong);
                                const index = parseInt(indexStr, 10);
                                console.log('[DEBUG] normWrong:', normWrong, 'index:', index);
                                
                                // Add to correctWords if not already included
                                if (!correctWords.includes(normWrong)) {
                                    correctWords.push(normWrong);
                                    console.log('[DEBUG] Added to correctWords:', normWrong);
                                }
                                
                                if (!isNaN(index)) {
                                    if (!indexedFixedWordsMap[normWrong]) {
                                        indexedFixedWordsMap[normWrong] = {};
                                    }
                                    indexedFixedWordsMap[normWrong][index] = fixed;
                                    
                                    // Log for debugging
                                    console.log('[DEBUG] Added indexed mapping: ' + normWrong + '[' + index + '] = ' + fixed);
                                }
                            }
                        } 
                        // Simple format (word=fixed)
                        else if (normalizedPair.includes('=')) {
                            console.log('[DEBUG] Found simple format');
                            const [wrong, fixed] = normalizedPair.split('=').map(s => s.trim());
                            console.log('[DEBUG] wrong:', wrong, 'fixed:', fixed);
                            if (wrong && fixed) {
                                const normWrong = normalize(wrong);
                                
                                // Add to correctWords if not already included
                                if (!correctWords.includes(normWrong)) {
                                    correctWords.push(normWrong);
                                    console.log('[DEBUG] Added to correctWords:', normWrong);
                                }
                                
                                // Store in both maps - simple format for backward compatibility
                                fixedWordsMap[normWrong] = fixed;
                                
                                // Also treat as an indexed mapping with index 0 (first occurrence)
                                if (!indexedFixedWordsMap[normWrong]) {
                                    indexedFixedWordsMap[normWrong] = {};
                                }
                                indexedFixedWordsMap[normWrong][0] = fixed;
                                
                                // Log for debugging
                                console.log('[DEBUG] Added simple mapping: ' + normWrong + ' = ' + fixed);
                                console.log('[DEBUG] Also added as indexed mapping: ' + normWrong + '[0] = ' + fixed);
                            }
                        }
                    });
                }
                
                // Log the final mappings for debugging
                console.log('[DEBUG] Final correctWords:', correctWords);
                console.log('[DEBUG] Final fixedWordsMap:', fixedWordsMap);
                console.log('[DEBUG] Final indexedFixedWordsMap:', indexedFixedWordsMap);
            } catch (e) {
                console.error('Error parsing fixed words:', e);
                // If parsing fails, we'll have an empty correctWords array
                correctWords = [];
            }
            
            let showAnswer = false;
            let selectedWords = [];
            
            // Define word classes for different styling
            const wordClasses = {};
            const classColors = ['class', 'part', 'oversea', ''];
            correctWords.forEach((word, index) => {
                const classNames = ['wrong-word'];
                classNames.push(classColors[index % 4]);
                wordClasses[word.toLowerCase()] = classNames.join(' ');
            });

            function splitWords(text) {
                // Split on both standard and full-width spaces
                return text.split(/[\u0020\u3000]+/).filter(Boolean);
            }

            function renderParagraph() {
                const words = splitWords(paragraph);
                const container = document.getElementById('quiz-paragraph');
                container.innerHTML = '';
                words.forEach((word, idx) => {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.className = 'quiz-word';
                    if (selectedWords.includes(idx)) {
                        span.classList.add('selected');
                    }
                    if (!showAnswer) {
                        span.addEventListener('click', function(e) {
                            span.classList.toggle('selected');
                            if (span.classList.contains('selected')) {
                                if (!selectedWords.includes(idx)) selectedWords.push(idx);
                            } else {
                                selectedWords = selectedWords.filter(i => i !== idx);
                            }
                        });
                    }
                    container.appendChild(span);
                    container.appendChild(document.createTextNode(' '));
                });
                renderAnswerParagraph();
            }

            function renderAnswerParagraph() {
                const answerContainer = document.getElementById('answer-paragraph-container');
                const answerParagraph = document.getElementById('answer-paragraph');
                const transcriptParagraph = document.getElementById('transcript-paragraph');
                const scoreDisplay = document.getElementById('score-display');
                
                if (showAnswer) {
                    answerContainer.style.display = 'block';
                    answerParagraph.style.display = 'block';
                    const words = splitWords(paragraph);
                    
                    // First, identify which words should be highlighted
                    // This handles indexed words correctly
                    const highlightedWords = {};
                    const wordCounts = {};
                    
                    // Process correctWords to identify which words (and which occurrences) should be highlighted
                    words.forEach((word, idx) => {
                        const norm = normalize(word);
                        
                        // Initialize count for this word if not already done
                        if (!wordCounts[norm]) {
                            wordCounts[norm] = 0;
                        }
                        
                        console.log('[DEBUG] Word at idx ' + idx + ': "' + word + '", normalized: "' + norm + '", count: ' + wordCounts[norm]);
                        console.log('[DEBUG] Is in correctWords: ' + correctWords.includes(norm));
                        
                        // Check if this word is in correctWords
                        if (correctWords.includes(norm)) {
                            console.log('[DEBUG] Has indexed mapping: ' + Object.keys(indexedFixedWordsMap).includes(norm));
                            
                            // All words should have indexed mappings now
                            if (Object.keys(indexedFixedWordsMap).includes(norm)) {
                                console.log('[DEBUG] Indexed mappings for ' + norm + ':', indexedFixedWordsMap[norm]);
                                console.log('[DEBUG] Current count: ' + wordCounts[norm] + ', has mapping: ' + (indexedFixedWordsMap[norm][wordCounts[norm]] !== undefined));
                                
                                // Only highlight if this specific occurrence has a mapping
                                if (indexedFixedWordsMap[norm][wordCounts[norm]] !== undefined) {
                                    highlightedWords[idx] = {
                                        word: word,
                                        norm: norm,
                                        count: wordCounts[norm]
                                    };
                                    console.log('[DEBUG] Added to highlightedWords at idx ' + idx + ':', highlightedWords[idx]);
                                } else {
                                    // For other occurrences, don't highlight
                                    console.log('[DEBUG-GRADE] Warning: Word in correctWords but no indexed mapping found');
                                }
                            } 
                            // This shouldn't happen anymore, but keeping as a fallback
                            else {
                                console.log('[DEBUG-GRADE] Warning: Word in correctWords but no indexed mapping found');
                            }
                        }
                        
                        // Increment the count for this word after processing
                        wordCounts[norm]++;
                    });
                    
                    console.log('[DEBUG] Final highlightedWords:', highlightedWords);
                    
                    // Reset word counts for rendering
                    const renderWordCounts = {};
                    
                    // Render transcript with fixed words highlighted
                    transcriptParagraph.innerHTML = words.map(function(word, idx) {
                        const norm = normalize(word);
                        
                        // Initialize count for this word if not already done
                        if (!renderWordCounts[norm]) {
                            renderWordCounts[norm] = 0;
                        }
                        
                        console.log('[DEBUG] Rendering word at idx ' + idx + ': "' + word + '", normalized: "' + norm + '", count: ' + renderWordCounts[norm]);
                        console.log('[DEBUG] Should be highlighted: ' + (highlightedWords[idx] !== undefined));
                        
                        // Only highlight if this specific word at this position should be highlighted
                        if (highlightedWords[idx]) {
                            const className = wordClasses[norm] || 'wrong-word';
                            
                            // Try to get the fixed word using the indexed mapping
                            let fixedWord = 'fixed word';
                            if (indexedFixedWordsMap[norm] && indexedFixedWordsMap[norm][renderWordCounts[norm]] !== undefined) {
                                fixedWord = indexedFixedWordsMap[norm][renderWordCounts[norm]];
                                console.log('[DEBUG] Using indexed fixed word: ' + fixedWord);
                            } 
                            // This shouldn't happen anymore, but keeping as a fallback
                            else if (fixedWordsMap[norm]) {
                                fixedWord = fixedWordsMap[norm];
                                console.log('[DEBUG] Warning: Using simple fixed word as fallback: ' + fixedWord);
                            }
                            
                            console.log('[DEBUG] Final fixed word: ' + fixedWord);
                            
                            // Build the HTML for the highlighted word with the new styling
                            const html = '<span class="fixed-word-pair"><span class="wrong">' + 
                                word + '</span><span class="separator">/</span><span class="fixed">' + 
                                fixedWord + '</span></span>';
                            
                            console.log('[DEBUG] Generated HTML:', html);
                            
                            // Increment the count for this word after processing
                            renderWordCounts[norm]++;
                            
                            return html;
                        } else {
                            // Increment the count for this word after processing
                            renderWordCounts[norm]++;
                            
                            return word;
                        }
                    }).join(' ');
                    
                    // Reset word counts for student answers
                    const studentWordCounts = {};
                    
                    // Render student answers
                    answerParagraph.innerHTML = words.map(function(word, idx) {
                        const norm = normalize(word);
                        
                        // Initialize count for this word if not already done
                        if (!studentWordCounts[norm]) {
                            studentWordCounts[norm] = 0;
                        }
                        
                        // Only consider as correct/incorrect if this specific word at this position should be highlighted
                        if (highlightedWords[idx]) {
                            if (selectedWords.includes(idx)) {
                                // User selected correctly
                                studentWordCounts[norm]++;
                                return '<span class="student-correct">' + word + '</span>';
                            } else {
                                // User missed this word
                                studentWordCounts[norm]++;
                                return '<span class="student-missed">' + word + '</span>';
                            }
                        } else if (selectedWords.includes(idx)) {
                            // User selected incorrectly
                            studentWordCounts[norm]++;
                            return '<span class="student-incorrect">' + word + '</span>';
                        } else {
                            // Not selected, not a correct answer
                            studentWordCounts[norm]++;
                            return word;
                        }
                    }).join(' ');
                    
                    // Calculate score based on highlighted words
                    let correctCount = 0;
                    let total = Object.keys(highlightedWords).length;
                    
                    Object.keys(highlightedWords).forEach(idx => {
                        if (selectedWords.includes(parseInt(idx))) {
                            correctCount++;
                        }
                    });
                    
                    // Update score display
                    scoreDisplay.textContent = 'Your answer: ' + correctCount + '/' + total;
                } else {
                    answerContainer.style.display = 'none';
                    answerParagraph.style.display = 'none';
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
                
                // Play/Pause toggle
                function togglePlayPause() {
                    if (isPlaying) {
                        audioElement.pause();
                        isPlaying = false;
                        playerStatus.textContent = 'Current Status: Paused';
                    } else {
                        // If at start time or outside valid range, play from start with delay
                        if (audioElement.currentTime === startTime || 
                            audioElement.currentTime < startTime || 
                            (endTime > 0 && audioElement.currentTime >= endTime)) {
                            
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
                        } else {
                            // Resume immediately from current position
                            audioElement.play()
                                .then(function() {
                                    isPlaying = true;
                                    playerStatus.textContent = 'Current Status: Playing';
                                });
                        }
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
            }

            function normalize(word) {
                return word.replace(/[.,!?;:()\"'-]/g, '').toLowerCase();
            }
            function getSelectedWords() {
                return selectedWords;
            }
            function grade() {
                console.log('[DEBUG] Starting grade function');
                const selected = getSelectedWords();
                console.log('[DEBUG] Selected words:', selected);
                const words = splitWords(paragraph);
                console.log('[DEBUG] Words from paragraph:', words);
                
                // First, identify which words should be highlighted
                // This handles indexed words correctly
                const highlightedWords = {};
                const wordCounts = {};
                
                // Process correctWords to identify which words (and which occurrences) should be highlighted
                words.forEach((word, idx) => {
                    const norm = normalize(word);
                    
                    // Initialize count for this word if not already done
                    if (!wordCounts[norm]) {
                        wordCounts[norm] = 0;
                    }
                    
                    console.log('[DEBUG-GRADE] Word at idx ' + idx + ': "' + word + '", normalized: "' + norm + '", count: ' + wordCounts[norm]);
                    console.log('[DEBUG-GRADE] Is in correctWords: ' + correctWords.includes(norm));
                    
                    // Check if this word is in correctWords
                    if (correctWords.includes(norm)) {
                        console.log('[DEBUG-GRADE] Has indexed mapping: ' + Object.keys(indexedFixedWordsMap).includes(norm));
                        
                        // All words should have indexed mappings now
                        if (Object.keys(indexedFixedWordsMap).includes(norm)) {
                            console.log('[DEBUG-GRADE] Indexed mappings for ' + norm + ':', indexedFixedWordsMap[norm]);
                            console.log('[DEBUG-GRADE] Current count: ' + wordCounts[norm] + ', has mapping: ' + (indexedFixedWordsMap[norm][wordCounts[norm]] !== undefined));
                            
                            // Only highlight if this specific occurrence has a mapping
                            if (indexedFixedWordsMap[norm][wordCounts[norm]] !== undefined) {
                                highlightedWords[idx] = {
                                    word: word,
                                    norm: norm,
                                    count: wordCounts[norm]
                                };
                                console.log('[DEBUG-GRADE] Added to highlightedWords at idx ' + idx + ':', highlightedWords[idx]);
                            } else {
                                // For other occurrences, don't highlight
                                console.log('[DEBUG-GRADE] Skipping this occurrence as it has no indexed mapping');
                            }
                        }
                        // No indexed mapping for this word, highlight all occurrences
                        else {
                            highlightedWords[idx] = {
                                word: word,
                                norm: norm,
                                count: wordCounts[norm]
                            };
                            console.log('[DEBUG-GRADE] Added to highlightedWords (no index) at idx ' + idx + ':', highlightedWords[idx]);
                        }
                    }
                    
                    // Increment the count for this word after processing
                    wordCounts[norm]++;
                });
                
                console.log('[DEBUG-GRADE] Final highlightedWords:', highlightedWords);
                
                // Calculate score based on highlighted words
                let correctCount = 0;
                let total = Object.keys(highlightedWords).length;
                
                Object.keys(highlightedWords).forEach(idx => {
                    const idxNum = parseInt(idx);
                    console.log('[DEBUG-GRADE] Checking if idx ' + idxNum + ' is in selected:', selected.includes(idxNum));
                    if (selected.includes(idxNum)) {
                        correctCount++;
                    }
                });
                
                console.log('[DEBUG-GRADE] Final score: ' + correctCount + '/' + total);
                
                return { correctCount, total };
            }
            function reset() {
                selectedWords = [];
                renderParagraph();
            }
            var channel;
            if (window.parent !== window) {
                channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });
            }
            function getGrade() {
                const answerContainer = document.getElementById('answer-paragraph-container');
                const answerParagraph = document.getElementById('answer-paragraph');
                const showFlag = document.getElementById('showAnswerFlag');
                const audioElement = document.getElementById('audio-player');
                const startTimeElement = document.getElementById('start-time');
                const playerStatus = document.getElementById('player-status');
                
                const startTime = parseFloat(startTimeElement.textContent) || 0;
                
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
                
                const isVisible = answerContainer.style.display === 'block';
                if (isVisible) {
                    // Hide answers
                    answerParagraph.style.display = 'none';
                    answerContainer.style.display = 'none';
                    showFlag.value = 'false';
                    showAnswer = false;
                    selectedWords = [];
                    renderParagraph();
                    
                    // Reset to start time and play with delay
                    audioElement.currentTime = startTime;
                    
                    // Start with delay
                    startWithDelay();
                    
                } else {
                    // Show answers
                    showAnswer = true;
                    renderParagraph();
                    answerParagraph.style.display = 'block';
                    answerContainer.style.display = 'block';
                    showFlag.value = 'true';
                    
                    // Pause the audio
                    audioElement.pause();
                    playerStatus.textContent = 'Current Status: Paused';
                }
                // Still return grade info to EdX
                const result = grade();
                return JSON.stringify({
                    edxResult: None,
                    edxScore: result.correctCount / result.total,
                    edxMessage: 'Your score: ' + result.correctCount + ' out of ' + result.total
                });
            }
            function getState() {
                return JSON.stringify({ selected: selectedWords, showAnswer });
            }
            function setState(stateStr) {
                try {
                    const state = JSON.parse(stateStr);
                    selectedWords = state.selected || [];
                    showAnswer = !!state.showAnswer;
                    renderParagraph();
                    // Set visibility based on state
                    const answerContainer = document.getElementById('answer-paragraph-container');
                    const answerParagraph = document.getElementById('answer-paragraph');
                    const showFlag = document.getElementById('showAnswerFlag');
                    
                    if (showAnswer) {
                        answerParagraph.style.display = 'block';
                        answerContainer.style.display = 'block';
                        showFlag.value = 'true';
                    } else {
                        answerParagraph.style.display = 'none';
                        answerContainer.style.display = 'none';
                        showFlag.value = 'false';
                    }
                } catch (e) {}
            }
            if (channel) {
                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
            }
            renderParagraph();
            setupAudioPlayer();
        })();
    </script>
</body>
</html>`; 
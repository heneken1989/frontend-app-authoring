import { TEMPLATE_IDS } from './templateUtils';

// Template IDs: TEMPLATE_IDS.HIGHLIGHT_JAPANESE, TEMPLATE_IDS.HIGHLIGHT_WORD
export const highlightFillStyleTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Highlight Word Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"></script>
    <style>
        body {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
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
            padding: 1.0rem 1.0rem 0.5rem 0.5rem;
            margin: 0 auto 0.5rem auto;
            font-size: 1.2rem;
            line-height: 2.0;
            position: relative;
            z-index: 1;
            white-space: normal;
            overflow-x: auto;
            min-height: 4.0rem;
            text-align: left;
            max-width: 80%;
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
            position: relative;
        }
        .instructions {
            background-color: #f5f9fc;
            padding: 1rem;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            line-height: 1.5;
            color: #333;
            font-weight: bold;
            font-style: italic;
            text-align: center;
        }
        .audio-container {
            margin-bottom: 10px;
            width: 100%;
            height: auto;
            display: flex;
            justify-content: center;
            align-items: center;
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
        .player-status {
            font-weight: bold;
            color: #333;
            margin-bottom: 2px;
            text-align: left;
            font-size: 14px;
            padding-bottom: 5px;
        }
        .audio-range-debug {
            font-size: 12px;
            color: #666;
            margin-bottom: 6px;
            text-align: left;
            word-break: break-word;
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
        .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            box-sizing: border-box;
            white-space: nowrap;
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            text-decoration: none !important;
        }
        /* Ensure no underline for all quiz-word variants */
        .quiz-word * {
            text-decoration: none !important;
        }
        /* Words without furigana - compact height */
        .quiz-word.no-furigana {
            padding: 0.3em 0.3rem;
            line-height: 1;
        }
        /* Words with furigana - taller height but same baseline */
        .quiz-word.with-furigana {
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            line-height: 1;
        }
        /* Ensure all words have consistent alignment when not selected */
        .quiz-word:not(.selected):not(.student-correct):not(.student-incorrect):not(.student-missed) {
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            vertical-align: baseline;
            line-height: 1;
        }
        .quiz-word.selected {
            background: #fff3cd;
            color: #856404;
            border: 0.5px solid #ffeaa7;
        }
        .quiz-word.selected.wrong {
            background: #f9ecec !important;
            color: #b40000 !important;
            border: 0.5px solid #b40000 !important;
            text-decoration: none !important;
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
            background-color: #4caf50;
            color: white;
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            border-radius: 4px;
            font-weight: bold;
            margin: 0 2px;
            border: 2px solid #2e7d32;
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            box-sizing: border-box;
            text-decoration: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .student-correct.no-furigana {
            padding: 0.3em 0.3rem;
            line-height: 1;
        }
        .student-correct.with-furigana {
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            line-height: 1;
        }
        .student-incorrect {
            display: inline-block;
            background-color: #f44336;
            color: white;
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            border-radius: 4px;
            font-weight: bold;
            margin: 0 2px;
            border: 2px solid #d32f2f;
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            box-sizing: border-box;
            text-decoration: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .student-incorrect.no-furigana {
            padding: 0.3em 0.3rem;
            line-height: 1;
        }
        .student-incorrect.with-furigana {
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            line-height: 1;
        }
        .student-missed {
            display: inline-block;
            background-color: #ff9800;
            color: white;
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            border-radius: 4px;
            font-weight: bold;
            margin: 0 2px;
            border: 2px solid #f57c00;
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            box-sizing: border-box;
            text-decoration: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .student-missed.no-furigana {
            padding: 0.3em 0.3rem;
            line-height: 1;
        }
        .student-missed.with-furigana {
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            line-height: 1;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            font-size: 0.9em;
            vertical-align: baseline;
            display: inline;
            line-height: 1;
            text-decoration: underline !important;
            text-decoration-color: #2e7d32 !important;
            text-decoration-thickness: 2px !important;
            text-underline-offset: 2px !important;
        }
        .correct-answer ruby {
            vertical-align: baseline;
            display: inline;
            position: static;
        }
        .correct-answer rt {
            vertical-align: baseline;
            position: static;
            display: inline;
            font-size: 0.5em;
            color: #2e7d32;
            line-height: 1;
            top: auto;
            left: auto;
            right: auto;
            width: auto;
            z-index: auto;
        }
        /* Furigana styling - Force above kanji for all browsers */
        ruby { 
            font-size: 1.2rem !important;
            display: inline !important;
            line-height: 1 !important;
            vertical-align: baseline !important;
            position: relative !important;
        }
        rt { 
            font-size: 0.5rem !important; 
            color: #666 !important;
            line-height: 1 !important;
            display: block !important;
            text-align: center !important;
            position: absolute !important;
            top: -0.8em !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 5 !important;
        }
        /* Safari-specific furigana fix */
        @media not all and (min-resolution:.001dpcm) {
          @supports (-webkit-appearance:none) {
            rt {
              position: absolute !important;
              top: -1.2em !important;
              transform: translateY(0) !important;
            }
            .quiz-word rt {
              position: absolute !important;
              top: -1.2em !important;
              transform: translateY(0) !important;
            }
            .student-correct rt,
            .student-incorrect rt,
            .student-missed rt {
              position: absolute !important;
              top: -1.2em !important;
              transform: translateY(0) !important;
            }
          }
        }
        .quiz-word ruby {
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            display: inline;
        }
        .quiz-word rt {
            position: absolute;
            top: -0.8em;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 5;
        }
        /* Furigana support for result classes */
        .student-correct ruby,
        .student-incorrect ruby,
        .student-missed ruby {
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            display: inline;
        }
        .student-correct rt,
        .student-incorrect rt,
        .student-missed rt {
            position: absolute;
            top: -0.8em;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 5;
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
                    <div id="audio-range-debug" class="audio-range-debug"></div>
                
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
                <span id="time-segments">{{TIME_SEGMENTS}}</span>
            </div>
        </div>
        <div class="paragraph" id="quiz-paragraph">
            <!-- Words will be injected here -->
        </div>
        <div id="score-display" style="display: none;"></div>
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <!-- Transcript section -->
                <div class="transcript-section">
                    <div class="transcript-title">スクリプト</div>
                    <div id="transcript-paragraph" class="transcript-text"></div>
                </div>
                
                <!-- Your answer section -->
                <div class="your-answer-section">
                    <div id="answer-paragraph" class="your-answer-text"></div>
                </div>
            </div>
        </div>
        <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
        <input type="hidden" id="fixedWordsExplanation" name="fixedWordsExplanation" value="{{FIXED_WORDS_EXPLANATION}}">
        <input type="hidden" id="paragraphData" name="paragraphData" value="{{PARAGRAPH}}">
    </div>
    <script>
        (function() {
            const paragraphElement = document.getElementById('paragraphData');
            const paragraph = paragraphElement ? paragraphElement.value : '';
            // We'll derive correctWords from fixedWordsExplanation instead of using a separate field
            let correctWords = [];
            
            // Parse the fixedWordsExplanation field to extract mappings
            const fixedWordsMap = {};
            const indexedFixedWordsMap = {};
            
            try {
                const fixedWordsInput = document.getElementById('fixedWordsExplanation');
                
                // Check if the element exists and get its value
                const fixedWordsExplanation = fixedWordsInput ? fixedWordsInput.value : '';
                
                // Check if the value is empty or just whitespace
                if (!fixedWordsExplanation || fixedWordsExplanation.trim() === '') {
                    console.error('fixedWordsExplanation is empty or only whitespace');
                }
                
                // Check if it's the default value
                if (fixedWordsExplanation === 'These are the words that should be selected.') {
                    console.warn('fixedWordsExplanation is using the default value');
                }
                
                if (fixedWordsExplanation) {
                    // Split by comma and trim each part to handle extra spaces
                    const pairs = fixedWordsExplanation.split(',').map(p => p.trim());
                    
                    if (pairs.length === 0 || (pairs.length === 1 && pairs[0] === '')) {
                        console.error('No valid pairs found after splitting');
                    }
                    
                    pairs.forEach(pair => {
                        // Replace full-width equals sign (＝) with standard equals sign (=)
                        const normalizedPair = pair.replace(/＝/g, '=');
                        
                        // Check if this is an indexed format (word:index=fixed)
                        if (normalizedPair.includes(':') && normalizedPair.includes('=')) {
                            const [wrongWithIndex, fixed] = normalizedPair.split('=').map(s => s.trim());
                            if (wrongWithIndex && fixed) {
                                const [wrong, indexStr] = wrongWithIndex.split(':').map(s => s.trim());
                                const normWrong = normalize(wrong);
                                const index = parseInt(indexStr, 10);
                                
                                // Add to correctWords if not already included
                                if (!correctWords.includes(normWrong)) {
                                    correctWords.push(normWrong);
                                }
                                
                                if (!isNaN(index)) {
                                    if (!indexedFixedWordsMap[normWrong]) {
                                        indexedFixedWordsMap[normWrong] = {};
                                    }
                                    indexedFixedWordsMap[normWrong][index] = fixed;
                                }
                            }
                        } 
                        // Simple format (word=fixed)
                        else if (normalizedPair.includes('=')) {
                            const [wrong, fixed] = normalizedPair.split('=').map(s => s.trim());
                            if (wrong && fixed) {
                                const normWrong = normalize(wrong);
                                
                                // Add to correctWords if not already included
                                if (!correctWords.includes(normWrong)) {
                                    correctWords.push(normWrong);
                                }
                                
                                // Store in both maps - simple format for backward compatibility
                                fixedWordsMap[normWrong] = fixed;
                                
                                // Also treat as an indexed mapping with index 0 (first occurrence)
                                if (!indexedFixedWordsMap[normWrong]) {
                                    indexedFixedWordsMap[normWrong] = {};
                                }
                                indexedFixedWordsMap[normWrong][0] = fixed;
                            }
                        }
                    });
                }
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

            // Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
            function convertFurigana(text) {
                if (!text || typeof text !== "string") return text;

                // Chỉ Kanji (và vài ký tự đặc biệt)
                const kanjiWord = "[\u4E00-\u9FFF々〆〤ヶ]+";

                // Dấu ngoặc Nhật (全角)
                const reJaParens = new RegExp("(" + kanjiWord + ")（([^）]+)）", "g");
                text = text.replace(reJaParens, (match, p1, p2) => {
                    return '<ruby>' + p1 + '<rt>' + p2 + '</rt></ruby>';
                });

                // Dấu ngoặc ASCII (半角)
                const reAsciiParens = new RegExp("(" + kanjiWord + ")\\(([^)]+)\\)", "g");
                text = text.replace(reAsciiParens, (match, p1, p2) => {
                    return '<ruby>' + p1 + '<rt>' + p2 + '</rt></ruby>';
                });

                return text;
            }

            function splitWords(text) {
                // First, replace BREAK with a special separator to ensure it's split properly
                const textWithSeparators = text.replace(/BREAK/g, ' |||BREAK||| ');
                // Split on both standard and full-width spaces
                const words = textWithSeparators.split(/[\u0020\u3000]+/).filter(Boolean);
                // Convert |||BREAK||| back to BREAK
                return words.map(word => word === '|||BREAK|||' ? 'BREAK' : word);
            }

            function renderParagraph() {
                const words = splitWords(paragraph);
                const container = document.getElementById('quiz-paragraph');
                container.innerHTML = '';
                
                // First, identify which words should be highlighted for answers
                const highlightedWords = {};
                const wordCounts = {};
                
                if (showAnswer) {
                    // If correctWords is empty or doesn't match current paragraph, use paragraph words
                    if (correctWords.length === 0 || !words.some(word => correctWords.includes(normalize(word)))) {
                        // Use all words from paragraph as correct words for testing
                        correctWords = words.map(word => normalize(word));
                    }
                    
                    // Process correctWords to identify which words (and which occurrences) should be highlighted
                    words.forEach((word, idx) => {
                        const norm = normalize(word);
                        
                        // Initialize count for this word if not already done
                        if (!wordCounts[norm]) {
                            wordCounts[norm] = 0;
                        }
                        
                        // Check if this word is in correctWords
                        if (correctWords.includes(norm)) {
                            // All words should have indexed mappings now
                            if (Object.keys(indexedFixedWordsMap).includes(norm)) {
                                // Only highlight if this specific occurrence has a mapping
                                if (indexedFixedWordsMap[norm][wordCounts[norm]] !== undefined) {
                                    highlightedWords[idx] = {
                                        word: word,
                                        norm: norm,
                                        count: wordCounts[norm]
                                    };
                                }
                            } else {
                                // If no indexed mapping, highlight all occurrences
                                highlightedWords[idx] = {
                                    word: word,
                                    norm: norm,
                                    count: wordCounts[norm]
                                };
                            }
                        }
                        
                        // Increment the count for this word after processing
                        wordCounts[norm]++;
                    });
                }
                
                // Reset word counts for rendering
                const renderWordCounts = {};
                
                let spanIndex = 0; // Track actual span index for styling
                
                words.forEach((word, idx) => {
                    // Check if this is a line break marker
                    if (word === 'BREAK') {
                        const br = document.createElement('br');
                        container.appendChild(br);
                        return;
                    }
                    
                    const span = document.createElement('span');
                    span.className = 'quiz-word';
                    
                    if (selectedWords.includes(idx)) {
                        span.classList.add('selected');
                    }
                    
                    // Apply furigana conversion to the word after grouping
                    const wordWithFurigana = convertFurigana(word);
                    
                    // Detect if word has furigana and apply appropriate class
                    const hasFurigana = wordWithFurigana.includes('<ruby>') || wordWithFurigana.includes('<rt>');
                    if (hasFurigana) {
                        span.classList.add('with-furigana');
                    } else {
                        span.classList.add('no-furigana');
                    }
                    
                    // If showing answers, apply result styling directly to the word
                    if (showAnswer) {
                        const norm = normalize(word);
                        
                        // Initialize count for this word if not already done
                        if (!renderWordCounts[norm]) {
                            renderWordCounts[norm] = 0;
                        }
                        
                        
                        // Check if this word is a correct answer (regardless of user selection)
                        if (correctWords.includes(norm)) {
                            // Get the correct answer
                            let correctAnswer = word;
                            
                            if (indexedFixedWordsMap[norm] && indexedFixedWordsMap[norm][renderWordCounts[norm]] !== undefined) {
                                correctAnswer = indexedFixedWordsMap[norm][renderWordCounts[norm]];
                            } else if (fixedWordsMap[norm]) {
                                correctAnswer = fixedWordsMap[norm];
                            }
                            
                            // Apply furigana to correct answer too
                            const correctAnswerWithFurigana = convertFurigana(correctAnswer);
                            
                            // Apply styling based on whether this word should be highlighted
                            if (highlightedWords[idx]) {
                                // This word should be highlighted - show in green
                                span.classList.remove('selected', 'wrong');
                                span.classList.add('student-correct');
                                if (hasFurigana) {
                                    span.classList.add('with-furigana');
                                } else {
                                    span.classList.add('no-furigana');
                                }
                                span.innerHTML = wordWithFurigana;
                            } else if (selectedWords.includes(idx)) {
                                // User selected this word but it shouldn't be highlighted - show as incorrect
                                span.classList.remove('selected', 'wrong');
                                span.classList.add('student-incorrect');
                                if (hasFurigana) {
                                    span.classList.add('with-furigana');
                                } else {
                                    span.classList.add('no-furigana');
                                }
                                span.innerHTML = wordWithFurigana;
                            } else {
                                // This word should not be highlighted and user didn't select it - show as normal
                                span.classList.remove('selected', 'wrong', 'student-correct', 'student-incorrect');
                                if (hasFurigana) {
                                    span.classList.add('with-furigana');
                                } else {
                                    span.classList.add('no-furigana');
                                }
                                span.innerHTML = wordWithFurigana;
                            }
                            
                            // Increment the count for this word after processing
                            renderWordCounts[norm]++;
                        } else if (selectedWords.includes(idx)) {
                            // User selected incorrectly - show in red
                            span.classList.remove('selected', 'wrong');
                            span.classList.add('student-incorrect');
                            if (hasFurigana) {
                                span.classList.add('with-furigana');
                            } else {
                                span.classList.add('no-furigana');
                            }
                            span.innerHTML = wordWithFurigana;
                        } else {
                            // Normal word
                            span.innerHTML = wordWithFurigana;
                        }
                    } else {
                        // Normal mode - check for wrong selections and apply styling
                        if (selectedWords.includes(idx)) {
                            const norm = normalize(word);
                            if (!correctWords.includes(norm)) {
                                span.classList.add('student-incorrect');
                            } else {
                                span.classList.add('student-correct');
                            }
                        } else {
                            // Reset any existing styling for non-selected words
                            span.classList.remove('student-correct', 'student-incorrect', 'student-missed', 'wrong');
                        }
                        // Normal mode - just show the word with furigana
                        span.innerHTML = wordWithFurigana;
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
                    spanIndex++; // Increment span index for each actual span created
                });
                
                
                renderAnswerParagraph();
            }

            function renderAnswerParagraph() {
                // Always hide the popup container - we don't need it anymore
                const answerContainer = document.getElementById('answer-paragraph-container');
                const answerParagraph = document.getElementById('answer-paragraph');
                
                answerContainer.style.display = 'none';
                answerParagraph.style.display = 'none';
                
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
                const audioRangeDebug = document.getElementById('audio-range-debug');
                
                // Log audio source
                console.log('🎵 Audio element:', audioElement);
                console.log('🎵 Audio src:', audioElement ? audioElement.src : 'null');
                console.log('🎵 Audio currentSrc:', audioElement ? audioElement.currentSrc : 'null');
                
                // Set initial status to Starting countdown
                playerStatus.textContent = 'Current Status: Starting in 3s...';
                
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
                
                const timeSegmentsString = timeSegmentsElement ? timeSegmentsElement.textContent : '';
                console.log('🎵 Time segments string:', timeSegmentsString);
                
                const timeSegments = parseTimeSegments(timeSegmentsString);
                console.log('🎵 Parsed time segments:', timeSegments);
                
                let currentSegmentIndex = 0;
                let totalDuration = 0;
                let isPlaying = false;
                let isTransitioning = false; // Flag to prevent multiple transitions
                let countdownInterval = null; // Store countdown interval reference
                
                // Calculate total duration of all segments
                if (timeSegments.length > 0) {
                    totalDuration = timeSegments.reduce((total, segment) => total + (segment.end - segment.start), 0);
                    console.log('🎵 Total duration from segments:', totalDuration);
                } else {
                    // Fallback to single time range from timeSegmentsElement
                    const timeString = timeSegmentsString || '0-0';
                    console.log('🎵 Fallback to single time range:', timeString);
                    const parts = timeString.split('-');
                    if (parts.length === 2) {
                        const startTime = parseFloat(parts[0]) || 0;
                        const endTime = parseFloat(parts[1]) || 0;
                        if (endTime > startTime) {
                            timeSegments.push({ start: startTime, end: endTime });
                            totalDuration = endTime - startTime;
                            console.log('🎵 Created fallback segment:', { start: startTime, end: endTime });
                        }
                    }
                }
                
                // Update debug display with segments info
                function updateRangeDebug(actualDuration) {
                    if (!audioRangeDebug) return;
                    if (timeSegments.length === 0) {
                        audioRangeDebug.textContent = 'Audio Range: No segments';
                    } else if (timeSegments.length === 1) {
                        audioRangeDebug.textContent = 'Audio Range: ' + timeSegments[0].start + 's → ' + timeSegments[0].end + 's';
                    } else {
                        const segmentStrs = timeSegments.map(s => s.start + 's-' + s.end + 's').join('; ');
                        audioRangeDebug.textContent = 'Audio Segments: ' + segmentStrs;
                    }
                }
                updateRangeDebug();
                
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
                
                // Initialize with 3-second delay
                function initializePlayer() {
                    console.log('🎵 initializePlayer called - timeSegments.length:', timeSegments.length);
                    
                    if (timeSegments.length === 0) {
                        console.log('🎵 No segments found, setting status to Ready');
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
                    console.log('🎵 Set currentTime to first segment start:', timeSegments[0].start);
                    
                    // Update status to show countdown
                    playerStatus.textContent = 'Current Status: Starting in 3s...';
                    
                    // Countdown timer
                    let countdown = 3;
                    countdownInterval = setInterval(function() {
                        countdown--;
                        console.log('🎵 Countdown:', countdown);
                        if (countdown > 0) {
                            playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                        } else {
                            console.log('🎵 Countdown finished, calling playNextSegment()');
                            clearInterval(countdownInterval);
                            countdownInterval = null;
                            // Auto-play when countdown reaches 0
                            playNextSegment();
                        }
                    }, 1000);
                }
                
                // Play the current segment
                function playNextSegment() {
                    console.log('🎵 playNextSegment called - currentSegmentIndex:', currentSegmentIndex, 'total segments:', timeSegments.length);
                    
                    if (currentSegmentIndex >= timeSegments.length) {
                        // All segments played, stop and reset to first segment
                        console.log('🎵 All segments completed');
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
                    console.log('🎵 Playing segment', currentSegmentIndex, ':', currentSegment.start, 's →', currentSegment.end, 's');
                    console.log('🎵 Audio element ready state:', audioElement.readyState, 'duration:', audioElement.duration);
                    audioElement.currentTime = currentSegment.start;
                    
                    audioElement.play()
                        .then(function() {
                            console.log('🎵 Audio play() succeeded');
                            isPlaying = true;
                            playerStatus.textContent = 'Current Status: Playing';
                        })
                        .catch(function(error) {
                            console.error('🎵 Error playing audio:', error);
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
                    updateRangeDebug(actualDuration);
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
                            playerStatus.textContent = 'Current Status: Starting in 3s...';
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

            function normalize(word) {
                return word.replace(/[.,!?;:()\"'-]/g, '').toLowerCase();
            }
            function getSelectedWords() {
                return selectedWords;
            }
            function grade() {
                const selected = getSelectedWords();
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
                    
                    
                    // Check if this word is in correctWords
                    if (correctWords.includes(norm)) {
                        // All words should have indexed mappings now
                        if (Object.keys(indexedFixedWordsMap).includes(norm)) {
                            // Only highlight if this specific occurrence has a mapping
                            if (indexedFixedWordsMap[norm][wordCounts[norm]] !== undefined) {
                                highlightedWords[idx] = {
                                    word: word,
                                    norm: norm,
                                    count: wordCounts[norm]
                                };
                            }
                        }
                        // No indexed mapping for this word, highlight all occurrences
                        else {
                            highlightedWords[idx] = {
                                word: word,
                                norm: norm,
                                count: wordCounts[norm]
                            };
                        }
                    }
                    
                    // Increment the count for this word after processing
                    wordCounts[norm]++;
                });
                
                // Calculate score based on highlighted words
                let correctCount = 0;
                let total = Object.keys(highlightedWords).length;
                
                Object.keys(highlightedWords).forEach(idx => {
                    const idxNum = parseInt(idx);
                    if (selected.includes(idxNum)) {
                        correctCount++;
                    }
                });
                
                return { correctCount, total };
            }
            function reset() {
                selectedWords = [];
                renderParagraph();
            }
            
            function resetQuiz() {
                console.log('🔄 Starting reset process...');
                
                // Reset all state variables
                selectedWords = [];
                showAnswer = false;
                
                // Reset showAnswerFlag
                const showFlag = document.getElementById('showAnswerFlag');
                if (showFlag) {
                    showFlag.value = 'false';
                }
                
                
                // Hide answer paragraph container
                const answerContainer = document.getElementById('answer-paragraph-container');
                if (answerContainer) {
                    answerContainer.style.display = 'none';
                }
                
                // Re-render paragraph to reset all styling
                renderParagraph();
                
                // Reset audio player and start with delay (like initial load)
                if (audioPlayer) {
                    audioPlayer.startWithDelay();
                }
                
                console.log('🔄 Quiz reset completed');
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
                
                const isVisible = answerContainer.style.display === 'block';
                
                if (isVisible) {
                    // Hide answers - use resetQuiz for complete reset
                    resetQuiz();
                    
                } else {
                    // Check if we need to show wrong selections first
                    const hasWrongSelections = selectedWords.some(idx => {
                        const words = splitWords(paragraph);
                        const word = words[idx];
                        const norm = normalize(word);
                        return !correctWords.includes(norm);
                    });
                    
                    if (hasWrongSelections) {
                        // First check - show both wrong selections and correct answers
                        
                        // First render paragraph to show correct answers
                        showAnswer = true;
                        renderParagraph();
                        
                        // Then apply wrong styling to incorrect selections
                        const words = splitWords(paragraph);
                        
                        // Find all span elements and mark wrong ones
                        const spans = document.querySelectorAll('.quiz-word');
                        
                        // Create a mapping from span index to word index
                        let wordIndex = 0;
                        const spanToWordMap = [];
                        words.forEach((word, idx) => {
                            if (word !== 'BREAK') {
                                spanToWordMap.push(idx);
                                wordIndex++;
                            }
                        });
                        
                        spans.forEach((span, spanIdx) => {
                            const wordIdx = spanToWordMap[spanIdx];
                            if (wordIdx !== undefined && selectedWords.includes(wordIdx)) {
                                const word = words[wordIdx];
                                const norm = normalize(word);
                                
                                if (!correctWords.includes(norm)) {
                                    // Remove any existing styling classes
                                    span.classList.remove('student-correct', 'student-incorrect', 'student-missed', 'wrong');
                                    span.classList.add('student-incorrect');
                                }
                            } else {
                                // Reset any wrong styling for non-selected words
                                span.classList.remove('student-correct', 'student-incorrect', 'student-missed', 'wrong');
                                span.style.backgroundColor = '';
                                span.style.color = '';
                                span.style.border = '';
                            }
                        });
                        
                        showFlag.value = 'true';
                        
                        // Pause the audio
                        if (audioPlayer) {
                            audioPlayer.pauseCountdown();
                        }
                    } else {
                        // Second check - show full answers
                        showAnswer = true;
                        renderParagraph();
                        showFlag.value = 'true';
                        
                        // Pause the audio
                        if (audioPlayer) {
                            audioPlayer.pauseCountdown();
                        }
                    }
                }
                
                // Call completion API (like template 63)
                setTimeout(() => {
                    try {
                        const result = grade();
                        updateCompletionStatus(result);
                    } catch (error) {
                        console.error('Error in updateCompletionStatus:', error);
                    }
                }, 100);
                
                // Send quiz data to parent for popup display (like template 63)
                try {
                    sendQuizData();
                } catch (error) {
                    console.error('Error sending quiz data to parent:', error);
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
                        showFlag.value = 'true';
                        
                        // Pause audio when showing answers
                        if (audioPlayer) {
                            audioPlayer.pauseCountdown();
                        }
                    } else {
                        showFlag.value = 'false';
                    }
                } catch (e) {}
            }
            if (channel) {
                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
            }
            
            // Listen for messages from parent (like template 63)
            window.addEventListener('message', function(event) {
                console.log('🔄 Received message:', event.data);
                
                // Handle JSChannel messages (from EdX)
                if (event.data && event.data.method === 'JSInput::getGrade') {
                    console.log('🔄 Processing JSChannel getGrade - showing answers');
                    getGrade();
                    return;
                }
                
                // Process postMessage from parent window or problem.html
                if (event.source !== window.parent && event.source !== window) {
                    return;
                }
                
                console.log('🔄 Received postMessage from parent:', event.data);
                console.log('🔄 Message type:', event.data?.type);
                
                if (event.data && event.data.type === 'problem.check') {
                    console.log('🔄 Processing problem.check - resetting quiz');
                    // Reset quiz state
                    resetQuiz();
                }
                
                if (event.data && event.data.type === 'problem.submit') {
                    console.log('🔄 Processing problem.submit - action:', event.data.action);
                    
                    if (event.data.action === 'check') {
                        console.log('🔄 Processing problem.submit with action=check - showing answers');
                        // Trigger quiz submission when Check button is clicked
                        getGrade();
                    } else if (event.data.action === 'reset') {
                        console.log('🔄 Processing problem.submit with action=reset - resetting quiz');
                        // Reset quiz when reset action is received
                        resetQuiz();
                    } else if (event.data.action === 'save') {
                        // Save current state when navigating away
                        const result = grade();
                        console.log('Saving state before navigation:', result);
                    }
                }
            });
            
            // Initialize audio player
            const audioPlayer = setupAudioPlayer();
            
            // Helper function to get cookies (from template 63)
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

            // Function to update completion status (from template 63)
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
                    console.log('✅ Quiz completion marked successfully');
                })
                .catch(error => {
                    // Error handling
                    console.error('❌ Error marking quiz completion:', error);
                });
            }
            
            // Send quiz data to parent window (only after submission)
            function sendQuizData() {
                const quizData = {
                    templateId: 41,
                    paragraphText: paragraph,
                    fixedWordsExplanation: document.getElementById('fixedWordsExplanation').value,
                    correctWords: correctWords,
                    fixedWordsMap: fixedWordsMap,
                    indexedFixedWordsMap: indexedFixedWordsMap
                };
                
                console.log('🔍 Template 41 sending quiz data:', quizData);
                
                // Store in localStorage for popup
                localStorage.setItem('quizGradeSubmitted', JSON.stringify(quizData));
                localStorage.setItem('quizGradeSubmittedTimestamp', Date.now().toString());
                
                // Send to parent window
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'quiz.data.ready',
                        quizData: quizData
                    }, '*');
                }
            }
            
            
            renderParagraph();
        })();
    </script>
</body>
</html>`; 
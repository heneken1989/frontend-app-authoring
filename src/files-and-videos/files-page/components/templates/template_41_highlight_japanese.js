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
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
            line-height: 2.0;
            position: relative;
            z-index: 1;
            white-space: nowrap;
            overflow-x: auto;
            min-height: 4.0rem;
            text-align: center;
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
            background-color: #ecf3ec;
            color: #2e7d32;
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            border-radius: 2px;
            font-weight: normal;
            margin: 0 2px;
            border: 1px solid #c5e0c5;
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            box-sizing: border-box;
            text-decoration: none;
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
            background-color: #f9ecec;
            color: #b40000;
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            border-radius: 2px;
            font-weight: normal;
            margin: 0 2px;
            border: 1px solid #ebccd1;
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            box-sizing: border-box;
            text-decoration: none;
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
            background-color: #f9ecec;
            color: #b40000;
            padding: 1.2em 0.3rem 0.1em 0.3rem;
            border-radius: 2px;
            font-weight: normal;
            margin: 0 2px;
            border: 1px solid #ebccd1;
            vertical-align: baseline;
            line-height: 1;
            position: relative;
            box-sizing: border-box;
            text-decoration: none;
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
        /* Furigana styling - Force above kanji */
        ruby { 
            font-size: 1.2rem !important;
            display: inline;
            line-height: 1;
            vertical-align: baseline;
            position: relative;
        }
        rt { 
            font-size: 0.5rem !important; 
            color: #666;
            line-height: 1;
            display: block;
            text-align: center;
            position: absolute;
            top: -0.8em;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 5;
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
                
                // If no correctWords found, try to create some test data
                if (correctWords.length === 0) {
                    console.warn('[DEBUG] No correctWords found! This might be the issue.');
                    console.log('[DEBUG] Template variable FIXED_WORDS_EXPLANATION:', '{{FIXED_WORDS_EXPLANATION}}');
                    
                    // For testing purposes, let's try to add some test words
                    // This is just for debugging - remove in production
                    const testWords = ['あたらしいくない', 'じてんしゃ', 'この'];
                    correctWords = testWords;
                    console.log('[DEBUG] Using test words:', correctWords);
                } else {
                    // If correctWords exist but don't match paragraph, use paragraph words for testing
                    console.log('[DEBUG] correctWords exist but may not match paragraph');
                    console.log('[DEBUG] correctWords:', correctWords);
                    
                    // We'll handle this dynamically in renderParagraph based on actual paragraph content
                    console.log('[DEBUG] Will use dynamic paragraph words in renderParagraph');
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
                // Split on both standard and full-width spaces
                return text.split(/[\u0020\u3000]+/).filter(Boolean);
            }

            function renderParagraph() {
                const words = splitWords(paragraph);
                const container = document.getElementById('quiz-paragraph');
                container.innerHTML = '';
                
                console.log('[DEBUG] renderParagraph called, showAnswer:', showAnswer);
                console.log('[DEBUG] selectedWords:', selectedWords);
                console.log('[DEBUG] correctWords:', correctWords);
                
                // First, identify which words should be highlighted for answers
                const highlightedWords = {};
                const wordCounts = {};
                
                if (showAnswer) {
                    // If correctWords is empty or doesn't match current paragraph, use paragraph words
                    if (correctWords.length === 0 || !words.some(word => correctWords.includes(normalize(word)))) {
                        console.log('[DEBUG] correctWords does not match current paragraph, using paragraph words');
                        // Use all words from paragraph as correct words for testing
                        correctWords = words.map(word => normalize(word));
                        console.log('[DEBUG] New correctWords from paragraph:', correctWords);
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
                    
                    console.log('[DEBUG] highlightedWords:', highlightedWords);
                }
                
                // Reset word counts for rendering
                const renderWordCounts = {};
                
                words.forEach((word, idx) => {
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
                        
                        // Debug: Log all relevant information
                        console.log('[DEBUG] Word at idx', idx, ':', word, 'norm:', norm);
                        console.log('[DEBUG] highlightedWords[idx]:', highlightedWords[idx]);
                        console.log('[DEBUG] selectedWords.includes(idx):', selectedWords.includes(idx));
                        console.log('[DEBUG] showAnswer:', showAnswer);
                        
                        // Check if this word is a correct answer (regardless of user selection)
                        if (correctWords.includes(norm)) {
                            console.log('[DEBUG] Processing correct word at idx', idx, ':', word);
                            
                            // Get the correct answer
                            let correctAnswer = word;
                            if (indexedFixedWordsMap[norm] && indexedFixedWordsMap[norm][renderWordCounts[norm]] !== undefined) {
                                correctAnswer = indexedFixedWordsMap[norm][renderWordCounts[norm]];
                            } else if (fixedWordsMap[norm]) {
                                correctAnswer = fixedWordsMap[norm];
                            }
                            
                            // Apply furigana to correct answer too
                            const correctAnswerWithFurigana = convertFurigana(correctAnswer);
                            
                            console.log('[DEBUG] Correct answer for', word, ':', correctAnswer);
                            console.log('[DEBUG] Selected words includes idx', idx, ':', selectedWords.includes(idx));
                            
                            // Apply styling based on user's selection
                            if (selectedWords.includes(idx)) {
                                // User selected correctly - show in green
                                console.log('[DEBUG] Applying student-correct styling');
                                span.classList.remove('selected', 'wrong');
                                span.classList.add('student-correct');
                                if (hasFurigana) {
                                    span.classList.add('with-furigana');
                                } else {
                                    span.classList.add('no-furigana');
                                }
                                span.innerHTML = wordWithFurigana + ' <span class="correct-answer">(' + correctAnswerWithFurigana + ')</span>';
                            } else {
                                // User missed this word - show correct word in green with correct answer
                                console.log('[DEBUG] Applying student-correct styling for missed word');
                                span.classList.remove('selected', 'wrong');
                                span.classList.add('student-correct');
                                if (hasFurigana) {
                                    span.classList.add('with-furigana');
                                } else {
                                    span.classList.add('no-furigana');
                                }
                                span.innerHTML = wordWithFurigana + ' <span class="correct-answer">(' + correctAnswerWithFurigana + ')</span>';
                            }
                            
                            // Increment the count for this word after processing
                            renderWordCounts[norm]++;
                        } else if (selectedWords.includes(idx)) {
                            // User selected incorrectly - show in red
                            console.log('[DEBUG] Applying student-incorrect styling for', word);
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
                            console.log('[DEBUG] Normal word, no styling applied');
                            span.innerHTML = wordWithFurigana;
                        }
                    } else {
                        // Normal mode - check for wrong selections and apply styling
                        if (selectedWords.includes(idx)) {
                            const norm = normalize(word);
                            if (!correctWords.includes(norm)) {
                                span.classList.add('wrong');
                            }
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
                const startTimeElement = document.getElementById('start-time');
                const endTimeElement = document.getElementById('end-time');
                const playerStatus = document.getElementById('player-status');
                
                const startTime = parseFloat(startTimeElement.textContent) || 0;
                let endTime = parseFloat(endTimeElement.textContent) || 0;
                let isPlaying = false;
                let isTransitioning = false; // Flag to prevent multiple transitions
                let countdownInterval = null; // Store countdown interval reference
                
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
                    // Clear any existing countdown interval
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
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
                            // Auto-play when countdown reaches 0
                            playAudio();
                        }
                    }, 1000);
                }
                
                // Play audio function
                function playAudio() {
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
                    if (audioElement.duration) {
                        // Calculate relative to the start/end times
                        const currentRelative = audioElement.currentTime - startTime;
                        const durationRelative = (endTime > 0 ? endTime : audioElement.duration) - startTime;
                        
                        // Don't update if already completed
                        if (playerStatus.textContent === 'Current Status: Completed') {
                            return;
                        }
                        
                        // Update progress bar width
                        const progressPercent = Math.min(100, Math.max(0, (currentRelative / durationRelative) * 100));
                        progressBar.style.width = progressPercent + '%';
                    }
                    
                    // Check if we've reached the end time
                    if (endTime > 0 && audioElement.currentTime >= endTime && !isTransitioning) {
                        isTransitioning = true; // Prevent multiple transitions
                        audioElement.pause();
                        audioElement.currentTime = startTime;
                        isPlaying = false;
                        playerStatus.textContent = 'Current Status: Completed';
                        isTransitioning = false; // Reset flag
                        
                        // Force update status to ensure it's set correctly
                        setTimeout(() => {
                            if (playerStatus.textContent !== 'Current Status: Completed') {
                                playerStatus.textContent = 'Current Status: Completed';
                            }
                        }, 50);
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
                            countdownInterval = setInterval(function() {
                                countdown--;
                                if (countdown > 0) {
                                    playerStatus.textContent = 'Current Status: Starting in ' + countdown + 's...';
                                } else {
                                    clearInterval(countdownInterval);
                                    countdownInterval = null;
                                    // Auto-play when countdown reaches 0
                                    playAudio();
                                }
                            }, 1000);
                        } else {
                            // Resume immediately from current position
                            playAudio();
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
                
                // Auto-start countdown when page loads (fallback if loadedmetadata doesn't fire)
                setTimeout(() => {
                    if (!isPlaying && audioElement.duration) {
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
                    // Clear any existing countdown interval
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                    
                    // Reset to start time
                    audioElement.currentTime = startTime;
                    isTransitioning = false; // Reset transition flag
                    
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
                            playAudio();
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
                        
                        audioElement.currentTime = startTime;
                        playerStatus.textContent = 'Current Status: Starting in 3s...';
                        // Restart countdown after reset
                        setTimeout(() => {
                            initializePlayer();
                        }, 100);
                        audioElement.pause();
                    },
                    getTimeRange: () => {
                        return { startTime: startTime, endTime: endTime };
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
                console.log('[DEBUG] getGrade called');
                console.log('[DEBUG] Current showAnswer:', showAnswer);
                console.log('[DEBUG] Current selectedWords:', selectedWords);
                console.log('[DEBUG] correctWords:', correctWords);
                
                const answerContainer = document.getElementById('answer-paragraph-container');
                const answerParagraph = document.getElementById('answer-paragraph');
                const showFlag = document.getElementById('showAnswerFlag');
                
                const isVisible = answerContainer.style.display === 'block';
                console.log('[DEBUG] isVisible:', isVisible);
                
                if (isVisible) {
                    // Hide answers - use resetQuiz for complete reset
                    console.log('[DEBUG] Hiding answers - calling resetQuiz');
                    resetQuiz();
                    
                } else {
                    // Check if we need to show wrong selections first
                    const hasWrongSelections = selectedWords.some(idx => {
                        const words = splitWords(paragraph);
                        const word = words[idx];
                        const norm = normalize(word);
                        return !correctWords.includes(norm);
                    });
                    
                    console.log('[DEBUG] hasWrongSelections:', hasWrongSelections, 'showAnswer:', showAnswer);
                    
                    if (hasWrongSelections) {
                        // First check - show both wrong selections and correct answers
                        console.log('[DEBUG] First check - showing wrong selections and correct answers');
                        
                        // First render paragraph to show correct answers
                        showAnswer = true;
                        renderParagraph();
                        
                        // Then apply wrong styling to incorrect selections
                        const words = splitWords(paragraph);
                        console.log('[DEBUG] All words:', words);
                        console.log('[DEBUG] Selected words indices:', selectedWords);
                        console.log('[DEBUG] Correct words:', correctWords);
                        
                        // Find all span elements and mark wrong ones
                        const spans = document.querySelectorAll('.quiz-word');
                        console.log('[DEBUG] Found spans:', spans.length);
                        
                        spans.forEach((span, spanIdx) => {
                            if (selectedWords.includes(spanIdx)) {
                                const word = words[spanIdx];
                                const norm = normalize(word);
                                console.log('[DEBUG] Checking span', spanIdx, 'word:', word, 'normalized:', norm);
                                
                                if (!correctWords.includes(norm)) {
                                    console.log('[DEBUG] Marking word as wrong:', word, 'at span index:', spanIdx);
                                    
                                    // Remove any existing styling classes
                                    span.classList.remove('student-correct', 'student-incorrect', 'student-missed');
                                    span.classList.add('wrong');
                                    
                                    // Apply wrong styling directly
                                    span.style.backgroundColor = '#f9ecec';
                                    span.style.color = '#b40000';
                                    span.style.border = '0.5px solid #b40000';
                                    
                                    console.log('[DEBUG] Added wrong class to span:', span);
                                    console.log('[DEBUG] Span classes after:', span.className);
                                    console.log('[DEBUG] Span styles after:', span.style.cssText);
                                } else {
                                    console.log('[DEBUG] Word is correct:', word);
                                }
                            }
                        });
                        
                        showFlag.value = 'true';
                        
                        // Pause the audio
                        if (audioPlayer) {
                            audioPlayer.pauseCountdown();
                        }
                    } else {
                        // Second check - show full answers
                        console.log('[DEBUG] Second check - showing full answers');
                        showAnswer = true;
                        renderParagraph();
                        showFlag.value = 'true';
                        
                        // Pause the audio
                        if (audioPlayer) {
                            audioPlayer.pauseCountdown();
                        }
                    }
                }
                // Still return grade info to EdX
                const result = grade();
                console.log('[DEBUG] Grade result:', result);
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
            
            renderParagraph();
        })();
    </script>
</body>
</html>`; 
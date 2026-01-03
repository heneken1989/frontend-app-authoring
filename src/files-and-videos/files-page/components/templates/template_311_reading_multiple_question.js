export const readingMultipleQuestionTemplate311 = `<!DOCTYPE html>
<html>
<head>
    <title>Reading Multiple Question Quiz ID311</title>
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
            line-height: 1.2;
            color: #414141;
            height: 100vh;
            overflow-y: hidden;
            overflow-x: hidden;
            background-color: #fff;
            width: 100%;
        }
        .container {
            display: grid;
            grid-template-columns: 45% 55%;
            height: 100%;
            padding: 0;
            margin: 0;
            gap: 20px;
            box-sizing: border-box;
            background-color: #fff;
            max-width: 100%;
            overflow-x: hidden;
        }
        .left-container {
            display: flex;
            flex-direction: column;
            overflow-y: hidden;
            overflow-x: hidden;
            padding: 0;
            margin: 0;
            gap: 0;
            background-color: #fff;
            width: 100%;
            height: 100%;
        }
        .right-container {
            display: flex;
            flex-direction: column;
            overflow-y: hidden;
            overflow-x: visible;
            padding-left: 15px;
            padding-right: 15px;
            padding-top: 5px;
            background-color: #fff;
            width: 100%;
            gap: 0;
            box-sizing: border-box;
        }
        .right-container form {
            display: flex;
            flex-direction: column;
            gap: 0;
            margin: 0;
            padding: 0;
            height: 100%;
            overflow-y: hidden;
        }
        .reading-text-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            flex-grow: 1;
            padding: 0;
            margin: 0;
            background-color: #fff;
            box-sizing: border-box;
            width: 100%;
        }
        .images-container-right {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin: 0;
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            border: none;
            padding: 0;
            background-color: #fff;
            max-height: 45vh;
            flex-shrink: 0;
        }
        .images-container-right:empty {
            display: none;
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
            padding: 5px 10px;
            background-color: #fff;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: keep-all;
            flex-shrink: 0;
            box-sizing: border-box;
            letter-spacing: 0.3px;
        }
        .instructions:before {
            display: none;
        }
        .content-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            flex-grow: 1;
            padding: 0;
            margin: 0;
            gap: 0;
            background-color: #fff;
        }
        .images-container {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin: 0;
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            border: none;
            padding: 0;
            background-color: #fff;
            flex: 1;
            max-height: 100%;
            height: 100%;
            min-height: 0;
        }
        .images-container:empty {
            display: none;
        }
        .image-item {
            width: 100%;
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow: visible;
            flex: 0 0 auto;
            min-height: 0;
        }
        .images-container-right .image-item {
            max-height: 45vh !important;
            flex: 0 0 auto;
            width: 100%;
            max-width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
        }
        .image-item img {
            max-width: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: block;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: auto;
            -ms-interpolation-mode: nearest-neighbor;
        }
        .images-container-right .image-item img {
            max-width: 100% !important;
            max-height: 45vh !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: crisp-edges !important;
            image-rendering: auto !important;
            -ms-interpolation-mode: nearest-neighbor !important;
        }
        .paragraph-text {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal;
            font-style: italic;
            padding: 0;
            margin: 0;
            color: #333;
            background-color: #fff;
            border: none;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
            width: 100%;
            max-width: 100%;
            line-height: 1.2;
        }
        .reading-text {
            font-size: 1.2rem;
            padding: 0;
            margin: 0;
            margin-top: -2.5rem;
            color: #333;
            background-color: #fff;
            border: none;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: keep-all;
            width: 100%;
            max-width: 100%;
            line-height: 1.8;
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
            box-sizing: border-box;
        }
        .reading-text * {
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .reading-text * {
            overflow: visible !important;
        }
        .reading-text .custom-dropdown {
            vertical-align: middle;
            display: inline-block;
        }
        .reading-text ruby {
            overflow: visible !important;
            margin: 0 0.2em;
        }
        .reading-text rt {
            font-size: 0.5em;
        }
        .answer-item {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 2.1;
            text-align: left;
            margin: 0 0 0 0;
            padding: 0;
            color: #333;
            display: block;
            letter-spacing: 0.4px;
        }
        .answer-item .custom-dropdown {
            vertical-align: middle;
            display: inline-block;
        }
        .custom-dropdown {
            position: relative;
            display: inline-block;
            min-width: 100px;
            max-width: 250px;
            width: auto;
            z-index: 1;
            margin: 0 2px;
            vertical-align: middle;
            flex-shrink: 0;
        }
        .dropdown-text-spacer {
            display: inline-block;
            min-width: 0.7em;
            width: 0.7em;
            height: 0;
            vertical-align: baseline;
            flex-shrink: 0;
            white-space: pre;
        }
        /* Ensure text after dropdown has space and can wrap */
        .custom-dropdown + .dropdown-text-spacer + *,
        .custom-dropdown + .dropdown-text-spacer {
            word-break: keep-all;
            overflow-wrap: break-word;
        }
        .custom-dropdown.open {
            z-index: 1000;
        }
        .dropdown-button {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; 
            font-size: 1.2rem !important; 
            font-weight: normal !important; 
            line-height: 1.2 !important; 
            text-align: left !important; 
            width: auto !important; 
            min-width: 120px !important; 
            max-width: 250px !important;
            height: 40px !important;
            min-height: 40px !important;
            border: 1px solid #666 !important; 
            border-radius: 4px !important; 
            background-color: white !important; 
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
            background-repeat: no-repeat !important;
            background-position: right 16px center !important;
            background-size: 18px !important;
            color: #333 !important; 
            cursor: pointer !important; 
            display: inline-flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding: 0 50px 0 16px !important; 
            transition: all 0.3s ease !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            outline: none !important;
            letter-spacing: 0.4px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        .dropdown-button:hover {
            background-color: #0075b4;
            border-color: #0075b4;
            color: white;
        }
        .dropdown-options {
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 100%;
            width: auto;
            background: white;
            border: 1px solid #666;
            border-top: none;
            border-radius: 0 0 4px 4px;
            z-index: 1000;
            display: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .dropdown-options.show {
            display: block;
        }
        .dropdown-options.show-up {
            display: block;
            top: auto;
            bottom: 100%;
            border-top: 1px solid #666;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        }
        .dropdown-options.show-center {
            display: block;
            top: 50%;
            transform: translateY(-50%);
            border-top: 1px solid #666;
            border-bottom: 1px solid #666;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .dropdown-option {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.2;
            text-align: left;
            color: #333;
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            min-height: 40px;
            display: flex;
            align-items: center;
            letter-spacing: 0.4px;
            white-space: nowrap;
            min-width: max-content;
        }
        .dropdown-option:hover {
            background-color: #f5f5f5;
        }
        .dropdown-option:last-child {
            border-bottom: none;
        }
        .dropdown-button ruby, .dropdown-option ruby {
            font-size: 1em;
        }
        .dropdown-button rt, .dropdown-option rt {
            font-size: 0.6em;
            color: #666;
        }
        .answer-replacement {
            display: inline-block;
        }
        .correct-answer { 
            font-family: 'Kyokashotai', 'Kosugi Maru', 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.2;
            text-align: left;
            color: #fff; 
            padding: 4px 8px; 
            border-radius: 4px; 
            background-color: #4caf50; 
            display: inline-block; 
            margin: 2px;
            letter-spacing: 0.4px;
        }
        .correct-answer rt { 
            color: #fff !important; 
        }
        .wrong-answer { 
            font-family: 'Kyokashotai', 'Kosugi Maru', 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.2;
            text-align: left;
            color: #fff; 
            padding: 4px 8px; 
            border-radius: 4px; 
            background-color: #f44336; 
            display: inline-block; 
            margin: 2px;
            letter-spacing: 0.4px;
        }
        .wrong-answer rt { color: #fff !important; }
        .no-answer { 
            font-family: 'Kyokashotai', 'Kosugi Maru', 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: normal;
            line-height: 1.2;
            text-align: left;
            color: #666; 
            border-bottom: 2px solid #666; 
            padding: 0 4px; 
            margin: 0 2px;
            letter-spacing: 0.4px;
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
            max-height: 460px;
            overflow-y: auto;
        }
        .answer-paragraph-inner {
            max-width: 90%;
            margin: 0 auto;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            max-height: 400px;
            overflow-y: auto;
            padding: 1.5rem;
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
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.8;
            text-align: left;
            margin-bottom: 1rem;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: keep-all;
            padding: 12px;
            width: 100%;
            box-sizing: border-box;
        }
        .transcript-text ruby {
            display: inline;
            white-space: nowrap;
        }
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                height: auto;
            }
            .left-container, .right-container {
                padding: 10px;
                overflow-y: visible;
            }
            .right-container {
                border-left: none;
            }
            .custom-dropdown {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-container">
            <div class="instructions" id="quiz-instructions">
                {{INSTRUCTIONS}}
            </div>
            <div class="content-container">
                <div class="images-container">
                    <!-- Images with .1. in filename will be inserted here -->
                    {{IMAGES_LEFT}}
                </div>
            </div>
        </div>
        
        <div class="right-container">
            <form id="quizForm" onsubmit="return false;">
                <div class="images-container-right">
                    <!-- Images with .2. in filename will be inserted here -->
                    {{IMAGES_RIGHT}}
                </div>
                {{PARAGRAPH_TEXT_CONTAINER}}
                <div class="reading-text-container">
                    <div class="reading-text">
                        {{READING_TEXT_WITH_DROPDOWNS}}
                    </div>
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
                <div style="display: none;">
                    <span id="script-text-hidden">{{EXPLANATION_TEXT}}</span>
                </div>
            </form>
        </div>
        
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div class="transcript-section">
                    <div class="transcript-title">スクリプト</div>
                    <div id="transcript-paragraph" class="transcript-text">{{EXPLANATION_TEXT}}</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Initialize global state
        window.quizState = {
            answers: {},
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
        window.selectedAnswers = {};
        var originalReadingTextHTML = ''; // Store original HTML of reading-text container

        // Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
        function convertFurigana(text) {
            if (!text || typeof text !== "string") return text;
            
            // Chỉ Kanji (và vài ký tự đặc biệt)
            const kanjiWord = "[\\u4E00-\\u9FFF々〆〤ヶ]+";
            
            // Dấu ngoặc Nhật (全角)
            const reJaParens = new RegExp("(" + kanjiWord + ")（([^）]+)）", "g");
            text = text.replace(reJaParens, function(match, p1, p2) {
                return "<ruby>" + p1 + "<rt>" + p2 + "</rt></ruby>";
            });
            
            // Dấu ngoặc ASCII (半角)
            const reAsciiParens = new RegExp("(" + kanjiWord + ")\\(([^)]+)\\)", "g");
            text = text.replace(reAsciiParens, function(match, p1, p2) {
                return "<ruby>" + p1 + "<rt>" + p2 + "</rt></ruby>";
            });
            return text;
        }

        (function() {
            const correctAnswers = JSON.parse('{{CORRECT_ANSWERS}}');

            function calculateResults() {
                let correctCount = 0;
                const totalDropdowns = correctAnswers.length;
                const dropdowns = document.querySelectorAll('.custom-dropdown');
                
                for (let i = 0; i < dropdowns.length; i++) {
                    const dropdown = dropdowns[i];
                    const blankNumber = dropdown.getAttribute('data-blank-number');
                    const button = dropdown.querySelector('.dropdown-button');
                    const userAnswer = button ? button.getAttribute('data-value') || '' : '';
                    const correctAnswer = correctAnswers[parseInt(blankNumber) - 1] || '';
                    
                    window.selectedAnswers[blankNumber] = userAnswer;
                    const isCorrect = userAnswer === correctAnswer;
                    if (isCorrect) correctCount++;
                }
                
                const rawScore = totalDropdowns > 0 ? correctCount / totalDropdowns : 0;
                const message = 'Score: ' + correctCount + '/' + totalDropdowns;

                window.quizState.answers = JSON.stringify(window.selectedAnswers);
                window.quizState.score = rawScore;
                window.quizState.attempts += 1;

                return {
                    rawScore,
                    message,
                    correctCount,
                    totalQuestions: totalDropdowns
                };
            }

            function updateDisplay(result) {
                const shouldShowAnswer = window.quizState.showAnswer;
                if (shouldShowAnswer) {
                    // Replace dropdowns with text display (like template 18)
                    const dropdowns = document.querySelectorAll('.custom-dropdown');
                    for (let i = 0; i < dropdowns.length; i++) {
                        const dropdown = dropdowns[i];
                        const blankNumber = dropdown.getAttribute('data-blank-number');
                        const button = dropdown.querySelector('.dropdown-button');
                        // Get userAnswer from selectedAnswers (text value, like template 18)
                        const userAnswer = window.selectedAnswers[blankNumber] || '';
                        // Get correctAnswer from dropdown data-correct attribute (like template 18)
                        const correctAnswer = dropdown.getAttribute('data-correct') || '';
                        const isCorrect = correctAnswer === userAnswer;
                        
                        // Preserve whitespace after dropdown (nextSibling text node)
                        const nextSibling = dropdown.nextSibling;
                        const whitespaceAfter = (nextSibling && nextSibling.nodeType === 3) ? nextSibling.textContent : '';
                        
                        const replacementSpan = document.createElement('span');
                        replacementSpan.className = 'answer-replacement';
                        
                        // Get HTML from dropdown options (like template 18 - options already have furigana)
                        let userAnswerHtml = '';
                        let correctAnswerHtml = '';
                        
                        const options = dropdown.querySelectorAll('.dropdown-option');
                        for (let j = 0; j < options.length; j++) {
                            const optionValue = options[j].getAttribute('data-value');
                            if (optionValue === userAnswer) {
                                userAnswerHtml = options[j].innerHTML;
                            }
                            if (optionValue === correctAnswer) {
                                correctAnswerHtml = options[j].innerHTML;
                            }
                        }
                        
                        // Fallback: if not found, use text directly (should not happen)
                        if (!userAnswerHtml && userAnswer) {
                            userAnswerHtml = userAnswer;
                        }
                        if (!correctAnswerHtml && correctAnswer) {
                            correctAnswerHtml = correctAnswer;
                        }
                        
                        if (userAnswer) {
                            if (isCorrect) {
                                replacementSpan.innerHTML = '<span class="correct-answer">' + correctAnswerHtml + '</span>';
                            } else {
                                replacementSpan.innerHTML = '<span class="wrong-answer">' + userAnswerHtml + '</span> <span class="correct-answer">' + correctAnswerHtml + '</span>';
                            }
                        } else {
                            replacementSpan.innerHTML = '<span class="wrong-answer">*</span> <span class="correct-answer">' + correctAnswerHtml + '</span>';
                        }
                        
                        // Replace the dropdown with the text display
                        dropdown.parentNode.replaceChild(replacementSpan, dropdown);
                        
                        // Restore whitespace after replacement if it existed
                        if (whitespaceAfter && replacementSpan.nextSibling && replacementSpan.nextSibling.nodeType === 3) {
                            // Whitespace already exists, keep it
                        } else if (whitespaceAfter) {
                            // Add whitespace text node after replacement
                            replacementSpan.parentNode.insertBefore(document.createTextNode(whitespaceAfter), replacementSpan.nextSibling);
                        }
                    }
                }
                
                const answerContainer = document.getElementById('answer-paragraph-container');
                // Always hide answer container - no toggle needed
                answerContainer.style.display = 'none';
            }
            
            // Store original HTML of reading-text container when page loads
            setTimeout(function() {
                var readingTextContainer = document.querySelector('.reading-text');
                if (readingTextContainer) {
                    originalReadingTextHTML = readingTextContainer.innerHTML;
                    console.log('✅ Stored original reading-text HTML');
                }
            }, 100);
            
            // Handle custom dropdowns (like template 18)
            function initializeDropdowns() {
                var dropdowns = document.querySelectorAll('.custom-dropdown');
                console.log('🔍 Initializing ' + dropdowns.length + ' dropdowns');
                
                for (var j = 0; j < dropdowns.length; j++) {
                    var dropdown = dropdowns[j];
                    var button = dropdown.querySelector('.dropdown-button');
                    var options = dropdown.querySelectorAll('.dropdown-option');
                    
                    if (!button) {
                        console.log('⚠️ Dropdown ' + (j + 1) + ' has no button');
                        continue;
                    }
                    
                    // Store original width of dropdown button for later calculation
                    var originalButtonWidth = button.offsetWidth || 120;
                    dropdown.setAttribute('data-original-width', originalButtonWidth);
                    
                    // Remove existing event listeners by cloning and replacing
                    // This prevents duplicate event listeners
                    var newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    button = newButton;
                    
                    // Toggle dropdown
                    button.addEventListener('click', function() {
                        var isOpen = this.parentNode.querySelector('.dropdown-options').classList.contains('show') || 
                                     this.parentNode.querySelector('.dropdown-options').classList.contains('show-up') ||
                                     this.parentNode.querySelector('.dropdown-options').classList.contains('show-center');
                        // Close all other dropdowns
                        document.querySelectorAll('.dropdown-options').forEach(function(opt) {
                            opt.classList.remove('show', 'show-up', 'show-center');
                        });
                        document.querySelectorAll('.custom-dropdown').forEach(function(dropdown) {
                            dropdown.classList.remove('open');
                        });
                        // Toggle current dropdown
                        if (!isOpen) {
                            var dropdownOptions = this.parentNode.querySelector('.dropdown-options');
                            
                            // First, show dropdown temporarily to measure its height
                            dropdownOptions.style.display = 'block';
                            dropdownOptions.style.visibility = 'hidden';
                            
                            // Auto-adjust dropdown width based on content
                            var maxWidth = 0;
                            var options = dropdownOptions.querySelectorAll('.dropdown-option');
                            for (var i = 0; i < options.length; i++) {
                                var tempSpan = document.createElement('span');
                                tempSpan.style.visibility = 'hidden';
                                tempSpan.style.position = 'absolute';
                                tempSpan.style.fontSize = '1.2rem';
                                tempSpan.style.fontFamily = 'Noto Serif JP, Noto Sans JP, Kosugi Maru, Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif';
                                tempSpan.style.fontWeight = 'normal';
                                tempSpan.style.letterSpacing = '0.4px';
                                tempSpan.style.padding = '0';
                                tempSpan.style.margin = '0';
                                tempSpan.style.border = 'none';
                                tempSpan.style.whiteSpace = 'nowrap';
                                tempSpan.innerHTML = options[i].innerHTML;
                                document.body.appendChild(tempSpan);
                                
                                var textWidth = tempSpan.offsetWidth;
                                document.body.removeChild(tempSpan);
                                
                                // Add padding for option (12px left + 16px right = 28px total)
                                var optionWidth = textWidth + 28;
                                
                                if (optionWidth > maxWidth) {
                                    maxWidth = optionWidth;
                                }
                            }
                            
                            // Set dropdown width to fit content (minimum button width)
                            var buttonWidth = this.offsetWidth;
                            var finalWidth = Math.max(buttonWidth, maxWidth);
                            dropdownOptions.style.width = finalWidth + 'px';
                            
                            // Reset visibility and remove inline display to let CSS classes control it
                            dropdownOptions.style.visibility = '';
                            dropdownOptions.style.display = ''; // Remove inline style to let CSS class control display
                            
                            // Always open dropdown centered on button
                            dropdownOptions.classList.add('show-center');
                            this.parentNode.classList.add('open');
                        }
                    });
                    
                    // Handle option selection
                    for (var k = 0; k < options.length; k++) {
                        options[k].addEventListener('click', function() {
                            var selectedValue = this.getAttribute('data-value');
                            var selectedText = this.innerHTML;
                            var dropdown = this.parentNode.parentNode;
                            var button = dropdown.querySelector('.dropdown-button');
                            var blankNumber = dropdown.getAttribute('data-blank-number');
                            
                            // Update button text
                            button.innerHTML = selectedText;
                            button.setAttribute('data-value', selectedValue);
                            
                            // Auto-adjust width to fit content
                            var tempSpan = document.createElement('span');
                            tempSpan.style.visibility = 'hidden';
                            tempSpan.style.position = 'absolute';
                            tempSpan.style.fontSize = '1.2rem';
                            tempSpan.style.fontFamily = 'Noto Serif JP, Noto Sans JP, Kosugi Maru, Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif';
                            tempSpan.style.fontWeight = 'normal';
                            tempSpan.style.letterSpacing = '0.4px';
                            tempSpan.style.padding = '0';
                            tempSpan.style.margin = '0';
                            tempSpan.style.border = 'none';
                            tempSpan.style.whiteSpace = 'nowrap';
                            tempSpan.innerHTML = selectedText;
                            document.body.appendChild(tempSpan);
                            
                            var textWidth = tempSpan.offsetWidth;
                            document.body.removeChild(tempSpan);
                            
                            // Set width to fit content (add padding: 16px left + 50px right = 66px total)
                            // Limit max width to prevent covering next text
                            // Use a more conservative max width to ensure text after is not covered
                            var newWidth = Math.min(250, Math.max(120, textWidth + 66));
                            button.style.width = newWidth + 'px';
                            button.style.maxWidth = '250px';
                            // Also update the dropdown container width
                            dropdown.style.width = newWidth + 'px';
                            dropdown.style.maxWidth = '250px';
                            
                            // Ensure spacer after dropdown has enough space
                            var spacer = dropdown.nextElementSibling;
                            if (spacer && spacer.classList.contains('dropdown-text-spacer')) {
                                // Get original width from data attribute, fallback to 120 if not set
                                var originalWidth = parseInt(dropdown.getAttribute('data-original-width')) || 120;
                                var expansion = newWidth - originalWidth;
                                
                                // Calculate spacer width: base 0.7em + proportional expansion with buffer
                                // Convert pixel expansion to em (assuming 1em ≈ 16px for 1.2rem font)
                                var expansionEm = expansion / 16;
                                // Base spacer is 0.7em, add expansion with small buffer to ensure no text is covered
                                var calculatedSpacer = 0.7 + Math.min(expansionEm + 0.1, 1.1); // Add 0.1em buffer, max additional 1.1em
                                var spacerWidth = calculatedSpacer + 'em';
                                
                                spacer.style.minWidth = spacerWidth;
                                spacer.style.width = spacerWidth;
                            }
                            
                            // Close dropdown
                            this.parentNode.classList.remove('show', 'show-up', 'show-center');
                            this.parentNode.parentNode.classList.remove('open');
                            
                            // Update selected answers
                            window.selectedAnswers[blankNumber] = selectedValue;
                            
                            if (window.quizState.showAnswer) {
                                var result = calculateResults();
                                updateDisplay(result);
                            }
                        });
                    }
                }
            }
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.custom-dropdown')) {
                    document.querySelectorAll('.dropdown-options').forEach(function(opt) {
                        opt.classList.remove('show', 'show-up', 'show-center');
                    });
                    document.querySelectorAll('.custom-dropdown').forEach(function(dropdown) {
                        dropdown.classList.remove('open');
                    });
                }
            });
            
            // Initialize dropdowns on page load
            initializeDropdowns();

            // Function to adjust image container scroll based on image height
            function adjustImageContainerScroll() {
                var imagesContainer = document.querySelector('.images-container');
                if (!imagesContainer) return;
                
                var containerHeight = imagesContainer.clientHeight;
                var imageItemElements = imagesContainer.querySelectorAll('.image-item');
                
                if (imageItemElements.length === 0) return;
                
                var totalImageHeight = 0;
                var allImagesLoaded = true;
                
                imageItemElements.forEach(function(imageItem) {
                    var img = imageItem.querySelector('img');
                    if (!img) return;
                    
                    // Wait for image to load if not already loaded
                    if (img.complete && img.naturalHeight > 0) {
                        // Use actual rendered height of image-item (includes gap)
                        totalImageHeight += imageItem.offsetHeight;
                    } else {
                        allImagesLoaded = false;
                        img.addEventListener('load', function() {
                            setTimeout(function() {
                                adjustImageContainerScroll();
                            }, 50);
                        }, { once: true });
                    }
                });
                
                // Don't adjust if images are still loading
                if (!allImagesLoaded) return;
                
                // Check if total image height is more than 30% larger than container
                var threshold = containerHeight * 1.3;
                
                if (totalImageHeight > threshold) {
                    // Enable scroll - images are too large
                    imagesContainer.style.overflowY = 'auto';
                    imagesContainer.style.height = '100%';
                    // Reset image sizes to natural size
                    imageItemElements.forEach(function(imageItem) {
                        var img = imageItem.querySelector('img');
                        if (img) {
                            img.style.maxHeight = '';
                            img.style.height = '';
                            img.style.width = '';
                            img.style.objectFit = 'contain';
                        }
                    });
                } else {
                    // Disable scroll - adjust image sizes to fit container
                    imagesContainer.style.overflowY = 'hidden';
                    imagesContainer.style.height = '100%';
                    
                    // Calculate scale factor to fit all images in container
                    // Account for gap between images (3px per gap)
                    var gapCount = imageItemElements.length > 0 ? imageItemElements.length - 1 : 0;
                    var totalGapHeight = gapCount * 3;
                    var availableHeight = containerHeight - totalGapHeight;
                    var scaleFactor = availableHeight / totalImageHeight;
                    
                    // Prevent scaling too small (minimum 70% of original size to maintain quality)
                    var minScaleFactor = 0.7;
                    if (scaleFactor < minScaleFactor) {
                        // If scale factor is too small, enable scroll instead to maintain image quality
                        imagesContainer.style.overflowY = 'auto';
                        imagesContainer.style.height = '100%';
                        // Reset image sizes to natural size
                        imageItemElements.forEach(function(imageItem) {
                            var img = imageItem.querySelector('img');
                            if (img) {
                                img.style.maxHeight = '';
                                img.style.height = '';
                                img.style.width = '';
                                img.style.objectFit = 'contain';
                            }
                        });
                        return;
                    }
                    
                    imageItemElements.forEach(function(imageItem) {
                        var img = imageItem.querySelector('img');
                        if (img && img.complete && img.naturalHeight > 0) {
                            // Get current rendered height of image-item
                            var currentItemHeight = imageItem.offsetHeight;
                            // Calculate new height for image-item based on scale factor
                            var newItemHeight = currentItemHeight * scaleFactor;
                            
                            // Set max-height on image to fit within scaled item height
                            // Account for any padding/margin in image-item
                            img.style.maxHeight = newItemHeight + 'px';
                            img.style.height = 'auto';
                            img.style.width = 'auto';
                            img.style.objectFit = 'contain';
                            // Ensure high quality rendering
                            img.style.imageRendering = 'auto';
                            img.style.imageRendering = '-webkit-optimize-contrast';
                        }
                    });
                }
            }
            
            // Adjust scroll on page load and when images load
            setTimeout(function() {
                adjustImageContainerScroll();
            }, 100);
            
            // Also adjust when window is resized
            window.addEventListener('resize', function() {
                setTimeout(function() {
                    adjustImageContainerScroll();
                }, 100);
            });

            // Function to encode script text for safe transmission (like template 67)
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

            function getGrade() {
                console.log('🎯 getGrade() called - Processing quiz submission');
                
                const result = calculateResults();
                
                // Always show answers (no toggle) - but don't show answer container
                window.quizState.showAnswer = true;
                document.getElementById('showAnswerFlag').value = 'true';
                
                updateDisplay(result);
                console.log('📊 Quiz results:', result);
                
                // Send quiz data to parent for ShowScript button (like template 67)
                try {
                    // Get script text from the template - use innerHTML to preserve HTML tags
                    const scriptTextElement = document.getElementById('script-text-hidden');
                    const scriptText = scriptTextElement ? scriptTextElement.innerHTML : '';
                    
                    // Encode script text to handle special characters (like template 67)
                    const encodedScriptText = encodeScriptText(scriptText);
                    
                    const quizData = {
                        templateId: 311,
                        scriptText: encodedScriptText
                    };
                    
                    // Send message to parent to show ShowScript button (like template 67)
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'quiz.data.ready',
                            quizData: quizData
                        }, '*');
                    }
                } catch (error) {
                    console.error('Error sending quiz data to parent:', error);
                }
                
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
                return JSON.stringify(window.quizState);
            }

            function setState(stateStr) {
                try {
                    const newState = JSON.parse(stateStr);
                    window.quizState = {
                        answers: newState.answers || '{}',
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
                    };
                    
                    if (window.quizState.answers && typeof window.quizState.answers === 'string') {
                        try {
                            window.selectedAnswers = JSON.parse(window.quizState.answers);
                            
                            // Restore selected state for dropdowns
                            const dropdowns = document.querySelectorAll('.custom-dropdown');
                            for (let i = 0; i < dropdowns.length; i++) {
                                const dropdown = dropdowns[i];
                                const blankNumber = dropdown.getAttribute('data-blank-number');
                                const selectedValue = window.selectedAnswers[blankNumber];
                                const button = dropdown.querySelector('.dropdown-button');
                                
                                // Ensure original width is stored if not already set (for all dropdowns)
                                if (!dropdown.getAttribute('data-original-width') && button) {
                                    const originalButtonWidth = button.offsetWidth || 120;
                                    dropdown.setAttribute('data-original-width', originalButtonWidth);
                                }
                                
                                if (button && selectedValue) {
                                    // Find the option text for this value
                                    const options = dropdown.querySelectorAll('.dropdown-option');
                                    let selectedText = '';
                                    for (let j = 0; j < options.length; j++) {
                                        if (options[j].getAttribute('data-value') === selectedValue) {
                                            selectedText = options[j].innerHTML;
                                            break;
                                        }
                                    }
                                    
                                    if (selectedText) {
                                        button.innerHTML = selectedText;
                                        button.setAttribute('data-value', selectedValue);
                                        
                                        // Auto-adjust width to fit content
                                        const tempSpan = document.createElement('span');
                                        tempSpan.style.visibility = 'hidden';
                                        tempSpan.style.position = 'absolute';
                                        tempSpan.style.fontSize = button.style.fontSize || '1.2rem';
                                        tempSpan.style.fontFamily = button.style.fontFamily || 'Noto Serif JP, Noto Sans JP, Kosugi Maru, Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif';
                                        tempSpan.style.fontWeight = button.style.fontWeight || 'normal';
                                        tempSpan.style.letterSpacing = button.style.letterSpacing || '0.4px';
                                        tempSpan.innerHTML = selectedText;
                                        document.body.appendChild(tempSpan);
                                        
                                        const textWidth = tempSpan.offsetWidth;
                                        document.body.removeChild(tempSpan);
                                        
                                        // Set width to fit content (add padding for dropdown arrow)
                                        // Limit max width to prevent covering next text
                                        // Use a more conservative max width to ensure text after is not covered
                                        const newWidth = Math.min(250, Math.max(120, textWidth + 66)); // 66px for padding and arrow
                                        button.style.width = newWidth + 'px';
                                        button.style.maxWidth = '250px';
                                        // Also update the dropdown container width
                                        dropdown.style.width = newWidth + 'px';
                                        dropdown.style.maxWidth = '250px';
                                        
                                        // Ensure spacer after dropdown has enough space
                                        const spacer = dropdown.nextElementSibling;
                                        if (spacer && spacer.classList.contains('dropdown-text-spacer')) {
                                            // Get original width from data attribute, fallback to 120 if not set
                                            const originalWidth = parseInt(dropdown.getAttribute('data-original-width')) || 120;
                                            const expansion = newWidth - originalWidth;
                                            
                                            // Calculate spacer width: base 0.7em + proportional expansion with buffer
                                            // Convert pixel expansion to em (assuming 1em ≈ 16px for 1.2rem font)
                                            const expansionEm = expansion / 16;
                                            // Base spacer is 0.7em, add expansion with small buffer to ensure no text is covered
                                            const calculatedSpacer = 0.7 + Math.min(expansionEm + 0.1, 1.1); // Add 0.1em buffer, max additional 1.1em
                                            const spacerWidth = calculatedSpacer + 'em';
                                            
                                            spacer.style.minWidth = spacerWidth;
                                            spacer.style.width = spacerWidth;
                                        }
                                    }
                                }
                            }
                            const result = calculateResults();
                            updateDisplay(result);
                        } catch (e) {
                            console.error('Error parsing answers:', e);
                        }
                    }
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }

            // Listen for messages from parent (reset functionality like template 18)
            window.addEventListener('message', function(event) {
                // Handle JSChannel messages (from EdX)
                if (event.data && event.data.method === 'JSInput::getGrade') {
                    getGrade();
                    return;
                }
                
                // Process postMessage from parent window
                if (event.source !== window.parent && event.source !== window) {
                    return;
                }
                
                if (event.data && event.data.type === 'problem.check') {
                    // Reset quiz state
                    resetQuiz();
                }
                
                if (event.data && event.data.type === 'problem.submit') {
                    if (event.data.action === 'check') {
                        // Trigger quiz submission when Check button is clicked
                        getGrade();
                    } else if (event.data.action === 'reset') {
                        // Reset quiz when reset action is received
                        resetQuiz();
                    }
                }
                
                // Parent (TestNavigationBar) requests answers for saving (like template 18)
                if (event.data && event.data.type === 'quiz.get_answers') {
                    try {
                        // Build answers payload: one item per dropdown
                        var payload = [];
                        var dropdowns = document.querySelectorAll('.custom-dropdown');
                        for (var i = 0; i < dropdowns.length; i++) {
                            var dropdown = dropdowns[i];
                            var blankNumber = dropdown.getAttribute('data-blank-number');
                            var button = dropdown.querySelector('.dropdown-button');
                            var userAnswer = (button && button.getAttribute('data-value')) || '';
                            var correctAnswer = correctAnswers[parseInt(blankNumber) - 1] || '';
                            payload.push({
                                questionId: 'blank_' + blankNumber,
                                userAnswer: userAnswer,
                                correctAnswer: correctAnswer,
                                isCorrect: userAnswer === correctAnswer
                            });
                        }

                        // Respond to parent with answers array
                        window.parent.postMessage({
                            type: 'quiz.answers',
                            answers: payload
                        }, '*');
                        console.log('📤 Sent quiz.answers to parent:', payload);
                    } catch (e) {
                        console.error('❌ Failed to assemble quiz.answers payload:', e);
                    }
                }
            });
            
            // Reset quiz function - simple: restore entire reading-text HTML
            function resetQuiz() {
                console.log('🔄 Starting reset process...');
                
                // Simply restore the entire reading-text container HTML
                var readingTextContainer = document.querySelector('.reading-text');
                if (readingTextContainer && originalReadingTextHTML) {
                    readingTextContainer.innerHTML = originalReadingTextHTML;
                    console.log('✅ Restored reading-text HTML');
                    
                    // Re-initialize dropdowns after restoring HTML (use setTimeout to ensure DOM is updated)
                    setTimeout(function() {
                        initializeDropdowns();
                        console.log('✅ Re-initialized dropdowns after reset');
                    }, 50);
                }
                
                // Clear selected answers
                window.selectedAnswers = {};
                
                // Reset state
                window.quizState.answer = '';
                window.quizState.score = 0;
                window.quizState.showAnswer = false;
                
                // Reset show flag
                const showFlag = document.getElementById('showAnswerFlag');
                if (showFlag) {
                    showFlag.value = 'false';
                }
                
                // Hide answer container
                const answerContainer = document.getElementById('answer-paragraph-container');
                if (answerContainer) {
                    answerContainer.style.display = 'none';
                }
                
                console.log('🔄 Quiz reset completed');
            }

            if (window.parent !== window) {
                var channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });

                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
            }
            
            // Send timer.start message after template loads (template 311 - no audio, start immediately)
            function sendTimerStart() {
                try {
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'timer.start',
                            templateId: 311,
                            unitId: window.location.href.match(/unit[\/=]([^\/\?&]+)/)?.[1] || ''
                        }, '*');
                        console.log('✅ Sent timer.start message to parent (template 311 - after load)');
                    }
                } catch (error) {
                    console.error('Error sending timer.start message:', error);
                }
            }
            
            // Send timer.start message when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', sendTimerStart);
            } else {
                // DOM already loaded, send immediately
                sendTimerStart();
            }
            
            // Also send on window load as fallback
            window.addEventListener('load', function() {
                setTimeout(sendTimerStart, 100);
            });
        })();
    </script>
</body>
</html>`;

// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
function convertFurigana(text) {
    if (!text || typeof text !== "string") return text;
    
    // Chỉ Kanji (và vài ký tự đặc biệt)
    const kanjiWord = "[\u4E00-\u9FFF々〆〤ヶ]+";
    
    // Dấu ngoặc Nhật (全角)
    const reJaParens = new RegExp("(" + kanjiWord + ")（([^）]+)）", "g");
    text = text.replace(reJaParens, (match, p1, p2) => {
        return `<ruby>${p1}<rt>${p2}</rt></ruby>`;
    });
    
    // Dấu ngoặc ASCII (半角)
    const reAsciiParens = new RegExp("(" + kanjiWord + ")\\(([^)]+)\\)", "g");
    text = text.replace(reAsciiParens, (match, p1, p2) => {
        return `<ruby>${p1}<rt>${p2}</rt></ruby>`;
    });
    return text;
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

export const getReadingMultipleQuestionTemplate311 = (readingText, questionText, blankOptions, instructions = '以下の文章を読んで、質問に答えてください。', explanationText = '', images = [], imageFile = '') => {
    // questionText contains the paragraph with placeholders (ー) to be replaced with dropdowns
    // blankOptions contains options for dropdowns (format like template 18: "option1,option2,option3" or "opt1,opt2;opt3,opt4")
    // images: comma/semicolon separated image URLs, or array of image URLs
    // imageFile: single image file URL (fallback if images is empty)
    
    // Parse the options for each blank from blankOptions (similar to template 18)
    // Supports both English and Japanese punctuation (comma: , and ，, semicolon: ; and ；)
    let blanksOptionsArray = [];
    if (blankOptions && blankOptions.trim()) {
        // Normalize Japanese punctuation to English equivalents
        // Replace Japanese comma (，) with English comma (,)
        // Replace Japanese semicolon (；) with English semicolon (;)
        // Remove newlines and extra whitespace
        const normalizedOptions = blankOptions
            .replace(/，/g, ',')
            .replace(/；/g, ';')
            .replace(/\n/g, '')
            .replace(/\r/g, '')
            .trim();
        
        // If there's no semicolon, use first N words as correct answers in order, rest as wrong options
        if (normalizedOptions.indexOf(';') === -1) {
            let allOptions = normalizedOptions.split(',').map(opt => opt.trim()).filter(opt => opt);
            
            // Count number of blanks in questionText (placeholder （ー）)
            const blankMatches = questionText.match(/（ー）/g);
            const blankCount = blankMatches ? blankMatches.length : 0;
            
            // Take first N words as correct answers (N = number of blanks)
            const correctAnswers = allOptions.slice(0, blankCount);
            // All words can be options (including correct answers)
            // For each blank, create options array with its correct answer first
            blanksOptionsArray = [];
            for (let j = 0; j < correctAnswers.length; j++) {
                const correctAnswer = correctAnswers[j];
                // Get all options except the current correct answer
                const otherOptions = allOptions.filter(opt => opt !== correctAnswer);
                // Put correct answer first, followed by all other options
                const optionsForThisBlank = [correctAnswer, ...otherOptions];
                blanksOptionsArray.push(optionsForThisBlank);
            }
        } else {
            // Original behavior: split by semicolon for different options per blank
            // Also supports Japanese semicolon: "黒（くろ）くて,黒（くろ）い；すてきな,すてき"
            const semicolonSplit = normalizedOptions.split(';');
            blanksOptionsArray = [];
            for (let m = 0; m < semicolonSplit.length; m++) {
                const commaSplit = semicolonSplit[m].split(',').map(opt => opt.trim()).filter(opt => opt);
                blanksOptionsArray.push(commaSplit);
            }
        }
    }

    // Process questionText to replace placeholders (ー) with dropdowns (like template 18)
    let readingTextWithDropdowns = '';
    let answerDropdownIndex = 0;
    
    if (questionText && questionText.trim()) {
        // questionText contains content with （ー） placeholders
        const answerLines = questionText.split('\n').filter(line => line);
        
        const processedAnswerLines = [];
        for (let j = 0; j < answerLines.length; j++) {
            let line = answerLines[j];
            let processedLine = line;
            
            // Process all placeholders in this line - preserve whitespace around （ー）
            // Match pattern: (optional whitespace before)（ー）(optional whitespace after)
            processedLine = processedLine.replace(/(\s*)（ー）(\s*)/g, function(match, spaceBefore, spaceAfter) {
                // Get options for this blank
                const options = blanksOptionsArray[answerDropdownIndex] || [];
                const correctAnswer = options[0] || '';
                
                // Remove duplicate options (case-sensitive)
                const uniqueOptions = [];
                const seenOptions = new Set();
                for (let i = 0; i < options.length; i++) {
                    const option = options[i];
                    if (!seenOptions.has(option)) {
                        seenOptions.add(option);
                        uniqueOptions.push(option);
                    }
                }
                
                // Sort options alphabetically while keeping the correct answer reference
                const sortedOptions = [...uniqueOptions].sort((a, b) => {
                    try {
                        return a.localeCompare(b, 'ja');
                    } catch (e) {
                        return a.localeCompare(b);
                    }
                });
                
                let optionsHtml = '';
                for (let l = 0; l < sortedOptions.length; l++) {
                    const option = sortedOptions[l];
                    const processedOption = convertFurigana(escapeHtml(option));
                    optionsHtml += '<div class="dropdown-option" data-value="' + escapeHtml(option) + '">' + processedOption + '</div>';
                }
                const dropdown = '<div class="custom-dropdown" data-blank-number="' + (answerDropdownIndex + 1) + '" data-correct="' + escapeHtml(correctAnswer) + '">' +
                        '<div class="dropdown-button" data-value=""></div>' +
                        '<div class="dropdown-options">' + optionsHtml + '</div>' +
                    '</div><span class="dropdown-text-spacer"></span>';
                answerDropdownIndex++;
                // Preserve whitespace before dropdown from original text
                // Use spacer element to ensure text after dropdown is not covered when dropdown expands
                return spaceBefore + dropdown + (spaceAfter || '');
            });
            
            processedAnswerLines.push(processedLine);
        }
        
        const answerItems = [];
        for (let m = 0; m < processedAnswerLines.length; m++) {
            answerItems.push('<div class="answer-item">' + processedAnswerLines[m] + '</div>');
        }
        // Join without extra newlines to reduce spacing
        readingTextWithDropdowns = answerItems.join('');
    }
    
    // Process script text to highlight quoted text in red and convert furigana
    const processedExplanationText = explanationText
        .replace(/"([^"]+)"/g, '<span class="explanation-highlight">$1</span>');
    const processedScriptText = convertFurigana(processedExplanationText);
    
    // Process reading text with dropdowns to convert furigana
    const processedReadingTextWithDropdowns = convertFurigana(readingTextWithDropdowns);
    
    // Process paragraphText (reading text without dropdowns) - display below image 2
    console.log('🔍 Template 311 - paragraphText (readingText parameter):', {
        readingText: readingText,
        readingTextType: typeof readingText,
        readingTextLength: readingText ? readingText.length : 0,
        readingTextTrimmed: readingText ? readingText.trim() : '',
        hasContent: readingText && readingText.trim() ? true : false
    });
    const processedParagraphText = readingText && readingText.trim() ? convertFurigana(readingText.trim()) : '';
    const paragraphTextContainer = processedParagraphText 
        ? '<div class="paragraph-text">' + processedParagraphText + '</div>' 
        : '';
    console.log('🔍 Template 311 - paragraphTextContainer:', {
        processedParagraphText: processedParagraphText,
        paragraphTextContainer: paragraphTextContainer,
        containerLength: paragraphTextContainer.length
    });
    
    // Build correct answers array for grading
    const correctAnswersArray = [];
    for (let n = 0; n < blanksOptionsArray.length; n++) {
        const opts = blanksOptionsArray[n];
        correctAnswersArray.push(opts[0] || '');
    }

    // Process images - separate images with .1 and .2 in filename
    // Use imageFile as fallback if images is empty
    let finalImages = images;
    if ((!finalImages || finalImages === '' || (Array.isArray(finalImages) && finalImages.length === 0) || (typeof finalImages === 'string' && finalImages.trim() === '')) && imageFile) {
        finalImages = imageFile;
        console.log('🔍 Template 311 - Using imageFile as fallback:', imageFile);
    }
    
    // Debug: Log images parameter value
    console.log('🔍 Template 311 - Images parameter:', {
        images: images,
        imageFile: imageFile,
        finalImages: finalImages,
        type: typeof finalImages,
        isArray: Array.isArray(finalImages),
        length: finalImages ? (Array.isArray(finalImages) ? finalImages.length : finalImages.length) : 0,
        value: finalImages || 'undefined/empty'
    });
    
    let imagesLeftHtml = '';
    let imagesRightHtml = '';
    let hasImagesLeft = false;
    let hasImagesRight = false;
    
    if (finalImages) {
        // If images is a string, split by comma or semicolon
        const imageArray = Array.isArray(finalImages) ? finalImages : finalImages.split(/[,;]/).map(img => img.trim()).filter(img => img);
        
        console.log('🔍 Template 311 - Parsed imageArray:', imageArray);
        
        // Separate images based on .1. or .2. in filename
        const leftImages = [];
        const rightImages = [];
        
        imageArray.forEach((imagePath) => {
            // Check if filename contains .1./_1. or .2./_2. pattern 
            // (e.g., 1.1.png, ID31_1.1.png, 20251103_ID31_1.1.png, 20251113_ID38_1.jpeg)
            const filename = imagePath.split('/').pop() || imagePath;
            
            // Pattern logic: 
            // Image 2 (RIGHT): File có pattern _<số>.2 (ví dụ: _1.2, _27.2, _999.2)
            // Image 1 (LEFT): Tất cả các file còn lại (default)
            if (/_\d+\.2/.test(filename)) {
                // File có _số.2 (gạch dưới + số bất kỳ + .2) → hiển thị bên phải (image 2)
                console.log('✅ Template 311 - Image goes to RIGHT (pattern _số.2):', filename);
                rightImages.push(imagePath);
            } else {
                // Default: Tất cả file không match image 2 đều vào left (image 1)
                console.log('✅ Template 311 - Image goes to LEFT (default - không match _số.2):', filename);
                leftImages.push(imagePath);
            }
        });
        
        // Generate HTML for left images (container bên trái)
        if (leftImages.length > 0) {
            imagesLeftHtml = leftImages.map((imagePath) => {
                return '<div class="image-item"><img src="' + imagePath + '" alt="Reading Image" /></div>';
            }).join('');
            hasImagesLeft = true;
        }
        
        // Generate HTML for right images (container bên phải)
        if (rightImages.length > 0) {
            imagesRightHtml = rightImages.map((imagePath) => {
                return '<div class="image-item"><img src="' + imagePath + '" alt="Reading Image" /></div>';
            }).join('');
            hasImagesRight = true;
        }
    }

    // Replace template placeholders
    let template = readingMultipleQuestionTemplate311
        .replace('{{READING_TEXT_WITH_DROPDOWNS}}', processedReadingTextWithDropdowns)
        .replace('{{PARAGRAPH_TEXT_CONTAINER}}', paragraphTextContainer)
        .replace('{{INSTRUCTIONS}}', convertFurigana(instructions))
        .replace('{{EXPLANATION_TEXT}}', processedScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    // Handle left images conditionally - hide container if no images
    if (hasImagesLeft) {
        template = template.replace('{{IMAGES_LEFT}}', imagesLeftHtml);
    } else {
        // Hide container completely if no images
        template = template.replace('{{IMAGES_LEFT}}', '');
    }
    
    // Handle right images conditionally - hide container if no images
    if (hasImagesRight) {
        template = template.replace('{{IMAGES_RIGHT}}', imagesRightHtml);
    } else {
        // Hide container completely if no images
        template = template.replace('{{IMAGES_RIGHT}}', '');
    }

    return template;
};

export const readingMultipleQuestionTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Reading Multiple Question Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
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
            background-color: #fff;
            width: 100%;
            height: 100%;
        }
        .right-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            padding-left: 5px;
            padding-top: 0;
            background-color: #fff;
            width: 100%;
        }
        .instructions {
            font-size: 1.1rem;
            line-height: 1.5;
            color: #333;
            font-weight: bold;
            font-style: italic;
            margin: 0;
            padding: 10px;
            background-color: #fff;
            word-wrap: break-word;
            overflow-wrap: break-word;
            flex-shrink: 0;
        }
        .content-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            flex-grow: 1;
            padding: 10px;
            background-color: #fff;
        }
        .images-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
            width: 100%;
            overflow-x: hidden;
            min-height: 300px;
            border: 1px dashed #ccc;
            padding: 10px;
            background-color: #f9f9f9;
        }
        .image-item {
            width: 100%;
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .image-item img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .reading-text {
            font-size: 1.1rem;
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
        }
        .questions-container {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            width: 100%;
            overflow-x: hidden;
        }
        .question-block {
            background: #fff;
            padding: 8px;
            width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .question-text {
            font-size: 1.1rem;
            color: #333;
            font-weight: bold;
            margin-bottom: 8px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            width: 100%;
        }
        .options-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
            width: 100%;
        }
        .option-button {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            flex: 0 1 auto;
            min-width: 120px;
            max-width: 100%;
            padding: 6px 6px 6px 24px;
            border: none;
            background: transparent;
            font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            text-align: left;
            position: relative;
            transition: all 0.2s ease;
            white-space: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            border-radius: 3px;
            cursor: pointer;
        }
        .option-button:hover {
            background-color: #e9ecef;
        }
        .option-button::before {
            content: '';
            position: absolute;
            left: 6px;
            top: 50%;
            transform: translateY(-50%);
            width: 14px;
            height: 14px;
            border: 1px solid #666;
            border-radius: 2px;
            background: white;
        }
        .option-button.selected::before {
            background: #0075b4;
            border-color: #0075b4;
        }
        .option-button.selected::after {
            content: '✓';
            position: absolute;
            left: 11px;
            top: 50%;
            transform: translateY(-50%);
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
            left: 11px;
            top: 50%;
            transform: translateY(-50%);
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
            left: 11px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: white;
        }
        .answer-feedback {
            margin-top: 6px;
            font-size: 1rem;
            padding: 6px;
            border-radius: 3px;
            display: none;
        }
        .answer-feedback.correct {
            background-color: #e8f5e9;
            color: #2e7d32;
            display: block;
        }
        .answer-feedback.incorrect {
            background-color: #ffebee;
            color: #b40000;
            display: block;
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
        .explanation-section {
            margin-bottom: 1.5rem;
            background-color: #fff;
            overflow-y: auto;
            padding: 1rem;
        }
        .explanation-title {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
            text-align: center;
        }
        .explanation-text {
            line-height: 1.5;
            margin-bottom: 1rem;
            white-space: pre-wrap;
        }
        .answer-paragraph {
            margin: 0;
            background-color: white;
            line-height: 1.5;
            display: block;
            max-height: 200px;
            overflow-y: auto;
            padding: 1rem;
        }
        .explanation-highlight {
            color: #b40000;
            font-weight: normal;
        }
        .correct-answer {
            color: #2e7d32;
            font-weight: bold;
            display: inline-block;
            margin: 0;
        }
        .wrong-answer {
            color: #b40000;
            text-decoration: line-through;
            display: inline-block;
            margin: 0;
        }
        .no-answer {
            color: #666;
            padding: 0 4px;
            margin: 0 2px;
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
            .option-button {
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
                    <!-- Images will be inserted here -->
                    {{IMAGES}}
                </div>
                <div class="reading-text">{{READING_TEXT}}</div>
            </div>
        </div>
        
        <div class="right-container">
            <form id="quizForm" onsubmit="return false;">
                <div class="questions-container" id="questions-container">
                    {{QUESTIONS}}
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
            </form>
        </div>
        
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div class="explanation-section">
                    <div class="explanation-title">解説</div>
                    <div id="explanation-paragraph" class="explanation-text">{{EXPLANATION_TEXT}}</div>
                </div>
                <div class="your-answer-section">
                    <div id="answer-paragraph" class="answer-paragraph"></div>
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
        window.selectedAnswers = {};

        (function() {
            const questions = {{QUESTIONS_DATA}};

            function calculateResults() {
                let correctCount = 0;
                const totalQuestions = Object.keys(questions).length;
                
                for (let questionId in questions) {
                    const isCorrect = window.selectedAnswers[questionId] === questions[questionId].correctAnswer;
                    if (isCorrect) correctCount++;
                }
                
                const rawScore = correctCount / totalQuestions;
                const message = 'Score: ' + correctCount + '/' + totalQuestions;

                window.quizState.answers = JSON.stringify(window.selectedAnswers);
                window.quizState.score = rawScore;
                window.quizState.attempts += 1;

                return {
                    rawScore,
                    message,
                    correctCount,
                    totalQuestions
                };
            }

            function updateDisplay(result) {
                const answerContainer = document.getElementById('answer-paragraph-container');
                const explanationSection = document.querySelector('.explanation-section');
                
                // Update answer paragraph with results
                let answerHtml = '';
                for (let questionId in questions) {
                    const selectedAnswer = window.selectedAnswers[questionId];
                    const correctAnswer = questions[questionId].correctAnswer;
                    const questionBlock = document.getElementById(questionId);
                    const questionText = questionBlock.querySelector('.question-text').textContent;
                    
                    answerHtml += '<div class="answer-summary-item">';
                    answerHtml += '<div class="question-text">' + questionText + '</div>';
                    
                    if (selectedAnswer) {
                        const isCorrect = selectedAnswer === correctAnswer;
                        if (isCorrect) {
                            answerHtml += '<div>あなたの答え: <span class="correct-answer">' + selectedAnswer + '</span></div>';
                        } else {
                            answerHtml += '<div>あなたの答え: <span class="wrong-answer">' + selectedAnswer + '</span></div>';
                            answerHtml += '<div>正解: <span class="correct-answer">' + correctAnswer + '</span></div>';
                        }
                    } else {
                        answerHtml += '<div class="no-answer">未回答</div>';
                    }
                    answerHtml += '</div>';
                }
                
                const answerParagraph = document.getElementById('answer-paragraph');
                answerParagraph.innerHTML = answerHtml;
                
                // Only toggle the visibility of the answer container
                answerContainer.style.display = window.quizState.showAnswer ? 'block' : 'none';
            }

            function getGrade() {
                const result = calculateResults();
                
                // Toggle show/hide answers
                window.quizState.showAnswer = !window.quizState.showAnswer;
                document.getElementById('showAnswerFlag').value = window.quizState.showAnswer ? 'true' : 'false';
                
                updateDisplay(result);

                return JSON.stringify({
                    edxResult: None,
                    edxScore: result.rawScore,
                    edxMessage: result.message
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
                            
                            // Restore selected state for buttons
                            for (let questionId in window.selectedAnswers) {
                                const answer = window.selectedAnswers[questionId];
                                const selector = '#' + questionId + ' .option-button[data-value="' + answer + '"]';
                                const button = document.querySelector(selector);
                                if (button) {
                                    button.classList.add('selected');
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
        })();
    </script>
</body>
</html>`;

export const getReadingMultipleQuestionTemplate = (readingText, questionText, blankOptions, instructions = '以下の文章を読んで、質問に答えてください。', explanationText = '', images = []) => {
    // Split questions, options and explanations by semicolons
    const questions = questionText.split(';').map(q => q.trim()).filter(q => q);
    const optionsList = blankOptions.split(';').map(o => o.trim()).filter(o => o);
    const explanations = explanationText.split(';').map(e => e.trim()).filter(e => e);

    // Process images - support both single image string and array of images
    let imagesHtml = '';
    let hasImages = false;
    
    if (images) {
        // If images is a string, split by comma or semicolon
        const imageArray = Array.isArray(images) ? images : images.split(/[,;]/).map(img => img.trim()).filter(img => img);
        
        // Only generate HTML if we have valid image paths
        if (imageArray.length > 0) {
            imagesHtml = imageArray.map((imagePath) => {
                return '<div class="image-item"><img src="' + imagePath + '" alt="Reading Image" /></div>';
            }).join('');
            hasImages = true;
        }
    }

    // Generate questions HTML and data
    const questionsHtml = questions.map((questionText, index) => {
        const questionId = 'question_' + (index + 1);
        const options = (optionsList[index] || '').split(',').map(opt => opt.trim());
        const correctAnswer = options[0];
        const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'ja'));
        
        return '<div class="question-block" id="' + questionId + '">' +
               '<div class="question-text">問' + (index + 1) + '　' + questionText + '</div>' +
               '<div class="options-container">' + 
               sortedOptions.map((option, optIndex) => 
                   '<button type="button" class="option-button" data-value="' + option + '" onclick="' +
                   'const questionBlock=this.closest(\'.question-block\');' +
                   'questionBlock.querySelectorAll(\'.option-button\').forEach(btn=>btn.classList.remove(\'selected\'));' +
                   'this.classList.add(\'selected\');' +
                   'window.selectedAnswers[questionBlock.id]=this.dataset.value;' +
                   '">' + (optIndex + 1) + '. ' + option + '</button>'
               ).join('') +
               '</div>' +
               '</div>';
    }).join('');
    
    // Create questions data object for JavaScript
    const questionsData = {};
    questions.forEach((questionText, index) => {
        const questionId = 'question_' + (index + 1);
        const options = (optionsList[index] || '').split(',').map(opt => opt.trim());
        questionsData[questionId] = {
            correctAnswer: options[0],
            options: options
        };
    });
    
    // Process explanations with numbering
    const processedExplanationText = explanations.map((explanation, index) => {
        const processedText = explanation.replace(/"([^"]+)"/g, '<span class="explanation-highlight">$1</span>');
        return '<div class="explanation-block">' +
               '<div class="explanation-text">' + (index + 1) + '. ' + processedText + '</div>' +
               '</div>';
    }).join('');
    
    let template = readingMultipleQuestionTemplate
        .replace('{{READING_TEXT}}', readingText)
        .replace('{{QUESTIONS}}', questionsHtml)
        .replace('{{QUESTIONS_DATA}}', JSON.stringify(questionsData))
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{EXPLANATION_TEXT}}', processedExplanationText || '');

    // Handle images conditionally - hide container if no images
    if (hasImages) {
        template = template.replace('{{IMAGES}}', imagesHtml);
    } else {
        // Remove the entire images-container when no images
        template = template.replace(/<div class="images-container">[\s\S]*?{{IMAGES}}[\s\S]*?<\/div>/g, '');
    }

    return template;
}; 
export const getFillInBlankTemplate = (questionText, correctAnswers, instructions = 'Fill in the blanks with the correct answers.') => {
    // Log the incoming parameters to help debug
    console.log('getFillInBlankTemplate called with:', {
        questionText,
        correctAnswers
    });
    
    // Process the paragraph to replace blanks
    const blanks = {};
    let currentId = 1;
    
    // Process the paragraph to replace blanks marked with [BLANK: option1|option2|option3]
    const processedParagraph = questionText.replace(/\[BLANK\s*\d*:\s*([^\]]+)\]/g, (match, content) => {
        const blankId = `blank${currentId}`;
        const options = content.split('|').map(opt => opt.trim());
        const correctAnswer = options[0]; // First option is correct
        blanks[blankId] = correctAnswer;
        currentId += 1;
        return `<input type="text" id="${blankId}" class="blank-input" placeholder="Type your answer">`;
    });

    let template = fillInBlankTemplate
        .replace('{{PARAGRAPH_TEXT}}', processedParagraph)
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(blanks))
        .replace('{{INSTRUCTIONS}}', instructions);
    
    return template;
};

export const fillInBlankTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Fill in the Blank Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body {
            font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1;
            color: #414141;
            height: 100%;
            position: relative;
        }
        .container {
            padding: 20px;
            position: relative;
            height: 100%;
        }
        .instructions {
            background-color: #f8f8f8;
            padding: 1rem;
            margin-bottom: 1rem;
            border-left: 4px solid #0075b4;
            font-style: italic;
        }
        .paragraph {
            background-color: #f8f8f8;
            padding: 1rem;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
            line-height: 1.6;
            position: relative;
            z-index: 1;
        }
        input[type="text"] {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 1.2rem;
            line-height: 1;
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
        .answer-paragraph {
            margin: 0;
            background-color: #ffffff;
            line-height: 1.6;
            display: none;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            border-radius: 3px;
            padding: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions">{{INSTRUCTIONS}}</div>
        <div class="paragraph">
            <form id="quizForm" onsubmit="return false;">
                {{PARAGRAPH_TEXT}}
                <!-- Hidden paragraph that will be revealed on submit -->
                <div class="answer-paragraph-container" style="display: none;">
                    <div id="answer-paragraph" class="answer-paragraph" style="display: none;">
                        <div id="feedback"></div>
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

            // Initialize EdX integration
            var channel;
            if (window.parent !== window) {
                channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });
            }

            function calculateResults() {
                const totalQuestions = Object.keys(correctAnswers).length;
                let correctCount = 0;
                let answers = {};
                
                // Get all answers and count correct ones
                for (let id in correctAnswers) {
                    const input = document.getElementById(id);
                    const userAnswer = input.value.trim().toLowerCase();
                    const correctAnswer = correctAnswers[id];
                    
                    // Handle both single string and array of correct answers
                    const isCorrect = Array.isArray(correctAnswer) 
                        ? correctAnswer.some(ans => ans.toLowerCase() === userAnswer)
                        : correctAnswer.toLowerCase() === userAnswer;
                        
                    if (isCorrect) correctCount++;
                    answers[id] = userAnswer;
                }

                // Calculate score
                const rawScore = correctCount / totalQuestions;
                const message = \`Your score: \${correctCount} out of \${totalQuestions}\`;

                // Update state
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
                // Create paragraph with answers comparison
                const answerParagraph = document.getElementById('answer-paragraph');
                const answerContainer = document.querySelector('.answer-paragraph-container');
                
                // Show score feedback
                const feedbackDiv = document.getElementById('feedback');
                feedbackDiv.textContent = result.message;
                feedbackDiv.className = result.rawScore === 1 ? 'success' : 'error';
                
                // Get the original paragraph text
                const originalText = document.querySelector('.paragraph').innerHTML;
                let paragraphText = originalText;
                
                // Replace each input with the correct/wrong answer display
                for (let id in result.answers) {
                    const input = document.getElementById(id);
                    if (input) {
                        const userAnswer = result.answers[id];
                        const correctValue = correctAnswers[id];
                        
                        let replacement = '';
                        if (userAnswer) {
                            const isCorrect = Array.isArray(correctValue)
                                ? correctValue.some(ans => ans.toLowerCase() === userAnswer)
                                : correctValue.toLowerCase() === userAnswer;
                                
                            if (!isCorrect) {
                                replacement += \`<span class="wrong-answer">\${userAnswer}</span>\`;
                            }
                            // Show all correct answers
                            const correctAnswersDisplay = Array.isArray(correctValue)
                                ? correctValue.join(' / ')
                                : correctValue;
                            replacement += \`<span class="correct-answer">\${correctAnswersDisplay}</span>\`;
                        }
                        
                        // Replace the input element with the answer display
                        paragraphText = paragraphText.replace(input.outerHTML, replacement);
                    }
                }
                
                answerParagraph.innerHTML = \`<div id="feedback" class="\${result.rawScore === 1 ? 'success' : 'error'}">\${result.message}</div>\` + paragraphText;
                
                // Update visibility and position based on content height
                if (state.showAnswer) {
                    answerParagraph.style.display = 'block';
                    answerContainer.style.display = 'block';
                    
                    // Calculate how much we need to translate up to show full content
                    const contentHeight = answerContainer.offsetHeight;
                    const translateY = -contentHeight;
                    
                    // Always position at the bottom of iframe and translate up
                    answerContainer.style.transform = \`translateY(\${translateY}px)\`;
                } else {
                    answerParagraph.style.display = 'none';
                    answerContainer.style.display = 'none';
                }
            }

            function getGrade() {
                // Toggle the answer paragraph
                const answerParagraph = document.getElementById('answer-paragraph');
                const showFlag = document.getElementById('showAnswerFlag');

                const isVisible = answerParagraph.style.display === 'block';

                if (isVisible) {
                    // Hide it
                    answerParagraph.style.display = 'none';
                    document.querySelector('.answer-paragraph-container').style.display = 'none';
                    showFlag.value = 'false';
                    state.showAnswer = false;
                } else {
                    // Show it with updated results
                    const result = calculateResults();
                    updateDisplay(result);
                    answerParagraph.style.display = 'block';
                    document.querySelector('.answer-paragraph-container').style.display = 'block';
                    showFlag.value = 'true';
                    state.showAnswer = true;
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
                    console.log("Setting state:", stateStr); // Debug
                    const newState = JSON.parse(stateStr);
                    state = {
                        answer: newState.answer || '',
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
                    };
                    
                    console.log("New state:", state); // Debug
                    
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
                            document.getElementById('answer-paragraph').style.display = 
                                state.showAnswer ? 'block' : 'none';
                            document.querySelector('.answer-paragraph-container').style.display = 
                                state.showAnswer ? 'block' : 'none';
                            document.getElementById('showAnswerFlag').value = 
                                state.showAnswer ? 'true' : 'false';
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
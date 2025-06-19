export const dragDropQuizTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Drag and Drop Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"></script>
    <style>
        body {
            font-family: 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.8;
            color: #414141;
            height: 100%;
            position: relative;
        }
        .container {
            padding: 1rem;
            position: relative;
            height: 100%;
        }
        .paragraph {
            background-color: #f8f8f8;
            padding: 1.5rem;
            margin-bottom: 1rem;
            font-size: 1.3rem;
            line-height: 2;
            position: relative;
            z-index: 1;
            border-radius: 4px;
        }
        .word-bank {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin: 1.5rem 0;
            padding: 1.2rem;
            background-color: #f0f0f0;
            border-radius: 4px;
        }
        .draggable-word {
            padding: 0.6rem 1.2rem;
            background-color: #0075b4;
            color: white;
            border-radius: 4px;
            cursor: move;
            user-select: none;
            transition: background-color 0.2s;
            font-size: 1.2rem;
            min-width: 80px;
            text-align: center;
        }
        .draggable-word:hover {
            background-color: #005a8c;
        }
        .draggable-word.dragging {
            opacity: 0.5;
        }
        .blank {
            display: inline-block;
            min-width: 120px;
            height: 45px;
            border: 2px dashed #0075b4;
            border-radius: 4px;
            margin: 0 0.5rem;
            vertical-align: middle;
            background-color: white;
            text-align: center;
            line-height: 45px;
        }
        .blank.dragover {
            background-color: #e6f3f8;
            border-style: solid;
        }
        .blank.filled {
            border-style: solid;
            border-color: #2e7d32;
            background-color: #ecf3ec;
        }
        .blank.incorrect {
            border-color: #b40000;
            background-color: #f9ecec;
        }
        .buttons {
            margin: 1rem 0;
        }
        #feedback {
            margin: 1rem 0;
            padding: 1rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1.2rem;
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
            margin-top: 1rem;
            font-size: 1.1rem;
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
        .answer-feedback {
            margin-bottom: 1rem;
            padding: 0.8rem 1rem;
            border-radius: 3px;
            font-weight: bold;
            font-size: 1.1rem;
            background: #f9ecec;
            color: #b40000;
            border: 1px solid #ebccd1;
        }
        .answer-feedback.success {
            background: #ecf3ec;
            color: #2e7d32;
            border: 1px solid #c5e0c5;
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
        .quiz-word {
            display: inline-block;
            margin: 0 0.02em;
            padding: 0.02em 0.1em;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            box-sizing: border-box;
        }
        .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .quiz-word.incorrect {
            background: #b40000;
            color: #fff;
            text-decoration: line-through;
        }
        .answer-blank {
            display: inline-block;
            margin: 0 0.5rem;
            vertical-align: middle;
            min-width: 120px;
            text-align: center;
        }
        .answer-blank .quiz-word {
            margin: 0 0.2rem;
            padding: 0.5rem 0.8rem;
            border-radius: 4px;
            font-weight: bold;
        }
        #answer-paragraph form {
            padding: 0;
            margin: 0;
            background: transparent;
        }
        #answer-paragraph form > div {
            margin-bottom: 1rem;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="paragraph">
            <form id="quizForm" onsubmit="return false;">
                {{PARAGRAPH_TEXT}}
                <div class="word-bank">
                    {{WORD_BANK}}
                </div>
                <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
            </form>
        </div>
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div id="feedback" class="answer-feedback"></div>
                <div id="answer-paragraph" class="answer-paragraph"></div>
            </div>
        </div>
        <div id="answer-details" class="answer-feedback"></div>
    </div>

    <script>
        (function() {
            var state = {
                answers: {},
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

            // Drag and Drop functionality
            function initializeDragAndDrop() {
                const draggableWords = document.querySelectorAll('.draggable-word');
                const blanks = document.querySelectorAll('.blank');
                const wordBank = document.querySelector('.word-bank');

                draggableWords.forEach(word => {
                    word.setAttribute('draggable', 'true');
                    word.addEventListener('dragstart', handleDragStart);
                    word.addEventListener('dragend', handleDragEnd);
                });

                blanks.forEach(blank => {
                    blank.addEventListener('dragover', handleDragOver);
                    blank.addEventListener('dragleave', handleDragLeave);
                    blank.addEventListener('drop', handleDrop);
                    blank.addEventListener('dragstart', handleBlankDragStart);
                    blank.addEventListener('dragend', handleBlankDragEnd);
                    blank.setAttribute('draggable', 'true');
                });

                // Allow dropping back to word bank
                wordBank.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    wordBank.classList.add('dragover');
                });
                wordBank.addEventListener('dragleave', function(e) {
                    wordBank.classList.remove('dragover');
                });
                wordBank.addEventListener('drop', handleDropToWordBank);
            }

            function handleDragStart(e) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.textContent);
                e.dataTransfer.setData('source', 'word-bank');
            }

            function handleDragEnd(e) {
                e.target.classList.remove('dragging');
            }

            function handleBlankDragStart(e) {
                if (!e.currentTarget.textContent.trim()) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData('text/plain', e.currentTarget.textContent);
                e.dataTransfer.setData('source', 'blank');
                e.dataTransfer.setData('blankId', e.currentTarget.id);
                e.currentTarget.classList.add('dragging');
            }

            function handleBlankDragEnd(e) {
                e.currentTarget.classList.remove('dragging');
            }

            function handleDragOver(e) {
                e.preventDefault();
                e.currentTarget.classList.add('dragover');
            }

            function handleDragLeave(e) {
                e.currentTarget.classList.remove('dragover');
            }

            function handleDrop(e) {
                e.preventDefault();
                const blank = e.currentTarget;
                blank.classList.remove('dragover');

                const word = e.dataTransfer.getData('text/plain');
                const source = e.dataTransfer.getData('source');
                const fromBlankId = e.dataTransfer.getData('blankId');
                const blankId = blank.id;

                // If this blank already has a word, return it to the word bank (replace logic)
                if (blank.textContent.trim()) {
                    // Only return if the word is different
                    if (blank.textContent.trim() !== word) {
                        restoreWordToBank(blank.textContent.trim());
                    }
                }

                // If moving from another blank, clear that blank
                if (source === 'blank' && fromBlankId && fromBlankId !== blankId) {
                    const fromBlank = document.getElementById(fromBlankId);
                    if (fromBlank) {
                        fromBlank.textContent = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }

                // Store the answer
                state.answers[blankId] = word;

                // Update the blank's appearance
                blank.textContent = word;
                blank.classList.add('filled');

                // Hide the dragged word from the word bank if it exists there
                const draggedWord = Array.from(document.querySelectorAll('.draggable-word')).find(w => w.textContent === word);
                if (draggedWord) {
                    draggedWord.style.display = 'none';
                }
            }

            function handleDropToWordBank(e) {
                e.preventDefault();
                const word = e.dataTransfer.getData('text/plain');
                const source = e.dataTransfer.getData('source');
                const fromBlankId = e.dataTransfer.getData('blankId');
                if (source === 'blank' && fromBlankId) {
                    // Remove word from blank
                    const fromBlank = document.getElementById(fromBlankId);
                    if (fromBlank) {
                        fromBlank.textContent = '';
                        fromBlank.classList.remove('filled');
                        delete state.answers[fromBlankId];
                    }
                }
                restoreWordToBank(word);
            }

            function restoreWordToBank(word) {
                const wordElement = Array.from(document.querySelectorAll('.draggable-word')).find(w => w.textContent === word);
                if (wordElement) {
                    wordElement.style.display = '';
                }
            }

            function calculateResults() {
                let correctCount = 0;
                const totalQuestions = Object.keys(correctAnswers).length;
                
                // Check each answer
                for (let blankId in correctAnswers) {
                    const userAnswer = state.answers[blankId];
                    const correctAnswer = correctAnswers[blankId];
                    const blank = document.getElementById(blankId);
                    
                    if (userAnswer === correctAnswer) {
                        correctCount++;
                    }
                }

                const rawScore = correctCount / totalQuestions;
                const message = \`Your score: \${correctCount} out of \${totalQuestions}\`;

                return {
                    rawScore,
                    message,
                    correctCount,
                    totalQuestions
                };
            }

            function updateDisplay(result) {
                const answerParagraph = document.getElementById('answer-paragraph');
                const answerContainer = document.getElementById('answer-paragraph-container');
                
                // Show score feedback
                const feedbackDiv = document.getElementById('feedback');
                feedbackDiv.textContent = result.message;
                feedbackDiv.className = result.rawScore === 1 ? 'answer-feedback success' : 'answer-feedback';
                
                try {
                    console.log('Starting updateDisplay with result:', JSON.stringify(result));
                    
                    // Get the original quiz form
                    const quizForm = document.getElementById('quizForm');
                    console.log('Quiz form found:', quizForm ? 'yes' : 'no');
                    
                    // Log the full HTML structure of the quiz form
                    console.log('Quiz form HTML structure:', quizForm.outerHTML);
                    
                    // Log all blanks in the original quiz form
                    const originalBlanks = quizForm.querySelectorAll('.blank');
                    console.log('Blanks in original quiz form:', originalBlanks.length);
                    originalBlanks.forEach((blank, i) => {
                        console.log('Original blank ' + i + ':', blank.id, blank.outerHTML);
                    });
                    
                    // Create a direct clone of the entire form
                    const answerFormClone = quizForm.cloneNode(true);
                    console.log('Clone created successfully');
                    
                    // Remove the word bank from the clone
                    const wordBank = answerFormClone.querySelector('.word-bank');
                    if (wordBank) {
                        wordBank.remove();
                        console.log('Word bank removed from clone');
                    }
                    
                    // Find all blanks in the cloned form
                    const blanks = answerFormClone.querySelectorAll('.blank');
                    console.log('Total blanks found in clone:', blanks.length);
                    
                    // Check if the number of blanks matches the total questions
                    if (blanks.length !== result.totalQuestions) {
                        console.warn('Mismatch between blanks (' + blanks.length + ') and total questions (' + result.totalQuestions + ')');
                        console.log('Correct answers:', JSON.stringify(correctAnswers));
                        
                        // Create a container for additional answers
                        const additionalAnswers = document.createElement('div');
                        additionalAnswers.className = 'additional-answers';
                        additionalAnswers.style.marginTop = '1rem';
                        additionalAnswers.style.padding = '1rem';
                        additionalAnswers.style.backgroundColor = '#f8f8f8';
                        additionalAnswers.style.borderRadius = '4px';
                        
                        // Add a heading
                        const heading = document.createElement('h3');
                        heading.textContent = 'Additional Answers:';
                        heading.style.marginTop = '0';
                        additionalAnswers.appendChild(heading);
                        
                        // Process each answer that doesn't have a corresponding blank
                        let missingAnswersFound = false;
                        for (let blankId in correctAnswers) {
                            // Check if this blank exists in the form
                            const blankExists = Array.from(blanks).some(blank => blank.id === blankId);
                            
                            if (!blankExists) {
                                missingAnswersFound = true;
                                const userAnswer = state.answers[blankId];
                                const correctAnswer = correctAnswers[blankId];
                                
                                // Create an answer item
                                const answerItem = document.createElement('div');
                                answerItem.style.marginBottom = '0.5rem';
                                
                                if (userAnswer) {
                                    if (userAnswer === correctAnswer) {
                                        // User answered correctly
                                        answerItem.innerHTML = 
                                            '<strong>' + blankId + ':</strong> ' +
                                            '<span class="quiz-word correct">' + userAnswer + '</span>';
                                    } else {
                                        // User answered incorrectly
                                        answerItem.innerHTML = 
                                            '<strong>' + blankId + ':</strong> ' +
                                            '<span class="quiz-word incorrect">' + userAnswer + '</span>' + 
                                            ' <span class="quiz-word correct">' + correctAnswer + '</span>';
                                    }
                                } else {
                                    // User didn't answer
                                    answerItem.innerHTML = 
                                        '<strong>' + blankId + ':</strong> ' +
                                        '<span class="quiz-word correct">' + correctAnswer + '</span>';
                                }
                                
                                additionalAnswers.appendChild(answerItem);
                            }
                        }
                        
                        // Only add the additional answers section if we found missing answers
                        if (missingAnswersFound) {
                            answerFormClone.appendChild(additionalAnswers);
                        }
                    }
                    
                    // Process each blank
                    blanks.forEach((blank, index) => {
                        const blankId = blank.id;
                        console.log('Processing blank', index, 'with ID:', blankId);
                        
                        if (!blankId) {
                            console.log('Blank has no ID, skipping');
                            return;
                        }
                        
                        const userAnswer = state.answers[blankId];
                        const correctAnswer = correctAnswers[blankId];
                        
                        console.log('User answer:', userAnswer, 'Correct answer:', correctAnswer);
                        
                        // Create a replacement span
                        const answerSpan = document.createElement('span');
                        answerSpan.className = 'answer-blank';
                        
                        if (userAnswer) {
                            if (userAnswer === correctAnswer) {
                                // User answered correctly
                                answerSpan.innerHTML = '<span class="quiz-word correct">' + userAnswer + '</span>';
                            } else {
                                // User answered incorrectly
                                answerSpan.innerHTML = 
                                    '<span class="quiz-word incorrect">' + userAnswer + '</span>' + 
                                    ' <span class="quiz-word correct">' + correctAnswer + '</span>';
                            }
                        } else {
                            // User didn't answer
                            answerSpan.innerHTML = '<span class="quiz-word correct">' + correctAnswer + '</span>';
                        }
                        
                        // Replace the blank with our styled answer
                        blank.parentNode.replaceChild(answerSpan, blank);
                        console.log('Replaced blank with answer span');
                    });
                    
                    // Clear the answer paragraph and add our processed clone
                    answerParagraph.innerHTML = '';
                    answerParagraph.appendChild(answerFormClone);
                    console.log('Added processed clone to answer paragraph');
                    
                    console.log('Final answer paragraph HTML:', answerParagraph.innerHTML);
                    
                    // Update visibility
                    if (state.showAnswer) {
                        answerContainer.style.display = 'block';
                    } else {
                        answerContainer.style.display = 'none';
                    }
                    
                    console.log('updateDisplay completed successfully');
                } catch (error) {
                    console.error('Error in updateDisplay:', error);
                }
            }

            function getGrade() {
                // Toggle the answer paragraph visibility
                const answerContainer = document.getElementById('answer-paragraph-container');
                const showFlag = document.getElementById('showAnswerFlag');

                const isVisible = answerContainer.style.display === 'block';

                if (isVisible) {
                    // Hide it
                    answerContainer.style.display = 'none';
                    showFlag.value = 'false';
                    state.showAnswer = false;
                } else {
                    // Show it with updated results
                    const result = calculateResults();
                    updateDisplay(result);
                    answerContainer.style.display = 'block';
                    showFlag.value = 'true';
                    state.showAnswer = true;
                }

                // Return grade info to EdX
                const result = calculateResults();
                return JSON.stringify({
                    edxResult: None,  // Keep it null to avoid EdX refresh
                    edxScore: result.rawScore,
                    edxMessage: result.message
                });
            }

            function getState() {
                return JSON.stringify({
                    answers: state.answers,
                    attempts: state.attempts,
                    score: state.score,
                    showAnswer: state.showAnswer
                });
            }

            function setState(stateStr) {
                try {
                    let newState;
                    
                    // Check if stateStr is already an object or a string
                    if (typeof stateStr === 'string') {
                        newState = JSON.parse(stateStr);
                    } else if (typeof stateStr === 'object') {
                        newState = stateStr;
                    } else {
                        console.error('Invalid state format:', stateStr);
                        return;
                    }
                    
                    state = {
                        answers: newState.answers || {},
                        attempts: newState.attempts || 0,
                        score: newState.score || 0,
                        showAnswer: newState.showAnswer || false
                    };
                    
                    // Restore answers if we have saved state
                    if (state.answers) {
                        for (let blankId in state.answers) {
                            const blank = document.getElementById(blankId);
                            const word = state.answers[blankId];
                            if (blank && word) {
                                blank.textContent = word;
                                blank.classList.add('filled');
                                
                                // Hide the corresponding word in the word bank
                                const wordElement = Array.from(document.querySelectorAll('.draggable-word'))
                                    .find(el => el.textContent === word);
                                if (wordElement) {
                                    wordElement.style.display = 'none';
                                }
                            }
                        }

                        // Calculate results
                        const result = calculateResults();
                        
                        // Update answer paragraph content
                        updateDisplay(result);
                        
                        // Set visibility based on state
                        const answerContainer = document.getElementById('answer-paragraph-container');
                        answerContainer.style.display = state.showAnswer ? 'block' : 'none';
                        document.getElementById('showAnswerFlag').value = state.showAnswer ? 'true' : 'false';
                    }
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }

            // Initialize drag and drop when the page loads
            document.addEventListener('DOMContentLoaded', function() {
                // Render each sentence in a <div> for line breaks and correct drag-drop
                var para = document.querySelector('.paragraph');
                if (para) {
                    console.log('Initializing paragraph structure');
                    
                    // Get the quiz form directly instead of manipulating the HTML string
                    var quizForm = para.querySelector('#quizForm');
                    
                    if (quizForm) {
                        console.log('Found quiz form directly');
                        
                        // Get the content of the form excluding the word bank
                        var wordBank = quizForm.querySelector('.word-bank');
                        var hiddenInput = quizForm.querySelector('input[type="hidden"]');
                        
                        // Store the word bank and hidden input for later
                        var wordBankHTML = wordBank ? wordBank.outerHTML : '';
                        var hiddenInputHTML = hiddenInput ? hiddenInput.outerHTML : '';
                        
                        // Temporarily remove word bank and hidden input to process only the sentences
                        if (wordBank) wordBank.remove();
                        if (hiddenInput) hiddenInput.remove();
                        
                        // Get the form content without word bank and hidden input
                        var formContent = quizForm.innerHTML;
                        console.log('Form content without word bank:', formContent);
                        
                        // Split the content by Japanese period and filter out empty strings
                        var sentences = formContent.split('。').filter(function(s) { return s.trim(); });
                        console.log('Split sentences:', sentences.length);
                        
                        // Wrap each sentence in a div and add the period back
                        var wrappedContent = sentences.map(function(s, index) {
                            // Only add period if it's not the last empty sentence
                            return '<div>' + s + (index < sentences.length - 1 || s.trim() ? '。' : '') + '</div>';
                        }).join('');
                        
                        // Reconstruct the form with the wrapped sentences and the word bank
                        quizForm.innerHTML = wrappedContent + wordBankHTML + hiddenInputHTML;
                        
                        console.log('Updated form HTML:', quizForm.outerHTML);
                        
                        // Log the number of blanks after splitting
                        var updatedBlanks = quizForm.querySelectorAll('.blank');
                        console.log('Number of blanks after splitting:', updatedBlanks.length);
                    } else {
                        console.error('Could not find quiz form');
                        
                        // Fall back to the original method
                        var original = para.innerHTML;
                        console.log('Original paragraph HTML:', original);
                        
                        // Log the number of blanks in the original HTML
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = original;
                        var originalBlanks = tempDiv.querySelectorAll('.blank');
                        console.log('Number of blanks in original HTML:', originalBlanks.length);
                        
                        var sentences = original.split('。').filter(function(s) { return s; }).map(function(s) { return s + '。'; });
                        console.log('Split sentences (fallback):', sentences.length);
                        
                        para.innerHTML = sentences.map(function(s) { return '<div>' + s + '</div>'; }).join('');
                        console.log('Updated paragraph HTML (fallback):', para.innerHTML);
                    }
                    
                    // Initialize the answer paragraph - but we'll create the content at display time
                    // to ensure we get the fully processed quiz structure
                }
                // Initialize drag-drop
                initializeDragAndDrop();
            });

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
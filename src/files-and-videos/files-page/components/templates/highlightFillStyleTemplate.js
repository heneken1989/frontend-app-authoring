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
            line-height: 1;
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
        .quiz-word.correct {
            background: #2e7d32;
            color: #fff;
        }
        .quiz-word.incorrect {
            background: #b40000;
            color: #fff;
            text-decoration: line-through;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="paragraph" id="quiz-paragraph">
            <!-- Words will be injected here -->
        </div>
        <div class="answer-paragraph-container" id="answer-paragraph-container" style="display: none;">
            <div class="answer-paragraph-inner">
                <div id="answer-feedback" class="answer-feedback" style="display: none;"></div>
                <div id="answer-paragraph" class="answer-paragraph"></div>
            </div>
        </div>
        <input type="hidden" id="showAnswerFlag" name="showAnswerFlag" value="false">
    </div>
    <script>
        (function() {
            const paragraph = '{{PARAGRAPH}}';
            const correctWords = {{CORRECT_WORDS}};
            let showAnswer = false;
            let selectedWords = [];

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
                const answerFeedback = document.getElementById('answer-feedback');
                if (showAnswer) {
                    answerContainer.style.display = 'block';
                    answerParagraph.style.display = 'block';
                    const words = splitWords(paragraph);
                    const correct = correctWords.map(normalize);
                    answerParagraph.innerHTML = words.map(function(word, idx) {
                        const norm = normalize(word);
                        if (selectedWords.includes(idx) && correct.includes(norm)) {
                            // User chọn đúng
                            return '<span class="quiz-word correct">' + word + '</span>';
                        } else if (selectedWords.includes(idx) && !correct.includes(norm)) {
                            // User chọn sai
                            return '<span class="quiz-word incorrect">' + word + '</span>';
                        } else if (!selectedWords.includes(idx) && correct.includes(norm)) {
                            // Đáp án đúng nhưng user không chọn
                            return '<span class="quiz-word correct">' + word + '</span>';
                        } else {
                            // Không chọn, không phải đáp án đúng
                            return '<span class="quiz-word">' + word + '</span>';
                        }
                    }).join(' ');
                    // Show feedback/score
                    let correctCount = 0;
                    let total = correct.length;
                    words.forEach((word, idx) => {
                        const norm = normalize(word);
                        if (selectedWords.includes(idx) && correct.includes(norm)) correctCount++;
                    });
                    answerFeedback.style.display = 'block';
                    answerFeedback.textContent = 'Your score: ' + correctCount + ' out of ' + total;
                    answerFeedback.className = (correctCount === total && selectedWords.length === total)
                        ? 'answer-feedback success'
                        : 'answer-feedback';
                } else {
                    answerContainer.style.display = 'none';
                    answerParagraph.style.display = 'none';
                    if (answerFeedback) answerFeedback.style.display = 'none';
                }
            }

            function normalize(word) {
                return word.replace(/[.,!?;:()\"'-]/g, '').toLowerCase();
            }
            function getSelectedWords() {
                return selectedWords;
            }
            function grade() {
                const selected = getSelectedWords().map(normalize);
                const correct = correctWords.map(normalize);
                let correctCount = 0;
                let total = correct.length;
                selected.forEach(sel => {
                    if (correct.includes(sel)) correctCount++;
                });
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
                const answerFeedback = document.getElementById('answer-feedback');
                const showFlag = document.getElementById('showAnswerFlag');
                const isVisible = answerContainer.style.display === 'block';
                if (isVisible) {
                    answerParagraph.style.display = 'none';
                    answerContainer.style.display = 'none';
                    if (answerFeedback) answerFeedback.style.display = 'none';
                    showFlag.value = 'false';
                    showAnswer = false;
                    selectedWords = [];
                    renderParagraph();
                } else {
                    // Show it with updated results
                    showAnswer = true;
                    renderParagraph();
                    answerParagraph.style.display = 'block';
                    answerContainer.style.display = 'block';
                    if (answerFeedback) answerFeedback.style.display = 'block';
                    showFlag.value = 'true';
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
                    const answerFeedback = document.getElementById('answer-feedback');
                    const showFlag = document.getElementById('showAnswerFlag');
                    if (showAnswer) {
                        answerParagraph.style.display = 'block';
                        answerContainer.style.display = 'block';
                        if (answerFeedback) answerFeedback.style.display = 'block';
                        showFlag.value = 'true';
                    } else {
                        answerParagraph.style.display = 'none';
                        answerContainer.style.display = 'none';
                        if (answerFeedback) answerFeedback.style.display = 'none';
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
        })();
    </script>
</body>
</html>`; 
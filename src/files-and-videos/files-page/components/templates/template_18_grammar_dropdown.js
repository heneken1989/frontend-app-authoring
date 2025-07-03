export const getGrammarDropdownTemplate = (questionText, optionsForBlanks, audioFile, startTime = 0, endTime = 0, instructions = '正しい答えを選んでください。', scriptText = '', imageFile = '', answerContent = '') => {
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

    // Process script text to highlight quoted text in red
    const processedScriptText = scriptText.replace(/"([^"]+)"/g, '<span class="script-highlight">$1</span>');
    
    // Build correct answers array for grading
    const correctAnswersArray = blanksOptionsArray.map(opts => opts[0] || '');

    let template = grammarDropdownTemplate
        .replace(/{{ANSWERS_LIST}}/g, answersList)
        .replace('{{INSTRUCTIONS}}', instructions)
        .replace('{{SCRIPT_TEXT}}', processedScriptText || '')
        .replace('{{CORRECT_ANSWERS}}', JSON.stringify(correctAnswersArray));

    return template;
};

export const grammarDropdownTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Grammar Dropdown Quiz</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"><\/script>
    <style>
        body { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin: 0; padding: 0; color: #414141; height: auto; position: relative; overflow-y: auto; background-color: white; max-height: 700px; }
        .container { position: relative; height: auto; display: flex; flex-direction: column; gap: 20px; background-color: white; max-height: 700px; overflow-y: auto; padding: 20px; }
        .content-wrapper { background: white; padding: 0; display: flex; flex-direction: column; gap: 20px; }
        .instructions { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; background-color: white; color: #333; font-style: italic; margin: 0; position: relative; padding-left: 20px; }
        .instructions:before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background-color: #0075b4; }
        .select-container { margin: 0; display: flex; flex-direction: column; gap: 8px; padding: 0; background: white; }
        .select-answer-header { font-size: 1rem; color: #333; margin: 0; font-weight: bold; }
        .answer-select { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 0.9rem; font-weight: 400; line-height: 1.3; text-align: left; width: auto; min-width: 60px; border: 1px solid #666; border-radius: 4px; background-color: white; color: #333; cursor: pointer; display: inline-block; padding: 2px 4px; }
        .answer-select:focus { outline: none; border-color: #0075b4; }
        .answer-select option { padding: 4px; font-size: 0.85rem; }
        .answer-select.correct { border-color: #2e7d32; background-color: #ecf3ec; }
        .answer-select.incorrect { border-color: #b40000; background-color: #f9ecec; }
        .correct-answer { color: #2e7d32; font-weight: bold; padding: 2px 8px; border-radius: 3px; background-color: #ecf3ec; }
        .wrong-answer { color: #b40000; font-weight: bold; text-decoration: line-through; padding: 2px 8px; border-radius: 3px; background-color: #f9ecec; }
        .answer-paragraph-container { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; background-color: rgba(99, 97, 97, 0.95); border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; display: none; z-index: 2; transition: transform 0.3s ease; max-height: 460px; overflow-y: auto; }
        .answer-paragraph-inner { max-width: 90%; margin: 0 auto; background: #fff; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: stretch; max-height: 400px; overflow-y: auto; }
        .transcript-section { margin-bottom: 1.5rem; background-color: #fff; border-radius: 4px; border: 1px solid #e0e0e0; overflow-y: auto; }
        .transcript-title { font-weight: bold; margin-bottom: 1rem; color: #333; font-size: 1.2rem; text-align: center; }
        .transcript-text { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin-bottom: 1rem; white-space: pre-wrap; }
        .score-display { font-weight: bold; margin-bottom: 1rem; color: #333; }
        .answer-paragraph { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin: 0; background-color: white; box-shadow: none; border-radius: 3px; display: block; border: 1px solid #e0e0e0; overflow-y: auto; max-height: 200px; }
        .script-highlight { color: #b40000; font-weight: normal; }
        .no-answer { color: #666; border-bottom: 2px solid #666; padding: 0 4px; margin: 0 2px; }
        .answer-item { font-family: Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; text-align: left; margin-bottom: 10px; color: #333; }
        .answers-list { padding: 5px; background: white; border-radius: 2px; margin: 5px 0; }
        @media (max-width: 768px) { .container { padding: 15px; gap: 15px; } .content-wrapper { gap: 15px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions" id="quiz-instructions">
            {{INSTRUCTIONS}}
        </div>
        <div class="content-wrapper">
            <form id="quizForm" onsubmit="return false;">
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
            const isVisible = answerContainer.style.display === 'block';
            if (isVisible) {
                answerContainer.style.display = 'none';
                showFlag.value = 'false';
                state.showAnswer = false;
            } else {
                const result = calculateResults();
                updateDisplay(result);
                answerContainer.style.display = 'block';
                showFlag.value = 'true';
                state.showAnswer = true;
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
    })();
    </script>
</body>
</html>`; 
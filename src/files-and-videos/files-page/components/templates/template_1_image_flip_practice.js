export const imageFlipPracticeTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Image Flip Practice (ID1)</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jschannel/1.0.0-git-commit1-8c4f7eb/jschannel.min.js"></script>
    <style>
        :root {
            --card-width: 320px;
            --card-height: 260px;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Noto Serif JP', 'Noto Sans JP', 'Kosugi Maru', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #333;
            width: 100%;
            min-height: 100vh;
        }
        .page {
            padding: 16px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .instructions {
            font-size: 1.1rem;
            line-height: 1.6;
            font-weight: bold;
            margin-bottom: 16px;
            word-break: break-word;
            white-space: pre-wrap;
        }
        .question-text {
            font-size: 1.2rem;
            line-height: 1.6;
            font-weight: bold;
            margin-bottom: 20px;
            padding: 12px;
            border-radius: 6px;
            word-break: break-word;
            white-space: pre-wrap;
            color: #333;
        }
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(var(--card-width), 1fr));
            gap: 16px;
            align-items: stretch;
        }
        .flip-card {
            perspective: 1000px;
            width: 100%;
            height: var(--card-height);
            cursor: pointer;
        }
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            overflow: hidden;
            background: #f8f9fa;
            cursor: pointer;
        }
        .flip-card.flipped .card-inner {
            transform: rotateY(180deg);
        }
        .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
        }
        .card-front {
            background: #fff;
            justify-content: flex-start;
            align-items: stretch;
            flex-direction: column;
        }
        .card-back {
            background: #fff;
            transform: rotateY(180deg);
            overflow-y: auto;
            justify-content: flex-start;
            align-items: stretch;
            flex-direction: column;
        }
        .flip-card.flipped .card-back {
            backface-visibility: visible !important;
        }
        .flip-card.flipped .card-front {
            backface-visibility: hidden !important;
        }
        .card-image {
            width: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f3f5;
            overflow: hidden;
            min-height: 0;
        }
        .card-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .flip-hint-container {
            width: 100%;
            flex-shrink: 0;
            padding: 0;
            margin: 0;
            background: transparent;
        }
        .flip-hint-button {
            width: 100%;
            background: linear-gradient(180deg, #4a90e2 0%, #357abd 100%);
            color: white;
            border: none;
            border-radius: 0 0 10px 10px;
            padding: 12px 24px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            pointer-events: none;
            text-align: center;
        }
        .flip-hint-button:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateY(-2px);
        }
        .card-content {
            padding: 12px;
            flex: 1;
            min-height: 0;
            overflow-y: auto;
        }
        .question {
            font-weight: bold;
            margin: 0 0 8px 0;
            line-height: 1.4;
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 1.1rem;
            color: #333;
        }
        .hint {
            font-size: 0.95rem;
            color: #555;
        }
        .answer-title {
            font-size: 0.95rem;
            font-weight: bold;
            color: #111;
            margin-bottom: 6px;
        }
        .answer-list {
            margin: 0;
            padding-left: 18px;
        }
        .answer-list li {
            margin-bottom: 4px;
            line-height: 1.5;
        }
        .answer-text {
            white-space: pre-wrap;
            line-height: 1.6;
            font-size: 50px;
            font-weight: bold;
            color: #F24C4C;
            padding: 8px 0;
            text-align: center;
        }
        .progress {
            margin-top: 16px;
            font-size: 1rem;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            :root {
                --card-width: 100%;
                --card-height: 240px;
            }
            .page { padding: 12px; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="instructions" id="quiz-instructions">{{INSTRUCTIONS}}</div>
        <div class="question-text" id="question-text">{{QUESTION_TEXT}}</div>
        <div class="cards-grid">
            {{CARDS}}
        </div>
    </div>

    <script>
        (function() {
            window.quizState = {
                flipped: {},
                score: 0,
                attempts: 0,
                showAnswer: false
            };

            const cards = document.querySelectorAll('.flip-card');

            function calculateResults() {
                const flippedCount = Object.keys(window.quizState.flipped).length;
                const totalCards = cards.length;
                const rawScore = totalCards ? flippedCount / totalCards : 0;
                const message = totalCards
                    ? 'Viewed ' + flippedCount + ' of ' + totalCards
                    : 'No cards';

                window.quizState.score = rawScore;
                window.quizState.attempts += 1;

                return { rawScore, message, flippedCount, totalCards };
            }

            function resetQuiz() {
                cards.forEach(card => card.classList.remove('flipped'));
                window.quizState.flipped = {};
                window.quizState.score = 0;
                window.quizState.showAnswer = false;
            }

            function getGrade() {
                const result = calculateResults();
                window.quizState.showAnswer = true;

                const returnValue = {
                    edxResult: null,
                    edxScore: result.rawScore,
                    edxMessage: result.message
                };

                return JSON.stringify(returnValue);
            }

            function getState() {
                return JSON.stringify(window.quizState);
            }

            function setState(stateStr) {
                try {
                    const parsed = typeof stateStr === 'string' ? JSON.parse(stateStr) : stateStr;
                    window.quizState = {
                        flipped: parsed.flipped || {},
                        score: parsed.score || 0,
                        attempts: parsed.attempts || 0,
                        showAnswer: parsed.showAnswer || false
                    };

                    cards.forEach(card => {
                        const id = card.dataset.cardId;
                        if (window.quizState.flipped[id]) {
                            card.classList.add('flipped');
                        } else {
                            card.classList.remove('flipped');
                        }
                    });
                } catch (e) {
                    console.error('Error setting state:', e);
                }
            }

            // Bind flip events
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.dataset.cardId;
                    card.classList.toggle('flipped');
                    if (card.classList.contains('flipped')) {
                        window.quizState.flipped[id] = true;
                    } else {
                        delete window.quizState.flipped[id];
                    }
                });
            });

            // Function to send template ID to parent
            function sendTemplateId() {
                if (window.parent && window.parent !== window) {
                    try {
                        console.log('🔍 [Template 1] Sending template ID to parent');
                        window.parent.postMessage({
                            type: 'quiz.meta',
                            templateId: 1
                        }, '*');
                    } catch (e) {
                        console.error('🔍 [Template 1] Error sending template ID:', e);
                    }
                }
            }
            
            // JSChannel bindings
            var channel;
            if (window.parent !== window) {
                channel = Channel.build({
                    window: window.parent,
                    origin: '*',
                    scope: 'JSInput'
                });
                channel.bind('getGrade', getGrade);
                channel.bind('getState', getState);
                channel.bind('setState', setState);
                channel.bind('reset', resetQuiz);
            }
            
            // Send timer.start message after template loads (template 1 - no audio, start immediately)
            function sendTimerStart() {
                try {
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'timer.start',
                            templateId: 1,
                            unitId: window.location.href.match(/unit[\/=]([^\/\?&]+)/)?.[1] || ''
                        }, '*');
                        console.log('✅ Sent timer.start message to parent (template 1 - after load)');
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
            
            // Send template ID to parent when page loads (after DOM is ready)
            // Wait for DOM to be ready first
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    sendTemplateId();
                    // Also send after delays to ensure parent is ready
                    setTimeout(sendTemplateId, 100);
                    setTimeout(sendTemplateId, 500);
                    setTimeout(sendTemplateId, 1000);
                });
            } else {
                // DOM is already ready
                sendTemplateId();
                setTimeout(sendTemplateId, 100);
                setTimeout(sendTemplateId, 500);
                setTimeout(sendTemplateId, 1000);
            }
            
            // Also send when window is fully loaded
            if (document.readyState === 'complete') {
                sendTemplateId();
            } else {
                window.addEventListener('load', function() {
                    sendTemplateId();
                });
            }

            // Listen for postMessage from parent
            window.addEventListener('message', function(event) {
                // Handle JSChannel messages (from EdX)
                if (event.data && event.data.method === 'JSInput::getGrade') {
                    getGrade();
                    return;
                }
                
                // Process postMessage from parent window (similar to template 7)
                if (event.source !== window.parent && event.source !== window) {
                    return;
                }
                
                // Send template ID when receiving any message from parent (to ensure parent knows)
                if (event.data && event.data.type) {
                    sendTemplateId();
                }
                
                if (event.data && event.data.type === 'problem.submit') {
                    if (event.data.action === 'check') {
                        getGrade();
                    } else if (event.data.action === 'reset') {
                        resetQuiz();
                    }
                }
                if (event.data && event.data.type === 'reset') {
                    resetQuiz();
                }
                
                // Handle ping message (like template 7)
                if (event.data && event.data.type === 'ping') {
                    sendTemplateId();
                    if (window.parent) {
                        window.parent.postMessage({
                            type: 'pong',
                            data: { message: 'Template 1 is ready!', templateId: 1, timestamp: new Date().toISOString() }
                        }, '*');
                    }
                }
            });
        })();
    </script>
</body>
</html>`;

const convertFurigana = (text) => {
    if (!text || typeof text !== 'string') return text;

    const kanjiWord = "[\\u4E00-\\u9FFF々〆〤ヶ]+";
    const reJaParens = new RegExp("(" + kanjiWord + ")\\s*（([^）]+)）", "g");
    text = text.replace(reJaParens, (match, p1, p2) => `<ruby>${p1}<rt>${p2}</rt></ruby>`);

    const reAsciiParens = new RegExp("(" + kanjiWord + ")\\s*\\(([^)]+)\\)", "g");
    text = text.replace(reAsciiParens, (match, p1, p2) => `<ruby>${p1}<rt>${p2}</rt></ruby>`);

    return text;
};

const splitByCommaOrSemicolon = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) {
        return text.map(item => String(item).trim()).filter(item => item);
    }
    return String(text)
        // Allow users to enter options on new lines
        .replace(/\n+/g, ',')
        .split(/[,;]/)
        .map(item => item.trim())
        .filter(item => item);
};

const splitBySemicolon = (text) => {
    if (!text) return [];
    return String(text)
        // Allow one item per line as well
        .replace(/\n+/g, ';')
        .split(';')
        .map(item => item.trim())
        .filter(item => item);
};

export const getImageFlipPracticeTemplate = (
    instructions = '画像をクリックして答えを確認しましょう。',
    questionText = '',
    answerOptions = '',
    images = ''
) => {
    // Lấy giá trị trực tiếp từ input, không cần split
    const singleImage = images ? String(images).trim() : '';
    const singleQuestion = questionText ? String(questionText).trim() : 'この人は誰ですか？';
    const singleAnswer = answerOptions ? String(answerOptions).trim() : '答えを入力してください';

    // Xử lý question và answer với furigana
    const question = convertFurigana(singleQuestion);
    const answer = convertFurigana(singleAnswer);

    // Hiển thị answer như text đơn giản (không cần list)
    // Luôn hiển thị answer, nếu trống thì hiển thị message mặc định
    let displayAnswer = '';
    if (answerOptions && answerOptions.trim() !== '') {
        displayAnswer = answerOptions.trim();
    } else if (answer && answer !== '答えを入力してください') {
        displayAnswer = answer;
    } else {
        displayAnswer = '答えを入力してください';
    }
    const answerHtml = `<div class="answer-text" style="min-height: 60px; display: block; font-size: 50px; font-weight: bold; line-height: 1.6; color: #F24C4C; white-space: pre-wrap; text-align: center;">${convertFurigana(displayAnswer)}</div>`;

    const imageHtml = singleImage
        ? `<img src="${singleImage}" alt="Practice image" />`
        : `<div class="answer-text">画像が設定されていません。</div>`;

    // Tạo chỉ 1 card duy nhất (chỉ có hình ảnh, không có question text)
    const cards = `
        <div class="flip-card" data-card-id="card_1">
            <div class="card-inner">
                <div class="card-face card-front">
                    <div class="card-image">${imageHtml}</div>
                    <div class="flip-hint-container">
                        <button class="flip-hint-button">Click the card to flip</button>
                    </div>
                </div>
                <div class="card-face card-back" style="display: flex !important; visibility: visible !important;">
                    <div class="card-content" style="background: #fff; padding: 20px; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow-y: auto; box-sizing: border-box;">
                        ${answerHtml}
                    </div>
                    <div class="flip-hint-container">
                        <button class="flip-hint-button">Click the card to flip</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return imageFlipPracticeTemplate
        .replace('{{INSTRUCTIONS}}', instructions || '')
        .replace('{{QUESTION_TEXT}}', question || '質問を入力してください。')
        .replace('{{CARDS}}', cards);
};


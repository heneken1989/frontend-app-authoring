// Import all template functions
import { dragDropQuizTemplate } from './template_20_drag_drop';
import { getFillInBlankTemplate } from './template_10_fill_in_blank';
import { listenFillInBlankTemplate, getListenFillInBlankTemplate } from './template_42_listen_fill_blank';
import { getListenWithImageMultipleDifferentBlankOptionsTemplate } from './template_46_listen_with_image_multiple_different_blank_options';
import { getGrammarDropdownTemplate } from './template_18_grammar_dropdown';
import { getGrammarSentenceRearrangementTemplate } from './template_22_grammar_sentence_rearrangement';
import { getGrammarSingleSelectTemplate } from './template_28_grammar_single_select';
import { getReadingMultipleQuestionTemplate } from './template_31_reading_multiple_question';
import { getReadingMultipleQuestionTemplate as getReadingMultipleQuestionTemplate32 } from './template_32_reading_multiple_question';
import { getReadingDroplistTemplate } from './template_51_reading_droplist';
import { getReadingDroplistTemplate as getReadingDroplistNoImageTemplate } from './template_59_reading_droplist_no_image';
import { readingSelectTemplate, getReadingSelectTemplate } from './template_33_reading_select';
import { getVocabMatchingTemplate } from './template_2_vocab_matching';

const fillBlankQuizTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>Fill in the Blank Quiz</title>
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
            padding: 0rem;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
            line-height: 1;
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

            // Check cookie on load
            document.addEventListener('DOMContentLoaded', function() {
                if (document.cookie.includes('showAnswerParagraph=true')) {
                    console.log("Found cookie, showing answer");
                    const result = calculateResults();
                    updateDisplay(result);
                    document.getElementById('answer-paragraph').style.display = 'block';
                }
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

const processParagraph = (paragraphText) => {
  const blanks = {};
  let currentId = 1;
  
  // Process the paragraph to replace blanks
  const processedParagraph = paragraphText.replace(/\[BLANK\s*\d*:\s*([^\]]+)\]/g, (match, content) => {
    const blankId = `blank${currentId}`;
    const options = content.split('|').map(opt => opt.trim());
    const correctAnswer = options[0]; // First option is correct
    blanks[blankId] = correctAnswer;
    currentId += 1;
    return `<input type="text" id="${blankId}" class="blank-input" placeholder="Type your answer">`;
  });

  return {
    processedParagraph,
    blanks
  };
};

const getQuizTemplate = (paragraphText) => {
  const { processedParagraph, blanks } = processParagraph(paragraphText);
  
  // Replace placeholders in the template
  return fillBlankQuizTemplate
    .replace('{{PARAGRAPH_TEXT}}', processedParagraph)
    .replace('{{CORRECT_ANSWERS}}', JSON.stringify(blanks));
};

const processDragDropQuiz = (paragraphText, words) => {
  const blanks = {};
  let currentId = 1;
  
  // Process the paragraph to replace blanks marked with （ー）
  const processedParagraph = paragraphText.replace(/（ー）/g, (match) => {
    const blankId = `blank${currentId}`;
    const correctAnswer = words[currentId - 1]; // Get the correct word from the array
    blanks[blankId] = correctAnswer;
    currentId += 1;
    return `<div id="${blankId}" class="blank" draggable="false"></div>`;
  });

  // Create a copy of words array and shuffle it
  const shuffledWords = [...words];
  for (let i = shuffledWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
  }

  // Create word bank HTML with the shuffled words
  const wordBankHTML = shuffledWords.map(word => 
    `<div class="draggable-word" draggable="true">${word}</div>`
  ).join('');

  return {
    processedParagraph,
    wordBankHTML,
    blanks
  };
};

const getDragDropQuizTemplate = (paragraphText, words) => {
  const { processedParagraph, wordBankHTML, blanks } = processDragDropQuiz(paragraphText, words);
  
  // Replace placeholders in the template
  return dragDropQuizTemplate
    .replace('{{PARAGRAPH_TEXT}}', processedParagraph)
    .replace('{{WORD_BANK}}', wordBankHTML)
    .replace('{{CORRECT_ANSWERS}}', JSON.stringify(blanks));
};

// Template IDs - matching actual template files
export const TEMPLATE_IDS = {
  VOCAB_MATCHING: 2,                                    // template_2_vocab_matching.js
  FILL_IN_BLANK: 10,                                   // template_10_fill_in_blank.js
  GRAMMAR_DROPDOWN: 18,                                // template_18_grammar_dropdown.js
  GRAMMAR_SENTENCE_REARRANGEMENT: 22,                  // template_22_grammar_sentence_rearrangement.js
  GRAMMAR_SINGLE_SELECT: 28,                           // template_28_grammar_single_select.js
  GRAMMAR_SINGLE_SELECT_ALT: 29,                       // Uses template_28_grammar_single_select.js
  DRAG_DROP_OLD: 20,                                   // template_20_drag_drop.js  
  LISTEN_SINGLE_CHOICE: 39,                           // template_39_listen_single_choice.js
  LISTEN_SINGLE_CHOICE_NO_IMAGE: 40,                  // template_40_listen_single_choice_no_image.js
  HIGHLIGHT_JAPANESE: 41,                             // template_41_highlight_japanese.js
  LISTEN_FILL_BLANK: 42,                              // template_42_listen_fill_blank.js
  LISTEN_WITH_IMAGE_MULTIPLE_DIFFERENT_BLANK_OPTIONS: 46, // template_46_listen_with_image_multiple_different_blank_options.js
  READING_SAME_31: 32,                                // template_32_reading_multiple_question.js
  LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER: 63,            // template_63_listen_image_select_multiple_answer.js
  LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER_MULTIOPTIONS: 65, // template_65_listen_image_select_multiple_answer_multioptions.js
  LISTEN_WRITE_ANSWER_WITH_IMAGE: 67,                  // template_67_listen_write_answer_with_image.js
  READING_MULTIPLE_QUESTION: 31,                       // template_31_reading_multiple_question.js
  READING_MULTIPLE_QUESTION_ALT: 37,                   // Uses template_31_reading_multiple_question.js
  READING_DROPLIST: 51,                                // template_51_reading_droplist.js
  READING_DROPLIST_NO_IMAGE: 59,                       // template_59_reading_droplist_no_image.js
  READING_SELECT: 33,                                  // template_33_reading_select.js
  READING_SELECT_1: 36,                                // Uses template_33_reading_select.js
  ID38_READING_SELECT_2: 38,                           // Uses template_33_reading_select.js
};

export {
  getQuizTemplate,
  getDragDropQuizTemplate,
  getListenFillInBlankTemplate,
  getFillInBlankTemplate,
  getListenWithImageMultipleDifferentBlankOptionsTemplate,
  getGrammarDropdownTemplate,
  getGrammarSentenceRearrangementTemplate,
  getGrammarSingleSelectTemplate,
  getReadingMultipleQuestionTemplate,
  getReadingMultipleQuestionTemplate32,
  getReadingDroplistTemplate,
  getReadingDroplistNoImageTemplate,
  getReadingSelectTemplate
}; 
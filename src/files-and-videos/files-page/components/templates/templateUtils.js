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
const processParagraph = (paragraphText) => {
  const blanks = {};
  let currentId = 1;
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

const getDragDropQuizTemplate = (paragraphText, words, instructions = '正しい　ものを　一つ　えらびましょう。') => {
  const { processedParagraph, wordBankHTML, blanks } = processDragDropQuiz(paragraphText, words);
  
  // Replace placeholders in the template
  return dragDropQuizTemplate
    .replace('{{PARAGRAPH_TEXT}}', processedParagraph)
    .replace('{{WORD_BANK}}', wordBankHTML)
    .replace('{{CORRECT_ANSWERS}}', JSON.stringify(blanks))
    .replace('{{INSTRUCTIONS}}', instructions);
};

// Template IDs - matching actual template files
export const TEMPLATE_IDS = {
  VOCAB_MATCHING: 2,                                    // template_2_vocab_matching.js
  ID3_VOCAB_SINGLE_CHOICE: 3,                          // Uses template_28_grammar_single_select.js
  ID4_VOCAB_SINGLE_SELECT_1: 4,                        // Uses template_28_grammar_single_select.js
  ID5_VOCAB_SINGLE_SELECT_2: 5,                        // Uses template_28_grammar_single_select.js
  ID6_GRAMMAR_DROPDOWN: 6,                        // Uses template_28_grammar_single_select.js
  ID7_VOCAB_SINGLE_SELECT_3: 7,   
  ID8_VOCAB_SINGLE_SELECT_4: 8,  
  ID9_VOCAB_SINGLE_SELECT_5: 9,
  ID10_VOCAB_SINGLE_SELECT_6: 10,    
  ID12_VOCAB_DRAG_DROP: 12,                                // Uses template_20_drag_drop.js
  ID13_VOCAB_SINGLE_SELECT_7: 13,                                // Uses template_20_drag_drop.js
  ID14_VOCAB_SINGLE_SELECT_8: 14,                                // Uses template_20_drag_drop.js
  ID15_VOCAB_SINGLE_SELECT_9: 15,                                // Uses template_20_drag_drop.js
  ID16_VOCAB_SINGLE_SELECT_10: 16,                                // Uses template_20_drag_drop.js
  ID17_VOCAB_SINGLE_SELECT_11: 17,                                // Uses template_20_drag_drop.js
  GRAMMAR_DROPDOWN: 18,                                // template_18_grammar_dropdown.js
  ID19_GRAMMAR_DROPDOWN: 19,  
  ID21_GRAMMAR_DROPDOWN: 21,                               // template_18_grammar_dropdown.js
  GRAMMAR_SENTENCE_REARRANGEMENT: 22,  
  ID27_GRAMMAR_SENTENCE_REARRANGEMENT: 27,                  // template_22_grammar_sentence_rearrangement.js
  ID23_GRAMMAR_DROPDOWN: 23,              // Uses template_22_grammar_sentence_rearrangement.js
  ID24_GRAMMAR_DROPDOWN: 24,              // Uses template_22_grammar_sentence_rearrangement.js
  ID62_GRAMMAR_DROPDOWN: 62,   
  ID26_GRAMMAR_DROPDOWN: 26, 
  ID30_GRAMMAR_DROPDOWN: 30,
  ID25_DRAG_DROP: 25,              // Uses template_20_drag_drop.js
  
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
  ID34_READING_MULTIPLE_QUESTION: 34,                   // Uses template_31_reading_multiple_question.js
  READING_MULTIPLE_QUESTION_ALT: 37,                   // Uses template_31_reading_multiple_question.js
  READING_DROPLIST: 51,                                // template_51_reading_droplist.js
  READING_DROPLIST_NO_IMAGE: 59,                       // template_59_reading_droplist_no_image.js
  READING_SELECT: 33,                                  // template_33_reading_select.js
  READING_SELECT_1: 36,                                // Uses template_33_reading_select.js
  ID38_READING_SELECT_2: 38,                           // Uses template_33_reading_select.js
  ID43_LISTEN_FILL_BLANK_2: 43,   
  ID44_LISTEN_SINGLE_CHOICE_NO_IMAGE: 44,
  ID45_LISTEN_HIGHTLIGHT: 45,
  ID47_LISTEN_SINGLE_CHOICE: 47,  
  ID64_LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER: 64,
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
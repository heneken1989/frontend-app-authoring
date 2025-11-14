import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, ModalDialog, Form, ActionRow } from '@openedx/paragon';
import { Quiz, Upload } from '@openedx/paragon/icons';
import quizMessages from '../quiz-messages';
import { 
  getQuizTemplate, 
  getDragDropQuizTemplate, 
  processGrammarSentenceRearrangement,
  getListenFillInBlankTemplate, 
  getFillInBlankTemplate, 
  getListenWithImageMultipleDifferentBlankOptionsTemplate,
  getGrammarDropdownTemplate,
  getGrammarSentenceRearrangementTemplate,
  getGrammarSingleSelectTemplate,
  getGrammarSingleSelectTemplate7,
  getReadingMultipleQuestionTemplate,
  getReadingMultipleQuestionTemplate32,
  getReadingDroplistTemplate,
  getReadingDroplistNoImageTemplate,
  getReadingSelectTemplate,
  TEMPLATE_IDS 
} from './templates/templateUtils';
import { getGrammarSingleSelectTemplate29 } from './templates/template_29_grammar_single_select';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useDispatch } from 'react-redux';
import { addAssetFile } from '../data/thunks';
import { highlightFillStyleTemplate } from './templates/template_41_highlight_japanese';
import { getListenSingleChoiceTemplate } from './templates/template_39_listen_single_choice';
import { getListenSingleChoiceNoImageTemplate } from './templates/template_40_listen_single_choice_no_image';
import { getListenImageSelectMultipleAnswerTemplate } from './templates/template_63_listen_image_select_multiple_answer';
import { getListenImageSelectMultipleAnswerTemplate65 } from './templates/template_65_listen_image_select_multiple_answer';
import { getListenWriteAnswerWithImageTemplate } from './templates/template_67_listen_write_answer_with_image';
import { getReadingMultipleQuestionTemplate311 } from './templates/template_311_reading_multiple_question';
import { getReadingMultipleQuestionTemplate as getReadingMultipleQuestionTemplate37 } from './templates/template_37_reading_multiple_question';
import FORM_COMPONENTS, { getFormComponent } from './forms';
import { getVocabMatchingTemplate } from './templates/template_2_vocab_matching';
import * as XLSX from 'xlsx'; // Added for Excel parsing

// Function to convert furigana format from 車(くるま) to <ruby>車<rt>くるま</rt></ruby>
const convertFurigana = (text) => {
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
};

// Function to add spaces before and after special characters for Japanese text processing
const addSpacesAfterSpecialChars = (text) => {
  if (!text || typeof text !== "string") return text;
  
  // First, replace line breaks with BREAK marker to preserve them
  const textWithLineBreakMarkers = text.replace(/\n/g, 'BREAK');
  
  // Add space before and after punctuation marks and special characters
  // This helps preserve spacing when text is split by spaces
  // Note: Both () and （） are excluded because they are used for furigana
  const processedText = textWithLineBreakMarkers
    // Add space before and after Japanese punctuation marks
    .replace(/([。、！？；：])/g, ' $1 ')
    // Add space before and after brackets (but not parentheses () or （） for furigana)
    .replace(/([「」『』【】〈〉《》])/g, ' $1 ')
    // Add space before and after commas and periods
    .replace(/([，．])/g, ' $1 ')
    // Add space before and after quotation marks
    .replace(/([""''`])/g, ' $1 ')
    // Add space before and after dashes and hyphens
    .replace(/([—–-])/g, ' $1 ')
    // Add space before and after other common punctuation
    .replace(/([：；！？])/g, ' $1 ')
    // Clean up multiple spaces (but preserve BREAK markers)
    .replace(/(?<!BREAK)\s+(?!BREAK)/g, ' ')
    .trim();
  
  // Keep BREAK markers for template processing
  return processedText;
};


// Excel parsing function
const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and convert to quiz data format
        const headers = jsonData[0];
        const quizRows = jsonData.slice(1);
        
        // Debug: Log headers to see available columns
        console.log('🔍 Excel Headers:', headers);
        console.log('🔍 Has "images" column?', headers.some(h => h && h.trim().toLowerCase() === 'images'));
        
        const quizzes = quizRows.map((row, index) => {
          const quiz = {};
          headers.forEach((header, colIndex) => {
            if (header && row[colIndex] !== undefined) {
              // Trim header and normalize (case-insensitive for common fields)
              const normalizedHeader = header.trim();
              const normalizedLower = normalizedHeader.toLowerCase();
              
              // Map common variations of column names
              let finalHeader = normalizedHeader;
              if (normalizedLower === 'images' || normalizedLower === 'image' || normalizedLower === 'imageurls') {
                finalHeader = 'images';
              }
              
              quiz[finalHeader] = row[colIndex];
            }
          });
          
          // Debug: Log images value for each quiz row
          if (quiz.images !== undefined) {
            console.log(`🔍 Quiz row ${index + 1} - images value:`, {
              images: quiz.images,
              type: typeof quiz.images,
              isUndefined: quiz.images === undefined,
              isNull: quiz.images === null,
              isEmpty: quiz.images === '',
              value: String(quiz.images || 'undefined/empty')
            });
          } else {
            console.log(`🔍 Quiz row ${index + 1} - images column NOT FOUND in Excel`);
          }
          
          // Parse time range if exists (format: "1-1.1" means 1 second to 1 minute 10 seconds = 70 seconds)
          if (quiz.timeRange && typeof quiz.timeRange === 'string') {
            const timeRangeParts = quiz.timeRange.split('-');
            if (timeRangeParts.length === 2) {
              const startTime = parseFloat(timeRangeParts[0]) || 0;
              const endTimePart = timeRangeParts[1];
              
              // Parse end time: format like "1.1" = 1 minute 10 seconds, "1.05" = 1 minute 5 seconds
              let endTime = 0;
              if (endTimePart.includes('.')) {
                const [minutes, secondsPart] = endTimePart.split('.');
                const minutesNum = parseInt(minutes) || 0;
                // Convert seconds part: "1" = 10s, "05" = 5s, "15" = 15s
                const secondsNum = parseInt(secondsPart.padEnd(2, '0').substring(0, 2)) || 0;
                endTime = minutesNum * 60 + secondsNum;
              } else {
                // If no decimal point, treat as seconds
                endTime = parseFloat(endTimePart) || 0;
              }
              
              quiz.startTime = startTime;
              quiz.endTime = endTime;
              
              console.log(`Parsed time range "${quiz.timeRange}": start=${startTime}s, end=${endTime}s (${Math.floor(endTime/60)}:${String(endTime%60).padStart(2,'0')})`);
            }
          }
          
          // Alternative: Parse separate startTime-endTime column (format: "1-70" or "1-1.05")
          if (quiz.startEndTime && typeof quiz.startEndTime === 'string') {
            const timeParts = quiz.startEndTime.split('-');
            if (timeParts.length === 2) {
              const startTime = parseFloat(timeParts[0]) || 0;
              const endTimePart = timeParts[1];
              
              // Parse end time with same logic as above
              let endTime = 0;
              if (endTimePart.includes('.')) {
                const [minutes, secondsPart] = endTimePart.split('.');
                const minutesNum = parseInt(minutes) || 0;
                const secondsNum = parseInt(secondsPart.padEnd(2, '0').substring(0, 2)) || 0;
                endTime = minutesNum * 60 + secondsNum;
              } else {
                endTime = parseFloat(endTimePart) || 0;
              }
              
              quiz.startTime = startTime;
              quiz.endTime = endTime;
              console.log(`Parsed start-end time "${quiz.startEndTime}": start=${startTime}s, end=${endTime}s (${Math.floor(endTime/60)}:${String(endTime%60).padStart(2,'0')})`);
            }
          }
          
          // NEW: Parse startTime/endTime column (format: "0.34-0.50" = 34 seconds to 50 seconds)
          if (quiz['startTime/endTime'] && typeof quiz['startTime/endTime'] === 'string') {
            const timeValue = quiz['startTime/endTime'];
            console.log('🔍 Processing startTime/endTime:', timeValue);
            
            // Check if it contains semicolon (multiple segments)
            if (timeValue.includes(';')) {
              // Multiple segments format: "0.04-0.09;0.21-0.30"
              quiz.timeSegmentsString = timeValue;
              console.log('🔍 Detected multiple segments, setting timeSegmentsString:', timeValue);
            } else {
              // Single segment format: "0.34-0.50"
              const timeParts = timeValue.split('-');
              if (timeParts.length === 2) {
                // Parse start time: "0.34" = 34 seconds
                const startTimePart = timeParts[0];
                let startTime = 0;
                if (startTimePart.includes('.')) {
                  const [minutes, secondsPart] = startTimePart.split('.');
                  const minutesNum = parseInt(minutes) || 0;
                  const secondsNum = parseInt(secondsPart.padEnd(2, '0').substring(0, 2)) || 0;
                  startTime = minutesNum * 60 + secondsNum;
                } else {
                  startTime = parseFloat(startTimePart) || 0;
                }
                
                // Parse end time: "0.50" = 50 seconds
                const endTimePart = timeParts[1];
                let endTime = 0;
                if (endTimePart.includes('.')) {
                  const [minutes, secondsPart] = endTimePart.split('.');
                  const minutesNum = parseInt(minutes) || 0;
                  const secondsNum = parseInt(secondsPart.padEnd(2, '0').substring(0, 2)) || 0;
                  endTime = minutesNum * 60 + secondsNum;
                } else {
                  endTime = parseFloat(endTimePart) || 0;
                }
                
                quiz.startTime = startTime;
                quiz.endTime = endTime;
                console.log(`Parsed single segment startTime/endTime "${timeValue}": start=${startTime}s, end=${endTime}s`);
              }
            }
          }
          
          // NEW: Parse timeSegments column (format: "0.04-0.09;0.21-0.30" = multiple segments)
          if (quiz.timeSegments && typeof quiz.timeSegments === 'string') {
            // Store the original timeSegments string for templates that support it
            quiz.timeSegmentsString = quiz.timeSegments;
            console.log(`Found timeSegments: "${quiz.timeSegments}"`);
          }
          
          return quiz;
        }).filter(quiz => quiz.problemTypeId || quiz.unitTitle); // Filter out empty rows
        
        resolve(quizzes);
      } catch (error) {
        reject(new Error(`Error parsing Excel file: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

// Helper functions for field visibility
const shouldShowAudioField = (problemTypeId) => ![
  TEMPLATE_IDS.FILL_IN_BLANK,
  TEMPLATE_IDS.GRAMMAR_DROPDOWN,
  TEMPLATE_IDS.GRAMMAR_SENTENCE_REARRANGEMENT,
  TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT,
  TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT_ALT,
  TEMPLATE_IDS.READING_MULTIPLE_QUESTION,
  TEMPLATE_IDS.READING_SAME_31,
  TEMPLATE_IDS.READING_DROPLIST,
  TEMPLATE_IDS.READING_SELECT,  // Add Reading Select to the list of templates that don't need audio
  TEMPLATE_IDS.READING_SELECT_1, // Add Reading Select 1 to the list of templates that don't need audio
  TEMPLATE_IDS.ID38_READING_SELECT_2, // Add Reading Select 2 to the list of templates that don't need audio
  TEMPLATE_IDS.VOCAB_MATCHING,
  TEMPLATE_IDS.ID3_VOCAB_SINGLE_CHOICE, // Add ID3 to the list
  TEMPLATE_IDS.ID4_VOCAB_SINGLE_SELECT_1, // Add ID4 to the list
  TEMPLATE_IDS.ID7_VOCAB_SINGLE_SELECT_3, // Add ID7 to the list
  TEMPLATE_IDS.ID8_VOCAB_SINGLE_SELECT_4, // Add ID8 to the list
  TEMPLATE_IDS.ID9_VOCAB_SINGLE_SELECT_5, // Add ID9 to the list
  TEMPLATE_IDS.ID10_VOCAB_SINGLE_SELECT_6, // Add ID10 to the list
  TEMPLATE_IDS.ID12_VOCAB_DRAG_DROP, // Add ID12 to the list
  TEMPLATE_IDS.DRAG_DROP_OLD, // Add ID20 to the list
  TEMPLATE_IDS.ID13_VOCAB_SINGLE_SELECT_7, // Add ID13 to the list
  TEMPLATE_IDS.ID14_VOCAB_SINGLE_SELECT_8, // Add ID14 to the list
  TEMPLATE_IDS.ID15_VOCAB_SINGLE_SELECT_9, // Add ID15 to the list
  TEMPLATE_IDS.ID16_VOCAB_SINGLE_SELECT_10, // Add ID16 to the list
  TEMPLATE_IDS.ID17_VOCAB_SINGLE_SELECT_11, // Add ID17 to the list
  TEMPLATE_IDS.ID19_GRAMMAR_DROPDOWN,
  TEMPLATE_IDS.ID29_GRAMMAR_SINGLE_SELECT,
  TEMPLATE_IDS.ID311_READING_MULTIPLE_QUESTION, // Add ID311 to the list (same as template 31)
  
].includes(problemTypeId);

const shouldShowImageField = (problemTypeId) => ![
  TEMPLATE_IDS.FILL_IN_BLANK,
  TEMPLATE_IDS.GRAMMAR_DROPDOWN,
  TEMPLATE_IDS.GRAMMAR_SENTENCE_REARRANGEMENT,
  TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT,
  TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT_ALT,
  TEMPLATE_IDS.READING_SAME_31,
  TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER_MULTIOPTIONS,
  TEMPLATE_IDS.LISTEN_SINGLE_CHOICE_NO_IMAGE,
  TEMPLATE_IDS.READING_DROPLIST_NO_IMAGE,
  TEMPLATE_IDS.LISTEN_WRITE_ANSWER_WITH_IMAGE, // Add ID67 to the list
  TEMPLATE_IDS.ID3_VOCAB_SINGLE_CHOICE, // Add ID3 to the list
  TEMPLATE_IDS.ID4_VOCAB_SINGLE_SELECT_1, // Add ID4 to the list
  TEMPLATE_IDS.ID7_VOCAB_SINGLE_SELECT_3,
  TEMPLATE_IDS.ID8_VOCAB_SINGLE_SELECT_4,
  TEMPLATE_IDS.ID9_VOCAB_SINGLE_SELECT_5,
  TEMPLATE_IDS.ID10_VOCAB_SINGLE_SELECT_6,
  TEMPLATE_IDS.ID12_VOCAB_DRAG_DROP, // Add ID12 to the list
  TEMPLATE_IDS.DRAG_DROP_OLD, // Add ID20 to the list
  TEMPLATE_IDS.ID13_VOCAB_SINGLE_SELECT_7, // Add ID13 to the list
  TEMPLATE_IDS.ID14_VOCAB_SINGLE_SELECT_8, // Add ID14 to the list
  TEMPLATE_IDS.ID15_VOCAB_SINGLE_SELECT_9, // Add ID15 to the list
  TEMPLATE_IDS.ID16_VOCAB_SINGLE_SELECT_10, // Add ID16 to the list
  TEMPLATE_IDS.ID17_VOCAB_SINGLE_SELECT_11, // Add ID17 to the list
  TEMPLATE_IDS.ID19_GRAMMAR_DROPDOWN, // Add ID19 to the list
  TEMPLATE_IDS.ID29_GRAMMAR_SINGLE_SELECT, // Add ID29 to the list
  TEMPLATE_IDS.ID34_READING_MULTIPLE_QUESTION,
].includes(problemTypeId);

// QuizModal Component
const QuizModal = ({ isOpen, onClose, onSubmit, quizData, setQuizData, intl, courseId, dispatch }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // Get the appropriate form component for the selected problem type
  const FormComponent = getFormComponent(quizData.problemTypeId);

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={intl.formatMessage(quizMessages.generateQuizTitle)}
      hasCloseButton
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {intl.formatMessage(quizMessages.generateQuizTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Problem Type</Form.Label>
            <Form.Control
              as="select"
              value={quizData.problemTypeId}
              onChange={(e) => {
                const newTypeId = parseInt(e.target.value, 10);
                console.log('Selected problem type:', newTypeId, typeof newTypeId);
                setQuizData(prev => ({
                    ...prev,
                    problemTypeId: newTypeId,
                    instructions: newTypeId === TEMPLATE_IDS.READING_MULTIPLE_QUESTION 
                      ? '以下の文章を読んで、質問に答えてください。'
                      : newTypeId === TEMPLATE_IDS.READING_MULTIPLE_QUESTION_ALT
                      ? 'つぎのぶんしょうを読(よ)んで、質問(しつもん)にこたえてください。答(こた)えは、１・２・３・４からいちばん いいものを一(ひと)つ えらんでください。'
                      : newTypeId === TEMPLATE_IDS.ID38_READING_SELECT_2
                      ? '情報の内容を見て、下のしつもんにこたえてください。こたえは、1・2・3・4からいちばんいいものを一つえらんでください。'
                      : prev.instructions
                }));
              }}
            >
          
              <option value={TEMPLATE_IDS.GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.GRAMMAR_SENTENCE_REARRANGEMENT}>{TEMPLATE_IDS.GRAMMAR_SENTENCE_REARRANGEMENT} - Grammar Sentence Rearrangement Quiz</option>
              <option value={TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT}>{TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT} - Grammar Single Select Quiz</option>
              <option value={TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT_ALT}>{TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT_ALT} - Grammar Single Select Quiz (Alternative)</option>
              <option value={TEMPLATE_IDS.DRAG_DROP_OLD}>{TEMPLATE_IDS.DRAG_DROP_OLD} - Drag and Drop Quiz</option>
              <option value={TEMPLATE_IDS.ID25_DRAG_DROP}>{TEMPLATE_IDS.ID25_DRAG_DROP} - Drag and Drop Quiz</option>
              <option value={TEMPLATE_IDS.LISTEN_SINGLE_CHOICE}>{TEMPLATE_IDS.LISTEN_SINGLE_CHOICE} - Listen and Choose Quiz ID39</option>
              <option value={TEMPLATE_IDS.LISTEN_SINGLE_CHOICE_NO_IMAGE}>{TEMPLATE_IDS.LISTEN_SINGLE_CHOICE_NO_IMAGE} - Listen and Choose Quiz (No Image)</option>
              <option value={TEMPLATE_IDS.HIGHLIGHT_JAPANESE}>{TEMPLATE_IDS.HIGHLIGHT_JAPANESE} - Highlight Word Quiz (Japanese)</option>
              <option value={TEMPLATE_IDS.LISTEN_FILL_BLANK}>{TEMPLATE_IDS.LISTEN_FILL_BLANK} - Listen and Fill in the Blank Quiz</option>
              <option value={TEMPLATE_IDS.LISTEN_WITH_IMAGE_MULTIPLE_DIFFERENT_BLANK_OPTIONS}>{TEMPLATE_IDS.LISTEN_WITH_IMAGE_MULTIPLE_DIFFERENT_BLANK_OPTIONS} - Listen with Image Multiple Different Blank Options</option>
              <option value={TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER}>{TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER} - Listen and Image Select Multiple Answer</option>
              <option value={TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER_MULTIOPTIONS}>{TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER_MULTIOPTIONS} - Listen and Image Select Multiple Answer (MultiOptions)</option>
              <option value={TEMPLATE_IDS.LISTEN_WRITE_ANSWER_WITH_IMAGE}>{TEMPLATE_IDS.LISTEN_WRITE_ANSWER_WITH_IMAGE} - Listen Write Answer with Image Quiz</option>
              <option value={TEMPLATE_IDS.READING_MULTIPLE_QUESTION}>{TEMPLATE_IDS.READING_MULTIPLE_QUESTION} - Reading Multiple Question</option>
              <option value={TEMPLATE_IDS.READING_MULTIPLE_QUESTION_ALT}>{TEMPLATE_IDS.READING_MULTIPLE_QUESTION_ALT} - Reading Multiple Question (Alternative)</option>
              <option value={TEMPLATE_IDS.READING_SAME_31}>{TEMPLATE_IDS.READING_SAME_31} - Reading Same as 31</option>
              <option value={TEMPLATE_IDS.READING_DROPLIST}>{TEMPLATE_IDS.READING_DROPLIST} - Reading Droplist</option>
              <option value={TEMPLATE_IDS.READING_DROPLIST_NO_IMAGE}>{TEMPLATE_IDS.READING_DROPLIST_NO_IMAGE} - Reading Droplist No Image</option>
              <option value={TEMPLATE_IDS.READING_SELECT}>33 - Reading Select Quiz</option>
              <option value={TEMPLATE_IDS.READING_SELECT_1}>36 - Reading Select Quiz 1</option>
              <option value={TEMPLATE_IDS.ID38_READING_SELECT_2}>38 - Reading Select Quiz 2</option>
              <option value={TEMPLATE_IDS.READING_MULTIPLE_QUESTION_CONVERSATION}>{TEMPLATE_IDS.READING_MULTIPLE_QUESTION_CONVERSATION} - Reading Multiple Question (Conversation)</option>
              <option value={TEMPLATE_IDS.VOCAB_MATCHING}>{TEMPLATE_IDS.VOCAB_MATCHING} - Vocabulary Matching Quiz</option>
              <option value={TEMPLATE_IDS.ID3_VOCAB_SINGLE_CHOICE}>{TEMPLATE_IDS.ID3_VOCAB_SINGLE_CHOICE} - Vocabulary Single Choice Quiz</option>
              <option value={TEMPLATE_IDS.ID4_VOCAB_SINGLE_SELECT_1}>{TEMPLATE_IDS.ID4_VOCAB_SINGLE_SELECT_1} - Vocabulary Single Choice Quiz 1</option>
              <option value={TEMPLATE_IDS.ID5_VOCAB_SINGLE_SELECT_2}>{TEMPLATE_IDS.ID5_VOCAB_SINGLE_SELECT_2} - Vocabulary Single Choice Quiz 2</option>
              <option value={TEMPLATE_IDS.ID6_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID6_GRAMMAR_DROPDOWN} - Vocabulary Single Choice Quiz 3</option>
              <option value={TEMPLATE_IDS.ID7_VOCAB_SINGLE_SELECT_3}>{TEMPLATE_IDS.ID7_VOCAB_SINGLE_SELECT_3} - Vocabulary Single Choice Quiz 3</option>
              <option value={TEMPLATE_IDS.ID8_VOCAB_SINGLE_SELECT_4}>{TEMPLATE_IDS.ID8_VOCAB_SINGLE_SELECT_4} - Vocabulary Single Choice Quiz 4</option>
              <option value={TEMPLATE_IDS.ID9_VOCAB_SINGLE_SELECT_5}>{TEMPLATE_IDS.ID9_VOCAB_SINGLE_SELECT_5} - Vocabulary Single Choice Quiz 5</option>
              <option value={TEMPLATE_IDS.ID10_VOCAB_SINGLE_SELECT_6}>{TEMPLATE_IDS.ID10_VOCAB_SINGLE_SELECT_6} - Vocabulary Single Choice Quiz 6</option>  
              <option value={TEMPLATE_IDS.ID12_VOCAB_DRAG_DROP}>{TEMPLATE_IDS.ID12_VOCAB_DRAG_DROP} - Vocabulary Drag and Drop Quiz</option>
              <option value={TEMPLATE_IDS.ID13_VOCAB_SINGLE_SELECT_7}>{TEMPLATE_IDS.ID13_VOCAB_SINGLE_SELECT_7} - Vocabulary Single Choice Quiz 7</option>
              <option value={TEMPLATE_IDS.ID14_VOCAB_SINGLE_SELECT_8}>{TEMPLATE_IDS.ID14_VOCAB_SINGLE_SELECT_8} - Vocabulary Single Choice Quiz 8</option>
              <option value={TEMPLATE_IDS.ID15_VOCAB_SINGLE_SELECT_9}>{TEMPLATE_IDS.ID15_VOCAB_SINGLE_SELECT_9} - Vocabulary Single Choice Quiz 9</option>
              <option value={TEMPLATE_IDS.ID16_VOCAB_SINGLE_SELECT_10}>{TEMPLATE_IDS.ID16_VOCAB_SINGLE_SELECT_10} - Vocabulary Single Choice Quiz 10</option>
              <option value={TEMPLATE_IDS.ID17_VOCAB_SINGLE_SELECT_11}>{TEMPLATE_IDS.ID17_VOCAB_SINGLE_SELECT_11} - Vocabulary Single Choice Quiz 11</option>
              <option value={TEMPLATE_IDS.ID19_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID19_GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.ID21_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID21_GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.ID23_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID23_GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.ID24_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID24_GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.ID26_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID26_GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.ID27_GRAMMAR_SENTENCE_REARRANGEMENT}>{TEMPLATE_IDS.ID27_GRAMMAR_SENTENCE_REARRANGEMENT} - Grammar Sentence Rearrangement Quiz</option>
              <option value={TEMPLATE_IDS.ID30_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID30_GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.ID34_READING_MULTIPLE_QUESTION}>{TEMPLATE_IDS.ID34_READING_MULTIPLE_QUESTION} - Reading Multiple Question</option>
              <option value={TEMPLATE_IDS.ID43_LISTEN_FILL_BLANK_2}>{TEMPLATE_IDS.ID43_LISTEN_FILL_BLANK_2} - Listen and Fill in the Blank Quiz 2</option>
              <option value={TEMPLATE_IDS.ID44_LISTEN_SINGLE_CHOICE_NO_IMAGE}>{TEMPLATE_IDS.ID44_LISTEN_SINGLE_CHOICE_NO_IMAGE} - Listen and Choose Quiz (No Image)</option>
              <option value={TEMPLATE_IDS.ID42_LISTEN_FILL_BLANK}>{TEMPLATE_IDS.ID42_LISTEN_FILL_BLANK} - Listen and Fill in the Blank Quiz</option>
              <option value={TEMPLATE_IDS.ID45_LISTEN_HIGHTLIGHT}>{TEMPLATE_IDS.ID45_LISTEN_HIGHTLIGHT} - Highlight Word Quiz (Japanese) 2</option>
              <option value={TEMPLATE_IDS.ID47_LISTEN_SINGLE_CHOICE}>{TEMPLATE_IDS.ID47_LISTEN_SINGLE_CHOICE} - Listen and Choose Quiz (No Image)</option>
              <option value={TEMPLATE_IDS.ID62_GRAMMAR_DROPDOWN}>{TEMPLATE_IDS.ID62_GRAMMAR_DROPDOWN} - Grammar Dropdown Quiz</option>
              <option value={TEMPLATE_IDS.ID64_LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER}>{TEMPLATE_IDS.ID64_LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER} - Listen and Image Select Multiple Answer</option>
              <option value={TEMPLATE_IDS.ID29_GRAMMAR_SINGLE_SELECT}>{TEMPLATE_IDS.ID29_GRAMMAR_SINGLE_SELECT} - Grammar Single Select Quiz 29</option>
              <option value={TEMPLATE_IDS.ID311_READING_MULTIPLE_QUESTION}>{TEMPLATE_IDS.ID311_READING_MULTIPLE_QUESTION} - Reading Multiple Question (Dropdown)</option>
            </Form.Control>
            <Form.Text>
              Select the type of quiz you want to create.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Unit Title</Form.Label>
            <Form.Control
              type="text"
              value={quizData.unitTitle}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  unitTitle: e.target.value
                }));
              }}
              placeholder="Enter the title for this JavaScript Unit"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Time Limit (seconds)</Form.Label>
            <Form.Control
              type="number"
              value={quizData.timeLimit}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  timeLimit: parseInt(e.target.value, 10)
                }));
              }}
              placeholder="Enter time limit in seconds"
              min="0"
            />
            <Form.Text>
              Set the time limit for completing this quiz. Default is 60 seconds.
              <br />
              <strong>Note:</strong> This will be saved directly in seconds.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Publish</Form.Label>
            <Form.Check
              type="checkbox"
              label="Make this problem visible to learners"
              checked={quizData.published}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  published: e.target.checked
                }));
              }}
            />
            <Form.Text>
              If checked, learners will be able to see and attempt this problem. If unchecked, the problem will be hidden from learners.
            </Form.Text>
          </Form.Group>
          
          {/* Common fields for audio and image uploads */}
          {shouldShowAudioField(quizData.problemTypeId) && (
            <>
              <Form.Group>
                <Form.Label>Audio File</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={quizData.audioFile}
                    onChange={(e) => {
                      setQuizData(prev => ({
                        ...prev,
                        audioFile: e.target.value
                      }));
                    }}
                    placeholder="Enter the URL of the audio file (e.g., /asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/audio.mp3)"
                    className="mr-2"
                  />
                  <input
                    type="file"
                    id="audioFileUpload"
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        try {
                          // Use the same file upload function that's used for the quiz HTML
                          const courseIdMatch = courseId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
                          if (!courseIdMatch) {
                            throw new Error('Invalid course ID format');
                          }
                          const formattedCourseId = `course-v1:${courseIdMatch[1]}`;
                          
                          // Upload the file
                          await dispatch(addAssetFile(formattedCourseId, file, false));
                          
                          // Generate proper asset URL in Open edX format
                          const courseComponents = formattedCourseId.replace('course-v1:', '').split('+');
                          const assetUrl = `/asset-v1:${courseComponents[0]}+${courseComponents[1]}+${courseComponents[2]}+type@asset+block/${file.name}`;
                          
                          // Set the URL in the form
                          setQuizData(prev => ({
                            ...prev,
                            audioFile: assetUrl
                          }));
                          
                          // Show success message
                          alert(`Audio file ${file.name} uploaded successfully!`);
                        } catch (error) {
                          console.error('Error uploading audio file:', error);
                          alert(`Error uploading audio file: ${error.message}`);
                        }
                      }
                    }}
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => document.getElementById('audioFileUpload').click()}
                  >
                    Upload
                  </Button>
                </div>
                <Form.Text>
                  URL to the audio file. You can enter the URL manually or upload a new audio file.
                  <br />
                  Format: <code>/asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/filename.mp3</code>
                </Form.Text>
                {quizData.audioFile && (
                  <div className="mt-3">
                    <audio controls style={{ width: '100%', maxWidth: '300px' }}>
                      <source src={quizData.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </Form.Group>
              <Form.Row>
                <Form.Group className="col-md-6">
                  <Form.Label>Start Time (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    value={quizData.startTime}
                    onChange={(e) => {
                      setQuizData(prev => ({
                        ...prev,
                        startTime: parseFloat(e.target.value) || 0
                      }));
                    }}
                    placeholder="Enter start time in seconds"
                    min="0"
                    step="0.1"
                  />
                  <Form.Text>
                    Time in seconds where the script starts in the audio.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>End Time (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    value={quizData.endTime}
                    onChange={(e) => {
                      setQuizData(prev => ({
                        ...prev,
                        endTime: parseFloat(e.target.value) || 0
                      }));
                    }}
                    placeholder="Enter end time in seconds"
                    min="0"
                    step="0.1"
                  />
                  <Form.Text>
                    Time in seconds where the script ends in the audio. Set to 0 to play until the end.
                  </Form.Text>
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Form.Label>Time Segments (Advanced)</Form.Label>
                <Form.Control
                  type="text"
                  value={quizData.timeSegmentsString}
                  onChange={(e) => {
                    setQuizData(prev => ({
                      ...prev,
                      timeSegmentsString: e.target.value
                    }));
                  }}
                  placeholder="Enter time segments (e.g., 0.04-0.09;0.21-0.30)"
                />
                <Form.Text>
                  Advanced: Multiple time segments separated by semicolon. Format: "start-end;start-end".
                  <br />
                  Example: "0.04-0.09;0.21-0.30" for two segments.
                  <br />
                  <strong>Note:</strong> This overrides Start Time and End Time fields.
                </Form.Text>
              </Form.Group>
            </>
          )}

          {shouldShowImageField(quizData.problemTypeId) && (
              <Form.Group>
                <Form.Label>Image File</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={quizData.imageFile}
                    onChange={(e) => {
                      setQuizData(prev => ({
                        ...prev,
                        imageFile: e.target.value
                      }));
                    }}
                    placeholder="Enter the URL of the image file (e.g., /asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/image.jpg)"
                    className="mr-2"
                  />
                  <input
                    type="file"
                    id="imageFileUpload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        try {
                          const courseIdMatch = courseId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
                          if (!courseIdMatch) {
                            throw new Error('Invalid course ID format');
                          }
                          const formattedCourseId = `course-v1:${courseIdMatch[1]}`;
                          
                          // Ensure filename is URL-safe
                          const safeFileName = encodeURIComponent(file.name).replace(/%20/g, '_');
                          
                          // Upload the file
                          await dispatch(addAssetFile(formattedCourseId, file, false));
                          
                          // Generate proper asset URL in Open edX format
                          const courseComponents = formattedCourseId.replace('course-v1:', '').split('+');
                          const assetUrl = `/asset-v1:${courseComponents[0]}+${courseComponents[1]}+${courseComponents[2]}+type@asset+block/${safeFileName}`;
                          
                          // Set the URL in the form
                          setQuizData(prev => ({
                            ...prev,
                            imageFile: assetUrl
                          }));
                          
                          // Show success message
                          alert(`Image file ${file.name} uploaded successfully!`);
                        } catch (error) {
                          console.error('Error uploading image file:', error);
                          alert(`Error uploading image file: ${error.message}`);
                        }
                      }
                    }}
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => document.getElementById('imageFileUpload').click()}
                  >
                    Upload
                  </Button>
                </div>
                <Form.Text>
                  URL to the image file. You can enter the URL manually or upload a new image file.
                  <br />
                  Format: <code>/asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/filename.jpg</code>
                  <br />
                  Note: File names should be in English and avoid special characters for best compatibility.
                </Form.Text>
                {quizData.imageFile && (
                  <div className="mt-3">
                    <img 
                      src={quizData.imageFile}
                      alt="Preview" 
                      style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain' }} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </Form.Group>
          )}
          
          {/* Render the appropriate form component based on problem type */}
          {FormComponent && (
            <div className="mt-4 pt-3 border-top">
              <h4>Problem-Specific Fields</h4>
              <FormComponent quizData={quizData} setQuizData={setQuizData} />
                  </div>
          )}
        </Form>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button
            variant="outline-primary"
            onClick={onClose}
          >
            {intl.formatMessage(quizMessages.cancelButton)}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
          >
            {intl.formatMessage(quizMessages.generateButton)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

QuizModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  quizData: PropTypes.shape({
    problemTypeId: PropTypes.number.isRequired,
    unitTitle: PropTypes.string.isRequired,
    paragraphText: PropTypes.string.isRequired,
    correctAnswers: PropTypes.string.isRequired,
    timeLimit: PropTypes.number.isRequired,
    published: PropTypes.bool.isRequired,
  }).isRequired,
  setQuizData: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

// Add this function before createQuiz
const generateQuizTemplate = (templateId, quizData) => {
  switch (templateId) {
    case TEMPLATE_IDS.VOCAB_MATCHING:
      const wordList = quizData.words.split(',').map(word => word.trim());
      const dropZones = JSON.parse(quizData.dropZones || '[]');
      return getVocabMatchingTemplate(
        quizData.imageFile,
        dropZones,
        wordList,
        quizData.instructions || '画像の正しい位置に単語をドラッグしてください。'
      );

    case TEMPLATE_IDS.ID3_VOCAB_SINGLE_CHOICE:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || 'どう　かきますか',
        quizData.scriptText || ''
      );

    case TEMPLATE_IDS.ID4_VOCAB_SINGLE_SELECT_1:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || 'どう　よみますか',
        quizData.scriptText || ''
      );

    case TEMPLATE_IDS.ID5_VOCAB_SINGLE_SELECT_2:
      return getGrammarDropdownTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.optionsForBlanks || '',
        quizData.audioFile || '',
        quizData.startTime || 0,
        quizData.endTime || 0,
        quizData.instructions || '音声を聞いて、正しい答えを選んでください。',
        quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.paragraphText || ''
      );

    case TEMPLATE_IDS.FILL_IN_BLANK:
      return getFillInBlankTemplate(
        quizData.paragraphText,
        quizData.correctAnswers,
        quizData.instructions || 'Fill in the blanks with the correct answers.'
      );

    case TEMPLATE_IDS.DRAG_DROP_OLD: // Drag and Drop Quiz (ID 20)
      const dragDropWords = quizData.wordBank.split(',').map(word => convertFurigana(word.trim()));
      // Process blank boxes first, then apply furigana conversion
      const processedParagraphText = convertFurigana(quizData.paragraphText.replace(/（ー）/g, '___BLANK_PLACEHOLDER___'));
      // Apply furigana to instructions
      const processedInstructions = convertFurigana(quizData.instructions);
      return getDragDropQuizTemplate(processedParagraphText, dragDropWords, processedInstructions, quizData.instructorContent || '');
    

    case TEMPLATE_IDS.ID25_DRAG_DROP: // Drag and Drop Quiz (ID 25)
      const dragDropWords1 = quizData.wordBank.split(',').map(word => convertFurigana(word.trim()));
      // Process blank boxes first, then apply furigana conversion
      const processedParagraphText1 = convertFurigana(quizData.paragraphText.replace(/（ー）/g, '___BLANK_PLACEHOLDER___'));
      // Apply furigana to instructions
      const processedInstructions1 = convertFurigana(quizData.instructions);
      return getDragDropQuizTemplate(processedParagraphText1, dragDropWords1, processedInstructions1, quizData.instructorContent || '');



    case TEMPLATE_IDS.ID12_VOCAB_DRAG_DROP: // Drag and Drop Quiz (ID 12)
      const vocabDragDropWords = quizData.wordBank.split(',').map(word => convertFurigana(word.trim()));
      // Process blank boxes first, then apply furigana conversion
      const processedParagraphText12 = convertFurigana(quizData.paragraphText.replace(/（ー）/g, '___BLANK_PLACEHOLDER___'));
      // Apply furigana to instructions
      const processedInstructions12 = convertFurigana(quizData.instructions);
      return getDragDropQuizTemplate(processedParagraphText12, vocabDragDropWords, processedInstructions12);

      case TEMPLATE_IDS.LISTEN_FILL_BLANK: // Listen and Fill in the Blank
        // Parse the options for each blank
        const blankOptionsList = quizData.blankOptions.split(';').map(options => 
          options.split(',').map(opt => opt.trim())
        );
        
      return getListenFillInBlankTemplate(
          quizData.answerContent, // Changed from paragraphText to answerContent
          quizData.audioFile || '',
          quizData.startTime || 0,
          quizData.endTime || 0,
          quizData.instructions || 'Listen to the audio and select the correct answer for each blank.',
          blankOptionsList,
          quizData.scriptText || '',
          quizData.imageFile || ''
        );

      case TEMPLATE_IDS.HIGHLIGHT_JAPANESE: // Highlight Word Quiz (Japanese)
        const correctWords = quizData.fixedWordsExplanation.split(',')
          .map(pair => {
            // Extract the wrong word from each pair
            if (pair.includes('=')) {
              // For both simple and indexed formats
              if (pair.includes(':')) {
                // Indexed format: "word:index=fixed"
                return pair.split('=')[0].split(':')[0].trim();
              } else {
                // Simple format: "word=fixed"
                return pair.split('=')[0].trim();
              }
            }
            return '';
          })
          .filter(word => word !== ''); // Remove empty strings
            
        // Set default instructions for Japanese highlight
        let defaultInstructions = '正(ただ)しくない言葉(ことば)をえらんでください';
        
        // Make sure fixedWordsExplanation is not empty
        const fixedWordsExplanation = quizData.fixedWordsExplanation || 'These are the words that should be selected.';
        console.log('Final fixedWordsExplanation:', fixedWordsExplanation);
        
        // Process paragraphText to add spaces after special characters for better word splitting
        const processedParagraphText41 = addSpacesAfterSpecialChars(quizData.paragraphText);
        console.log('Original paragraphText:', quizData.paragraphText);
        console.log('Processed paragraphText with BREAK markers:', processedParagraphText41);
        
        return highlightFillStyleTemplate
            .replace('{{PARAGRAPH}}', processedParagraphText41.replace(/'/g, "\\'"))
            .replace('{{CORRECT_WORDS}}', JSON.stringify(correctWords))
            .replace('{{FIXED_WORDS_EXPLANATION}}', fixedWordsExplanation)
            .replace('{{INSTRUCTIONS}}', quizData.instructions || defaultInstructions)
            .replace('{{AUDIO_FILE}}', quizData.audioFile || '')
            .replace('{{START_TIME}}', quizData.startTime || 0)
            .replace('{{END_TIME}}', quizData.endTime || 0);

      case TEMPLATE_IDS.ID45_LISTEN_HIGHTLIGHT: // Highlight Word Quiz (Japanese) - ID 45
        const correctWords45 = quizData.fixedWordsExplanation.split(',')
          .map(pair => {
            // Extract the wrong word from each pair
            if (pair.includes('=')) {
              // For both simple and indexed formats
              if (pair.includes(':')) {
                // Indexed format: "word:index=fixed"
                return pair.split('=')[0].split(':')[0].trim();
              } else {
                // Simple format: "word=fixed"
                return pair.split('=')[0].trim();
              }
            }
            return '';
          })
          .filter(word => word !== ''); // Remove empty words
            
        // Set default instructions for Japanese highlight
        let defaultInstructions45 = '正(ただ)しくない言葉(ことば)をえらんでください';
        
        // Make sure fixedWordsExplanation is not empty
        const fixedWordsExplanation45 = quizData.fixedWordsExplanation || 'These are the words that should be selected.';
        
        // Process paragraphText to add spaces after special characters for better word splitting
        const processedParagraphText45 = addSpacesAfterSpecialChars(quizData.paragraphText);
        console.log('ID45 - Original paragraphText:', quizData.paragraphText);
        console.log('ID45 - Processed paragraphText with BREAK markers:', processedParagraphText45);
        
        return highlightFillStyleTemplate
            .replace('{{PARAGRAPH}}', processedParagraphText45.replace(/'/g, "\\'"))
            .replace('{{CORRECT_WORDS}}', JSON.stringify(correctWords45))
            .replace('{{FIXED_WORDS_EXPLANATION}}', fixedWordsExplanation45)
            .replace('{{INSTRUCTIONS}}', quizData.instructions || defaultInstructions45)
            .replace('{{AUDIO_FILE}}', quizData.audioFile || '')
            .replace('{{START_TIME}}', quizData.startTime || 0)
            .replace('{{END_TIME}}', quizData.endTime || 0);

      case TEMPLATE_IDS.LISTEN_SINGLE_CHOICE: // Listen and Choose Quiz
      // Use timeSegmentsString if available, otherwise convert startTime and endTime
      const timeSegments39 = quizData.timeSegmentsString || 
        (quizData.startTime && quizData.endTime 
          ? `${quizData.startTime}-${quizData.endTime}` 
          : '0-0');
      
      // Apply furigana conversion to paragraphText, answerContent, and scriptText
      const processedParagraphText39 = convertFurigana(quizData.paragraphText);
      const processedAnswerContent39 = convertFurigana(quizData.answerContent || quizData.blankOptions || '');
      const processedScriptText39 = convertFurigana(quizData.scriptText || '');
      const processedInstructions39 = convertFurigana(quizData.instructions || '音声を聞いて、正しい答えを選んでください。');
      
      return getListenSingleChoiceTemplate(
        processedParagraphText39,
        processedAnswerContent39,
        quizData.audioFile || '',
        timeSegments39,
        processedInstructions39,
        processedScriptText39,
        quizData.imageFile || ''
      );

      case TEMPLATE_IDS.ID47_LISTEN_SINGLE_CHOICE: // Listen and Choose Quiz
        // Use timeSegmentsString if available, otherwise convert startTime and endTime
        const timeSegments47 = quizData.timeSegmentsString || 
          (quizData.startTime && quizData.endTime 
            ? `${quizData.startTime}-${quizData.endTime}` 
            : '0-0');
        
        // Apply furigana conversion to paragraphText, answerContent, and scriptText
        const processedParagraphText47 = convertFurigana(quizData.paragraphText);
        const processedAnswerContent47 = convertFurigana(quizData.answerContent || quizData.blankOptions || '');
        const processedScriptText47 = convertFurigana(quizData.scriptText || '');
        const processedInstructions47 = convertFurigana(quizData.instructions || '音声を聞いて、正しい答えを選んでください。');
        
        return getListenSingleChoiceTemplate(
          processedParagraphText47,
          processedAnswerContent47,
          quizData.audioFile || '',
          timeSegments47,
          processedInstructions47,
          processedScriptText47,
          quizData.imageFile || ''
        );

      case TEMPLATE_IDS.ID43_LISTEN_FILL_BLANK_2: // Listen and Choose Quiz
        // Use timeSegmentsString if available, otherwise convert startTime and endTime
        const timeSegments43 = quizData.timeSegmentsString || 
          (quizData.startTime && quizData.endTime 
            ? `${quizData.startTime}-${quizData.endTime}` 
            : '0-0');
        
        // Apply furigana conversion to paragraphText, answerContent, and scriptText
        const processedParagraphText43 = convertFurigana(quizData.paragraphText);
        const processedAnswerContent43 = convertFurigana(quizData.answerContent || quizData.blankOptions || '');
        const processedScriptText43 = convertFurigana(quizData.scriptText || '');
        const processedInstructions43 = convertFurigana(quizData.instructions || '音声を聞いて、正しい答えを選んでください。');
        
        return getListenSingleChoiceTemplate(
          processedParagraphText43,
          processedAnswerContent43,
          quizData.audioFile || '',
          timeSegments43,
          processedInstructions43,
          processedScriptText43,
          quizData.imageFile || ''
        );

    case TEMPLATE_IDS.LISTEN_SINGLE_CHOICE_NO_IMAGE: // Listen and Choose Quiz (No Image)
      // Use timeSegmentsString if available, otherwise convert startTime and endTime
      const timeSegments = quizData.timeSegmentsString || 
        (quizData.startTime && quizData.endTime 
          ? `${quizData.startTime}-${quizData.endTime}` 
          : '0-0');
      
      // Apply furigana conversion to paragraphText and answerContent (scriptText handled by template)
      const processedParagraphText40 = convertFurigana(quizData.paragraphText);
      const processedAnswerContent40 = convertFurigana(quizData.answerContent || quizData.blankOptions || '');
      const processedInstructions40 = convertFurigana(quizData.instructions || '音声を聞いて、正しい答えを選んでください。');
      
      return getListenSingleChoiceNoImageTemplate(
        processedParagraphText40,
        processedAnswerContent40,
        quizData.audioFile || '',
        timeSegments,
        processedInstructions40,
        quizData.scriptText || '' // Pass original scriptText without furigana processing
      );
    
    case TEMPLATE_IDS.ID44_LISTEN_SINGLE_CHOICE_NO_IMAGE: // Listen and Choose Quiz (No Image)
      // Use timeSegmentsString if available, otherwise convert startTime and endTime
      const timeSegments44 = quizData.timeSegmentsString || 
        (quizData.startTime && quizData.endTime 
          ? `${quizData.startTime}-${quizData.endTime}` 
          : '0-0');
      
      // Apply furigana conversion to paragraphText and answerContent (scriptText handled by template)
      const processedParagraphText44 = convertFurigana(quizData.paragraphText);
      const processedAnswerContent44 = convertFurigana(quizData.answerContent || quizData.blankOptions || '');
      const processedInstructions44 = convertFurigana(quizData.instructions || '音声を聞いて、正しい答えを選んでください。');
      
      return getListenSingleChoiceNoImageTemplate(
        processedParagraphText44,
        processedAnswerContent44,
        quizData.audioFile || '',
        timeSegments44,
        processedInstructions44,
        quizData.scriptText || '' // Pass original scriptText without furigana processing
      );

    case TEMPLATE_IDS.LISTEN_WITH_IMAGE_MULTIPLE_DIFFERENT_BLANK_OPTIONS:
      return getListenWithImageMultipleDifferentBlankOptionsTemplate(
        quizData.paragraphText,
        quizData.optionsForBlanks || '',
          quizData.audioFile || '',
          quizData.startTime || 0,
          quizData.endTime || 0,
          quizData.instructions || '音声を聞いて、絵を見て、正しい答えを選んでください。',
          quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.answerContent || ''
      );

    case TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER:
      // Use timeSegmentsString if available, otherwise convert startTime and endTime
      const timeSegments63 = quizData.timeSegmentsString || 
        (quizData.startTime && quizData.endTime 
          ? `${quizData.startTime}-${quizData.endTime}` 
          : '0-0');
      
      // Apply furigana conversion to paragraphText, answerContent, and blankOptions (scriptText handled by template)
      const processedParagraphText63 = convertFurigana(quizData.paragraphText);
      const processedAnswerContent63 = convertFurigana(quizData.answerContent || '');
      const processedInstructions63 = convertFurigana(quizData.instructions || '音声を聞いて、絵を見て、正しい答えを選んでください。');
      const processedBlankOptions63 = convertFurigana(quizData.blankOptions || '');
      
      return getListenImageSelectMultipleAnswerTemplate(
        processedParagraphText63,
        quizData.correctAnswers || '', // Use correctAnswers as the second parameter
        quizData.audioFile || '',
        timeSegments63,
        processedInstructions63,
        quizData.scriptText || '', // Pass original scriptText without furigana processing
        quizData.imageFile || '',
        processedAnswerContent63,
        processedBlankOptions63  // Pass the processed blank options with furigana
      );


    case TEMPLATE_IDS.ID64_LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER:
        // Use timeSegmentsString if available, otherwise convert startTime and endTime
        const timeSegments64 = quizData.timeSegmentsString || 
          (quizData.startTime && quizData.endTime 
            ? `${quizData.startTime}-${quizData.endTime}` 
            : '0-0');
        
        // Apply furigana conversion to paragraphText, answerContent, scriptText, and blankOptions
        const processedParagraphText64 = convertFurigana(quizData.paragraphText);
        const processedAnswerContent64 = convertFurigana(quizData.answerContent || '');
        const processedScriptText64 = convertFurigana(quizData.scriptText || '');
        const processedInstructions64 = convertFurigana(quizData.instructions || '音声を聞いて、絵を見て、正しい答えを選んでください。');
        const processedBlankOptions64 = convertFurigana(quizData.blankOptions || '');
        
        return getListenImageSelectMultipleAnswerTemplate(
          processedParagraphText64,
          quizData.correctAnswers || '', // Use correctAnswers as the second parameter
          quizData.audioFile || '',
          timeSegments64,
          processedInstructions64,
          processedScriptText64,
          quizData.imageFile || '',
          processedAnswerContent64,
          processedBlankOptions64  // Pass the processed blank options with furigana
        );

    case TEMPLATE_IDS.ID29_GRAMMAR_SINGLE_SELECT:
      return getGrammarSingleSelectTemplate29(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '正しい文を選んでください。',
        quizData.scriptText || ''
      );

    case TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER_MULTIOPTIONS:
      // Use timeSegmentsString if available, otherwise convert startTime and endTime
      const timeSegments65 = quizData.timeSegmentsString || 
        (quizData.startTime && quizData.endTime 
          ? `${quizData.startTime}-${quizData.endTime}` 
          : '0-0');
      
      // Apply furigana conversion to paragraphText, answerContent, and blankOptions (scriptText handled by template)
      const processedParagraphText65 = convertFurigana(quizData.paragraphText);
      const processedAnswerContent65 = convertFurigana(quizData.answerContent || '');
      const processedInstructions65 = convertFurigana(quizData.instructions || '音声を聞いて、絵を見て、正しい答えを選んでください。');
      const processedBlankOptions65 = convertFurigana(quizData.blankOptions || '');
      
      return getListenImageSelectMultipleAnswerTemplate65(
        processedParagraphText65,
        quizData.correctAnswers || '', // Use correctAnswers as the second parameter
        quizData.audioFile || '',
        timeSegments65,
        processedInstructions65,
        quizData.scriptText || '', // Pass original scriptText without furigana processing
        quizData.imageFile || '',
        processedAnswerContent65,
        processedBlankOptions65  // Pass the processed blank options with furigana
      );

    case TEMPLATE_IDS.LISTEN_WRITE_ANSWER_WITH_IMAGE:
      // Use timeSegmentsString if available, otherwise convert startTime and endTime
      const timeSegments67 = quizData.timeSegmentsString || 
        (quizData.startTime && quizData.endTime 
          ? `${quizData.startTime}-${quizData.endTime}` 
          : '0-0');
      
      // Apply furigana conversion to paragraphText, answerContent, and blankOptions (scriptText handled by template)
      const processedParagraphText67 = convertFurigana(quizData.paragraphText);
      const processedAnswerContent67 = convertFurigana(quizData.answerContent || '');
      const processedInstructions67 = convertFurigana(quizData.instructions || '音声を聞いて、正しい答えを選んでください。');
      const processedBlankOptions67 = convertFurigana(quizData.blankOptions || '');
      
      return getListenWriteAnswerWithImageTemplate(
        processedParagraphText67,
        quizData.correctAnswers || '', // Use correctAnswers as the second parameter
        quizData.audioFile || '',
        timeSegments67,
        processedInstructions67,
        quizData.scriptText || '', // Pass original scriptText without furigana processing
        processedAnswerContent67,
        processedBlankOptions67  // Pass the processed blank options with furigana
      );

    case TEMPLATE_IDS.GRAMMAR_DROPDOWN:
      // DEBUG: Log values to verify correct mapping
      console.log('🔍 Template 18 Debug:', {
        paragraphText: quizData.paragraphText,
        answerContent: quizData.answerContent,
        optionsForBlanks: quizData.optionsForBlanks,
        'Parameter 2 (optionsForBlanks)': quizData.answerContent || quizData.optionsForBlanks || '',
        'Parameter 9 (answerContent)': quizData.paragraphText || ''
      });
      return getGrammarDropdownTemplate(
        quizData.paragraphText || '', // parameter 1: questionText (not used in template, but kept for compatibility)
        quizData.answerContent || quizData.optionsForBlanks || '', // parameter 2: optionsForBlanks (dropdown options)
        quizData.audioFile || '',
        quizData.startTime || 0,
        quizData.endTime || 0,
        quizData.instructions || '音声を聞いて、正しい答えを選んでください。',
        quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.paragraphText || '' // parameter 9: paragraphText - content with ー placeholders to be replaced with dropdowns
      );

    case TEMPLATE_IDS.ID19_GRAMMAR_DROPDOWN:
      return getGrammarDropdownTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.optionsForBlanks || '',
        quizData.audioFile || '',
        quizData.startTime || 0,
        quizData.endTime || 0,
        quizData.instructions || '',
        quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.paragraphText || ''
      );

    case TEMPLATE_IDS.ID6_GRAMMAR_DROPDOWN:
        return getGrammarDropdownTemplate(
          quizData.paragraphText || '',
          quizData.answerContent || quizData.optionsForBlanks || '',
          quizData.audioFile || '',
          quizData.startTime || 0,
          quizData.endTime || 0,
          quizData.instructions || '',
          quizData.scriptText || '',
          quizData.imageFile || '',
          quizData.paragraphText || ''
        );
    
    case TEMPLATE_IDS.ID21_GRAMMAR_DROPDOWN:
          return getGrammarDropdownTemplate(
            quizData.paragraphText || '',
            quizData.answerContent || quizData.optionsForBlanks || '',
            quizData.audioFile || '',
            quizData.startTime || 0,
            quizData.endTime || 0,
            quizData.instructions || '',
            quizData.scriptText || '',
            quizData.imageFile || '',
            quizData.paragraphText || ''
          );

    case TEMPLATE_IDS.ID23_GRAMMAR_DROPDOWN:
            return getGrammarDropdownTemplate(
              quizData.paragraphText || '',
              quizData.answerContent || quizData.optionsForBlanks || '',
              quizData.audioFile || '',
              quizData.startTime || 0,
              quizData.endTime || 0,
              quizData.instructions || '',
              quizData.scriptText || '',
              quizData.imageFile || '',
              quizData.paragraphText || ''
            );

    case TEMPLATE_IDS.ID24_GRAMMAR_DROPDOWN:
              return getGrammarDropdownTemplate(
                quizData.paragraphText || '',
                quizData.answerContent || quizData.optionsForBlanks || '',
                quizData.audioFile || '',
                quizData.startTime || 0,
                quizData.endTime || 0,
                quizData.instructions || '',
                quizData.scriptText || '',
                quizData.imageFile || '',
                quizData.paragraphText || ''
              );
    case TEMPLATE_IDS.ID62_GRAMMAR_DROPDOWN:
                return getGrammarDropdownTemplate(
                  quizData.paragraphText || '',
                  quizData.answerContent || quizData.optionsForBlanks || '',
                  quizData.audioFile || '',
                  quizData.startTime || 0,
                  quizData.endTime || 0,
                  quizData.instructions || '',
                  quizData.scriptText || '',
                  quizData.imageFile || '',
                  quizData.paragraphText || ''
                );

    case TEMPLATE_IDS.ID26_GRAMMAR_DROPDOWN:
                  return getGrammarDropdownTemplate(
                    quizData.paragraphText || '',
                    quizData.answerContent || quizData.optionsForBlanks || '',
                    quizData.audioFile || '',
                    quizData.startTime || 0,
                    quizData.endTime || 0,
                    quizData.instructions || '',
                    quizData.scriptText || '',
                    quizData.imageFile || '',
                    quizData.paragraphText || ''
                  );

    case TEMPLATE_IDS.ID30_GRAMMAR_DROPDOWN:
                    return getGrammarDropdownTemplate(
                      quizData.paragraphText || '',
                      quizData.answerContent || quizData.optionsForBlanks || '',
                      quizData.audioFile || '',
                      quizData.startTime || 0,
                      quizData.endTime || 0,
                      quizData.instructions || '',
                      quizData.scriptText || '',
                      quizData.imageFile || '',
                      quizData.paragraphText || ''
                    );

    case TEMPLATE_IDS.GRAMMAR_SENTENCE_REARRANGEMENT:
      const sentenceWords = quizData.wordBank.split(',').map(word => convertFurigana(word.trim()));
      // Process paragraph text with furigana conversion first
      const paragraphWithFurigana = convertFurigana(quizData.paragraphText);
      // Process blanks using templateUtils
      const { processedParagraph, wordBankHTML } = processGrammarSentenceRearrangement(paragraphWithFurigana, sentenceWords);
      // Apply furigana to instructions
      const processedInstructions22 = convertFurigana(quizData.instructions);
      return getGrammarSentenceRearrangementTemplate(processedParagraph, wordBankHTML, processedInstructions22, quizData.instructorContent || '');

    case TEMPLATE_IDS.ID27_GRAMMAR_SENTENCE_REARRANGEMENT:
        const sentenceWords1 = quizData.wordBank.split(',').map(word => word.trim());
        return getGrammarSentenceRearrangementTemplate(sentenceWords1, quizData.instructions || '正しい順番に並び替えてください。');

    case TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '正しい文を選んでください。',
        quizData.scriptText || ''
      );

    case TEMPLATE_IDS.GRAMMAR_SINGLE_SELECT_ALT:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '★＿＿＿に　入る　ものは　どれですか。',
        quizData.scriptText || ''
      );

    case TEMPLATE_IDS.READING_MULTIPLE_QUESTION:
      quizData.instructions = quizData.instructions || '以下の文章を読んで、質問に答えてください。';
      // Ensure paragraphText (readingText) is not fallback to questionText
      // readingText should only come from paragraphText, not questionText
      const readingText31 = quizData.paragraphText ? quizData.paragraphText.trim() : '';
      // Apply furigana conversion to text values (like template 7)
      // Note: blankOptions will be converted in template 31 for each option separately
      const processedReadingText31 = convertFurigana(readingText31);
      const processedQuestionText31 = convertFurigana(quizData.questionText || '');
      const processedInstructions31 = convertFurigana(quizData.instructions);
      // Use images if available, otherwise fallback to imageFile
      const imagesFor31 = (quizData.images && quizData.images.trim() !== '') ? quizData.images : (quizData.imageFile || '');
      return getReadingMultipleQuestionTemplate(
        processedReadingText31,
        processedQuestionText31,
        quizData.blankOptions || '', // Pass original blankOptions, template will convert each option
        processedInstructions31,
        quizData.scriptText || '',
        imagesFor31
      );

      case TEMPLATE_IDS.ID34_READING_MULTIPLE_QUESTION:
        quizData.instructions = quizData.instructions || '以下の文章を読んで、質問に答えてください。';
        // Ensure paragraphText (readingText) is not fallback to questionText
        // readingText should only come from paragraphText, not questionText
        const readingText34 = quizData.paragraphText ? quizData.paragraphText.trim() : '';
        // Apply furigana conversion to text values (like template 7)
        // Note: blankOptions will be converted in template 31 for each option separately
        const processedReadingText34 = convertFurigana(readingText34);
        const processedQuestionText34 = convertFurigana(quizData.questionText || '');
        const processedInstructions34 = convertFurigana(quizData.instructions);
        return getReadingMultipleQuestionTemplate(
          processedReadingText34,
          processedQuestionText34,
          quizData.blankOptions || '', // Pass original blankOptions, template will convert each option
          processedInstructions34,
          quizData.scriptText || '',
          quizData.images || ''
        );

    case TEMPLATE_IDS.READING_MULTIPLE_QUESTION_ALT:
      quizData.instructions = quizData.instructions || '以下の文章を読んで、質問に答えてください。';
      // Ensure paragraphText (readingText) is not fallback to questionText
      // readingText should only come from paragraphText, not questionText
      const readingText37 = quizData.paragraphText ? quizData.paragraphText.trim() : '';
      // Apply furigana conversion to text values (like template 7)
      // Note: blankOptions will be converted in template 37 for each option separately
      const processedReadingText37 = convertFurigana(readingText37);
      const processedQuestionText37 = convertFurigana(quizData.questionText || '');
      const processedInstructions37 = convertFurigana(quizData.instructions);
      return getReadingMultipleQuestionTemplate37(
        processedReadingText37,
        processedQuestionText37,
        quizData.blankOptions || '', // Pass original blankOptions, template will convert each option
        processedInstructions37,
        quizData.scriptText || '',
        quizData.images || ''
      );

    case TEMPLATE_IDS.READING_SAME_31:
      quizData.instructions = quizData.instructions || '以下の文章を読んで、質問に答えてください。';
      return getReadingMultipleQuestionTemplate32(
        quizData.paragraphText || '',
        quizData.questionText || '',
        quizData.blankOptions || '',
        quizData.instructions,
        quizData.scriptText || ''
      );

    case TEMPLATE_IDS.READING_MULTIPLE_QUESTION_CONVERSATION:
      quizData.instructions = quizData.instructions || 'つぎのぶんしょうを読(よ)んで、質問(しつもん)にこたえてください。答(こた)えは、１・２・３・４からいちばん いいものを一(ひと)つ えらんでください。';
      // Ensure paragraphText (readingText) is not fallback to questionText
      // readingText should only come from paragraphText, not questionText
      const readingTextConv = quizData.paragraphText ? quizData.paragraphText.trim() : '';
      // Apply furigana conversion to text values (like template 7)
      // Note: blankOptions will be converted in template 31 for each option separately
      const processedReadingTextConv = convertFurigana(readingTextConv);
      const processedQuestionTextConv = convertFurigana(quizData.questionText || '');
      const processedInstructionsConv = convertFurigana(quizData.instructions);
      return getReadingMultipleQuestionTemplate(
        processedReadingTextConv,
        processedQuestionTextConv,
        quizData.blankOptions || '', // Pass original blankOptions, template will convert each option
        processedInstructionsConv,
        quizData.scriptText || '',
        quizData.images || ''
      );

    case TEMPLATE_IDS.ID311_READING_MULTIPLE_QUESTION:
      quizData.instructions = quizData.instructions || '以下の文章を読んで、質問に答えてください。';
      // Template 311: questionText contains paragraph with placeholders (ー) for dropdowns
      // blankOptions contains options for dropdowns (format: "option1,option2,option3" or "opt1,opt2;opt3,opt4")
      // readingText is not used (pass empty), questionText is the paragraph with dropdowns
      const processedInstructions311 = convertFurigana(quizData.instructions);
      // Note: questionText will be processed in template to replace （ー） with dropdowns
      // blankOptions will be parsed in template to create options for each dropdown
      
      // Debug: Log images parameter before passing to template
      console.log('🔍 CreateQuizButton - Template 311 - quizData:', {
        paragraphText: quizData.paragraphText,
        paragraphTextType: typeof quizData.paragraphText,
        paragraphTextLength: quizData.paragraphText ? quizData.paragraphText.length : 0,
        paragraphTextValue: quizData.paragraphText || 'undefined/empty',
        images: quizData.images,
        imageFile: quizData.imageFile,
        imagesType: typeof quizData.images,
        imagesValue: quizData.images || 'undefined/empty',
        imageFileValue: quizData.imageFile || 'undefined/empty',
        questionText: quizData.questionText,
        blankOptions: quizData.blankOptions,
        answerContent: quizData.answerContent
      });
      
      // Use images if available, otherwise fallback to imageFile
      const imagesFor311 = (quizData.images && quizData.images.trim() !== '') ? quizData.images : (quizData.imageFile || '');
      
      return getReadingMultipleQuestionTemplate311(
        quizData.paragraphText || '', // paragraphText (reading text) - displayed below image 2
        quizData.questionText || '', // questionText contains paragraph with （ー） placeholders
        quizData.blankOptions || quizData.answerContent || '', // Options for dropdowns
        processedInstructions311,
        quizData.scriptText || '',
        imagesFor311, // images parameter (with fallback to imageFile)
        quizData.imageFile || '' // imageFile parameter (fallback)
      );

    case TEMPLATE_IDS.READING_DROPLIST:
      return getReadingDroplistTemplate(
        quizData.paragraphText,
        quizData.blankOptions,
        quizData.instructions,
        quizData.scriptText,
        quizData.imageFile,
        quizData.answerContent,
        quizData.blankOptions
      );

    case TEMPLATE_IDS.READING_DROPLIST_NO_IMAGE:
      return getReadingDroplistNoImageTemplate(
        quizData.paragraphText,
        quizData.blankOptions,
        quizData.instructions,
        quizData.scriptText,
        quizData.answerContent,
        quizData.blankOptions
      );

    case TEMPLATE_IDS.READING_SELECT:
      return getReadingSelectTemplate(
        quizData.paragraphText,
        quizData.blankOptions,
        quizData.instructions ,
        quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.questionText
      );

    case TEMPLATE_IDS.READING_SELECT_1:
      return getReadingSelectTemplate(
        quizData.paragraphText,
        quizData.blankOptions,
        quizData.instructions,
        quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.questionText
      );

    case TEMPLATE_IDS.ID38_READING_SELECT_2:
      return getReadingSelectTemplate(
        quizData.paragraphText,
        quizData.blankOptions,
        quizData.instructions || '情報の内容を見て、下のしつもんにこたえてください。こたえは、1・2・3・4からいちばんいいものを一つえらんでください。',
        quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.questionText
      );

    case TEMPLATE_IDS.ID3_VOCAB_SINGLE_CHOICE:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || 'どう　かきますか',
        quizData.scriptText || ''
      );

    case TEMPLATE_IDS.ID4_VOCAB_SINGLE_SELECT_1:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || 'どう　かきますか',
        quizData.scriptText || ''
      );


    case TEMPLATE_IDS.ID7_VOCAB_SINGLE_SELECT_3:
        return getGrammarSingleSelectTemplate7(
          quizData.paragraphText || '',
          quizData.answerContent || quizData.blankOptions || '',
          quizData.instructions || '_______　の文と　だいたい　同じ　いみの　文が　あります。１～４から　１つ　えらんで　ください。',
          quizData.scriptText || ''
        );
    case TEMPLATE_IDS.ID8_VOCAB_SINGLE_SELECT_4:
          return getGrammarSingleSelectTemplate(
            quizData.paragraphText || '',
            quizData.answerContent || quizData.blankOptions || '',
            quizData.instructions || 'どう　かきますか',
            quizData.scriptText || ''
          );
    case TEMPLATE_IDS.ID9_VOCAB_SINGLE_SELECT_5:
          return getGrammarSingleSelectTemplate(
            quizData.paragraphText || '',
            quizData.answerContent || quizData.blankOptions || '',
            quizData.instructions || 'どう　よみますか',
            quizData.scriptText || ''
          );
    case TEMPLATE_IDS.ID10_VOCAB_SINGLE_SELECT_6:
      return getGrammarDropdownTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.optionsForBlanks || '',
        quizData.audioFile || '',
        quizData.startTime || 0,
        quizData.endTime || 0,
        quizData.instructions || '音声を聞いて、正しい答えを選んでください。',
        quizData.scriptText || '',
        quizData.imageFile || '',
        quizData.paragraphText || ''
      );
    case TEMPLATE_IDS.ID12_VOCAB_DRAG_DROP:
      const vocabDragDropWords2 = quizData.wordBank.split(',').map(word => convertFurigana(word.trim()));
      const cleanParagraph = (quizData.paragraphText || '')
        .replace(/([「」])\s*[\r\n]+\s*/g, '$1')
        .replace(/([。！？])\s*[\r\n]+\s*([「」])/g, '$1$2')
        .replace(/([。！？])\s*[\r\n]+\s*(\d|①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)/g, '$1\n$2')
        .replace(/[\r\n]+/g, '\n')
        .trim();
      // Apply furigana conversion to cleanParagraph
      const processedCleanParagraph = convertFurigana(cleanParagraph);
      return getDragDropQuizTemplate(
        processedCleanParagraph,
        vocabDragDropWords2,
        quizData.instructions || '正しい　ものを　一つ　えらびましょう。',
        quizData.instructorContent || ''
      );
    case TEMPLATE_IDS.ID13_VOCAB_SINGLE_SELECT_7:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '_______　の文と　だいたい　同じ　いみの　文が　あります。１～４から　１つ　えらんで　ください。',
        quizData.scriptText || ''
      );
    case TEMPLATE_IDS.ID14_VOCAB_SINGLE_SELECT_8:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '_____の　ことばは　ひらがなで　どう　かきますか。1・2・3・4から　いちばん　いい　ものを　ひとつ　えらんで　ください。',
        quizData.scriptText || ''
      );
    case TEMPLATE_IDS.ID15_VOCAB_SINGLE_SELECT_9:
      return getGrammarSingleSelectTemplate(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '_____の　ことばは　どう　かきますか。1・2・3・4から　いちばん　いい　ものを　ひとつ　えらんで　ください。',
        quizData.scriptText || ''
      );
    case TEMPLATE_IDS.ID16_VOCAB_SINGLE_SELECT_10:
      return getGrammarSingleSelectTemplate7(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '（ー）に　何を　入れますか。1～4から　１つ　えらんで　ください。',
        quizData.scriptText || ''
      );
    case TEMPLATE_IDS.ID17_VOCAB_SINGLE_SELECT_11:
      return getGrammarSingleSelectTemplate7(
        quizData.paragraphText || '',
        quizData.answerContent || quizData.blankOptions || '',
        quizData.instructions || '_______　のぶんと　だいたい　同じ　いみの　ぶんは　どれですか。',
        quizData.scriptText || ''
      );
      default:
      throw new Error(`Unsupported problem type ID: ${templateId}`);
  }
};

// Export the createQuiz function
export const createQuiz = async ({ courseId, subsectionId, quizData, onFileCreated, onCreateUnit }) => {
  try {
    console.log('createQuiz called with:', {
      courseId,
      subsectionId,
      quizData,
      hasOnFileCreated: !!onFileCreated,
      hasOnCreateUnit: !!onCreateUnit
    });

    const client = getAuthenticatedHttpClient();
    
    // Use the new generateQuizTemplate function
    const problemTypeId = parseInt(quizData?.problemTypeId, 10) || TEMPLATE_IDS.FILL_IN_BLANK;
    const htmlContent = generateQuizTemplate(problemTypeId, quizData);

    const htmlFileName = `quiz_${Date.now()}.html`;
    console.log('Generated HTML content:', htmlContent);
    
    // Create HTML file
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlFile = new File([htmlBlob], htmlFileName, { type: 'text/html' });

    // Create problem content with XML structure
    const problemContent = `<problem>
  <script type="loncapa/python">
import json
def check_fun(e, ans):
    try:
        response = json.loads(ans)
        state_data = json.loads(response.get("state", "{}"))
        answer_data = json.loads(response["answer"]) 
        answer = answer_data["edxResult"]
        edx_grade = answer_data["edxScore"]
        edx_message = answer_data["edxMessage"]
        state_data['showAnswer'] = True
        return {
            'input_list': [
                { 'ok': answer, 'msg': edx_message, 'grade_decimal': edx_grade}
            ],
            'state': json.dumps(state_data)
        }
    except Exception as err:
        return {'input_list': [{'ok': False, 'msg': f"Error: {str(err)}", 'grade_decimal': 0}]}
  </script>
  <!-- paragraph_text: ${quizData.paragraphText} -->
  <customresponse cfn="check_fun" rerandomize="never" show_answer_after_attempts="1" max_attempts="unlimited">
    <jsinput 
      gradefn="getGrade" 
      get_statefn="getState" 
      set_statefn="setState" 
      initial_state='{"showAnswer": false}' 
      width="100%" 
      height="620px" 
      html_file="/static/${htmlFileName}" 
      sop="false" 
      id="paragraph_quiz_input" 
      title="${quizData.unitTitle}"
    />
  </customresponse>
  <solution>
    <div class="detailed-solution">
      <p>The correct answers are:</p>
      <ul>
        <!-- Add solution items here -->
      </ul>
    </div>
  </solution>
</problem>`;

    console.log('Generated problem content:', problemContent);

    // Create metadata
    const metadata = {
      display_name: quizData.unitTitle,
      xblock_type: 'problem',
      data: problemContent,
      has_score: true,
      graded: true,
      format: 'Quiz',
    };
    console.log('Created metadata:', metadata);

    // Upload HTML file using the provided onFileCreated function
    if (onFileCreated) {
      try {
        console.log('Starting file upload with HTML file:', {
          htmlFile: { name: htmlFile.name, size: htmlFile.size, type: htmlFile.type }
        });
        
        const uploadResult = await onFileCreated([htmlFile]);
        console.log('File upload result:', uploadResult);
        
        if (!uploadResult) {
          console.error('Upload result was false or undefined');
          throw new Error('Failed to upload quiz file');
        }
        console.log('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error(`Failed to upload quiz file: ${error.message}`);
      }
    } else {
      console.warn('No onFileCreated function provided');
    }

    // Create new unit with the problem
    if (onCreateUnit) {
      try {
        console.log('Creating unit with data:', {
          title: quizData.unitTitle,
          type: 'problem',
          metadata,
          files: [htmlFileName]
        });

        // First create the unit using the parent component's function
        const unitId = await onCreateUnit(quizData.unitTitle);
        if (!unitId) {
          throw new Error('Failed to create unit');
        }

        // Create problem under the unit
        const problemResponse = await client.post(
          `${getConfig().STUDIO_BASE_URL}/xblock/`,
          {
            metadata: {
              display_name: String(quizData.unitTitle),
              visible_to_staff_only: !quizData.published
            },
            data: problemContent,
            category: 'problem',
            parent_locator: unitId
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (problemResponse.status !== 200) {
          throw new Error('Failed to create problem');
        }

        const problemId = problemResponse.data.locator;
        console.log('Created problem with ID:', problemId);

        // Update problem metadata
        const updateResponse = await client.put(
          `${getConfig().STUDIO_BASE_URL}/xblock/${problemId}`,
          {
            metadata: {
              display_name: String(quizData.unitTitle),
              visible_to_staff_only: !quizData.published,
              time_limit: parseInt(quizData.timeLimit) // timeLimit already in seconds
            },
            data: problemContent
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (updateResponse.status !== 200) {
          console.warn('Failed to update problem metadata:', updateResponse.data);
        } else {
          console.log('Successfully updated problem metadata');
        }

        // Publish the problem if requested
        if (quizData.published) {
          try {
            // Extract course ID from the problem ID
            let formattedCourseId;
            if (problemId.startsWith('block-v1:')) {
              const courseIdMatch = problemId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
              if (!courseIdMatch) {
                throw new Error('Invalid problem ID format');
              }
              formattedCourseId = `course-v1:${courseIdMatch[1]}`;
            } else if (problemId.startsWith('course-v1:')) {
              formattedCourseId = problemId;
            } else {
              throw new Error('Invalid problem ID format');
            }

            // Publish the course to make the problem visible
            const publishResponse = await client.post(
              `${getConfig().STUDIO_BASE_URL}/course/${formattedCourseId}/publish`,
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );

            if (publishResponse.status !== 200) {
              console.warn('Failed to publish course:', publishResponse.data);
            } else {
              console.log('Successfully published course');
            }
          } catch (error) {
            console.error('Error publishing course:', error);
          }
        }

        return { blockId: problemId };
      } catch (error) {
        console.error('Error creating unit:', error);
        throw error;
      }
    } else {
      console.warn('No onCreateUnit function provided');
    }

    return true;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// BulkImportModal Component
const BulkImportModal = ({ isOpen, onClose, onImport, intl, courseId, dispatch, onDownloadTemplate, onCreateUnit }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
      try {
        const quizzes = await parseExcelFile(file);
        setPreviewData(quizzes.slice(0, 5)); // Show first 5 rows as preview
        console.log('Parsed Excel data:', quizzes);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert(`Error parsing Excel file: ${error.message}`);
      }
    }
  };

  const handleImport = async () => {
    if (!excelFile) {
      alert('Please select an Excel file first');
      return;
    }

    setIsProcessing(true);
    try {
      const quizzes = await parseExcelFile(excelFile);
      setProgress({ current: 0, total: quizzes.length });

      for (let i = 0; i < quizzes.length; i++) {
        const quiz = quizzes[i];
        setProgress({ current: i + 1, total: quizzes.length });

        // Convert Excel data to quiz format
        // For template 18 and related IDs: Excel columns map directly:
        // - Excel paragraphText → quizData.paragraphText (content with ー placeholders)
        // - Excel answerContent → quizData.answerContent (dropdown options)
        const isGrammarDropdown = [18, 19, 6, 21, 23, 24, 26, 30, 62, 5, 10].includes(parseInt(quiz.problemTypeId) || 0);
        const isReadingMultipleQuestion = [31, 34, 37, 311].includes(parseInt(quiz.problemTypeId) || 0);
        const quizData = {
          problemTypeId: parseInt(quiz.problemTypeId) || 39, // Default to ID 39
          unitTitle: String(quiz.unitTitle || `Quiz ${i + 1}`),
          // For template 31, 34, 37, and 311: paragraphText is readingText and should NOT fallback to questionText
          // Only use paragraphText if it exists, otherwise leave empty
          paragraphText: String(quiz.paragraphText || ''),
          answerContent: String(
            quiz.answerContent || quiz.optionsForBlanks || quiz.blankOptions || quiz.answerOptions || ''
          ),
          blankOptions: String(quiz.blankOptions || quiz.answerOptions || ''), // Keep for backward compatibility
          optionsForBlanks: String(quiz.optionsForBlanks || ''), // Keep for backward compatibility
          scriptText: String(quiz.scriptText || ''),
          // Set default instructions based on template type
          // For reading templates (31, 34, 37, 311): default to reading instruction
          // For other templates: default to listening instruction
          instructions: String(quiz.instructions || (isReadingMultipleQuestion ? '以下の文章を読んで、質問に答えてください。' : '音声を聞いて、正しい答えを選んでください。')),
          audioFile: String(quiz.audioFile || '/asset-v1:Manabi+N51+2026+type@asset+block/1.mp3'),
          imageFile: String(quiz.imageFile || '/asset-v1:Manabi+N51+2026+type@asset+block/1.png'),
          images: String(quiz.images || ''), // Add mapping for images column
          startTime: parseFloat(quiz.startTime) || 0,
          endTime: parseFloat(quiz.endTime) || 0,
          timeSegmentsString: String(quiz.timeSegmentsString || quiz.timeSegments || quiz['startTime/endTime'] || ''), // Add timeSegmentsString with fallback
          timeLimit: parseInt(quiz.timeLimit) || 60, // Default to 60 seconds
          published: quiz.published !== 'false',
          correctAnswers: String(quiz.correctAnswers || ''),
          wordBank: String(quiz.wordBank || ''),
          fixedWordsExplanation: String(quiz.fixedWordsExplanation || ''),
          // For template 31, 34, 37, and 311: questionText is separate from paragraphText (readingText)
          // questionText contains the questions, paragraphText contains the reading passage
          questionText: String(quiz.questionText || ''),
          words: String(quiz.words || ''),
          dropZones: String(quiz.dropZones || '[]')
        };
        
        // For template 31 and 311: use imageFile as fallback if images is empty
        if ([31, 311].includes(quizData.problemTypeId) && (!quizData.images || quizData.images.trim() === '')) {
          if (quizData.imageFile && quizData.imageFile.trim() !== '') {
            quizData.images = quizData.imageFile;
            console.log(`🔍 Template ${quizData.problemTypeId} - Using imageFile as fallback for images: "${quizData.imageFile}"`);
          }
        }

        // Debug: Log the quiz data to check startTime and endTime
        console.log(`Creating quiz ${i + 1}:`, {
          unitTitle: quizData.unitTitle,
          startTime: quizData.startTime,
          endTime: quizData.endTime,
          timeSegmentsString: quizData.timeSegmentsString,
          audioFile: quizData.audioFile,
          imageFile: quizData.imageFile,
          images: quizData.images, // Add images to debug log
          imagesFromExcel: quiz.images, // Original value from Excel
          imagesType: typeof quizData.images,
          problemTypeId: quizData.problemTypeId,
          originalStartTime: quiz.startTime,
          originalEndTime: quiz.endTime,
          hasStartTimeEndTime: !!quiz['startTime/endTime'],
          startTimeEndTimeValue: quiz['startTime/endTime'],
          hasTimeSegments: !!quiz.timeSegments,
          timeSegmentsValue: quiz.timeSegments,
          // Special handling for template 63, 65, and 67
          isTemplate63: quizData.problemTypeId === 63,
          isTemplate65: quizData.problemTypeId === 65,
          isTemplate67: quizData.problemTypeId === 67,
          template63TimeSegments: quizData.problemTypeId === 63 ? quizData.timeSegmentsString : 'N/A',
          template65TimeSegments: quizData.problemTypeId === 65 ? quizData.timeSegmentsString : 'N/A',
          template67TimeSegments: quizData.problemTypeId === 67 ? quizData.timeSegmentsString : 'N/A',
          // Special handling for template 311
          isTemplate311: quizData.problemTypeId === 311,
          template311Images: quizData.problemTypeId === 311 ? quizData.images : 'N/A',
          template311QuestionText: quizData.problemTypeId === 311 ? quizData.questionText : 'N/A',
          template311ParagraphText: quizData.problemTypeId === 311 ? quizData.paragraphText : 'N/A',
          template311ParagraphTextLength: quizData.problemTypeId === 311 ? (quizData.paragraphText ? quizData.paragraphText.length : 0) : 'N/A'
        });

        // Create quiz using existing createQuiz function
        await createQuiz({
          courseId,
          subsectionId: courseId,
          quizData,
          onFileCreated: async (files) => {
            try {
              const courseIdMatch = courseId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
              if (!courseIdMatch) {
                throw new Error('Invalid course ID format');
              }
              const formattedCourseId = `course-v1:${courseIdMatch[1]}`;
              
              for (const file of files) {
                await dispatch(addAssetFile(formattedCourseId, file, false));
                await new Promise(resolve => setTimeout(resolve, 500));
              }
              return true;
            } catch (error) {
              console.error('Error uploading files:', error);
              throw error;
            }
          },
          onCreateUnit: async (title) => {
            try {
              if (onCreateUnit) {
                // Use the parent component's onCreateUnit function
                const unitId = await onCreateUnit(title);
                if (!unitId) {
                  throw new Error('Failed to create unit');
                }
                return unitId;
              } else {
                // Fallback to direct API call if onCreateUnit is not provided
                const client = getAuthenticatedHttpClient();
                const response = await client.post(
                  `${getConfig().STUDIO_BASE_URL}/xblock/`,
                  {
                    metadata: {
                      display_name: title,
                      category: 'vertical'
                    },
                    category: 'vertical',
                    parent_locator: courseId
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    }
                  }
                );
                return response.data.locator;
              }
            } catch (error) {
              console.error('Error creating unit:', error);
              throw error;
            }
          }
        });

        // Add delay between quizzes to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      alert(`Successfully created ${quizzes.length} quizzes!`);
      onClose();
    } catch (error) {
      console.error('Error during bulk import:', error);
      alert(`Error during bulk import: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };


  if (!isOpen) return null;

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Bulk Import Quizzes from Excel"
      hasCloseButton
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          Bulk Import Quizzes from Excel
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form>
          <Form.Group>
            <Form.Label>Excel File</Form.Label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <Form.Control
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              <Button
                variant="outline-secondary"
                onClick={onDownloadTemplate}
                size="sm"
              >
                Download Template
              </Button>
            </div>
            <Form.Text>
              Upload an Excel file with quiz data. The first row should contain column headers.
              <br />
              <strong>Required columns:</strong> problemTypeId, unitTitle, paragraphText, answerContent (or blankOptions for backward compatibility)
              <br />
              <strong>Optional columns:</strong> scriptText, instructions, audioFile, imageFile, images, startTime, endTime, timeLimit, published
              <br />
              <strong>Multiple correct answers:</strong> Use "/" to separate multiple correct answers for one blank (e.g., "月/げつ" for blank 2)
              <br />
              <strong>Time Range columns:</strong> 
              <br />
              • timeRange (format: "1-1.1" = 1s to 1min10s) 
              <br />
              • startEndTime (format: "1-1.05" = 1s to 1min5s)
              <br />
              • startTime/endTime (format: "0.34-0.50" = 34s to 50s)
              <br />
              • timeSegments (format: "0.04-0.09;0.21-0.30" = multiple segments for ID 40, 63, 65, and 67)
              <br />
              <strong>Problem Type IDs:</strong> 39 (Listen Single Choice), 40 (Listen Single Choice No Image), 63 (Listen Image Select Multiple Answer), 65 (Listen Image Select Multiple Answer Template 65), 67 (Listen Write Answer with Image), 20 (Drag Drop), etc.
            </Form.Text>
          </Form.Group>

          {previewData.length > 0 && (
            <Form.Group>
              <Form.Label>Preview (First 5 rows)</Form.Label>
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      {Object.keys(previewData[0] || {}).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>{String(value || '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Form.Group>
          )}

          {isProcessing && (
            <Form.Group>
              <Form.Label>Progress</Form.Label>
              <div className="progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                >
                  {progress.current} / {progress.total}
                </div>
              </div>
              <Form.Text>
                Creating quiz {progress.current} of {progress.total}...
              </Form.Text>
            </Form.Group>
          )}
        </Form>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button
            variant="outline-primary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!excelFile || isProcessing}
            iconBefore={Upload}
          >
            {isProcessing ? 'Importing...' : 'Import Quizzes'}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

BulkImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  onDownloadTemplate: PropTypes.func.isRequired,
  onCreateUnit: PropTypes.func,
};

BulkImportModal.defaultProps = {
  onCreateUnit: null,
};

// CreateQuizButton Component
const CreateQuizButton = ({ onFileCreated, className, courseId, intl, onCreateUnit }) => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [quizData, setQuizData] = useState({
    problemTypeId: TEMPLATE_IDS.FILL_IN_BLANK,
    unitTitle: 'Quick Test Quiz',
    paragraphText: '',
    answerContent: '',
    blankOptions: '',
    optionsForBlanks: '',
    scriptText: '',
    correctAnswers: '',
    wordBank: '',
    timeLimit: 60, // Default to 60 seconds
    published: true,
    fixedWordsExplanation: '',
    instructions: '',
    audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.mp3',
    imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.png',
    images: '',
    startTime: 0,
    endTime: 0,
    timeSegmentsString: '',
    questionText: '',
    words: '',
    dropZones: '[]'
  });

  const dispatch = useDispatch();

  const handleGenerateQuiz = () => {
    setShowQuizModal(true);
  };

  const handleBulkImport = () => {
    setShowBulkImportModal(true);
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setQuizData({ 
      problemTypeId: TEMPLATE_IDS.FILL_IN_BLANK,
      unitTitle: 'Quick Test Quiz',
      paragraphText: '',
      answerContent: '',
      blankOptions: '',
      optionsForBlanks: '',
      scriptText: '',
      correctAnswers: '',
      wordBank: '',
      timeLimit: 60, // Default to 60 seconds
      published: true,
      instructions: '正しい順番に並び替えてください。',
      audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.mp3',
      imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.png',
      images: '',
      startTime: 0,
      endTime: 0,
      timeSegmentsString: '',
      questionText: '',
      words: '',
      dropZones: '[]'
    });
  };

  const handleCloseBulkModal = () => {
    setShowBulkImportModal(false);
  };

  const downloadTemplate = () => {
    // Create sample data for Excel template
    const sampleData = [
      {
        problemTypeId: '39',
        unitTitle: 'Sample Quiz 1 - Listen Single Choice with Image',
        paragraphText: '男の人は何と言いましたか。',
        blankOptions: 'はい、分かりました,いいえ、分かりません,すみません',
        scriptText: '男：はい、分かりました。',
        instructions: '音声を聞いて、正しい答えを選んでください。',
        audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.mp3',
        imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.png',
        'startTime/endTime': '0.34-0.50',
        timeSegments: '0.04-0.09;0.21-0.30',
        timeSegmentsString: '0.04-0.09;0.21-0.30',
        timeLimit: '60', // 60 seconds
        published: 'true'
      },
      {
        problemTypeId: '63',
        unitTitle: 'Sample Quiz - Listen Image Select Multiple Answer',
        paragraphText: 'リンさんは何曜日(なんようび)に働(はたら)きましたか働(はたら)きました（O）働(はたら)きませんでした（X）',
        answerContent: `月曜日(げつようび)（ー）
火曜日(かようび)（ー）
水曜日(すいようび)（ー）
木曜日(もくようび)（ー）
金曜日(きんようび)（ー）
土曜日(どようび)（ー）
日曜日(にちようび)（ー）`,
        correctAnswers: 'O,O,X,O,X,O,X',
        blankOptions: 'O,X',
        scriptText: `A:リンさんは先週(せんしゅう)、何曜日(なんようび)に働(はたら)きましたか。
B:えーと、月曜日(げつようび)と火曜日(かようび)と木曜日(もくようび)に働(はたら)きました。
A:水曜日(すいようび)は?
B:働(はたら)きませんでした。水曜日(すいようび)は休(やす)みました。
A:金曜日(きんようび)は?
B:金曜日(きんようび)も働(はたら)きませんでした。土曜日(どようび)と日曜日(にちようび)は休(やす)みです。
A:そうですか。`,
        instructions: '音声を聞いて、絵を見て、正しい答えを選んでください。',
        audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.mp3',
        imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/1.png',
        'startTime/endTime': '0.34-0.50',
        timeSegments: '0.04-0.09;0.21-0.30',
        timeSegmentsString: '0.04-0.09;0.21-0.30',
        timeLimit: '60',
        published: 'true'
      },
      {
        problemTypeId: '65',
        unitTitle: 'Sample Quiz - Listen Image Select Multiple Answer (Template 65)',
        paragraphText: '田中さんは何曜日(なんようび)に学校(がっこう)に行(い)きましたか行(い)きました（O）行(い)きませんでした（X）',
        answerContent: `月曜日(げつようび)（ー）
火曜日(かようび)（ー）
水曜日(すいようび)（ー）
木曜日(もくようび)（ー）
金曜日(きんようび)（ー）
土曜日(どようび)（ー）
日曜日(にちようび)（ー）`,
        correctAnswers: 'O,O,X,O,X,O,X',
        blankOptions: 'O,X',
        scriptText: `A:田中さんは先週(せんしゅう)、何曜日(なんようび)に学校(がっこう)に行(い)きましたか。
B:えーと、月曜日(げつようび)と火曜日(かようび)と木曜日(もくようび)に行(い)きました。
A:水曜日(すいようび)は?
B:行(い)きませんでした。水曜日(すいようび)は休(やす)みました。
A:金曜日(きんようび)は?
B:金曜日(きんようび)も行(い)きませんでした。土曜日(どようび)と日曜日(にちようび)は休(やす)みです。
A:そうですか。`,
        instructions: '音声を聞いて、絵を見て、正しい答えを選んでください。',
        audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/2.mp3',
        imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/2.png',
        'startTime/endTime': '0.34-0.50',
        timeSegments: '0.04-0.09;0.21-0.30',
        timeSegmentsString: '0.04-0.09;0.21-0.30',
        timeLimit: '60',
        published: 'true'
      },
      {
        problemTypeId: '39',
        unitTitle: 'Sample Quiz 2',
        paragraphText: '女の人は何を買いましたか。',
        blankOptions: '本,ペン,ノート,消しゴム',
        scriptText: '女：本を買いました。',
        instructions: '音声を聞いて、正しい答えを選んでください。',
        audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/2.mp3',
        imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/2.png',
        'startTime/endTime': '1.20-2.15',
        timeLimit: '60', // 60 seconds
        published: 'true'
      },
      {
        problemTypeId: '45',
        unitTitle: 'Sample Quiz - Highlight Japanese Words',
        paragraphText: 'これは正しい日本語の文章です。間違った言葉があります。',
        fixedWordsExplanation: '正しい=correct,間違った=wrong',
        instructions: '正(ただ)しくない言葉(ことば)をえらんでください',
        audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/3.mp3',
        imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/3.png',
        'startTime/endTime': '0.10-0.45',
        timeLimit: '60',
        published: 'true'
      },
      {
        problemTypeId: '67',
        unitTitle: 'Sample Quiz - Listen Write Answer with Image',
        paragraphText: '田中さんは何時に学校に行きますか。',
        answerContent: `田中さんは（ー）時に学校に行きます。
田中さんは（ー）曜日に家に帰ります。`,
        correctAnswers: '9:00〜12:00;月/げつ',
        blankOptions: '9:00〜12:00;月/げつ',
        scriptText: `A:田中さんは何時に学校に行きますか。
B:9時に行きます。
A:何曜日に家に帰りますか。
B:月曜日に帰ります。`,
        instructions: '音声を聞いて、正しい答えを選んでください。',
        audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/3.mp3',
        imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/3.png',
        'startTime/endTime': '0.34-0.50',
        timeSegments: '0.04-0.09;0.21-0.30',
        timeSegmentsString: '0.04-0.09;0.21-0.30',
        timeLimit: '60',
        published: 'true'
      },
      {
        problemTypeId: '67',
        unitTitle: 'Sample Quiz - Multiple Correct Answers',
        paragraphText: '以下の質問に答えてください。',
        answerContent: `時間は（ー）です。
曜日は（ー）です。
色は（ー）です。`,
        correctAnswers: '9:00/9時;月/げつ/月曜日;赤/あか/赤色',
        blankOptions: '9:00/9時;月/げつ/月曜日;赤/あか/赤色',
        scriptText: `A:時間は何時ですか。
B:9時です。
A:何曜日ですか。
B:月曜日です。
A:色は何色ですか。
B:赤色です。`,
        instructions: '音声を聞いて、正しい答えを選んでください。',
        audioFile: '/asset-v1:Manabi+N51+2026+type@asset+block/4.mp3',
        imageFile: '/asset-v1:Manabi+N51+2026+type@asset+block/4.png',
        'startTime/endTime': '0.20-1.00',
        timeSegments: '0.05-0.15;0.20-0.35;0.40-0.55',
        timeSegmentsString: '0.05-0.15;0.20-0.35;0.40-0.55',
        timeLimit: '60',
        published: 'true'
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Quiz Template');
    
    // Generate and download file
    XLSX.writeFile(wb, 'quiz_template.xlsx');
  };

  const handleQuizSubmit = async () => {
    try {
      // Validate required fields based on problem type
      if (quizData.problemTypeId === TEMPLATE_IDS.HIGHLIGHT_JAPANESE) {
        // For highlight quizzes, ensure fixedWordsExplanation is not empty
        if (!quizData.fixedWordsExplanation || quizData.fixedWordsExplanation.trim() === '') {
          alert('Fixed Words Explanation is required for highlight quizzes. Please enter at least one word pair.');
          return;
        }
      }
      if (quizData.problemTypeId === TEMPLATE_IDS.ID45_LISTEN_HIGHTLIGHT) {
        // For ID 45 highlight quizzes, ensure fixedWordsExplanation is not empty
        if (!quizData.fixedWordsExplanation || quizData.fixedWordsExplanation.trim() === '') {
          alert('Fixed Words Explanation is required for highlight quizzes. Please enter at least one word pair.');
          return;
        }
      }
      if (quizData.problemTypeId === TEMPLATE_IDS.VOCAB_MATCHING) {
        if (!quizData.words || quizData.words.trim() === '') {
          alert('Words are required for vocabulary matching quizzes. Please enter at least one word.');
          return;
        }
        if (!quizData.dropZones || quizData.dropZones.trim() === '') {
          alert('Drop zones are required for vocabulary matching quizzes. Please enter at least one drop zone.');
          return;
        }
      }
      
      // Extract course ID from section ID
      const courseIdMatch = courseId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
      if (!courseIdMatch) {
        throw new Error('Invalid course ID format');
      }
      const formattedCourseId = `course-v1:${courseIdMatch[1]}`;

      // Create quiz using the current quizData state
      await createQuiz({
        courseId: formattedCourseId,
        subsectionId: courseId, // Pass the subsection ID
        quizData: {
          unitTitle: quizData.unitTitle,
          paragraphText: quizData.paragraphText,
          problemTypeId: quizData.problemTypeId,
          correctAnswers: quizData.correctAnswers,
          timeLimit: quizData.timeLimit,
          published: quizData.published,
          wordBank: quizData.wordBank,
          fixedWordsExplanation: quizData.fixedWordsExplanation,
          instructions: quizData.instructions,
          audioFile: quizData.audioFile,
          startTime: quizData.startTime,
          endTime: quizData.endTime,
          timeSegmentsString: quizData.timeSegmentsString || '',
          blankOptions: quizData.blankOptions,
          optionsForBlanks: quizData.optionsForBlanks,
          scriptText: quizData.scriptText,
          imageFile: quizData.imageFile,
          images: quizData.images,
          answerContent: quizData.answerContent,
          questionText: quizData.questionText,
          words: quizData.words,
          dropZones: quizData.dropZones
        },
        onFileCreated: async (files) => {
          try {
            console.log('Starting file uploads for files:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
            
            // Upload both files and wait for the results
            const uploadPromises = files.map(async (file) => {
              console.log(`Uploading file: ${file.name}`);
              try {
                // Use the addAssetFile thunk for file upload
                await dispatch(addAssetFile(formattedCourseId, file, false));
                
                // Wait for the Redux store to be updated
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Return success since the thunk doesn't return a value
                return { success: true, filename: file.name };
              } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw error;
              }
            });
            
            const results = await Promise.all(uploadPromises);
            console.log('All upload results:', results);
            
            // Check if any upload failed
            const failedUploads = results.filter(result => !result.success);
            if (failedUploads.length > 0) {
              console.error('Failed uploads:', failedUploads);
              throw new Error(`Failed to upload ${failedUploads.length} files`);
            }
            
            return true; // Return true to indicate successful upload
          } catch (error) {
            console.error('Error in file upload:', error);
            // Log additional error details if available
            if (error.response) {
              console.error('Error response:', error.response.data);
            }
            throw error;
          }
        },
        onCreateUnit: async (title) => {
          try {
            // Call the parent component's onCreateUnit function with just the title
            const unitId = await onCreateUnit(title);
            if (!unitId) {
              throw new Error('Failed to create unit');
            }
            return unitId;
          } catch (error) {
            console.error('Error in onCreateUnit:', error);
            throw error;
          }
        }
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleQuizSubmit:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button
          variant="primary"
          iconBefore={Quiz}
          onClick={handleGenerateQuiz}
          className={className}
        >
          {intl.formatMessage(quizMessages.generateButton)}
        </Button>
        
        <Button
          variant="outline-primary"
          iconBefore={Upload}
          onClick={handleBulkImport}
          className={className}
        >
          Bulk Import
        </Button>
      </div>

      <QuizModal
        isOpen={showQuizModal}
        onClose={handleCloseModal}
        onSubmit={handleQuizSubmit}
        quizData={quizData}
        setQuizData={setQuizData}
        intl={intl}
        courseId={courseId}
        dispatch={dispatch}
      />

      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={handleCloseBulkModal}
        onImport={() => {}}
        intl={intl}
        courseId={courseId}
        dispatch={dispatch}
        onDownloadTemplate={downloadTemplate}
        onCreateUnit={onCreateUnit}
      />
    </>
  );
};

CreateQuizButton.propTypes = {
  onFileCreated: PropTypes.func.isRequired,
  onCreateUnit: PropTypes.func,
  className: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

CreateQuizButton.defaultProps = {
  className: '',
  onCreateUnit: null,
};

export default injectIntl(CreateQuizButton); 
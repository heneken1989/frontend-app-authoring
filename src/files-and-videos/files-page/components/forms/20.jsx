import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const DragDropForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Paragraph Text with Blanks</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.paragraphText}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              paragraphText: e.target.value
            }));
          }}
          placeholder="Enter paragraph text with blanks marked as （ー）. For example: たしかに （ー）晴れるでしょう。"
        />
        <Form.Text>
          Mark blanks in your text using （ー）. Each blank will be replaced with a draggable word.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Word Bank (Correct Answers)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.wordBank}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              wordBank: e.target.value
            }));
          }}
          placeholder="Enter words in the correct order, separated by commas. For example: たぶん,もし,きっと,たしか"
        />
        <Form.Text>
          Enter the words in the order they should appear in the blanks. The first word will be the correct answer for the first blank, second word for the second blank, and so on. The words will appear in random order in the quiz.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={quizData.instructions}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              instructions: e.target.value
            }));
          }}
          placeholder="Enter instructions for the quiz"
        />
        <Form.Text>
          Instructions that will appear above the quiz paragraph.
          Default is "Drag the words to the correct blanks."
        </Form.Text>
      </Form.Group>
    </>
  );
};

DragDropForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default DragDropForm; 
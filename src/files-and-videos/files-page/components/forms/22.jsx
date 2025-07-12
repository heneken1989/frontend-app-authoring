import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const GrammarSentenceRearrangementForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Word List (In Correct Order)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.wordBank}
          onChange={(e) => {
            const words = e.target.value;
            setQuizData(prev => ({
              ...prev,
              wordBank: words,
              paragraphText: words
            }));
          }}
          placeholder="Enter words in correct order, separated by commas. For example: 受付（うけつけ）,は,どちら,です,か"
        />
        <Form.Text>
          Enter the words in the correct order, separated by commas. These words will be shuffled in the word bank for students to arrange in the correct order.
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
          defaultValue="単語を正しい順序に並べ替えてください。"
        />
        <Form.Text>
          Instructions that will appear above the quiz.
          Default is "単語を正しい順序に並べ替えてください。"
        </Form.Text>
      </Form.Group>
    </>
  );
};

GrammarSentenceRearrangementForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default GrammarSentenceRearrangementForm; 
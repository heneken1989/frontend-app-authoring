import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const FillInBlankForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.paragraphText}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              paragraphText: e.target.value
            }));
          }}
          placeholder="Enter the question text. Use [BLANK:correct_answer|wrong1|wrong2] to mark blanks with their options."
        />
        <Form.Text>
          Format: Use [BLANK:correct_answer|wrong1|wrong2] to create blanks. The first option is always the correct answer.
          <br />
          Example: The capital of Japan is [BLANK:Tokyo|Kyoto|Osaka].
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          type="text"
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
          Instructions that will be shown to the student. Default: "Fill in the blanks with the correct answers."
        </Form.Text>
      </Form.Group>
    </>
  );
};

FillInBlankForm.propTypes = {
  quizData: PropTypes.shape({
    paragraphText: PropTypes.string.isRequired,
    instructions: PropTypes.string
  }).isRequired,
  setQuizData: PropTypes.func.isRequired
};

export default FillInBlankForm; 
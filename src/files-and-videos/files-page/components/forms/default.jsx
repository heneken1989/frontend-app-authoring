import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const DefaultForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Paragraph Text</Form.Label>
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
          placeholder="Enter paragraph text"
        />
        <Form.Text>
          Enter the main content for this quiz.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Correct Answers</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.correctAnswers}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              correctAnswers: e.target.value
            }));
          }}
          placeholder={'{\n  "blank": "answer"\n}'}
        />
        <Form.Text>
          Enter the correct answers for this quiz. Format depends on the quiz type.
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
          Instructions that will appear above the quiz.
        </Form.Text>
      </Form.Group>
    </>
  );
};

DefaultForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default DefaultForm; 
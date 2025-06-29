import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenMultipleChoiceForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.questionText}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              questionText: e.target.value
            }));
          }}
          placeholder="Enter the question text. Example: どんな人ですか。"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Answer Options</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.answerOptions}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              answerOptions: e.target.value,
              correctAnswers: e.target.value.split(',')[0] // Set first option as correct answer
            }));
          }}
          placeholder="Enter answer options separated by commas. First option is the correct answer. Example: 優しい人です,厳しい人です,面白い人です,真面目な人です"
        />
        <Form.Text>
          The first option will be used as the correct answer.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Script Text (スクリプト)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.scriptText}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              scriptText: e.target.value
            }));
          }}
          placeholder="Enter the script text that will be shown after submission."
        />
        <Form.Text>
          This text will be displayed as the script after submission. Text inside quotation marks will appear in red.
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
          Instructions that will appear above the quiz question.
          Default is "Listen to the audio and select the correct answer."
        </Form.Text>
      </Form.Group>
    </>
  );
};

ListenMultipleChoiceForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenMultipleChoiceForm; 
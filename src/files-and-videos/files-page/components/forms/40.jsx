import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenSingleChoiceNoImageForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.paragraphText}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              paragraphText: e.target.value
            }));
          }}
          placeholder="Enter the question text. For example: 男の人は何と言いましたか。"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Answer Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.answerContent || quizData.blankOptions || ''}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              answerContent: e.target.value
            }));
          }}
          placeholder="Enter options separated by commas. First option is correct. Example: はい、分かりました,いいえ、分かりません,すみません"
        />
        <Form.Text>
          Enter options separated by commas. The first option will be the correct answer.
          Example: "はい、分かりました,いいえ、分かりません,すみません" creates three options where "はい、分かりました" is correct.
          Options will be displayed in alphabetical order.
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
          placeholder="Enter the complete script text that will be shown after submission."
        />
        <Form.Text>
          This text will be shown as the script (スクリプト) after the user submits their answer.
          Text in quotes ("...") will be shown in red.
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
          Instructions that will appear above the quiz. Default is "音声を聞いて、正しい答えを選んでください。"
        </Form.Text>
      </Form.Group>
    </>
  );
};

ListenSingleChoiceNoImageForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenSingleChoiceNoImageForm; 
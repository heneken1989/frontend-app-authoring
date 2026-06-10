import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenSingleChoiceForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Title (optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={quizData.title || ''}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              title: e.target.value
            }));
          }}
          placeholder="Optional title shown above the question text in bold."
        />
        <Form.Text>
          If provided, displays above the question text with the same style but bold.
        </Form.Text>
      </Form.Group>
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
        <Form.Label>Countdown Time (seconds)</Form.Label>
        <Form.Control
          type="number"
          min="0"
          value={quizData.countdownTime === '' || quizData.countdownTime === undefined ? 10 : quizData.countdownTime}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            setQuizData(prev => ({
              ...prev,
              countdownTime: Number.isNaN(n) || n < 0 ? 10 : n,
            }));
          }}
          placeholder="10"
        />
        <Form.Text>
          Seconds to wait before audio starts playing. Default is 10 seconds. Set to 0 to start immediately.
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

ListenSingleChoiceForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenSingleChoiceForm; 
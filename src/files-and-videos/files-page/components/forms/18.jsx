import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const GrammarDropdownForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Answer Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.answerContent ||`
A：サントスさんはブラジル人です。マリアさん（ー）ブラジル人ですか。
B：はい、マリアさん（ー）ブラジル人です。
A：ミラーさん（ー）ブラジル人ですか。
B：いいえ、ミラーさん（ー）ブラジル人じゃありません。`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              answerContent: e.target.value
            }));
          }}
          placeholder="Enter content with （ー） placeholders"
        />
        <Form.Text>
          Enter the content with （ー） as placeholders for dropdowns. Each （ー） will become a dropdown select.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Options for Each Blank</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.optionsForBlanks || "は,が,で,に,を,へ,から,まで"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              optionsForBlanks: e.target.value
            }));
          }}
          placeholder="は,が,で,に,を,へ,から,まで"
        />
        <Form.Text>
          Enter options for each blank, separated by semicolons. Each blank's options are comma-separated.<br />
          Example: <code>option1a,option1b;option2a,option2b</code><br />
          The first option for each blank will be the correct answer.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Script Text (スクリプト)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.scriptText || ``}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              scriptText: e.target.value
            }));
          }}
          placeholder="Enter the script text that will be shown after submission"
        />
        <Form.Text>
          This text will be shown as the script (スクリプト) when answers are displayed.
          Text in quotes ("...") will be highlighted in red.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={quizData.instructions || "（ー）に何を　入れますか。"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              instructions: e.target.value
            }));
          }}
          placeholder="（ー）に何を　入れますか。"
        />
        <Form.Text>
          Instructions that will appear at the top of the quiz.
        </Form.Text>
      </Form.Group>
    </>
  );
};

GrammarDropdownForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default GrammarDropdownForm; 
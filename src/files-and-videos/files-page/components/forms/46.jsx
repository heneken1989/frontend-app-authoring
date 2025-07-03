import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenWithImageMultipleDifferentBlankOptionsForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Answer Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.answerContent ||`
どうしてですか。\（ー）がありますから、映画(えいが)を（ー）。`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              answerContent: e.target.value
            }));
          }}
          placeholder="Enter content with （ー） placeholders"
        />
        <Form.Text>
          Enter the content with （ー） as placeholders for dropdowns. Each （ー） will become a dropdown with its own set of options.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Options for Each Blank</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.optionsForBlanks || "a,b,c,d,e,f;見ません,見ます"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              optionsForBlanks: e.target.value
            }));
          }}
          placeholder=""
        />
        <Form.Text>
          Enter options for each blank, separated by semicolons. Each blank's options are comma-separated.<br />
          Example: <code>option1a,option1b;option2a,option2b;option3a,option3b</code><br />
          The first option for each blank will be the correct answer.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Script Text (スクリプト)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.scriptText || `
A: すみません。何時(なんじ)から何時(なんじ)まで働(はたら)きますか。
B: "9:00から17:00まで働(はたら)きます。"
A: 休(やす)みは何曜日(なんようび)ですか。
B: "月曜日(げつようび)です。"`}
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
          value={quizData.instructions || "音声を聞いて、絵を見て、正しい答えを選んでください。"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              instructions: e.target.value
            }));
          }}
          placeholder="音声を聞いて、絵を見て、正しい答えを選んでください。"
        />
        <Form.Text>
          Instructions that will appear at the top of the quiz.
        </Form.Text>
      </Form.Group>
    </>
  );
};

ListenWithImageMultipleDifferentBlankOptionsForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenWithImageMultipleDifferentBlankOptionsForm; 
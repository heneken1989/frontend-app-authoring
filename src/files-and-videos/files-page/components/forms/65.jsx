import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenImageSelectMultipleAnswerMultiOptionsForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Answer Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.answerContent ||`
aですか。bですか。
ケリー：国(くに)（ー）、仕事(しごと)：（ー）の教師(きょうし)`}
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
          value={quizData.optionsForBlanks || "働(はたら)きました,働(はたら)きませんでした;働(はたら)きました,働(はたら)きませんでした"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              optionsForBlanks: e.target.value
            }));
          }}
          placeholder="働(はたら)きました,働(はたら)きませんでした;働(はたら)きました,働(はたら)きませんでした"
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
          value={quizData.scriptText || `
A: 初(はじ)めまして。失礼(しつれい)ですが、お名前(なまえ)は?
B:ケリーです。
A:お国(くに)はアメリカですか。
B: "いいえ、オーストラリアです。"
A:ああ、そうですか。あのう･･････。
B:"わたしは英語(えいご)の教師(きょうし)です。"
A:そうですか。よろしくお願(ねが)いします。
B:こちらこそ、どうぞよろしく。`}
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
          value={quizData.instructions || "音声を聞いて、正しい答えを選んでください。"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              instructions: e.target.value
            }));
          }}
          placeholder="音声を聞いて、正しい答えを選んでください。"
        />
        <Form.Text>
          Instructions that will appear at the top of the quiz.
        </Form.Text>
      </Form.Group>
    </>
  );
};

ListenImageSelectMultipleAnswerMultiOptionsForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenImageSelectMultipleAnswerMultiOptionsForm; 
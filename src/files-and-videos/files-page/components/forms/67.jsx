import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenWriteAnswerWithImageForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Answer Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.answerContent ||`
何時(なんじ)から何時(なんじ)までですね。休(やす)みは何曜日(なんようび)ですか。
なにわ図書館(としょかん)
（ー）（ー）曜日(ようび)`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              answerContent: e.target.value
            }));
          }}
          placeholder="月曜日（ー）"
        />
        <Form.Text>
          Enter the content that will be used to generate questions with blanks. Each line will be a question with （ー） as placeholders for text inputs.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Correct Answers for Each Blank</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.blankOptions || "9:00〜12:00;4:30〜7:30;日/にち"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              blankOptions: e.target.value,
              // Also update correctAnswers to match the blankOptions
              correctAnswers: e.target.value
            }));
          }}
          placeholder="9:00〜12:00;日/にち"
        />
        <Form.Text>
          Enter the correct answers for each blank, separated by semicolons (;). 
          If a blank has multiple correct answers, separate them with forward slashes (/).
          Example: "9:00〜12:00;4:30〜7:30;日/にち" means first blank accepts "9:00〜12:00", second blank accepts "4:30〜7:30", third blank accepts either "日" or "にち".
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Script Text (スクリプト)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.scriptText || `A:リンさんは先週(せんしゅう)、何曜日(なんようび)に働(はたら)きましたか。
B:えーと、月曜日(げつようび)と火曜日(かようび)と木曜日(もくようび)に働(はたら)きました。
A:水曜日(すいようび)は?
B:働(はたら)きませんでした。水曜日(すいようび)は休(やす)みました。
A:金曜日(きんようび)は?
B:金曜日(きんようび)も働(はたら)きませんでした。土曜日(どようび)と日曜日(にちようび)は休(やす)みです。
A:そうですか。`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              scriptText: e.target.value
            }));
          }}
          placeholder="Enter the complete script text that will be shown after submission."
        />
        <Form.Text>
          This text will be shown as the script (スクリプト) after the user submits their answers.
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
          Instructions that will appear above the quiz. Default is "音声を聞いて、絵を見て、正しい答えを選んでください。"
        </Form.Text>
      </Form.Group>
    </>
  );
};

ListenWriteAnswerWithImageForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenWriteAnswerWithImageForm; 
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenImageSelectMultipleAnswerForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.paragraphText||`
リンさんは何曜日(なんようび)に働(はたら)きましたか働(はたら)きました（O）働(はたら)きませんでした（X`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              paragraphText: e.target.value
            }));
          }}
          placeholder="Enter the question text"
        />
        <Form.Text>
          Enter the main question text that appears above the blanks. Use （ー） as placeholders for dropdowns.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Answer Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.answerContent ||`
月曜日(げつようび)（ー）
火曜日(かようび)（ー）
水曜日(すいようび)（ー）
木曜日(もくようび)（ー）
金曜日(きんようび)（ー）
土曜日(どようび)（ー）
日曜日(にちようび)（ー）`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              answerContent: e.target.value
            }));
          }}
          placeholder="月曜日"
        />
        <Form.Text>
          Enter the content that will be used to generate question choices. Each line will be a question.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Options for Each Blank</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.blankOptions || "O,O,X,O,X,X,X"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              blankOptions: e.target.value,
              // Also update correctAnswers to match the first value of blank options
              correctAnswers: e.target.value.split(',')[0]?.trim() || ''
            }));
          }}
          placeholder="O,O,X,O,X,X,X"
        />
        <Form.Text>
          Enter the options that will appear in each dropdown, separated by commas.
          The first option will be used as the correct answer for each blank.
          Example: "月曜日,火曜日,水曜日,木曜日,金曜日,土曜日,日曜日"
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

ListenImageSelectMultipleAnswerForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenImageSelectMultipleAnswerForm; 
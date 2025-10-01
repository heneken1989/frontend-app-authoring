import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const GrammarSingleSelectForm = ({ quizData, setQuizData }) => {
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
          placeholder="Enter the question text. For example: 正しい文を選んでください。"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Answer Options</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.blankOptions}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              blankOptions: e.target.value
            }));
          }}
          placeholder="Enter options separated by commas. First option is correct. Example: 私は毎日日本語を勉強します,私が毎日日本語を勉強します,私は毎日日本語が勉強します"
        />
        <Form.Text>
          Enter options separated by commas. The first option will be the correct answer.
          Example: "私は毎日日本語を勉強します,私が毎日日本語を勉強します,私は毎日日本語が勉強します" creates three options where "私は毎日日本語を勉強します" is correct.
          Options will be displayed in alphabetical order.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Explanation (解説)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.explanationText}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              explanationText: e.target.value
            }));
          }}
          placeholder="Enter the explanation that will be shown after submission. You can use quotes to highlight important parts."
        />
        <Form.Text>
          This text will be shown as the explanation (解説) after the user submits their answer.
          Text in quotes ("...") will be shown in red.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Script Text (スクリプト)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.scriptText || ''}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              scriptText: e.target.value
            }));
          }}
          placeholder="Enter the script text that will be shown after submission"
        />
        <Form.Text>
          This text will be shown as the script (スクリプト) after the user submits their answer.
          You can use furigana format like 毎日（まいにち）or 車(くるま).
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
          defaultValue="（ー）に　何を　いれますか"
        />
        <Form.Text>
          Instructions that will appear above the quiz. Default is "（ー）に　何を　いれますか"
        </Form.Text>
      </Form.Group>
    </>
  );
};

GrammarSingleSelectForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default GrammarSingleSelectForm; 
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenFillBlankForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Paragraph Text with Blanks</Form.Label>
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
          placeholder="Enter paragraph text with blanks marked as （ー）. For example: どうしてですか。（ー）がありますから、映画(えいが)を（ー）。"
        />
        <Form.Text>
          Mark blanks in your text using （ー）. Each blank will be replaced with a dropdown list.
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
          This text will be shown as the script (スクリプト) after the user submits their answers.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Options for Each Blank</Form.Label>
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
          placeholder="Enter options for each blank, separated by semicolons. First option is correct. Example: e,a,b,c,d,f;飲(の)みません,飲(の)みま"
        />
        <Form.Text>
          For each blank, provide a list of options separated by commas. Use semicolons to separate different blanks.
          The first option for each blank will be the correct answer.
          Example: "e,a,b,c,d,f;飲(の)みません,飲(の)みま" creates two dropdowns:
          1st blank: [e,a,b,c,d,f] (e is correct)
          2nd blank: [飲(の)みません,飲(の)みま] (飲(の)みません is correct)
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
          Instructions that will appear above the quiz paragraph.
          Default is "Listen to the audio and select the correct answer for each blank."
        </Form.Text>
      </Form.Group>
    </>
  );
};

ListenFillBlankForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenFillBlankForm; 
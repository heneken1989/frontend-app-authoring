import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ReadingMultipleQuestionForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Reading Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.paragraphText||`田中(たなか)さんは 月曜日(げつようび)の 朝(あさ) 福岡(ふくおか)から 東京(とうきょう)の 本社(ほんしゃ)へ 行(い)きます。本社(ほんしゃ)の 会議(かいぎ)は １０時(じ)から ５時(じ)までです。本社(ほんしゃ)から 空港(くうこう)まで JRで 30分(ぶん)です。夜(よる) 福岡(ふくおか)へ帰(かえ)ります。`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              paragraphText: e.target.value
            }));
          }}
          placeholder="Enter the reading text that students will read."
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Images</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.images || ''}
          onChange={(e) => {
            console.log('Images field changed:', e.target.value);
            setQuizData(prev => {
              const newData = {
                ...prev,
                images: e.target.value
              };
              console.log('Updated quizData:', newData);
              return newData;
            });
          }}
          placeholder="Enter image URLs separated by commas or semicolons. Leave empty if no images needed."
        />
        <Form.Text>
          Enter image URLs separated by commas (,) or semicolons (;).<br/>
          Images will be displayed vertically above the reading text.<br/>
          Example:<br/>
          "image1.jpg, image2.jpg, image3.jpg"<br/>
          or<br/>
          "image1.jpg; image2.jpg; image3.jpg"<br/>
          Leave empty if no images are needed for this quiz.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Questions</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.questionText||`ペットが欲(ほ)しいです。誰(だれ)に電話(でんわ)をかけますか。;

中国(ちゅうごく)の留学生(りゅうがくせい)です。アルバイトをしたいです。誰(だれ)に電話(でんわ)をかけますか。;`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              questionText: e.target.value
            }));
          }}
          placeholder="Enter questions separated by semicolons (;). Each question will be automatically numbered."
        />
        <Form.Text>
          Enter each question separated by semicolons (;).<br/>
          Questions will be automatically numbered as 問1, 問2, etc.<br/>
          Example:<br/>
          "What is the main topic?; When did this happen?; Who is the main character?"<br/>
          Will display as:<br/>
          問1　What is the main topic?<br/>
          問2　When did this happen?<br/>
          問3　Who is the main character?
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Answer Options</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.blankOptions||`木(もく)曜(よう)日(び)のよる7:00~9:00,日(にち)曜(よう)日(び)の9:00~12:00。;a,b,c,d`}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              blankOptions: e.target.value
            }));
          }}
          placeholder="Enter options for each question, separated by semicolons (;). For each question, separate options with commas."
        />
        <Form.Text>
          Enter options for each question, separated by semicolons (;).<br/>
          For each question's options, separate them with commas (,).<br/>
          Options will be automatically numbered as 1, 2, 3, 4.<br/>
          The first option for each question will be the correct answer.<br/>
          Example:<br/>
          "correct1,wrong1a,wrong1b; correct2,wrong2a,wrong2b"<br/>
          Will display as:<br/>
          問1: 1. correct1, 2. wrong1a, 3. wrong1b<br/>
          問2: 1. correct2, 2. wrong2a, 3. wrong2b
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Explanations (解説)</Form.Label>
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
          placeholder="Enter explanations for each question, separated by semicolons (;). Each explanation will be shown with its question number."
        />
        <Form.Text>
          Enter explanations for each question, separated by semicolons (;).<br/>
          Each explanation will be shown with its corresponding number (1, 2, 3, etc.).<br/>
          Text in quotes ("...") will be shown in red.<br/>
          Example:<br/>
          "Explanation for question 1; Explanation for question 2; Explanation for question 3"<br/>
          Will display as:<br/>
          1: Explanation for question 1<br/>
          2: Explanation for question 2<br/>
          3: Explanation for question 3
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
          defaultValue="以下の文章を読んで、質問に答えてください。"
        />
        <Form.Text>
          Instructions that will appear above the quiz.
        </Form.Text>
      </Form.Group>
    </>
  );
};

ReadingMultipleQuestionForm.propTypes = {
  quizData: PropTypes.shape({
    paragraphText: PropTypes.string,
    images: PropTypes.string,
    questionText: PropTypes.string,
    blankOptions: PropTypes.string,
    scriptText: PropTypes.string,
    instructions: PropTypes.string
  }).isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ReadingMultipleQuestionForm; 
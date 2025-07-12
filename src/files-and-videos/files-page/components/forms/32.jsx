import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ReadingSame31Form = ({ quizData, setQuizData }) => {
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
          placeholder="Enter questions separated by semicolons (;). Example: What is the main topic?; When did this happen?; Who is the main character?"
        />
        <Form.Text>
          Enter each question separated by semicolons (;).
          Example: "What is the main topic?; When did this happen?; Who is the main character?"
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
          placeholder="Enter options for each question, separated by semicolons (;). For each question, separate options with commas. First option is correct. Example: correct1,wrong1a,wrong1b; correct2,wrong2a,wrong2b"
        />
        <Form.Text>
          Enter options for each question, separated by semicolons (;).
          For each question's options, separate them with commas (,).
          The first option for each question will be the correct answer.
          Example: "correct1,wrong1a,wrong1b; correct2,wrong2a,wrong2b"
          This creates:
          Question 1 options: correct1 (correct), wrong1a, wrong1b
          Question 2 options: correct2 (correct), wrong2a, wrong2b
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Explanation (解説)</Form.Label>
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
          placeholder="Enter the explanation that will be shown after submission. You can use quotes to highlight important parts."
        />
        <Form.Text>
          This text will be shown as the explanation (解説) after the user submits their answer.
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
          defaultValue="つぎのぶんしょうを読(よ)んで、質問(しつもん)にこたえてください。答(こた)えは、１・２・３・４からいちばん いいものを一(ひと)つ えらんでください。"
        />
        <Form.Text>
          Instructions that will appear above the quiz. Default is "以下の文章を読んで、質問に答えてください。"
        </Form.Text>
      </Form.Group>
    </>
  );
};

ReadingSame31Form.propTypes = {
  quizData: PropTypes.shape({
    paragraphText: PropTypes.string,
    questionText: PropTypes.string,
    blankOptions: PropTypes.string,
    scriptText: PropTypes.string,
    instructions: PropTypes.string
  }).isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ReadingSame31Form; 
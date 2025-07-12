import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ReadingDroplistForm = ({ quizData, setQuizData }) => {
  useEffect(() => {
    if (!quizData.instructions) {
      setQuizData(prev => ({
        ...prev,
        instructions: "次の質問に正しいか間違っているか答えてください",
      }));
    }
  }, []);

  return (
    <>
      <Form.Group>
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.paragraphText||`
ミラーさんは毎朝(まいあさ)7(７)時(じ)に起(お)きます。朝(あさ)ご飯(はん)はいつもパン(ぱん)とコーヒーです。電車(でんしゃ)で会社(かいしゃ)へ行きます。会社(かいしゃ)は9時(じ)から5時(じ)までです。7時(じ)にうちへ帰(かえ)ります。7時半(じはん)に晩(ばん)ご飯(はん)を食(た)べます。それからテレビ(てれび)を見(み)ます。英語(えいご)の新聞(しんぶん)を読(よ)みます。夜(よる)12時(じ)に寝(ね)ます。 
土曜日(どようび)と日曜日(にちようび)は働(はたら)きません。土曜日(どようび)は朝図書館(あさとしょかん)へ行(い)きます。午後(ごご)テニスをします。日曜日(にちようび)はどこも行(い)きません。休(やす)みます。`}
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
例1： ( 〇 ) ミラーさんは 毎朝(まいあさ) コーヒーを 飲(の)みます。 
例2： ( X ) ミラーさんは 毎朝(まいあさ) 7時半(じはん)に 起(お)きます。 
1)（ー）ミラーさんは 朝(あさ)ごはんを 食(た)べません。 
2)（ー） ミラーさんは 月曜日(げつようび)から 金曜日(きんようび)まで 働(はたら)きます。 
3)（ー） ミラーさんは 毎朝(まいあさ) 英語(えいご)の 新聞(しんぶん)を 読(よ)みます。 
4)（ー） ミラーさんは 土曜日(どようび) どこも 行(い)きません。`}
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
          value={quizData.blankOptions || "X,O,X,X"}
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
          value={quizData.scriptText || ``}
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
          value={quizData.instructions || "次の質問に正しいか間違っているか答えてください"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              instructions: e.target.value
            }));
          }}
          placeholder="Enter instructions for the quiz"
        />
        <Form.Text>
          Instructions that will appear above the quiz. Default is "次の質問に正しいか間違っているか答えてください"
        </Form.Text>
      </Form.Group>
    </>
  );
};

ReadingDroplistForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ReadingDroplistForm; 
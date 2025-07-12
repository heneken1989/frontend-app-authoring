import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ListenSingleChoiceForm = ({ quizData, setQuizData }) => {
  useEffect(() => {
    if (!quizData.instructions) {
      setQuizData(prev => ({
        ...prev,
        instructions: "したの　ひょうは、「えいがの　時間」と「バスの　時間」です。つぎの　ぶんしょうを　読んで、しつもんに　こたえて　ください。こたえは、１・２・３・４から　いちばん　いいものを　一つ　えらんで　ください。",
      }));
    }
  }, []);

  return (
    <>
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
          Instructions that will appear above the quiz.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Paragraph Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.paragraphText||"あした ムンさんと 小川町(おがわまち)で、えいがを 見(み)ます。小川町(おがわちょう)では、いま いろいろな えいがが あります。おもしろい えいがが 見(み)たいです。ムンさんは どうぶつの 話(はなし)が すきですが、わたしは すきでは ありません。帰(かえ)りは、バスで 帰(かえ)ります。ムンさんも わたしも ９時前(じまえ)に アパートの ある 海山町(みやまちょう)に もどりたいです。"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              paragraphText: e.target.value
            }));
          }}
          placeholder="Enter the paragraph text that will appear below the image"
        />
        <Form.Text>
          This text will appear below the image as the main reading passage.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.questionText||"バスは　何時に　海山町(みやまちょう)に　つきますか。"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              questionText: e.target.value
            }));
          }}
          placeholder="Enter the question text. For example: 男の人は何と言いましたか。"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Answer Options</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.blankOptions||"９時１５分,８時３０分,８時,９時"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              blankOptions: e.target.value
            }));
          }}
          placeholder="Enter options separated by commas. First option is correct."
        />
        <Form.Text>
          Enter options separated by commas. The first option will be the correct answer.
          Example: "はい、分かりました,いいえ、分かりません,すみません" creates three options where "はい、分かりました" is correct.
          Options will be displayed in alphabetical order.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Script Text (スクリプト)</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={quizData.scriptText||"ムンさんは　どうぶつの　話(はなし）が　すきですが、わたしは　すきでは　ありません。(Mun thích những câu chuyện về động vật nhưng tôi thì không)ムンさんも　わたしも　９時前(じまえ)に　アパートの　ある　海山町(みやまちょう)に　もどりたいです。(Mun và tôi đều muốn về căn hộ ở Miyamacho trước 9 giờ)"}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              scriptText: e.target.value
            }));
          }}
          placeholder="Enter the complete script text that will be shown after submission."
        />
        <Form.Text>
          This text will be shown as the script (スクリプト) after the user submits their answer.
          Text in quotes ("...") will be shown in red.
        </Form.Text>
      </Form.Group>
    </>
  );
};

ListenSingleChoiceForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ListenSingleChoiceForm; 
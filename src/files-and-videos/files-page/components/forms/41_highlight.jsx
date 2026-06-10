import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const HighlightJapaneseForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Paragraph Text</Form.Label>
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
          placeholder="Enter the paragraph. For example: Now this you're letting your imagination stray, think about that scenario. A mysterious fungus..."
        />
        <Form.Text>
          Enter the paragraph. Users will click words to highlight them as answers.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Fixed Words Explanation</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.fixedWordsExplanation}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              fixedWordsExplanation: e.target.value
            }));
          }}
          placeholder="Enter pairs of wrong=correct words. For example: learners=learner,checked=check,able=ableable"
        />
        <Form.Text>
          <strong>Important:</strong> This field is required for the quiz to work correctly. 
          Provide pairs of wrong=correct words separated by commas. For each highlighted word, the correct version will be shown in parentheses.
          <br />
          <strong>Simple format:</strong> wrong=correct (e.g., "learners=learner,checked=check")
          <br />
          <strong>Indexed format:</strong> For repeated words, use word:index=correct (e.g., "the:0=a,the:1=an" for different occurrences of "the")
          <br />
          <strong>Note:</strong> Both standard (=) and full-width (＝) equals signs are supported.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Countdown Time (seconds)</Form.Label>
        <Form.Control
          type="number"
          min="0"
          value={quizData.countdownTime === '' || quizData.countdownTime === undefined ? 5 : quizData.countdownTime}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            setQuizData(prev => ({
              ...prev,
              countdownTime: Number.isNaN(n) || n < 0 ? 5 : n,
            }));
          }}
          placeholder="5"
        />
        <Form.Text>
          Seconds to wait before audio starts playing. Default is 5 seconds. Set to 0 to start immediately.
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
          Default is in Japanese: "正(ただ)しくない言葉(ことば)をえらんでください" (Please select the incorrect words).
        </Form.Text>
      </Form.Group>
    </>
  );
};

HighlightJapaneseForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default HighlightJapaneseForm; 
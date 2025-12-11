import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const ImageFlipPracticeForm = ({ quizData, setQuizData }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={quizData.instructions || '画像をクリックして答えを確認しましょう。'}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              instructions: e.target.value
            }));
          }}
          placeholder="Enter instructions for the learner"
        />
        <Form.Text>
          Text shown above the cards. Example: 画像をクリックして答えを確認しましょう。
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="text"
          value={quizData.images || ''}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              images: e.target.value
            }));
          }}
          placeholder="Enter one image URL (e.g., /asset-v1:.../image.png)"
        />
        <Form.Text>
          Only one image is used for this practice. Enter a single image URL.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={quizData.questionText || 'この人は誰ですか。'}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              questionText: e.target.value
            }));
          }}
          placeholder="Enter one question for this image"
        />
        <Form.Text>
          Only one question is needed because there is only one image.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Answer (答え)</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={quizData.blankOptions || ''}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              blankOptions: e.target.value
            }));
          }}
          placeholder="Enter the answer text that will be shown when the card is flipped"
        />
        <Form.Text>
          Enter the answer text. This will be displayed on the back of the card when clicked. You can enter multiple lines.
        </Form.Text>
      </Form.Group>
    </>
  );
};

ImageFlipPracticeForm.propTypes = {
  quizData: PropTypes.shape({
    instructions: PropTypes.string,
    images: PropTypes.string,
    questionText: PropTypes.string,
    blankOptions: PropTypes.string
  }).isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default ImageFlipPracticeForm;


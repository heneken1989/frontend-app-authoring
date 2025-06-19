import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, ModalDialog, Form, ActionRow } from '@openedx/paragon';
import { Edit } from '@openedx/paragon/icons';
import quizMessages from '../quiz-messages';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useDispatch } from 'react-redux';
import { deleteAssetFile, addAssetFile } from '../data/thunks';
import { getQuizTemplate } from './templates/templateUtils';

// UpdateQuizModal Component
const UpdateQuizModal = ({ isOpen, onClose, onSubmit, quizData, setQuizData, intl }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={intl.formatMessage(quizMessages.updateQuizTitle)}
      hasCloseButton
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {intl.formatMessage(quizMessages.updateQuizTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Unit Title</Form.Label>
            <Form.Control
              type="text"
              value={quizData.unitTitle}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  unitTitle: e.target.value
                }));
              }}
              placeholder="Enter the title for this JavaScript Unit"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Time Limit (minutes)</Form.Label>
            <Form.Control
              type="number"
              value={quizData.timeLimit}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  timeLimit: parseInt(e.target.value, 10)
                }));
              }}
              placeholder="Enter time limit in Seconds"
              min="0"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Publish</Form.Label>
            <Form.Check
              type="checkbox"
              label="Make this problem visible to learners"
              checked={quizData.published}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  published: e.target.checked
                }));
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {intl.formatMessage(quizMessages.quizParagraphLabel)}
            </Form.Label>
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
              placeholder={intl.formatMessage(quizMessages.quizParagraphPlaceholder)}
            />
            <Form.Text>
              {intl.formatMessage(quizMessages.quizParagraphHelp, { blank: '{{blank}}' })}
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              {intl.formatMessage(quizMessages.quizAnswersLabel)}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={quizData.correctAnswers}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  correctAnswers: e.target.value
                }));
              }}
              placeholder={'{\n  "blank": "answer"\n}'}
            />
            <Form.Text>
              {intl.formatMessage(quizMessages.quizAnswersHelp)}
            </Form.Text>
          </Form.Group>
        </Form>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button
            variant="outline-primary"
            onClick={onClose}
          >
            {intl.formatMessage(quizMessages.cancelButton)}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
          >
            {intl.formatMessage(quizMessages.updateButton)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

UpdateQuizModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  quizData: PropTypes.shape({
    unitTitle: PropTypes.string.isRequired,
    paragraphText: PropTypes.string.isRequired,
    correctAnswers: PropTypes.string.isRequired,
    timeLimit: PropTypes.number.isRequired,
    published: PropTypes.bool.isRequired,
  }).isRequired,
  setQuizData: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

// UpdateQuizButton Component
const UpdateQuizButton = ({ problemId: unitId, courseId, intl, onUpdate }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [quizData, setQuizData] = useState({
    unitTitle: '',
    paragraphText: '',
    correctAnswers: '{}',
    timeLimit: 3,
    published: false
  });
  const [problemBlockId, setProblemBlockId] = useState(null);
  const dispatch = useDispatch();

  const handleUpdateQuiz = async () => {
    try {
      const client = getAuthenticatedHttpClient();
      
      // Log the request URL
      console.log('Fetching vertical block data from:', `${getConfig().LMS_BASE_URL}/api/unit_problem/${unitId}/`);
      
      // Get the first problem in the unit using our new API endpoint
      const problemResponse = await client.get(
        `${getConfig().LMS_BASE_URL}/api/unit_problem/${unitId}/`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      // Log the full response
      console.log('Full vertical block response:', problemResponse);
      console.log('Response status:', problemResponse.status);
      console.log('Response data:', problemResponse.data);

      if (problemResponse.status === 200) {
        const problemData = problemResponse.data;
        
        if (!problemData) {
          console.error('No problem data received');
          return;
        }

        // Store the problem block ID
        setProblemBlockId(problemData.id);

        // Log the problem data structure
        console.log('Problem data structure:', {
          id: problemData.id,
          display_name: problemData.display_name,
          data: problemData.data,
          metadata: problemData.metadata
        });

        // Extract content from the problem data
        const content = problemData.data;
        console.log('Content found:', content);

        if (!content) {
          console.error('No content found in problem data');
          return;
        }

        // Only extract values if we don't already have them in state
        let paragraphText = quizData.paragraphText;
        let correctAnswers = quizData.correctAnswers;

        if (!paragraphText) {
          // Get paragraph text from comment
          const commentMatch = content.match(/<!-- paragraph_text: (.*?) -->/);
          if (commentMatch && commentMatch[1]) {
            paragraphText = commentMatch[1].trim();
            console.log('Found paragraph text in comment:', paragraphText);
          }
        }
        
        // Only extract correct answers if we don't already have them
        if (correctAnswers === '{}') {
          const correctAnswersMatch = content.match(/<hidden name="correct_answers">([^<]*)<\/hidden>/);
          if (correctAnswersMatch && correctAnswersMatch[1]) {
            correctAnswers = correctAnswersMatch[1].trim();
          }
        }
        
        const updatedQuizData = {
          unitTitle: problemData.display_name || '',
          paragraphText: paragraphText,
          correctAnswers: correctAnswers,
          timeLimit: problemData.metadata?.time_limit || 3,
          published: !problemData.metadata?.visible_to_staff_only
        };
        
        console.log('Final quiz data to be set:', updatedQuizData);
        
        setQuizData(updatedQuizData);
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error('Error fetching problem data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdateSubmit = async () => {
    try {
      const client = getAuthenticatedHttpClient();

      // First update the vertical block's published status
      const verticalUpdateResponse = await client.put(
        `${getConfig().STUDIO_BASE_URL}/xblock/${unitId}`,
        {
          published: quizData.published
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Vertical block update response:', verticalUpdateResponse.data);

      // Get current problem data to preserve XML structure
      const currentProblemResponse = await client.get(
        `${getConfig().STUDIO_BASE_URL}/xblock/${problemBlockId}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (currentProblemResponse.status !== 200) {
        throw new Error('Failed to get current problem data');
      }

      const currentContent = currentProblemResponse.data.data;
      console.log('Current problem content:', currentContent);

      // Extract the HTML file name from the current content
      console.log('Attempting to extract HTML file name from content...');
      const htmlFileNameMatch = currentContent.match(/html_file="\/asset-v1:[^"]+\/([^"]+)"/);
      console.log('HTML file name match result:', htmlFileNameMatch);
      
      if (!htmlFileNameMatch) {
        console.error('Content structure:', {
          hasHtmlFile: currentContent.includes('html_file'),
          contentLength: currentContent.length,
          contentPreview: currentContent.substring(0, 500) + '...',
          jsinputTag: currentContent.match(/<jsinput[^>]*>/),
        });
        throw new Error('Could not find HTML file name in content');
      }
      
      const htmlFileName = htmlFileNameMatch[1];
      console.log('Found HTML file name:', htmlFileName);

      // Extract course ID from the block ID
      const courseIdMatch = unitId.match(/block-v1:([^+]+)\+([^+]+)\+([^+]+)/);
      if (!courseIdMatch) {
        throw new Error('Could not extract course ID from block ID');
      }
      // Use the full course ID format: "course-v1:org+course+run"
      const actualCourseId = `course-v1:${courseIdMatch[1]}+${courseIdMatch[2]}+${courseIdMatch[3]}`;
      console.log('Extracted and formatted course ID:', actualCourseId);

      // Delete the old HTML file
      try {
        const deleteResponse = await dispatch(deleteAssetFile(actualCourseId, htmlFileName));
        if (deleteResponse?.error) {
          console.error('Server error deleting old HTML file:', deleteResponse.error);
          throw new Error(`Failed to delete old HTML file: ${deleteResponse.error.message || 'Unknown error'}`);
        }
        console.log('Successfully deleted old HTML file');
      } catch (error) {
        console.error('Error deleting old HTML file:', error);
        console.error('Delete error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          courseId: actualCourseId,
          fileName: htmlFileName,
          url: error.response?.config?.url
        });
        throw new Error(`Failed to delete old HTML file: ${error.message}`);
      }

      // Generate new HTML content
      console.log('Generating new HTML content with paragraph text:', quizData.paragraphText);
      const htmlContent = getQuizTemplate(quizData.paragraphText);
      console.log('Generated HTML content:', htmlContent);

      // Create new HTML file
      console.log('Creating new HTML file with name:', htmlFileName);
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const newHtmlFile = new File([htmlBlob], htmlFileName, { type: 'text/html' });
      console.log('Created new HTML file:', {
        name: newHtmlFile.name,
        size: newHtmlFile.size,
        type: newHtmlFile.type,
        lastModified: new Date(newHtmlFile.lastModified).toISOString()
      });

      // Upload new HTML file
      console.log('Starting upload of new HTML file...');
      try {
        const uploadResponse = await dispatch(addAssetFile(actualCourseId, newHtmlFile, true));
        if (uploadResponse?.error) {
          console.error('Server error uploading new HTML file:', uploadResponse.error);
          throw new Error(`Failed to upload new HTML file: ${uploadResponse.error.message || 'Unknown error'}`);
        }
        console.log('Successfully uploaded new HTML file');
      } catch (error) {
        console.error('Error uploading new HTML file:', error);
        console.error('Upload error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          courseId: actualCourseId,
          fileName: htmlFileName,
          fileSize: newHtmlFile.size,
          url: error.response?.config?.url
        });
        throw new Error(`Failed to upload new HTML file: ${error.message}`);
      }

      // Update only the paragraph text and correct answers in the XML
      let updatedContent = currentContent
        .replace(
          /<!-- paragraph_text: .*? -->/,
          `<!-- paragraph_text: ${quizData.paragraphText} -->`
        )
        .replace(/<hidden name="correct_answers">([^<]*)<\/hidden>/s, `<hidden name="correct_answers">${quizData.correctAnswers}</hidden>`);

      console.log('Updated problem content:', updatedContent);

      // Update the problem block using the stored ID
      const problemUpdateResponse = await client.put(
        `${getConfig().STUDIO_BASE_URL}/xblock/${problemBlockId}`,
        {
          metadata: {
            display_name: quizData.unitTitle,
            visible_to_staff_only: !quizData.published
          },
          data: updatedContent
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Problem update response:', problemUpdateResponse.data);

      if (problemUpdateResponse.status === 200) {
        // Verify the published status was updated correctly
        const verifyResponse = await client.get(
          `${getConfig().STUDIO_BASE_URL}/xblock/${unitId}`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        console.log('Verification response:', verifyResponse.data);
        console.log('Published status:', verifyResponse.data.published);
        console.log('Expected published status:', quizData.published);

        if (onUpdate) {
          onUpdate();
        }
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        iconBefore={Edit}
        onClick={handleUpdateQuiz}
        size="sm"
      >
        {intl.formatMessage(quizMessages.updateButton)}
      </Button>

      <UpdateQuizModal
        isOpen={showUpdateModal}
        onClose={handleCloseModal}
        onSubmit={handleUpdateSubmit}
        quizData={quizData}
        setQuizData={setQuizData}
        intl={intl}
      />
    </>
  );
};

UpdateQuizButton.propTypes = {
  problemId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
  intl: intlShape.isRequired,
};

UpdateQuizButton.defaultProps = {
  onUpdate: null,
};

export default injectIntl(UpdateQuizButton); 
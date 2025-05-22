import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, ModalDialog, Form, ActionRow } from '@openedx/paragon';
import { Quiz } from '@openedx/paragon/icons';
import quizMessages from '../quiz-messages';
import { getQuizTemplate } from './templates/templateUtils';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useDispatch } from 'react-redux';
import { addAssetFile } from '../data/thunks';

// QuizModal Component
const QuizModal = ({ isOpen, onClose, onSubmit, quizData, setQuizData, intl }) => {
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
      title={intl.formatMessage(quizMessages.generateQuizTitle)}
      hasCloseButton
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {intl.formatMessage(quizMessages.generateQuizTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Problem Type ID</Form.Label>
            <Form.Control
              type="number"
              value={quizData.problemTypeId}
              onChange={(e) => {
                setQuizData(prev => ({
                  ...prev,
                  problemTypeId: parseInt(e.target.value, 10)
                }));
              }}
              placeholder="Enter problem type ID (e.g., 10 for Fill in the Blank)"
            />
            <Form.Text>
              Available types:
              <ul>
                <li>10 - Fill in the Blank Quiz</li>
                {/* Add more problem types here */}
              </ul>
            </Form.Text>
          </Form.Group>
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
            {intl.formatMessage(quizMessages.generateButton)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

QuizModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  quizData: PropTypes.shape({
    problemTypeId: PropTypes.number.isRequired,
    unitTitle: PropTypes.string.isRequired,
    paragraphText: PropTypes.string.isRequired,
    correctAnswers: PropTypes.string.isRequired,
  }).isRequired,
  setQuizData: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

// Export the createQuiz function
export const createQuiz = async ({ courseId, subsectionId, quizData, onFileCreated, onCreateUnit }) => {
  try {
    console.log('createQuiz called with:', {
      courseId,
      subsectionId,
      quizData,
      hasOnFileCreated: !!onFileCreated,
      hasOnCreateUnit: !!onCreateUnit
    });

    const client = getAuthenticatedHttpClient();
    let htmlContent;
    
    // Select template based on problem type ID
    const problemTypeId = quizData?.problemTypeId || 10; // Default to 10 if not provided
    console.log('Selecting template for problemTypeId:', problemTypeId);
    
    switch (problemTypeId) {
      case 10: // Fill in the Blank
        htmlContent = getQuizTemplate(quizData.paragraphText);
        break;
      // Add more cases for other problem types
      default:
        console.error('Invalid problemTypeId:', problemTypeId);
        throw new Error(`Unsupported problem type ID: ${problemTypeId}`);
    }

    const htmlFileName = `quiz_${Date.now()}.html`;
    console.log('Generated HTML content:', htmlContent);
    
    // Create HTML file
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlFile = new File([htmlBlob], htmlFileName, { type: 'text/html' });

    // Create problem content with XML structure
    const problemContent = `<problem>
  <script type="loncapa/python">
import json
def check_fun(e, ans):
    try:
        response = json.loads(ans)
        state_data = json.loads(response.get("state", "{}"))
        answer_data = json.loads(response["answer"]) 
        answer = answer_data["edxResult"]
        edx_grade = answer_data["edxScore"]
        edx_message = answer_data["edxMessage"]
        state_data['showAnswer'] = True
        return {
            'input_list': [
                { 'ok': answer, 'msg': edx_message, 'grade_decimal': edx_grade}
            ],
            'state': json.dumps(state_data)
        }
    except Exception as err:
        return {'input_list': [{'ok': False, 'msg': f"Error: {str(err)}", 'grade_decimal': 0}]}
  </script>
  <p>${quizData.unitTitle}</p>
  <customresponse cfn="check_fun" rerandomize="never" show_answer_after_attempts="1" max_attempts="unlimited">
    <jsinput 
      gradefn="getGrade" 
      get_statefn="getState" 
      set_statefn="setState" 
      initial_state='{"showAnswer": false}' 
      width="100%" 
      height="460px" 
      html_file="/static/${htmlFileName}" 
      sop="false" 
      id="paragraph_quiz_input" 
      title="${quizData.unitTitle}"
    />
  </customresponse>
  <solution>
    <div class="detailed-solution">
      <p>The correct answers are:</p>
      <ul>
        <!-- Add solution items here -->
      </ul>
    </div>
  </solution>
</problem>`;

    console.log('Generated problem content:', problemContent);

    // Create problem file
    const problemBlob = new Blob([problemContent], { type: 'text/xml' });
    const problemFile = new File([problemBlob], htmlFileName.replace('.html', '.xml'), { type: 'text/xml' });
    console.log('Created problem file object:', {
      name: problemFile.name,
      size: problemFile.size,
      type: problemFile.type
    });

    // Create metadata
    const metadata = {
      display_name: quizData.unitTitle,
      xblock_type: 'problem',
      data: problemContent,
      has_score: true,
      graded: true,
      format: 'Quiz',
    };
    console.log('Created metadata:', metadata);

    // Upload files using the provided onFileCreated function
    if (onFileCreated) {
      try {
        console.log('Starting file upload with files:', {
          htmlFile: { name: htmlFile.name, size: htmlFile.size, type: htmlFile.type },
          problemFile: { name: problemFile.name, size: problemFile.size, type: problemFile.type }
        });
        
        const uploadResult = await onFileCreated([htmlFile, problemFile]);
        console.log('File upload result:', uploadResult);
        
        if (!uploadResult) {
          console.error('Upload result was false or undefined');
          throw new Error('Failed to upload quiz files');
        }
        console.log('Files uploaded successfully');
      } catch (error) {
        console.error('Error uploading files:', error);
        throw new Error(`Failed to upload quiz files: ${error.message}`);
      }
    } else {
      console.warn('No onFileCreated function provided');
    }

    // Create new unit with the problem
    if (onCreateUnit) {
      try {
        console.log('Creating unit with data:', {
          title: quizData.unitTitle,
          type: 'problem',
          metadata,
          files: [htmlFileName, htmlFileName.replace('.html', '.xml')]
        });

        // First create the unit using the parent component's function
        const unitId = await onCreateUnit(quizData.unitTitle);
        if (!unitId) {
          throw new Error('Failed to create unit');
        }

        // Create problem under the unit
        const problemResponse = await client.post(
          `${getConfig().STUDIO_BASE_URL}/xblock/`,
          {
            metadata: {
              display_name: quizData.unitTitle
            },
            data: problemContent,
            category: 'problem',
            parent_locator: unitId
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (problemResponse.status !== 200) {
          throw new Error('Failed to create problem');
        }

        const problemId = problemResponse.data.locator;
        console.log('Created problem with ID:', problemId);

        // Update problem metadata
        const updateResponse = await client.put(
          `${getConfig().STUDIO_BASE_URL}/xblock/${problemId}`,
          {
            metadata: {
              display_name: quizData.unitTitle,
            },
            data: problemContent
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (updateResponse.status !== 200) {
          console.warn('Failed to update problem metadata:', updateResponse.data);
        } else {
          console.log('Successfully updated problem metadata');
        }

        return { blockId: problemId };
      } catch (error) {
        console.error('Error creating unit:', error);
        throw error;
      }
    } else {
      console.warn('No onCreateUnit function provided');
    }

    return true;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// CreateQuizButton Component
const CreateQuizButton = ({ onFileCreated, className, courseId, intl, onCreateUnit }) => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState({
    problemTypeId: 10, // Default to Fill in the Blank
    unitTitle: '',
    paragraphText: '',
    correctAnswers: '{}'
  });

  const dispatch = useDispatch();

  const handleGenerateQuiz = () => {
    setShowQuizModal(true);
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setQuizData({ problemTypeId: 10, unitTitle: '', paragraphText: '', correctAnswers: '{}' });
  };

  const handleQuizSubmit = async () => {
    try {
      // Extract course ID from section ID
      const courseIdMatch = courseId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
      if (!courseIdMatch) {
        throw new Error('Invalid course ID format');
      }
      const formattedCourseId = `course-v1:${courseIdMatch[1]}`;

      // Create quiz using the current quizData state
      await createQuiz({
        courseId: formattedCourseId,
        subsectionId: courseId, // Pass the subsection ID
        quizData: {
          unitTitle: quizData.unitTitle,
          paragraphText: quizData.paragraphText,
          problemTypeId: quizData.problemTypeId,
          correctAnswers: quizData.correctAnswers
        },
        onFileCreated: async (files) => {
          try {
            console.log('Starting file uploads for files:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
            
            // Upload both files and wait for the results
            const uploadPromises = files.map(async (file) => {
              console.log(`Uploading file: ${file.name}`);
              try {
                // Use the addAssetFile thunk for file upload
                await dispatch(addAssetFile(formattedCourseId, file, false));
                
                // Wait for the Redux store to be updated
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Return success since the thunk doesn't return a value
                return { success: true, filename: file.name };
              } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw error;
              }
            });
            
            const results = await Promise.all(uploadPromises);
            console.log('All upload results:', results);
            
            // Check if any upload failed
            const failedUploads = results.filter(result => !result.success);
            if (failedUploads.length > 0) {
              console.error('Failed uploads:', failedUploads);
              throw new Error(`Failed to upload ${failedUploads.length} files`);
            }
            
            return true; // Return true to indicate successful upload
          } catch (error) {
            console.error('Error in file upload:', error);
            // Log additional error details if available
            if (error.response) {
              console.error('Error response:', error.response.data);
            }
            throw error;
          }
        },
        onCreateUnit: async (title) => {
          try {
            // Call the parent component's onCreateUnit function with just the title
            const unitId = await onCreateUnit(title);
            if (!unitId) {
              throw new Error('Failed to create unit');
            }
            return unitId;
          } catch (error) {
            console.error('Error in onCreateUnit:', error);
            throw error;
          }
        }
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleQuizSubmit:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <Button
        variant="primary"
        iconBefore={Quiz}
        onClick={handleGenerateQuiz}
        className={className}
      >
        {intl.formatMessage(quizMessages.generateButton)}
      </Button>

      <QuizModal
        isOpen={showQuizModal}
        onClose={handleCloseModal}
        onSubmit={handleQuizSubmit}
        quizData={quizData}
        setQuizData={setQuizData}
        intl={intl}
      />
    </>
  );
};

CreateQuizButton.propTypes = {
  onFileCreated: PropTypes.func.isRequired,
  onCreateUnit: PropTypes.func,
  className: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

CreateQuizButton.defaultProps = {
  className: '',
  onCreateUnit: null,
};

export default injectIntl(CreateQuizButton); 
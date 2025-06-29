import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, ModalDialog, Form, ActionRow } from '@openedx/paragon';
import { Quiz } from '@openedx/paragon/icons';
import quizMessages from '../quiz-messages';
import { 
  getQuizTemplate, 
  getDragDropQuizTemplate, 
  getListenFillInBlankTemplate,
  TEMPLATE_IDS 
} from './templates/templateUtils';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useDispatch } from 'react-redux';
import { addAssetFile } from '../data/thunks';
import { highlightFillStyleTemplate } from './templates/template_41_highlight_japanese';
import { getListenSingleChoiceTemplate } from './templates/template_39_listen_single_choice';
import { dragDropQuizTemplate } from './templates/template_20_drag_drop';
import { getListenImageSelectMultipleAnswerTemplate } from './templates/template_63_listen_image_select_multiple_answer';
import FORM_COMPONENTS, { getFormComponent } from './forms';

// QuizModal Component
const QuizModal = ({ isOpen, onClose, onSubmit, quizData, setQuizData, intl, courseId, dispatch }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // Get the appropriate form component for the selected problem type
  const FormComponent = getFormComponent(quizData.problemTypeId);

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
            <Form.Label>Problem Type</Form.Label>
            <Form.Control
              as="select"
              value={quizData.problemTypeId}
              onChange={(e) => {
                const newTypeId = parseInt(e.target.value, 10);
                setQuizData(prev => {
                  // Get the appropriate instructions for this problem type
                  const instructions = newTypeId === TEMPLATE_IDS.HIGHLIGHT_JAPANESE 
                    ? '正(ただ)しくない言葉(ことば)をえらんでください' 
                    : newTypeId === TEMPLATE_IDS.LISTEN_SINGLE_CHOICE
                    ? '音声を聞いて、正しい答えを選んでください。'
                    : newTypeId === TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER
                    ? '音声を聞いて、絵を見て、正しい答えを選んでください。'
                    : '聞いて間違った単語を選んでください。間違った単語を選ぶには、その単語をクリックしてください';
                  
                  return {
                    ...prev,
                    problemTypeId: newTypeId,
                    instructions: instructions
                  };
                });
              }}
            >
              <option value={TEMPLATE_IDS.FILL_IN_BLANK}>{TEMPLATE_IDS.FILL_IN_BLANK} - Fill in the Blank Quiz</option>
              <option value={TEMPLATE_IDS.DRAG_DROP}>{TEMPLATE_IDS.DRAG_DROP} - Drag and Drop Quiz</option>
              <option value={TEMPLATE_IDS.LISTEN_SINGLE_CHOICE}>{TEMPLATE_IDS.LISTEN_SINGLE_CHOICE} - Listen and Choose Quiz</option>
              <option value={TEMPLATE_IDS.HIGHLIGHT_JAPANESE}>{TEMPLATE_IDS.HIGHLIGHT_JAPANESE} - Nghe và highlight Từ Sai N5</option>
              <option value={TEMPLATE_IDS.LISTEN_FILL_BLANK}>{TEMPLATE_IDS.LISTEN_FILL_BLANK} - Listen and Fill in the Blank Quiz</option>
              <option value={TEMPLATE_IDS.HIGHLIGHT_WORD}>{TEMPLATE_IDS.HIGHLIGHT_WORD} - Highlight Word Quiz</option>
              <option value={TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER}>{TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER} - Listen and Image Select Multiple Answer</option>
            </Form.Control>
            <Form.Text>
              Select the type of quiz you want to create.
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
              placeholder="Enter time limit in minutes"
              min="0"
            />
            <Form.Text>
              Set the time limit for completing this quiz. Default is 3 minutes.
            </Form.Text>
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
            <Form.Text>
              If checked, learners will be able to see and attempt this problem. If unchecked, the problem will be hidden from learners.
            </Form.Text>
          </Form.Group>
          
          {/* Common fields for audio and image uploads */}
          <Form.Group>
            <Form.Label>Audio File</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                value={quizData.audioFile}
                onChange={(e) => {
                  setQuizData(prev => ({
                    ...prev,
                    audioFile: e.target.value
                  }));
                }}
                placeholder="Enter the URL of the audio file (e.g., /asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/audio.mp3)"
                className="mr-2"
              />
              <input
                type="file"
                id="audioFileUpload"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    try {
                      // Use the same file upload function that's used for the quiz HTML
                      const courseIdMatch = courseId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
                      if (!courseIdMatch) {
                        throw new Error('Invalid course ID format');
                      }
                      const formattedCourseId = `course-v1:${courseIdMatch[1]}`;
                      
                      // Upload the file
                      await dispatch(addAssetFile(formattedCourseId, file, false));
                      
                      // Generate proper asset URL in Open edX format
                      const courseComponents = formattedCourseId.replace('course-v1:', '').split('+');
                      const assetUrl = `/asset-v1:${courseComponents[0]}+${courseComponents[1]}+${courseComponents[2]}+type@asset+block/${file.name}`;
                      
                      // Set the URL in the form
                      setQuizData(prev => ({
                        ...prev,
                        audioFile: assetUrl
                      }));
                      
                      // Show success message
                      alert(`Audio file ${file.name} uploaded successfully!`);
                    } catch (error) {
                      console.error('Error uploading audio file:', error);
                      alert(`Error uploading audio file: ${error.message}`);
                    }
                  }
                }}
              />
              <Button
                variant="outline-primary"
                onClick={() => document.getElementById('audioFileUpload').click()}
              >
                Upload
              </Button>
            </div>
            <Form.Text>
              URL to the audio file. You can enter the URL manually or upload a new audio file.
              <br />
              Format: <code>/asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/filename.mp3</code>
            </Form.Text>
            {quizData.audioFile && (
              <div className="mt-3">
                <audio controls style={{ width: '100%', maxWidth: '300px' }}>
                  <source src={quizData.audioFile} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </Form.Group>
          <Form.Row>
            <Form.Group className="col-md-6">
              <Form.Label>Start Time (seconds)</Form.Label>
              <Form.Control
                type="number"
                value={quizData.startTime}
                onChange={(e) => {
                  setQuizData(prev => ({
                    ...prev,
                    startTime: parseFloat(e.target.value) || 0
                  }));
                }}
                placeholder="Enter start time in seconds"
                min="0"
                step="0.1"
              />
              <Form.Text>
                Time in seconds where the script starts in the audio.
              </Form.Text>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>End Time (seconds)</Form.Label>
              <Form.Control
                type="number"
                value={quizData.endTime}
                onChange={(e) => {
                  setQuizData(prev => ({
                    ...prev,
                    endTime: parseFloat(e.target.value) || 0
                  }));
                }}
                placeholder="Enter end time in seconds"
                min="0"
                step="0.1"
              />
              <Form.Text>
                Time in seconds where the script ends in the audio. Set to 0 to play until the end.
              </Form.Text>
            </Form.Group>
          </Form.Row>
          <Form.Group>
            <Form.Label>Image File</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                value={quizData.imageFile}
                onChange={(e) => {
                  setQuizData(prev => ({
                    ...prev,
                    imageFile: e.target.value
                  }));
                }}
                placeholder="Enter the URL of the image file (e.g., /asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/image.jpg)"
                className="mr-2"
              />
              <input
                type="file"
                id="imageFileUpload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    try {
                      const courseIdMatch = courseId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
                      if (!courseIdMatch) {
                        throw new Error('Invalid course ID format');
                      }
                      const formattedCourseId = `course-v1:${courseIdMatch[1]}`;
                      
                      // Ensure filename is URL-safe
                      const safeFileName = encodeURIComponent(file.name).replace(/%20/g, '_');
                      
                      // Upload the file
                      await dispatch(addAssetFile(formattedCourseId, file, false));
                      
                      // Generate proper asset URL in Open edX format
                      const courseComponents = formattedCourseId.replace('course-v1:', '').split('+');
                      const assetUrl = `/asset-v1:${courseComponents[0]}+${courseComponents[1]}+${courseComponents[2]}+type@asset+block/${safeFileName}`;
                      
                      // Set the URL in the form
                      setQuizData(prev => ({
                        ...prev,
                        imageFile: assetUrl
                      }));
                      
                      // Show success message
                      alert(`Image file ${file.name} uploaded successfully!`);
                    } catch (error) {
                      console.error('Error uploading image file:', error);
                      alert(`Error uploading image file: ${error.message}`);
                    }
                  }
                }}
              />
              <Button
                variant="outline-primary"
                onClick={() => document.getElementById('imageFileUpload').click()}
              >
                Upload
              </Button>
            </div>
            <Form.Text>
              URL to the image file. You can enter the URL manually or upload a new image file.
              <br />
              Format: <code>/asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/filename.jpg</code>
              <br />
              Note: File names should be in English and avoid special characters for best compatibility.
            </Form.Text>
            {quizData.imageFile && (
              <div className="mt-3">
                <img 
                  src={quizData.imageFile}
                  alt="Preview" 
                  style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain' }} 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </Form.Group>
          
          {/* Render the appropriate form component based on problem type */}
          {FormComponent && (
            <div className="mt-4 pt-3 border-top">
              <h4>Problem-Specific Fields</h4>
              <FormComponent quizData={quizData} setQuizData={setQuizData} />
            </div>
          )}
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
    timeLimit: PropTypes.number.isRequired,
    published: PropTypes.bool.isRequired,
  }).isRequired,
  setQuizData: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
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
    const problemTypeId = quizData?.problemTypeId || TEMPLATE_IDS.FILL_IN_BLANK; // Default to 10 if not provided
    console.log('Selecting template for problemTypeId:', problemTypeId);
    
    switch (problemTypeId) {
      case TEMPLATE_IDS.FILL_IN_BLANK: // Fill in the Blank
        htmlContent = getQuizTemplate(quizData.paragraphText);
        break;
      case TEMPLATE_IDS.DRAG_DROP: // Drag and Drop
        const words = quizData.wordBank.split(',').map(word => word.trim());
        htmlContent = getDragDropQuizTemplate(quizData.paragraphText, words);
        break;
      case TEMPLATE_IDS.LISTEN_FILL_BLANK: // Listen and Fill in the Blank
        // Parse the options for each blank
        const blankOptionsList = quizData.blankOptions.split(';').map(options => 
          options.split(',').map(opt => opt.trim())
        );
        
        htmlContent = getListenFillInBlankTemplate(
          quizData.paragraphText,
          quizData.audioFile || '',
          quizData.startTime || 0,
          quizData.endTime || 0,
          quizData.instructions || 'Listen to the audio and select the correct answer for each blank.',
          blankOptionsList,
          quizData.scriptText || '',
          quizData.imageFile || ''
        );
        break;
      case TEMPLATE_IDS.HIGHLIGHT_JAPANESE: // Highlight Word Quiz (Japanese)
      case TEMPLATE_IDS.HIGHLIGHT_WORD: // Highlight Word Quiz
        const correctWords = quizData.fixedWordsExplanation.split(',')
          .map(pair => {
            // Extract the wrong word from each pair
            if (pair.includes('=')) {
              // For both simple and indexed formats
              if (pair.includes(':')) {
                // Indexed format: "word:index=fixed"
                return pair.split('=')[0].split(':')[0].trim();
              } else {
                // Simple format: "word=fixed"
                return pair.split('=')[0].trim();
              }
            }
            return '';
          })
          .filter(word => word !== ''); // Remove empty strings
        
        console.log('Extracted correctWords:', correctWords);
        console.log('Original fixedWordsExplanation:', quizData.fixedWordsExplanation);
        
        // Set default instructions based on problem type
        let defaultInstructions = quizData.problemTypeId === TEMPLATE_IDS.HIGHLIGHT_JAPANESE 
          ? '正(ただ)しくない言葉(ことば)をえらんでください' 
          : '聞いて間違った単語を選んでください。間違った単語を選ぶには、その単語をクリックしてください';
        
        // Make sure fixedWordsExplanation is not empty
        const fixedWordsExplanation = quizData.fixedWordsExplanation || 'These are the words that should be selected.';
        console.log('Final fixedWordsExplanation:', fixedWordsExplanation);
        
        htmlContent = highlightFillStyleTemplate
          .replace('{{PARAGRAPH}}', quizData.paragraphText.replace(/'/g, "\\'").replace(/\n/g, ' '))
          .replace('{{CORRECT_WORDS}}', JSON.stringify(correctWords))
          .replace('{{FIXED_WORDS_EXPLANATION}}', fixedWordsExplanation)
          .replace('{{INSTRUCTIONS}}', quizData.instructions || defaultInstructions)
          .replace('{{AUDIO_FILE}}', quizData.audioFile || '')
          .replace('{{START_TIME}}', quizData.startTime || 0)
          .replace('{{END_TIME}}', quizData.endTime || 0);
        break;
      case TEMPLATE_IDS.LISTEN_SINGLE_CHOICE: // Listen and Choose Quiz
        htmlContent = getListenSingleChoiceTemplate(
          quizData.paragraphText,
          quizData.blankOptions,
          quizData.audioFile || '',
          quizData.startTime || 0,
          quizData.endTime || 0,
          quizData.instructions || '音声を聞いて、正しい答えを選んでください。',
          quizData.scriptText || '',
          quizData.imageFile || ''
        );
        break;
      case TEMPLATE_IDS.LISTEN_IMAGE_SELECT_MULTIPLE_ANSWER: // Listen and Image Select Multiple Answer
        // Just pass the question text directly, no need to combine with blanks
        htmlContent = getListenImageSelectMultipleAnswerTemplate(
          quizData.paragraphText,
          quizData.blankOptions || '', // Use blankOptions as correctAnswers
          quizData.audioFile || '',
          quizData.startTime || 0,
          quizData.endTime || 0,
          quizData.instructions || '音声を聞いて、絵を見て、正しい答えを選んでください。',
          quizData.scriptText || '',
          quizData.imageFile || '',
          quizData.answerContent || '',
          quizData.blankOptions || ''  // Pass the blank options as the last parameter
        );
        break;
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
  <!-- paragraph_text: ${quizData.paragraphText} -->
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

    // Upload HTML file using the provided onFileCreated function
    if (onFileCreated) {
      try {
        console.log('Starting file upload with HTML file:', {
          htmlFile: { name: htmlFile.name, size: htmlFile.size, type: htmlFile.type }
        });
        
        const uploadResult = await onFileCreated([htmlFile]);
        console.log('File upload result:', uploadResult);
        
        if (!uploadResult) {
          console.error('Upload result was false or undefined');
          throw new Error('Failed to upload quiz file');
        }
        console.log('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error(`Failed to upload quiz file: ${error.message}`);
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
          files: [htmlFileName]
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
              display_name: quizData.unitTitle,
              visible_to_staff_only: !quizData.published
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
              visible_to_staff_only: !quizData.published,
              time_limit: quizData.timeLimit
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

        // Publish the problem if requested
        if (quizData.published) {
          try {
            // Extract course ID from the problem ID
            let formattedCourseId;
            if (problemId.startsWith('block-v1:')) {
              const courseIdMatch = problemId.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
              if (!courseIdMatch) {
                throw new Error('Invalid problem ID format');
              }
              formattedCourseId = `course-v1:${courseIdMatch[1]}`;
            } else if (problemId.startsWith('course-v1:')) {
              formattedCourseId = problemId;
            } else {
              throw new Error('Invalid problem ID format');
            }

            // Publish the course to make the problem visible
            const publishResponse = await client.post(
              `${getConfig().STUDIO_BASE_URL}/course/${formattedCourseId}/publish`,
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );

            if (publishResponse.status !== 200) {
              console.warn('Failed to publish course:', publishResponse.data);
            } else {
              console.log('Successfully published course');
            }
          } catch (error) {
            console.error('Error publishing course:', error);
          }
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
    problemTypeId: TEMPLATE_IDS.LISTEN_FILL_BLANK, // Default to Listen and Fill in the Blank Quiz
    unitTitle: 'Quick Test Quiz',
    paragraphText: '',
    answerContent: '',
    blankOptions: '',
    scriptText: '',
    correctAnswers: '',
    wordBank: '',
    timeLimit: 3,
    published: true,
    fixedWordsExplanation: '',
    instructions: '',
    audioFile: '/asset-v1:Xuan+N51+2025+type@asset+block/1.mp3',
    imageFile: '/asset-v1:Xuan+N51+2025+type@asset+block/1.png',
    startTime: 0,
    endTime: 0
  });

  const dispatch = useDispatch();

  const handleGenerateQuiz = () => {
    setShowQuizModal(true);
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setQuizData({ 
      problemTypeId: TEMPLATE_IDS.LISTEN_FILL_BLANK,
      unitTitle: 'Quick Test Quiz',
      paragraphText: '',
      answerContent: '',
      blankOptions: '',
      scriptText: '',
      correctAnswers: '',
      wordBank: '',
      timeLimit: 3,
      published: true,
      instructions: '',
      audioFile: '/asset-v1:Xuan+N51+2025+type@asset+block/1.mp3',
      imageFile: '/asset-v1:Xuan+N51+2025+type@asset+block/1.png',
      startTime: 0,
      endTime: 0
    });
  };

  const handleQuizSubmit = async () => {
    try {
      // Validate required fields based on problem type
      if (quizData.problemTypeId === TEMPLATE_IDS.HIGHLIGHT_JAPANESE || quizData.problemTypeId === TEMPLATE_IDS.HIGHLIGHT_WORD) {
        // For highlight quizzes, ensure fixedWordsExplanation is not empty
        if (!quizData.fixedWordsExplanation || quizData.fixedWordsExplanation.trim() === '') {
          alert('Fixed Words Explanation is required for highlight quizzes. Please enter at least one word pair.');
          return;
        }
      }
      
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
          correctAnswers: quizData.correctAnswers,
          timeLimit: quizData.timeLimit,
          published: quizData.published,
          wordBank: quizData.wordBank,
          fixedWordsExplanation: quizData.fixedWordsExplanation,
          instructions: quizData.instructions,
          audioFile: quizData.audioFile,
          startTime: quizData.startTime,
          endTime: quizData.endTime,
          blankOptions: quizData.blankOptions,
          scriptText: quizData.scriptText,
          imageFile: quizData.imageFile,
          answerContent: quizData.answerContent
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
        courseId={courseId}
        dispatch={dispatch}
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
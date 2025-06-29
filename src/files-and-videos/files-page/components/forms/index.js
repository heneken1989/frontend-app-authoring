import ListenSingleChoiceForm from './39';
import ListenMultipleChoiceForm from './41';
import ListenFillBlankForm from './42';
import ListenImageSelectMultipleAnswerForm from './63';
import DragDropForm from './20';
import HighlightJapaneseForm from './41_highlight';
import DefaultForm from './default';

// Map template IDs to their respective form components
const FORM_COMPONENTS = {
  20: DragDropForm,
  39: ListenSingleChoiceForm,
  41: ListenMultipleChoiceForm,
  42: ListenFillBlankForm,
  44: HighlightJapaneseForm,
  63: ListenImageSelectMultipleAnswerForm,
};

// Function to get the appropriate form component for a given template ID
export const getFormComponent = (templateId) => {
  return FORM_COMPONENTS[templateId] || DefaultForm;
};

export default FORM_COMPONENTS; 
import FillInBlankForm from './10';
import DragDropOldForm from './20';
import ListenSingleChoiceForm from './39';
import ListenSingleChoiceNoImageForm from './40';
import SingleChoiceForm from './41';
import ListenFillBlankForm from './42';
import ListenWithImageMultipleDifferentBlankOptionsForm from './46';
import ListenImageSelectMultipleAnswerForm from './63';
import ListenImageSelectMultipleAnswerMultioptionsForm from './65';
import ListenWriteAnswerWithImageForm from './67';
import HighlightJapaneseForm from './41_highlight';
import GrammarDropdownForm from './18';
import DefaultForm from './default';

// Map template IDs to their respective form components
export const FORM_COMPONENTS = {
  10: FillInBlankForm,                           // Fill in the Blank Quiz
  18: GrammarDropdownForm,                       // Grammar Dropdown Quiz
  20: DragDropOldForm,                           // Drag and Drop Quiz (Classic)
  39: ListenSingleChoiceForm,                    // Listen and Choose Quiz
  40: ListenSingleChoiceNoImageForm,             // Listen and Choose Quiz (No Image)
  41: HighlightJapaneseForm,                     // Highlight Word Quiz (Japanese)
  42: ListenFillBlankForm,                       // Listen and Fill in the Blank Quiz
  46: ListenWithImageMultipleDifferentBlankOptionsForm, // Listen with Image Multiple Different Blank Options
  63: ListenImageSelectMultipleAnswerForm,       // Listen and Image Select Multiple Answer
  65: ListenImageSelectMultipleAnswerMultioptionsForm, // Listen and Image Select Multiple Answer (MultiOptions)
  67: ListenWriteAnswerWithImageForm             // Listen Write Answer with Image Quiz
};

// Function to get the appropriate form component for a given template ID
export const getFormComponent = (templateId) => {
  return FORM_COMPONENTS[templateId] || DefaultForm;
};

export default FORM_COMPONENTS; 
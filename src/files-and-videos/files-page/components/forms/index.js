import Form2 from './2';
import Form10 from './10';
import Form18 from './18';
import Form20 from './20';
import Form22 from './22';
import Form28 from './28';
import Form31 from './31';
import Form32 from './32';
import Form33 from './33';
import Form39 from './39';
import Form40 from './40';
import Form41 from './41';
import Form42 from './42';
import Form46 from './46';
import Form51 from './51';
import Form59 from './59';
import Form63 from './63';
import Form65 from './65';
import Form67 from './67';

const FORM_COMPONENTS = {
  2: Form2,    // Vocabulary Matching Quiz
  10: Form10,   // Fill in the Blank Quiz
  18: Form18,   // Grammar Dropdown Quiz
  20: Form20,   // Drag and Drop Quiz
  22: Form22,   // Grammar Sentence Rearrangement Quiz
  28: Form28,   // Grammar Single Select Quiz
  29: Form28,   // Grammar Single Select Quiz (Alternative)
  31: Form31,   // Reading Multiple Question
  32: Form32,   // Reading Same as 31
  33: Form33,   // Reading Select Quiz
  36: Form33,   // Reading Select Quiz 1 (uses same form as 33)
  37: Form31,   // Reading Multiple Question (uses same form as 31)
  38: Form33,   // Reading Select Quiz 2 (uses same form as 33)
  39: Form39,   // Listen and Choose Quiz
  40: Form40,   // Listen and Choose Quiz (No Image)
  41: Form41,   // Highlight Word Quiz (Japanese)
  42: Form42,   // Listen and Fill in the Blank Quiz
  46: Form46,   // Listen with Image Multiple Different Blank Options
  51: Form51,   // Reading Droplist
  59: Form59,   // Reading Droplist No Image
  63: Form63,   // Listen and Image Select Multiple Answer
  65: Form65,   // Listen and Image Select Multiple Answer (MultiOptions)
  67: Form67,   // Listen Write Answer with Image Quiz
};

export const getFormComponent = (problemTypeId) => {
  return FORM_COMPONENTS[problemTypeId];
};

export default FORM_COMPONENTS; 
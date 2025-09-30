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
  3: Form28,   // Vocabulary Single Choice Quiz (uses Form28)
  4: Form28,   // Vocabulary Single Choice Quiz 1 (uses Form28)
  5: Form18, 
  7: Form28,  // Vocabulary Single Choice Quiz 2 (uses Form28)
  6: Form18,
  8: Form28,  // Vocabulary Single Choice Quiz 2 (uses Form28)
  9: Form28,  // Vocabulary Single Choice Quiz 2 (uses Form28)
  10: Form18,  // Vocabulary Single Choice Quiz 2 (uses Form28)
  12: Form20,
  13: Form28,
  14: Form28,
  15: Form28,
  16: Form28,
  17: Form28,
  18: Form18,   // Grammar Dropdown Quiz
  19: Form18,
  20: Form20,   // Drag and Drop Quiz
  21: Form18,
  22: Form20,   // Grammar Sentence Rearrangement Quiz
  23: Form18,
  24: Form18,
  25: Form20,
  26: Form18,
  27: Form22,
  28: Form28,   // Grammar Single Select Quiz
  29: Form28,   // Grammar Single Select Quiz (Alternative)
  30: Form18,   // Reading Multiple Question
  31: Form31,   // Reading Multiple Question
  32: Form32,   // Reading Same as 31ß
  33: Form33,   // Reading Select Quiz
  34: Form31,   // Reading Multiple Question
  36: Form33,   // Reading Select Quiz 1 (uses same form as 33)
  37: Form31,   // Reading Multiple Question (uses same form as 31)
  38: Form33,   // Reading Select Quiz 2 (uses same form as 33)
  39: Form39,   // Listen and Choose Quiz
  40: Form40,   // Listen and Choose Quiz (No Image)
  41: Form41,   // Highlight Word Quiz (Japanese)
  42: Form42,   // Listen and Fill in the Blank Quiz
  43: Form39,   // Listen and Fill in the Blank Quiz (uses same form as 42)
  44: Form40,   // Highlight Word Quiz (Japanese) - uses same form as ID 41
  45: Form41,   // Highlight Word Quiz (Japanese) - uses same form as ID 41
  46: Form46,   // Listen with Image Multiple Different Blank Options
  47: Form39,   // Listen and Choose Quiz (No Image) - uses same form as ID 40
  51: Form51,   // Reading Droplist
  59: Form59,   // Reading Droplist No Image
  62: Form18,
  63: Form63,   // Listen and Image Select Multiple Answer
  64: Form63,   // Listen and Image Select Multiple Answer (uses same form as ID 63)
  65: Form65,   // Listen and Image Select Multiple Answer (MultiOptions)
  67: Form67,   // Listen Write Answer with Image Quiz
};

export const getFormComponent = (problemTypeId) => {
  return FORM_COMPONENTS[problemTypeId];
};

export default FORM_COMPONENTS; 
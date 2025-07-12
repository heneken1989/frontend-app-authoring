import React from 'react';
import GrammarSingleSelectForm from './28';

// This component uses the same form as ID 28 but with different default instructions
const GrammarSingleSelectAltForm = (props) => {
  // If instructions are empty, set the alternative default
  if (!props.quizData.instructions) {
    props.setQuizData(prev => ({
      ...prev,
      instructions: '★＿＿＿に　入る　ものは　どれですか。'  // Different default instruction
    }));
  }
  
  return <GrammarSingleSelectForm {...props} />;
};

export default GrammarSingleSelectAltForm; 
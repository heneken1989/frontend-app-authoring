import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  connectionError: {
    id: 'authoring.alert.error.connection',
    defaultMessage: 'We encountered a technical error when loading this page. This might be a temporary issue, so please try again in a few minutes. If the problem persists, please go to the {supportLink} for help.',
    description: 'Error message shown to users when there is a connectivity issue with the server.',
  },
  supportText: {
    id: 'authoring.alert.support.text',
    defaultMessage: 'Support Page',
  },
  generateQuizTitle: {
    id: 'authoring.filespage.quiz.title',
    defaultMessage: 'Generate Quiz',
    description: 'Title for the quiz generation modal',
  },
  quizParagraphLabel: {
    id: 'authoring.filespage.quiz.paragraph.label',
    defaultMessage: 'Paragraph Text',
    description: 'Label for the paragraph text input',
  },
  quizParagraphPlaceholder: {
    id: 'authoring.filespage.quiz.paragraph.placeholder',
    defaultMessage: 'Enter your quiz text here...',
    description: 'Placeholder for the paragraph text input',
  },
  quizParagraphHelp: {
    id: 'authoring.filespage.quiz.paragraph.help',
    defaultMessage: 'Use {blank} for fill-in-the-blank spaces',
    description: 'Help text for the paragraph input',
  },
  quizAnswersLabel: {
    id: 'authoring.filespage.quiz.answers.label',
    defaultMessage: 'Correct Answers',
    description: 'Label for the correct answers input',
  },
  quizAnswersHelp: {
    id: 'authoring.filespage.quiz.answers.help',
    defaultMessage: 'Enter correct answers in JSON format. Each key should match a blank in the paragraph.',
    description: 'Help text for the answers input',
  },
  cancelButton: {
    id: 'authoring.filespage.quiz.button.cancel',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button',
  },
  generateButton: {
    id: 'authoring.filespage.quiz.button.generate',
    defaultMessage: 'Generate Quiz',
    description: 'Label for the generate button',
  },
});

export default messages;

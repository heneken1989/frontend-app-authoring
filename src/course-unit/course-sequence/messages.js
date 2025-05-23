import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  prevBtnText: {
    id: 'course-authoring.course-unit.prev-btn-text',
    defaultMessage: 'Previous',
  },
  nextBtnText: {
    id: 'course-authoring.course-unit.next-btn-text',
    defaultMessage: 'Next',
  },
  newUnitBtnText: {
    id: 'course-authoring.course-unit.new-unit-btn-text',
    defaultMessage: 'New Unit New',
  },
  newJavaScriptUnitBtnText: {
    id: 'course-authoring.course-unit.new-javascript-unit-btn-text',
    defaultMessage: 'New JavaScript Unit',
  },
  sequenceNavLabelText: {
    id: 'course-authoring.course-unit.sequence-nav-label-text',
    defaultMessage: 'Sequence navigation',
  },
  sequenceLoadFailure: {
    id: 'course-authoring.course-unit.sequence.load.failure',
    defaultMessage: 'There was an error loading this course.',
  },
  sequenceNoContent: {
    id: 'course-authoring.course-unit.sequence.no.content',
    defaultMessage: 'There is no content here.',
  },
  sequenceDropdownTitle: {
    id: 'course-authoring.course-unit.sequence.navigation.menu',
    defaultMessage: '{current} of {total}',
  },
  pasteAsNewUnitLink: {
    id: 'course-authoring.course-unit.sequence.navigation.menu.copy-unit.past-unit-link',
    defaultMessage: 'Paste as new unit',
  },
});

export default messages;

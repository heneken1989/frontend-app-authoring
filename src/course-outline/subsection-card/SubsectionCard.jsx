// @ts-check
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle, Alert } from '@openedx/paragon';
import { Add as IconAdd } from '@openedx/paragon/icons';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { validateAssetFiles, addAssetFile } from '../../files-and-videos/files-page/data/thunks';
import { getQuizTemplate } from '../../files-and-videos/files-page/quiz-template';
import { createQuiz } from '../../files-and-videos/files-page/components/CreateQuizButton';
import UpdateQuizButton from '../../files-and-videos/files-page/components/UpdateQuizButton';

import CourseOutlineSubsectionCardExtraActionsSlot from '../../plugin-slots/CourseOutlineSubsectionCardExtraActionsSlot';
import { setCurrentItem, setCurrentSection, setCurrentSubsection } from '../data/slice';
import { RequestStatus } from '../../data/constants';
import CardHeader from '../card-header/CardHeader';
import SortableItem from '../../generic/drag-helper/SortableItem';
import { DragContext } from '../../generic/drag-helper/DragContextProvider';
import { useClipboard, PasteComponent } from '../../generic/clipboard';
import TitleButton from '../card-header/TitleButton';
import XBlockStatus from '../xblock-status/XBlockStatus';
import { getItemStatus, getItemStatusBorder, scrollToElement } from '../utils';
import messages from './messages';
import CreateQuizButton from '../../files-and-videos/files-page/components/CreateQuizButton';


const SubsectionCard = ({
  section,
  subsection,
  isSelfPaced = false,
  isCustomRelativeDatesActive = false,
  children = null,
  index = 0,
  getPossibleMoves = (...args) => ({}),
  onOpenPublishModal = (...args) => {},
  onEditSubmit = (...args) => {},
  savingStatus = RequestStatus.INACTIVE,
  onOpenDeleteModal = (...args) => {},
  onDuplicateSubmit = (...args) => {},
  onNewUnitSubmit = (...args) => {},
  onOrderChange = (...args) => {},
  onOpenConfigureModal = (...args) => {},
  onPasteClick = (...args) => {},
  onUpdate = (...args) => {},
}) => {
  const currentRef = useRef(null);
  const intl = useIntl();
  const dispatch = useDispatch();
  const { activeId, overId } = useContext(DragContext);
  const [searchParams] = useSearchParams();
  const locatorId = searchParams.get('show');
  const isScrolledToElement = locatorId === subsection.id;
  const [isFormOpen, openForm, closeForm] = useToggle(false);
  const namePrefix = 'subsection';
  const { sharedClipboardData, showPasteUnit } = useClipboard();
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });

  const {
    id,
    category,
    displayName,
    hasChanges,
    published,
    visibilityState,
    actions: subsectionActions,
    isHeaderVisible = true,
    enableCopyPasteUnits = false,
    proctoringExamConfigurationLink,
  } = subsection;

  // re-create actions object for customizations
  const actions = { ...subsectionActions };
  // add actions to control display of move up & down menu button.
  const moveUpDetails = getPossibleMoves(index, -1);
  const moveDownDetails = getPossibleMoves(index, 1);
  actions.allowMoveUp = !isEmpty(moveUpDetails);
  actions.allowMoveDown = !isEmpty(moveDownDetails);

  // Expand the subsection if a search result should be shown/scrolled to
  const containsSearchResult = () => {
    if (locatorId) {
      return !!subsection.childInfo?.children?.filter((child) => child.id === locatorId).length;
    }

    return false;
  };
  const [isExpanded, setIsExpanded] = useState(containsSearchResult() || !isHeaderVisible);
  const subsectionStatus = getItemStatus({
    published,
    visibilityState,
    hasChanges,
  });
  const borderStyle = getItemStatusBorder(subsectionStatus);

  const handleExpandContent = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleClickMenuButton = () => {
    dispatch(setCurrentSection(section));
    dispatch(setCurrentSubsection(subsection));
    dispatch(setCurrentItem(subsection));
  };

  const handleEditSubmit = (titleValue) => {
    if (displayName !== titleValue) {
      onEditSubmit(id, section.id, titleValue);
      return;
    }

    closeForm();
  };

  const handleSubsectionMoveUp = () => {
    onOrderChange(section, moveUpDetails);
  };

  const handleSubsectionMoveDown = () => {
    onOrderChange(section, moveDownDetails);
  };

  const handleNewButtonClick = () => onNewUnitSubmit(id);
  const handlePasteButtonClick = () => onPasteClick(id, section.id);

  const handleAddFile = async (files) => {
    try {
      // Get the course ID from the section ID
      const courseIdMatch = section.id.match(/block-v1:([^+]+\+[^+]+\+[^+]+)/);
      if (!courseIdMatch) {
        throw new Error('Invalid course ID format');
      }
      const courseId = `course-v1:${courseIdMatch[1]}`;  // Add course-v1: prefix

      // Handle regular file uploads
      if (files && files.length > 0) {
        const result = await dispatch(addAssetFile(courseId, files[0], false));
        return result; // Return the upload result
      }

      return false; // Return false if no files to upload
    } catch (error) {
      console.error('Error handling file upload:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  const handleCreateUnit = async (title) => {
    try {
      const client = getAuthenticatedHttpClient();
      
      // Create unit under the subsection
      const unitResponse = await client.post(
        `${getConfig().STUDIO_BASE_URL}/xblock/`,
        {
          parent_locator: subsection.id, // Use subsection ID as parent
          category: 'vertical',
          display_name: title,
          metadata: {
            display_name: title,
            format: 'Quiz'
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (unitResponse.status !== 200) {
        console.error('Failed to create unit:', unitResponse.data);
        throw new Error('Failed to create unit');
      }

      const unitId = unitResponse.data.locator;
      console.log('Created unit with ID:', unitId);
      return unitId;
    } catch (error) {
      console.error('Error creating unit:', error);
      throw error;
    }
  };

  const titleComponent = (
    <TitleButton
      title={displayName}
      isExpanded={isExpanded}
      onTitleClick={handleExpandContent}
      namePrefix={namePrefix}
    />
  );

  const extraActionsComponent = (
    <CourseOutlineSubsectionCardExtraActionsSlot
      subsection={subsection}
      section={section}
    />
  );

  useEffect(() => {
    if (activeId === id && isExpanded) {
      setIsExpanded(false);
    } else if (overId === id && !isExpanded) {
      setIsExpanded(true);
    }
  }, [activeId, overId]);

  useEffect(() => {
    // if this items has been newly added, scroll to it.
    // we need to check section.shouldScroll as whole section is fetched when a
    // subsection is duplicated under it.
    if (currentRef.current && (section.shouldScroll || subsection.shouldScroll || isScrolledToElement)) {
      // Align element closer to the top of the screen if scrolling for search result
      const alignWithTop = !!isScrolledToElement;
      scrollToElement(currentRef.current, alignWithTop);
    }
  }, [isScrolledToElement]);

  useEffect(() => {
    // If the locatorId is set/changed, we need to make sure that the subsection is expanded
    // if it contains the result, in order to scroll to it
    setIsExpanded((prevState) => (containsSearchResult() || prevState));
  }, [locatorId, setIsExpanded]);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      closeForm();
    }
  }, [savingStatus]);

  const isDraggable = (
    actions.draggable
      && (actions.allowMoveUp || actions.allowMoveDown)
      && !(isHeaderVisible === false)
  );

  const renderProblemActions = (problem) => {
    if (!problem || !problem.category) return null;
    
    if (problem.category === 'problem') {
      return (
        <div className="problem-actions">
          <UpdateQuizButton
            problemId={problem.id}
            courseId={section.id}
            onUpdate={() => onUpdate(problem.id)}
          />
        </div>
      );
    }
    return null;
  };

  const renderChildren = () => {
    if (!children) return null;

    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child) || !child.props?.blockData) {
        return child;
      }

      const problem = child.props.blockData;
      return (
        <div key={problem.id} className="problem-container">
          {child}
          {renderProblemActions(problem)}
        </div>
      );
    });
  };

  return (
    <SortableItem
      id={id}
      category={category}
      key={id}
      isDraggable={isDraggable}
      isDroppable={actions.childAddable}
      componentStyle={{
        background: '#f8f7f6',
        ...borderStyle,
      }}
    >
      <div
        className={`subsection-card ${isScrolledToElement ? 'highlight' : ''}`}
        data-testid="subsection-card"
        ref={currentRef}
      >
        {isHeaderVisible && (
          <>
            <CardHeader
              title={displayName}
              status={subsectionStatus}
              cardId={id}
              hasChanges={hasChanges}
              onClickMenuButton={handleClickMenuButton}
              onClickPublish={onOpenPublishModal}
              onClickEdit={openForm}
              onClickDelete={onOpenDeleteModal}
              onClickMoveUp={handleSubsectionMoveUp}
              onClickMoveDown={handleSubsectionMoveDown}
              onClickConfigure={onOpenConfigureModal}
              isFormOpen={isFormOpen}
              closeForm={closeForm}
              onEditSubmit={handleEditSubmit}
              isDisabledEditField={savingStatus === RequestStatus.IN_PROGRESS}
              onClickDuplicate={onDuplicateSubmit}
              titleComponent={titleComponent}
              namePrefix={namePrefix}
              actions={actions}
              proctoringExamConfigurationLink={proctoringExamConfigurationLink}
              isSequential
              extraActionsComponent={extraActionsComponent}
            />
            <div className="subsection-card__content item-children" data-testid="subsection-card__content">
              <XBlockStatus
                isSelfPaced={isSelfPaced}
                isCustomRelativeDatesActive={isCustomRelativeDatesActive}
                blockData={subsection}
              />
            </div>
          </>
        )}
        {isExpanded && (
          <div
            data-testid="subsection-card__units"
            className={classNames('subsection-card__units', { 'item-children': isDraggable })}
          >
            {renderChildren()}
            {actions.childAddable && (
              <>
                <Button
                  data-testid="new-unit-button"
                  className="mt-4"
                  variant="outline-primary"
                  iconBefore={IconAdd}
                  block
                  onClick={handleNewButtonClick}
                >
                  {intl.formatMessage(messages.newUnitButton)}
                </Button>
                <CreateQuizButton
                  onFileCreated={handleAddFile}
                  className="mt-2"
                  courseId={section.id}
                  onCreateUnit={handleCreateUnit}
                />
                {enableCopyPasteUnits && showPasteUnit && sharedClipboardData && (
                  <PasteComponent
                    className="mt-4"
                    text={intl.formatMessage(messages.pasteButton)}
                    clipboardData={sharedClipboardData}
                    onClick={handlePasteButtonClick}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </SortableItem>
  );
};

SubsectionCard.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  subsection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    hasChanges: PropTypes.bool,
    published: PropTypes.bool,
    visibilityState: PropTypes.string,
    actions: PropTypes.object,
    isHeaderVisible: PropTypes.bool,
    enableCopyPasteUnits: PropTypes.bool,
    proctoringExamConfigurationLink: PropTypes.string,
    childInfo: PropTypes.shape({
      children: PropTypes.array,
    }),
  }).isRequired,
  isSelfPaced: PropTypes.bool,
  isCustomRelativeDatesActive: PropTypes.bool,
  children: PropTypes.node,
  index: PropTypes.number,
  getPossibleMoves: PropTypes.func,
  onOpenPublishModal: PropTypes.func,
  onEditSubmit: PropTypes.func,
  savingStatus: PropTypes.string,
  onOpenDeleteModal: PropTypes.func,
  onDuplicateSubmit: PropTypes.func,
  onNewUnitSubmit: PropTypes.func,
  onOrderChange: PropTypes.func,
  onOpenConfigureModal: PropTypes.func,
  onPasteClick: PropTypes.func,
  onUpdate: PropTypes.func,
};

SubsectionCard.defaultProps = {
  onUpdate: () => {},
};

export default SubsectionCard;

import { useCallback, useContext } from 'react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Dropdown,
  Icon,
  IconButton,
  useToggle,
} from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';

import { useClipboard } from '../../generic/clipboard';
import { ToastContext } from '../../generic/toast-context';
import { type ContentHit, PublishStatus } from '../../search-manager';
import { useComponentPickerContext } from '../common/context/ComponentPickerContext';
import { useLibraryContext } from '../common/context/LibraryContext';
import { SidebarActions, useSidebarContext } from '../common/context/SidebarContext';
import { useRemoveItemsFromCollection } from '../data/apiHooks';
import { useLibraryRoutes } from '../routes';

import AddComponentWidget from './AddComponentWidget';
import BaseCard from './BaseCard';
import { canEditComponent } from './ComponentEditorModal';
import ComponentDeleter from './ComponentDeleter';
import messages from './messages';

type ComponentCardProps = {
  hit: ContentHit,
};

export const ComponentMenu = ({ usageKey }: { usageKey: string }) => {
  const intl = useIntl();
  const {
    libraryId,
    collectionId,
    openComponentEditor,
  } = useLibraryContext();

  const {
    sidebarComponentInfo,
    openComponentInfoSidebar,
    closeLibrarySidebar,
    setSidebarAction,
  } = useSidebarContext();

  const canEdit = usageKey && canEditComponent(usageKey);
  const { showToast } = useContext(ToastContext);
  const removeComponentsMutation = useRemoveItemsFromCollection(libraryId, collectionId);
  const [isConfirmingDelete, confirmDelete, cancelDelete] = useToggle(false);
  const { copyToClipboard } = useClipboard();

  const updateClipboardClick = () => {
    copyToClipboard(usageKey);
  };

  const removeFromCollection = () => {
    removeComponentsMutation.mutateAsync([usageKey]).then(() => {
      if (sidebarComponentInfo?.id === usageKey) {
        // Close sidebar if current component is open
        closeLibrarySidebar();
      }
      showToast(intl.formatMessage(messages.removeComponentSucess));
    }).catch(() => {
      showToast(intl.formatMessage(messages.removeComponentFailure));
    });
  };

  const showManageCollections = useCallback(() => {
    setSidebarAction(SidebarActions.JumpToAddCollections);
    openComponentInfoSidebar(usageKey);
  }, [setSidebarAction, openComponentInfoSidebar, usageKey]);

  return (
    <Dropdown id="component-card-dropdown">
      <Dropdown.Toggle
        id="component-card-menu-toggle"
        as={IconButton}
        src={MoreVert}
        iconAs={Icon}
        variant="primary"
        alt={intl.formatMessage(messages.componentCardMenuAlt)}
        data-testid="component-card-menu-toggle"
      />
      <Dropdown.Menu>
        <Dropdown.Item {...(canEdit ? { onClick: () => openComponentEditor(usageKey) } : { disabled: true })}>
          <FormattedMessage {...messages.menuEdit} />
        </Dropdown.Item>
        <Dropdown.Item onClick={updateClipboardClick}>
          <FormattedMessage {...messages.menuCopyToClipboard} />
        </Dropdown.Item>
        <Dropdown.Item onClick={confirmDelete}>
          <FormattedMessage {...messages.menuDelete} />
        </Dropdown.Item>
        {collectionId && (
          <Dropdown.Item onClick={removeFromCollection}>
            <FormattedMessage {...messages.menuRemoveFromCollection} />
          </Dropdown.Item>
        )}
        <Dropdown.Item onClick={showManageCollections}>
          <FormattedMessage {...messages.menuAddToCollection} />
        </Dropdown.Item>
      </Dropdown.Menu>
      <ComponentDeleter usageKey={usageKey} isConfirmingDelete={isConfirmingDelete} cancelDelete={cancelDelete} />
    </Dropdown>
  );
};

const ComponentCard = ({ hit }: ComponentCardProps) => {
  const { showOnlyPublished } = useLibraryContext();
  const { openComponentInfoSidebar } = useSidebarContext();
  const { componentPickerMode } = useComponentPickerContext();

  const {
    blockType,
    formatted,
    tags,
    usageKey,
    publishStatus,
  } = hit;
  const componentDescription: string = (
    showOnlyPublished ? formatted.published?.description : formatted.description
  ) ?? '';
  const displayName: string = (
    showOnlyPublished ? formatted.published?.displayName : formatted.displayName
  ) ?? '';

  const { navigateTo } = useLibraryRoutes();
  const openComponent = useCallback(() => {
    openComponentInfoSidebar(usageKey);

    if (!componentPickerMode) {
      navigateTo({ componentId: usageKey });
    }
  }, [usageKey, navigateTo, openComponentInfoSidebar]);

  return (
    <BaseCard
      itemType={blockType}
      displayName={displayName}
      description={componentDescription}
      tags={tags}
      actions={(
        <ActionRow>
          {componentPickerMode ? (
            <AddComponentWidget usageKey={usageKey} blockType={blockType} />
          ) : (
            <ComponentMenu usageKey={usageKey} />
          )}
        </ActionRow>
      )}
      hasUnpublishedChanges={publishStatus !== PublishStatus.Published}
      onSelect={openComponent}
    />
  );
};

export default ComponentCard;

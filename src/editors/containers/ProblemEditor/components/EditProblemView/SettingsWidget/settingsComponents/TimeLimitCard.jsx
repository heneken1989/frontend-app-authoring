import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import SettingsOption from '../SettingsOption';
import messages from '../messages';

const TimeLimitCard = ({
  timeLimit,
  updateSettings,
  // inject
  intl,
}) => {
  // No need to convert, display value is the same as timeLimit (in seconds)
  const displayValue = timeLimit || 0;

  useEffect(() => {
    console.log('[TimeLimitCard] Current time limit (seconds):', timeLimit);
    console.log('[TimeLimitCard] Display value (seconds):', displayValue);
  }, [timeLimit, displayValue]);

  const handleTimeLimitChange = (e) => {
    const seconds = parseInt(e.target.value, 10);
    console.log('[TimeLimitCard] Input value (seconds):', seconds);
    console.log('[TimeLimitCard] Saving time_limit:', seconds >= 0 ? seconds : 0);
    updateSettings({ time_limit: seconds >= 0 ? seconds : 0 });
  };

  const getTimeLimitSummary = (seconds) => {
    if (!seconds || seconds === 0) {
      return intl.formatMessage(messages.noTimeLimitSummary);
    }
    return intl.formatMessage(messages.timeLimitSummary, { seconds });
  };

  return (
    <SettingsOption
      title={intl.formatMessage(messages.timeLimitSettingsTitle)}
      summary={getTimeLimitSummary(displayValue)}
      className="timeLimitCard"
    >
      <div className="mb-4">
        <FormattedMessage {...messages.timeLimitSettingsLabel} />
      </div>
      <Form.Group>
        <Form.Control
          type="number"
          min={0}
          value={displayValue}
          onChange={handleTimeLimitChange}
          floatingLabel={intl.formatMessage(messages.timeLimitInputLabel)}
        />
        <Form.Control.Feedback>
          <FormattedMessage {...messages.timeLimitHint} />
        </Form.Control.Feedback>
      </Form.Group>
    </SettingsOption>
  );
};

TimeLimitCard.propTypes = {
  intl: intlShape.isRequired,
  timeLimit: PropTypes.number,
  updateSettings: PropTypes.func.isRequired,
};

TimeLimitCard.defaultProps = {
  timeLimit: 0,
};

export const TimeLimitCardInternal = TimeLimitCard; // For testing only
export default injectIntl(connect()(TimeLimitCard)); 
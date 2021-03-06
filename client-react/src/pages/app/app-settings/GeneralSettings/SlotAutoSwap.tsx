import { Field, FormikProps } from 'formik';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../../../components/form-controls/DropDown';
import { AppSettingsFormValues } from '../AppSettings.types';
import { settingsWrapper } from '../AppSettingsForm';
import { style } from 'typestyle';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { PermissionsContext, SlotsListContext } from '../Contexts';

const labelStyle = style({
  display: 'inline-block',
  width: '200px',
});
const ChioceGroupStyle = style({
  display: 'inline-block',
  width: 'calc(100%-200px)',
});
export const SlotAutoSwap: React.FC<FormikProps<AppSettingsFormValues>> = props => {
  const slots = useContext(SlotsListContext);
  const { t } = useTranslation();
  const { production_write } = useContext(PermissionsContext);
  const onToggleChange = (e: any, newValue: IChoiceGroupOption) => {
    if (newValue.key === 'off') {
      props.setFieldValue('config.properties.autoSwapSlotName', '');
    } else {
      const firstSlotName = getSlotNameList()[0];
      props.setFieldValue('config.properties.autoSwapSlotName', firstSlotName);
    }
  };

  const getCurrentSlotName = () => {
    const slotList = slots.value.map(val => val.name.split('/')[1]);
    slotList.push('production');
    return props.values.site.name.includes('/') ? props.values.site.name.split('/')[1] : 'production';
  };

  const getSlotNameList = () => {
    const slotList = slots.value.map(val => val.name.split('/')[1]);
    slotList.push('production');
    const currentSiteName = getCurrentSlotName();

    return slotList.filter(x => x.toLowerCase() !== currentSiteName.toLowerCase());
  };
  if (!slots) {
    return null;
  }
  if (slots.value.length < 1) {
    return null;
  }
  const slotDropDownItems = getSlotNameList().map<IDropdownOption>(val => ({
    key: val,
    text: val,
  }));

  return (
    <>
      {getCurrentSlotName() !== 'production' && (
        <>
          <h3>{t('slots')}</h3>
          {!production_write ? (
            <div data-cy="auto-swap-disabled-message">
              <MessageBar messageBarType={MessageBarType.warning} isMultiline={true}>
                {t('autoSwapSettingPermissionFail')}
              </MessageBar>
            </div>
          ) : (
            <div className={settingsWrapper} data-cy="auto-swap-control-set">
              <Label id={`app-settings-auto-swap-enabled-label`} className={labelStyle}>
                {t('autoSwapEnabled')}
              </Label>
              <ChoiceGroup
                ariaLabelledBy={`app-settings-auto-swap-enabled-label`}
                id="app-settings-auto-swap-enabled"
                className={ChioceGroupStyle}
                selectedKey={!!props.values.config.properties.autoSwapSlotName ? 'on' : 'off'}
                options={[
                  {
                    key: 'off',
                    /**
                     * The text string for the option.
                     */
                    text: t('off'),
                  },
                  {
                    key: 'on',
                    /**
                     * The text string for the option.
                     */
                    text: t('on'),
                  },
                ]}
                onChange={onToggleChange}
              />
              {!!props.values.config.properties.autoSwapSlotName && (
                <Field
                  name="config.properties.autoSwapSlotName"
                  component={Dropdown}
                  fullpage
                  label={t('autoSwapSlot')}
                  id="app-settings-auto-swap-slot-name"
                  options={slotDropDownItems}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SlotAutoSwap;

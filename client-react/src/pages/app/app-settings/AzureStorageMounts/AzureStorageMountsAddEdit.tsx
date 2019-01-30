import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

import ActionBar from '../../../../components/ActionBar';
import { formElementStyle } from '../AppSettings.styles';
import { FormAzureStorageMounts } from '../AppSettings.types';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { RootState } from '../../../../modules/types';
import { StorageAccountsState } from '../../../../modules/storageAccounts/reducer';
import AzureStorageMountsAddEditBasic from './AzureStorageMountsAddEditBasic';
import AzureStorageMountsAddEditAdvanced from './AzureStorageMountsAddEditAdvanced';

export interface AzureStorageMountsAddEditProps {
  updateAzureStorageMount: (item: FormAzureStorageMounts) => any;
  otherAzureStorageMounts: FormAzureStorageMounts[];
  closeBlade: () => void;
  azureStorageMount: FormAzureStorageMounts;
}

interface AzureStorageMountsAddEditStateProps {
  storageAccounts: StorageAccountsState;
}

export type AzureStorageMountsAddEditPropsCombined = AzureStorageMountsAddEditProps &
  InjectedTranslateProps &
  AzureStorageMountsAddEditStateProps;
const AzureStorageMountsAddEdit: React.SFC<AzureStorageMountsAddEditPropsCombined> = props => {
  const { updateAzureStorageMount, t, closeBlade, azureStorageMount, otherAzureStorageMounts, storageAccounts } = props;
  const [currentAzureStorageMount, setCurrentAzureStorageMount] = React.useState(azureStorageMount);
  const [confiurationOption, setConfigurationOption] = React.useState('basic');
  const [basicDisabled, setBasicDisabled] = React.useState(false);
  const [nameError, setNameError] = React.useState('');

  const validateName = (value: string) => {
    return otherAzureStorageMounts.filter(v => v.name === value).length >= 1 ? 'Azure Storage Mount names must be unique' : '';
  };
  const save = () => {
    updateAzureStorageMount(currentAzureStorageMount);
  };

  const cancel = () => {
    closeBlade();
  };

  const actionBarPrimaryButtonProps = {
    id: 'save',
    title: t('save'),
    onClick: save,
    disable: false,
  };

  const actionBarSecondaryButtonProps = {
    id: 'cancel',
    title: t('cancel'),
    onClick: cancel,
    disable: false,
  };
  const updateAzureStorageMountName = (e: any, name: string) => {
    const error = validateName(name);
    setNameError(error);
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, name });
  };

  const updateConfigurationOptions = (e: any, configOptions: IChoiceGroupOption) => {
    setConfigurationOption(configOptions.key);
  };

  const updateMountPath = (e: any, mountPath: string) => {
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, mountPath });
  };

  React.useEffect(() => {
    if (storageAccounts.data.value.length === 0) {
      setConfigurationOption('advanced');
      setBasicDisabled(true);
    } else if (!storageAccounts.data.value.find(x => x.name === currentAzureStorageMount.name)) {
      setConfigurationOption('advanced');
    }
  }, []);
  return (
    <form>
      <TextField
        label={t('_name')}
        id="azure-storage-mounts-name"
        value={currentAzureStorageMount.name}
        onChange={updateAzureStorageMountName}
        styles={{
          root: formElementStyle,
        }}
        errorMessage={nameError}
        autoFocus
      />
      <ChoiceGroup
        id="azure-storage-mounts-name"
        selectedKey={confiurationOption}
        label="Configuration Options"
        options={[
          {
            key: 'basic',
            text: t('basic'),
            disabled: basicDisabled,
          },
          {
            key: 'advanced',
            text: t('advanced'),
          },
        ]}
        onChange={updateConfigurationOptions}
      />
      {confiurationOption === 'basic' && (
        <AzureStorageMountsAddEditBasic
          {...props}
          currentAzureStorageMount={currentAzureStorageMount}
          setCurrentAzureStorageMount={setCurrentAzureStorageMount}
        />
      )}
      {confiurationOption === 'advanced' && (
        <AzureStorageMountsAddEditAdvanced
          {...props}
          currentAzureStorageMount={currentAzureStorageMount}
          setCurrentAzureStorageMount={setCurrentAzureStorageMount}
        />
      )}
      <TextField
        label={t('mountPath')}
        id="azure-storage-mounts-mount-path"
        value={currentAzureStorageMount.mountPath}
        onChange={updateMountPath}
        styles={{
          root: formElementStyle,
        }}
      />
      <ActionBar
        id="handler-mappings-edit-footer"
        primaryButton={actionBarPrimaryButtonProps}
        secondaryButton={actionBarSecondaryButtonProps}
      />
    </form>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    storageAccounts: state.azureStorageAccounts,
  };
};
export default compose<AzureStorageMountsAddEditPropsCombined, AzureStorageMountsAddEditProps>(
  translate('translation'),
  connect(mapStateToProps)
)(AzureStorageMountsAddEdit);

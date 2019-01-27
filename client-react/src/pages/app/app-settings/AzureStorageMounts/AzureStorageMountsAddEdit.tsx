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

export interface AzureStorageMountsAddEditProps {
  updateAzureStorageMount: (item: FormAzureStorageMounts) => any;
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
  const { updateAzureStorageMount, t, closeBlade, azureStorageMount } = props;
  const [currentAzureStorageMount, setCurrentAzureStorageMount] = React.useState(azureStorageMount);
  const [confiurationOption, setConfigurationOption] = React.useState('basic');
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
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, name });
  };

  const updateConfigurationOptions = (e: any, configOptions: IChoiceGroupOption) => {
    setConfigurationOption(configOptions.key);
  };

  return (
    <form>
      <TextField
        label={t('name')}
        id="azure-storage-mounts-name"
        value={currentAzureStorageMount.name}
        onChange={updateAzureStorageMountName}
        styles={{
          root: formElementStyle,
        }}
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

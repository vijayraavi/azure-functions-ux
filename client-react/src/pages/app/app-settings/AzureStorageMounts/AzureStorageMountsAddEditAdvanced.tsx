import React from 'react';
import { AzureStorageMountsAddEditPropsCombined } from './AzureStorageMountsAddEdit';
import { ChoiceGroup, TextField, IChoiceGroupOption } from 'office-ui-fabric-react';
import { formElementStyle } from '../AppSettings.styles';
import { FormikProps } from 'formik';
import { FormAzureStorageMounts } from '../AppSettings.types';
import { StorageType } from '../../../../modules/site/config/azureStorageAccounts/reducer';
export interface AzureStorageMountsAddEditAdvancedProps {}
const AzureStorageMountsAddEditAdvanced: React.FC<FormikProps<FormAzureStorageMounts> & AzureStorageMountsAddEditPropsCombined> = props => {
  const { t } = props;
  const onAccountChange = (e: any, accountName: string) => {
    props.setValues({ ...props.values, accountName });
  };
  const onTypeChange = (e: any, typeOption: IChoiceGroupOption) => {
    props.setValues({ ...props.values, type: typeOption.key as StorageType });
  };

  return (
    <>
      <TextField
        label={t('storageAccount')}
        id="azure-storage-mounts-mount-path"
        value={props.values.accountName}
        onChange={onAccountChange}
        styles={{
          root: formElementStyle,
        }}
      />
      <ChoiceGroup
        id="azure-storage-mounts-name"
        selectedKey={props.values.type}
        label="Storage Type"
        options={[
          {
            key: 'AzureBlob',
            text: t('azureBlob'),
          },
          {
            key: 'AzureFiles',
            text: t('azureFiles'),
          },
        ]}
        onChange={onTypeChange}
      />
      <TextField
        label={t('shareName')}
        id="azure-storage-mounts-share-name"
        value={props.values.shareName}
        onChange={onAccountChange}
        styles={{
          root: formElementStyle,
        }}
      />
      <TextField
        label={t('accessKey')}
        id="azure-storage-mounts-access-key"
        value={props.values.accessKey}
        onChange={onAccountChange}
        styles={{
          root: formElementStyle,
        }}
      />
    </>
  );
};
export default AzureStorageMountsAddEditAdvanced;

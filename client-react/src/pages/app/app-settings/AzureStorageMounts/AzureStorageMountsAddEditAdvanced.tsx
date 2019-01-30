import React from 'react';
import { AzureStorageMountsAddEditPropsCombined } from './AzureStorageMountsAddEdit';
import { AzureStorageMountsAddEditBasicProps } from './AzureStorageMountsAddEditBasic';
import { ChoiceGroup, TextField, IChoiceGroupOption } from 'office-ui-fabric-react';
import { formElementStyle } from '../AppSettings.styles';
export interface AzureStorageMountsAddEditAdvancedProps {}
const AzureStorageMountsAddEditAdvanced: React.FC<AzureStorageMountsAddEditPropsCombined & AzureStorageMountsAddEditBasicProps> = props => {
  const { currentAzureStorageMount, t, setCurrentAzureStorageMount } = props;
  const onAccountChange = (e: any, accountName: string) => {
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, accountName });
  };
  const onTypeChange = (e: any, typeOption: IChoiceGroupOption) => {
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, type: typeOption.key });
  };

  return (
    <>
      <TextField
        label={t('storageAccount')}
        id="azure-storage-mounts-mount-path"
        value={currentAzureStorageMount.accountName}
        onChange={onAccountChange}
        styles={{
          root: formElementStyle,
        }}
      />
      <ChoiceGroup
        id="azure-storage-mounts-name"
        selectedKey={currentAzureStorageMount.type}
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
        value={currentAzureStorageMount.shareName}
        onChange={onAccountChange}
        styles={{
          root: formElementStyle,
        }}
      />
      <TextField
        label={t('accessKey')}
        id="azure-storage-mounts-access-key"
        value={currentAzureStorageMount.accessKey}
        onChange={onAccountChange}
        styles={{
          root: formElementStyle,
        }}
      />
    </>
  );
};
export default AzureStorageMountsAddEditAdvanced;

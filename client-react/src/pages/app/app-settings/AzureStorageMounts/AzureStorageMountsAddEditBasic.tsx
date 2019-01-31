import React, { useEffect, useState } from 'react';
import { ComboBox, ChoiceGroup, IComboBoxOption, IChoiceGroupOption } from 'office-ui-fabric-react';
import { FormAzureStorageMounts } from '../AppSettings.types';
import { AzureStorageMountsAddEditPropsCombined } from './AzureStorageMountsAddEdit';
import MakeArmCall from '../../../../modules/ArmHelper';
import axios from 'axios';
import { formElementStyle } from '../AppSettings.styles';
export interface AzureStorageMountsAddEditBasicProps {
  currentAzureStorageMount: FormAzureStorageMounts;
  setCurrentAzureStorageMount: (newState: unknown) => void;
}
const AzureStorageMountsAddEditBasic: React.FC<AzureStorageMountsAddEditPropsCombined & AzureStorageMountsAddEditBasicProps> = props => {
  const { currentAzureStorageMount, setCurrentAzureStorageMount, t } = props;
  const [accountSharesFiles, setAccountSharesFiles] = useState([]);
  const [accountSharesBlob, setAccountSharesBlob] = useState([]);
  const [sharesLoading, setSharesLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const accountOptions = props.storageAccounts.data.value.map(val => ({ key: val.name, text: val.name }));

  const onAccountChange = (e: any, accountName: IComboBoxOption) => {
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, accountName: accountName.key });
  };
  const setAccessKey = (accessKey: string) => {
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, accessKey });
  };
  const onAccountShareChange = (e: any, shareOption: IComboBoxOption) => {
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, shareName: shareOption.key });
  };
  const onTypeChange = (e: any, typeOption: IChoiceGroupOption) => {
    setCurrentAzureStorageMount({ ...currentAzureStorageMount, type: typeOption.key });
  };

  useEffect(
    () => {
      const storageAccountId = props.storageAccounts.data.value.find(x => x.name === currentAzureStorageMount.accountName);
      setAccountError('');
      if (storageAccountId) {
        setAccountSharesBlob([]);
        setAccountSharesFiles([]);
        setSharesLoading(true);
        MakeArmCall({ resourceId: `${storageAccountId.id}/listKeys`, commandName: 'listStorageKeys', method: 'POST' })
          .then(async (value: any) => {
            setAccessKey(value.keys[0].value);
            const payload = {
              accountName: currentAzureStorageMount.accountName,
              accessKey: value.keys[0].value,
            };
            try {
              const blobCall = axios.post(
                `https://functions.azure.com/api/getStorageContainers?accountName=${currentAzureStorageMount.accountName}`,
                payload
              );

              const filesCall = axios.post(
                `https://functions.azure.com/api/getStorageFileShares?accountName=${currentAzureStorageMount.accountName}`,
                payload
              );

              const [blobs, files] = await Promise.all([blobCall, filesCall]);
              setSharesLoading(false);
              setAccountSharesFiles(files.data);
              setAccountSharesBlob(blobs.data);
              if (files.data.length === 0 && blobs.data.length === 0) {
                setAccountError('Account has no blob containers or file shares');
              }
            } catch (err) {
              setAccountError('No Access');
            }
          })
          .catch(err => {
            setAccountError('No Access');
          });
      }
    },
    [currentAzureStorageMount.accountName]
  );
  const blobContainerOptions = accountSharesBlob.map((x: any) => ({ key: x.name, text: x.name }));
  const filesContainerOptions = accountSharesFiles.map((x: any) => ({ key: x.name, text: x.name }));

  return (
    <>
      <ComboBox
        selectedKey={currentAzureStorageMount.accountName}
        options={accountOptions}
        label="Storage Accounts"
        allowFreeform
        autoComplete="on"
        onChange={onAccountChange}
        styles={{
          root: formElementStyle,
        }}
        errorMessage={accountError}
      />
      <ChoiceGroup
        id="azure-storage-mounts-name"
        selectedKey={currentAzureStorageMount.type}
        label="Storage Type"
        options={[
          {
            key: 'AzureBlob',
            text: t('azureBlob'),
            disabled: blobContainerOptions.length === 0,
          },
          {
            key: 'AzureFiles',
            text: t('azureFiles'),
            disabled: filesContainerOptions.length === 0,
          },
        ]}
        onChange={onTypeChange}
      />
      <ComboBox
        selectedKey={currentAzureStorageMount.shareName}
        options={currentAzureStorageMount.type === 'AzureBlob' ? blobContainerOptions : filesContainerOptions}
        label="Storage Container"
        allowFreeform
        autoComplete="on"
        onChange={onAccountShareChange}
        placeholder={sharesLoading ? 'Loading' : 'Select an Option'}
        styles={{
          root: formElementStyle,
        }}
      />
    </>
  );
};

export default AzureStorageMountsAddEditBasic;

import React, { useEffect, useState } from 'react';
import { ComboBox, ChoiceGroup, IComboBoxOption } from 'office-ui-fabric-react';
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
  const [accountShares, setAccountShares] = useState([]);
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
  useEffect(
    () => {
      const storageAccountId = props.storageAccounts.data.value.find(x => x.name === currentAzureStorageMount.accountName);
      if (storageAccountId) {
        MakeArmCall({ resourceId: `${storageAccountId.id}/listKeys`, commandName: 'listStorageKeys', method: 'POST' }).then(
          (value: any) => {
            setAccessKey(value.keys[0].value);
            const payload = {
              accountName: currentAzureStorageMount.accountName,
              accessKey: value.keys[0].value,
            };
            axios
              .post(`https://functions.azure.com/api/getStorageContainers?accountName=${currentAzureStorageMount.accountName}`, payload)
              .then(v => {
                setAccountShares(v.data);
              });
          }
        );
      }
    },
    [currentAzureStorageMount.accountName]
  );
  const storageContainerOptions = accountShares.map((x: any) => ({ key: x.name, text: x.name }));
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
      />
      <ChoiceGroup
        id="azure-storage-mounts-name"
        selectedKey={currentAzureStorageMount.type}
        label="Storage Type"
        options={[
          {
            key: 'AzureBlob',
            text: t('AzureBlob'),
          },
          {
            key: 'AzureFiles',
            text: t('azureFiles'),
          },
        ]}
      />
      <ComboBox
        selectedKey={currentAzureStorageMount.shareName}
        options={storageContainerOptions}
        label="Storage Container"
        allowFreeform
        autoComplete="on"
        onChange={onAccountShareChange}
        styles={{
          root: formElementStyle,
        }}
      />
    </>
  );
};

export default AzureStorageMountsAddEditBasic;

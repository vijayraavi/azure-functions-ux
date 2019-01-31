import React, { useEffect, useState } from 'react';
import { FormAzureStorageMounts } from '../AppSettings.types';
import { AzureStorageMountsAddEditPropsCombined } from './AzureStorageMountsAddEdit';
import MakeArmCall from '../../../../modules/ArmHelper';
import axios from 'axios';
import { formElementStyle } from '../AppSettings.styles';
import { FormikProps, Field } from 'formik';
import ComboBox from '../../../../components/form-controls/ComboBox';
import RadioButton from '../../../../components/form-controls/RadioButton';
const AzureStorageMountsAddEditBasic: React.FC<FormikProps<FormAzureStorageMounts> & AzureStorageMountsAddEditPropsCombined> = props => {
  const { t, errors } = props;
  const [accountSharesFiles, setAccountSharesFiles] = useState([]);
  const [accountSharesBlob, setAccountSharesBlob] = useState([]);
  const [sharesLoading, setSharesLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const accountOptions = props.storageAccounts.data.value.map(val => ({ key: val.name, text: val.name }));

  const setAccessKey = (accessKey: string) => {
    props.setValues({ ...props.values, accessKey });
  };
  useEffect(
    () => {
      const storageAccountId = props.storageAccounts.data.value.find(x => x.name === props.values.accountName);
      setAccountError('');
      if (storageAccountId) {
        setAccountSharesBlob([]);
        setAccountSharesFiles([]);
        setSharesLoading(true);
        MakeArmCall({ resourceId: `${storageAccountId.id}/listKeys`, commandName: 'listStorageKeys', method: 'POST' })
          .then(async (value: any) => {
            setAccessKey(value.keys[0].value);
            const payload = {
              accountName: props.values.accountName,
              accessKey: value.keys[0].value,
            };
            try {
              const blobCall = axios.post(
                `https://functions.azure.com/api/getStorageContainers?accountName=${props.values.accountName}`,
                payload
              );

              const filesCall = axios.post(
                `https://functions.azure.com/api/getStorageFileShares?accountName=${props.values.accountName}`,
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
    [props.values.accountName]
  );
  const blobContainerOptions = accountSharesBlob.map((x: any) => ({ key: x.name, text: x.name }));
  const filesContainerOptions = accountSharesFiles.map((x: any) => ({ key: x.name, text: x.name }));

  return (
    <>
      <Field
        component={ComboBox}
        name="accountName"
        options={accountOptions}
        label="Storage Accounts"
        allowFreeform
        autoComplete="on"
        styles={{
          root: formElementStyle,
        }}
        errorMessage={errors.accountName}
        validate={() => {
          if (accountError) {
            throw accountError;
          }
        }}
      />
      <Field
        component={RadioButton}
        name="type"
        id="azure-storage-mounts-name"
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
      />
      <Field
        component={ComboBox}
        name="shareName"
        options={props.values.type === 'AzureBlob' ? blobContainerOptions : filesContainerOptions}
        label="Storage Container"
        allowFreeform
        autoComplete="on"
        placeholder={sharesLoading ? 'Loading' : 'Select an Option'}
        styles={{
          root: formElementStyle,
        }}
        validate={val => {
          if (!val) {
            throw 'required';
          }
          const foundVal =
            props.values.type === 'AzureBlob'
              ? blobContainerOptions.find(x => x.key === val)
              : filesContainerOptions.find(x => x.key === val);
          if (!foundVal) {
            throw 'required';
          }
        }}
        errorMessage={errors.shareName}
      />
    </>
  );
};

export default AzureStorageMountsAddEditBasic;

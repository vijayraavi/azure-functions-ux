import { FormikProps } from 'formik';
import { DetailsListLayoutMode, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

import DisplayTableWithEmptyMessage from '../../../../components/DisplayTableWithEmptyMessage/DisplayTableWithEmptyMessage';

import { AppSettingsFormValues, FormAzureStorageMounts } from '../AppSettings.types';
import IconButton from '../../../../components/IconButton/IconButton';

export interface AzureStorageMountState {
  showPanel: boolean;
  currentAzureStorageMount: FormAzureStorageMounts | null;
  currentItemIndex: number | null;
  createNewItem: boolean;
}

export class AzureStorageMounts extends React.Component<
  FormikProps<AppSettingsFormValues> & InjectedTranslateProps,
  AzureStorageMountState
> {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
      currentAzureStorageMount: null,
      currentItemIndex: null,
      createNewItem: false,
    };
  }

  public render() {
    const { values, t } = this.props;
    if (!values.config) {
      return null;
    }
    return (
      <>
        <DisplayTableWithEmptyMessage
          items={values.azureStorageMounts || []}
          columns={this._getColumns()}
          isHeaderVisible={true}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          selectionPreservedOnEmptyClick={true}
          emptyMessage={t('emptyHandlerMappings')}
        />
      </>
    );
  }

  // private _createNewItem = () => {
  //   const blankAzureStorageMount: FormAzureStorageMounts = {
  //     name: '',
  //     type: 0,
  //     accountName: '',
  //     shareName: '',
  //     accessKey: '',
  //     mountPath: '',
  //     state: 0,
  //     sticky: false,
  //   };
  //   this.setState({
  //     showPanel: true,
  //     currentAzureStorageMount: blankAzureStorageMount,
  //     createNewItem: true,
  //     currentItemIndex: -1,
  //   });
  // };

  // private _onClosePanel = (item: FormAzureStorageMounts): void => {
  //   const { values, setValues } = this.props;
  //   const azureStorageMountsItem = values.azureStorageMounts || [];
  //   const azureStorageMounts = [...azureStorageMountsItem];
  //   if (!this.state.createNewItem) {
  //     azureStorageMounts[this.state.currentItemIndex!] = item;
  //     setValues({
  //       ...values,
  //       azureStorageMounts,
  //     });
  //   } else {
  //     azureStorageMounts.push(item);
  //     setValues({
  //       ...values,
  //       azureStorageMounts,
  //     });
  //   }
  //   this.setState({ createNewItem: false, showPanel: false });
  // };

  // private _onCancel = (): void => {
  //   this.setState({ createNewItem: false, showPanel: false });
  // };

  private _onShowPanel = (item: FormAzureStorageMounts, index: number): void => {
    this.setState({
      showPanel: true,
      currentAzureStorageMount: item,
      currentItemIndex: index,
    });
  };

  private removeItem(index: number) {
    const { values, setValues } = this.props;
    const azureStorageMounts: FormAzureStorageMounts[] = [...values.azureStorageMounts];
    azureStorageMounts.splice(index, 1);
    setValues({
      ...values,
      azureStorageMounts,
    });
  }

  private onRenderItemColumn = (item: FormAzureStorageMounts, index: number, column: IColumn) => {
    const { values, t } = this.props;
    if (!column || !item) {
      return null;
    }

    if (column.key === 'delete') {
      return (
        <IconButton
          disabled={!values.siteWritePermission}
          iconProps={{ iconName: 'Delete' }}
          ariaLabel={t('delete')}
          title={t('delete')}
          onClick={() => this.removeItem(index)}
        />
      );
    }
    if (column.key === 'edit') {
      return (
        <IconButton
          disabled={!values.siteWritePermission}
          iconProps={{ iconName: 'Edit' }}
          ariaLabel={t('edit')}
          title={t('edit')}
          onClick={() => this._onShowPanel(item, index)}
        />
      );
    }
    return <span>{item[column.fieldName!]}</span>;
  };

  // tslint:disable-next-line:member-ordering
  private _getColumns = () => {
    const { t } = this.props;
    return [
      {
        key: 'name',
        name: t('name'),
        fieldName: 'name',
        minWidth: 100,
        maxWidth: 350,
        isRowHeader: true,
        data: 'string',
        isPadded: true,
        isResizable: true,
      },
      {
        key: 'mountPath',
        name: t('mountPath'),
        fieldName: 'mountPath',
        minWidth: 150,
        maxWidth: 350,
        isRowHeader: true,
        data: 'string',
        isPadded: true,
        isResizable: true,
      },
      {
        key: 'type',
        name: t('type'),
        fieldName: 'type',
        minWidth: 100,
        maxWidth: 350,
        isRowHeader: true,
        data: 'string',
        isPadded: true,
        isResizable: true,
      },
      {
        key: 'accountName',
        name: t('accountName'),
        fieldName: 'accountName',
        minWidth: 100,
        maxWidth: 350,
        isRowHeader: true,
        data: 'string',
        isPadded: true,
        isResizable: true,
      },
      {
        key: 'shareName',
        name: t('shareName'),
        fieldName: 'shareName',
        minWidth: 100,
        maxWidth: 350,
        isRowHeader: true,
        data: 'string',
        isPadded: true,
        isResizable: true,
      },
      {
        key: 'delete',
        name: '',
        minWidth: 16,
        maxWidth: 16,
        isResizable: true,
        isCollapsable: false,
        onRender: this.onRenderItemColumn,
        ariaLabel: t('delete'),
      },
      {
        key: 'edit',
        name: '',
        minWidth: 16,
        maxWidth: 16,
        isResizable: true,
        isCollapsable: false,
        onRender: this.onRenderItemColumn,
        ariaLabel: t('edit'),
      },
    ];
  };
}

export default translate('translation')(AzureStorageMounts);

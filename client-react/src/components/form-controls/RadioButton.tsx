import React from 'react';
import { ChoiceGroup, IChoiceGroupProps, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { FieldProps } from 'formik';
import { Shimmer, Label } from 'office-ui-fabric-react';
import { style } from 'typestyle';

interface RadioButtonProps {
  fullpage: boolean;
  subLabel?: string;
  learnMore?: {
    learnMoreLink: string;
    learnMoreText: string;
  };
}

const labelStyle = style({
  display: 'inline-block',
  width: '200px',
});

const ChioceGroupStyle = style({
  display: 'inline-block',
  width: 'calc(100%-200px)',
});
const RadioButton: React.SFC<IChoiceGroupProps & FieldProps & RadioButtonProps> = props => {
  const { field, form, options, learnMore, label, subLabel, fullpage, theme, ...rest } = props;
  const onChange = (e: unknown, option: IChoiceGroupOption) => {
    form.setFieldValue(field.name, option.key);
  };
  return (
    <Shimmer isDataLoaded={options && options.length > 0} ariaLabel={'Loading content'}>
      <Label id={`${props.id}-label`} className={fullpage ? labelStyle : undefined}>
        {label}
      </Label>
      <ChoiceGroup
        ariaLabelledBy={`${props.id}-label`}
        id={props.id}
        className={fullpage ? ChioceGroupStyle : undefined}
        selectedKey={field.value}
        options={options}
        onChange={onChange}
        {...rest}
      />
    </Shimmer>
  );
};

export default RadioButton;

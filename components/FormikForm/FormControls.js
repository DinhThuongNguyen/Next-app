import React from 'react';
import Input from './Input/Input';
import RadioButtons from './RadioButton/RadioButton';
import CheckboxGroup from './CheckboxGroup/CheckboxGroup';

function FormikControls (props) {
  const { control, ...rest } = props
  switch (control) {
    case 'input':
      return <Input {...rest} />
    case 'radio':
      return <RadioButtons {...rest} />
    case 'checkbox':
      return <CheckboxGroup {...rest} />
    default:
      return null
  }
}

export default FormikControls
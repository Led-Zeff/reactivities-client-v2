import { useField } from 'formik';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { Form, Label } from 'semantic-ui-react';

export default function AppDateInput(props: Partial<ReactDatePickerProps>) {
  const [field, meta, helpers] = useField(props.name ?? '');

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <ReactDatePicker {...field} {...props} dateFormat={props.dateFormat ?? 'MMMM d, yyyy h:mm aa'} 
        selected={(field.value ? new Date(field.value) : null)}
        onChange={value => helpers.setValue(value)} />
      {meta.touched && meta.error ? (
        <Label basic color="red">{meta.error}</Label>
      ) : null}
    </Form.Field>
  );
}
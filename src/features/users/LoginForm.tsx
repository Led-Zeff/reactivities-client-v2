import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Label } from 'semantic-ui-react';
import AppTextInput from '../../app/common/form/AppTextInput';
import { useStore } from '../../app/stores/store';

export default observer(function LoginForm() {
  const {userStore} = useStore();

  return (
    <Formik initialValues={{ email: '', password: '', error: null }}
          onSubmit={(values, {setErrors}) => userStore.login(values).catch(error => setErrors({error: 'Invalid email or password'}))}>
      {({handleSubmit, isSubmitting, errors}) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <AppTextInput name="email" placeholder="Email" />
          <AppTextInput name="password" placeholder="Password" type="password" />

          <ErrorMessage name="error" render={() => <Label style={{marginBottom: 10}} basic color="red" content={errors.error} /> } />
          <Button content="Login" positive type="submit" fluid loading={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
});

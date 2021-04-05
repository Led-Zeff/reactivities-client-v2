import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Grid, Header, Tab, Button, Container, Label } from 'semantic-ui-react';
import { Profile, ProfileFormValues } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik } from 'formik';
import AppTextInput from '../../app/common/form/AppTextInput';
import AppTextArea from '../../app/common/form/AppTextArea';

interface Props {
  profile: Profile;
}

export default observer(function ProfileAbout({profile}: Props) {
  const {profileStore: {isCurrentUser, updateProfile}} = useStore();
  const [editProfileMode, setEditProfileMode] = useState(false);

  const validationSchema = Yup.object({
    displayName: Yup.string().required(),
    bio: Yup.string()
  });

  async function handleFormSubmit(profile: ProfileFormValues) {
    await updateProfile(profile);
    setEditProfileMode(false);
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="id card outline" content={`About ${profile.displayName}`} />
          {isCurrentUser && !editProfileMode && (
              <Button floated="right" basic content={editProfileMode ? 'Cancel' : 'Edit'}
                  onClick={() => setEditProfileMode(!editProfileMode)} />
          )}
        </Grid.Column>

        {!editProfileMode && (
          <Grid.Column width={16}>
            <Container content={profile.bio} style={{whiteSpace: 'pre-line'}} />
          </Grid.Column>
        )}

        {editProfileMode && (
          <Grid.Column width={16}>
              <Formik enableReinitialize validationSchema={validationSchema} initialValues={new ProfileFormValues(profile)} onSubmit={handleFormSubmit}>
                {({handleSubmit, isValid, isSubmitting, dirty, errors}) => (
                  <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                    <AppTextInput placeholder="Your name" name="displayName" />
                    <AppTextArea placeholder="About you" name="bio" rows={3} />

                    <ErrorMessage name="error" render={() => <Label style={{marginBottom: 10}} basic color="red" content={errors} /> } />
                    <Button floated="right" positive type="submit" content="Submit"
                        loading={isSubmitting}disabled={isSubmitting || !isValid || !dirty} />
                    <Button floated="right" content="Cancel" onClick={() => setEditProfileMode(false)} />
                  </Form>
                )}
              </Formik>
          </Grid.Column>
        )}
      </Grid>
    </Tab.Pane>
  );
});

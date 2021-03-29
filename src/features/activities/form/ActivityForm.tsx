import { Formik, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import AppTextInput from '../../../app/common/form/AppTextInput';
import AppTextArea from '../../../app/common/form/AppTextArea';
import AppSelectInput from '../../../app/common/form/AppSelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import AppDateInput from '../../../app/common/form/AppDateInput';

export default observer(function ActivityForm() {
  const history = useHistory();
  const {activityStore} = useStore();
  const {createActivity, updateActivity, loading, loadActivity, selectedActivity} = activityStore;
  const {id} = useParams<{id: string}>();

  const [activity, setActivity] = useState<Partial<Activity>>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: undefined,
    city: '',
    venue: ''
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('The title is required'),
    description: Yup.string().required('The description is required'),
    category: Yup.string().required(),
    date: Yup.string().required().nullable(),
    city: Yup.string().required(),
    venue: Yup.string().required()
  });

  useEffect(() => {
    if (id) loadActivity(id).then(() => {
      if (selectedActivity) setActivity(selectedActivity);
    });
  }, [id, loadActivity, selectedActivity]);

  async function handleFormSubmit(activity: Activity) {
    const saved = activity.id ? await updateActivity(activity) : await createActivity(activity);
    history.push(`/activities/${saved.id}`);
  }
  
  if (loading) return <Loading />;

  return (
    <Segment clearing>
      <Header content="Activity details" sub color="teal" />
      <Formik enableReinitialize validationSchema={validationSchema} initialValues={activity as Activity} onSubmit={handleFormSubmit}>
        {({handleSubmit, isValid, isSubmitting, dirty}) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <AppTextInput placeholder="Title" name="title" />
            <AppTextArea placeholder="Description" name="description" rows={3} />
            <AppSelectInput placeholder="Category" name="category" options={categoryOptions} />
            <AppDateInput placeholderText="Date" name="date" showTimeSelect timeCaption="Time" />

            <Header content="Location details" sub color="teal" />
            <AppTextInput placeholder="City" name="city" />
            <AppTextInput placeholder="Venue" name="venue" />

            <Button floated="right" positive type="submit" content="Submit" 
                    loading={loading} disabled={isSubmitting || !dirty || !isValid}/>
            <Button floated="right" content="Cancel" as={Link} to='/activities' />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});

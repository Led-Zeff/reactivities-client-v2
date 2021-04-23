import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { Fragment, useEffect } from 'react';
import { Comment, Header, Loader, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({activityId}: Props) {
  const {commentStore} = useStore();

  const validationSchema = Yup.object({
    body: Yup.string().required()
  });

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }

    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, activityId]);

  return (
    <Fragment>
      <Segment textAlign="center" attached="top" inverted color="teal" style={{border: 'none'}}>
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <Formik onSubmit={(values, {resetForm}) => commentStore.addComment(values.body).then(() => resetForm())}
                initialValues={{body: ''}} validationSchema={validationSchema}>
          {({isSubmitting, isValid, handleSubmit}) => (
            <Form className="ui form">
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{position: 'relative'}}>
                    <Loader active={isSubmitting} />
                    <textarea placeholder="Enter your comments" rows={2} {...props.field}
                              onKeyPress={e => {
                                if (e.key === 'Enter' && e.shiftKey) return;
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  isValid && handleSubmit();
                                }
                              }} />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>

        <Comment.Group>
          {commentStore.comments.map(comment => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || '/assets/user-avatar.png'} />

              <Comment.Content>
                <Comment.Author as="a" to={`/prifiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                <Comment.Metadata>{formatDistanceToNow(comment.createdAt)} ago</Comment.Metadata>
                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </Fragment>
  );
});

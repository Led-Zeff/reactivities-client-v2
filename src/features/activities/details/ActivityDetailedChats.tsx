import { Fragment } from "react";
import { Button, Comment, Form, Header, Segment } from "semantic-ui-react";

export default function ActivityDetailedChat() {
  return (
    <Fragment>
      <Segment textAlign="center" attached="top" inverted color="teal" style={{border: 'none'}}>
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <Comment.Group>
          <Comment>
            <Comment.Avatar src="/assets/user-avatar.png" />

            <Comment.Content>
              <Comment.Author as="a">Matt</Comment.Author>
              <Comment.Metadata>Today at 5:40 pm</Comment.Metadata>
              <Comment.Text>How artistic!</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Replay</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>

          <Form reply>
            <Form.TextArea />
            <Button content="Add replay" labelPosition="left" icon="edit" primary />
          </Form>
        </Comment.Group>
      </Segment>
    </Fragment>
  );
}

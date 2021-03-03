import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Image, Item, Label, List, Segment } from "semantic-ui-react";

export default function ActivityDetailedSidebar() {
  return (
    <Fragment>
      <Segment textAlign="center" style={{border: 'none'}} attached="top" secondary inverted color="teal">
        3 people attending
      </Segment>

      <Segment attached>
        <List relaxed divided>
          <Item style={{position: 'relative'}}>
            <Label style={{position: 'absolute'}} color="orange" ribbon="right" content="Host" />
            <Image size="tiny" src="/assets/user-avatar.png" />

            <Item.Content verticalAlign="middle">
              <Item.Header as="h3">
                <Link to={'#'}>Bob</Link>
              </Item.Header>

              <Item.Extra style={{color: 'orange'}}>Followings</Item.Extra>
            </Item.Content>
          </Item>
        </List>
      </Segment>
    </Fragment>
  );
}

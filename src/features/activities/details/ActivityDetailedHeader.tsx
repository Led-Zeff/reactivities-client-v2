import { observer } from "mobx-react-lite";
import { Segment, Image, Item, Header, Button } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '90%',
  height: 'auto',
  color: 'white'
};

interface Props {
  activity: Activity
};

export default observer(function ActivityDetailedHader({activity}: Props) {
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{padding: 0}}>
        <Image src="/assets/activities.png" fluid style={activityImageStyle} />
        
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size="huge" content={activity.title} style={{color: 'white'}} />
                <p>{activity.date}</p>
                <p>Hosted by <strong>Bob</strong></p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment clearing attached="bottom">
        <Button color="teal">Join activity</Button>
        <Button>Cancel attendance</Button>
        <Button color="orange" floated="right">Manage event</Button>
      </Segment>
    </Segment.Group>
  );
});

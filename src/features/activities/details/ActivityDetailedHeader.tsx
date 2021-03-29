import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

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
  const {activityStore: {updateAttendance, cancelActivityToggle}} = useStore();
  const [updating, setUpdating] = useState(false);

  const attendance = async () => {
    setUpdating(true);
    updateAttendance().finally(() => setUpdating(false));
  };

  const toggleCancel = async () => {
    setUpdating(true);
    cancelActivityToggle().finally(() => setUpdating(false));
  };

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{padding: 0}}>
        {activity.isCancelled && (
          <Label style={{position: 'absolute', zIndex: 1, left: -14, top: 20}} ribbon color="red" content="Cancelled" />
        )}
        <Image src="/assets/activities.png" fluid style={activityImageStyle} />
        
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size="huge" content={activity.title} style={{color: 'white'}} />
                <p>{format(activity.date, 'dd MMM yyyy')}</p>
                <p>Hosted by <strong><Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName}</Link></strong></p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <Fragment>
            <Button color={activity.isCancelled ? 'green' : 'red'} floated="left" basic onClick={toggleCancel} loading={updating}
                content={activity.isCancelled ? 'Re-activate activity' : 'Cancel activity'} />
            <Button color="orange" floated="right" as={Link} to={`/manage/${activity.id}`} disabled={activity.isCancelled}>Manage event</Button>
          </Fragment>
        ): activity.isGoing ? (
          <Button loading={updating} onClick={attendance}>Cancel attendance</Button>
        ) : ( 
          <Button loading={updating} color="teal" onClick={attendance} disabled={activity.isCancelled}>Join activity</Button>
        )}
      </Segment>
    </Segment.Group>
  );
});

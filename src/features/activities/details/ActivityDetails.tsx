import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityDetails() {
  const {activityStore} = useStore();
  const {loadActivity, loading} = activityStore;
  const {id} = useParams<{id: string}>();
  const [activity, setActivity] = useState<Activity | undefined>();

  useEffect(() => {
    if (id) loadActivity(id).then(a => setActivity(a));
  }, [id, loadActivity]);

  if (loading || !activity) return <Loading />;

  return (
    <Card fluid>
      <Image src="/assets/activities.png" />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>

      <Card.Content extra>
        <Button.Group widths="2">
          <Button basic color="blue" content="Edit" as={Link} to={`/manage/${activity.id}`} />
          <Button basic color="grey" content="Cancel" as={Link} to='/activities' />
        </Button.Group>
      </Card.Content>
    </Card>
  );
});

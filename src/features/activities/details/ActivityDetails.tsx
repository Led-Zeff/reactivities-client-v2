import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Grid, Image } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import ActivityDetailedChat from './ActivityDetailedChats';
import ActivityDetailedHader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

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
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>

      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
});

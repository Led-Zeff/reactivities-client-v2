import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tab } from 'semantic-ui-react';
import { ProfileActivityPredicate } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
  predicate: ProfileActivityPredicate
}

export default observer(function ProfileActivitiesPane({predicate}: Props) {
  const {profileStore: {loadProfileActivities, activities}} = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadProfileActivities(predicate)
      .finally(() => setLoading(false));
  }, [loadProfileActivities, predicate]);

  return (
    <Tab.Pane loading={loading}>
      <Card.Group itemsPerRow={4}>
        {activities.map(activity => (
          <Card key={activity.activityId} as={Link} to={`/activities/${activity.activityId}`}
            image="/assets/activities.png" header={activity.title} description={format(activity.date, 'd MMM yyyy h:mm aa')} />
        ))}
      </Card.Group>
    </Tab.Pane>
  );
});
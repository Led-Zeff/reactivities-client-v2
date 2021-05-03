import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { FollowPredicate } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import ProfileCard from './ProfileCard';

interface Props {
  predicate: FollowPredicate;
}

export default observer(function ProfileFollowings({predicate}: Props) {
  const {profileStore: {profile, followings, loadFollowings}} = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadFollowings(predicate)
      .finally(() => setLoading(false));
  }, [loadFollowings, predicate]);

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user"
                  content={predicate === 'FOLLOWERS' ? `People following ${profile?.displayName}` : `People ${profile?.displayName} follows`} />
        </Grid.Column>

        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings.map(profile => (
              <ProfileCard key={profile.username} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

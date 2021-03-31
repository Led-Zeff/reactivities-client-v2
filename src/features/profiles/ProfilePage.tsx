import { observer } from 'mobx-react-lite';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Grid } from 'semantic-ui-react';
import Loading from '../../app/layout/Loading';
import { useStore } from '../../app/stores/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

export default observer(function ProfilePage() {
  const {username} = useParams<{username: string}>();
  const {profileStore: {loadProfile, profile}} = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadProfile(username).finally(() => setLoading(false));
  }, [loadProfile, username]);

  if (loading) return <Loading content="Loading profile..." />

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile &&
        <Fragment>
          <ProfileHeader profile={profile} />
          <ProfileContent profile={profile} />
      </Fragment>}
      </Grid.Column>
    </Grid>
  );
});

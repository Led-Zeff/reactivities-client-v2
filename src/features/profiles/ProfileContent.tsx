import { observer } from 'mobx-react-lite';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import ProfileAbout from './ProfileAbout';
import ProfileActivities from './ProfileActivities';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({profile}: Props) {
  const panes = [
    {menuItem: 'About', render: () => <ProfileAbout profile={profile} />},
    {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
    {menuItem: 'Events', render: () => <ProfileActivities />},
    {menuItem: 'Followers', render: () => <ProfileFollowings predicate='FOLLOWERS' />},
    {menuItem: 'Following', render: () => <ProfileFollowings predicate='FOLLOWINGS' />},
  ];

  return (
    <Tab menu={{fluid: true, vertical: true}} menuPosition="left" panes={panes} />
  )
});

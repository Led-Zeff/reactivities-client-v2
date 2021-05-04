import { observer } from 'mobx-react-lite';
import { Grid, Header, MenuItem, Tab } from 'semantic-ui-react';
import ProfileActivitiesPane from './ProfileActivitiesPane';

export default observer(function ProfielActivities() {
  const panes = [
    { menuItem: 'Future Events', render: () => <ProfileActivitiesPane predicate='FUTURE' /> },
    { menuItem: 'Past Events', render: () => <ProfileActivitiesPane predicate='PAST' /> },
    { menuItem: 'Hosting', render: () => <ProfileActivitiesPane predicate='HOST' /> }
  ];

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar alternate outline" content="Activities" />
        </Grid.Column>

        <Grid.Column width={16}>
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

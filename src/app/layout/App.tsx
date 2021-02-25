import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import Loading from './Loading';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivitgy, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Activities.list().then(response => {
      setActivities(response.map(a => ({...a, date: a.date.split('T')[0]})));
      setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(a => a.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleUpsertActivity(activity: Activity) {
    setActivities(activity.id ? [...activities.filter(a => a.id !== activity.id), activity] : [...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities(activities.filter(a => a.id !== id));
  }

  if (loading) return <Loading content="Loading app" />;

  return (
    <Fragment>
      <NavBar openForm={handleFormOpen}/>

      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard activities={activities}
          selectedActivity={selectedActivitgy}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          upsert={handleUpsertActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;

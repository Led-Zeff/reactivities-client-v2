import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityForm() {
  const {activityStore} = useStore();
  const {createActivity, updateActivity, loading, loadActivity} = activityStore;
  const {id} = useParams<{id: string}>();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (id) loadActivity(id).then(a => setActivity(a!));
  }, [id, loadActivity]);

  function handleSubmit() {
    activity.id ? updateActivity(activity) : createActivity(activity);
  }

  function handleInputChange(evet: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const {name, value} = evet.target;
    setActivity({...activity, [name]: value});
  }

  if (loading) return <Loading />;

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputChange} />
        <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChange} />
        <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChange} />
        <Form.Input placeholder="Date" value={activity.date} name="date" onChange={handleInputChange} type="date" />
        <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChange} />
        <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChange} />
        <Button loading={loading} disabled={loading} floated="right" positive type="submit" content="Submit" />
        <Button floated="right" type="submit" content="Cancel" />
      </Form>
    </Segment>
  );
});

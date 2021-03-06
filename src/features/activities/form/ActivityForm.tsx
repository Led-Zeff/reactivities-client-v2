import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity | undefined;
  closeForm: () => void;
  upsert: (activity: Activity) => void;
  submitting: boolean;
}

export default function ActivityForm({activity: selecedActivity, closeForm, upsert, submitting}: Props) {
  const initialState = selecedActivity ?? {
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  };

  const [activity, setActivity] = useState(initialState);

  function handleSubmit() {
    upsert(activity);
  }

  function handleInputChange(evet: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const {name, value} = evet.target;
    setActivity({...activity, [name]: value});
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputChange} />
        <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChange} />
        <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChange} />
        <Form.Input placeholder="Date" value={activity.date} name="date" onChange={handleInputChange} type="date" />
        <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChange} />
        <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChange} />
        <Button loading={submitting} disabled={submitting} floated="right" positive type="submit" content="Submit" />
        <Button floated="right" type="submit" content="Cancel" onClick={closeForm} />
      </Form>
    </Segment>
  );
}
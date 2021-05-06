import axios from 'axios';
import { Fragment } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';

export default function TestErrors() {
  const baseUrl = process.env.REACT_APP_API_URL;

  function handleNotFound() {
    axios.get(`${baseUrl}/buggy/not-found`).catch(console.log);
  }

  function handleBadRequest() {
    axios.get(`${baseUrl}/buggy/bad-request`).catch(console.log);
  }

  function handleServerError() {
    axios.get(`${baseUrl}/buggy/server-error`).catch(console.log);
  }

  function handleUnauthorized() {
    axios.get(`${baseUrl}/buggy/unauthorized`).catch(console.log);
  }

  function handleBadGuid() {
    axios.get(`${baseUrl}/activities/notaguit`).catch(console.log);
  }

  function handleValidationError() {
    axios.post(`${baseUrl}/activities`, {}).catch(console.log);
  }

  return (
    <Fragment>
      <Header as="h1" content="Test error compontn" />
      <Segment>
        <Button.Group widths="7">
          <Button onClick={handleNotFound} content="NotFound" basic primary />
          <Button onClick={handleBadRequest} content="BadRequest" basic primary />
          <Button onClick={handleServerError} content="ServerError" basic primary />
          <Button onClick={handleUnauthorized} content="Unauthorized" basic primary />
          <Button onClick={handleBadGuid} content="BadGuid" basic primary />
          <Button onClick={handleValidationError} content="ValidationError" basic primary />
        </Button.Group>
      </Segment>
    </Fragment>
  );
}

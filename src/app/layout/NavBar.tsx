import { NavLink } from 'react-router-dom';
import { Button, Container, Icon, Menu } from 'semantic-ui-react';

export default function NavBar() {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" exact header>
          <Icon name="react" />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" />
        <Menu.Item as={NavLink} to="/errors" name="Errors" />
        <Menu.Item>
          <Button as={NavLink} to="/createActivity" positive content="Create activity" />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
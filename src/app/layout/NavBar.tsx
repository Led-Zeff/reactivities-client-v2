import { Button, Container, Menu } from 'semantic-ui-react';

export default function NavBar() {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item header>
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button positive content="Create activity" />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
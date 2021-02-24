import { Button, Container, Icon, Menu } from 'semantic-ui-react';

interface Props {
  openForm: () => void;
};

export default function NavBar({openForm}: Props) {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item header>
          <Icon name="react" />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button onClick={openForm} positive content="Create activity" />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
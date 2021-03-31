import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';
import { Photo, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
  profile: Profile;
}

export default observer(function ProfilePhotos({profile}: Props) {
  const {profileStore: {isCurrentUser, uploadPhoto, setMainPhoto, deletePhoto}} = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState<{id?: string, type?: 'main' | 'delete', val: boolean}>({val: false});

  function handlePhotoUpload(file: Blob) {
    setUploadingPhoto(true);
    uploadPhoto(file)
      .then(() => setAddPhotoMode(false))
      .finally(() => setUploadingPhoto(false));
  }

  function handleSetMainPhoto(photo: Photo) {
    setLoading({id: photo.id, type: 'main', val: true});
    setMainPhoto(photo).finally(() => setLoading({val: false}));
  }

  function handleDeletePhoto(photo: Photo) {
    setLoading({id: photo.id, type: 'delete', val: true});
    deletePhoto(photo).finally(() => setLoading({val: false}));
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button floated="right" basic content={addPhotoMode ? 'Cancel' : 'Add photo'}
                onClick={() => setAddPhotoMode(!addPhotoMode)} />
          )}
        </Grid.Column>

        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploadingPhoto} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map(photo => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2} style={{marginTop: 0}}>
                      <Button basic color="green" content="Main" disabled={photo.isMain}
                          loading={loading.val && loading.id === photo.id && loading.type === 'main'} onClick={() => handleSetMainPhoto(photo)} />

                      <Button basic color="red" icon="trash"
                          loading={loading.val && loading.id === photo.id && loading.type === 'delete'} onClick={() => handleDeletePhoto(photo)} />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>

    </Tab.Pane>
  );
});

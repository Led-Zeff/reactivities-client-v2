import { useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import FileWidgetDropZone from './FileWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props) {
  const [files, setFiles] = useState<any[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(blob => blob ? uploadPhoto(blob) : null);
    }
  }

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.previewUrl));
    };
  }, [files]);

  return (
    <Grid columns={3}>
      <Grid.Column>
        <Header sub color="teal" content="Step 1 - Select photo" />
        <FileWidgetDropZone setFiles={setFiles} />
      </Grid.Column>

      <Grid.Column>
        <Header sub color="teal" content="Step 2 - Resize image" />
        {files.length > 0 && (
          <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].previewUrl} />
        )}
      </Grid.Column>
      
      <Grid.Column>
        <Header sub color="teal" content="Step 3 - Preview & upload" />

        <div className="img-preview" style={{minHeight: 200, overflow: 'hidden'}} />
        {files.length > 0 && (
          <Button.Group widths={2} style={{marginTop: 16}}>
            <Button loading={loading} onClick={onCrop} positive icon="check" />
            <Button disabled={loading} onClick={() => setFiles([])} icon="close" />
          </Button.Group>
        )}
      </Grid.Column>
    </Grid>
  ); 
}

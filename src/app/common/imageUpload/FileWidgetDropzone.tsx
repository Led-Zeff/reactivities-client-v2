import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

interface Props {
  setFiles: (files: any) => void;
}

export default function FileWidgetDropZone({setFiles}: Props) {
  const dzStyles = {
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    padding: '40px 0',
    textAlign: 'center' as 'center',
    height: 200
  };

  const dzActive = {
    borderColor: 'green'
  };

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map((file: File) => Object.assign(file, { previewUrl: URL.createObjectURL(file) })));
  }, [setFiles]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()} style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  );
}

import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage } from 'firebase/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePost() {
  const [value, setValue] = useState('');
  const [file, setFile] = useState(null);
  const [uploadFileProgress, setUploadFileProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const onFile = (e) => {
    const file = e.target.files[0];
    if(file && file.type.includes('image')) {
      setFile(file);
    }else{
      setImageUploadError('Please select an image file');
    }    
  }

  const handleUploadPostImage = async () => {
    try {
      if(!file) {
        setImageUploadError('No image selected');
        return;
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadFileProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(error.message);
          setUploadFileProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadFileProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      )

    } catch (error) {
      setImageUploadError(error.message);
      setUploadFileProgress(null);
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' className='flex-1' placeholder='Title Required' id="title" required />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="node">Node</option>
            <option value="python">Python</option>
            <option value="reactjs">ReactJS</option> 
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={onFile} />
          <Button type='button' onClick={handleUploadPostImage} className='bg-teal-500 hover:bg-teal-600 text-white' outline size="sm" disabled={uploadFileProgress}>
            {
              uploadFileProgress ? (
                <div className='h-16 w-16'>
                  <CircularProgressbar value={uploadFileProgress} text={`${uploadFileProgress}%`} />
                </div>
              ) : 'Upload Image'
            }
          </Button>
        </div>
        {imageUploadError && (
          <Alert type='danger' color="failure" className='mt-4'>
            {imageUploadError}
          </Alert>
        )}
        {
          formData.image && (
            <img src={formData.image} alt='uploaded image' className='max-w-full object-cover' />
          )
        }
        <ReactQuill theme="snow" placeholder='Write something' className='h-72 mb-12' required value={value} onChange={setValue} />;
        <Button type='submit' className='bg-teal-500 hover:bg-teal-600 text-white' size="sm">
          Publish
        </Button>
      </form>
    </div>
  )
}

import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase'
import { updateSuccess, updateFailure, updateStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { set } from 'mongoose';

export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(0);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      if(file.size > (2 * 1024 * 1024)){
        setImageFileUploadingError("file must be less than 2MB");
        setImageFileUploadingProgress(null)
        return;
      }

      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if(imageFile){
      uploadFile();
    }
  }, [imageFile])

  useEffect(() => {
    if (updateUserSuccess) {
      const timeoutId = setTimeout(() => {
        setUpdateUserSuccess(null);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [updateUserSuccess]);

  const uploadFile = async () => {
    setImageFileUploading(true);
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadingError("file must be an image");
        setImageFileUploadingProgress(null)
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () =>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({...formData, photoURL: downloadUrl});
          setImageFileUploading(false);
        })
      }
    )

  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes made');
      return;
    }

    if(imageFileUploading){
      setUpdateUserError('Image is still uploading');
      return
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        return;
      }else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }

  return (
    <div className='max-w-lg mx-auto w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
          <img src={imageFileUrl || currentUser.photoURL} alt='user'  className='rounded-full w-full h-full object-cover border-8 border-[lightgray] '/>



          <div className='absolute inset-0'>
            {imageFileUploadingProgress > 1 && imageFileUploadingProgress < 100 && (
              <CircularProgressbar value={imageFileUploadingProgress} text={`${imageFileUploadingProgress}%`} />
            )}
          </div>


        </div>
        {imageFileUploadingError &&  <Alert color="failure">{imageFileUploadingError}</Alert>}       
        <TextInput type='text' id="username" placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id="email" placeholder='email' defaultValue={currentUser.email} onChange={handleChange}  />
        <TextInput type='password' id="password" placeholder='password' onChange={handleChange}  />
        <Button type='submit' outline>Update</Button>
      </form>

      <div className='text-red-800 flex justify-between mt-5 font-semibold dark:text-red-400'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && <Alert className='mt-5' color="success">{updateUserSuccess}</Alert>}
      {updateUserError && <Alert className='mt-5' color="failure">{updateUserError}</Alert>}
    </div>
  )
}

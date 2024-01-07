import { Alert, Button, FileInput, Select, TextInput, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage } from 'firebase/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { addCategory, removeCategory } from '../redux/site/categorySlice';
import { useDispatch, useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [uploadFileProgress, setUploadFileProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({});
  const [ populateAfterDelay, setPopulateAfterDelay ] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const { postId } = useParams();
  const [newCategory, setNewCategory] = useState('');

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      dispatch(addCategory(newCategory));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = () => {
    const delCategory = formData.category;
    if(delCategory){
      dispatch(removeCategory(delCategory));
    }
    
  };

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch('/api/post/getposts?postId=' + postId);
        const data = await res.json();
        if(!res.ok){
          setPublishError(data.message)
          return;
        }
        setPublishError(null);
        setFormData(data.posts[0]);

        // adding small delay to populate form data values in virtual DOM after response to avoid empty values. 
        await delay(250);
        setPopulateAfterDelay(true);
        
      }
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId])

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

  const handleOnSubmit = async (e) => { 
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if(!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate('/post/' + data.slug);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      {
        !populateAfterDelay && (
          <div className='h-96 flex items-center justify-center'>
             <Spinner aria-label="Extra large spinner example" size="xl" />
          </div>
        )
      }
      {populateAfterDelay && (
      <form className='flex flex-col gap-4' onSubmit={handleOnSubmit}>
        <div className='gap-4 border-4 mb-4 border-teal-500 border-dotted p-3'>
          <div className='flex w-full gap-4 mb-4'>
            <div className='flex-1'>
              <TextInput type='text' onChange={ (e) => setFormData({...formData, title: e.target.value })} placeholder='Title Required' id="title" required value={formData?.title} />
            </div>
            <div className='flex-1'>
              <Select onChange={ (e) => setFormData({...formData, category: e.target.value })} value={formData?.category} >
                <option value="Uncategorized">Uncategorized</option>
              {
                categories.map((category) => (<option key={category} value={category}>{category}</option>))
              }
              </Select>
            </div>
            <div className='flex-2'>
              <Button type='button' onClick={handleRemoveCategory} outline>Remove Category</Button>
            </div>
          </div>
        
          <div className='flex w-full gap-4'>
            <div className='flex-1'><TextInput type='text' value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder='Add Category' /></div>
            <div className='flex-2'><Button onClick={handleAddCategory} outline>Add Category</Button></div>
          </div>
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
        <ReactQuill onChange={(value) => setFormData({...formData, content: value})} theme="snow" placeholder='Write something' className='h-72 mb-12' required value={formData?.content} />
        <Button type='submit' className='bg-teal-500 hover:bg-teal-600 text-white' size="sm">
          Update Post
        </Button>
        {
          publishError && (
            <Alert type='danger' color="failure" className='mt-4'>
              {publishError}
            </Alert>
          )
        }
      </form>
        )}
    </div>
  )
}

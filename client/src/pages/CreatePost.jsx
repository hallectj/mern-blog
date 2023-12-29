import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export default function CreatePost() {
  const [value, setValue] = useState('');

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
          <FileInput type='file' accept='image/*' />
          <Button type='button' className='bg-teal-500 hover:bg-teal-600 text-white' outline size="sm">
            Upload Image
          </Button>
        </div>
        <ReactQuill theme="snow" placeholder='Write something' className='h-72 mb-12' required value={value} onChange={setValue} />;
        <Button type='submit' className='bg-teal-500 hover:bg-teal-600 text-white' size="sm">
          Publish
        </Button>
      </form>
    </div>
  )
}

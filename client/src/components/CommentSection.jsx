import { Button, Textarea } from 'flowbite-react';
import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react';
import { Link } from 'react-router-dom'

export default function CommentSection({postId}) {
  const { currentUser } = useSelector(state => state.user);
  const [ comment, setComment ] = useState('');

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if(comment.length > 200) return;
    
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, content: comment, userId: currentUser._id })
      });
  
      const data = await res.json();

      if(res.ok){
        setComment('');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as</p>
          <img className='h-5 w-5 rounded-full object-cover' src={currentUser.photoURL} alt='user profile pic' />
          <Link className='text-xs text-cyan-500 hover:underline' to='/dashboard?tab=profile'>@{currentUser.username}</Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5'>
          <div>You must be logged in to comment</div>
          <Link className='text-blue-500 hover:underline flex gap-1' to={'/sign-in'}>Sign in</Link>
        </div>
      )}
      {
        currentUser && (
          <form onSubmit={handleSubmit} className='flex flex-col gap-2 border-teal-500 rounded-md p-3'>
            <Textarea onChange={(e) => setComment(e.target.value)} value={comment} placeholder='add a comment...' rows={3} maxLength='200' />
            <div className='flex justify-between items-center mt-5'>
              <p className='text-gray-500 text-xs'>{200 - comment.length} characters left remaining</p>
              <Button outline type='submit'>
                Submit
              </Button>
            </div>
          </form>
        )
      }
    </div>
  )
}

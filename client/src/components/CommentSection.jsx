import { Button, Textarea } from 'flowbite-react';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment';

export default function CommentSection({postId}) {
  const { currentUser } = useSelector(state => state.user);
  const [ userComment, setUserComment ] = useState('');
  const [ comments, setComments ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getpostcomments/' + postId);
        if(res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    
    fetchComments();
  }, [postId]);

  const handleEdit = async (comment, editedContent) => {
    setComments(comments.map((c) => {
      if(c._id === comment._id){
        return {
          ...c,
          content: editedContent,
        }
      }
      return c;
    }));
  }

  const handleDelete = async (commentId) => {
    const commentIdx = comments.findIndex((c) => c._id === commentId);
    if(commentIdx === -1) return;
    
    comments.splice(commentIdx, 1);
    setComments([...comments]);
  }

  

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if(userComment.length > 200) return;
    
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, content: userComment, userId: currentUser._id })
      });
  
      const data = await res.json();

      if(res.ok){
        setUserComment('');
        setComments([data, ...comments]);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) => {
            if(comment._id === commentId){
              return {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
            <Textarea onChange={(e) => setUserComment(e.target.value)} value={userComment} placeholder='add a comment...' rows={3} maxLength='200' />
            <div className='flex justify-between items-center mt-5'>
              <p className='text-gray-500 text-xs'>{200 - userComment.length} characters left remaining</p>
              <Button outline type='submit'>
                Submit
              </Button>
            </div>
          </form>
        )
      }

      {comments.length === 0 ? 
      (
        <div>
          <p className='text-sm py-5'>No comments yet</p>
        </div>
      ) : 
      (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {
            comments.map((comment) => {
              return (
                <Comment key={comment._id} comment={comment} onEdit={handleEdit} onDelete={handleDelete} onLike={handleLike} />
              )
            })
          }
        </>
      )
      }
      
    </div>
  )
}

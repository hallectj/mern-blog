import React from 'react'
import moment from 'moment';
import { useEffect } from 'react'
import { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function Comment({comment, onLike, onEdit, onDelete}) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getUser = async () => {
        try {
            const res = await fetch(`/api/user/${comment.userId}`);
            const data = await res.json();
            if(res.ok){
                setUser(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    getUser();
  }, [comment]);

  const performSaveComment = () => {
    const editComment = async () => {
      try {
        const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: editedComment })
        });
        const data = await res.json();
        if(res.ok){
          setIsEditing(false)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    
    if(editedComment.length < 1 || editedComment.length > 200) {
      return;
    }
    editComment();
    onEdit(comment, editedComment);
  }

  const handleDelete = () => {
    setShowModal(false);
    const deleteComment = async () => {
      try {
        const res = await fetch(`/api/comment/deletecomment/${comment._id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if(res.ok){
          onDelete(comment._id);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    deleteComment();
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.content);
  }

  return (
    <div className='flex p-4 border-b dark:border-gray-500 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img className='w-10 h-10 rounded-full bg-gray-200' src={user.photoURL} alt={user.username} />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
            <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {
          isEditing ? (
            <div>
              <Textarea onChange={(e) => setEditedComment(e.target.value)} className='w-full border-0 focus:ring-0 focus:outline-none max-[150px]: resize-none'  value={editedComment} rows={4}  maxLength='200'  />
              <p className='text-gray-500 text-xs'>{200 - editedComment.length} characters left remaining</p>
              <div className='flex gap-2 mt-2'>
                <Button disabled={editedComment.length < 1 || editedComment.length > 200} type='button' onClick={performSaveComment} size="xs" color='gray' outline>Save</Button>
                <Button disabled={editedComment.length < 1 || editedComment.length > 200} type='button' onClick={() => setIsEditing(false)} size="xs" color="gray" outline>Cancel</Button>
              </div>
            </div>
          ) : (
            <div><p className='text-gray-500 mb-2'>{comment.content}</p></div>
          )
        }
        
        <div className='flex gap-2'>
        {
          !isEditing && (
            <div className='flex gap-2'>
              <button type='button' onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${
                currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                 <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'> {comment.numberOfLikes > 0 && comment.numberOfLikes + ' ' +
                (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
            </div>
          )
        }
        </div>
        <div className='flex gap-2 w-full mt-2'>
          {
            currentUser && (currentUser._id === comment.userId) && !isEditing && (
              <button type='button' onClick={handleEdit} className='text-gray-400 hover:text-blue-500'>Edit</button>
            )
          }
          {
            currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && !isEditing && (
              <button type='button' onClick={() => setShowModal(true)} className='text-gray-400 hover:text-red-600'>Delete</button>
          )
        }
        </div>
      </div>

      {
        showModal && (
          <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header />
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 mb-4 mx-auto text-gray-400 dark:text-gray-200' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
                <div className='flex justify-center gap-4'>
                  <Button color="failure" onClick={handleDelete}>Yes I am sure</Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>)
      }

    </div>
    
  )
}
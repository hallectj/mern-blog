import { Table, Button, Modal } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashPost() {
  const { currentUser } = useSelector(state => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => { 
    try {
      const fetchPosts = async () => {
        const res = await fetch('/api/post/getposts?userId=' + currentUser._id)
        const data = await res.json()
        if(res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length < 9){
            setShowMore(false);
          }
        }
      }
      if(currentUser.isAdmin){
        fetchPosts();
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch('/api/post/getposts?userId=' + currentUser._id + '&startIndex=' + startIndex);
      const data = await res.json();
      if(res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if(data.posts.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
        return;
      }else{
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }

    if(userPosts.length < 9){
      setShowMore(false);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table className='shadow-md' hoverable>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
          {
            userPosts.map((post) => {
              return (
                <Table.Body className='divide-y' key={post._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post._id}`}>
                      <img className='w-20 h-10 object-cover bg-gray-500' src={post.image} alt={post.title} />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                      <span onClick={() => {setShowModal(true); setPostIdToDelete(post._id);}} className='text-red-500 font-medium cursor-pointer hover:underline'>Delete</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className='text-teal-500 cursor-pointer hover:underline'>Edit</span>
                    </Link>
                  </Table.Cell>

                </Table.Row>
              </Table.Body>
              )
            })
          }
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='mt-4 w-full self-center text-teal-500'>
                Show More
              </button>
            )
          }
        </>
      ) : (
        <p>No posts found</p>
        
      )}
          
        {
          showModal && (
          <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header />
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 mb-4 mx-auto text-gray-400 dark:text-gray-200' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your post?</h3>
                <div className='flex justify-center gap-4'>
                  <Button color="failure" onClick={handleDeletePost}>Yes I am sure</Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          )
        }

    </div>
  )
}

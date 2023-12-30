import { Table, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

export default function DashPost() {
  const { currentUser } = useSelector(state => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

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
                    <Link to={`/delete-post/${post._id}`}>
                      <span className='text-red-500 font-medium cursor-pointer hover:underline'>Delete</span>
                    </Link> 
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
    </div>
  )
}

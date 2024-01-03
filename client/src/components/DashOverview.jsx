import { Table, Button } from 'flowbite-react';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { HiArrowNarrowUp, HiOutlineUserGroup, HiChatAlt2, HiDocumentAdd } from 'react-icons/hi';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

export default function DashOverview() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const currentUser = useSelector(state => state.user.currentUser);

  useEffect(() => { 
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5')
        const data = await res.json()
        if(res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
          setLoadingUsers(false);
        }
      } catch (error) {
        console.log(error.message)
        setLoadingUsers(false);      
      }
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5')
        const data = await res.json()
        
        if(res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);

        }
      } catch (error) {
        console.log(error.message);
      }
    }
    
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();

        if(res.ok) {
          setComments(data.comments);
          setLastMonthComments(data.lastMonthComments);
          setTotalComments(data.totalComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if(currentUser.isAdmin){
      fetchUsers()
      fetchPosts();
      fetchComments();
    }

  }, [currentUser])

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex flex-wrap gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>                
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>

          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'><HiArrowNarrowUp />{lastMonthUsers}</span>
            <div className='text-gray-500'>
              Last Month
            </div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>                
            </div>
            <HiDocumentAdd className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>

          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'><HiArrowNarrowUp />{lastMonthPosts}</span>
            <div className='text-gray-500'>
              Last Month
            </div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>                
            </div>
            <HiChatAlt2 className='bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>

          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'><HiArrowNarrowUp />{lastMonthComments}</span>
            <div className='text-gray-500'>
              Last Month
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent Users</h1>
                <Button outline className='text-sm'>
                    <Link to={'/dashboard?tab=users'}>View All</Link>
                </Button>
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>User Image</Table.HeadCell>
                    <Table.HeadCell>Username</Table.HeadCell>
                </Table.Head>
                {users && users.map((user) => {
                    return(
                        <Table.Body key={user._id} className='divide-y'>
                          <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>
                              <img src={user.photoURL} alt='user' className='w-10 h-10 rounded-full bg-gray-500'/>
                            </Table.Cell>
                          <Table.Cell className='w-16' title={user.username}>{user.username}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    )
                })}
            </Table>
        </div>


        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent Comments</h1>
                <Button outline className='text-sm'>
                    <Link to={'/dashboard?tab=comments'}>View All</Link>
                </Button>
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Comment Content</Table.HeadCell>
                    <Table.HeadCell>Likes</Table.HeadCell>
                </Table.Head>
                {comments && comments.map((comment) => {
                    return(
                        <Table.Body key={comment._id} className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                          <Table.Cell className='w-96'>
                            <p className='line-clamp-2' title={comment.content}>{comment.content}</p>
                          </Table.Cell>
                          <Table.Cell>{comment.likes.length}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    )
                })}
            </Table>
        </div>


        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent Posts</h1>
                <Button outline className='text-sm'>
                    <Link to={'/dashboard?tab=posts'}>View All</Link>
                </Button>
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Post Image</Table.HeadCell>
                    <Table.HeadCell>Post Title</Table.HeadCell>
                    <Table.HeadCell>Post Category</Table.HeadCell>
                </Table.Head>
                {posts && posts.map((post) => {
                    return(
                        <Table.Body key={post._id} className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                          <Table.Cell>
                            <img
                              src={post.image}
                              alt='user'
                              className='w-14 h-14 rounded-md bg-gray-500'
                            />
                          </Table.Cell>
                          <Table.Cell className='w-96'>{post.title}</Table.Cell>
                          <Table.Cell className='w-5'>{post.category}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    )
                })}
            </Table>
        </div>
      </div>
    </div>
  )
}

import { Table, Button, Modal } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';


export default function DashUsers() {
  const { currentUser } = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => { 
    try {
      const fetchUsers = async () => {
        const res = await fetch('/api/user/getusers?userId=')
        const data = await res.json()
        if(res.ok) {
          setUsers(data.users);
          if(data.users.length < 9){
            setShowMore(false);
          }
        }
      }
      if(currentUser.isAdmin){
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch('/api/user/getusers?startIndex=' + startIndex);
      const data = await res.json();
      if(res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if(data.users.length < 10){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
        return;
      }else{
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }

    if(users.length < 10){
      setShowMore(false);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table className='shadow-md' hoverable>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>User Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
          {
            users.map((user) => {
              return (
                <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>

                      <img className='w-10 h-10 object-cover rounded-full bg-gray-500' src={user.photoURL} alt={user.username} />
                    
                  </Table.Cell>
                  <Table.Cell>
                    <span>{user.username}</span>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500" />) : (<FaTimes className="text-red-500" />)}</Table.Cell>
                  <Table.Cell>
                      <span onClick={() => {setShowModal(true); setUserIdToDelete(user._id);}} className='text-red-500 font-medium cursor-pointer hover:underline'>Delete</span>
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
        <p>No Users found</p>
        
      )}
          
        {
          showModal && (
          <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header />
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 mb-4 mx-auto text-gray-400 dark:text-gray-200' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
                <div className='flex justify-center gap-4'>
                  <Button color="failure" onClick={handleDeleteUser}>Yes I am sure</Button>
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

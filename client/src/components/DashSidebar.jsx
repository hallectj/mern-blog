import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiDocumentText, HiUser, HiOutlineUserGroup, HiAnnotation, HiOutlineChartPie } from 'react-icons/hi'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab'); 
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search])

  const handleSignout = async () => { 
    try {
      const res = await fetch('api/user/signout', {
        method: 'POST'
      });
      const data = await res.json();
      if(!res.ok){
        return;
      }else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item active={tab === 'dash' || !tab} icon={HiOutlineChartPie} as='div'>
                <p>Overview</p>
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item as="div" active={tab === "profile"} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor="dark">
              <p>Profile</p>
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <div>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item as="div" active={tab === "posts"} icon={HiDocumentText} labelColor="dark">
                  <p>Posts</p>
                </Sidebar.Item>
              </Link>
            
              <Link to="/dashboard?tab=users">
                <Sidebar.Item as="div" active={tab === "users"} icon={HiOutlineUserGroup} labelColor="dark">
                  <p>Users</p>
                </Sidebar.Item>
              </Link>
              
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>
                  <p>Comments</p>
                </Sidebar.Item>
              </Link>
            </div>
          )}

          <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

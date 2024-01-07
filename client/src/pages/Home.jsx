import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';
import ReactLogo from '../assets/ReactLogo.png';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts');
        const data = await res.json();
        if(res.ok){
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>This is a test website built with React, Redux, MongoDb, NodeJS and Express. Articles are largely dummy articles.</p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View All Articles
        </Link>
      </div>

      <div className='p-3 bg-amber-100 dark:bg-slate-700 ml-5 mr-5'>
        <CallToAction
          imgSrc={ReactLogo}
          heading='Ad Heading Would Go Here'
          paragraph='Call to Action paragraph would go here.'
          link='https://www.google.com'
        />
      </div>

      <div className='flex flex-col gap-8 max-w-6xl mx-auto p-3 py-7'>
        {
          posts && posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl text-center font-semibold'>Recent Posts</h2>
              <div className='flex flex-wrap gap-4'>
                {
                  posts.map((post) => {
                    return (
                      <PostCard key={post._id} post={post} />
                    )
                  })
                }
              </div>
              <Link to='/search' className='text-lg sm:text-md text-teal-500 font-bold hover:underline text-center'>View All Posts</Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

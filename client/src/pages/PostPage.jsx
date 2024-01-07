import { Button, Spinner } from 'flowbite-react';
import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/commentSection';
import PostCard from '../components/PostCard';
import ReactLogo from '../assets/ReactLogo.png';

export default function PostPage() {
  const { postSlug } = useParams();
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(false);
  const [post, setPost] = useState({});
  const [recentPosts, setRecentPosts] = useState(null);


  useEffect(() => {
    const fetchPost = async () => {
      setPostLoading(true);
      try {
        const res = await fetch('/api/post/getposts?slug=' + postSlug);
        const data = await res.json();
        if(!res.ok){
          setPostLoading(false);
          setPostError(true);
          return;
        }

        setPost(data.posts[0]);
        setPostLoading(false);
        setPostError(false);   

      } catch (error) {
        console.log(error.message);
        setPostError(true);
        setPostLoading(false);
      }
    }
    fetchPost();
  }, [postSlug])

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=3');
        const data = await res.json();
        if(res.ok){
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchRecentPosts();
  }, [post])

  if(postLoading){
    return (
      <div className="container flex flex-col text-center justify-center w-100 min-h-screen">
        <h3>Loading Post...</h3>
        <Spinner size="xl" />
      </div>
    )
  }

  return (
    
    <main className='p-3 max-w-6xl flex flex-col mx-auto min-h-screen'>
      {
        !!post ? (
          <>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
              {post.title}
            </h1>
            <div className='flex items-center justify-center gap-2'>
              <Link to={"/search?category=" + post.category}>
                <Button color='gray' className='font-semibold text-black dark:text-white p-1 border-gray-500' pill size="xs">{post && post.category}</Button>
              </Link>
            </div>
            <img className='object-contain mt-4 p-3 max-h-[550px] w-full' src={post && post.image} alt={post.title} />
            <div className='flex justify-between p-3 border-b-slate-500 mx-auto w-full max-w-2xl text-xs'>
              <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
              <span className='ml-3'>{post && (post.content.length / 1000).toFixed(0)} min read</span>
            </div>
            <div className='p-3 max-w-4xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}></div>

            <div className='max-w-4xl mx-auto w-full'>
              <CallToAction
                imgSrc={ReactLogo}
                heading='Ad Heading Would Go Here'
                paragraph='Call to Action paragraph would go here.'
                link='https://www.google.com'
              />
            </div>
            <CommentSection postId={post._id} />

            <div className='flex flex-col items-center mb-2'>
              <h1 className='text-xl mt-2'>Recent articles</h1>
              <div className='flex flex-wrap gap-5 mt-5'>
                {recentPosts &&
                  recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </div>  
          </>
        ) : (
          <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>Post Not Found</h1>
        )
      }
    </main>
  )
}

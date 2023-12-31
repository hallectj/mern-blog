import { Button, Spinner } from 'flowbite-react';
import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/commentSection';

export default function PostPage() {
  const { postSlug } = useParams();
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(false);
  const [post, setPost] = useState({});


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
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post.title}
      </h1>
      <Link className="mt-5 self-center" to={"/search?category=" + post.category}>
        <Button color='gray' className='font-semibold text-black dark:text-white p-1 border-gray-500' pill size="xs">{post && post.category}</Button>
      </Link>
      <img className='object-contain mt-10 p-3 max-h-[550px] w-full' src={post && post.image} alt={post.title} />
      <div className='flex justify-between p-3 border-b-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='ml-3'>{post && (post.content.length / 1000).toFixed(0)} min read</span>
      </div>
      <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>

      </div>

      <div className='max-w-4xl mx-auto w-full'>
      <CallToAction
        imgSrc='https://i.ytimg.com/vi/jS4aFq5-91M/maxresdefault.jpg'
        heading='Learn more about JavaScript'
        paragraph='Checkout these resources with 100 JavaScript projects'
        link='https://www.google.com'
      />
      </div>
      <CommentSection postId={post._id} />
    </main>
  )
}

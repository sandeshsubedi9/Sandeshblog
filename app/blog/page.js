import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import fs from "fs";
import matter from 'gray-matter';

// const blogs = [
//   {
//     title: 'First Blog',
//     description: 'This is the first blog description.',
//     slug: 'first-blog',
//     date: '2023-10-01',
//     author: 'John Doe',
//     image: '/typescript.webp'
//   },
//   {
//     title: 'Second Blog',
//     description: 'This is the second blog description.',
//     slug: 'second-blog',
//     date: '2023-10-02',
//     author: 'Jane Doe',
//     image: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
//   },
//   {
//     title: 'Second Blog',
//     description: 'This is the second blog description.',
//     slug: 'second-blog',
//     date: '2023-10-02',
//     author: 'Jane Doe',
//     image: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg'
//   },
//   // Add more blog objects here
// ];
/**
 * Blog component that renders a list of blog posts.
 * Each blog post includes an image, title, description, author, date, and a link to the full post.
 * 
 * 
 * @returns {JSX.Element} The rendered blog component.
 */
const blog = () => {
    const dirContent = fs.readdirSync("content", "utf-8")
    const blogs = dirContent.map(file => {
        const fileContent = fs.readFileSync(`content/${file}`, "utf-8")
        const { data } = matter(fileContent)
        return data
    })
    return (
        <div className="container w-[90vw] mx-auto p-4">
            {/* Main heading for the blog section */}
            <h1 className="text-4xl font-bold mb-8 text-center">Blogs</h1>

            {/* Grid layout for blog posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                    <div key={index} className="rounded-lg shadow-md overflow-hidden  dark:border-2">
                        {/* Blog post image */}
                        <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />

                        {/* Blog post content */}
                        <div className="p-4">
                            {/* Blog post title */}
                            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>

                            {/* Blog post description */}
                            <p className=" mb-4">{blog.description}</p>

                            {/* Blog post author and date */}
                            <div className="text-sm  mb-4">
                                <span>By {blog.author}</span> | <span>{new Date(blog.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>

                            {/* Link to the full blog post */}
                            <Link href={`/blogpost/${blog.slug}`}> <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Read More
                                </span>
                            </button></Link>
                    </div>
                    </div>
                ))}
        </div>
        </div >
    );
};
export default blog;
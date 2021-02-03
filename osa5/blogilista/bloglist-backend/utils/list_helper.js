// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  const reducer = (sum, blog) => sum + blog.likes
  const likesCount = blogs.reduce(reducer, 0)
  return likesCount
}

const favoriteBlog = (blogs) => {
  const reducer = (acc, cur) => Math.max(acc, cur)
  const mostLikes = blogs.map(blog => blog.likes).reduce(reducer)
  const blog = blogs.find(blog => blog.likes === mostLikes)

  const blogDetails = {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
  return blogDetails
}

const mostBlogs = (blogs) => {
  const reducer = (acc, author) => {
    if (!acc[author]) {
      acc[author] = 1
    } else {
      acc[author]++
    }
    return acc
  }

  const blogsByAuthors = blogs.map(blog => blog.author).reduce(reducer, {})

  let favAuthor = ''
  let blogsCount = 0
  for (let i = 0; i < blogs.length; i++) {
    if (blogsByAuthors[blogs[i].author] > blogsCount) {
      blogsCount = blogsByAuthors[blogs[i].author]
      favAuthor = blogs[i].author
    }
  }

  const favBlogger = {
    author: favAuthor,
    blogs: blogsCount
  }

  return favBlogger

}

const mostLikes = (blogs) => {
  const reducer = (acc, blog) => {
    if (!acc[blog.author]) {
      acc[blog.author] = blog.likes
    } else {
      acc[blog.author] += blog.likes
    }

    return acc
  }

  const likesByAuthors = blogs.reduce(reducer, {})

  let favAuthor = ''
  let sumOfLikes = 0
  for (let i = 0; i < blogs.length; i++) {
    if (likesByAuthors[blogs[i].author] > sumOfLikes) {
      sumOfLikes = likesByAuthors[blogs[i].author]
      favAuthor = blogs[i].author
    }
  }

  const favBlogger = {
    author: favAuthor,
    likes: sumOfLikes
  }
  return favBlogger
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
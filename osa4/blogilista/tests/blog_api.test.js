const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let TOKEN = ''

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ id:'12char12char', username: 'root', passwordHash })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user.id
  }

  TOKEN = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id property name is id (not _id)', async () => {
    const response = await api.get('/api/blogs')
    for (const blog of response.body) {
      expect(blog.id).toBeDefined()
    }

  })

  describe('addition of a new blog', () => {
    test('add new blog to array', async () => {
      const newBlog = {
        title: 'Test title',
        author: 'Noname',
        url: 'http://justfortesting.something',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${TOKEN}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('if blog not contains likes property it will get zero value', async () => {
      const newBlog = {
        title: 'Test title',
        author: 'Noname',
        url: 'http://justfortesting.something'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${TOKEN}`)
        .send(newBlog)
        .expect(201)

      const response = await api.get('/api/blogs')
      expect(response.body[response.body.length -1].likes).toBe(0)
    })

    test('bad request (status: 400) when title missing' , async () => {
      const noTitleBlog = {
        author: 'Noname',
        url: 'http://justfortesting.something',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${TOKEN}`)
        .send(noTitleBlog)
        .expect(400)

      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('bad request (status: 400) when url missing' , async () => {
      const noUrlBlog = {
        title: 'Test title',
        author: 'Noname',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${TOKEN}`)
        .send(noUrlBlog)
        .expect(400)

      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('401 Unauthorized if token missing ', async () => {
      const newBlog = {
        title: 'Test title',
        author: 'Noname',
        url: 'http://justfortesting.something',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })


  })
  describe('deletion of a blog', () => {
    test('add a new blog and delete it correctly', async () => {
      const newBlog = {
        title: 'Test title',
        author: 'Noname',
        url: 'http://justfortesting.something',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${TOKEN}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterNewOne = await helper.blogsInDb()
      const blogToDelete = blogsAfterNewOne[blogsAfterNewOne.length - 1]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${TOKEN}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAfterNewOne.length - 1)

    })

  })
  describe('update of a blog', () => {
    test('update likes property of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        ...blogToUpdate,
        likes: 20
      }

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[0]).toEqual(updatedBlog)
    })
  })

})
describe('when there is initially one user at db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'hessuh',
      name: 'Hessu Hopo',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation succeeds with 3 char password ', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'unique',
      name: 'new user',
      password: '123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

  test('creation fails with proper statuscode and message if password length < 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'unique',
      name: 'new user',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password length is shorter than 3 chars')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

})

afterAll(() => {
  mongoose.connection.close()
})

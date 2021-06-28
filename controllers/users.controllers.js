const client = require('../util/database')
const bcrypt = require('bcryptjs')

const generateToken = require('../util/generateToken')
const generateHashPassword = require('../util/generateHashPassword')
const asyncHandler = require('express-async-handler')

const SCHEMA = process.env.HARPER_DB_SCHEMA_NAME
const TABLE = 'users'

// @desc    Get all users
// @route   GET /users
// @access  Private
exports.getAllUsers = async (req, res) => {
  console.log('getAll: [GET] /users/')

  const result = await client.searchByHash({
    table: 'users',
    hashValues: [req.user.id],
    attributes: [
      'id',
      'username',
      'email',
      'bio',
      'location',
      'category',
      'gender',
      'facebook',
      'instagram',
      'twitter',
      'linkedin',
    ],
  })

  const user = await result.data[0]

  try {
    const QUERY = `SELECT *, geoDistance("[${user.location.center}]", location) as distance FROM ${SCHEMA}.${TABLE} ORDER BY distance ASC`

    const users = await client.query(QUERY)
    res.json(users.data)
  } catch (error) {
    console.error(error)
    res.status(500)
    throw new Error('Internal Server Error.')
  }
}

// @desc    Get single user
// @route   GET /users/:username
// @access  Public
exports.getOneUser = asyncHandler(async (req, res) => {
  console.log('getOneUser : [GET] /users/:username')

  const options = {
    table: TABLE,
    searchAttribute: 'username',
    searchValue: `${req.params.username}`,
    attributes: [
      'id',
      'username',
      'email',
      'bio',
      'location',
      'category',
      'gender',
      'facebook',
      'instagram',
      'twitter',
      'linkedin',
    ],
  }

  const user = await client.searchByValue(options)

  if (user.data.length !== 0) {
    res.json(user.data[0])
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

// @desc    Register a new user
// @route   POST /users
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  console.log('registerUser : [POST] /users')
  const { username, email, password, location, gender, category } = req.body

  const user = await client.query(
    `SELECT id FROM ${SCHEMA}.${TABLE} WHERE username='${username}' OR email='${email}'`
  )

  if (user.data.length != 0) {
    res.status(400)
    throw new Error('Username / Email already exists.')
  } else {
    try {
      const hashedPassword = await generateHashPassword(password)

      const user = await client.insert({
        table: TABLE,
        records: [
          {
            username: username,
            email: email,
            password: hashedPassword,
            location: location,
            gender: gender,
            category: category,
            bio: '',
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          },
        ],
      })
      res.status(201).json({
        id: user.data.inserted_hashes[0],
        username: username,
        email: email,
        location: location,
        gender: gender,
        category: category,
        bio: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        token: generateToken(user.data.inserted_hashes[0]),
      })
    } catch (err) {
      console.error(err)
      res.status(400)
      throw new Error('Invalid User Data')
    }
  }
})

// @desc    Auth user & get token
// @route   POST /users/login
// @access  Public
exports.authUser = asyncHandler(async (req, res) => {
  console.log('authUser: [POST] /users/login')

  const { username, password } = req.body

  const options = {
    table: TABLE,
    searchAttribute: 'username',
    searchValue: `${username}`,
    attributes: ['*'],
  }

  const user = await client.searchByValue(options)

  if (user.data.length === 0) {
    res.status(401)
    throw new Error('Username does not exist.')
  } else if (!(await bcrypt.compare(password, user.data[0].password))) {
    res.status(401)
    throw new Error('Username and password does not match. Try again.')
  } else {
    delete user.data[0].password
    res.json({
      ...user.data[0],
      token: generateToken(user.data[0].id),
    })
  }
})

// @desc    Get user profile
// @route   POST /users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  console.log('getUserProfile: [GET] /users/profile')

  const user = await client.searchByHash({
    table: 'users',
    hashValues: [req.user.id],
    attributes: [
      'id',
      'username',
      'email',
      'bio',
      'location',
      'category',
      'gender',
      'facebook',
      'instagram',
      'twitter',
      'linkedin',
    ],
  })

  if (user) {
    res.json(user.data[0])
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  console.log('updateUserProfile: [PUT] /users/profile')

  if (req.user.username) {
    const check0 = await client.searchByValue({
      table: 'users',
      searchAttribute: `username`,
      searchValue: `${req.user.username}`,
      attributes: ['id'],
    })
    if (check0.data.length !== 0) {
      res.status(400)
      throw new Error('username is already taken.')
    }
  }

  if (req.user.email) {
    const check0 = await client.searchByValue({
      table: 'users',
      searchAttribute: `email`,
      searchValue: `${req.user.email}`,
      attributes: ['id'],
    })

    if (check0.data.length !== 0) {
      res.status(400)
      throw new Error('Email is already registered.')
    }
  }

  let updatedUser = {}

  const user = await client.searchByHash({
    table: 'users',
    hashValues: [req.user.id],
    attributes: ['*'],
  })

  if (user) {
    updatedUser.username = req.body.username || user.data[0].username
    updatedUser.email = req.body.email || user.data[0].email
    updatedUser.location = req.body.userLocation || user.data[0].location
    updatedUser.gender = req.body.gender || user.data[0].gender
    updatedUser.category = req.body.category || user.data[0].category
    updatedUser.bio = req.body.bio || user.data[0].bio
    updatedUser.facebook = req.body.facebook || user.data[0].facebook
    updatedUser.instagram = req.body.instagram || user.data[0].instagram
    updatedUser.twitter = req.body.twitter || user.data[0].twitter
    updatedUser.linkedin = req.body.linkedin || user.data[0].linkedin
    updatedUser.id = user.data[0].id

    if (req.body.password) {
      const hashedPassword = await generateHashPassword(req.body.password)
      updatedUser.password = hashedPassword
    }

    const updateUser = await client.update({
      table: TABLE,
      records: [updatedUser],
    })

    res.status(201).json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      location: updatedUser.location,
      category: updatedUser.category,
      gender: updatedUser.gender,
      bio: updatedUser.bio,
      facebook: updatedUser.facebook,
      instagram: updatedUser.instagram,
      twitter: updatedUser.twitter,
      linkedin: updatedUser.linkedin,
      token: generateToken(updatedUser.id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Add user to favourites
// @route   POST users/favourites
// @access  Private
exports.addFavourites = asyncHandler(async (req, res) => {
  console.log('addFavourites: [POST] /users/favourites')

  if (req.user.id == req.body.favourite_id) {
    res.status(400)
    throw new Error('User cannot add themself to the favourites')
  }

  const alreadyExists = `SELECT id FROM ${SCHEMA}.favourites WHERE user_id="${req.user.id}" AND favourite_id="${req.body.favourite_id}"`

  const result = await client.query(alreadyExists)

  if (result.data.length != 0) {
    res.status(409)
    throw new Error('Already exists in Favourite')
  }

  try {
    const insert = `INSERT INTO ${SCHEMA}.favourites (user_id, favourite_id) VALUES("${req.user.id}", "${req.body.favourite_id}")`

    const result = await client.query(insert)

    const addedFavourite = await client.query(
      `SELECT id, username, email, bio, location, category, gender, facebook,instagram, twitter, linkedin FROM ${SCHEMA}.users WHERE id="${req.body.favourite_id}"`
    )

    res.json({ newFavourite: addedFavourite.data[0] })
  } catch (error) {
    res.status(500)
    throw new Error('Internal Server Error')
  }
})

// @desc    Delete user from favourites
// @route   DELETE users/favourites
// @access  Private
exports.deleteFavourites = asyncHandler(async (req, res) => {
  console.log('deleteFavourites: [DELETE] /users/favourites')

  const deleteFavourites = `DELETE FROM ${SCHEMA}.favourites WHERE user_id="${req.user.id}" AND favourite_id="${req.body.favourite_id}"`

  const result = await client.query(deleteFavourites)

  if (result.data.deleted_hashes.length === 0) {
    res.status(404)
    throw new Error('Cannot Delete. User Does Not Exist in Favourites.')
  }

  res.json({
    message: 'Deleted from favourites',
  })
})

// @desc    Get all favourites
// @route   GET users/favourites
// @access  Private
exports.getFavourites = asyncHandler(async (req, res) => {
  console.log('getFavourites: [GET] /users/favourites')

  try {
    const getFavs = `SELECT u.id, u.email, u.username, u.location, u.category, u.gender, u.bio, u.facebook, u.instagram, u.twitter, u.linkedin FROM findaroommate.users AS u INNER JOIN findaroommate.favourites AS f ON u.id = f.favourite_id WHERE f.user_id = "${req.user.id}"`

    let favourites = await client.query(getFavs)

    res.json(favourites.data)
  } catch (error) {
    res.status(500)
    throw new Error('Internal Server Error')
  }
})

// @desc    Search users by location
// @route   POST users/search
// @access  Private
exports.getSearchUsers = asyncHandler(async (req, res) => {
  console.log('getSearchUsers: [POST] /users/search')

  try {
    const getUsers = `SELECT * FROM ${SCHEMA}.${TABLE} WHERE geoNear("[${req.body.searchLocation.center}]", location, 200, 'kilometers')`

    const users = await client.query(getUsers)
    res.json(users.data)
  } catch (error) {
    res.status(500)
    throw new Error('Internal Server Error')
  }
})

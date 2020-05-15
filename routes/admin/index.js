const express = require('express')
const router = express.Router()
const category = require('../../models/category')
const post = require('../../models/post')
const Post = require('../../models/post')
const path = require('path')
const Category = require('../../models/category')
const User = require('../../models/user')
const user = require('../../models/user')



router.get('/', (req, res) => {

   res.render('admin/index')

})

router.get('/categories', (req, res) => {

   category.find({}).sort({ $natural: -1 }).then(categories => {
      res.render('admin/categories', { categories: categories })
   })

})


router.post('/categories', (req, res) => {

   category.create(req.body, (error, category) => {
      if (!error) {
         res.redirect('categories')
      }
   })

})


router.delete('/categories/:id', (req, res) => {

   category.remove({ _id: req.params.id }).then(() => {
      res.redirect('/admin/categories')

   })
})

router.get('/posts', (req, res) => {


   Post.find({author:req.session.userId}).populate({ path: 'category', model: category }).sort({ $natural: -1 }).then(posts => {

      res.render('admin/posts', { posts: posts })

   })
})

router.get('/users', (req, res) => {
   user.find({_id : req.session.userId}).then(users => {
       res.render('admin/users', { users : users })
   })
  
})

router.delete('/posts/:id', (req, res) => {

   post.remove({ _id: req.params.id }).then(() => {
      res.redirect('/admin/posts')

   })
})

router.get('/posts/edit/:id', (req, res) => {

   Post.findOne({ _id: req.params.id }).then(post => {
      category.find({}).then(categories => {
         res.render('admin/editpost', { post: post, categories: categories })
      })
   })

})
router.get('/users/edit/:id', (req, res) => {

   User.findOne({_id : req.session.userId}).then( user => {
      res.render('admin/edituser', {user : user})
   })

})

router.put('/users/:id', (req, res) => {
   User.findOne({_id : req.session.userId}).then( user => {
      user.userName = req.body.userName
      user.email = req.body.email
      user.phoneNumber = req.body.phoneNumber
      user.password = req.body.password

      user.save().then(user => {
         res.redirect('/admin/users')
      })
   })
})

router.put('/posts/:id', (req, res) => {
  

   let post_image = req.files.post_image

  post_image.mv(path.resolve(__dirname, '../../public/img/postimages', post_image.name))

   Post.findOne({ _id: req.params.id }).then(post => {
      post.title = req.body.title
      post.kitapAdi = req.body.kitapAdi
      post.yazarAdi = req.body.yazarAdi
      post.content = req.body.content
      post.Category = req.body.Category
      post.kitapBaskiYili = req.body.kitapBaskiYili
      post.kitapSehir = req.body.kitapSehir
      post.kitapFiyat = req.body.kitapFiyat
      post.date = req.body.date
      post.post_image = `/img/postimages/${post_image.name}`

      post.save().then(post => {
         res.redirect('/admin/posts')
      })
   })


})


module.exports = router
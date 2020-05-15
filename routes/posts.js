const express = require('express')
const router = express.Router()
const Post = require("../models/post")
const path = require('path')
// const Category = require('../models/Category')
const Category = require('../models/category')
const category = require('../models/category')
const User = require('../models/user')

router.get('/new', (req, res) => { //ilan verilmek isteniyorsa
  if (!req.session.userId) { //eger siteye kullanıcı giris yapıldıysa ilan vermeye gitsin
    res.redirect('users/login')
  }
  //giris yapılmadıysa giris yapmaya gidilsin
  Category.find({}).then(categories => {
    res.render('site/addpost', { categories: categories })
  })

})
function escapeRegex(text) { //ilan search yapılmak isteniyorsa
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) => {
  { //ilan search yapılmak isteniyorsa
    if (req.query.look) {
      const regex = new RegExp(escapeRegex(req.query.look), 'gi');
      Post.find({ "kitapAdi": regex }).populate({ path: 'author', model: User }).sort({ $natural: -1 }).then(posts => {
        category.aggregate([{
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'Category',
            as: 'posts'
          }
        },
        {
          $project: {

            _id: 1,
            name: 1,
            num_of_posts: { $size: '$posts' }
          }
        }
        ]).then(categories => {

          res.render('site/blog', { posts: posts, categories })
        })
      });
    }
  }
})
//kişinin ilanları kısmıda path author olcak model users olcak
router.get('/category/:categoryId', (req, res) => { //postları yolladı cünkü birden fazla post aynı categori olabilir?
  Post.find({ category: req.params.categoryId }).populate({ path: 'Category', model: category }).populate({ path: 'author', model: User }).then(posts => {
    category.aggregate([{
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'Category',
        as: 'posts'
      }
    },
    {
      $project: {

        _id: 1,
        name: 1,
        num_of_posts: { $size: '$posts' }
      }
    }
    ]).then(categories => {
      res.render('site/blog', { posts: posts, categories })
    })
  })
})




router.get('/:id', (req, res) => {
  Post.findById(req.params.id).populate({ path: 'author', model: User }).then(post => {
    category.aggregate([{
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'Category',
        as: 'posts'
      }
    },
    {
      $project: {

        _id: 1,
        name: 1,
        num_of_posts: { $size: '$posts' }
      }
    }
    ]).then(categories => {
      Post.find({}).populate({ path: 'author', model: User }).sort({ $natural: -1 }).then(posts => {
        res.render('site/post', { post: post, categories: categories, posts: posts })
      })

    })
  })

})

router.post('/test', (req, res) => {
  let post_image = req.files.post_image

  post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name)) // 
  //mv fonksiyonu ile yüklenen resmin bir kopyasını postimages klasörüne yolladık. daha dogrusu kopya degil kendisini


  Post.create({
    ...req.body,
    post_image: `/img/postimages/${post_image.name}`,
    author: req.session.userId
  })

  req.session.sessionFlash = {
    type: 'alert alert-success',
    message: 'İlanınız başarılı bir şekilde oluşturuldu'
  }
  res.redirect("/blog")
})

module.exports = router
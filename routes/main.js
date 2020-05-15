const express = require('express')
const router = express.Router()
const Post = require("../models/post")
const Category = require('../models/category')
const User = require('../models/user')


router.get('/', (req, res) => {
    console.log(req.session)
    res.render('site/index')

})
/* router.get('/admin', (req,res)  =>{
    res.render('admin/index')
}) */
router.get('/blog', (req, res) => {
    Post.find({}).populate({ path: 'author', model: User }).sort({ $natural: -1 }).then(posts => {
        Category.aggregate([{
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
            res.render('site/blog', { posts: posts, categories: categories })
        })

    })


})
router.get('/contact', (req, res) => {
    res.render('site/contact')
})



module.exports = router
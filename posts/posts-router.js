const express = require('express');
const Posts = require('../data/db.js');
const { json } = require('express');

const router = express.Router();



router.get('/', async (req, res) => {
   try {
       const posts = await Posts.find();
       if (posts.length > 0) {
           res.status(200).json(posts);
       } else {
           res.status(404).json({message: 'No posts available'})
       }
   } catch (error) {
       console.log(error);
       res.status(500).json({
           error: 'The posts information could not be retrieved'
       });
   }
});

router.get('/:id', async (req,res) =>{
    try {
        const post = await Posts.findById(req.params.id);
    if(post) {
        res.status(200).json(post);
    } else {
        res.status(404).json({
            message: 'The post with the specified ID does not exist'
        });
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "The post information could not be retrieved"
        });
    }
});



router.post('/', async (req, res) => {
    const postInfo = req.body;
    try {
        if (postInfo.title !== '' && postInfo.contents !== '') {
            const posts = await Posts.insert(postInfo)
            res.status(201).json(posts);
        } else {
            res.status(400).json({errorMessage: 'Please provide title and contents for the posts'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        });
    }
});

router.get('/:id/comments', async (req, res) => {
  const id = req.params.id
  const posts = await Posts.findById(id)

  try {
      const comments = await Posts.findPostComments(id)
      if (comments) {
        res.status(200).json(comments)
      } else {
      res.status(404).json({ errorMessage: 'The post requested cannot be found' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ errorMessage: `Server error: ${err}` })
  }
});



router.post('/:id/comments', async (req,res) => {
    const id = req.params.id
    const commentInfo = {...req.body, post_id: id};
    try {
        if (commentInfo) {
            const comments = await Posts.findById(id)
            if (comments){
                const postedComment = await Posts.insertComment(commentInfo)
                res.status(201).json(postedComment);
            }
        } else{
            res.status(400).json({
                errorMessage: 'Please provide text for the comment'
            });
        }
    } catch(error){
        console.log(error);
        res.status(500).json({
            error: 'There was an error while saving the comment to the database'
        });
    }
});


router.delete('/:id', async (req,res) => {
    try {
        const post = await Posts.remove(req.params.id);
  
        if (post) {
            res.status(200).json(req.body);
        } else {
            res.status(400).json({
                message: "The post with the specified ID does not exist."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "The Post could not be removed"
        });
    }
});

module.exports = router;
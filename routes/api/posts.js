const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');

//@Route     POST api/posts
//@Desc      Create a Post
//@Access    Private

router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ _id: req.user.id }).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: user.id
        })

        await newPost.save();

        res.json(newPost);
    } catch (error) {

    }
});

//@Route     GET api/posts
//@Desc      Get all posts
//@Access    Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
})

//@Route     GET api/posts/:id
//@Desc      Get post by id
//@Access    Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ msg: 'post not found' });
        }

        res.json(post);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(400).json({ msg: 'post not found' });
        res.status(500).send('Server Error');
    }
})

//@Route     DELETE api/posts/:id
//@Desc      Delete post by id
//@Access    Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ msg: 'post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Authorization Denied' });
        }

        await post.remove();

        res.json({ msg: 'post removed successfully' });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(400).json({ msg: 'post not found' });
        res.status(500).send('Server Error');
    }
})

//@Route     PUT api/posts/like/:id
//@Desc      Like a Post
//@Access    Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post)
            return res.status(400).json({ msg: 'post not found' });

        if (post.likes.filter(p => p.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post is already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
})

//@Route     PUT api/posts/unlike/:id
//@Desc      unLike a Post
//@Access    Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post)
            return res.status(400).json({ msg: 'post not found' });

        if (post.likes.filter(p => p.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post is not yet liked' });
        }

        const index = post.likes.map(l => l.user.toString()).indexOf(req.user.id);

        post.likes.splice(index, 1);

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
})

// @route    Post api/posts/comment/:id
// @ desc    comment on a post
// @acess      Private  
router.post('/comment/:id', [auth, [
    check('text', 'Text is Required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    };
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.error(errors.msg);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @ desc    delete a comment
// @acess      Private  

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //pull aout comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if (!comment) {
            return res.status(404).json({ msg: "comment deosnt exist" });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "user unAuthorized" });
        }

        const comment_1 = post.comments.find(comment => comment.id === req.params.comment_id);

        const remove_index = post.comments.indexOf(comment_1);

        console.log(remove_index);

        post.comments.splice(remove_index, 1);

        post.save();

        res.json(post.comments);
    } catch (error) {
        console.error(errors.msg);
        res.status(500).send('Server Error');
    }
})

// @route    Get api/posts/comment/:id
// @ desc    show all comments of a post
// @acess      Private

router.get('/comment/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        res.json(post.comments);
    } catch (error) {
        console.error(errors.msg);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
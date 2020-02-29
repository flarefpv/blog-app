const mongoose = require('mongoose')
const Blog = require('./models/blog'),
Comment = require('./models/comment')

const seeds = [
    {
        title: 'Blog 1',
        image: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fstatic.techspot.com%2Fimages%2Fproducts%2F2019%2Flaptops%2Forg%2F2019-08-09-product-5.jpg&f=1&nofb=1',
        body: 'Wowie I cant a bleve this blog oof Wowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oofWowie I cant a bleve this blog oof',
    },
    {
        title: 'Blog 2',
        image: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
        body: 'Wowie I cant a bleve this blog oof',
    },
    {
        title: 'Blog 3',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
        body: 'Wowie I cant a bleve this blog oof',
    },
]

async function seedDB(){
    
    //Removes blogs
    await Blog.remove({}, function(err){
        if(err){
            console.log(err)
        }else {
            console.log('Blogs removed')
        }
    })
    
    //Removes comments
    await Comment.remove({}, function(err){
        if(err){
            console.log(err)
        } else{
            console.log('Comments removed')
        }
    })

    //Seeding
    // for(const seed of seeds){
    //    let blog = await Blog.create(seed)
    //    console.log('Blog Created')
    //    let comment = await Comment.create({
    //         author: ,
    //         text: 'This is a very nice post'
    //     })
    //     console.log('Comment Created')
    //     blog.comments.push(comment)
    //     blog.save();
    //     console.log('Comment added to blog post')
    // }
}

module.exports = seedDB
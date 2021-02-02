const http = require('http');
// const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
// const Post = require('./post');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
// const koaStatic = require('koa-static');
const app = new Koa();

// const public = path.join(__dirname, '/public');

app.use(cors());
// app.use(koaStatic(public));

app.use(koaBody({
    json: true,
}));

let posts = [{id: 0, content: 'Hello World!'}];
let nextId = 1;

const router = new Router();

router.get('/posts', async (ctx, next) => {
    ctx.response.body = posts;
})

    .post('/posts', async(ctx, next) => {
        const {content, id} = ctx.request.body;

        // const ticketPost = new Post(content);
        // await ticketPost.save();
        // ctx.response.body = ticketPost;

        if (id !== 0) {
            posts = posts.map(o => o.id !== id ? o : {...o, content: content});
            ctx.response.status = 204;
            return;
        }

        posts.push({...ctx.request.body, id: nextId++, created: Date.now()});
        ctx.response.status = 204;
})

    .delete('/posts/:id', async(ctx, next) => {
        const postId = Number(ctx.params.id);

        // await Post.delete(postId);
        const index = posts.findIndex(o => o.id === postId);
        if (index !== -1) {
            posts.splice(index, 1);
        }
        ctx.response.body = 'deleted';
        ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));
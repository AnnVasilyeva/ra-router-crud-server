const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

class Post {
    constructor(content) {
        this.id = uuidv4();
        this.content = content;
    }

    async save() {
        const tickets = await Post.getAll();
        tickets.push(this.toJSON());
        return  new Promise((resolve, reject) =>{
            fs.writeFile(
                path.join(__dirname, 'public', 'db.json'),
                JSON.stringify(tickets),
                err => {
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }

                }
            )
        })

    }

    toJSON() {
        return {
            content: this.content,
            id: this.id,
        }
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, 'public', 'db.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    }else{
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }

    static async delete(id){
        let tickets = await Post.getAll();
        tickets = tickets.filter(elem => elem.id !== id);

        return  new Promise((resolve, reject) =>{
            fs.writeFile(
                path.join(__dirname, 'public', 'db.json'),
                JSON.stringify(tickets),
                err => {
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                }
            )
        })
    }



}

module.exports = Post;
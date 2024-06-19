import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] });
        res.json(posts);
    } catch (err) {
        console.log(err);
           res.status(500).json({
            message: 'Не удалось получить статью',
           }); 
        }
    };


    export const remove = async (req, res) => {
        const postId = req.params.id;
        try {
            const doc = await PostModel.findOneAndDelete({ _id: postId });
            if (!doc) {
                return res.status(404).json({ message: "Статья не найдена" });
            }
            res.json(doc);
        } catch (err) {
            return res.status(500).json({ message: "Не удалось удалить статью" });
        };
        res.json({
            success: true,
        })
    };
    


    export const update = async (req, res) => {
        const postId = req.params.id;
        try {
            const updateData = {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl, 
                user: req.userId,
                tags: req.body.tags
            };
    
            const doc = await PostModel.updateOne({ _id: postId }, updateData);
    
            if (doc.nModified === 0) {
                return res.status(404).json({ message: "Статья не найдена" });
            }
            res.json({ message: "Статья успешно обновлена" });
        } catch (err) {
            return res.status(500).json({ message: "Не удалось обновить статью" });
        }
    };
    

    export const getOne = async (req, res) => {
            const postId = req.params.id;
            PostModel.findOneAndUpdate(
                { _id: postId } ,{ $inc: { viewsCount: 1 } },{ returnDocument: "After" } )
                .then(doc => res.json(doc))
                .catch(err => res.status(500).json({ message: "Статья не найдена" }))};
        
export const create = async (req,res) => {
    try {
        const doc = new PostModel({
            
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });


        const post = await doc.save();

        
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью",
        });
    }
};
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const appError = require("../service/appError");
const { ObjectId } = require('mongodb');

const getPostController = async function (req, res, next) {
    let post = "";
    let timeSort = "";
    let keywordFilter = {};

    if (req.query.timeSort == "desc" || req.query.timeSort == "monthDesc") {
        timeSort = "-createdAt";
    } else {
        timeSort = "createdAt";
    }

    if (req.query.timeSort == "monthDesc") {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        keywordFilter = {
            createdAt: {
                $gte: startOfMonth,
            }
        };
    }

    if (req.query.Keyword) {
        const keywords = req.query.Keyword.split(' ');
        const regexArray = keywords.map(keyword => ({ content: new RegExp(keyword) }));
        keywordFilter.$or = regexArray;
    }

    post = await Post.find(keywordFilter).populate({
        path: 'userName',
        select: 'userName photo'
    }).sort(timeSort);

    if (post.length) {
        res.status(200).json({
            success: true,
            message: "搜尋成功",
            post
        });
    } else {
        res.status(200).json({
            success: true,
            message: "沒有貼文"
        });
    }
};

const createPostController = async function (req, res, next) {
    if (JSON.stringify(req.body) == '{}') {
        return next(appError(400, "未填寫要新增內容", next));
    }

    const userName = req.body.userName.trim();

    if (userName) {
        let query = {};
        if (ObjectId.isValid(userName)) {
            query = { _id: userName };
        } else {
            query = { userName: userName };
        }
        const userResult = await User.find(query);

        if (!userResult.length) {
            return next(appError(400, "查無此使用者資料", next));
        }

        //在 replace 函式中，$1 表示正則表達式中的第一個捕獲組，也就是 (.*) 匹配到的部分。因此，整個匹配到的字串會被 (.*) 所替換。
        req.body.userName = JSON.stringify(userResult[0]._id).replace(/^"(.*)"$/, '$1');
    }

    req.body.content = req.body.content.trim();

    if (!req.body.content) {
        return next(appError(400, "內容不為空", next));
    }

    const newPost = await Post.create(req.body);

    res.status(200).json({
        success: true,
        message: "新增貼文成功",
        post: newPost
    });
};

const deletePostController = async function (req, res, next) {
    const deletePost = await Post.findByIdAndDelete(req.params.id);

    if (!deletePost) {
        return next(appError("400", "刪除貼文失敗", next));
    }

    res.status(200).json({
        success: 'success',
        message: '刪除貼文成功'
    });
};

const deleteAllPostController = async function (req, res, next) {
    const deletePost = await Post.deleteMany();

    if (!deletePost) {
        return next(appError("400", "刪除貼文失敗", next))
    }

    res.status(200).json({
        success: 'success',
        message: '刪除所有貼文成功'
    });
};

const updatePostController = async function (req, res, next) {
    const content = req.body.content || '';
    const image = req.body.image || '';

    if (!content.trim()) {
        return next(appError("400", "內容不可為空，請重新輸入", next));
    }

    const newPost = await Post.findByIdAndUpdate(req.params.id, { content: content.trim(), image: image });

    if (!newPost) {
        return next(appError("400", "更新失敗", next));
    };

    res.status(200).json({
        success: 'success',
        newPost
    });
}

module.exports = {
    getPostController: getPostController,
    createPostController: createPostController,
    updatePostController: updatePostController,
    deletePostController: deletePostController,
    deleteAllPostController: deleteAllPostController
}
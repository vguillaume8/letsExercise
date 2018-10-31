'use strict';
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose'),
 User = mongoose.model('User');

function findById(req, res, next) {
    User.findById(req.params.userId, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);

    });

    // let id = req.params.id;

    // console.log(`get user by ID: ${id}`);

    // return service.findById(res, id);
};

function findAll(req, res, next){
    var usersProtection = {
        __v: false,
        ExerciseList: false
    };

    User.find({}, usersProtection, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });

};

function save(req, res, next) {
    var newUser = new User(req.body);
    console.log(newUser);
    newUser.save(function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
};

function updateUser(req, res, next){
    User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
};

function deleteById(req, res, next){
    User.remove({
        _id: req.params.userId
    }, function(err, user){
        if(err){
            res.send(err);
        }
        res.json({message: 'User successfully deleted'});
    });

    // console.log("Delete User by ID");
    // let id = req.params.id;
    // return service.deleteById(res, id);
};

function createExercise(req, res, next){
    var exercises = req.body;
    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$push: {ExerciseList: exercises}},
        function(err, user){
            if(err){
                res.send(err);
            }
            res.json(user);
        });
};

function getPhotos(req, res, next){
   User.findById(req.params.userId, 'PhotoList.fileName', function(err, user){
       if(err){
           res.send(err);
       }
       res.json(user.PhotoList);
   });
};

function saveFileName(file_name, req){
    var fileName = {fileName: file_name}

    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$push: {PhotoList: fileName}},
        function(err, user){
            if(err){
                console.log(err);
            }
            console.log(user);
        }
    );
};

function deletePhoto(req, res, next){
    var filename = path.join(__dirname + '/../../public/photo-storage/' + req.params.fileName);
    fs.unlink(`${filename}`, (err) => {
        if(err){
            res.send(err);
        }
    });

    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$pull: {PhotoList: {fileName: filename}}},
        function(err, user){
            if(err){
                res.send(err);
            }
            res.json(user);
        }
    );
};





module.exports = {
    findById, 
    findAll, 
    save, 
    deleteById,
    getPhotos,
    createExercise,
    updateUser,
    saveFileName,
    deletePhoto
}
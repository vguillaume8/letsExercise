'use strict';
const mongoose = require('mongoose'),
 User = mongoose.model('User');
const path = require('path');
var currentId = 0;


// Finds user by req.body
function findById(req, res) {
    User.findById(req.body.userId, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);

    });
}

// Finds user by req.param
function findByIdParam(req, res) {
    User.findById(req.params.userId, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);

    });
}

// finds user by firstname and last name
function findUser(req, res){
    var firstname = req.body.firstName;
    var lastname = req.body.lastName;
    User.find({firstName: firstname, lastName: lastname}, function(err, user){
        if(user.length == 0){
            console.log("user not found");
            res.status(204).send("User not found");
        }else{
            currentId = user[0]._id;
            res.json(user);
        }
        
    })
};

// finds all users
function findAll(req, res){
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

// saves a user
function save(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    User.find({firstName: firstName, lastName: lastName}, function(err, user){
        if(user.length == 0){
            var newUser = new User(req.body);
            newUser.save(function(err, user){
            if(err){
                res.send(err);
            }
            res.redirect('http://exercise.vinstonguillaume.com');

            });
        }else{
            res.sendFile(path.join(__dirname + '/dupUser.html'));
        }
    })

};

// updates user
function updateUser(req, res){
    User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, user){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
};

// deletes user
function deleteById(req, res){
    User.remove({
        _id: req.params.userId
    }, function(err, user){
        if(err){
            res.send(err);
        }
        res.redirect('http://exercise.vinstonguillaume.com');
    });
};

// creates an exercise
function createExercise(req, res){
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

// gets photos
function getPhotos(req, res){
   User.findById(req.params.userId, 'PhotoList.fileName', function(err, user){
       if(err){
           res.send(err);
       }
       var array = new Array();
       var i;
       for (i in user.PhotoList) {
        var x = user.PhotoList[i];
        console.log(x.fileName);
        if(x.fileName != null){
            array.push(x.fileName);
        }
        
    }
       res.json(array);
       
   });
   
};

// save file name
function saveFileName(file_name, req, res ){
    var fileName = {fileName: file_name};

    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$push: {PhotoList: fileName}},
        function(err, user){
            if(err){
                console.log(err);
            }
            res.redirect('http://exercise.vinstonguillaume.com');
        }
    );
    
};


// save file name
function saveFileNameById(file_name, req, res ){
    var fileName = {fileName: file_name};
    User.findOneAndUpdate(
        {_id: currentId},
        {$push: {PhotoList: fileName}},
        function(err){
            if(err){
                console.log(err);
            }
            res.redirect('http://exercise.vinstonguillaume.com');
            
        }
    );
    
};

// deltes a photo
function deletePhoto(req, res){
    const filename = req.body.name;
    console.log(filename);
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

// gets user exercises
function getUserExercises(req, res){
    User.findById(req.params.userId, function(err, user){
        if(err){
            res.send(err);
        }
    });
    
}

function autoComplete(req, res){
    var exercises = new Array();
    var output = new Array();
    var search = req.params.search.toLowerCase();
   
        var usersProtection = {
            __v: false,
            PhotoList: false
            
        };
    
        User.find({}, usersProtection, function(err, user){
            if(err){
                res.send(err);
            }
            //console.log(user);
            
            for(var i = 0; i < user.length - 1; i++){

                if(user[i].ExerciseList.length != null && user[i] != null){
                    for(var j = 0; j < user[i].ExerciseList.length; i++){
                        if(!exercises.includes(user[i].ExerciseList[j].name.trim().toLowerCase())){
                            exercises.push(user[i].ExerciseList[j].name.trim().toLowerCase());
                        }
                        
                        
                    }
                   
                }
                

            }
      
            for(var i = 0; i < exercises.length; i++){
                if(exercises[i].includes(search)){
                    console.log(exercises[i]);
                    output.push(exercises[i]);
                }
                
            }

            res.send(output);
            
        });


    
   
}

module.exports = {
    findById, 
    findAll, 
    save, 
    deleteById,
    getPhotos,
    createExercise,
    updateUser,
    saveFileName,
    deletePhoto,
    getUserExercises,
    findUser,
    saveFileNameById,
    findByIdParam,
    autoComplete
}
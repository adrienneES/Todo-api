const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const todos = [{
    text: 'first todo', _id: new ObjectID()},
    {text: 'second todo', completed: true, completedAt: 123, _id: new ObjectID()}];
const users = [{
    name: 'adri', _id: new ObjectID()}, 
    {name: 'paul', _id: new ObjectID()
}];


beforeEach((done)=>{
    Todo.remove({})
    .then(()=>Todo.insertMany(todos))
    .then(()=>{
        return User.remove({})
    })
    .then(()=>User.insertMany(users))
    .then(()=>done());
});
describe('/PATCH /users/:id', ()=>{
    // it('should update valid user', (done)=>{
    //     const id = users[0]._id.toHexString();
    //     const name = 'abc';
    //     request(app)
    //         .patch(`/users/${id}`)
    //         .send({name})
    //         .expect(200)
    //         .end((err, res)=>{
    //             if(err) {
    //                 return done(err);
    //             }
    //             User.findById(id).then((user)=>{
    //                 expect(user.name).toBe(name);
    //                 done();
    //             }).catch((err)=>done(err));
    //         });
        
    // })
    // it('should return 404 for not found user', (done)=>{
    //     request(app)
    //         .patch('/users/'+new ObjectID().toHexString())
    //         .send({name:'a'})
    //         .expect(404)
    //         .end(done);
        
    // })
    it('should return 400 for invalid id', (done)=>{
        request(app)
            .patch('/users/aa')
            .expect(400)
            .end(done);        
    })
})
// describe('/GET users', ()=>{
//     it('should return all users', (done)=>{
//         request(app)
//         .get('/users')
//         .expect(200)
//         .expect((res)=>{
//             console.log(res.body);
//         })
//         .end(done);
//     })
// })
describe ('/POST users', ()=>{
    // it('should create a user with good data', (done)=>{
    //     request(app)
    //     .post('/users')
    //     .send({name:'aaa'})
    //     .expect(200)
    //     .expect((res)=>{
    //         expect(res.body.name).toBe('aaa');
    //     })
    //     .end((err, res)=>{
    //         if (err) {
    //             return done(err);
    //         }
    //         User.find({}).then((users)=>{
    //             console.log(`count: ${users.length}`);
    //             expect(users.length).toBe(3);
    //             done();
    //         }).catch((err)=>{
    //             done(err);
    //         })
    //     });
    // })
    // it('should not create a user with invalid data', (done)=>{
    //     request(app)
    //         .post('/users')
    //         .send({nae: '  a   '})
    //         .expect(400)
    //         .end((err, res)=>{
    //             if(err) {
    //                 return done(err);
    //             }
    //             User.find({}).then((users)=>{
    //                 expect(users.length).toBe(2);
    //                 done();
    //             })
    //             .catch((err)=>done(err));
    //         });        
    // })
})
describe('GET /users/id', ()=>{
    // it ('should get a valid user', (done)=>{
    //     const id = users[0]._id.toHexString();
    //     request(app)
    //         .get(`/users/${id}`)
    //         .expect(200)
    //         .expect((res)=>{
    //             expect(res.body.user.name).toBe(users[0].name);
    //         })
    //         .end(done);        
    // })
    // it ('should not get an invalid user', (done)=>{
    //     const id = new ObjectID().toHexString();
    //     request(app)
    //         .get(`/users/${id}`)
    //         .expect(404)
    //         .end(done);    
    // })
})
describe ('DELETE /users/id', ()=>{
    // it('should delete a valid user', (done)=>{
    //     const id = users[0]._id.toHexString();
    //     const str = users[0].name;
    //     request(app)
    //         .delete(`/users/${id}`)
    //         .expect(200)
    //         .expect((res)=>{
    //             expect(res.body.user.name).toBe(str);
    //         })
    //         .end((err, res)=>{
    //             if(err) {
    //                 return done(err)
    //             }
    //             User.find({}).then((users)=>{
    //                 expect(users.length).toBe(1);
    //                 done();
    //             }).catch((err)=>done(err))
    //         });
    // })
    // it('should not delete a not found user', (done)=>{
    //     request(app)
    //         .delete('/users/'+new ObjectID().toHexString())
    //         .expect(404)
    //         .end(done);        
    // })
    // it('should not delet with invalid id', (done)=>{
    //     request(app)
    //         .delete('/users/a')
    //         .expect(400)
    //         .end(done);        
    // })
});
// describe('GET /todos', ()=>{
//     it('should get todos', (done)=>{
//         request(app)
//         .get('/todos')
//         .expect(200)
//         .expect((res)=>{
//             expect(res.body.todos.length).toBe(2);
//         })
//         .end(done);
//     });
// });
// describe ('POST /todos', ()=>{
//     it('should create a new todo', (done)=>{
//         var text = 'test todo text';

//         request(app)
//         .post('/todos')
//         .send({text})
//         .expect(200)
//         .expect((res)=>{
//             expect(res.body.text).toBe(text);
//         })
//         .end((err, res)=>{
//             if(err){
//                 return done(err);
//             }
//             Todo.find({text}).then((todos)=>{
//                 expect(todos.length).toBe(1);
//                 done();
//             })
//             .catch((err)=>done(err));
//         });
//     });
//     it('should not create todo with invalid data', (done)=>{
//         request(app)
//         .post('/todos')
//         .send({})
//         .expect(400)
//         .end((err, res)=>{
//             if (err) {return done(err);}
//             Todo.find({})
//             .then((todos)=>{
//                 expect(todos.length).toBe(2);
//                 done();
//             })
//             .catch((err)=>{done(err)});
//         });
//     })
// });
// describe('GET /todos/:id', ()=>{
//     it('should check for bad objectID', (done)=>{
//         request(app)
//         .get('/todos/1a')
//         .expect(404)
//         .expect((res)=>{
//             expect(res.text).toBe('bad id');
//         })
//         .end(done);
//     });
//     it('should return not found for not found id', (done)=>{
//         request(app)
//         .get(`/todos/${new ObjectID().toHexString()}`)
//         .expect(404)
//         .expect((res)=>{
//             expect(res.text).toBe('not found');
//         })
//         .end(done);
//     });
//     it('should return todo doc', (done)=>{
//         request(app)
//         .get(`/todos/${todos[1]._id.toHexString()}`)
//         .expect(200)
//         .expect((res)=>{
//             expect(res.body.todo.text).toBe(todos[1].text);
//         })
//         .end(done);
//     });
// });
// describe('DELETE /todos:id', ()=>{
//     it('should delete a valid todo', (done)=>{
//         var hexId  = todos[0]._id.toHexString();
//         const todoText = todos[0].text;
//         request(app)
//         .delete(`/todos/${hexId}`)
//         .expect(200)
//         .expect((res)=>{
//             console.log(res.body);
//             expect(res.body.todo.text).toBe(todoText);
//         })
//         .end((err, res)=>{
//             if(err){
//                 return done(err);
//             }
//             Todo.findById(hexId).then((todo)=>{
//                 expect(todo).toBe(null);
//                 done();
//             }).catch((err)=>{done(err);});
//         });
//     });
//      it('should return 404 if todo not found', (done)=>{
//          request(app)
//          .delete('/todos/delete/'+new ObjectID().toHexString())
//          .expect(404)
//          .end(done);
//     });
//     it('should return 400 if objectid is invalid', (done)=>{
//         request(app)
//             .delete('/todos/a')
//             .expect(400)
//             .end(done);
//     });
// })
describe('PATCH /todos/id', ()=>{
    // it('should update with valid data', (done)=>{
    //     const id = todos[0]._id.toHexString();
    //     const text = 'a';
    //     request(app)
    //         .patch(`/todos/${id}`)
    //         .send({text, completed:true})
    //         .expect(200)
    //         .expect((res)=>{
    //             expect(res.body.todo.completed).toBe(true)
    //             expect(res.body.todo.text).toBe(text);
    //             expect(res.body.todo.completedAt).toBeA('number');
    //         })
    //         .end((err, req)=>{
    //             if (err) {
    //                 done(err);
    //             }
    //             Todo.findById(id).then((todo)=>{
    //                 expect(todo.completed).toBe(true);
    //                 done();
    //             }).catch((err)=>done(err));
    //         });
    // })
    // it('should remove completedAt when todo is not completed', (done)=>{
    //     const id = todos[1]._id.toHexString();
    //     request(app)
    //         .patch(`/todos/${id}`)
    //         .send({completed:false})
    //         .expect(200)
    //         .expect((res)=>{
    //             expect(res.body.todo.completed).toBe(false);
    //             expect(res.body.todo.completedAt).toBe(null);
    //         })
    //         .end((err, res)=>{
    //             Todo.findById(id).then((todo)=>{
    //                 expect(todo.completed).toBe(false);
    //                 done();
    //             }).catch((err)=>{done(err)})
    //         })
    // })
})

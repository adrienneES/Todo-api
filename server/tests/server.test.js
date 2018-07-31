const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed');

beforeEach(populateUsers); 
beforeEach(populateTodos); 
describe('users', ()=>{
describe ('POST /users/login', ()=>{
    it('should login user and return auth token', (done)=>{
        request(app)
            .post('/users/login')
            .send ({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res)=>{
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[1]).toInclude({
                        access:'auth',
                        token:res.headers['x-auth']
                    })
                    done();
                }).catch((err)=>done(err))
            })

    });
    it('should reject invalid login', (done)=>{
        request(app)
            .post('/users/login')
            .send ({
                email: users[1].email,
                password: 'abc'
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBe(undefined);
            })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((err)=>done(err));
            });

    })
})
describe('DELETE /users/me/token', ()=>{
    it('should log off a validated user',(done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res)=>{
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err)=>done(err));
            })
    });
});
describe('GET /users/me', ()=>{
    it ('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                console.log(res.body);
                expect(res.body.user._id).toBe(users[0]._id.toHexString())
                expect(res.body.user.email).toBe(users[0].email);
            }) 
            .end(done)
    });
    it ('should return 401 if not authenticated', (done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body.user).toBe(undefined)
        })
        .end(done);
    });
});
describe ('/POST users', ()=>{
    it('should create a user with good data', (done)=>{
        const email = 'callie@callie.com';
        let password = 'abc122'
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            User.find({email}).then((users)=>{
                console.log(`count: ${users.length}`);
                expect(users.length).toBe(1);
                done();
            }).catch((err)=>{
                done(err);
            })
        });
    })
    it('should not create a user with invalid data', (done)=>{
        request(app)
            .post('/users')
            .send({name: '  a   '})
            .expect(400)
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }
                User.find({}).then((users)=>{
                    expect(users.length).toBe(2);
                    done();
                })
                .catch((err)=>done(err));
            });        
    })
    it('should not create user if email in use', (done)=>{
        request(app)
        .post('/users')
        .send({email:users[0].email})
        .expect(400)
        .expect((res)=>{
            expect(users.length).toBe(2);
        })
        .end(done);
    })
});
});

describe('todos', ()=>{
    describe ('POST /todos', ()=>{
        it('should create a new todo', (done)=>{
            var text = 'test todo text';
    
            request(app)
            .post('/todos')
            .send({text})
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    done();
                })
                .catch((err)=>done(err));
            });
        });
        it('should not create todo with invalid data', (done)=>{
            request(app)
            .post('/todos')
            .send({})
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end((err, res)=>{
                if (err) {return done(err);}
                Todo.find({})
                .then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                })
                .catch((err)=>{done(err)});
            });
        });
        // it('should not create a todo if user not logged in', (done)=>{
        it('should not create a todo if user not logged in', (done)=>{
            request(app)
                .post('/todos')
                .send({text:'something'})
                .expect(401)
                .end(done);
        });
    });
    
describe('GET /todos', ()=>{
    it('should get todos', (done)=>{
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});
describe('GET /todos/:id', ()=>{
    it('should check for bad objectID', (done)=>{
        request(app)
        .get('/todos/1a')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .expect((res)=>{
            expect(res.text).toBe('bad id');
        })
        .end(done);
    });
    it('should return not found for not found id', (done)=>{
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .expect((res)=>{
            expect(res.text).toBe('not found');
        })
        .end(done);
    });
    it('should return todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200) 
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
    it('should not return other users data', (done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })
});
describe('DELETE /todos:id', ()=>{
    it('should delete a valid todo', (done)=>{
        var hexId  = todos[1]._id.toHexString();
        const todoText = todos[1].text;
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            console.log(res.body);
            expect(res.body.todo.text).toBe(todoText);
        })
        .end((err, res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBe(null);
                done();
            }).catch((err)=>{done(err);});
        });
    });
     it('should return 404 if todo not found', (done)=>{
         request(app)
         .delete('/todos/delete/'+new ObjectID().toHexString())
         .set('x-auth', users[0].tokens[0].token)
         .expect(404)
         .end(done);
    });
    it('should return 400 if objectid is invalid', (done)=>{
        request(app)
            .delete('/todos/a')
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });
    it('should not delete a todo from dift user', (done)=>{
        request(app)
            .delete(`/todos/${todos[0]._id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(400)
            .end(()=>{
                Todo.find({_id:todos[0]._id}).then((todo)=>{
                    expect(todo.length).toBe(1);
                    done();
                }).catch((err)=>done(err))
            });
    });
});
describe('PATCH /todos/id', ()=>{
    it('should update with valid data', (done)=>{
        const id = todos[0]._id.toHexString();
        const text = 'a';
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed:true})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, req)=>{
                if (err) {
                    done(err);
                }
                Todo.findById(id).then((todo)=>{
                    expect(todo.completed).toBe(true);
                    done();
                }).catch((err)=>done(err));
            });
    })
    it('should remove completedAt when todo is not completed', (done)=>{
        const id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({completed:false})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end((err, res)=>{
                Todo.findById(id).then((todo)=>{
                    expect(todo.completed).toBe(false);
                    done();
                }).catch((err)=>{done(err)})
            })
    });
    it('should not update todo for dift user', (done)=>{
        const id = todos[0]._id.toHexString();
        const text = 'a';
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed:true})
            .expect(404)
            .end((err, req)=>{
                if (err) {
                    done(err);
                }
                Todo.findById(id).then((todo)=>{
                    expect(todo.completed).toBe(false);
                    done();
                }).catch((err)=>done(err));
            });
    })
})
});
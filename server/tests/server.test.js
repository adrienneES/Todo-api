const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {app} = require('./../server');

const todos = [{text: 'first todo', _id: new ObjectID()},
{text: 'second todo', _id: new ObjectID()}]

beforeEach((done)=>{
    Todo.remove({})
    .then(()=>Todo.insertMany(todos))
    .then(()=>done());
    
})
describe('GET /todos', ()=>{
    it('should get todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});
describe ('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        var text = 'test todo text';

        request(app)
        .post('/todos')
        .send({text})
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
//                expect(todos[2].text).toBe(text);
                done();
            })
            .catch((err)=>done(err));
        });
    });
    it('should not create todo with invalid data', (done)=>{
        request(app)
        .post('/todos')
        .send({})
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
    })
});
describe('GET /todos/:id', ()=>{
    it('should return todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[1].text);
        })
        .end(done);
    });
    it('should check for bad objectID', (done)=>{
        request(app)
        .get('/todos/1a')
        .expect(404)
        .expect((res)=>{
            expect(res.text).toBe('bad id');
        })
        .end(done);
    })
    it('should return not found for not found id', (done)=>{
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .expect((res)=>{
            expect(res.text).toBe('not found');
        })
        .end(done);
    })
})
const expect = require('expect');
const request = require('supertest');

const {Todo} = require('./../../models/todo');
const {app} = require('./../server');

const todos = [{text: 'first todo'},
{text: 'second todo'}]

beforeEach((done)=>{
    Todo.remove({})
    .then(()=>{
        Todo.insertMany(todos);
        done()});
    
})
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
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(3);
                expect(todos[2].text).toBe(text);
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

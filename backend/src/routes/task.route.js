
import express from 'express' ;
import {verifyToken} from '../utils/verifyUser.js'
import { createNewTask,getAllTask,updateTask,deleteTask } from '../controllers/task.controller.js';

const taskRouter = express.Router();

taskRouter.post('/create',verifyToken,createNewTask);
taskRouter.get('/all',verifyToken,getAllTask);
taskRouter.put('/update/:id',verifyToken,updateTask);
taskRouter.delete('/delete/:id',verifyToken,deleteTask);


export default taskRouter;
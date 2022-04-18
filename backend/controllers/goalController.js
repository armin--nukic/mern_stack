// new branch

const asyncHandler = require('express-async-handler')

const Goal = require('../models/GoalModel')
const User = require('../models/UserModel')
// @desc Get Goals
// @route GET /api/goals
// @access Private

const { json } = require("express/lib/response")

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })
    
    res.status(200).json(goals)
 
})

// @desc Get Goals
// @route POST /api/goals
// @access Private

const setGoal = asyncHandler( async (req, res) => {
    if (!req.body.text){
        res.status(400)
        throw new Error("PLease provide text")
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(201).json(goal)
 
})

// @desc Update Goals
// @route PUT /api/goals/:id
// @access Private

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    //Check for user
    if(!user){
        res.status(401)
        throw new Error ('USer not found')
    }

    //make sure the looged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error ('USer not authirized')

    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true, 
        })
    
    res.status(200).json(updatedGoal)
 
})

// @desc DELETE Goals
// @route DELETE /api/goals/:id
// @access Private

const deleteGoal = asyncHandler( async (req, res) => {
   
   const goal = await Goal.findById(req.params.id)

   if(!goal){
    res.status(400)
    throw new Error('Goal not found')
}


const user = await User.findById(req.user.id)

//Check for user
if(!user){
    res.status(401)
    throw new Error ('USer not found')
}

//make sure the looged in user matches the goal user
if(goal.user.toString() !== user.id){
    res.status(401)
    throw new Error ('USer not authirized')

}


    await goal.remove()

    res.status(200).json({id: req.params.id})
 
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
}
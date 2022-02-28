// new branch

const asyncHandler = require('express-async-handler')

const Goal = require('../models/GoalModel')
// @desc Get Goals
// @route GET /api/goals
// @access Private

const { json } = require("express/lib/response")

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find()
    
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
        text: req.body.text
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


    await goal.remove()

    res.status(200).json({id: req.params.id})
 
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
}
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const methodOveride = require('method-override');
const Food = require('./models/food.js');
app.use(express.urlencoded({ extended: false }));
app.use(methodOveride("_method"));
app.use(morgan("dev"));

app.get("/", async (req, res) => {
    res.render('index.ejs');
});
app.get("/foods", async (req, res) => {
    const allFoods = await Food.find();
    console.log(allFoods);
    res.render("foods/index.ejs", {  foods: allFoods });
});

app.get("/foods/new", (req, res) => {
    res.render("foods/new.ejs");
  });

//app.post("/foods", async (req, res) => {
   // console.log(req.body);
   // res.redirect("/foods/new");
 // });
 app.get("/foods/:foodId", async (req,res) =>{
    const foodId = req.params.foodId;
const foundFood = await Food.findById(foodId);
    res.render("foods/show.ejs", { food: foundFood });
 });
 app.delete("/foods/:foodId", async (req, res) => {
    const foodId = req.params.foodId;
    await Food.findByIdAndDelete(foodId);
    res.redirect("/foods");
 });
 app.get("/foods/:foodId/edit", async (req,res) =>{
    const foundFood = await Food.findById(req.params.foodId);
    res.render("foods/edit.ejs", {
        food: foundFood,
      });
    });
    app.put("/foods/:foodId", async (req, res) => {
        const foodId = req.params.foodId;
        if (req.body.isReadyToServe === "on") {
            req.body.isReadyToServe = true;
          } else {
            req.body.isReadyToServe = false;
          }
          await FoodId.findByIdAndUpDate(foodId, req.body);
          res.redirect(`/foods/${foodId}`);
    });

app.post("/foods", async (req, res) => {
    if (req.body.isReadyToServe === "on") {
      req.body.isReadyToServe = true;
    } else {
      req.body.isReadyToServe = false;
    }
    await Food.create(req.body);
    res.redirect("/foods");
  });
  
  
 



app.listen(3000,() => {
    console.log('connecting on port 3000');
});
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log("connected to MONGODB_URI");
});
app.listen(process.env.PORT, async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB Atlas");
    } catch (e) {
      console.error("A problem occured connecting", e);
    }
});
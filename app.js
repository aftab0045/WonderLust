const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");

const Mongoose_URL = "mongodb://localhost:27017/wonderlust";

main()
.then(() =>{
    console.log("Connected to DBs");
})
.catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongoose_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Index Route
app.get("/listings", async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

// New Route
app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
})

//create Route
app.post("/listings",async (req,res) =>{
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
     
})

//Edit Route
app.get("/listings/:id/edit",async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

// Update Route
app.put("/listings/:id" ,async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// Delete Route
app.delete("/listings/:id",async (req,res) =>{
    let {id} = req.params;
    const deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
})

// Show Route
app.get("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})



// app.get("/testListing", async (req,res) =>{
//     const SampleListing = new Listing({
//         title : "My Villa",
//         description : "This is my Villa",
//         price : 20000,
//         location : "Pune",
//         country : "India"
//     });

//     await SampleListing.save();
//     console.log("Data Saved ");
//     res.send("Successfull Testing ...");
// })

app.get("/", (req,res) =>{
    res.send("Hello World !");
})

app.listen(8080, ()=>{
    console.log("App listening !!");
})
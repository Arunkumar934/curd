const express = require("express");
const cors = require("cors");
const users = require("./sample.json")
// Fs use this package if overwrite any datas in Database
const fs = require("fs");

const app = express();
app.use(express.json());
const port = 8000;



// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"]
}));

// Routes
// Get all users
app.get("/users", (req, res) => {
    return res.json(users);
});

// Delete a user
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

   // Filter out the user
  const filteredUsers = users.filter((user) => user.id !== id);

  // Check if user was found and deleted
  if (filteredUsers.length === users.length) {
    return res.status(404).json({ error: "User not found" });
  }
  

  // Write updated data to the file
  fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send success response
    return res.status(200).json({ message: "User deleted successfully", users: filteredUsers });
  });

});


//Post Users

app.post("/users/",(req,res)=>{
  let {name,age,city}= req.body;
  if(!name || !age || !city){
 res.status(400).send({message:"All Fields Required"})
  }
  let id = Date.now();
  users.push({id,name,age,city});

  fs.writeFile("./sample.json", JSON.stringify(users), (err,data) => {
   return res.json({message:"User detailed added success"});
});
});


// Start server
app.listen(port, (err) => {
    if(err){
        console.log("Server has a Fault")
    }
    else{
    console.log(`Server running on port ${port}`);
}});

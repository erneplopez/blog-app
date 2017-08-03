

//APP CONFIG
var express=require("express"),
    mongoose=require("mongoose"),
    bodyParser=require("body-parser"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer"),
    app=express();


//CONNECTING TO MONGO
mongoose.connect("mongodb://localhost/blog-app");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine","ejs");


//MONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

//RESTFul Routes


app.get("/",function(req,res){
    res.redirect("/blogs");
})

//INDEX ROUTES
app.get("/blogs",function(req,res){
    Blog.find({},function(err,foundedBlogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{foundedBlogs:foundedBlogs})
        }
    })
})
//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
})
//CREATE ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    })
    
})
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:blog});
        }
    })
    
})
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect("/blogs");
        }
        else{
             res.render("edit",{blog:blog})
        }
    })
   
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
     req.body.blog.body=req.sanitize(req.body.blog.body);
     Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err){
        if(err){
            res.redirect("/blogs");
            
        }
        else{
             res.redirect("/blogs");
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
             res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})

app.listen(3000,"127.0.0.1",function() {

});
var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser')
var socketIO = require('socket.io')
var app = express()
var http = require('http')
var server = http.Server(app);
var io = socketIO(server);
server.listen(5000); //port สำหรับ socket.io unity => server


var mongoose = require('mongoose')
var Schema = mongoose.Schema //สร้าง database ชื่อ playerSchema
var playerSchema = new Schema(
    {
       
        name: String, //ตั้ง key ชื่อ name ,type เป็น string
        score: Number //ตั้ง key ชื่อ score ,type เป็น number
    }
);

mongoose.connect('mongodb://localhost:27017/gamedb1',{ useFindAndModify: false }); //mongoose เชื่อมต่อฐานข้อมูล

var Player = mongoose.model('Player',playerSchema,'player'); //สร้างโมเดลไว้ใช้งานสำหรับ GET PUT DELETE POST


var app = express() //เปิดใช้งาน Express

app.use(bodyParser.urlencoded({extended:false})) // ใช้การแปลง string กับ json
app.use(bodyParser.json()) // ใช้การแปลง string กับ json



io.on("connection", (socket)=>{  //เปิด Eventเมื่อ cilent เชื่อมต่อมาที่เซิฟเวอร์

    console.log("client connected : "+socket.id); //server แสดง log ขึ้นมาว่ามี Cilent เชื่อมต่อ และมี id อะไร

   
    socket.on("disconnect", ()=>{ //เปิด Eventเมื่อ cilent ตัดการเชื่อมต่อจากเซิฟเวอร์

        console.log("client disconnected : "+socket.id); //server แสดง log ขึ้นมาว่ามี Cilent ตัดการเชื่อมต่อ และมี id อะไร

        
    });

    socket.emit('usersID') //ส่งevent ที่ชื่อ usersID เพื่อให้ Cilent รู้ว่า ID ตัวเองคืออะไร
});

app.post('/player/register',function(req,res){ //สร้างข้อมูลที่ได้รับจาก Cilent 

    var p = req.body            //สร้างตัวแปร p สำหรับเป็นตัวหลักของข้อมูล
    console.log(req.body)
    Player.init()
    var player = new Player({ //สร้างตัวแปร player สำหรับรับข้อมูล
        
        name:p.name,            //สร้างตัวแปร name เป็นตัวย่อยของ p
        score:p.score,          //สร้างตัวแปร score เป็นตัวย่อยของ p
        
    });

    player.save(function(err){  //ทำการบันทึกลงฐานข้อมูล
        if(err){                //หากมี error ให้แสดง error
            console.log(err);
        }
        console.log('_id Users is '+player._id); //แสดง log ไอดีของ player ที่เข้ามา
    });
    
    io.emit('userID', player); //ส่งข้อมูล player ไปหา cilent


    
    res.end('{"ok":1}')   //หากสำเร็จให้ขึ้นโชว์ที่ postman เป็น json ว่า {"ok":1}
});

app.put('/player/register/:id',async (req, res)=>{ //อัพเดตข้อมูลผ่าน ID ของข้อมูล
    const payload = req.body
    const { id } = req.params
    

  try {
    const player = await Player.findByIdAndUpdate(id, { $set: payload }) //ทำการค้นหาจาก ID ที่ได้รับ
    res.json(player)
    console.log(player._id);
  } catch (error) {
    res.status(400).json(error)
    
  }
  
})





app.listen(8080,function(){             //port ของ express
    console.log('Server running')
});

console.log('start server')
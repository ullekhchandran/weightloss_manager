var express= require('express');
var router= express.Router();
const Weight= require('../models/weightModel');


router.get('/',(req,res)=>{


    res.render('weightAjax',{email:"email"})

   
});



router.post('/create_weight', (req, res) => {
    const {weight,date} = req.body;

    
 const newWeight = new Weight({
        weight,
        date
    });
    console.log(date)
    const validationError = newWeight.validateSync();
  const idates= new Date(date)
console.log(typeof(idates))

var d=0  
    Weight.find().select('date').then(data => {
        const dates = data.map(item => item.date);

        
        for (let i=0;i<dates.length;i++){
            console.log(d)
            
            
            if(dates[i].getDate() == idates.getDate() && dates[i].getMonth()== idates.getMonth() ){
                d=d+1
                console.log('hellow')
                
            }
        }




        if (d!=0){
          console.log("alray update the today")
          res.render("entererror",{message:"already updated"})

        

        }
        else{
            console.log('the data not is  here')

            newWeight.save()
            .then(() => {
                res.status(201).json({ message: 'weight created successfully' });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Server Error' });
            });
    
           
        }
        
        console.log(d)
        console.log(dates);



    }).catch(error => {
        console.error('Error fetching data:', error);
    });

    
console.log("qerqw")

    

  if (validationError) {
        return res.status(400).json({ error: validationError.errors });
    }
 
    

});

router.get('/retrieve_weight', (req, res) => {
    
    
    
 Weight.find({}, '-__v')
        .then(weight_list => {
            res.json(weight_list);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});


router.post('/update_weight/:id',(req,res)=>{
    const weightsId=req.params.id;
    const{weight,date}=req.body;
    

    const updatedWeight= new Weight({weight,date});
    const validationError=updatedWeight.validateSync();

    if(validationError){

        res.status(400).json({error: validationError.errors});
     } else{

        Weight.findByIdAndUpdate(weightsId,{weight,date})
        .then(()=>{
            res.status(200).json({message:"weight updated successfully"})
        })
    
        .catch(error=>{
            console.error(error);
            res.status(500).json({message:"Internal server error"})
        })
    
     }
});

router.post('/delete_weight/:id',(req,res)=>{
    const weightsId=req.params.id;
    Weight.findByIdAndDelete(weightsId)
    .then(()=>{
        res.json({message:' weight deleted successfully'});
    })
    .catch(error=>{

        console.error(error);
        res.status(500).json({error:'Internal server error'})
    });
})



router.post('/calculate_weight',(req,res)=>{
        
   
        
        const {firstdate,seconddate}= req.body;

        Weight.find({$or:[{date:firstdate},{date:seconddate}]}, '-__v').sort({date:1})
         
    
        
        .then(data => {
            res.json(data);
            console.log(data)
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});



module.exports=router;


